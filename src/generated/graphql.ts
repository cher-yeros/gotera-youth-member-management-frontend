export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type CreateFamilyInput = {
  name: Scalars["String"]["input"];
};

export type CreateLocationInput = {
  name: Scalars["String"]["input"];
};

export type CreateMemberInput = {
  contact_no?: InputMaybe<Scalars["String"]["input"]>;
  family_id?: InputMaybe<Scalars["Int"]["input"]>;
  full_name: Scalars["String"]["input"];
  location_id?: InputMaybe<Scalars["Int"]["input"]>;
  location_name?: InputMaybe<Scalars["String"]["input"]>;
  profession_id?: InputMaybe<Scalars["Int"]["input"]>;
  profession_name?: InputMaybe<Scalars["String"]["input"]>;
  role_id?: InputMaybe<Scalars["Int"]["input"]>;
  status_id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type CreateProfessionInput = {
  name: Scalars["String"]["input"];
};

export type CreateRoleInput = {
  description: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type CreateStatusInput = {
  name: Scalars["String"]["input"];
};

export type Family = {
  __typename?: "Family";
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  members: Array<Member>;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Location = {
  __typename?: "Location";
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  members: Array<Member>;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Member = {
  __typename?: "Member";
  contact_no?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["String"]["output"];
  family?: Maybe<Family>;
  family_id?: Maybe<Scalars["Int"]["output"]>;
  full_name: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars["Int"]["output"]>;
  location_name?: Maybe<Scalars["String"]["output"]>;
  profession?: Maybe<Profession>;
  profession_id?: Maybe<Scalars["Int"]["output"]>;
  profession_name?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Role>;
  role_id?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Status>;
  status_id?: Maybe<Scalars["Int"]["output"]>;
  updatedAt: Scalars["String"]["output"];
};

export type MemberFilterInput = {
  family_id?: InputMaybe<Scalars["Int"]["input"]>;
  location_id?: InputMaybe<Scalars["Int"]["input"]>;
  profession_id?: InputMaybe<Scalars["Int"]["input"]>;
  status_id?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createFamily: Family;
  createLocation: Location;
  createMember: Member;
  createProfession: Profession;
  createRole: Role;
  createStatus: Status;
  deleteFamily: Scalars["Boolean"]["output"];
  deleteLocation: Scalars["Boolean"]["output"];
  deleteMember: Scalars["Boolean"]["output"];
  deleteProfession: Scalars["Boolean"]["output"];
  deleteRole: Scalars["Boolean"]["output"];
  deleteStatus: Scalars["Boolean"]["output"];
  updateFamily: Family;
  updateLocation: Location;
  updateMember: Member;
  updateProfession: Profession;
  updateRole: Role;
  updateStatus: Status;
};

export type MutationCreateFamilyArgs = {
  input: CreateFamilyInput;
};

export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};

export type MutationCreateMemberArgs = {
  input: CreateMemberInput;
};

export type MutationCreateProfessionArgs = {
  input: CreateProfessionInput;
};

export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};

export type MutationCreateStatusArgs = {
  input: CreateStatusInput;
};

export type MutationDeleteFamilyArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationDeleteLocationArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationDeleteMemberArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationDeleteProfessionArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationDeleteRoleArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationDeleteStatusArgs = {
  id: Scalars["Int"]["input"];
};

export type MutationUpdateFamilyArgs = {
  input: UpdateFamilyInput;
};

export type MutationUpdateLocationArgs = {
  input: UpdateLocationInput;
};

export type MutationUpdateMemberArgs = {
  input: UpdateMemberInput;
};

export type MutationUpdateProfessionArgs = {
  input: UpdateProfessionInput;
};

export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};

export type MutationUpdateStatusArgs = {
  input: UpdateStatusInput;
};

export type PaginatedMembers = {
  __typename?: "PaginatedMembers";
  limit: Scalars["Int"]["output"];
  members: Array<Member>;
  page: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
  totalPages: Scalars["Int"]["output"];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Profession = {
  __typename?: "Profession";
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  members: Array<Member>;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  families: Array<Family>;
  family?: Maybe<Family>;
  location?: Maybe<Location>;
  locations: Array<Location>;
  member?: Maybe<Member>;
  members: PaginatedMembers;
  profession?: Maybe<Profession>;
  professions: Array<Profession>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  status?: Maybe<Status>;
  statuses: Array<Status>;
};

export type QueryFamilyArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryLocationArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryMemberArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryMembersArgs = {
  filter?: InputMaybe<MemberFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryProfessionArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryRoleArgs = {
  id: Scalars["Int"]["input"];
};

export type QueryStatusArgs = {
  id: Scalars["Int"]["input"];
};

export type Role = {
  __typename?: "Role";
  createdAt: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  members: Array<Member>;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Status = {
  __typename?: "Status";
  createdAt: Scalars["String"]["output"];
  id: Scalars["Int"]["output"];
  members: Array<Member>;
  name: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type UpdateFamilyInput = {
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateLocationInput = {
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateMemberInput = {
  contact_no?: InputMaybe<Scalars["String"]["input"]>;
  family_id?: InputMaybe<Scalars["Int"]["input"]>;
  full_name?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["Int"]["input"];
  location_id?: InputMaybe<Scalars["Int"]["input"]>;
  location_name?: InputMaybe<Scalars["String"]["input"]>;
  profession_id?: InputMaybe<Scalars["Int"]["input"]>;
  profession_name?: InputMaybe<Scalars["String"]["input"]>;
  role_id?: InputMaybe<Scalars["Int"]["input"]>;
  status_id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateProfessionInput = {
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateStatusInput = {
  id: Scalars["Int"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type MemberFragmentFragment = {
  __typename?: "Member";
  id: number;
  full_name: string;
  contact_no?: string | null;
  status_id?: number | null;
  family_id?: number | null;
  role_id?: number | null;
  profession_id?: number | null;
  location_id?: number | null;
  profession_name?: string | null;
  location_name?: string | null;
  createdAt: string;
  updatedAt: string;
  family?: { __typename?: "Family"; id: number; name: string } | null;
  role?: {
    __typename?: "Role";
    id: number;
    name: string;
    description: string;
  } | null;
  status?: { __typename?: "Status"; id: number; name: string } | null;
  profession?: { __typename?: "Profession"; id: number; name: string } | null;
  location?: { __typename?: "Location"; id: number; name: string } | null;
};

export type FamilyFragmentFragment = {
  __typename?: "Family";
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
  }>;
};

export type RoleFragmentFragment = {
  __typename?: "Role";
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
  }>;
};

export type StatusFragmentFragment = {
  __typename?: "Status";
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
  }>;
};

export type ProfessionFragmentFragment = {
  __typename?: "Profession";
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
  }>;
};

export type LocationFragmentFragment = {
  __typename?: "Location";
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members: Array<{
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
  }>;
};

export type GetMemberQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetMemberQuery = {
  __typename?: "Query";
  member?: {
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
    status_id?: number | null;
    family_id?: number | null;
    role_id?: number | null;
    profession_id?: number | null;
    location_id?: number | null;
    profession_name?: string | null;
    location_name?: string | null;
    createdAt: string;
    updatedAt: string;
    family?: { __typename?: "Family"; id: number; name: string } | null;
    role?: {
      __typename?: "Role";
      id: number;
      name: string;
      description: string;
    } | null;
    status?: { __typename?: "Status"; id: number; name: string } | null;
    profession?: { __typename?: "Profession"; id: number; name: string } | null;
    location?: { __typename?: "Location"; id: number; name: string } | null;
  } | null;
};

export type GetMembersQueryVariables = Exact<{
  filter?: InputMaybe<MemberFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetMembersQuery = {
  __typename?: "Query";
  members: {
    __typename?: "PaginatedMembers";
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
      status_id?: number | null;
      family_id?: number | null;
      role_id?: number | null;
      profession_id?: number | null;
      location_id?: number | null;
      profession_name?: string | null;
      location_name?: string | null;
      createdAt: string;
      updatedAt: string;
      family?: { __typename?: "Family"; id: number; name: string } | null;
      role?: {
        __typename?: "Role";
        id: number;
        name: string;
        description: string;
      } | null;
      status?: { __typename?: "Status"; id: number; name: string } | null;
      profession?: {
        __typename?: "Profession";
        id: number;
        name: string;
      } | null;
      location?: { __typename?: "Location"; id: number; name: string } | null;
    }>;
  };
};

export type GetFamilyQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetFamilyQuery = {
  __typename?: "Query";
  family?: {
    __typename?: "Family";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  } | null;
};

export type GetFamiliesQueryVariables = Exact<{ [key: string]: never }>;

export type GetFamiliesQuery = {
  __typename?: "Query";
  families: Array<{
    __typename?: "Family";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  }>;
};

export type GetRoleQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetRoleQuery = {
  __typename?: "Query";
  role?: {
    __typename?: "Role";
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  } | null;
};

export type GetRolesQueryVariables = Exact<{ [key: string]: never }>;

export type GetRolesQuery = {
  __typename?: "Query";
  roles: Array<{
    __typename?: "Role";
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  }>;
};

export type GetStatusQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetStatusQuery = {
  __typename?: "Query";
  status?: {
    __typename?: "Status";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  } | null;
};

export type GetStatusesQueryVariables = Exact<{ [key: string]: never }>;

export type GetStatusesQuery = {
  __typename?: "Query";
  statuses: Array<{
    __typename?: "Status";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  }>;
};

export type GetProfessionQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetProfessionQuery = {
  __typename?: "Query";
  profession?: {
    __typename?: "Profession";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  } | null;
};

export type GetProfessionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProfessionsQuery = {
  __typename?: "Query";
  professions: Array<{
    __typename?: "Profession";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  }>;
};

export type GetLocationQueryVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type GetLocationQuery = {
  __typename?: "Query";
  location?: {
    __typename?: "Location";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  } | null;
};

export type GetLocationsQueryVariables = Exact<{ [key: string]: never }>;

export type GetLocationsQuery = {
  __typename?: "Query";
  locations: Array<{
    __typename?: "Location";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  }>;
};

export type CreateMemberMutationVariables = Exact<{
  input: CreateMemberInput;
}>;

export type CreateMemberMutation = {
  __typename?: "Mutation";
  createMember: {
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
    status_id?: number | null;
    family_id?: number | null;
    role_id?: number | null;
    profession_id?: number | null;
    location_id?: number | null;
    profession_name?: string | null;
    location_name?: string | null;
    createdAt: string;
    updatedAt: string;
    family?: { __typename?: "Family"; id: number; name: string } | null;
    role?: {
      __typename?: "Role";
      id: number;
      name: string;
      description: string;
    } | null;
    status?: { __typename?: "Status"; id: number; name: string } | null;
    profession?: { __typename?: "Profession"; id: number; name: string } | null;
    location?: { __typename?: "Location"; id: number; name: string } | null;
  };
};

export type UpdateMemberMutationVariables = Exact<{
  input: UpdateMemberInput;
}>;

export type UpdateMemberMutation = {
  __typename?: "Mutation";
  updateMember: {
    __typename?: "Member";
    id: number;
    full_name: string;
    contact_no?: string | null;
    status_id?: number | null;
    family_id?: number | null;
    role_id?: number | null;
    profession_id?: number | null;
    location_id?: number | null;
    profession_name?: string | null;
    location_name?: string | null;
    createdAt: string;
    updatedAt: string;
    family?: { __typename?: "Family"; id: number; name: string } | null;
    role?: {
      __typename?: "Role";
      id: number;
      name: string;
      description: string;
    } | null;
    status?: { __typename?: "Status"; id: number; name: string } | null;
    profession?: { __typename?: "Profession"; id: number; name: string } | null;
    location?: { __typename?: "Location"; id: number; name: string } | null;
  };
};

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteMemberMutation = {
  __typename?: "Mutation";
  deleteMember: boolean;
};

export type CreateFamilyMutationVariables = Exact<{
  input: CreateFamilyInput;
}>;

export type CreateFamilyMutation = {
  __typename?: "Mutation";
  createFamily: {
    __typename?: "Family";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type UpdateFamilyMutationVariables = Exact<{
  input: UpdateFamilyInput;
}>;

export type UpdateFamilyMutation = {
  __typename?: "Mutation";
  updateFamily: {
    __typename?: "Family";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type DeleteFamilyMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteFamilyMutation = {
  __typename?: "Mutation";
  deleteFamily: boolean;
};

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;

export type CreateRoleMutation = {
  __typename?: "Mutation";
  createRole: {
    __typename?: "Role";
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;

export type UpdateRoleMutation = {
  __typename?: "Mutation";
  updateRole: {
    __typename?: "Role";
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteRoleMutation = {
  __typename?: "Mutation";
  deleteRole: boolean;
};

export type CreateStatusMutationVariables = Exact<{
  input: CreateStatusInput;
}>;

export type CreateStatusMutation = {
  __typename?: "Mutation";
  createStatus: {
    __typename?: "Status";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type UpdateStatusMutationVariables = Exact<{
  input: UpdateStatusInput;
}>;

export type UpdateStatusMutation = {
  __typename?: "Mutation";
  updateStatus: {
    __typename?: "Status";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type DeleteStatusMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteStatusMutation = {
  __typename?: "Mutation";
  deleteStatus: boolean;
};

export type CreateProfessionMutationVariables = Exact<{
  input: CreateProfessionInput;
}>;

export type CreateProfessionMutation = {
  __typename?: "Mutation";
  createProfession: {
    __typename?: "Profession";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type UpdateProfessionMutationVariables = Exact<{
  input: UpdateProfessionInput;
}>;

export type UpdateProfessionMutation = {
  __typename?: "Mutation";
  updateProfession: {
    __typename?: "Profession";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type DeleteProfessionMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteProfessionMutation = {
  __typename?: "Mutation";
  deleteProfession: boolean;
};

export type CreateLocationMutationVariables = Exact<{
  input: CreateLocationInput;
}>;

export type CreateLocationMutation = {
  __typename?: "Mutation";
  createLocation: {
    __typename?: "Location";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type UpdateLocationMutationVariables = Exact<{
  input: UpdateLocationInput;
}>;

export type UpdateLocationMutation = {
  __typename?: "Mutation";
  updateLocation: {
    __typename?: "Location";
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    members: Array<{
      __typename?: "Member";
      id: number;
      full_name: string;
      contact_no?: string | null;
    }>;
  };
};

export type DeleteLocationMutationVariables = Exact<{
  id: Scalars["Int"]["input"];
}>;

export type DeleteLocationMutation = {
  __typename?: "Mutation";
  deleteLocation: boolean;
};
