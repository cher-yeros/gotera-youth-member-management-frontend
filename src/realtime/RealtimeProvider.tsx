import type { ReactNode } from "react";
import { useSubscription } from "@apollo/client/react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/slices/authSlice";
import {
  ACTIVITY_CREATED_SUB,
  ACTIVITY_FRAGMENT,
  ANNOUNCEMENT_CHANGED_SUB,
  ANNOUNCEMENT_FRAGMENT,
  ATTENDANCE_CHANGED_SUB,
  CLASS_SESSION_CHANGED_SUB,
  CLASS_SESSION_FRAGMENT,
  FAMILY_CHANGED_SUB,
  FAMILY_FRAGMENT,
  FAMILY_MEETUP_CHANGED_SUB,
  FAMILY_MEETUP_FRAGMENT,
  FAMILY_MEMBER_ATTENDANCE_FRAGMENT,
  FOLLOW_UP_CASE_CHANGED_SUB,
  FOLLOW_UP_CASE_FRAGMENT,
  FOLLOW_UP_CONTACT_CHANGED_SUB,
  LOCATION_CHANGED_SUB,
  LOCATION_FRAGMENT,
  MEMBER_CHANGED_SUB,
  MEMBER_FRAGMENT,
  MINISTRY_CHANGED_SUB,
  MINISTRY_FRAGMENT,
  MY_UNREAD_ANNOUNCEMENT_COUNT_SUB,
  PROFESSION_CHANGED_SUB,
  PROFESSION_FRAGMENT,
  ROLE_CHANGED_SUB,
  ROLE_FRAGMENT,
  STATUS_CHANGED_SUB,
  STATUS_FRAGMENT,
  TEEN_ATTENDANCE_CHANGED_SUB,
  TEEN_ATTENDANCE_FRAGMENT,
  TEEN_CLASS_CHANGED_SUB,
  TEEN_CLASS_FRAGMENT,
  TEENAGER_CHANGED_SUB,
  TEENAGER_FRAGMENT,
} from "@/graphql/operations";
import {
  appendFollowUpContact,
  applyEntityChange,
  prependActivity,
  writeUnreadCount,
} from "./cacheSync";

function RealtimeSubscriptions() {
  useSubscription(MEMBER_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.memberChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Member",
        change: { action: change.action, id: change.id, entity: change.member },
        entity: change.member,
        fragment: MEMBER_FRAGMENT,
        fragmentName: "MemberFragment",
        listFields: [
          { field: "members", nestedKey: "members" },
          { field: "recentMembers" },
        ],
      });
    },
  });

  useSubscription(FAMILY_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.familyChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Family",
        change: { action: change.action, id: change.id, entity: change.family },
        entity: change.family,
        fragment: FAMILY_FRAGMENT,
        fragmentName: "FamilyFragment",
        listFields: [{ field: "families" }],
      });
    },
  });

  useSubscription(ANNOUNCEMENT_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.announcementChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Announcement",
        change: {
          action: change.action,
          id: change.id,
          entity: change.announcement,
        },
        entity: change.announcement,
        fragment: ANNOUNCEMENT_FRAGMENT,
        fragmentName: "AnnouncementFragment",
        listFields: [
          { field: "myAnnouncements", nestedKey: "items" },
          { field: "managedAnnouncements", nestedKey: "items" },
        ],
      });
    },
  });

  useSubscription(MY_UNREAD_ANNOUNCEMENT_COUNT_SUB, {
    onData: ({ client, data }) => {
      const payload = (data.data as any)?.myUnreadAnnouncementCount;
      if (!payload || typeof payload.count !== "number") return;
      writeUnreadCount(client, payload.count);
    },
  });

  useSubscription(FOLLOW_UP_CASE_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.followUpCaseChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "FollowUpCase",
        change: {
          action: change.action,
          id: change.id,
          entity: change.followUpCase,
        },
        entity: change.followUpCase,
        fragment: FOLLOW_UP_CASE_FRAGMENT,
        fragmentName: "FollowUpCaseFragment",
        listFields: [
          { field: "followUpCases", nestedKey: "items" },
          { field: "myFollowUpCases", nestedKey: "items" },
        ],
      });
    },
  });

  useSubscription(FOLLOW_UP_CONTACT_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.followUpContactChanged;
      if (!change) return;
      if (change.action === "DELETED") {
        const cacheId = client.cache.identify({
          __typename: "FollowUpContact",
          id: change.id,
        });
        if (cacheId) {
          client.cache.evict({ id: cacheId });
          client.cache.gc();
        }
        return;
      }
      if (change.contact?.case_id != null) {
        appendFollowUpContact(client, change.contact);
      }
    },
  });

  useSubscription(ACTIVITY_CREATED_SUB, {
    onData: ({ client, data }) => {
      const activity = (data.data as any)?.activityCreated;
      if (!activity) return;
      prependActivity(client, activity, ACTIVITY_FRAGMENT, "ActivityFragment");
    },
  });

  useSubscription(TEENAGER_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.teenagerChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Teenager",
        change: {
          action: change.action,
          id: change.id,
          entity: change.teenager,
        },
        entity: change.teenager,
        fragment: TEENAGER_FRAGMENT,
        fragmentName: "TeenagerFragment",
        listFields: [{ field: "teenagers", nestedKey: "teenagers" }],
      });
    },
  });

  useSubscription(TEEN_CLASS_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.teenClassChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "TeenClass",
        change: {
          action: change.action,
          id: change.id,
          entity: change.teenClass,
        },
        entity: change.teenClass,
        fragment: TEEN_CLASS_FRAGMENT,
        fragmentName: "TeenClassFragment",
        listFields: [{ field: "teenClasses" }, { field: "myTeenClasses" }],
      });
    },
  });

  useSubscription(CLASS_SESSION_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.classSessionChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "ClassSession",
        change: {
          action: change.action,
          id: change.id,
          entity: change.classSession,
        },
        entity: change.classSession,
        fragment: CLASS_SESSION_FRAGMENT,
        fragmentName: "ClassSessionFragment",
        listFields: [{ field: "classSessions", nestedKey: "sessions" }],
      });
    },
  });

  useSubscription(FAMILY_MEETUP_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.familyMeetupChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "FamilyMeetup",
        change: {
          action: change.action,
          id: change.id,
          entity: change.familyMeetup,
        },
        entity: change.familyMeetup,
        fragment: FAMILY_MEETUP_FRAGMENT,
        fragmentName: "FamilyMeetupFragment",
        listFields: [{ field: "familyMeetups", nestedKey: "meetups" }],
      });
    },
  });

  useSubscription(ATTENDANCE_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.attendanceChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "FamilyMemberAttendance",
        change: {
          action: change.action,
          id: change.id,
          entity: change.attendance,
        },
        entity: change.attendance,
        fragment: FAMILY_MEMBER_ATTENDANCE_FRAGMENT,
        fragmentName: "FamilyMemberAttendanceFragment",
        listFields: [
          { field: "familyMemberAttendances", nestedKey: "attendances" },
        ],
      });
    },
  });

  useSubscription(TEEN_ATTENDANCE_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.teenAttendanceChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "TeenAttendance",
        change: {
          action: change.action,
          id: change.id,
          entity: change.attendance,
        },
        entity: change.attendance,
        fragment: TEEN_ATTENDANCE_FRAGMENT,
        fragmentName: "TeenAttendanceFragment",
        listFields: [{ field: "teenAttendances", nestedKey: "attendances" }],
      });
    },
  });

  useSubscription(MINISTRY_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.ministryChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Ministry",
        change: {
          action: change.action,
          id: change.id,
          entity: change.ministry,
        },
        entity: change.ministry,
        fragment: MINISTRY_FRAGMENT,
        fragmentName: "MinistryFragment",
        listFields: [{ field: "ministries" }],
      });
    },
  });

  useSubscription(LOCATION_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.locationChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Location",
        change: {
          action: change.action,
          id: change.id,
          entity: change.location,
        },
        entity: change.location,
        fragment: LOCATION_FRAGMENT,
        fragmentName: "LocationFragment",
        listFields: [{ field: "locations" }],
      });
    },
  });

  useSubscription(PROFESSION_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.professionChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Profession",
        change: {
          action: change.action,
          id: change.id,
          entity: change.profession,
        },
        entity: change.profession,
        fragment: PROFESSION_FRAGMENT,
        fragmentName: "ProfessionFragment",
        listFields: [{ field: "professions" }],
      });
    },
  });

  useSubscription(ROLE_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.roleChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Role",
        change: { action: change.action, id: change.id, entity: change.role },
        entity: change.role,
        fragment: ROLE_FRAGMENT,
        fragmentName: "RoleFragment",
        listFields: [{ field: "roles" }],
      });
    },
  });

  useSubscription(STATUS_CHANGED_SUB, {
    onData: ({ client, data }) => {
      const change = (data.data as any)?.statusChanged;
      if (!change) return;
      applyEntityChange(client, {
        typename: "Status",
        change: { action: change.action, id: change.id, entity: change.status },
        entity: change.status,
        fragment: STATUS_FRAGMENT,
        fragmentName: "StatusFragment",
        listFields: [{ field: "statuses" }],
      });
    },
  });

  return null;
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      {isAuthenticated ? <RealtimeSubscriptions /> : null}
      {children}
    </>
  );
}
