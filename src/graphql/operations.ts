import { gql } from "@apollo/client";

// Fragment for Ministry (lightweight - without members)
export const MINISTRY_FRAGMENT = gql`
  fragment MinistryFragment on Ministry {
    id
    name
    description
    is_active
    program_frequency
    program_day
    createdAt
    updatedAt
  }
`;

// Fragment for Ministry with Members (for detailed views)
export const MINISTRY_WITH_MEMBERS_FRAGMENT = gql`
  fragment MinistryWithMembersFragment on Ministry {
    id
    name
    description
    is_active
    program_frequency
    program_day
    createdAt
    updatedAt
    members {
      id
      full_name
      contact_no
      gender
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
    leaders {
      id
      full_name
      contact_no
      gender
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

// Fragment for Member without Ministry (for ministry-specific queries)
export const MEMBER_BASIC_FRAGMENT = gql`
  fragment MemberBasicFragment on Member {
    id
    full_name
    contact_no
    gender
    birth_date
    status_id
    family_id
    role_id
    profession_id
    location_id
    profession_name
    location_name
    no_ministry
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
    roles {
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

// Fragment for Member with Ministry
export const MEMBER_WITH_MINISTRY_FRAGMENT = gql`
  fragment MemberWithMinistryFragment on Member {
    id
    full_name
    contact_no
    gender
    birth_date
    status_id
    family_id
    role_id
    profession_id
    location_id
    profession_name
    location_name
    no_ministry
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
    roles {
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
    ministries {
      id
      name
      description
      is_active
    }
  }
`;
export const FAMILY_MEETUP_FRAGMENT = gql`
  fragment FamilyMeetupFragment on FamilyMeetup {
    id
    batch_id
    family_id
    title
    description
    meetup_date
    location
    created_by
    is_active
    createdAt
    updatedAt
    family {
      id
      name
    }
    creator {
      id
      full_name
    }
    attendances {
      id
      member_id
      is_present
      notes
      recorded_by
      createdAt
      member {
        id
        full_name
      }
      recorder {
        id
        full_name
      }
    }
  }
`;

export const FAMILY_MEETUP_BATCH_FRAGMENT = gql`
  fragment FamilyMeetupBatchFragment on FamilyMeetupBatch {
    id
    title
    description
    meetup_date
    location
    created_by
    is_active
    createdAt
    updatedAt
    creator {
      id
      full_name
    }
    meetups {
      id
      family_id
      title
      description
      meetup_date
      location
      is_active
      family {
        id
        name
      }
      attendances {
        id
        is_present
      }
    }
  }
`;

export const GET_FAMILY_MEETUP_BATCH = gql`
  query GetFamilyMeetupBatch($id: Int!) {
    familyMeetupBatch(id: $id) {
      ...FamilyMeetupBatchFragment
    }
  }
  ${FAMILY_MEETUP_BATCH_FRAGMENT}
`;

// Fragment for FamilyMemberAttendance
export const FAMILY_MEMBER_ATTENDANCE_FRAGMENT = gql`
  fragment FamilyMemberAttendanceFragment on FamilyMemberAttendance {
    id
    meetup_id
    member_id
    is_present
    notes
    recorded_by
    createdAt
    updatedAt
    meetup {
      id
      title
      meetup_date
      family {
        id
        name
      }
    }
    member {
      id
      full_name
    }
    recorder {
      id
      full_name
    }
  }
`;

// Fragment for AttendanceStats
export const ATTENDANCE_STATS_FRAGMENT = gql`
  fragment AttendanceStatsFragment on AttendanceStats {
    totalMembers
    presentMembers
    absentMembers
    attendanceRate
  }
`;

// Fragment for Member with all relations
export const MEMBER_FRAGMENT = gql`
  fragment MemberFragment on Member {
    id
    full_name
    contact_no
    gender
    photo_url
    birth_date
    status_id
    family_id
    role_id
    profession_id
    location_id
    profession_name
    location_name
    no_ministry
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
    roles {
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
    ministries {
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
      gender
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
    notActiveMembers
    movedOutMembers
    newMembers
    locationAllocatedMembers
    locationUnallocatedMembers
    professionAllocatedMembers
    professionUnallocatedMembers
    ministryAllocatedMembers
    ministryUnallocatedMembers
    incompleteFamiliesCount
    fullyIncompleteFamiliesCount
    unassignedMembers
    openNewcomers
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
    incompleteMemberCount
    fullyIncompleteMemberCount
    completeMemberCount
    isFullyIncomplete
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

export const LOOKUP_BY_PHONE = gql`
  query LookupByPhone(
    $phone: String!
    $excludeMemberId: Int
    $excludeTeenagerId: Int
  ) {
    lookupByPhone(
      phone: $phone
      excludeMemberId: $excludeMemberId
      excludeTeenagerId: $excludeTeenagerId
    ) {
      type
      id
      full_name
      contact_no
      status
      family_name
      class_name
    }
  }
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

export const GET_INCOMPLETE_FAMILIES = gql`
  query GetIncompleteFamilies($limit: Int) {
    incompleteFamilies(limit: $limit) {
      ...FamilySummaryFragment
    }
  }
  ${FAMILY_SUMMARY_FRAGMENT}
`;

export const GET_FAMILY_PLACEMENT_NEEDS = gql`
  query GetFamilyPlacementNeeds {
    familyPlacementNeeds {
      id
      name
      activeMemberCount
      maleCount
      femaleCount
      unknownGenderCount
      averageActiveSize
      sizeDeficit
      genderSkew
      needsMembers
      needReasons
      suggestedNewcomers {
        followUpCaseId
        memberId
        fullName
        gender
        priority
        reason
      }
    }
  }
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
        roles
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
          roles {
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

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
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

export const TRANSFER_MEMBER = gql`
  mutation TransferMember($input: TransferMemberInput!) {
    transferMember(input: $input) {
      success
      message
      member {
        ...MemberFragment
      }
      oldFamily {
        id
        name
      }
      newFamily {
        id
        name
      }
    }
  }
  ${MEMBER_FRAGMENT}
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
export const USER_INFO_FRAGMENT = gql`
  fragment UserInfoFragment on UserInfo {
    id
    phone
    role
    roles
    member {
      id
      contact_no
      photo_url
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
      roles {
        id
        name
        description
      }
      status {
        id
        name
      }
      ministries {
        id
        name
        description
        is_active
      }
      ledMinistries {
        id
        name
        description
        is_active
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserInfoFragment
      }
    }
  }
  ${USER_INFO_FRAGMENT}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const ME = gql`
  query Me {
    me {
      ...UserInfoFragment
    }
  }
  ${USER_INFO_FRAGMENT}
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...UserInfoFragment
    }
  }
  ${USER_INFO_FRAGMENT}
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`;

// FAMILY LEADER SPECIFIC QUERIES
export const GET_FAMILY_MEMBERS = gql`
  query GetFamilyMembers($familyId: Int!) {
    family(id: $familyId) {
      id
      name
      members {
        id
        full_name
        contact_no
        gender
        birth_date
        no_ministry
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
        ministries {
          id
          name
        }
        createdAt
      }
    }
  }
`;

export const GET_FAMILY_STATS = gql`
  query GetFamilyStats($familyId: Int!) {
    family(id: $familyId) {
      id
      name
      members {
        id
        status {
          id
          name
        }
        role {
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
    }
  }
`;

// ATTENDANCE QUERIES
export const GET_FAMILY_MEETUP = gql`
  query GetFamilyMeetup($id: Int!) {
    familyMeetup(id: $id) {
      ...FamilyMeetupFragment
    }
  }
  ${FAMILY_MEETUP_FRAGMENT}
`;

export const GET_FAMILY_MEETUPS = gql`
  query GetFamilyMeetups(
    $filter: MeetupFilterInput
    $pagination: PaginationInput
  ) {
    familyMeetups(filter: $filter, pagination: $pagination) {
      meetups {
        ...FamilyMeetupFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${FAMILY_MEETUP_FRAGMENT}
`;

export const GET_FAMILY_MEETUP_BATCHES = gql`
  query GetFamilyMeetupBatches(
    $filter: MeetupFilterInput
    $pagination: PaginationInput
  ) {
    familyMeetupBatches(filter: $filter, pagination: $pagination) {
      batches {
        ...FamilyMeetupBatchFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${FAMILY_MEETUP_BATCH_FRAGMENT}
`;

export const GET_FAMILY_MEMBER_ATTENDANCE = gql`
  query GetFamilyMemberAttendance($id: Int!) {
    familyMemberAttendance(id: $id) {
      ...FamilyMemberAttendanceFragment
    }
  }
  ${FAMILY_MEMBER_ATTENDANCE_FRAGMENT}
`;

export const GET_FAMILY_MEMBER_ATTENDANCES = gql`
  query GetFamilyMemberAttendances(
    $filter: AttendanceFilterInput
    $pagination: PaginationInput
  ) {
    familyMemberAttendances(filter: $filter, pagination: $pagination) {
      attendances {
        ...FamilyMemberAttendanceFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${FAMILY_MEMBER_ATTENDANCE_FRAGMENT}
`;

export const GET_MEETUP_ATTENDANCE_STATS = gql`
  query GetMeetupAttendanceStats($meetupId: Int!) {
    meetupAttendanceStats(meetup_id: $meetupId) {
      ...AttendanceStatsFragment
    }
  }
  ${ATTENDANCE_STATS_FRAGMENT}
`;

// ATTENDANCE MUTATIONS
export const CREATE_FAMILY_MEETUP_BATCH = gql`
  mutation CreateFamilyMeetupBatch($input: CreateFamilyMeetupBatchInput!) {
    createFamilyMeetupBatch(input: $input) {
      ...FamilyMeetupBatchFragment
    }
  }
  ${FAMILY_MEETUP_BATCH_FRAGMENT}
`;

export const UPDATE_FAMILY_MEETUP_BATCH = gql`
  mutation UpdateFamilyMeetupBatch($input: UpdateFamilyMeetupBatchInput!) {
    updateFamilyMeetupBatch(input: $input) {
      ...FamilyMeetupBatchFragment
    }
  }
  ${FAMILY_MEETUP_BATCH_FRAGMENT}
`;

export const DELETE_FAMILY_MEETUP_BATCH = gql`
  mutation DeleteFamilyMeetupBatch($id: Int!) {
    deleteFamilyMeetupBatch(id: $id)
  }
`;

export const CREATE_FAMILY_MEETUP = gql`
  mutation CreateFamilyMeetup($input: CreateFamilyMeetupInput!) {
    createFamilyMeetup(input: $input) {
      ...FamilyMeetupFragment
    }
  }
  ${FAMILY_MEETUP_FRAGMENT}
`;

export const UPDATE_FAMILY_MEETUP = gql`
  mutation UpdateFamilyMeetup($input: UpdateFamilyMeetupInput!) {
    updateFamilyMeetup(input: $input) {
      ...FamilyMeetupFragment
    }
  }
  ${FAMILY_MEETUP_FRAGMENT}
`;

export const DELETE_FAMILY_MEETUP = gql`
  mutation DeleteFamilyMeetup($id: Int!) {
    deleteFamilyMeetup(id: $id)
  }
`;

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($input: CreateAttendanceInput!) {
    createAttendance(input: $input) {
      ...FamilyMemberAttendanceFragment
    }
  }
  ${FAMILY_MEMBER_ATTENDANCE_FRAGMENT}
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($input: UpdateAttendanceInput!) {
    updateAttendance(input: $input) {
      ...FamilyMemberAttendanceFragment
    }
  }
  ${FAMILY_MEMBER_ATTENDANCE_FRAGMENT}
`;

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($id: Int!) {
    deleteAttendance(id: $id)
  }
`;

export const BULK_CREATE_ATTENDANCE = gql`
  mutation BulkCreateAttendance($input: BulkAttendanceInput!) {
    bulkCreateAttendance(input: $input) {
      ...FamilyMemberAttendanceFragment
    }
  }
  ${FAMILY_MEMBER_ATTENDANCE_FRAGMENT}
`;

// Ministry Queries
export const GET_MINISTRY = gql`
  query GetMinistry($id: Int!) {
    ministry(id: $id) {
      ...MinistryWithMembersFragment
    }
  }
  ${MINISTRY_WITH_MEMBERS_FRAGMENT}
`;

export const GET_MINISTRIES = gql`
  query GetMinistries {
    ministries {
      ...MinistryFragment
    }
  }
  ${MINISTRY_FRAGMENT}
`;

export const GET_MINISTRY_STATS = gql`
  query GetMinistryStats {
    ministryStats {
      id
      name
      description
      is_active
      program_frequency
      program_day
      createdAt
      updatedAt
      totalMembers
      totalLeaders
      activeMembers
    }
  }
`;

export const GET_MINISTRY_MEMBERS = gql`
  query GetMinistryMembers($ministryId: Int!) {
    ministryMembers(ministryId: $ministryId) {
      ...MemberBasicFragment
    }
  }
  ${MEMBER_BASIC_FRAGMENT}
`;

export const GET_MINISTRY_LEADERS = gql`
  query GetMinistryLeaders($ministryId: Int!) {
    ministryLeaders(ministryId: $ministryId) {
      ...MemberBasicFragment
    }
  }
  ${MEMBER_BASIC_FRAGMENT}
`;

// Ministry Mutations
export const CREATE_MINISTRY = gql`
  mutation CreateMinistry($input: CreateMinistryInput!) {
    createMinistry(input: $input) {
      ...MinistryWithMembersFragment
    }
  }
  ${MINISTRY_WITH_MEMBERS_FRAGMENT}
`;

export const UPDATE_MINISTRY = gql`
  mutation UpdateMinistry($input: UpdateMinistryInput!) {
    updateMinistry(input: $input) {
      ...MinistryWithMembersFragment
    }
  }
  ${MINISTRY_WITH_MEMBERS_FRAGMENT}
`;

export const DELETE_MINISTRY = gql`
  mutation DeleteMinistry($id: Int!) {
    deleteMinistry(id: $id)
  }
`;

export const PROMOTE_MINISTRY_LEADER = gql`
  mutation PromoteMinistryLeader($input: PromoteMinistryLeaderInput!) {
    promoteMinistryLeader(input: $input) {
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
          family {
            id
            name
          }
        }
      }
    }
  }
`;

// =====================
// Follow-up
// =====================

export const FOLLOW_UP_CASE_FRAGMENT = gql`
  fragment FollowUpCaseFragment on FollowUpCase {
    id
    member_id
    status
    source
    first_visit_date
    assigned_to
    assigned_at
    next_follow_up_at
    priority
    outcome_notes
    closed_at
    created_by
    family_id
    createdAt
    updatedAt
    member {
      id
      full_name
      contact_no
      gender
      photo_url
      status_id
      family_id
      location_id
      location_name
      status {
        id
        name
      }
      family {
        id
        name
      }
      location {
        id
        name
      }
    }
    assignee {
      id
      full_name
      contact_no
    }
    creator {
      id
      full_name
    }
    family {
      id
      name
    }
    contacts {
      id
      case_id
      contact_type
      outcome
      notes
      contacted_at
      next_follow_up_at
      recorded_by
      createdAt
      recorder {
        id
        full_name
      }
    }
    assignments {
      id
      case_id
      from_member_id
      to_member_id
      reason
      assigned_by
      assigned_at
      fromMember {
        id
        full_name
      }
      toMember {
        id
        full_name
      }
      assigner {
        id
        full_name
      }
    }
  }
`;

export const GET_FOLLOW_UP_CASES = gql`
  query GetFollowUpCases(
    $filter: FollowUpCaseFilterInput
    $pagination: PaginationInput
  ) {
    followUpCases(filter: $filter, pagination: $pagination) {
      items {
        ...FollowUpCaseFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const GET_MY_FOLLOW_UP_CASES = gql`
  query GetMyFollowUpCases(
    $filter: FollowUpCaseFilterInput
    $pagination: PaginationInput
  ) {
    myFollowUpCases(filter: $filter, pagination: $pagination) {
      items {
        ...FollowUpCaseFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const GET_FOLLOW_UP_CASE = gql`
  query GetFollowUpCase($id: Int!) {
    followUpCase(id: $id) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const GET_FOLLOW_UP_DASHBOARD = gql`
  query GetFollowUpDashboard {
    followUpDashboard {
      newCount
      assignedCount
      inProgressCount
      overdueCount
      joinedThisMonth
      notInterestedCount
      unreachableCount
      movedOutCount
      coordinatorWorkload {
        member_id
        full_name
        openCases
        overdueCases
      }
    }
  }
`;

export const GET_FOLLOW_UP_COORDINATORS = gql`
  query GetFollowUpCoordinators {
    followUpCoordinators {
      id
      full_name
      contact_no
      role {
        id
        name
      }
      roles {
        id
        name
      }
    }
  }
`;

export const INTAKE_NEWCOMER = gql`
  mutation IntakeNewcomer($input: IntakeNewcomerInput!) {
    intakeNewcomer(input: $input) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const ASSIGN_FOLLOW_UP_CASE = gql`
  mutation AssignFollowUpCase($input: AssignFollowUpCaseInput!) {
    assignFollowUpCase(input: $input) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const REASSIGN_FOLLOW_UP_CASE = gql`
  mutation ReassignFollowUpCase($input: AssignFollowUpCaseInput!) {
    reassignFollowUpCase(input: $input) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const LOG_FOLLOW_UP_CONTACT = gql`
  mutation LogFollowUpContact($input: LogFollowUpContactInput!) {
    logFollowUpContact(input: $input) {
      id
      case_id
      contact_type
      outcome
      notes
      contacted_at
      next_follow_up_at
      recorded_by
      recorder {
        id
        full_name
      }
    }
  }
`;

export const UPDATE_FOLLOW_UP_CASE = gql`
  mutation UpdateFollowUpCase($input: UpdateFollowUpCaseInput!) {
    updateFollowUpCase(input: $input) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const GRADUATE_FOLLOW_UP_CASE = gql`
  mutation GraduateFollowUpCase($input: GraduateFollowUpCaseInput!) {
    graduateFollowUpCase(input: $input) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const CLOSE_FOLLOW_UP_CASE = gql`
  mutation CloseFollowUpCase($input: CloseFollowUpCaseInput!) {
    closeFollowUpCase(input: $input) {
      ...FollowUpCaseFragment
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

// ==================== TEENAGERS ====================

export const TEEN_CLASS_FRAGMENT = gql`
  fragment TeenClassFragment on TeenClass {
    id
    name
    description
    createdAt
    updatedAt
    teenCount
    teacherCount
    teenagers {
      id
      full_name
      contact_no
      gender
      photo_url
      birth_date
      location_id
      guardian_name
      guardian_contact
      guardian_relationship
      status
      class_id
      location {
        id
        name
      }
    }
    teachers {
      id
      class_id
      member_id
      is_active
      member {
        id
        full_name
        contact_no
        role {
          id
          name
        }
      }
    }
  }
`;

export const TEENAGER_FRAGMENT = gql`
  fragment TeenagerFragment on Teenager {
    id
    full_name
    contact_no
    gender
    photo_url
    birth_date
    location_id
    guardian_name
    guardian_contact
    guardian_relationship
    class_id
    status
    promoted_member_id
    createdAt
    updatedAt
    teenClass {
      id
      name
    }
    location {
      id
      name
    }
    promotedMember {
      id
      full_name
    }
  }
`;

export const CLASS_SESSION_FRAGMENT = gql`
  fragment ClassSessionFragment on ClassSession {
    id
    batch_id
    class_id
    title
    description
    topic
    session_date
    location
    created_by
    is_active
    createdAt
    updatedAt
    teenClass {
      id
      name
    }
    creator {
      id
      full_name
    }
    attendanceStats {
      total
      present
      absent
      attendanceRate
    }
  }
`;

export const CLASS_SESSION_BATCH_FRAGMENT = gql`
  fragment ClassSessionBatchFragment on ClassSessionBatch {
    id
    title
    description
    session_date
    location
    created_by
    is_active
    createdAt
    updatedAt
    creator {
      id
      full_name
    }
    sessions {
      ...ClassSessionFragment
    }
  }
  ${CLASS_SESSION_FRAGMENT}
`;

export const TEEN_ATTENDANCE_FRAGMENT = gql`
  fragment TeenAttendanceFragment on TeenAttendance {
    id
    session_id
    teenager_id
    is_present
    notes
    recorded_by
    createdAt
    updatedAt
    session {
      id
      title
      session_date
      class_id
      teenClass {
        id
        name
      }
    }
    teenager {
      id
      full_name
      contact_no
    }
    recorder {
      id
      full_name
    }
  }
`;

export const GET_TEEN_CLASSES = gql`
  query GetTeenClasses {
    teenClasses {
      ...TeenClassFragment
    }
  }
  ${TEEN_CLASS_FRAGMENT}
`;

export const GET_MY_TEEN_CLASSES = gql`
  query GetMyTeenClasses {
    myTeenClasses {
      ...TeenClassFragment
    }
  }
  ${TEEN_CLASS_FRAGMENT}
`;

export const GET_TEEN_CLASS = gql`
  query GetTeenClass($id: Int!) {
    teenClass(id: $id) {
      ...TeenClassFragment
    }
  }
  ${TEEN_CLASS_FRAGMENT}
`;

export const GET_TEENAGERS = gql`
  query GetTeenagers(
    $filter: TeenagerFilterInput
    $pagination: PaginationInput
  ) {
    teenagers(filter: $filter, pagination: $pagination) {
      teenagers {
        ...TeenagerFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${TEENAGER_FRAGMENT}
`;

export const GET_TEENAGER = gql`
  query GetTeenager($id: Int!) {
    teenager(id: $id) {
      ...TeenagerFragment
      classHistory {
        id
        from_class_id
        to_class_id
        moved_at
        note
        fromClass {
          id
          name
        }
        toClass {
          id
          name
        }
      }
    }
  }
  ${TEENAGER_FRAGMENT}
`;

export const GET_TEEN_OVERVIEW_STATS = gql`
  query GetTeenOverviewStats {
    teenOverviewStats {
      totalTeenagers
      activeTeenagers
      promotedTeenagers
      totalClasses
      incompleteTeenagers
    }
  }
`;

export const GET_CLASS_SESSIONS = gql`
  query GetClassSessions(
    $filter: ClassSessionFilterInput
    $pagination: PaginationInput
  ) {
    classSessions(filter: $filter, pagination: $pagination) {
      sessions {
        ...ClassSessionFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${CLASS_SESSION_FRAGMENT}
`;

export const GET_CLASS_SESSION = gql`
  query GetClassSession($id: Int!) {
    classSession(id: $id) {
      ...ClassSessionFragment
      attendances {
        ...TeenAttendanceFragment
      }
    }
  }
  ${CLASS_SESSION_FRAGMENT}
  ${TEEN_ATTENDANCE_FRAGMENT}
`;

export const GET_CLASS_SESSION_BATCHES = gql`
  query GetClassSessionBatches(
    $filter: ClassSessionFilterInput
    $pagination: PaginationInput
  ) {
    classSessionBatches(filter: $filter, pagination: $pagination) {
      batches {
        ...ClassSessionBatchFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${CLASS_SESSION_BATCH_FRAGMENT}
`;

export const GET_TEEN_ATTENDANCES = gql`
  query GetTeenAttendances(
    $filter: TeenAttendanceFilterInput
    $pagination: PaginationInput
  ) {
    teenAttendances(filter: $filter, pagination: $pagination) {
      attendances {
        ...TeenAttendanceFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${TEEN_ATTENDANCE_FRAGMENT}
`;

export const CREATE_TEEN_CLASS = gql`
  mutation CreateTeenClass($input: CreateTeenClassInput!) {
    createTeenClass(input: $input) {
      ...TeenClassFragment
    }
  }
  ${TEEN_CLASS_FRAGMENT}
`;

export const UPDATE_TEEN_CLASS = gql`
  mutation UpdateTeenClass($input: UpdateTeenClassInput!) {
    updateTeenClass(input: $input) {
      ...TeenClassFragment
    }
  }
  ${TEEN_CLASS_FRAGMENT}
`;

export const DELETE_TEEN_CLASS = gql`
  mutation DeleteTeenClass($id: Int!) {
    deleteTeenClass(id: $id)
  }
`;

export const CREATE_TEENAGER = gql`
  mutation CreateTeenager($input: CreateTeenagerInput!) {
    createTeenager(input: $input) {
      ...TeenagerFragment
    }
  }
  ${TEENAGER_FRAGMENT}
`;

export const UPDATE_TEENAGER = gql`
  mutation UpdateTeenager($input: UpdateTeenagerInput!) {
    updateTeenager(input: $input) {
      ...TeenagerFragment
    }
  }
  ${TEENAGER_FRAGMENT}
`;

export const DELETE_TEENAGER = gql`
  mutation DeleteTeenager($id: Int!) {
    deleteTeenager(id: $id)
  }
`;

export const TRANSFER_TEENAGER = gql`
  mutation TransferTeenager($input: TransferTeenagerInput!) {
    transferTeenager(input: $input) {
      success
      message
      teenager {
        ...TeenagerFragment
      }
      oldClass {
        id
        name
      }
      newClass {
        id
        name
      }
    }
  }
  ${TEENAGER_FRAGMENT}
`;

export const ASSIGN_CLASS_TEACHER = gql`
  mutation AssignClassTeacher($input: AssignClassTeacherInput!) {
    assignClassTeacher(input: $input) {
      success
      message
      password
      classTeacher {
        id
        class_id
        member_id
        is_active
        member {
          id
          full_name
          contact_no
        }
      }
    }
  }
`;

export const REMOVE_CLASS_TEACHER = gql`
  mutation RemoveClassTeacher($input: RemoveClassTeacherInput!) {
    removeClassTeacher(input: $input)
  }
`;

export const CREATE_CLASS_SESSION_BATCH = gql`
  mutation CreateClassSessionBatch($input: CreateClassSessionBatchInput!) {
    createClassSessionBatch(input: $input) {
      ...ClassSessionBatchFragment
    }
  }
  ${CLASS_SESSION_BATCH_FRAGMENT}
`;

export const UPDATE_CLASS_SESSION_BATCH = gql`
  mutation UpdateClassSessionBatch($input: UpdateClassSessionBatchInput!) {
    updateClassSessionBatch(input: $input) {
      ...ClassSessionBatchFragment
    }
  }
  ${CLASS_SESSION_BATCH_FRAGMENT}
`;

export const UPDATE_CLASS_SESSION = gql`
  mutation UpdateClassSession($input: UpdateClassSessionInput!) {
    updateClassSession(input: $input) {
      ...ClassSessionFragment
    }
  }
  ${CLASS_SESSION_FRAGMENT}
`;

export const DELETE_CLASS_SESSION_BATCH = gql`
  mutation DeleteClassSessionBatch($id: Int!) {
    deleteClassSessionBatch(id: $id)
  }
`;

export const BULK_CREATE_TEEN_ATTENDANCE = gql`
  mutation BulkCreateTeenAttendance($input: BulkTeenAttendanceInput!) {
    bulkCreateTeenAttendance(input: $input) {
      ...TeenAttendanceFragment
    }
  }
  ${TEEN_ATTENDANCE_FRAGMENT}
`;

export const PROMOTE_TEENAGER_TO_MEMBER = gql`
  mutation PromoteTeenagerToMember($input: PromoteTeenagerToMemberInput!) {
    promoteTeenagerToMember(input: $input) {
      success
      message
      password
      teenager {
        ...TeenagerFragment
      }
      member {
        id
        full_name
        contact_no
      }
    }
  }
  ${TEENAGER_FRAGMENT}
`;

// =====================
// Announcements
// =====================

export const ANNOUNCEMENT_FRAGMENT = gql`
  fragment AnnouncementFragment on Announcement {
    id
    title
    body
    status
    created_by
    published_at
    createdAt
    updatedAt
    seenByMe
    seenAt
    seenCount
    expectedCount
    creator {
      id
      full_name
    }
    targets {
      id
      announcement_id
      target_type
      target_value
    }
  }
`;

export const GET_MY_ANNOUNCEMENTS = gql`
  query GetMyAnnouncements($pagination: PaginationInput) {
    myAnnouncements(pagination: $pagination) {
      items {
        ...AnnouncementFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const GET_MY_UNREAD_ANNOUNCEMENT_COUNT = gql`
  query GetMyUnreadAnnouncementCount {
    myUnreadAnnouncementCount
  }
`;

export const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($id: Int!) {
    announcement(id: $id) {
      ...AnnouncementFragment
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const GET_MANAGED_ANNOUNCEMENTS = gql`
  query GetManagedAnnouncements(
    $filter: AnnouncementFilterInput
    $pagination: PaginationInput
  ) {
    managedAnnouncements(filter: $filter, pagination: $pagination) {
      items {
        ...AnnouncementFragment
      }
      total
      page
      limit
      totalPages
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const GET_ANNOUNCEMENT_READS = gql`
  query GetAnnouncementReads($announcementId: Int!) {
    announcementReads(announcementId: $announcementId) {
      announcement_id
      seenCount
      expectedCount
      readers {
        id
        announcement_id
        member_id
        read_at
        member {
          id
          full_name
          contact_no
        }
      }
    }
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      ...AnnouncementFragment
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: Int!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      ...AnnouncementFragment
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const PUBLISH_ANNOUNCEMENT = gql`
  mutation PublishAnnouncement($id: Int!) {
    publishAnnouncement(id: $id) {
      ...AnnouncementFragment
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const ARCHIVE_ANNOUNCEMENT = gql`
  mutation ArchiveAnnouncement($id: Int!) {
    archiveAnnouncement(id: $id) {
      ...AnnouncementFragment
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const MARK_ANNOUNCEMENT_SEEN = gql`
  mutation MarkAnnouncementSeen($id: Int!) {
    markAnnouncementSeen(id: $id) {
      ...AnnouncementFragment
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

// ─── Subscriptions (realtime cache sync) ───────────────────────────────────

export const MEMBER_CHANGED_SUB = gql`
  subscription MemberChanged {
    memberChanged {
      action
      id
      member {
        ...MemberFragment
      }
    }
  }
  ${MEMBER_FRAGMENT}
`;

export const FAMILY_CHANGED_SUB = gql`
  subscription FamilyChanged {
    familyChanged {
      action
      id
      family {
        ...FamilyFragment
      }
    }
  }
  ${FAMILY_FRAGMENT}
`;

export const ANNOUNCEMENT_CHANGED_SUB = gql`
  subscription AnnouncementChanged {
    announcementChanged {
      action
      id
      announcement {
        ...AnnouncementFragment
      }
    }
  }
  ${ANNOUNCEMENT_FRAGMENT}
`;

export const MY_UNREAD_ANNOUNCEMENT_COUNT_SUB = gql`
  subscription MyUnreadAnnouncementCount {
    myUnreadAnnouncementCount {
      memberId
      count
    }
  }
`;

export const FOLLOW_UP_CASE_CHANGED_SUB = gql`
  subscription FollowUpCaseChanged($id: Int) {
    followUpCaseChanged(id: $id) {
      action
      id
      followUpCase {
        ...FollowUpCaseFragment
      }
    }
  }
  ${FOLLOW_UP_CASE_FRAGMENT}
`;

export const FOLLOW_UP_CONTACT_CHANGED_SUB = gql`
  subscription FollowUpContactChanged($caseId: Int) {
    followUpContactChanged(caseId: $caseId) {
      action
      id
      contact {
        id
        case_id
        contact_type
        outcome
        notes
        contacted_at
        next_follow_up_at
        recorded_by
        createdAt
        recorder {
          id
          full_name
        }
      }
    }
  }
`;

export const ACTIVITY_CREATED_SUB = gql`
  subscription ActivityCreated {
    activityCreated {
      ...ActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

export const TEENAGER_CHANGED_SUB = gql`
  subscription TeenagerChanged {
    teenagerChanged {
      action
      id
      teenager {
        ...TeenagerFragment
      }
    }
  }
  ${TEENAGER_FRAGMENT}
`;

export const TEEN_CLASS_CHANGED_SUB = gql`
  subscription TeenClassChanged {
    teenClassChanged {
      action
      id
      teenClass {
        ...TeenClassFragment
      }
    }
  }
  ${TEEN_CLASS_FRAGMENT}
`;

export const CLASS_SESSION_CHANGED_SUB = gql`
  subscription ClassSessionChanged($classId: Int) {
    classSessionChanged(classId: $classId) {
      action
      id
      classSession {
        ...ClassSessionFragment
      }
    }
  }
  ${CLASS_SESSION_FRAGMENT}
`;

export const FAMILY_MEETUP_CHANGED_SUB = gql`
  subscription FamilyMeetupChanged {
    familyMeetupChanged {
      action
      id
      familyMeetup {
        ...FamilyMeetupFragment
      }
    }
  }
  ${FAMILY_MEETUP_FRAGMENT}
`;

export const ATTENDANCE_CHANGED_SUB = gql`
  subscription AttendanceChanged {
    attendanceChanged {
      action
      id
      attendance {
        ...FamilyMemberAttendanceFragment
      }
    }
  }
  ${FAMILY_MEMBER_ATTENDANCE_FRAGMENT}
`;

export const TEEN_ATTENDANCE_CHANGED_SUB = gql`
  subscription TeenAttendanceChanged {
    teenAttendanceChanged {
      action
      id
      attendance {
        ...TeenAttendanceFragment
      }
    }
  }
  ${TEEN_ATTENDANCE_FRAGMENT}
`;

export const MINISTRY_CHANGED_SUB = gql`
  subscription MinistryChanged {
    ministryChanged {
      action
      id
      ministry {
        ...MinistryFragment
      }
    }
  }
  ${MINISTRY_FRAGMENT}
`;

export const LOCATION_CHANGED_SUB = gql`
  subscription LocationChanged {
    locationChanged {
      action
      id
      location {
        ...LocationFragment
      }
    }
  }
  ${LOCATION_FRAGMENT}
`;

export const PROFESSION_CHANGED_SUB = gql`
  subscription ProfessionChanged {
    professionChanged {
      action
      id
      profession {
        ...ProfessionFragment
      }
    }
  }
  ${PROFESSION_FRAGMENT}
`;

export const ROLE_CHANGED_SUB = gql`
  subscription RoleChanged {
    roleChanged {
      action
      id
      role {
        ...RoleFragment
      }
    }
  }
  ${ROLE_FRAGMENT}
`;

export const STATUS_CHANGED_SUB = gql`
  subscription StatusChanged {
    statusChanged {
      action
      id
      status {
        ...StatusFragment
      }
    }
  }
  ${STATUS_FRAGMENT}
`;
