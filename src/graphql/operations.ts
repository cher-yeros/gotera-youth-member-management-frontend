import { gql } from "@apollo/client";

// Fragment for Member with all relations
export const MEMBER_FRAGMENT = gql`
  fragment MemberFragment on Member {
    id
    full_name
    contact_no
    status_id
    family_id
    role_id
    profession_id
    location_id
    profession_name
    location_name
    createdAt
    updatedAt
    family {
      id
      name
    }
    role {
      id
      name
      description
    }
    status {
      id
      name
    }
    profession {
      id
      name
    }
    location {
      id
      name
    }
  }
`;

// Fragment for basic entity info
export const FAMILY_FRAGMENT = gql`
  fragment FamilyFragment on Family {
    id
    name
    createdAt
    updatedAt
    members {
      id
      full_name
      contact_no
      role {
        id
        name
        description
      }
      status {
        id
        name
      }
    }
  }
`;

export const ROLE_FRAGMENT = gql`
  fragment RoleFragment on Role {
    id
    name
    description
    createdAt
    updatedAt
    members {
      id
      full_name
      contact_no
    }
  }
`;

export const STATUS_FRAGMENT = gql`
  fragment StatusFragment on Status {
    id
    name
    createdAt
    updatedAt
    members {
      id
      full_name
      contact_no
    }
  }
`;

export const PROFESSION_FRAGMENT = gql`
  fragment ProfessionFragment on Profession {
    id
    name
    createdAt
    updatedAt
    members {
      id
      full_name
      contact_no
    }
  }
`;

export const LOCATION_FRAGMENT = gql`
  fragment LocationFragment on Location {
    id
    name
    createdAt
    updatedAt
    members {
      id
      full_name
      contact_no
    }
  }
`;

// OVERVIEW FRAGMENTS
export const OVERVIEW_STATS_FRAGMENT = gql`
  fragment OverviewStatsFragment on OverviewStats {
    totalMembers
    totalFamilies
    totalProfessions
    totalLocations
    activeMembers
    inactiveMembers
  }
`;

export const RECENT_MEMBER_FRAGMENT = gql`
  fragment RecentMemberFragment on RecentMember {
    id
    full_name
    createdAt
    family {
      id
      name
    }
    profession {
      id
      name
    }
    location {
      id
      name
    }
    status {
      id
      name
    }
  }
`;

export const FAMILY_SUMMARY_FRAGMENT = gql`
  fragment FamilySummaryFragment on FamilySummary {
    id
    name
    memberCount
    createdAt
    location {
      id
      name
    }
  }
`;

export const PROFESSION_SUMMARY_FRAGMENT = gql`
  fragment ProfessionSummaryFragment on ProfessionSummary {
    id
    name
    memberCount
    createdAt
  }
`;

export const LOCATION_SUMMARY_FRAGMENT = gql`
  fragment LocationSummaryFragment on LocationSummary {
    id
    name
    memberCount
    familyCount
    createdAt
  }
`;

// ACTIVITY FRAGMENTS
export const ACTIVITY_FRAGMENT = gql`
  fragment ActivityFragment on Activity {
    id
    user_id
    member_id
    action
    entity_type
    entity_id
    description
    metadata
    ip_address
    user_agent
    createdAt
    updatedAt
    user {
      id
      phone
      role
      member {
        id
        full_name
      }
    }
    member {
      id
      full_name
    }
  }
`;

// ACTIVITY QUERIES
export const GET_ACTIVITIES = gql`
  query GetActivities(
    $filter: ActivityFilterInput
    $pagination: ActivityPaginationInput
  ) {
    activities(filter: $filter, pagination: $pagination) {
      activities {
        ...ActivityFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($limit: Int) {
    recentActivities(limit: $limit) {
      ...ActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

// MEMBER QUERIES
export const GET_MEMBER = gql`
  query GetMember($id: Int!) {
    member(id: $id) {
      ...MemberFragment
    }
  }
  ${MEMBER_FRAGMENT}
`;

export const GET_MEMBERS = gql`
  query GetMembers($filter: MemberFilterInput, $pagination: PaginationInput) {
    members(filter: $filter, pagination: $pagination) {
      members {
        ...MemberFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${MEMBER_FRAGMENT}
`;

// FAMILY QUERIES
export const GET_FAMILY = gql`
  query GetFamily($id: Int!) {
    family(id: $id) {
      ...FamilyFragment
    }
  }
  ${FAMILY_FRAGMENT}
`;

export const GET_FAMILIES = gql`
  query GetFamilies {
    families {
      ...FamilyFragment
    }
  }
  ${FAMILY_FRAGMENT}
`;

// ROLE QUERIES
export const GET_ROLE = gql`
  query GetRole($id: Int!) {
    role(id: $id) {
      ...RoleFragment
    }
  }
  ${ROLE_FRAGMENT}
`;

export const GET_ROLES = gql`
  query GetRoles {
    roles {
      ...RoleFragment
    }
  }
  ${ROLE_FRAGMENT}
`;

// STATUS QUERIES
export const GET_STATUS = gql`
  query GetStatus($id: Int!) {
    status(id: $id) {
      ...StatusFragment
    }
  }
  ${STATUS_FRAGMENT}
`;

export const GET_STATUSES = gql`
  query GetStatuses {
    statuses {
      ...StatusFragment
    }
  }
  ${STATUS_FRAGMENT}
`;

// PROFESSION QUERIES
export const GET_PROFESSION = gql`
  query GetProfession($id: Int!) {
    profession(id: $id) {
      ...ProfessionFragment
    }
  }
  ${PROFESSION_FRAGMENT}
`;

export const GET_PROFESSIONS = gql`
  query GetProfessions {
    professions {
      ...ProfessionFragment
    }
  }
  ${PROFESSION_FRAGMENT}
`;

// LOCATION QUERIES
export const GET_LOCATION = gql`
  query GetLocation($id: Int!) {
    location(id: $id) {
      ...LocationFragment
    }
  }
  ${LOCATION_FRAGMENT}
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      ...LocationFragment
    }
  }
  ${LOCATION_FRAGMENT}
`;

// OVERVIEW QUERIES
export const GET_OVERVIEW_STATS = gql`
  query GetOverviewStats {
    overviewStats {
      ...OverviewStatsFragment
    }
  }
  ${OVERVIEW_STATS_FRAGMENT}
`;

export const GET_RECENT_MEMBERS = gql`
  query GetRecentMembers($limit: Int) {
    recentMembers(limit: $limit) {
      ...RecentMemberFragment
    }
  }
  ${RECENT_MEMBER_FRAGMENT}
`;

export const GET_FAMILY_SUMMARIES = gql`
  query GetFamilySummaries($limit: Int) {
    familySummaries(limit: $limit) {
      ...FamilySummaryFragment
    }
  }
  ${FAMILY_SUMMARY_FRAGMENT}
`;

export const GET_PROFESSION_SUMMARIES = gql`
  query GetProfessionSummaries($limit: Int) {
    professionSummaries(limit: $limit) {
      ...ProfessionSummaryFragment
    }
  }
  ${PROFESSION_SUMMARY_FRAGMENT}
`;

export const GET_LOCATION_SUMMARIES = gql`
  query GetLocationSummaries($limit: Int) {
    locationSummaries(limit: $limit) {
      ...LocationSummaryFragment
    }
  }
  ${LOCATION_SUMMARY_FRAGMENT}
`;

// MEMBER MUTATIONS
export const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      id
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: UpdateMemberInput!) {
    updateMember(input: $input) {
      id
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: Int!) {
    deleteMember(id: $id)
  }
`;

export const PROMOTE_MEMBER = gql`
  mutation PromoteMember($input: PromoteMemberInput!) {
    promoteMember(input: $input) {
      success
      message
      password
      user {
        id
        phone
        role
        createdAt
        member {
          id
          contact_no
          full_name
          role {
            id
            name
            description
          }
          status {
            id
            name
          }
          family {
            id
            name
          }
        }
      }
    }
  }
`;

// FAMILY MUTATIONS
export const CREATE_FAMILY = gql`
  mutation CreateFamily($input: CreateFamilyInput!) {
    createFamily(input: $input) {
      id
    }
  }
`;

export const UPDATE_FAMILY = gql`
  mutation UpdateFamily($input: UpdateFamilyInput!) {
    updateFamily(input: $input) {
      id
    }
  }
`;

export const DELETE_FAMILY = gql`
  mutation DeleteFamily($id: Int!) {
    deleteFamily(id: $id)
  }
`;

// ROLE MUTATIONS
export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: Int!) {
    deleteRole(id: $id)
  }
`;

// STATUS MUTATIONS
export const CREATE_STATUS = gql`
  mutation CreateStatus($input: CreateStatusInput!) {
    createStatus(input: $input) {
      id
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation UpdateStatus($input: UpdateStatusInput!) {
    updateStatus(input: $input) {
      id
    }
  }
`;

export const DELETE_STATUS = gql`
  mutation DeleteStatus($id: Int!) {
    deleteStatus(id: $id)
  }
`;

// PROFESSION MUTATIONS
export const CREATE_PROFESSION = gql`
  mutation CreateProfession($input: CreateProfessionInput!) {
    createProfession(input: $input) {
      id
    }
  }
`;

export const UPDATE_PROFESSION = gql`
  mutation UpdateProfession($input: UpdateProfessionInput!) {
    updateProfession(input: $input) {
      id
    }
  }
`;

export const DELETE_PROFESSION = gql`
  mutation DeleteProfession($id: Int!) {
    deleteProfession(id: $id)
  }
`;

// LOCATION MUTATIONS
export const CREATE_LOCATION = gql`
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation($input: UpdateLocationInput!) {
    updateLocation(input: $input) {
      id
    }
  }
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($id: Int!) {
    deleteLocation(id: $id)
  }
`;

// AUTHENTICATION MUTATIONS
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        phone
        role
        member {
          id
          contact_no
          full_name
          family {
            id
            name
          }
          role {
            id
            name
            description
          }
          status {
            id
            name
          }
        }
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
