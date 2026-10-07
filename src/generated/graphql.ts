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
  member_id?: Maybe<Scalars['Int']['output']>;
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

export type AddMemberToMinistryInput = {
  member_id: Scalars['Int']['input'];
  ministry_id: Scalars['Int']['input'];
};

export type AddMinistryLeaderInput = {
  leader_id: Scalars['Int']['input'];
  ministry_id: Scalars['Int']['input'];
};

export type Announcement = {
  __typename?: 'Announcement';
  body: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  created_by: Scalars['Int']['output'];
  creator?: Maybe<Member>;
  expectedCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  published_at?: Maybe<Scalars['String']['output']>;
  seenAt?: Maybe<Scalars['String']['output']>;
  seenByMe: Scalars['Boolean']['output'];
  seenCount?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  targets: Array<AnnouncementTarget>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type AnnouncementChangePayload = {
  __typename?: 'AnnouncementChangePayload';
  action: ChangeAction;
  announcement?: Maybe<Announcement>;
  id: Scalars['Int']['output'];
};

export type AnnouncementFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AnnouncementRead = {
  __typename?: 'AnnouncementRead';
  announcement_id: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  member: Member;
  member_id: Scalars['Int']['output'];
  read_at: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type AnnouncementReadStats = {
  __typename?: 'AnnouncementReadStats';
  announcement_id: Scalars['Int']['output'];
  expectedCount: Scalars['Int']['output'];
  readers: Array<AnnouncementRead>;
  seenCount: Scalars['Int']['output'];
};

export type AnnouncementTarget = {
  __typename?: 'AnnouncementTarget';
  announcement_id: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  target_type: Scalars['String']['output'];
  target_value: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type AnnouncementTargetInput = {
  target_type: Scalars['String']['input'];
  target_value?: InputMaybe<Scalars['String']['input']>;
};

export type AssignClassTeacherInput = {
  class_id: Scalars['Int']['input'];
  member_id: Scalars['Int']['input'];
};

export type AssignClassTeacherResponse = {
  __typename?: 'AssignClassTeacherResponse';
  classTeacher?: Maybe<ClassTeacher>;
  message: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<UserInfo>;
};

export type AssignFollowUpCaseInput = {
  assigned_to: Scalars['Int']['input'];
  case_id: Scalars['Int']['input'];
  next_follow_up_at?: InputMaybe<Scalars['String']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type AttendanceChangePayload = {
  __typename?: 'AttendanceChangePayload';
  action: ChangeAction;
  attendance?: Maybe<FamilyMemberAttendance>;
  id: Scalars['Int']['output'];
};

export type AttendanceFilterInput = {
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  is_present?: InputMaybe<Scalars['Boolean']['input']>;
  meetup_id?: InputMaybe<Scalars['Int']['input']>;
  member_id?: InputMaybe<Scalars['Int']['input']>;
  recorded_by?: InputMaybe<Scalars['Int']['input']>;
};

export type AttendanceStats = {
  __typename?: 'AttendanceStats';
  absentMembers: Scalars['Int']['output'];
  attendanceRate: Scalars['Float']['output'];
  presentMembers: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
};

export type AuthUser = {
  __typename?: 'AuthUser';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type BulkAttendanceInput = {
  attendances: Array<CreateAttendanceInput>;
  meetup_id: Scalars['Int']['input'];
};

export type BulkTeenAttendanceInput = {
  attendances: Array<BulkTeenAttendanceItemInput>;
  session_id: Scalars['Int']['input'];
};

export type BulkTeenAttendanceItemInput = {
  is_present: Scalars['Boolean']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  teenager_id: Scalars['Int']['input'];
};

export type ChangeAction =
  | 'CREATED'
  | 'DELETED'
  | 'UPDATED';

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ClassSession = {
  __typename?: 'ClassSession';
  attendanceStats?: Maybe<TeenAttendanceStats>;
  attendances?: Maybe<Array<TeenAttendance>>;
  batch?: Maybe<ClassSessionBatch>;
  batch_id?: Maybe<Scalars['Int']['output']>;
  class_id: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  created_by: Scalars['Int']['output'];
  creator?: Maybe<Member>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  session_date: Scalars['String']['output'];
  teenClass?: Maybe<TeenClass>;
  title: Scalars['String']['output'];
  topic?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ClassSessionBatch = {
  __typename?: 'ClassSessionBatch';
  createdAt: Scalars['String']['output'];
  created_by: Scalars['Int']['output'];
  creator?: Maybe<Member>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  session_date: Scalars['String']['output'];
  sessions?: Maybe<Array<ClassSession>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ClassSessionChangePayload = {
  __typename?: 'ClassSessionChangePayload';
  action: ChangeAction;
  classSession?: Maybe<ClassSession>;
  id: Scalars['Int']['output'];
};

export type ClassSessionFilterInput = {
  batch_id?: InputMaybe<Scalars['Int']['input']>;
  class_id?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  session_date?: InputMaybe<Scalars['String']['input']>;
};

export type ClassTeacher = {
  __typename?: 'ClassTeacher';
  class_id: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  member?: Maybe<Member>;
  member_id: Scalars['Int']['output'];
  teenClass?: Maybe<TeenClass>;
  updatedAt: Scalars['String']['output'];
};

export type CloseFollowUpCaseInput = {
  case_id: Scalars['Int']['input'];
  outcome_notes?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type CreateAnnouncementInput = {
  body: Scalars['String']['input'];
  publish?: InputMaybe<Scalars['Boolean']['input']>;
  targets: Array<AnnouncementTargetInput>;
  title: Scalars['String']['input'];
};

export type CreateAttendanceInput = {
  is_present: Scalars['Boolean']['input'];
  meetup_id: Scalars['Int']['input'];
  member_id: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type CreateClassSessionBatchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  session_date: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateFamilyInput = {
  name: Scalars['String']['input'];
};

export type CreateFamilyMeetupBatchInput = {
  description: Scalars['String']['input'];
  location: Scalars['String']['input'];
  meetup_date: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateFamilyMeetupInput = {
  description: Scalars['String']['input'];
  family_id?: InputMaybe<Scalars['Int']['input']>;
  location: Scalars['String']['input'];
  meetup_date: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateLocationInput = {
  name: Scalars['String']['input'];
};

export type CreateMemberInput = {
  birth_date?: InputMaybe<Scalars['String']['input']>;
  contact_no?: InputMaybe<Scalars['String']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  full_name: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  location_name?: InputMaybe<Scalars['String']['input']>;
  ministry_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** When true, member has no ministry by choice. Ignored if ministry_ids is non-empty. */
  no_ministry?: InputMaybe<Scalars['Boolean']['input']>;
  /** When true, member is not employed by choice. Ignored if profession_id or profession_name is set. */
  not_employed?: InputMaybe<Scalars['Boolean']['input']>;
  photo_url?: InputMaybe<Scalars['String']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  profession_name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['Int']['input']>;
  /** Assign multiple roles by id. When set, overrides singular role_id for the join table. */
  role_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMinistryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  program_day?: InputMaybe<Scalars['String']['input']>;
  program_frequency?: InputMaybe<MinistryProgramFrequency>;
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

export type CreateTeenAttendanceInput = {
  is_present: Scalars['Boolean']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  session_id: Scalars['Int']['input'];
  teenager_id: Scalars['Int']['input'];
};

export type CreateTeenClassInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTeenagerInput = {
  birth_date?: InputMaybe<Scalars['String']['input']>;
  class_id: Scalars['Int']['input'];
  contact_no?: InputMaybe<Scalars['String']['input']>;
  full_name: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  guardian_contact?: InputMaybe<Scalars['String']['input']>;
  guardian_name?: InputMaybe<Scalars['String']['input']>;
  guardian_relationship?: InputMaybe<Scalars['String']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  photo_url?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TeenStatus>;
};

export type Family = {
  __typename?: 'Family';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  meetups: Array<FamilyMeetup>;
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FamilyChangePayload = {
  __typename?: 'FamilyChangePayload';
  action: ChangeAction;
  family?: Maybe<Family>;
  id: Scalars['Int']['output'];
};

export type FamilyMeetup = {
  __typename?: 'FamilyMeetup';
  attendances?: Maybe<Array<FamilyMemberAttendance>>;
  batch?: Maybe<FamilyMeetupBatch>;
  batch_id?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['String']['output'];
  created_by: Scalars['Int']['output'];
  creator: Member;
  description: Scalars['String']['output'];
  family: Family;
  family_id: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  meetup_date: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FamilyMeetupBatch = {
  __typename?: 'FamilyMeetupBatch';
  createdAt: Scalars['String']['output'];
  created_by: Scalars['Int']['output'];
  creator: Member;
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  meetup_date: Scalars['String']['output'];
  meetups: Array<FamilyMeetup>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FamilyMeetupChangePayload = {
  __typename?: 'FamilyMeetupChangePayload';
  action: ChangeAction;
  familyMeetup?: Maybe<FamilyMeetup>;
  id: Scalars['Int']['output'];
};

export type FamilyMemberAttendance = {
  __typename?: 'FamilyMemberAttendance';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_present: Scalars['Boolean']['output'];
  meetup: FamilyMeetup;
  meetup_id: Scalars['Int']['output'];
  member: Member;
  member_id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recorded_by: Scalars['Int']['output'];
  recorder: Member;
  updatedAt: Scalars['String']['output'];
};

export type FamilyPlacementNeed = {
  __typename?: 'FamilyPlacementNeed';
  activeMemberCount: Scalars['Int']['output'];
  averageActiveSize: Scalars['Float']['output'];
  femaleCount: Scalars['Int']['output'];
  genderSkew: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  maleCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  needReasons: Array<Scalars['String']['output']>;
  needsMembers: Scalars['Boolean']['output'];
  sizeDeficit: Scalars['Float']['output'];
  suggestedNewcomers: Array<FamilyPlacementSuggestion>;
  unknownGenderCount: Scalars['Int']['output'];
};

export type FamilyPlacementSuggestion = {
  __typename?: 'FamilyPlacementSuggestion';
  followUpCaseId: Scalars['Int']['output'];
  fullName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  memberId: Scalars['Int']['output'];
  priority?: Maybe<Scalars['String']['output']>;
  reason: Scalars['String']['output'];
};

export type FamilySummary = {
  __typename?: 'FamilySummary';
  completeMemberCount: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  fullyIncompleteMemberCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  incompleteMemberCount: Scalars['Int']['output'];
  isFullyIncomplete: Scalars['Boolean']['output'];
  location?: Maybe<Location>;
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type FollowUpAssignment = {
  __typename?: 'FollowUpAssignment';
  assigned_at: Scalars['String']['output'];
  assigned_by: Scalars['Int']['output'];
  assigner: Member;
  case_id: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  fromMember?: Maybe<Member>;
  from_member_id?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  toMember: Member;
  to_member_id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FollowUpCase = {
  __typename?: 'FollowUpCase';
  assigned_at?: Maybe<Scalars['String']['output']>;
  assigned_to?: Maybe<Scalars['Int']['output']>;
  assignee?: Maybe<Member>;
  assignments: Array<FollowUpAssignment>;
  closed_at?: Maybe<Scalars['String']['output']>;
  contacts: Array<FollowUpContact>;
  createdAt: Scalars['String']['output'];
  created_by?: Maybe<Scalars['Int']['output']>;
  creator?: Maybe<Member>;
  family?: Maybe<Family>;
  family_id?: Maybe<Scalars['Int']['output']>;
  first_visit_date?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  member: Member;
  member_id: Scalars['Int']['output'];
  next_follow_up_at?: Maybe<Scalars['String']['output']>;
  outcome_notes?: Maybe<Scalars['String']['output']>;
  priority: Scalars['String']['output'];
  source?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FollowUpCaseChangePayload = {
  __typename?: 'FollowUpCaseChangePayload';
  action: ChangeAction;
  followUpCase?: Maybe<FollowUpCase>;
  id: Scalars['Int']['output'];
};

export type FollowUpCaseFilterInput = {
  assignedTo?: InputMaybe<Scalars['Int']['input']>;
  /** When true, only cases with no suggested family_id. */
  noFamilySuggested?: InputMaybe<Scalars['Boolean']['input']>;
  openOnly?: InputMaybe<Scalars['Boolean']['input']>;
  overdue?: InputMaybe<Scalars['Boolean']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
  unassigned?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FollowUpContact = {
  __typename?: 'FollowUpContact';
  case_id: Scalars['Int']['output'];
  contact_type: Scalars['String']['output'];
  contacted_at: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  next_follow_up_at?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  outcome: Scalars['String']['output'];
  recorded_by: Scalars['Int']['output'];
  recorder: Member;
  updatedAt: Scalars['String']['output'];
};

export type FollowUpContactChangePayload = {
  __typename?: 'FollowUpContactChangePayload';
  action: ChangeAction;
  contact?: Maybe<FollowUpContact>;
  id: Scalars['Int']['output'];
};

export type FollowUpCoordinatorWorkload = {
  __typename?: 'FollowUpCoordinatorWorkload';
  full_name: Scalars['String']['output'];
  member_id: Scalars['Int']['output'];
  openCases: Scalars['Int']['output'];
  overdueCases: Scalars['Int']['output'];
};

export type FollowUpDashboard = {
  __typename?: 'FollowUpDashboard';
  assignedCount: Scalars['Int']['output'];
  coordinatorWorkload: Array<FollowUpCoordinatorWorkload>;
  inProgressCount: Scalars['Int']['output'];
  joinedThisMonth: Scalars['Int']['output'];
  movedOutCount: Scalars['Int']['output'];
  newCount: Scalars['Int']['output'];
  notInterestedCount: Scalars['Int']['output'];
  overdueCount: Scalars['Int']['output'];
  unreachableCount: Scalars['Int']['output'];
};

export type GraduateFollowUpCaseInput = {
  assignFamilyMemberRole?: InputMaybe<Scalars['Boolean']['input']>;
  case_id: Scalars['Int']['input'];
  family_id?: InputMaybe<Scalars['Int']['input']>;
  outcome_notes?: InputMaybe<Scalars['String']['input']>;
};

export type IntakeNewcomerInput = {
  assigned_to?: InputMaybe<Scalars['Int']['input']>;
  contact_no?: InputMaybe<Scalars['String']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  first_visit_date?: InputMaybe<Scalars['String']['input']>;
  full_name: Scalars['String']['input'];
  gender?: InputMaybe<Scalars['String']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  location_name?: InputMaybe<Scalars['String']['input']>;
  next_follow_up_at?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  photo_url?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type Location = {
  __typename?: 'Location';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type LocationChangePayload = {
  __typename?: 'LocationChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  location?: Maybe<Location>;
};

export type LocationSummary = {
  __typename?: 'LocationSummary';
  createdAt: Scalars['String']['output'];
  familyCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type LogFollowUpContactInput = {
  case_id: Scalars['Int']['input'];
  contact_type: Scalars['String']['input'];
  contacted_at?: InputMaybe<Scalars['String']['input']>;
  next_follow_up_at?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  outcome: Scalars['String']['input'];
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

export type MeetupFilterInput = {
  created_by?: InputMaybe<Scalars['Int']['input']>;
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Member = {
  __typename?: 'Member';
  birth_date?: Maybe<Scalars['String']['output']>;
  contact_no?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  family?: Maybe<Family>;
  family_id?: Maybe<Scalars['Int']['output']>;
  full_name: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ledMinistries: Array<Ministry>;
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['Int']['output']>;
  location_name?: Maybe<Scalars['String']['output']>;
  ministries: Array<Ministry>;
  /** True when the member explicitly has no ministry (profile treated as complete for ministry). */
  no_ministry: Scalars['Boolean']['output'];
  /** True when the member is explicitly not employed (profile treated as complete for profession). */
  not_employed: Scalars['Boolean']['output'];
  photo_url?: Maybe<Scalars['String']['output']>;
  profession?: Maybe<Profession>;
  profession_id?: Maybe<Scalars['Int']['output']>;
  profession_name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
  role_id?: Maybe<Scalars['Int']['output']>;
  /** All roles assigned to this member (supports multiple leadership roles). */
  roles: Array<Role>;
  status?: Maybe<Status>;
  status_id?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type MemberChangePayload = {
  __typename?: 'MemberChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  member?: Maybe<Member>;
};

export type MemberFilterInput = {
  family_id?: InputMaybe<Scalars['Int']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  ministry_id?: InputMaybe<Scalars['Int']['input']>;
  ministry_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** When true, only members with no ministry assignment (not in any ministry). */
  no_ministry?: InputMaybe<Scalars['Boolean']['input']>;
  /** When true, only members with no profession assignment (profession_id is null). */
  not_employed?: InputMaybe<Scalars['Boolean']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Filter members that have this role abbreviation (e.g. TT, FL, ML).
   * Matches primary role or multi-role assignments.
   */
  role_name?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
  /** When true, only members with no family_id. */
  unassigned?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MemberInfo = {
  __typename?: 'MemberInfo';
  contact_no?: Maybe<Scalars['String']['output']>;
  family?: Maybe<Family>;
  full_name: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  ledMinistries: Array<Ministry>;
  ministries: Array<Ministry>;
  photo_url?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  status?: Maybe<Status>;
};

export type Ministry = {
  __typename?: 'Ministry';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  leaders: Array<Member>;
  members: Array<Member>;
  name: Scalars['String']['output'];
  /** Weekday for the regular program (e.g. Monday). */
  program_day?: Maybe<Scalars['String']['output']>;
  /** Regular program cadence (WEEKLY, BI_MONTHLY, MONTHLY). */
  program_frequency?: Maybe<MinistryProgramFrequency>;
  updatedAt: Scalars['String']['output'];
};

export type MinistryChangePayload = {
  __typename?: 'MinistryChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  ministry?: Maybe<Ministry>;
};

/** How often the ministry holds its regular program. */
export type MinistryProgramFrequency =
  | 'BI_MONTHLY'
  | 'MONTHLY'
  | 'WEEKLY';

export type MinistryStats = {
  __typename?: 'MinistryStats';
  activeMembers: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  program_day?: Maybe<Scalars['String']['output']>;
  program_frequency?: Maybe<MinistryProgramFrequency>;
  totalLeaders: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMemberToMinistry: Scalars['Boolean']['output'];
  addMinistryLeader: Scalars['Boolean']['output'];
  archiveAnnouncement: Announcement;
  assignClassTeacher: AssignClassTeacherResponse;
  assignFollowUpCase: FollowUpCase;
  bulkCreateAttendance: Array<FamilyMemberAttendance>;
  bulkCreateTeenAttendance: Array<TeenAttendance>;
  changePassword: Scalars['Boolean']['output'];
  closeFollowUpCase: FollowUpCase;
  createAnnouncement: Announcement;
  createAttendance: FamilyMemberAttendance;
  createClassSessionBatch: ClassSessionBatch;
  createFamily: Family;
  createFamilyMeetup: FamilyMeetup;
  createFamilyMeetupBatch: FamilyMeetupBatch;
  createLocation: Location;
  createMember: Member;
  createMinistry: Ministry;
  createProfession: Profession;
  createRole: Role;
  createStatus: Status;
  createTeenAttendance: TeenAttendance;
  createTeenClass: TeenClass;
  createTeenager: Teenager;
  deleteAttendance: Scalars['Boolean']['output'];
  deleteClassSessionBatch: Scalars['Boolean']['output'];
  deleteFamily: Scalars['Boolean']['output'];
  deleteFamilyMeetup: Scalars['Boolean']['output'];
  deleteFamilyMeetupBatch: Scalars['Boolean']['output'];
  deleteLocation: Scalars['Boolean']['output'];
  deleteMember: Scalars['Boolean']['output'];
  deleteMinistry: Scalars['Boolean']['output'];
  deleteProfession: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteStatus: Scalars['Boolean']['output'];
  deleteTeenAttendance: Scalars['Boolean']['output'];
  deleteTeenClass: Scalars['Boolean']['output'];
  deleteTeenager: Scalars['Boolean']['output'];
  graduateFollowUpCase: FollowUpCase;
  intakeNewcomer: FollowUpCase;
  logFollowUpContact: FollowUpContact;
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  markAnnouncementSeen: Announcement;
  promoteMember: PromoteMemberResponse;
  promoteMinistryLeader: PromoteMinistryLeaderResponse;
  promoteTeenagerToMember: PromoteTeenagerToMemberResponse;
  publishAnnouncement: Announcement;
  reassignFollowUpCase: FollowUpCase;
  removeClassTeacher: Scalars['Boolean']['output'];
  removeMemberFromMinistry: Scalars['Boolean']['output'];
  removeMinistryLeader: Scalars['Boolean']['output'];
  resetPassword: ResetPasswordResponse;
  transferMember: TransferMemberResponse;
  transferTeenager: TransferTeenagerResponse;
  updateAnnouncement: Announcement;
  updateAttendance: FamilyMemberAttendance;
  updateClassSession: ClassSession;
  updateClassSessionBatch: ClassSessionBatch;
  updateFamily: Family;
  updateFamilyMeetup: FamilyMeetup;
  updateFamilyMeetupBatch: FamilyMeetupBatch;
  updateFollowUpCase: FollowUpCase;
  updateLocation: Location;
  updateMember: Member;
  updateMinistry: Ministry;
  updateProfession: Profession;
  updateProfile: UserInfo;
  updateRole: Role;
  updateStatus: Status;
  updateTeenAttendance: TeenAttendance;
  updateTeenClass: TeenClass;
  updateTeenager: Teenager;
};


export type MutationAddMemberToMinistryArgs = {
  input: AddMemberToMinistryInput;
};


export type MutationAddMinistryLeaderArgs = {
  input: AddMinistryLeaderInput;
};


export type MutationArchiveAnnouncementArgs = {
  id: Scalars['Int']['input'];
};


export type MutationAssignClassTeacherArgs = {
  input: AssignClassTeacherInput;
};


export type MutationAssignFollowUpCaseArgs = {
  input: AssignFollowUpCaseInput;
};


export type MutationBulkCreateAttendanceArgs = {
  input: BulkAttendanceInput;
};


export type MutationBulkCreateTeenAttendanceArgs = {
  input: BulkTeenAttendanceInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCloseFollowUpCaseArgs = {
  input: CloseFollowUpCaseInput;
};


export type MutationCreateAnnouncementArgs = {
  input: CreateAnnouncementInput;
};


export type MutationCreateAttendanceArgs = {
  input: CreateAttendanceInput;
};


export type MutationCreateClassSessionBatchArgs = {
  input: CreateClassSessionBatchInput;
};


export type MutationCreateFamilyArgs = {
  input: CreateFamilyInput;
};


export type MutationCreateFamilyMeetupArgs = {
  input: CreateFamilyMeetupInput;
};


export type MutationCreateFamilyMeetupBatchArgs = {
  input: CreateFamilyMeetupBatchInput;
};


export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};


export type MutationCreateMemberArgs = {
  input: CreateMemberInput;
};


export type MutationCreateMinistryArgs = {
  input: CreateMinistryInput;
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


export type MutationCreateTeenAttendanceArgs = {
  input: CreateTeenAttendanceInput;
};


export type MutationCreateTeenClassArgs = {
  input: CreateTeenClassInput;
};


export type MutationCreateTeenagerArgs = {
  input: CreateTeenagerInput;
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteClassSessionBatchArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteFamilyArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteFamilyMeetupArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteFamilyMeetupBatchArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteLocationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteMemberArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteMinistryArgs = {
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


export type MutationDeleteTeenAttendanceArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTeenClassArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteTeenagerArgs = {
  id: Scalars['Int']['input'];
};


export type MutationGraduateFollowUpCaseArgs = {
  input: GraduateFollowUpCaseInput;
};


export type MutationIntakeNewcomerArgs = {
  input: IntakeNewcomerInput;
};


export type MutationLogFollowUpContactArgs = {
  input: LogFollowUpContactInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkAnnouncementSeenArgs = {
  id: Scalars['Int']['input'];
};


export type MutationPromoteMemberArgs = {
  input: PromoteMemberInput;
};


export type MutationPromoteMinistryLeaderArgs = {
  input: PromoteMinistryLeaderInput;
};


export type MutationPromoteTeenagerToMemberArgs = {
  input: PromoteTeenagerToMemberInput;
};


export type MutationPublishAnnouncementArgs = {
  id: Scalars['Int']['input'];
};


export type MutationReassignFollowUpCaseArgs = {
  input: AssignFollowUpCaseInput;
};


export type MutationRemoveClassTeacherArgs = {
  input: RemoveClassTeacherInput;
};


export type MutationRemoveMemberFromMinistryArgs = {
  input: RemoveMemberFromMinistryInput;
};


export type MutationRemoveMinistryLeaderArgs = {
  input: RemoveMinistryLeaderInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationTransferMemberArgs = {
  input: TransferMemberInput;
};


export type MutationTransferTeenagerArgs = {
  input: TransferTeenagerInput;
};


export type MutationUpdateAnnouncementArgs = {
  id: Scalars['Int']['input'];
  input: UpdateAnnouncementInput;
};


export type MutationUpdateAttendanceArgs = {
  input: UpdateAttendanceInput;
};


export type MutationUpdateClassSessionArgs = {
  input: UpdateClassSessionInput;
};


export type MutationUpdateClassSessionBatchArgs = {
  input: UpdateClassSessionBatchInput;
};


export type MutationUpdateFamilyArgs = {
  input: UpdateFamilyInput;
};


export type MutationUpdateFamilyMeetupArgs = {
  input: UpdateFamilyMeetupInput;
};


export type MutationUpdateFamilyMeetupBatchArgs = {
  input: UpdateFamilyMeetupBatchInput;
};


export type MutationUpdateFollowUpCaseArgs = {
  input: UpdateFollowUpCaseInput;
};


export type MutationUpdateLocationArgs = {
  input: UpdateLocationInput;
};


export type MutationUpdateMemberArgs = {
  input: UpdateMemberInput;
};


export type MutationUpdateMinistryArgs = {
  input: UpdateMinistryInput;
};


export type MutationUpdateProfessionArgs = {
  input: UpdateProfessionInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateStatusArgs = {
  input: UpdateStatusInput;
};


export type MutationUpdateTeenAttendanceArgs = {
  input: UpdateTeenAttendanceInput;
};


export type MutationUpdateTeenClassArgs = {
  input: UpdateTeenClassInput;
};


export type MutationUpdateTeenagerArgs = {
  input: UpdateTeenagerInput;
};

export type OverviewStats = {
  __typename?: 'OverviewStats';
  activeMembers: Scalars['Int']['output'];
  fullyIncompleteFamiliesCount: Scalars['Int']['output'];
  inactiveMembers: Scalars['Int']['output'];
  incompleteFamiliesCount: Scalars['Int']['output'];
  locationAllocatedMembers: Scalars['Int']['output'];
  locationUnallocatedMembers: Scalars['Int']['output'];
  ministryAllocatedMembers: Scalars['Int']['output'];
  ministryUnallocatedMembers: Scalars['Int']['output'];
  movedOutMembers: Scalars['Int']['output'];
  newMembers: Scalars['Int']['output'];
  notActiveMembers: Scalars['Int']['output'];
  /** Open follow-up newcomers not yet graduated into a family. */
  openNewcomers: Scalars['Int']['output'];
  professionAllocatedMembers: Scalars['Int']['output'];
  professionUnallocatedMembers: Scalars['Int']['output'];
  totalFamilies: Scalars['Int']['output'];
  totalLocations: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
  totalProfessions: Scalars['Int']['output'];
  /** Members with no family assignment (excludes Moved out). */
  unassignedMembers: Scalars['Int']['output'];
};

export type PaginatedActivities = {
  __typename?: 'PaginatedActivities';
  activities: Array<Activity>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedAnnouncements = {
  __typename?: 'PaginatedAnnouncements';
  items: Array<Announcement>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedAttendances = {
  __typename?: 'PaginatedAttendances';
  attendances: Array<FamilyMemberAttendance>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedClassSessionBatches = {
  __typename?: 'PaginatedClassSessionBatches';
  batches: Array<ClassSessionBatch>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedClassSessions = {
  __typename?: 'PaginatedClassSessions';
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  sessions: Array<ClassSession>;
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedFollowUpCases = {
  __typename?: 'PaginatedFollowUpCases';
  items: Array<FollowUpCase>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedMeetupBatches = {
  __typename?: 'PaginatedMeetupBatches';
  batches: Array<FamilyMeetupBatch>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedMeetups = {
  __typename?: 'PaginatedMeetups';
  limit: Scalars['Int']['output'];
  meetups: Array<FamilyMeetup>;
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

export type PaginatedTeenAttendances = {
  __typename?: 'PaginatedTeenAttendances';
  attendances: Array<TeenAttendance>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedTeenagers = {
  __typename?: 'PaginatedTeenagers';
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  teenagers: Array<Teenager>;
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** Person already registered with a given phone number. */
export type PhoneLookupResult = {
  __typename?: 'PhoneLookupResult';
  class_name?: Maybe<Scalars['String']['output']>;
  contact_no?: Maybe<Scalars['String']['output']>;
  family_name?: Maybe<Scalars['String']['output']>;
  full_name: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  status?: Maybe<Scalars['String']['output']>;
  type: PhoneOwnerType;
};

export type PhoneOwnerType =
  | 'MEMBER'
  | 'TEENAGER';

export type Profession = {
  __typename?: 'Profession';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ProfessionChangePayload = {
  __typename?: 'ProfessionChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  profession?: Maybe<Profession>;
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
  /** Legacy single role; used when `roles` is omitted. */
  role?: InputMaybe<Scalars['String']['input']>;
  /** Preferred: full set of roles to assign. */
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PromoteMemberResponse = {
  __typename?: 'PromoteMemberResponse';
  message: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<UserInfo>;
};

export type PromoteMinistryLeaderInput = {
  member_id: Scalars['Int']['input'];
  ministry_id: Scalars['Int']['input'];
};

export type PromoteMinistryLeaderResponse = {
  __typename?: 'PromoteMinistryLeaderResponse';
  message: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<UserInfo>;
};

export type PromoteTeenagerToMemberInput = {
  contact_no?: InputMaybe<Scalars['String']['input']>;
  create_login?: InputMaybe<Scalars['Boolean']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  location_name?: InputMaybe<Scalars['String']['input']>;
  ministry_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** When true, promoted member has no ministry by choice. Ignored if ministry_ids is non-empty. */
  no_ministry?: InputMaybe<Scalars['Boolean']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  profession_name?: InputMaybe<Scalars['String']['input']>;
  role_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
  teenager_id: Scalars['Int']['input'];
};

export type PromoteTeenagerToMemberResponse = {
  __typename?: 'PromoteTeenagerToMemberResponse';
  member?: Maybe<Member>;
  message: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  teenager?: Maybe<Teenager>;
  user?: Maybe<UserInfo>;
};

export type Query = {
  __typename?: 'Query';
  activities: PaginatedActivities;
  announcement?: Maybe<Announcement>;
  announcementReads: AnnouncementReadStats;
  classSession?: Maybe<ClassSession>;
  classSessionBatch?: Maybe<ClassSessionBatch>;
  classSessionBatches: PaginatedClassSessionBatches;
  classSessions: PaginatedClassSessions;
  families: Array<Family>;
  family?: Maybe<Family>;
  familyMeetup?: Maybe<FamilyMeetup>;
  familyMeetupBatch?: Maybe<FamilyMeetupBatch>;
  familyMeetupBatches: PaginatedMeetupBatches;
  familyMeetups: PaginatedMeetups;
  familyMemberAttendance?: Maybe<FamilyMemberAttendance>;
  familyMemberAttendances: PaginatedAttendances;
  familyPlacementNeeds: Array<FamilyPlacementNeed>;
  familySummaries: Array<FamilySummary>;
  followUpCase?: Maybe<FollowUpCase>;
  followUpCases: PaginatedFollowUpCases;
  followUpCoordinators: Array<Member>;
  followUpDashboard: FollowUpDashboard;
  incompleteFamilies: Array<FamilySummary>;
  location?: Maybe<Location>;
  locationSummaries: Array<LocationSummary>;
  locations: Array<Location>;
  /** Look up members/teenagers that already use this phone number. */
  lookupByPhone: Array<PhoneLookupResult>;
  managedAnnouncements: PaginatedAnnouncements;
  me: UserInfo;
  meetupAttendanceStats: AttendanceStats;
  member?: Maybe<Member>;
  members: PaginatedMembers;
  ministries: Array<Ministry>;
  ministry?: Maybe<Ministry>;
  ministryLeaders: Array<Member>;
  ministryMembers: Array<Member>;
  ministryStats: Array<MinistryStats>;
  myAnnouncements: PaginatedAnnouncements;
  myFollowUpCases: PaginatedFollowUpCases;
  myTeenClasses: Array<TeenClass>;
  myUnreadAnnouncementCount: Scalars['Int']['output'];
  overviewStats: OverviewStats;
  profession?: Maybe<Profession>;
  professionSummaries: Array<ProfessionSummary>;
  professions: Array<Profession>;
  recentActivities: Array<Activity>;
  recentMembers: Array<RecentMember>;
  role?: Maybe<Role>;
  roles: Array<Role>;
  sessionAttendanceStats: TeenAttendanceStats;
  status?: Maybe<Status>;
  statuses: Array<Status>;
  teenAttendance?: Maybe<TeenAttendance>;
  teenAttendances: PaginatedTeenAttendances;
  teenClass?: Maybe<TeenClass>;
  teenClasses: Array<TeenClass>;
  teenOverviewStats: TeenOverviewStats;
  teenager?: Maybe<Teenager>;
  teenagers: PaginatedTeenagers;
};


export type QueryActivitiesArgs = {
  filter?: InputMaybe<ActivityFilterInput>;
  pagination?: InputMaybe<ActivityPaginationInput>;
};


export type QueryAnnouncementArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAnnouncementReadsArgs = {
  announcementId: Scalars['Int']['input'];
};


export type QueryClassSessionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryClassSessionBatchArgs = {
  id: Scalars['Int']['input'];
};


export type QueryClassSessionBatchesArgs = {
  filter?: InputMaybe<ClassSessionFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryClassSessionsArgs = {
  filter?: InputMaybe<ClassSessionFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFamilyArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFamilyMeetupArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFamilyMeetupBatchArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFamilyMeetupBatchesArgs = {
  filter?: InputMaybe<MeetupFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFamilyMeetupsArgs = {
  filter?: InputMaybe<MeetupFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFamilyMemberAttendanceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFamilyMemberAttendancesArgs = {
  filter?: InputMaybe<AttendanceFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFamilySummariesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFollowUpCaseArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFollowUpCasesArgs = {
  filter?: InputMaybe<FollowUpCaseFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryIncompleteFamiliesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLocationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryLocationSummariesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLookupByPhoneArgs = {
  excludeMemberId?: InputMaybe<Scalars['Int']['input']>;
  excludeTeenagerId?: InputMaybe<Scalars['Int']['input']>;
  phone: Scalars['String']['input'];
};


export type QueryManagedAnnouncementsArgs = {
  filter?: InputMaybe<AnnouncementFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMeetupAttendanceStatsArgs = {
  meetup_id: Scalars['Int']['input'];
};


export type QueryMemberArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMembersArgs = {
  filter?: InputMaybe<MemberFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMinistryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMinistryLeadersArgs = {
  ministryId: Scalars['Int']['input'];
};


export type QueryMinistryMembersArgs = {
  ministryId: Scalars['Int']['input'];
};


export type QueryMyAnnouncementsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryMyFollowUpCasesArgs = {
  filter?: InputMaybe<FollowUpCaseFilterInput>;
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


export type QuerySessionAttendanceStatsArgs = {
  session_id: Scalars['Int']['input'];
};


export type QueryStatusArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeenAttendanceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeenAttendancesArgs = {
  filter?: InputMaybe<TeenAttendanceFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryTeenClassArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeenagerArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTeenagersArgs = {
  filter?: InputMaybe<TeenagerFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
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

export type RemoveClassTeacherInput = {
  class_id: Scalars['Int']['input'];
  member_id: Scalars['Int']['input'];
};

export type RemoveMemberFromMinistryInput = {
  member_id: Scalars['Int']['input'];
  ministry_id: Scalars['Int']['input'];
};

export type RemoveMinistryLeaderInput = {
  leader_id: Scalars['Int']['input'];
  ministry_id: Scalars['Int']['input'];
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

export type RoleChangePayload = {
  __typename?: 'RoleChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  role?: Maybe<Role>;
};

export type Status = {
  __typename?: 'Status';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members: Array<Member>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type StatusChangePayload = {
  __typename?: 'StatusChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  status?: Maybe<Status>;
};

export type Subscription = {
  __typename?: 'Subscription';
  activityCreated: Activity;
  announcementChanged: AnnouncementChangePayload;
  attendanceChanged: AttendanceChangePayload;
  classSessionChanged: ClassSessionChangePayload;
  familyChanged: FamilyChangePayload;
  familyMeetupChanged: FamilyMeetupChangePayload;
  followUpCaseChanged: FollowUpCaseChangePayload;
  followUpContactChanged: FollowUpContactChangePayload;
  locationChanged: LocationChangePayload;
  memberChanged: MemberChangePayload;
  ministryChanged: MinistryChangePayload;
  myUnreadAnnouncementCount: UnreadAnnouncementCountPayload;
  professionChanged: ProfessionChangePayload;
  roleChanged: RoleChangePayload;
  statusChanged: StatusChangePayload;
  teenAttendanceChanged: TeenAttendanceChangePayload;
  teenClassChanged: TeenClassChangePayload;
  teenagerChanged: TeenagerChangePayload;
};


export type SubscriptionClassSessionChangedArgs = {
  classId?: InputMaybe<Scalars['Int']['input']>;
};


export type SubscriptionFollowUpCaseChangedArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


export type SubscriptionFollowUpContactChangedArgs = {
  caseId?: InputMaybe<Scalars['Int']['input']>;
};

export type TeenAttendance = {
  __typename?: 'TeenAttendance';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_present: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recorded_by: Scalars['Int']['output'];
  recorder?: Maybe<Member>;
  session?: Maybe<ClassSession>;
  session_id: Scalars['Int']['output'];
  teenager?: Maybe<Teenager>;
  teenager_id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TeenAttendanceChangePayload = {
  __typename?: 'TeenAttendanceChangePayload';
  action: ChangeAction;
  attendance?: Maybe<TeenAttendance>;
  id: Scalars['Int']['output'];
};

export type TeenAttendanceFilterInput = {
  class_id?: InputMaybe<Scalars['Int']['input']>;
  is_present?: InputMaybe<Scalars['Boolean']['input']>;
  session_id?: InputMaybe<Scalars['Int']['input']>;
  teenager_id?: InputMaybe<Scalars['Int']['input']>;
};

export type TeenAttendanceStats = {
  __typename?: 'TeenAttendanceStats';
  absent: Scalars['Int']['output'];
  attendanceRate: Scalars['Float']['output'];
  present: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TeenClass = {
  __typename?: 'TeenClass';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  sessions?: Maybe<Array<ClassSession>>;
  teacherCount?: Maybe<Scalars['Int']['output']>;
  teachers?: Maybe<Array<ClassTeacher>>;
  teenCount?: Maybe<Scalars['Int']['output']>;
  teenagers?: Maybe<Array<Teenager>>;
  updatedAt: Scalars['String']['output'];
};

export type TeenClassChangePayload = {
  __typename?: 'TeenClassChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  teenClass?: Maybe<TeenClass>;
};

export type TeenClassHistory = {
  __typename?: 'TeenClassHistory';
  createdAt: Scalars['String']['output'];
  fromClass?: Maybe<TeenClass>;
  from_class_id?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  movedBy?: Maybe<Member>;
  moved_at: Scalars['String']['output'];
  moved_by_member_id?: Maybe<Scalars['Int']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  teenager_id: Scalars['Int']['output'];
  toClass?: Maybe<TeenClass>;
  to_class_id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TeenOverviewStats = {
  __typename?: 'TeenOverviewStats';
  activeTeenagers: Scalars['Int']['output'];
  incompleteTeenagers: Scalars['Int']['output'];
  promotedTeenagers: Scalars['Int']['output'];
  totalClasses: Scalars['Int']['output'];
  totalTeenagers: Scalars['Int']['output'];
};

export type TeenStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PROMOTED';

export type Teenager = {
  __typename?: 'Teenager';
  birth_date?: Maybe<Scalars['String']['output']>;
  classHistory?: Maybe<Array<TeenClassHistory>>;
  class_id: Scalars['Int']['output'];
  contact_no?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  full_name: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  guardian_contact?: Maybe<Scalars['String']['output']>;
  guardian_name?: Maybe<Scalars['String']['output']>;
  guardian_relationship?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['Int']['output']>;
  photo_url?: Maybe<Scalars['String']['output']>;
  promotedMember?: Maybe<Member>;
  promoted_member_id?: Maybe<Scalars['Int']['output']>;
  status: TeenStatus;
  teenClass?: Maybe<TeenClass>;
  updatedAt: Scalars['String']['output'];
};

export type TeenagerChangePayload = {
  __typename?: 'TeenagerChangePayload';
  action: ChangeAction;
  id: Scalars['Int']['output'];
  teenager?: Maybe<Teenager>;
};

export type TeenagerFilterInput = {
  class_id?: InputMaybe<Scalars['Int']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  location_id?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TeenStatus>;
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

export type TransferTeenagerInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  teenager_id: Scalars['Int']['input'];
  to_class_id: Scalars['Int']['input'];
};

export type TransferTeenagerResponse = {
  __typename?: 'TransferTeenagerResponse';
  message: Scalars['String']['output'];
  newClass?: Maybe<TeenClass>;
  oldClass?: Maybe<TeenClass>;
  success: Scalars['Boolean']['output'];
  teenager?: Maybe<Teenager>;
};

export type UnreadAnnouncementCountPayload = {
  __typename?: 'UnreadAnnouncementCountPayload';
  count: Scalars['Int']['output'];
  memberId: Scalars['Int']['output'];
};

export type UpdateAnnouncementInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  targets?: InputMaybe<Array<AnnouncementTargetInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAttendanceInput = {
  id: Scalars['Int']['input'];
  is_present: Scalars['Boolean']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClassSessionBatchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  session_date?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClassSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  session_date?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  topic?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFamilyInput = {
  id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFamilyMeetupBatchInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  meetup_date?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFamilyMeetupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  meetup_date?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFollowUpCaseInput = {
  family_id?: InputMaybe<Scalars['Int']['input']>;
  first_visit_date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  next_follow_up_at?: InputMaybe<Scalars['String']['input']>;
  outcome_notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLocationInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMemberInput = {
  birth_date?: InputMaybe<Scalars['String']['input']>;
  contact_no?: InputMaybe<Scalars['String']['input']>;
  family_id?: InputMaybe<Scalars['Int']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  location_id?: InputMaybe<Scalars['Int']['input']>;
  location_name?: InputMaybe<Scalars['String']['input']>;
  ministry_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** When true, member has no ministry by choice. Ignored if ministry_ids is non-empty. */
  no_ministry?: InputMaybe<Scalars['Boolean']['input']>;
  /** When true, member is not employed by choice. Ignored if profession_id or profession_name is set. */
  not_employed?: InputMaybe<Scalars['Boolean']['input']>;
  photo_url?: InputMaybe<Scalars['String']['input']>;
  profession_id?: InputMaybe<Scalars['Int']['input']>;
  profession_name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['Int']['input']>;
  role_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  status_id?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateMinistryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  program_day?: InputMaybe<Scalars['String']['input']>;
  program_frequency?: InputMaybe<MinistryProgramFrequency>;
};

export type UpdateProfessionInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileInput = {
  contact_no: Scalars['String']['input'];
  full_name: Scalars['String']['input'];
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

export type UpdateTeenAttendanceInput = {
  id: Scalars['Int']['input'];
  is_present?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTeenClassInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTeenagerInput = {
  birth_date?: InputMaybe<Scalars['String']['input']>;
  class_id?: InputMaybe<Scalars['Int']['input']>;
  contact_no?: InputMaybe<Scalars['String']['input']>;
  full_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  guardian_contact?: InputMaybe<Scalars['String']['input']>;
  guardian_name?: InputMaybe<Scalars['String']['input']>;
  guardian_relationship?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  location_id?: InputMaybe<Scalars['Int']['input']>;
  photo_url?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TeenStatus>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  member?: Maybe<MemberInfo>;
  phone: Scalars['String']['output'];
  /** Primary / highest-privilege role (legacy single-role field). */
  role: Scalars['String']['output'];
  /** All role abbreviations for this user (e.g. FL, ML, ADMIN). */
  roles: Array<Scalars['String']['output']>;
};

export type MinistryFragmentFragment = { __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string };

export type MinistryWithMembersFragmentFragment = { __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }>, leaders: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> };

export type MemberBasicFragmentFragment = { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null };

export type MemberWithMinistryFragmentFragment = { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }> };

export type FamilyMeetupFragmentFragment = { __typename?: 'FamilyMeetup', id: number, batch_id?: number | null, family_id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, family: { __typename?: 'Family', id: number, name: string }, creator: { __typename?: 'Member', id: number, full_name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> | null };

export type FamilyMeetupBatchFragmentFragment = { __typename?: 'FamilyMeetupBatch', id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator: { __typename?: 'Member', id: number, full_name: string }, meetups: Array<{ __typename?: 'FamilyMeetup', id: number, family_id: number, title: string, description: string, meetup_date: string, location: string, is_active: boolean, family: { __typename?: 'Family', id: number, name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, is_present: boolean }> | null }> };

export type GetFamilyMeetupBatchQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetFamilyMeetupBatchQuery = { __typename?: 'Query', familyMeetupBatch?: { __typename?: 'FamilyMeetupBatch', id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator: { __typename?: 'Member', id: number, full_name: string }, meetups: Array<{ __typename?: 'FamilyMeetup', id: number, family_id: number, title: string, description: string, meetup_date: string, location: string, is_active: boolean, family: { __typename?: 'Family', id: number, name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, is_present: boolean }> | null }> } | null };

export type FamilyMemberAttendanceFragmentFragment = { __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } };

export type AttendanceStatsFragmentFragment = { __typename?: 'AttendanceStats', totalMembers: number, presentMembers: number, absentMembers: number, attendanceRate: number };

export type MemberFragmentFragment = { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string }> };

export type FamilyFragmentFragment = { __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> };

export type RoleFragmentFragment = { __typename?: 'Role', id: number, name: string, description: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type StatusFragmentFragment = { __typename?: 'Status', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type ProfessionFragmentFragment = { __typename?: 'Profession', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type LocationFragmentFragment = { __typename?: 'Location', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> };

export type OverviewStatsFragmentFragment = { __typename?: 'OverviewStats', totalMembers: number, totalFamilies: number, totalProfessions: number, totalLocations: number, activeMembers: number, inactiveMembers: number, notActiveMembers: number, movedOutMembers: number, newMembers: number, locationAllocatedMembers: number, locationUnallocatedMembers: number, professionAllocatedMembers: number, professionUnallocatedMembers: number, ministryAllocatedMembers: number, ministryUnallocatedMembers: number, incompleteFamiliesCount: number, fullyIncompleteFamiliesCount: number, unassignedMembers: number, openNewcomers: number };

export type RecentMemberFragmentFragment = { __typename?: 'RecentMember', id: number, full_name: string, createdAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null };

export type FamilySummaryFragmentFragment = { __typename?: 'FamilySummary', id: number, name: string, memberCount: number, incompleteMemberCount: number, fullyIncompleteMemberCount: number, completeMemberCount: number, isFullyIncomplete: boolean, createdAt: string, location?: { __typename?: 'Location', id: number, name: string } | null };

export type ProfessionSummaryFragmentFragment = { __typename?: 'ProfessionSummary', id: number, name: string, memberCount: number, createdAt: string };

export type LocationSummaryFragmentFragment = { __typename?: 'LocationSummary', id: number, name: string, memberCount: number, familyCount: number, createdAt: string };

export type ActivityFragmentFragment = { __typename?: 'Activity', id: number, user_id: number, member_id?: number | null, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null };

export type GetActivitiesQueryVariables = Exact<{
  filter?: InputMaybe<ActivityFilterInput>;
  pagination?: InputMaybe<ActivityPaginationInput>;
}>;


export type GetActivitiesQuery = { __typename?: 'Query', activities: { __typename?: 'PaginatedActivities', total: number, page: number, limit: number, totalPages: number, activities: Array<{ __typename?: 'Activity', id: number, user_id: number, member_id?: number | null, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null }> } };

export type GetRecentActivitiesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentActivitiesQuery = { __typename?: 'Query', recentActivities: Array<{ __typename?: 'Activity', id: number, user_id: number, member_id?: number | null, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null }> };

export type GetMemberQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMemberQuery = { __typename?: 'Query', member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string }> } | null };

export type GetMembersQueryVariables = Exact<{
  filter?: InputMaybe<MemberFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetMembersQuery = { __typename?: 'Query', members: { __typename?: 'PaginatedMembers', total: number, page: number, limit: number, totalPages: number, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string }> }> } };

export type LookupByPhoneQueryVariables = Exact<{
  phone: Scalars['String']['input'];
  excludeMemberId?: InputMaybe<Scalars['Int']['input']>;
  excludeTeenagerId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type LookupByPhoneQuery = { __typename?: 'Query', lookupByPhone: Array<{ __typename?: 'PhoneLookupResult', type: PhoneOwnerType, id: number, full_name: string, contact_no?: string | null, status?: string | null, family_name?: string | null, class_name?: string | null }> };

export type GetFamilyQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetFamilyQuery = { __typename?: 'Query', family?: { __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> } | null };

export type GetFamiliesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFamiliesQuery = { __typename?: 'Query', families: Array<{ __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> }> };

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


export type GetOverviewStatsQuery = { __typename?: 'Query', overviewStats: { __typename?: 'OverviewStats', totalMembers: number, totalFamilies: number, totalProfessions: number, totalLocations: number, activeMembers: number, inactiveMembers: number, notActiveMembers: number, movedOutMembers: number, newMembers: number, locationAllocatedMembers: number, locationUnallocatedMembers: number, professionAllocatedMembers: number, professionUnallocatedMembers: number, ministryAllocatedMembers: number, ministryUnallocatedMembers: number, incompleteFamiliesCount: number, fullyIncompleteFamiliesCount: number, unassignedMembers: number, openNewcomers: number } };

export type GetRecentMembersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecentMembersQuery = { __typename?: 'Query', recentMembers: Array<{ __typename?: 'RecentMember', id: number, full_name: string, createdAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> };

export type GetFamilySummariesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFamilySummariesQuery = { __typename?: 'Query', familySummaries: Array<{ __typename?: 'FamilySummary', id: number, name: string, memberCount: number, incompleteMemberCount: number, fullyIncompleteMemberCount: number, completeMemberCount: number, isFullyIncomplete: boolean, createdAt: string, location?: { __typename?: 'Location', id: number, name: string } | null }> };

export type GetIncompleteFamiliesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIncompleteFamiliesQuery = { __typename?: 'Query', incompleteFamilies: Array<{ __typename?: 'FamilySummary', id: number, name: string, memberCount: number, incompleteMemberCount: number, fullyIncompleteMemberCount: number, completeMemberCount: number, isFullyIncomplete: boolean, createdAt: string, location?: { __typename?: 'Location', id: number, name: string } | null }> };

export type GetFamilyPlacementNeedsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFamilyPlacementNeedsQuery = { __typename?: 'Query', familyPlacementNeeds: Array<{ __typename?: 'FamilyPlacementNeed', id: number, name: string, activeMemberCount: number, maleCount: number, femaleCount: number, unknownGenderCount: number, averageActiveSize: number, sizeDeficit: number, genderSkew: string, needsMembers: boolean, needReasons: Array<string>, suggestedNewcomers: Array<{ __typename?: 'FamilyPlacementSuggestion', followUpCaseId: number, memberId: number, fullName: string, gender?: string | null, priority?: string | null, reason: string }> }> };

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


export type PromoteMemberMutation = { __typename?: 'Mutation', promoteMember: { __typename?: 'PromoteMemberResponse', success: boolean, message: string, password?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, roles: Array<string>, createdAt: string, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, full_name: string, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null } | null } | null } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordResponse', success: boolean, message: string, password?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, createdAt: string, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, full_name: string, role?: { __typename?: 'Role', id: number, name: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null } | null } | null } };

export type TransferMemberMutationVariables = Exact<{
  input: TransferMemberInput;
}>;


export type TransferMemberMutation = { __typename?: 'Mutation', transferMember: { __typename?: 'TransferMemberResponse', success: boolean, message: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string }> }, oldFamily?: { __typename?: 'Family', id: number, name: string } | null, newFamily: { __typename?: 'Family', id: number, name: string } } };

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

export type UserInfoFragmentFragment = { __typename?: 'UserInfo', id: number, phone: string, role: string, roles: Array<string>, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, photo_url?: string | null, full_name: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }>, ledMinistries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }> } | null };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, roles: Array<string>, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, photo_url?: string | null, full_name: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }>, ledMinistries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }> } | null } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserInfo', id: number, phone: string, role: string, roles: Array<string>, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, photo_url?: string | null, full_name: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }>, ledMinistries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }> } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UserInfo', id: number, phone: string, role: string, roles: Array<string>, member?: { __typename?: 'MemberInfo', id: number, contact_no?: string | null, photo_url?: string | null, full_name: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }>, ledMinistries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean }> } | null } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type GetFamilyMembersQueryVariables = Exact<{
  familyId: Scalars['Int']['input'];
}>;


export type GetFamilyMembersQuery = { __typename?: 'Query', family?: { __typename?: 'Family', id: number, name: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, birth_date?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string }> }> } | null };

export type GetFamilyStatsQueryVariables = Exact<{
  familyId: Scalars['Int']['input'];
}>;


export type GetFamilyStatsQuery = { __typename?: 'Query', family?: { __typename?: 'Family', id: number, name: string, members: Array<{ __typename?: 'Member', id: number, status?: { __typename?: 'Status', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }> } | null };

export type GetFamilyMeetupQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetFamilyMeetupQuery = { __typename?: 'Query', familyMeetup?: { __typename?: 'FamilyMeetup', id: number, batch_id?: number | null, family_id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, family: { __typename?: 'Family', id: number, name: string }, creator: { __typename?: 'Member', id: number, full_name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> | null } | null };

export type GetFamilyMeetupsQueryVariables = Exact<{
  filter?: InputMaybe<MeetupFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetFamilyMeetupsQuery = { __typename?: 'Query', familyMeetups: { __typename?: 'PaginatedMeetups', total: number, page: number, limit: number, totalPages: number, meetups: Array<{ __typename?: 'FamilyMeetup', id: number, batch_id?: number | null, family_id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, family: { __typename?: 'Family', id: number, name: string }, creator: { __typename?: 'Member', id: number, full_name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> | null }> } };

export type GetFamilyMeetupBatchesQueryVariables = Exact<{
  filter?: InputMaybe<MeetupFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetFamilyMeetupBatchesQuery = { __typename?: 'Query', familyMeetupBatches: { __typename?: 'PaginatedMeetupBatches', total: number, page: number, limit: number, totalPages: number, batches: Array<{ __typename?: 'FamilyMeetupBatch', id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator: { __typename?: 'Member', id: number, full_name: string }, meetups: Array<{ __typename?: 'FamilyMeetup', id: number, family_id: number, title: string, description: string, meetup_date: string, location: string, is_active: boolean, family: { __typename?: 'Family', id: number, name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, is_present: boolean }> | null }> }> } };

export type GetFamilyMemberAttendanceQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetFamilyMemberAttendanceQuery = { __typename?: 'Query', familyMemberAttendance?: { __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } } | null };

export type GetFamilyMemberAttendancesQueryVariables = Exact<{
  filter?: InputMaybe<AttendanceFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetFamilyMemberAttendancesQuery = { __typename?: 'Query', familyMemberAttendances: { __typename?: 'PaginatedAttendances', total: number, page: number, limit: number, totalPages: number, attendances: Array<{ __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> } };

export type GetMeetupAttendanceStatsQueryVariables = Exact<{
  meetupId: Scalars['Int']['input'];
}>;


export type GetMeetupAttendanceStatsQuery = { __typename?: 'Query', meetupAttendanceStats: { __typename?: 'AttendanceStats', totalMembers: number, presentMembers: number, absentMembers: number, attendanceRate: number } };

export type CreateFamilyMeetupBatchMutationVariables = Exact<{
  input: CreateFamilyMeetupBatchInput;
}>;


export type CreateFamilyMeetupBatchMutation = { __typename?: 'Mutation', createFamilyMeetupBatch: { __typename?: 'FamilyMeetupBatch', id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator: { __typename?: 'Member', id: number, full_name: string }, meetups: Array<{ __typename?: 'FamilyMeetup', id: number, family_id: number, title: string, description: string, meetup_date: string, location: string, is_active: boolean, family: { __typename?: 'Family', id: number, name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, is_present: boolean }> | null }> } };

export type UpdateFamilyMeetupBatchMutationVariables = Exact<{
  input: UpdateFamilyMeetupBatchInput;
}>;


export type UpdateFamilyMeetupBatchMutation = { __typename?: 'Mutation', updateFamilyMeetupBatch: { __typename?: 'FamilyMeetupBatch', id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator: { __typename?: 'Member', id: number, full_name: string }, meetups: Array<{ __typename?: 'FamilyMeetup', id: number, family_id: number, title: string, description: string, meetup_date: string, location: string, is_active: boolean, family: { __typename?: 'Family', id: number, name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, is_present: boolean }> | null }> } };

export type DeleteFamilyMeetupBatchMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteFamilyMeetupBatchMutation = { __typename?: 'Mutation', deleteFamilyMeetupBatch: boolean };

export type CreateFamilyMeetupMutationVariables = Exact<{
  input: CreateFamilyMeetupInput;
}>;


export type CreateFamilyMeetupMutation = { __typename?: 'Mutation', createFamilyMeetup: { __typename?: 'FamilyMeetup', id: number, batch_id?: number | null, family_id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, family: { __typename?: 'Family', id: number, name: string }, creator: { __typename?: 'Member', id: number, full_name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> | null } };

export type UpdateFamilyMeetupMutationVariables = Exact<{
  input: UpdateFamilyMeetupInput;
}>;


export type UpdateFamilyMeetupMutation = { __typename?: 'Mutation', updateFamilyMeetup: { __typename?: 'FamilyMeetup', id: number, batch_id?: number | null, family_id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, family: { __typename?: 'Family', id: number, name: string }, creator: { __typename?: 'Member', id: number, full_name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> | null } };

export type DeleteFamilyMeetupMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteFamilyMeetupMutation = { __typename?: 'Mutation', deleteFamilyMeetup: boolean };

export type CreateAttendanceMutationVariables = Exact<{
  input: CreateAttendanceInput;
}>;


export type CreateAttendanceMutation = { __typename?: 'Mutation', createAttendance: { __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } } };

export type UpdateAttendanceMutationVariables = Exact<{
  input: UpdateAttendanceInput;
}>;


export type UpdateAttendanceMutation = { __typename?: 'Mutation', updateAttendance: { __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } } };

export type DeleteAttendanceMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAttendanceMutation = { __typename?: 'Mutation', deleteAttendance: boolean };

export type BulkCreateAttendanceMutationVariables = Exact<{
  input: BulkAttendanceInput;
}>;


export type BulkCreateAttendanceMutation = { __typename?: 'Mutation', bulkCreateAttendance: Array<{ __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> };

export type GetMinistryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMinistryQuery = { __typename?: 'Query', ministry?: { __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }>, leaders: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> } | null };

export type GetMinistriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMinistriesQuery = { __typename?: 'Query', ministries: Array<{ __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string }> };

export type GetMinistryStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMinistryStatsQuery = { __typename?: 'Query', ministryStats: Array<{ __typename?: 'MinistryStats', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string, totalMembers: number, totalLeaders: number, activeMembers: number }> };

export type GetMinistryMembersQueryVariables = Exact<{
  ministryId: Scalars['Int']['input'];
}>;


export type GetMinistryMembersQuery = { __typename?: 'Query', ministryMembers: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }> };

export type GetMinistryLeadersQueryVariables = Exact<{
  ministryId: Scalars['Int']['input'];
}>;


export type GetMinistryLeadersQuery = { __typename?: 'Query', ministryLeaders: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }> };

export type CreateMinistryMutationVariables = Exact<{
  input: CreateMinistryInput;
}>;


export type CreateMinistryMutation = { __typename?: 'Mutation', createMinistry: { __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }>, leaders: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> } };

export type UpdateMinistryMutationVariables = Exact<{
  input: UpdateMinistryInput;
}>;


export type UpdateMinistryMutation = { __typename?: 'Mutation', updateMinistry: { __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }>, leaders: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> } };

export type DeleteMinistryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteMinistryMutation = { __typename?: 'Mutation', deleteMinistry: boolean };

export type PromoteMinistryLeaderMutationVariables = Exact<{
  input: PromoteMinistryLeaderInput;
}>;


export type PromoteMinistryLeaderMutation = { __typename?: 'Mutation', promoteMinistryLeader: { __typename?: 'PromoteMinistryLeaderResponse', success: boolean, message: string, password?: string | null, user?: { __typename?: 'UserInfo', id: number, phone: string, role: string, createdAt: string, member?: { __typename?: 'MemberInfo', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null } | null } | null } };

export type FollowUpCaseFragmentFragment = { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> };

export type GetFollowUpCasesQueryVariables = Exact<{
  filter?: InputMaybe<FollowUpCaseFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetFollowUpCasesQuery = { __typename?: 'Query', followUpCases: { __typename?: 'PaginatedFollowUpCases', total: number, page: number, limit: number, totalPages: number, items: Array<{ __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> }> } };

export type GetMyFollowUpCasesQueryVariables = Exact<{
  filter?: InputMaybe<FollowUpCaseFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetMyFollowUpCasesQuery = { __typename?: 'Query', myFollowUpCases: { __typename?: 'PaginatedFollowUpCases', total: number, page: number, limit: number, totalPages: number, items: Array<{ __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> }> } };

export type GetFollowUpCaseQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetFollowUpCaseQuery = { __typename?: 'Query', followUpCase?: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } | null };

export type GetFollowUpDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFollowUpDashboardQuery = { __typename?: 'Query', followUpDashboard: { __typename?: 'FollowUpDashboard', newCount: number, assignedCount: number, inProgressCount: number, overdueCount: number, joinedThisMonth: number, notInterestedCount: number, unreachableCount: number, movedOutCount: number, coordinatorWorkload: Array<{ __typename?: 'FollowUpCoordinatorWorkload', member_id: number, full_name: string, openCases: number, overdueCases: number }> } };

export type GetFollowUpCoordinatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFollowUpCoordinatorsQuery = { __typename?: 'Query', followUpCoordinators: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string }> }> };

export type IntakeNewcomerMutationVariables = Exact<{
  input: IntakeNewcomerInput;
}>;


export type IntakeNewcomerMutation = { __typename?: 'Mutation', intakeNewcomer: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } };

export type AssignFollowUpCaseMutationVariables = Exact<{
  input: AssignFollowUpCaseInput;
}>;


export type AssignFollowUpCaseMutation = { __typename?: 'Mutation', assignFollowUpCase: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } };

export type ReassignFollowUpCaseMutationVariables = Exact<{
  input: AssignFollowUpCaseInput;
}>;


export type ReassignFollowUpCaseMutation = { __typename?: 'Mutation', reassignFollowUpCase: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } };

export type LogFollowUpContactMutationVariables = Exact<{
  input: LogFollowUpContactInput;
}>;


export type LogFollowUpContactMutation = { __typename?: 'Mutation', logFollowUpContact: { __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, recorder: { __typename?: 'Member', id: number, full_name: string } } };

export type UpdateFollowUpCaseMutationVariables = Exact<{
  input: UpdateFollowUpCaseInput;
}>;


export type UpdateFollowUpCaseMutation = { __typename?: 'Mutation', updateFollowUpCase: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } };

export type GraduateFollowUpCaseMutationVariables = Exact<{
  input: GraduateFollowUpCaseInput;
}>;


export type GraduateFollowUpCaseMutation = { __typename?: 'Mutation', graduateFollowUpCase: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } };

export type CloseFollowUpCaseMutationVariables = Exact<{
  input: CloseFollowUpCaseInput;
}>;


export type CloseFollowUpCaseMutation = { __typename?: 'Mutation', closeFollowUpCase: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } };

export type TeenClassFragmentFragment = { __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null };

export type TeenagerFragmentFragment = { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null };

export type ClassSessionFragmentFragment = { __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null };

export type ClassSessionBatchFragmentFragment = { __typename?: 'ClassSessionBatch', id: number, title: string, description?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator?: { __typename?: 'Member', id: number, full_name: string } | null, sessions?: Array<{ __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null }> | null };

export type TeenAttendanceFragmentFragment = { __typename?: 'TeenAttendance', id: number, session_id: number, teenager_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, session?: { __typename?: 'ClassSession', id: number, title: string, session_date: string, class_id: number, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null } | null, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null } | null, recorder?: { __typename?: 'Member', id: number, full_name: string } | null };

export type GetTeenClassesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeenClassesQuery = { __typename?: 'Query', teenClasses: Array<{ __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null }> };

export type GetMyTeenClassesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyTeenClassesQuery = { __typename?: 'Query', myTeenClasses: Array<{ __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null }> };

export type GetTeenClassQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetTeenClassQuery = { __typename?: 'Query', teenClass?: { __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null } | null };

export type GetTeenagersQueryVariables = Exact<{
  filter?: InputMaybe<TeenagerFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetTeenagersQuery = { __typename?: 'Query', teenagers: { __typename?: 'PaginatedTeenagers', total: number, page: number, limit: number, totalPages: number, teenagers: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null }> } };

export type GetTeenagerQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetTeenagerQuery = { __typename?: 'Query', teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, classHistory?: Array<{ __typename?: 'TeenClassHistory', id: number, from_class_id?: number | null, to_class_id: number, moved_at: string, note?: string | null, fromClass?: { __typename?: 'TeenClass', id: number, name: string } | null, toClass?: { __typename?: 'TeenClass', id: number, name: string } | null }> | null, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null } | null };

export type GetTeenOverviewStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTeenOverviewStatsQuery = { __typename?: 'Query', teenOverviewStats: { __typename?: 'TeenOverviewStats', totalTeenagers: number, activeTeenagers: number, promotedTeenagers: number, totalClasses: number, incompleteTeenagers: number } };

export type GetClassSessionsQueryVariables = Exact<{
  filter?: InputMaybe<ClassSessionFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetClassSessionsQuery = { __typename?: 'Query', classSessions: { __typename?: 'PaginatedClassSessions', total: number, page: number, limit: number, totalPages: number, sessions: Array<{ __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null }> } };

export type GetClassSessionQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetClassSessionQuery = { __typename?: 'Query', classSession?: { __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, attendances?: Array<{ __typename?: 'TeenAttendance', id: number, session_id: number, teenager_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, session?: { __typename?: 'ClassSession', id: number, title: string, session_date: string, class_id: number, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null } | null, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null } | null, recorder?: { __typename?: 'Member', id: number, full_name: string } | null }> | null, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null } | null };

export type GetClassSessionBatchesQueryVariables = Exact<{
  filter?: InputMaybe<ClassSessionFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetClassSessionBatchesQuery = { __typename?: 'Query', classSessionBatches: { __typename?: 'PaginatedClassSessionBatches', total: number, page: number, limit: number, totalPages: number, batches: Array<{ __typename?: 'ClassSessionBatch', id: number, title: string, description?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator?: { __typename?: 'Member', id: number, full_name: string } | null, sessions?: Array<{ __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null }> | null }> } };

export type GetTeenAttendancesQueryVariables = Exact<{
  filter?: InputMaybe<TeenAttendanceFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetTeenAttendancesQuery = { __typename?: 'Query', teenAttendances: { __typename?: 'PaginatedTeenAttendances', total: number, page: number, limit: number, totalPages: number, attendances: Array<{ __typename?: 'TeenAttendance', id: number, session_id: number, teenager_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, session?: { __typename?: 'ClassSession', id: number, title: string, session_date: string, class_id: number, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null } | null, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null } | null, recorder?: { __typename?: 'Member', id: number, full_name: string } | null }> } };

export type CreateTeenClassMutationVariables = Exact<{
  input: CreateTeenClassInput;
}>;


export type CreateTeenClassMutation = { __typename?: 'Mutation', createTeenClass: { __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null } };

export type UpdateTeenClassMutationVariables = Exact<{
  input: UpdateTeenClassInput;
}>;


export type UpdateTeenClassMutation = { __typename?: 'Mutation', updateTeenClass: { __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null } };

export type DeleteTeenClassMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTeenClassMutation = { __typename?: 'Mutation', deleteTeenClass: boolean };

export type CreateTeenagerMutationVariables = Exact<{
  input: CreateTeenagerInput;
}>;


export type CreateTeenagerMutation = { __typename?: 'Mutation', createTeenager: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null } };

export type UpdateTeenagerMutationVariables = Exact<{
  input: UpdateTeenagerInput;
}>;


export type UpdateTeenagerMutation = { __typename?: 'Mutation', updateTeenager: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null } };

export type DeleteTeenagerMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteTeenagerMutation = { __typename?: 'Mutation', deleteTeenager: boolean };

export type TransferTeenagerMutationVariables = Exact<{
  input: TransferTeenagerInput;
}>;


export type TransferTeenagerMutation = { __typename?: 'Mutation', transferTeenager: { __typename?: 'TransferTeenagerResponse', success: boolean, message: string, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null } | null, oldClass?: { __typename?: 'TeenClass', id: number, name: string } | null, newClass?: { __typename?: 'TeenClass', id: number, name: string } | null } };

export type AssignClassTeacherMutationVariables = Exact<{
  input: AssignClassTeacherInput;
}>;


export type AssignClassTeacherMutation = { __typename?: 'Mutation', assignClassTeacher: { __typename?: 'AssignClassTeacherResponse', success: boolean, message: string, password?: string | null, classTeacher?: { __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null } | null } };

export type RemoveClassTeacherMutationVariables = Exact<{
  input: RemoveClassTeacherInput;
}>;


export type RemoveClassTeacherMutation = { __typename?: 'Mutation', removeClassTeacher: boolean };

export type CreateClassSessionBatchMutationVariables = Exact<{
  input: CreateClassSessionBatchInput;
}>;


export type CreateClassSessionBatchMutation = { __typename?: 'Mutation', createClassSessionBatch: { __typename?: 'ClassSessionBatch', id: number, title: string, description?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator?: { __typename?: 'Member', id: number, full_name: string } | null, sessions?: Array<{ __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null }> | null } };

export type UpdateClassSessionBatchMutationVariables = Exact<{
  input: UpdateClassSessionBatchInput;
}>;


export type UpdateClassSessionBatchMutation = { __typename?: 'Mutation', updateClassSessionBatch: { __typename?: 'ClassSessionBatch', id: number, title: string, description?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, creator?: { __typename?: 'Member', id: number, full_name: string } | null, sessions?: Array<{ __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null }> | null } };

export type UpdateClassSessionMutationVariables = Exact<{
  input: UpdateClassSessionInput;
}>;


export type UpdateClassSessionMutation = { __typename?: 'Mutation', updateClassSession: { __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null } };

export type DeleteClassSessionBatchMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteClassSessionBatchMutation = { __typename?: 'Mutation', deleteClassSessionBatch: boolean };

export type BulkCreateTeenAttendanceMutationVariables = Exact<{
  input: BulkTeenAttendanceInput;
}>;


export type BulkCreateTeenAttendanceMutation = { __typename?: 'Mutation', bulkCreateTeenAttendance: Array<{ __typename?: 'TeenAttendance', id: number, session_id: number, teenager_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, session?: { __typename?: 'ClassSession', id: number, title: string, session_date: string, class_id: number, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null } | null, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null } | null, recorder?: { __typename?: 'Member', id: number, full_name: string } | null }> };

export type PromoteTeenagerToMemberMutationVariables = Exact<{
  input: PromoteTeenagerToMemberInput;
}>;


export type PromoteTeenagerToMemberMutation = { __typename?: 'Mutation', promoteTeenagerToMember: { __typename?: 'PromoteTeenagerToMemberResponse', success: boolean, message: string, password?: string | null, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null } };

export type AnnouncementFragmentFragment = { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> };

export type GetMyAnnouncementsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetMyAnnouncementsQuery = { __typename?: 'Query', myAnnouncements: { __typename?: 'PaginatedAnnouncements', total: number, page: number, limit: number, totalPages: number, items: Array<{ __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> }> } };

export type GetMyUnreadAnnouncementCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyUnreadAnnouncementCountQuery = { __typename?: 'Query', myUnreadAnnouncementCount: number };

export type GetAnnouncementQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetAnnouncementQuery = { __typename?: 'Query', announcement?: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } | null };

export type GetManagedAnnouncementsQueryVariables = Exact<{
  filter?: InputMaybe<AnnouncementFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetManagedAnnouncementsQuery = { __typename?: 'Query', managedAnnouncements: { __typename?: 'PaginatedAnnouncements', total: number, page: number, limit: number, totalPages: number, items: Array<{ __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> }> } };

export type GetAnnouncementReadsQueryVariables = Exact<{
  announcementId: Scalars['Int']['input'];
}>;


export type GetAnnouncementReadsQuery = { __typename?: 'Query', announcementReads: { __typename?: 'AnnouncementReadStats', announcement_id: number, seenCount: number, expectedCount: number, readers: Array<{ __typename?: 'AnnouncementRead', id: number, announcement_id: number, member_id: number, read_at: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } }> } };

export type CreateAnnouncementMutationVariables = Exact<{
  input: CreateAnnouncementInput;
}>;


export type CreateAnnouncementMutation = { __typename?: 'Mutation', createAnnouncement: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } };

export type UpdateAnnouncementMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateAnnouncementInput;
}>;


export type UpdateAnnouncementMutation = { __typename?: 'Mutation', updateAnnouncement: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } };

export type PublishAnnouncementMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type PublishAnnouncementMutation = { __typename?: 'Mutation', publishAnnouncement: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } };

export type ArchiveAnnouncementMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ArchiveAnnouncementMutation = { __typename?: 'Mutation', archiveAnnouncement: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } };

export type MarkAnnouncementSeenMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type MarkAnnouncementSeenMutation = { __typename?: 'Mutation', markAnnouncementSeen: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } };

export type MemberChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MemberChangedSubscription = { __typename?: 'Subscription', memberChanged: { __typename?: 'MemberChangePayload', action: ChangeAction, id: number, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, status_id?: number | null, family_id?: number | null, role_id?: number | null, profession_id?: number | null, location_id?: number | null, profession_name?: string | null, location_name?: string | null, no_ministry: boolean, not_employed: boolean, createdAt: string, updatedAt: string, family?: { __typename?: 'Family', id: number, name: string } | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, roles: Array<{ __typename?: 'Role', id: number, name: string, description: string }>, status?: { __typename?: 'Status', id: number, name: string } | null, profession?: { __typename?: 'Profession', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, ministries: Array<{ __typename?: 'Ministry', id: number, name: string }> } | null } };

export type FamilyChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type FamilyChangedSubscription = { __typename?: 'Subscription', familyChanged: { __typename?: 'FamilyChangePayload', action: ChangeAction, id: number, family?: { __typename?: 'Family', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, role?: { __typename?: 'Role', id: number, name: string, description: string } | null, status?: { __typename?: 'Status', id: number, name: string } | null }> } | null } };

export type AnnouncementChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AnnouncementChangedSubscription = { __typename?: 'Subscription', announcementChanged: { __typename?: 'AnnouncementChangePayload', action: ChangeAction, id: number, announcement?: { __typename?: 'Announcement', id: number, title: string, body: string, status: string, created_by: number, published_at?: string | null, createdAt: string, updatedAt: string, seenByMe: boolean, seenAt?: string | null, seenCount?: number | null, expectedCount?: number | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, targets: Array<{ __typename?: 'AnnouncementTarget', id: number, announcement_id: number, target_type: string, target_value: string }> } | null } };

export type MyUnreadAnnouncementCountSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MyUnreadAnnouncementCountSubscription = { __typename?: 'Subscription', myUnreadAnnouncementCount: { __typename?: 'UnreadAnnouncementCountPayload', memberId: number, count: number } };

export type FollowUpCaseChangedSubscriptionVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FollowUpCaseChangedSubscription = { __typename?: 'Subscription', followUpCaseChanged: { __typename?: 'FollowUpCaseChangePayload', action: ChangeAction, id: number, followUpCase?: { __typename?: 'FollowUpCase', id: number, member_id: number, status: string, source?: string | null, first_visit_date?: string | null, assigned_to?: number | null, assigned_at?: string | null, next_follow_up_at?: string | null, priority: string, outcome_notes?: string | null, closed_at?: string | null, created_by?: number | null, family_id?: number | null, createdAt: string, updatedAt: string, member: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, status_id?: number | null, family_id?: number | null, location_id?: number | null, location_name?: string | null, status?: { __typename?: 'Status', id: number, name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null }, assignee?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, family?: { __typename?: 'Family', id: number, name: string } | null, contacts: Array<{ __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } }>, assignments: Array<{ __typename?: 'FollowUpAssignment', id: number, case_id: number, from_member_id?: number | null, to_member_id: number, reason?: string | null, assigned_by: number, assigned_at: string, fromMember?: { __typename?: 'Member', id: number, full_name: string } | null, toMember: { __typename?: 'Member', id: number, full_name: string }, assigner: { __typename?: 'Member', id: number, full_name: string } }> } | null } };

export type FollowUpContactChangedSubscriptionVariables = Exact<{
  caseId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FollowUpContactChangedSubscription = { __typename?: 'Subscription', followUpContactChanged: { __typename?: 'FollowUpContactChangePayload', action: ChangeAction, id: number, contact?: { __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string, recorder: { __typename?: 'Member', id: number, full_name: string } } | null } };

export type ActivityCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ActivityCreatedSubscription = { __typename?: 'Subscription', activityCreated: { __typename?: 'Activity', id: number, user_id: number, member_id?: number | null, action: string, entity_type: string, entity_id?: number | null, description: string, metadata?: string | null, ip_address?: string | null, user_agent?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'ActivityUser', id: number, phone: string, role: string, member?: { __typename?: 'Member', id: number, full_name: string } | null } | null, member?: { __typename?: 'ActivityMember', id: number, full_name: string } | null } };

export type TeenagerChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TeenagerChangedSubscription = { __typename?: 'Subscription', teenagerChanged: { __typename?: 'TeenagerChangePayload', action: ChangeAction, id: number, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, class_id: number, status: TeenStatus, promoted_member_id?: number | null, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, location?: { __typename?: 'Location', id: number, name: string } | null, promotedMember?: { __typename?: 'Member', id: number, full_name: string } | null } | null } };

export type TeenClassChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TeenClassChangedSubscription = { __typename?: 'Subscription', teenClassChanged: { __typename?: 'TeenClassChangePayload', action: ChangeAction, id: number, teenClass?: { __typename?: 'TeenClass', id: number, name: string, description?: string | null, createdAt: string, updatedAt: string, teenCount?: number | null, teacherCount?: number | null, teenagers?: Array<{ __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null, gender?: string | null, photo_url?: string | null, birth_date?: string | null, location_id?: number | null, guardian_name?: string | null, guardian_contact?: string | null, guardian_relationship?: string | null, status: TeenStatus, class_id: number, location?: { __typename?: 'Location', id: number, name: string } | null }> | null, teachers?: Array<{ __typename?: 'ClassTeacher', id: number, class_id: number, member_id: number, is_active: boolean, member?: { __typename?: 'Member', id: number, full_name: string, contact_no?: string | null, role?: { __typename?: 'Role', id: number, name: string } | null } | null }> | null } | null } };

export type ClassSessionChangedSubscriptionVariables = Exact<{
  classId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ClassSessionChangedSubscription = { __typename?: 'Subscription', classSessionChanged: { __typename?: 'ClassSessionChangePayload', action: ChangeAction, id: number, classSession?: { __typename?: 'ClassSession', id: number, batch_id?: number | null, class_id: number, title: string, description?: string | null, topic?: string | null, session_date: string, location?: string | null, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null, creator?: { __typename?: 'Member', id: number, full_name: string } | null, attendanceStats?: { __typename?: 'TeenAttendanceStats', total: number, present: number, absent: number, attendanceRate: number } | null } | null } };

export type FamilyMeetupChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type FamilyMeetupChangedSubscription = { __typename?: 'Subscription', familyMeetupChanged: { __typename?: 'FamilyMeetupChangePayload', action: ChangeAction, id: number, familyMeetup?: { __typename?: 'FamilyMeetup', id: number, batch_id?: number | null, family_id: number, title: string, description: string, meetup_date: string, location: string, created_by: number, is_active: boolean, createdAt: string, updatedAt: string, family: { __typename?: 'Family', id: number, name: string }, creator: { __typename?: 'Member', id: number, full_name: string }, attendances?: Array<{ __typename?: 'FamilyMemberAttendance', id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } }> | null } | null } };

export type AttendanceChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AttendanceChangedSubscription = { __typename?: 'Subscription', attendanceChanged: { __typename?: 'AttendanceChangePayload', action: ChangeAction, id: number, attendance?: { __typename?: 'FamilyMemberAttendance', id: number, meetup_id: number, member_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, meetup: { __typename?: 'FamilyMeetup', id: number, title: string, meetup_date: string, family: { __typename?: 'Family', id: number, name: string } }, member: { __typename?: 'Member', id: number, full_name: string }, recorder: { __typename?: 'Member', id: number, full_name: string } } | null } };

export type TeenAttendanceChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TeenAttendanceChangedSubscription = { __typename?: 'Subscription', teenAttendanceChanged: { __typename?: 'TeenAttendanceChangePayload', action: ChangeAction, id: number, attendance?: { __typename?: 'TeenAttendance', id: number, session_id: number, teenager_id: number, is_present: boolean, notes?: string | null, recorded_by: number, createdAt: string, updatedAt: string, session?: { __typename?: 'ClassSession', id: number, title: string, session_date: string, class_id: number, teenClass?: { __typename?: 'TeenClass', id: number, name: string } | null } | null, teenager?: { __typename?: 'Teenager', id: number, full_name: string, contact_no?: string | null } | null, recorder?: { __typename?: 'Member', id: number, full_name: string } | null } | null } };

export type MinistryChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MinistryChangedSubscription = { __typename?: 'Subscription', ministryChanged: { __typename?: 'MinistryChangePayload', action: ChangeAction, id: number, ministry?: { __typename?: 'Ministry', id: number, name: string, description?: string | null, is_active: boolean, program_frequency?: MinistryProgramFrequency | null, program_day?: string | null, createdAt: string, updatedAt: string } | null } };

export type LocationChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type LocationChangedSubscription = { __typename?: 'Subscription', locationChanged: { __typename?: 'LocationChangePayload', action: ChangeAction, id: number, location?: { __typename?: 'Location', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null } };

export type ProfessionChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ProfessionChangedSubscription = { __typename?: 'Subscription', professionChanged: { __typename?: 'ProfessionChangePayload', action: ChangeAction, id: number, profession?: { __typename?: 'Profession', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null } };

export type RoleChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RoleChangedSubscription = { __typename?: 'Subscription', roleChanged: { __typename?: 'RoleChangePayload', action: ChangeAction, id: number, role?: { __typename?: 'Role', id: number, name: string, description: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null } };

export type StatusChangedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StatusChangedSubscription = { __typename?: 'Subscription', statusChanged: { __typename?: 'StatusChangePayload', action: ChangeAction, id: number, status?: { __typename?: 'Status', id: number, name: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'Member', id: number, full_name: string, contact_no?: string | null }> } | null } };

export type FollowUpContactMiniFragment = { __typename?: 'FollowUpContact', id: number, case_id: number, contact_type: string, outcome: string, notes?: string | null, contacted_at: string, next_follow_up_at?: string | null, recorded_by: number, createdAt: string };
