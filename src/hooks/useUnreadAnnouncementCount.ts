import { useQuery } from "@apollo/client/react";
import { GET_MY_UNREAD_ANNOUNCEMENT_COUNT } from "@/graphql/operations";

export function useUnreadAnnouncementCount() {
  const { data, loading, refetch } = useQuery(
    GET_MY_UNREAD_ANNOUNCEMENT_COUNT,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const count = (data as any)?.myUnreadAnnouncementCount ?? 0;

  return {
    count: typeof count === "number" ? count : 0,
    loading,
    refetch,
  };
}
