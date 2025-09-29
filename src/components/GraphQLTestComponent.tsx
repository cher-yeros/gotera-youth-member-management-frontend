import { useQuery } from "@apollo/client/react";
import {
  GET_MEMBERS,
  GET_FAMILIES,
  GET_ROLES,
  GET_STATUSES,
  GET_PROFESSIONS,
  GET_LOCATIONS,
} from "../graphql/operations";
import type {
  GetMembersQuery,
  GetFamiliesQuery,
  GetRolesQuery,
  GetStatusesQuery,
  GetProfessionsQuery,
  GetLocationsQuery,
} from "@/generated/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GraphQLTestComponent = () => {
  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
  } = useQuery<GetMembersQuery>(GET_MEMBERS, {
    variables: { pagination: { page: 1, limit: 5 } },
  });

  const {
    data: familiesData,
    loading: familiesLoading,
    error: familiesError,
  } = useQuery<GetFamiliesQuery>(GET_FAMILIES);
  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
  } = useQuery<GetRolesQuery>(GET_ROLES);
  const {
    data: statusesData,
    loading: statusesLoading,
    error: statusesError,
  } = useQuery<GetStatusesQuery>(GET_STATUSES);
  const {
    data: professionsData,
    loading: professionsLoading,
    error: professionsError,
  } = useQuery<GetProfessionsQuery>(GET_PROFESSIONS);
  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
  } = useQuery<GetLocationsQuery>(GET_LOCATIONS);

  const allLoading =
    membersLoading ||
    familiesLoading ||
    rolesLoading ||
    statusesLoading ||
    professionsLoading ||
    locationsLoading;
  const hasError =
    membersError ||
    familiesError ||
    rolesError ||
    statusesError ||
    professionsError ||
    locationsError;

  if (allLoading) {
    return (
      <Card className="shadow-brand">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Testing GraphQL connection...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="shadow-brand">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-600">
            GraphQL Connection Failed
          </h3>
          <p className="text-muted-foreground mb-4">
            {membersError?.message ||
              familiesError?.message ||
              rolesError?.message ||
              statusesError?.message ||
              professionsError?.message ||
              locationsError?.message}
          </p>
          <p className="text-sm text-muted-foreground">
            Make sure the backend server is running on
            http://localhost:4000/graphql
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-brand">
        <CardHeader>
          <CardTitle className="text-brand-gradient">
            GraphQL Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="h-16 w-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">
              GraphQL Connection Successful!
            </h3>
            <p className="text-muted-foreground mb-4">
              All GraphQL queries are working correctly.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand-gradient text-lg">
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <Badge variant="default">
                  {membersData?.members?.total || 0}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loaded:</span>
                <Badge variant="secondary">
                  {membersData?.members?.members?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand-gradient text-lg">
              Families
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <Badge variant="default">
                  {familiesData?.families?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand-gradient text-lg">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <Badge variant="default">{rolesData?.roles?.length || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand-gradient text-lg">
              Statuses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <Badge variant="default">
                  {statusesData?.statuses?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand-gradient text-lg">
              Professions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <Badge variant="default">
                  {professionsData?.professions?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-brand">
          <CardHeader className="pb-3">
            <CardTitle className="text-brand-gradient text-lg">
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <Badge variant="default">
                  {locationsData?.locations?.length || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Data Display */}
      {membersData?.members?.members &&
        membersData.members.members.length > 0 && (
          <Card className="shadow-brand">
            <CardHeader>
              <CardTitle className="text-brand-gradient">
                Sample Member Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {membersData.members.members.slice(0, 3).map((member: any) => (
                  <div key={member.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{member.full_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {member.contact_no || "No contact"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {member.status?.name || "No status"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.family?.name || "No family"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default GraphQLTestComponent;
