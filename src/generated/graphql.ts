export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Activity = {
  __typename?: 'Activity';
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  entity_id?: Maybe<Scalars['Int']['output']>;
  entity_type: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  ip_address?: Maybe<Scalars['String']['output']>;
  member?: Maybe<ActivityMember>;
  member_id: Scalars['Int']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  user?: Maybe<ActivityUser>;
  user_agent?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['Int']['output'];
};

export type ActivityFilterInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  entity_id?: InputMaybe<Scalars['Int']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  member_id?: InputMaybe<Scalars['Int']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

export type ActivityMember = {
  __typename?: 'ActivityMember';
  full_name: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

export type ActivityPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type ActivityUser = {
  __typename?: 'ActivityUser';
  id: Scalars['Int']['output'];
  member?: Maybe<Member>;
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type AuthUser = {
  __typename?: 'AuthUser';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type CreateFamilyInput = {
  name: Scalars['String']['input'];
};

export type CreateLocationInput = {
  name: Scalars['String']['input'];
};

export type CreateMemberInput = {
  contact_no?: InputMaybe<Scalars['String']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  full_name: Scalars['String']['input'];
  location_id?: InputMaybe<Scalars['Int']['input']>;
  location_name?: InputMaybe<Scalars['String']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  profession_name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['Int']['input']>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateProfessionInput = {
  name: Scalars['String']['input'];
};

export type CreateRoleInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateStatusInput = {
  name: Scalars['String']['input'];
};

export type Family = {
  __typename?: 'Family';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FamilySummary = {
  __typename?: 'FamilySummary';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  location?: Maybe<Location>;
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Location = {
  __typename?: 'Location';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LocationSummary = {
  __typename?: 'LocationSummary';
  createdAt: Scalars['String']['output'];
  familyCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserInfo>;
};

export type Member = {
  __typename?: 'Member';
  contact_no?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  family?: Maybe<Family>;
  family_id?: Maybe<Scalars['Int']['output']>;
  full_name: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['Int']['output']>;
  location_name?: Maybe<Scalars['String']['output']>;
  profession?: Maybe<Profession>;
  profession_id?: Maybe<Scalars['Int']['output']>;
  profession_name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
  role_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Status>;
  status_id?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type MemberFilterInput = {
  family_id?: InputMaybe<Scalars['Int']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
};

export type MemberInfo = {
  __typename?: 'MemberInfo';
  contact_no?: Maybe<Scalars['String']['output']>;
  family?: Maybe<Family>;
  full_name: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  role?: Maybe<Role>;
  status?: Maybe<Status>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFamily: Family;
  createLocation: Location;
  createMember: Member;
  createProfession: Profession;
  createRole: Role;
  createStatus: Status;
  deleteFamily: Scalars['Boolean']['output'];
  deleteLocation: Scalars['Boolean']['output'];
  deleteMember: Scalars['Boolean']['output'];
  deleteProfession: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteStatus: Scalars['Boolean']['output'];
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  promoteMember: PromoteMemberResponse;
  resetPassword: ResetPasswordResponse;
  transferMember: TransferMemberResponse;
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
  id: Scalars['Int']['input'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteMemberArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteProfessionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteStatusArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationPromoteMemberArgs = {
  input: PromoteMemberInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationTransferMemberArgs = {
  input: TransferMemberInput;
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

export type OverviewStats = {
  __typename?: 'OverviewStats';
  activeMembers: Scalars['Int']['output'];
  inactiveMembers: Scalars['Int']['output'];
  totalFamilies: Scalars['Int']['output'];
  totalLocations: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
  totalProfessions: Scalars['Int']['output'];
};

export type PaginatedActivities = {
  __typename?: 'PaginatedActivities';
  activities: Array<Activity>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedMembers = {
  __typename?: 'PaginatedMembers';
  limit: Scalars['Int']['output'];
  members: Array<Member>;
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Profession = {
  __typename?: 'Profession';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ProfessionSummary = {
  __typename?: 'ProfessionSummary';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type PromoteMemberInput = {
  member_id: Scalars['Int']['input'];
  role: Scalars['String']['input'];
};

export type PromoteMemberResponse = {
  __typename?: 'PromoteMemberResponse';
  message: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<UserInfo>;
};

export type Query = {
  __typename?: 'Query';
  activities: PaginatedActivities;
  families: Array<Family>;
  family?: Maybe<Family>;
  familySummaries: Array<FamilySummary>;
  location?: Maybe<Location>;
  locationSummaries: Array<LocationSummary>;
  locations: Array<Location>;
  member?: Maybe<Member>;
  members: PaginatedMembers;
  overviewStats: OverviewStats;
  profession?: Maybe<Profession>;
  professionSummaries: Array<ProfessionSummary>;
  professions: Array<Profession>;
  recentActivities: Array<Activity>;
  recentMembers: Array<RecentMember>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  status?: Maybe<Status>;
  statuses: Array<Status>;
};


export type QueryActivitiesArgs = {
  filter?: InputMaybe<ActivityFilterInput>;
  pagination?: InputMaybe<ActivityPaginationInput>;
};


export type QueryFamilyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFamilySummariesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLocationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryLocationSummariesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMemberArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMembersArgs = {
  filter?: InputMaybe<MemberFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProfessionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProfessionSummariesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecentActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecentMembersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRoleArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStatusArgs = {
  id: Scalars['Int']['input'];
};

export type RecentMember = {
  __typename?: 'RecentMember';
  createdAt: Scalars['String']['output'];
  family?: Maybe<Family>;
  full_name: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  location?: Maybe<Location>;
  profession?: Maybe<Profession>;
  status?: Maybe<Status>;
};

export type ResetPasswordInput = {
  member_id: Scalars['Int']['input'];
};

export type ResetPasswordResponse = {
  __typename?: 'ResetPasswordResponse';
  message: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<UserInfo>;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Status = {
  __typename?: 'Status';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TransferMemberInput = {
  member_id: Scalars['Int']['input'];
  new_family_id: Scalars['Int']['input'];
};

export type TransferMemberResponse = {
  __typename?: 'TransferMemberResponse';
  member: Member;
  message: Scalars['String']['output'];
  newFamily: Family;
  oldFamily?: Maybe<Family>;
  success: Scalars['Boolean']['output'];
};

export type UpdateFamilyInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLocationInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMemberInput = {
  contact_no?: InputMaybe<Scalars['String']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  location_id?: InputMaybe<Scalars['Int']['input']>;
  location_name?: InputMaybe<Scalars['String']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  profession_name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['Int']['input']>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateProfessionInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStatusInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  member?: Maybe<MemberInfo>;
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type MemberFragmentFragment = { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null };

export type FamilyFragmentFragment = { __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> };

export type RoleFragmentFragment = { __typename?: 'Role', id: number, name: string, description: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type StatusFragmentFragment = { __typename?: 'Status', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type ProfessionFragmentFragment = { __typename?: 'Profession', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type LocationFragmentFragment = { __typename?: 'Location', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type OverviewStatsFragmentFragment = { __typename?: 'OverviewStats', totalMembers: number, totalFamilies: number, totalProfessions: number, totalLocations: number, activeMembers: number, inactiveMembers: number };

export type RecentMemberFragmentFragment = { __typename?: 'RecentMember', id: number, full_name: string, createdAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null };

export type FamilySummaryFragmentFragment = { __typename?: 'FamilySummary', id: number, name: string, memberCount: number, createdAt: string, location?: { __typename?: 'Location', id: number, name: string } | null };

export type ProfessionSummaryFragmentFragment = { __typename?: 'ProfessionSummary', id: number, name: string, memberCount: number, createdAt: string };

export type LocationSummaryFragmentFragment = { __typename?: 'LocationSummary', id: number, name: string, memberCount: number, familyCount: number, createdAt: string };

export type ActivityFragmentFragment = { __typename?: 'Activity', id: number, user_id: number, member_id: number, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null };

export type GetActivitiesQueryVariables = Exact<{
  filter?: InputMaybe<ActivityFilterInput>;
  pagination?: InputMaybe<ActivityPaginationInput>;
}>;


export type GetActivitiesQuery = { __typename?: 'Query', activities: { __typename?: 'PaginatedActivities', total: number, page: number, limit: number, totalPages: number, activities: Array<{ __typename?: 'Activity', id: number, user_id: number, member_id: number, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null }> } };

export type GetRecentActivitiesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentActivitiesQuery = { __typename?: 'Query', recentActivities: Array<{ __typename?: 'Activity', id: number, user_id: number, member_id: number, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null }> };

export type GetMemberQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMemberQuery = { __typename?: 'Query', member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null } | null };

export type GetMembersQueryVariables = Exact<{
  filter?: InputMaybe<MemberFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetMembersQuery = { __typename?: 'Query', members: { __typename?: 'PaginatedMembers', total: number, page: number, limit: number, totalPages: number, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }> } };

export type GetFamilyQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetFamilyQuery = { __typename?: 'Query', family?: { __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> } | null };

export type GetFamiliesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFamiliesQuery = { __typename?: 'Query', families: Array<{ __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> }> };

export type GetRoleQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetRoleQuery = { __typename?: 'Query', role?: { __typename?: 'Role', id: number, name: string, description: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null };

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { __typename?: 'Query', roles: Array<{ __typename?: 'Role', id: number, name: string, description: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> }> };

export type GetStatusQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetStatusQuery = { __typename?: 'Query', status?: { __typename?: 'Status', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null };

export type GetStatusesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatusesQuery = { __typename?: 'Query', statuses: Array<{ __typename?: 'Status', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> }> };

export type GetProfessionQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetProfessionQuery = { __typename?: 'Query', profession?: { __typename?: 'Profession', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null };

export type GetProfessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfessionsQuery = { __typename?: 'Query', professions: Array<{ __typename?: 'Profession', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> }> };

export type GetLocationQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetLocationQuery = { __typename?: 'Query', location?: { __typename?: 'Location', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null };

export type GetLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocationsQuery = { __typename?: 'Query', locations: Array<{ __typename?: 'Location', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> }> };

export type GetOverviewStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOverviewStatsQuery = { __typename?: 'Query', overviewStats: { __typename?: 'OverviewStats', totalMembers: number, totalFamilies: number, totalProfessions: number, totalLocations: number, activeMembers: number, inactiveMembers: number } };

export type GetRecentMembersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentMembersQuery = { __typename?: 'Query', recentMembers: Array<{ __typename?: 'RecentMember', id: number, full_name: string, createdAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> };

export type GetFamilySummariesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFamilySummariesQuery = { __typename?: 'Query', familySummaries: Array<{ __typename?: 'FamilySummary', id: number, name: string, memberCount: number, createdAt: string, location?: { __typename?: 'Location', id: number, name: string } | null }> };

export type GetProfessionSummariesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetProfessionSummariesQuery = { __typename?: 'Query', professionSummaries: Array<{ __typename?: 'ProfessionSummary', id: number, name: string, memberCount: number, createdAt: string }> };

export type GetLocationSummariesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetLocationSummariesQuery = { __typename?: 'Query', locationSummaries: Array<{ __typename?: 'LocationSummary', id: number, name: string, memberCount: number, familyCount: number, createdAt: string }> };

export type CreateMemberMutationVariables = Exact<{
  input: CreateMemberInput;
}>;


export type CreateMemberMutation = { __typename?: 'Mutation', createMember: { __typename?: 'Member', id: number } };

export type UpdateMemberMutationVariables = Exact<{
  input: UpdateMemberInput;
}>;


export type UpdateMemberMutation = { __typename?: 'Mutation', updateMember: { __typename?: 'Member', id: number } };

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteMemberMutation = { __typename?: 'Mutation', deleteMember: boolean };

export type PromoteMemberMutationVariables = Exact<{
  input: PromoteMemberInput;
}>;


export type PromoteMemberMutation = { __typename?: 'Mutation', promoteMember: { __typename?: 'PromoteMemberResponse', success: boolean, message: string, password?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, createdAt: string, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, full_name: string, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null } | null } | null } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordResponse', success: boolean, message: string, password?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, createdAt: string, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, full_name: string, role?: { __typename?: 'Role', id: number, name: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null } | null } | null } };

export type TransferMemberMutationVariables = Exact<{
  input: TransferMemberInput;
}>;


export type TransferMemberMutation = { __typename?: 'Mutation', transferMember: { __typename?: 'TransferMemberResponse', success: boolean, message: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, oldFamily?: { __typename?: 'Family', id: number, name: string } | null, newFamily: { __typename?: 'Family', id: number, name: string } } };

export type CreateFamilyMutationVariables = Exact<{
  input: CreateFamilyInput;
}>;


export type CreateFamilyMutation = { __typename?: 'Mutation', createFamily: { __typename?: 'Family', id: number } };

export type UpdateFamilyMutationVariables = Exact<{
  input: UpdateFamilyInput;
}>;


export type UpdateFamilyMutation = { __typename?: 'Mutation', updateFamily: { __typename?: 'Family', id: number } };

export type DeleteFamilyMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteFamilyMutation = { __typename?: 'Mutation', deleteFamily: boolean };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', createRole: { __typename?: 'Role', id: number } };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'Role', id: number } };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', deleteRole: boolean };

export type CreateStatusMutationVariables = Exact<{
  input: CreateStatusInput;
}>;


export type CreateStatusMutation = { __typename?: 'Mutation', createStatus: { __typename?: 'Status', id: number } };

export type UpdateStatusMutationVariables = Exact<{
  input: UpdateStatusInput;
}>;


export type UpdateStatusMutation = { __typename?: 'Mutation', updateStatus: { __typename?: 'Status', id: number } };

export type DeleteStatusMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteStatusMutation = { __typename?: 'Mutation', deleteStatus: boolean };

export type CreateProfessionMutationVariables = Exact<{
  input: CreateProfessionInput;
}>;


export type CreateProfessionMutation = { __typename?: 'Mutation', createProfession: { __typename?: 'Profession', id: number } };

export type UpdateProfessionMutationVariables = Exact<{
  input: UpdateProfessionInput;
}>;


export type UpdateProfessionMutation = { __typename?: 'Mutation', updateProfession: { __typename?: 'Profession', id: number } };

export type DeleteProfessionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteProfessionMutation = { __typename?: 'Mutation', deleteProfession: boolean };

export type CreateLocationMutationVariables = Exact<{
  input: CreateLocationInput;
}>;


export type CreateLocationMutation = { __typename?: 'Mutation', createLocation: { __typename?: 'Location', id: number } };

export type UpdateLocationMutationVariables = Exact<{
  input: UpdateLocationInput;
}>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation: { __typename?: 'Location', id: number } };

export type DeleteLocationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteLocationMutation = { __typename?: 'Mutation', deleteLocation: boolean };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, full_name: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null } | null } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GetFamilyMembersQueryVariables = Exact<{
  familyId: Scalars['Int']['input'];
}>;


export type GetFamilyMembersQuery = { __typename?: 'Query', family?: { __typename?: 'Family', id: number, name: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, createdAt: string, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }> } | null };

export type GetFamilyStatsQueryVariables = Exact<{
  familyId: Scalars['Int']['input'];
}>;


export type GetFamilyStatsQuery = { __typename?: 'Query', family?: { __typename?: 'Family', id: number, name: string, members: Array<{ __typename?: 'Member', id: number, status?: { __typename?: 'Status', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }> } | null };
