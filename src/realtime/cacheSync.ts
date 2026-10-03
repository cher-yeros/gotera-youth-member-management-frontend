import type {
  ApolloCache,
  ApolloClient,
  DocumentNode,
  Reference,
  StoreObject,
} from "@apollo/client";
import { gql } from "@apollo/client";
import { GET_MY_UNREAD_ANNOUNCEMENT_COUNT } from "@/graphql/operations";

export type ChangeAction = "CREATED" | "UPDATED" | "DELETED";

export interface EntityChange<T = Record<string, unknown>> {
  action: ChangeAction;
  id: number;
  entity?: T | null;
}

/** How this entity appears under ROOT_QUERY list fields. */
export type ListFieldTarget = {
  /** Query field name on ROOT_QUERY (e.g. "members", "families"). */
  field: string;
  /**
   * Nested array key inside a paginated object.
   * Omit when the field itself is a Reference[].
   */
  nestedKey?: string;
};

const FOLLOW_UP_CONTACT_MINI = gql`
  fragment FollowUpContactMini on FollowUpContact {
    id
    case_id
    contact_type
    outcome
    notes
    contacted_at
    next_follow_up_at
    recorded_by
    createdAt
  }
`;

function isPageOneOrUnpaged(storeFieldName: string): boolean {
  const pageMatch = storeFieldName.match(/"page"\s*:\s*(\d+)/);
  if (!pageMatch) return true;
  return Number(pageMatch[1]) === 1;
}

function refsIncludeId(
  refs: readonly Reference[] | undefined,
  id: number,
  readField: (field: string, ref: Reference) => unknown,
): boolean {
  if (!refs?.length) return false;
  return refs.some((ref) => readField("id", ref) === id);
}

function prependRef(
  refs: readonly Reference[] | undefined,
  ref: Reference,
): Reference[] {
  return [ref, ...(refs || [])];
}

function removeIdFromRefs(
  refs: readonly Reference[] | undefined,
  id: number,
  readField: (field: string, ref: Reference) => unknown,
): Reference[] | undefined {
  if (!refs) return refs;
  return refs.filter((ref) => readField("id", ref) !== id);
}

function insertIntoRootLists(
  cache: ApolloCache,
  entityRef: Reference,
  entityId: number,
  listFields: ListFieldTarget[],
): void {
  if (!listFields.length) return;

  const fields: Record<string, (existing: unknown, details: any) => unknown> =
    {};

  for (const target of listFields) {
    fields[target.field] = (
      existing: unknown,
      { storeFieldName, readField },
    ) => {
      if (existing == null) return existing;
      if (!isPageOneOrUnpaged(storeFieldName)) return existing;

      if (!target.nestedKey && Array.isArray(existing)) {
        if (refsIncludeId(existing as Reference[], entityId, readField)) {
          return existing;
        }
        return prependRef(existing as Reference[], entityRef);
      }

      if (
        target.nestedKey &&
        typeof existing === "object" &&
        existing !== null &&
        target.nestedKey in (existing as StoreObject)
      ) {
        const page = existing as StoreObject & {
          total?: number;
          [key: string]: unknown;
        };
        const arr = page[target.nestedKey] as Reference[] | undefined;
        if (refsIncludeId(arr, entityId, readField)) return existing;
        return {
          ...page,
          [target.nestedKey]: prependRef(arr, entityRef),
          total: typeof page.total === "number" ? page.total + 1 : page.total,
        };
      }

      return existing;
    };
  }

  cache.modify({ id: "ROOT_QUERY", fields });
}

function removeFromRootLists(
  cache: ApolloCache,
  entityId: number,
  listFields: ListFieldTarget[],
): void {
  if (!listFields.length) return;

  const fields: Record<string, (existing: unknown, details: any) => unknown> =
    {};

  for (const target of listFields) {
    fields[target.field] = (existing: unknown, { readField }) => {
      if (existing == null) return existing;

      if (!target.nestedKey && Array.isArray(existing)) {
        return removeIdFromRefs(existing as Reference[], entityId, readField);
      }

      if (
        target.nestedKey &&
        typeof existing === "object" &&
        existing !== null &&
        target.nestedKey in (existing as StoreObject)
      ) {
        const page = existing as StoreObject & {
          total?: number;
          [key: string]: unknown;
        };
        const arr = page[target.nestedKey] as Reference[] | undefined;
        const next = removeIdFromRefs(arr, entityId, readField);
        if (next === arr) return existing;
        const removed = (arr?.length || 0) - (next?.length || 0) > 0;
        return {
          ...page,
          [target.nestedKey]: next,
          total:
            removed && typeof page.total === "number"
              ? Math.max(0, page.total - 1)
              : page.total,
        };
      }

      return existing;
    };
  }

  cache.modify({ id: "ROOT_QUERY", fields });
}

/**
 * Patch Apollo cache from a subscription change payload — no network refetch.
 * - UPDATED: writeFragment (lists holding refs update in place)
 * - CREATED: writeFragment + prepend into configured list fields
 * - DELETED: strip from lists + evict
 */
export function applyEntityChange(
  client: ApolloClient,
  opts: {
    typename: string;
    change: EntityChange;
    fragment: DocumentNode;
    fragmentName: string;
    entity?: Record<string, unknown> | null;
    listFields?: ListFieldTarget[];
  },
): void {
  const { cache } = client;
  const entity = opts.entity ?? opts.change.entity ?? null;
  const id = opts.change.id;
  const listFields = opts.listFields || [];

  if (opts.change.action === "DELETED") {
    removeFromRootLists(cache, id, listFields);
    const cacheId = cache.identify({ __typename: opts.typename, id });
    if (cacheId) {
      cache.evict({ id: cacheId });
      cache.gc();
    }
    return;
  }

  if (!entity || typeof entity !== "object" || !("id" in entity)) {
    return;
  }

  let entityRef: Reference | undefined;
  try {
    const written = cache.writeFragment({
      id: cache.identify({
        __typename: opts.typename,
        id: entity.id as number,
      }),
      fragment: opts.fragment,
      fragmentName: opts.fragmentName,
      data: { __typename: opts.typename, ...entity } as any,
    });
    entityRef =
      typeof written === "string"
        ? ({ __ref: written } as Reference)
        : (written as Reference | undefined);
  } catch {
    const identified = cache.identify({
      __typename: opts.typename,
      id: entity.id as number,
    });
    if (identified) {
      entityRef = { __ref: identified } as Reference;
    }
  }

  if (opts.change.action === "CREATED" && entityRef) {
    insertIntoRootLists(cache, entityRef, id, listFields);
  }
}

/** Append a contact onto a cached FollowUpCase.contacts array. */
export function appendFollowUpContact(
  client: ApolloClient,
  contact: Record<string, unknown> & { id: number; case_id: number },
): void {
  const { cache } = client;
  let contactRef: Reference | undefined;
  try {
    const written = cache.writeFragment({
      id: cache.identify({ __typename: "FollowUpContact", id: contact.id }),
      fragment: FOLLOW_UP_CONTACT_MINI,
      fragmentName: "FollowUpContactMini",
      data: { __typename: "FollowUpContact", ...contact } as any,
    });
    contactRef =
      typeof written === "string"
        ? ({ __ref: written } as Reference)
        : (written as Reference | undefined);
  } catch {
    return;
  }

  const caseCacheId = cache.identify({
    __typename: "FollowUpCase",
    id: contact.case_id,
  });
  if (!caseCacheId || !contactRef) return;

  cache.modify({
    id: caseCacheId,
    fields: {
      contacts(existing: readonly Reference[] = [], { readField }) {
        if (refsIncludeId(existing, contact.id, readField)) return existing;
        return [...existing, contactRef as Reference];
      },
    },
  });
}

/** Prepend an activity into cached activity lists. */
export function prependActivity(
  client: ApolloClient,
  activity: Record<string, unknown> & { id: number },
  fragment: DocumentNode,
  fragmentName: string,
): void {
  applyEntityChange(client, {
    typename: "Activity",
    change: { action: "CREATED", id: activity.id, entity: activity },
    entity: activity,
    fragment,
    fragmentName,
    listFields: [
      { field: "activities", nestedKey: "activities" },
      { field: "recentActivities" },
    ],
  });
}

export function writeUnreadCount(client: ApolloClient, count: number): void {
  client.cache.writeQuery({
    query: GET_MY_UNREAD_ANNOUNCEMENT_COUNT,
    data: { myUnreadAnnouncementCount: count },
  });
}
