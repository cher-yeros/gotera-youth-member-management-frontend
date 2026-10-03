import FullscreenModal from "@/components/ui/fullscreen-modal";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import PersonAttendanceHistory, {
  type AttendanceHistoryPoint,
} from "@/components/shared/PersonAttendanceHistory";
import { useGetTeenAttendances } from "@/hooks/useTeenGraphQL";

type TeenagerViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teenager: {
    id: number;
    full_name: string;
    contact_no?: string | null;
    gender?: string | null;
    photo_url?: string | null;
    status?: string | null;
    guardian_name?: string | null;
    guardian_relationship?: string | null;
    guardian_contact?: string | null;
    teenClass?: { id: number; name: string } | null;
    location?: { id: number; name: string } | null;
  } | null;
};

const TeenagerViewModal = ({
  isOpen,
  onClose,
  teenager,
}: TeenagerViewModalProps) => {
  const { data, loading } = useGetTeenAttendances(
    teenager ? { teenager_id: teenager.id } : undefined,
    { page: 1, limit: 100 },
    { skip: !isOpen || !teenager?.id },
  );

  const payload = (data as any)?.teenAttendances;
  const attendances = payload?.attendances || [];
  const records: AttendanceHistoryPoint[] = attendances.map((item: any) => ({
    id: item.id,
    date: item.session?.session_date || item.createdAt,
    label: item.session?.title || "Class session",
    isPresent: !!item.is_present,
    notes: item.notes,
    context: item.session?.teenClass?.name
      ? `Class: ${item.session.teenClass.name}`
      : null,
  }));

  return (
    <FullscreenModal
      isOpen={isOpen}
      onClose={onClose}
      title={teenager ? `View ${teenager.full_name}` : "View Teenager"}
    >
      {!teenager ? null : (
        <div className="space-y-6">
          <div className="flex items-start gap-4 flex-wrap">
            <PersonAvatar
              name={teenager.full_name}
              photoUrl={teenager.photo_url}
              className="h-14 w-14"
            />
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-semibold">{teenager.full_name}</h3>
                {teenager.status ? <Badge>{teenager.status}</Badge> : null}
                {teenager.teenClass?.name ? (
                  <Badge variant="secondary">{teenager.teenClass.name}</Badge>
                ) : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Contact: </span>
                  {teenager.contact_no || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Gender: </span>
                  <span className="capitalize">{teenager.gender || "N/A"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Location: </span>
                  {teenager.location?.name || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Guardian: </span>
                  {teenager.guardian_name || "N/A"}
                </p>
                {(teenager.guardian_relationship ||
                  teenager.guardian_contact) && (
                  <p className="sm:col-span-2">
                    <span className="text-muted-foreground">
                      Guardian info:{" "}
                    </span>
                    {[teenager.guardian_relationship, teenager.guardian_contact]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <PersonAttendanceHistory
              loading={loading}
              records={records}
              totalCount={payload?.total}
              emptyLabel="No class attendance recorded for this teenager yet."
            />
          </div>
        </div>
      )}
    </FullscreenModal>
  );
};

export default TeenagerViewModal;
