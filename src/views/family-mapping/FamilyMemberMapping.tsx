import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { GET_FAMILIES } from "@/graphql/operations";
import { useQuery } from "@apollo/client/react";
import { User, Users } from "lucide-react";

interface Family {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: {
    id: number;
    full_name: string;
    contact_no: string;
    role: {
      id: number;
      name: string;
      description: string;
    };
    status: {
      id: number;
      name: string;
    };
  }[];
}

const FamilyMemberMapping = () => {
  const { data, loading, error } = useQuery<{ families: Family[] }>(
    GET_FAMILIES
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Family Member Mapping
            </h1>
            <p className="text-muted-foreground">
              View all families and their corresponding members
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, memberIndex) => (
                    <Skeleton key={memberIndex} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-gradient">
              Family Member Mapping
            </h1>
            <p className="text-muted-foreground">
              View all families and their corresponding members
            </p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error loading family data: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const families = data?.families || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">
            Family Member Mapping
          </h1>
          <p className="text-muted-foreground">
            View all families and their corresponding members
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{families.length} Families</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>
            {families.reduce(
              (total, family) => total + family.members.length,
              0
            )}{" "}
            Total Members
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            <span>Family Leader</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <span>Not Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>Active Member</span>
          </div>
        </div>
      </div>

      {families.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No families found
          </h3>
          <p className="text-gray-500">
            There are no families in the system yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <Card key={family.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {family.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {family.members.length} member
                    {family.members.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Created: {new Date(family.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                {family.members.length === 0 ? (
                  <div className="text-center py-4">
                    <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No members yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Family Members:
                    </h4>
                    <div className="space-y-2">
                      {family.members.map((member) => {
                        const isFamilyLeader = member.role?.name === "FL";
                        const isInactive = member.status?.name === "Not Active";

                        return (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between p-2 rounded-lg ${
                              isFamilyLeader
                                ? "bg-green-50 border border-green-200"
                                : isInactive
                                ? "bg-red-50 border border-red-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  isFamilyLeader
                                    ? "bg-green-600"
                                    : isInactive
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm font-medium ${
                                    isFamilyLeader
                                      ? "text-green-900"
                                      : isInactive
                                      ? "text-red-900"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {member.full_name}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {member.contact_no ? (
                                <a
                                  href={`tel:${member.contact_no}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {member.contact_no}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyMemberMapping;
