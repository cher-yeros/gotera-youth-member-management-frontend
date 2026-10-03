import FullscreenModal from "@/components/ui/fullscreen-modal";
import { Badge } from "@/components/ui/badge";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import PersonAttendanceHistory, {
  type AttendanceHistoryPoint,
} from "@/components/shared/PersonAttendanceHistory";
import { useGetFamilyMemberAttendances } from "@/hooks/useGraphQL";

type MemberViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: number;
    full_name: string;
    contact_no?: string | null;
    gender?: string | null;
    photo_url?: string | null;
    family?: { id: number; name: string } | null;
    role?: { name?: string | null } | null;
    status?: { name?: string | null } | null;
    profession?: { name?: string | null } | null;
    profession_name?: string | null;
    location?: { name?: string | null } | null;
    location_name?: string | null;
  } | null;
};

const MemberViewModal = ({ isOpen, onClose, member }: MemberViewModalProps) => {
  const { data, loading } = useGetFamilyMemberAttendances(
    member ? { member_id: member.id } : undefined,
    { page: 1, limit: 100 },
    { skip: !isOpen || !member?.id },
  );

  const payload = (data as any)?.familyMemberAttendances;
  const attendances = payload?.attendances || [];
  const records: AttendanceHistoryPoint[] = attendances.map((item: any) => ({
    id: item.id,
    date: item.meetup?.meetup_date || item.createdAt,
    label: item.meetup?.title || "Family meetup",
    isPresent: !!item.is_present,
    notes: item.notes,
    context: item.meetup?.family?.name
      ? `Family: ${item.meetup.family.name}`
      : null,
  }));

  return (
    <FullscreenModal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? `View ${member.full_name}` : "View Member"}
    >
      {!member ? null : (
        <div className="space-y-6">
          <div className="flex items-start gap-4 flex-wrap">
            <PersonAvatar
              name={member.full_name}
              photoUrl={member.photo_url}
              className="h-14 w-14"
            />
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-semibold">{member.full_name}</h3>
                {member.role?.name ? (
                  <Badge variant="secondary">{member.role.name}</Badge>
                ) : null}
                {member.status?.name ? (
                  <Badge
                    className={
                      member.status.name === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {member.status.name}
                  </Badge>
                ) : null}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Contact: </span>
                  {member.contact_no || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Gender: </span>
                  <span className="capitalize">{member.gender || "N/A"}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Family: </span>
                  {member.family?.name || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Profession: </span>
                  {member.profession?.name || member.profession_name || "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Location: </span>
                  {member.location?.name || member.location_name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <PersonAttendanceHistory
              loading={loading}
              records={records}
              totalCount={payload?.total}
              emptyLabel="No family meetup attendance recorded for this member yet."
            />
          </div>
        </div>
      )}
    </FullscreenModal>
  );
};

export default MemberViewModal;
