// GraphQL Types based on the backend schema - Updated

// Base Entity Types
export interface Member {
  id: number;
  full_name: string;
  contact_no?: string;
  status_id?: number;
  family_id?: number;
  role_id?: number;
  profession_id?: number;
  location_id?: number;
  profession_name?: string;
  location_name?: string;
  createdAt: string;
  updatedAt: string;
  family?: Family;
  role?: Role;
  status?: Status;
  profession?: Profession;
  location?: Location;
  ministries?: Ministry[];
}

export interface Family {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members?: Member[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members?: Member[];
}

export interface Status {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members?: Member[];
}

export interface Profession {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members?: Member[];
}

export interface Location {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  members?: Member[];
}

export interface Ministry {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Input Types for Mutations
export interface CreateMemberInput {
  full_name: string;
  contact_no?: string;
  status_id?: number;
  family_id?: number;
  role_id?: number;
  profession_id?: number;
  location_id?: number;
  profession_name?: string;
  location_name?: string;
}

export interface UpdateMemberInput {
  id: number;
  full_name?: string;
  contact_no?: string;
  status_id?: number;
  family_id?: number;
  role_id?: number;
  profession_id?: number;
  location_id?: number;
  profession_name?: string;
  location_name?: string;
}

export interface CreateFamilyInput {
  name: string;
}

export interface UpdateFamilyInput {
  id: number;
  name?: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
}

export interface UpdateRoleInput {
  id: number;
  name?: string;
  description?: string;
}

export interface CreateStatusInput {
  name: string;
}

export interface UpdateStatusInput {
  id: number;
  name?: string;
}

export interface CreateProfessionInput {
  name: string;
}

export interface UpdateProfessionInput {
  id: number;
  name?: string;
}

export interface CreateLocationInput {
  name: string;
}

export interface UpdateLocationInput {
  id: number;
  name?: string;
}

// Filter and Pagination Types
export interface MemberFilterInput {
  status_id?: number;
  family_id?: number;
  profession_id?: number;
  location_id?: number;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginatedMembers {
  members: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query Response Types
export interface GetMemberResponse {
  member: Member;
}

export interface GetMembersResponse {
  members: PaginatedMembers;
}

export interface GetFamilyResponse {
  family: Family;
}

export interface GetFamiliesResponse {
  families: Family[];
}

export interface GetRoleResponse {
  role: Role;
}

export interface GetRolesResponse {
  roles: Role[];
}

export interface GetStatusResponse {
  status: Status;
}

export interface GetStatusesResponse {
  statuses: Status[];
}

export interface GetProfessionResponse {
  profession: Profession;
}

export interface GetProfessionsResponse {
  professions: Profession[];
}

export interface GetLocationResponse {
  location: Location;
}

export interface GetLocationsResponse {
  locations: Location[];
}

// Mutation Response Types
export interface CreateMemberResponse {
  createMember: Member;
}

export interface UpdateMemberResponse {
  updateMember: Member;
}

export interface DeleteMemberResponse {
  deleteMember: boolean;
}

export interface CreateFamilyResponse {
  createFamily: Family;
}

export interface UpdateFamilyResponse {
  updateFamily: Family;
}

export interface DeleteFamilyResponse {
  deleteFamily: boolean;
}

export interface CreateRoleResponse {
  createRole: Role;
}

export interface UpdateRoleResponse {
  updateRole: Role;
}

export interface DeleteRoleResponse {
  deleteRole: boolean;
}

export interface CreateStatusResponse {
  createStatus: Status;
}

export interface UpdateStatusResponse {
  updateStatus: Status;
}

export interface DeleteStatusResponse {
  deleteStatus: boolean;
}

export interface CreateProfessionResponse {
  createProfession: Profession;
}

export interface UpdateProfessionResponse {
  updateProfession: Profession;
}

export interface DeleteProfessionResponse {
  deleteProfession: boolean;
}

export interface CreateLocationResponse {
  createLocation: Location;
}

export interface UpdateLocationResponse {
  updateLocation: Location;
}

export interface DeleteLocationResponse {
  deleteLocation: boolean;
}
