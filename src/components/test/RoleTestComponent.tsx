import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/redux/useAuth";

const RoleTestComponent = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Not authenticated</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Role:</strong>{" "}
          <Badge
            className={
              user.role?.toLowerCase() === "admin"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }
          >
            {user.role}
          </Badge>
        </div>
        <div>
          <strong>Phone:</strong> {user.phone}
        </div>
        {user.member && (
          <div>
            <strong>Member Name:</strong> {user.member.full_name}
          </div>
        )}
        {user.member?.family && (
          <div>
            <strong>Family:</strong> {user.member.family.name}
          </div>
        )}
        <div>
          <strong>Access Level:</strong>{" "}
          <Badge
            className={
              user.role?.toLowerCase() === "admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-orange-100 text-orange-800"
            }
          >
            {user.role?.toLowerCase() === "admin"
              ? "Full Access"
              : "Family Leader"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleTestComponent;
