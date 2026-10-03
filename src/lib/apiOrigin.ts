const DEV_GRAPHQL = `http://${window.location.hostname}:4000/graphql`;
const PROD_GRAPHQL = "https://gy.lelahub.com/graphql";

export function getGraphqlHttpUrl(): string {
  return import.meta.env.PROD ? PROD_GRAPHQL : DEV_GRAPHQL;
}

export function getGraphqlWsUrl(): string {
  const httpUrl = getGraphqlHttpUrl();
  if (httpUrl.startsWith("https://")) {
    return `wss://${httpUrl.slice("https://".length)}`;
  }
  if (httpUrl.startsWith("http://")) {
    return `ws://${httpUrl.slice("http://".length)}`;
  }
  return httpUrl;
}

/** Backend origin without the `/graphql` path. */
export function getApiOrigin(): string {
  return getGraphqlHttpUrl().replace(/\/graphql\/?$/, "");
}

/** Resolve a relative `/uploads/...` path (or absolute URL) for display. */
export function resolveMediaUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${getApiOrigin()}${url.startsWith("/") ? "" : "/"}${url}`;
}
