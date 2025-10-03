import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import {
  setCredentials,
  clearCredentials,
  setError,
} from "@/redux/slices/authSlice";
import {
  CREATE_FAMILY,
  CREATE_LOCATION,
  CREATE_MEMBER,
  CREATE_PROFESSION,
  CREATE_ROLE,
  CREATE_STATUS,
  DELETE_FAMILY,
  DELETE_LOCATION,
  DELETE_MEMBER,
  DELETE_PROFESSION,
  DELETE_ROLE,
  DELETE_STATUS,
  GET_FAMILY,
  GET_FAMILIES,
  GET_FAMILY_MEMBERS,
  GET_FAMILY_STATS,
  GET_LOCATION,
  GET_LOCATIONS,
  GET_MEMBER,
  GET_MEMBERS,
  GET_PROFESSION,
  GET_PROFESSIONS,
  GET_ROLES,
  GET_STATUSES,
  GET_OVERVIEW_STATS,
  GET_RECENT_MEMBERS,
  GET_FAMILY_SUMMARIES,
  GET_PROFESSION_SUMMARIES,
  GET_LOCATION_SUMMARIES,
  LOGIN,
  LOGOUT,
  PROMOTE_MEMBER,
  RESET_PASSWORD,
  TRANSFER_MEMBER,
  UPDATE_FAMILY,
  UPDATE_LOCATION,
  UPDATE_MEMBER,
  UPDATE_PROFESSION,
  UPDATE_ROLE,
  UPDATE_STATUS,
} from "../graphql/operations";
import type {
  CreateFamilyInput,
  CreateLocationInput,
  CreateMemberInput,
  CreateProfessionInput,
  CreateRoleInput,
  CreateStatusInput,
  MemberFilterInput,
  PaginationInput,
  UpdateFamilyInput,
  UpdateLocationInput,
  UpdateMemberInput,
  UpdateProfessionInput,
  UpdateRoleInput,
  UpdateStatusInput,
  GetMembersQuery,
  GetFamiliesQuery,
  GetFamilyQuery,
  GetRolesQuery,
  GetStatusesQuery,
  GetProfessionsQuery,
  GetProfessionQuery,
  GetLocationQuery,
  GetLocationsQuery,
  CreateMemberMutation,
  UpdateMemberMutation,
  DeleteMemberMutation,
  CreateFamilyMutation,
  UpdateFamilyMutation,
  DeleteFamilyMutation,
  CreateRoleMutation,
  UpdateRoleMutation,
  DeleteRoleMutation,
  CreateStatusMutation,
  UpdateStatusMutation,
  DeleteStatusMutation,
  CreateProfessionMutation,
  UpdateProfessionMutation,
  DeleteProfessionMutation,
  CreateLocationMutation,
  UpdateLocationMutation,
  DeleteLocationMutation,
} from "../generated/graphql";

// MEMBER HOOKS
export const useGetMember = (id: number) => {
  return useQuery(GET_MEMBER, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
};

export const useGetMembers = (
  filter?: MemberFilterInput,
  pagination?: PaginationInput
) => {
  return useQuery<GetMembersQuery>(GET_MEMBERS, {
    variables: { filter, pagination },
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    context: {
      queryKey: `members-${pagination?.page || 1}-${pagination?.limit || 10}`,
    },
  });
};

export const useLazyGetMembers = () => {
  return useLazyQuery<GetMembersQuery>(GET_MEMBERS, {
    errorPolicy: "all",
  });
};

export const useCreateMember = () => {
  const [createMember, { loading }] = useMutation<CreateMemberMutation>(
    CREATE_MEMBER,
    {
      onCompleted: () => {
        toast.success("Member created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create member: ${error.message}`);
      },
      refetchQueries: ["GetMembers"],
    }
  );

  const handleCreateMember = async (input: CreateMemberInput) => {
    try {
      const result = await createMember({ variables: { input } });
      return result.data?.createMember;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  };

  return { createMember: handleCreateMember, loading };
};

export const useUpdateMember = () => {
  const [updateMember, { loading }] = useMutation<UpdateMemberMutation>(
    UPDATE_MEMBER,
    {
      onCompleted: () => {
        toast.success("Member updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update member: ${error.message}`);
      },
      refetchQueries: ["GetMembers"],
    }
  );

  const handleUpdateMember = async (input: UpdateMemberInput) => {
    try {
      const result = await updateMember({ variables: { input } });
      return result.data?.updateMember;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  };

  return { updateMember: handleUpdateMember, loading };
};

export const useDeleteMember = () => {
  const [deleteMember, { loading }] = useMutation<DeleteMemberMutation>(
    DELETE_MEMBER,
    {
      onCompleted: () => {
        toast.success("Member deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete member: ${error.message}`);
      },
      refetchQueries: ["GetMembers"],
    }
  );

  const handleDeleteMember = async (id: number) => {
    try {
      const result = await deleteMember({ variables: { id } });
      return result.data?.deleteMember;
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  };

  return { deleteMember: handleDeleteMember, loading };
};

export const usePromoteMember = () => {
  const [promoteMember, { loading }] = useMutation<any>(PROMOTE_MEMBER, {
    onCompleted: (data) => {
      const response = data?.promoteMember;
      if (response?.success) {
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(`Failed to promote member: ${error.message}`);
    },
    refetchQueries: ["GetMembers"],
  });

  const handlePromoteMember = async (input: {
    member_id: number;
    role: string;
  }) => {
    try {
      const result = await promoteMember({ variables: { input } });
      return result.data?.promoteMember;
    } catch (error) {
      console.error("Error promoting member:", error);
      throw error;
    }
  };

  return { promoteMember: handlePromoteMember, loading };
};

export const useResetPassword = () => {
  const [resetPassword, { loading }] = useMutation<any>(RESET_PASSWORD, {
    onCompleted: (data) => {
      const response = data?.resetPassword;
      if (response?.success) {
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(`Failed to reset password: ${error.message}`);
    },
    refetchQueries: ["GetMembers"],
  });

  const handleResetPassword = async (input: { member_id: number }) => {
    try {
      const result = await resetPassword({ variables: { input } });
      return result.data?.resetPassword;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  return { resetPassword: handleResetPassword, loading };
};

export const useTransferMember = () => {
  const [transferMember, { loading }] = useMutation<any>(TRANSFER_MEMBER, {
    onCompleted: (data) => {
      const response = data?.transferMember;
      if (response?.success) {
        toast.success(response.message);
      }
    },
    onError: (error) => {
      toast.error(`Failed to transfer member: ${error.message}`);
    },
    refetchQueries: ["GetMembers"],
  });

  const handleTransferMember = async (input: {
    member_id: number;
    new_family_id: number;
  }) => {
    try {
      const result = await transferMember({ variables: { input } });
      return result.data?.transferMember;
    } catch (error) {
      console.error("Error transferring member:", error);
      throw error;
    }
  };

  return { transferMember: handleTransferMember, loading };
};

// FAMILY HOOKS
export const useGetFamilies = () => {
  return useQuery<GetFamiliesQuery>(GET_FAMILIES, {
    errorPolicy: "all",
  });
};

export const useGetFamily = (id: number) => {
  return useQuery<GetFamilyQuery>(GET_FAMILY, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
};

export const useCreateFamily = () => {
  const [createFamily, { loading }] = useMutation<CreateFamilyMutation>(
    CREATE_FAMILY,
    {
      onCompleted: () => {
        toast.success("Family created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create family: ${error.message}`);
      },
      refetchQueries: ["GetFamilies"],
    }
  );

  const handleCreateFamily = async (input: CreateFamilyInput) => {
    try {
      const result = await createFamily({ variables: { input } });
      return result.data?.createFamily;
    } catch (error) {
      console.error("Error creating family:", error);
      throw error;
    }
  };

  return { createFamily: handleCreateFamily, loading };
};

export const useUpdateFamily = () => {
  const [updateFamily, { loading }] = useMutation<UpdateFamilyMutation>(
    UPDATE_FAMILY,
    {
      onCompleted: () => {
        toast.success("Family updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update family: ${error.message}`);
      },
      refetchQueries: ["GetFamilies"],
    }
  );

  const handleUpdateFamily = async (input: UpdateFamilyInput) => {
    try {
      const result = await updateFamily({ variables: { input } });
      return result.data?.updateFamily;
    } catch (error) {
      console.error("Error updating family:", error);
      throw error;
    }
  };

  return { updateFamily: handleUpdateFamily, loading };
};

export const useDeleteFamily = () => {
  const [deleteFamily, { loading }] = useMutation<DeleteFamilyMutation>(
    DELETE_FAMILY,
    {
      onCompleted: () => {
        toast.success("Family deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete family: ${error.message}`);
      },
      refetchQueries: ["GetFamilies"],
    }
  );

  const handleDeleteFamily = async (id: number) => {
    try {
      const result = await deleteFamily({ variables: { id } });
      return result.data?.deleteFamily;
    } catch (error) {
      console.error("Error deleting family:", error);
      throw error;
    }
  };

  return { deleteFamily: handleDeleteFamily, loading };
};

// ROLE HOOKS
export const useGetRoles = () => {
  return useQuery<GetRolesQuery>(GET_ROLES, {
    errorPolicy: "all",
  });
};

export const useCreateRole = () => {
  const [createRole, { loading }] = useMutation<CreateRoleMutation>(
    CREATE_ROLE,
    {
      onCompleted: () => {
        toast.success("Role created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create role: ${error.message}`);
      },
      refetchQueries: ["GetRoles"],
    }
  );

  const handleCreateRole = async (input: CreateRoleInput) => {
    try {
      const result = await createRole({ variables: { input } });
      return result.data?.createRole;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  };

  return { createRole: handleCreateRole, loading };
};

export const useUpdateRole = () => {
  const [updateRole, { loading }] = useMutation<UpdateRoleMutation>(
    UPDATE_ROLE,
    {
      onCompleted: () => {
        toast.success("Role updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update role: ${error.message}`);
      },
      refetchQueries: ["GetRoles"],
    }
  );

  const handleUpdateRole = async (input: UpdateRoleInput) => {
    try {
      const result = await updateRole({ variables: { input } });
      return result.data?.updateRole;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  };

  return { updateRole: handleUpdateRole, loading };
};

export const useDeleteRole = () => {
  const [deleteRole, { loading }] = useMutation<DeleteRoleMutation>(
    DELETE_ROLE,
    {
      onCompleted: () => {
        toast.success("Role deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete role: ${error.message}`);
      },
      refetchQueries: ["GetRoles"],
    }
  );

  const handleDeleteRole = async (id: number) => {
    try {
      const result = await deleteRole({ variables: { id } });
      return result.data?.deleteRole;
    } catch (error) {
      console.error("Error deleting role:", error);
      throw error;
    }
  };

  return { deleteRole: handleDeleteRole, loading };
};

// STATUS HOOKS
export const useGetStatuses = () => {
  return useQuery<GetStatusesQuery>(GET_STATUSES, {
    errorPolicy: "all",
  });
};

export const useCreateStatus = () => {
  const [createStatus, { loading }] = useMutation<CreateStatusMutation>(
    CREATE_STATUS,
    {
      onCompleted: () => {
        toast.success("Status created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create status: ${error.message}`);
      },
      refetchQueries: ["GetStatuses"],
    }
  );

  const handleCreateStatus = async (input: CreateStatusInput) => {
    try {
      const result = await createStatus({ variables: { input } });
      return result.data?.createStatus;
    } catch (error) {
      console.error("Error creating status:", error);
      throw error;
    }
  };

  return { createStatus: handleCreateStatus, loading };
};

export const useUpdateStatus = () => {
  const [updateStatus, { loading }] = useMutation<UpdateStatusMutation>(
    UPDATE_STATUS,
    {
      onCompleted: () => {
        toast.success("Status updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update status: ${error.message}`);
      },
      refetchQueries: ["GetStatuses"],
    }
  );

  const handleUpdateStatus = async (input: UpdateStatusInput) => {
    try {
      const result = await updateStatus({ variables: { input } });
      return result.data?.updateStatus;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  return { updateStatus: handleUpdateStatus, loading };
};

export const useDeleteStatus = () => {
  const [deleteStatus, { loading }] = useMutation<DeleteStatusMutation>(
    DELETE_STATUS,
    {
      onCompleted: () => {
        toast.success("Status deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete status: ${error.message}`);
      },
      refetchQueries: ["GetStatuses"],
    }
  );

  const handleDeleteStatus = async (id: number) => {
    try {
      const result = await deleteStatus({ variables: { id } });
      return result.data?.deleteStatus;
    } catch (error) {
      console.error("Error deleting status:", error);
      throw error;
    }
  };

  return { deleteStatus: handleDeleteStatus, loading };
};

// PROFESSION HOOKS
export const useGetProfession = (id: number) => {
  return useQuery<GetProfessionQuery>(GET_PROFESSION, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
};

export const useGetProfessions = () => {
  return useQuery<GetProfessionsQuery>(GET_PROFESSIONS, {
    errorPolicy: "all",
  });
};

export const useCreateProfession = () => {
  const [createProfession, { loading }] = useMutation<CreateProfessionMutation>(
    CREATE_PROFESSION,
    {
      onCompleted: () => {
        toast.success("Profession created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create profession: ${error.message}`);
      },
      refetchQueries: ["GetProfessions"],
    }
  );

  const handleCreateProfession = async (input: CreateProfessionInput) => {
    try {
      const result = await createProfession({ variables: { input } });
      return result.data?.createProfession;
    } catch (error) {
      console.error("Error creating profession:", error);
      throw error;
    }
  };

  return { createProfession: handleCreateProfession, loading };
};

export const useUpdateProfession = () => {
  const [updateProfession, { loading }] = useMutation<UpdateProfessionMutation>(
    UPDATE_PROFESSION,
    {
      onCompleted: () => {
        toast.success("Profession updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update profession: ${error.message}`);
      },
      refetchQueries: ["GetProfessions"],
    }
  );

  const handleUpdateProfession = async (input: UpdateProfessionInput) => {
    try {
      const result = await updateProfession({ variables: { input } });
      return result.data?.updateProfession;
    } catch (error) {
      console.error("Error updating profession:", error);
      throw error;
    }
  };

  return { updateProfession: handleUpdateProfession, loading };
};

export const useDeleteProfession = () => {
  const [deleteProfession, { loading }] = useMutation<DeleteProfessionMutation>(
    DELETE_PROFESSION,
    {
      onCompleted: () => {
        toast.success("Profession deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete profession: ${error.message}`);
      },
      refetchQueries: ["GetProfessions"],
    }
  );

  const handleDeleteProfession = async (id: number) => {
    try {
      const result = await deleteProfession({ variables: { id } });
      return result.data?.deleteProfession;
    } catch (error) {
      console.error("Error deleting profession:", error);
      throw error;
    }
  };

  return { deleteProfession: handleDeleteProfession, loading };
};

// LOCATION HOOKS
export const useGetLocation = (id: number) => {
  return useQuery<GetLocationQuery>(GET_LOCATION, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
};

export const useGetLocations = () => {
  return useQuery<GetLocationsQuery>(GET_LOCATIONS, {
    errorPolicy: "all",
  });
};

export const useCreateLocation = () => {
  const [createLocation, { loading }] = useMutation<CreateLocationMutation>(
    CREATE_LOCATION,
    {
      onCompleted: () => {
        toast.success("Location created successfully");
      },
      onError: (error) => {
        toast.error(`Failed to create location: ${error.message}`);
      },
      refetchQueries: ["GetLocations"],
    }
  );

  const handleCreateLocation = async (input: CreateLocationInput) => {
    try {
      const result = await createLocation({ variables: { input } });
      return result.data?.createLocation;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  };

  return { createLocation: handleCreateLocation, loading };
};

export const useUpdateLocation = () => {
  const [updateLocation, { loading }] = useMutation<UpdateLocationMutation>(
    UPDATE_LOCATION,
    {
      onCompleted: () => {
        toast.success("Location updated successfully");
      },
      onError: (error) => {
        toast.error(`Failed to update location: ${error.message}`);
      },
      refetchQueries: ["GetLocations"],
    }
  );

  const handleUpdateLocation = async (input: UpdateLocationInput) => {
    try {
      const result = await updateLocation({ variables: { input } });
      return result.data?.updateLocation;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  };

  return { updateLocation: handleUpdateLocation, loading };
};

export const useDeleteLocation = () => {
  const [deleteLocation, { loading }] = useMutation<DeleteLocationMutation>(
    DELETE_LOCATION,
    {
      onCompleted: () => {
        toast.success("Location deleted successfully");
      },
      onError: (error) => {
        toast.error(`Failed to delete location: ${error.message}`);
      },
      refetchQueries: ["GetLocations"],
    }
  );

  const handleDeleteLocation = async (id: number) => {
    try {
      const result = await deleteLocation({ variables: { id } });
      return result.data?.deleteLocation;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  };

  return { deleteLocation: handleDeleteLocation, loading };
};

// OVERVIEW HOOKS
export const useGetOverviewStats = () => {
  return useQuery<any>(GET_OVERVIEW_STATS, {
    errorPolicy: "all",
  });
};

export const useGetRecentMembers = (limit: number = 5) => {
  return useQuery<any>(GET_RECENT_MEMBERS, {
    variables: { limit },
    errorPolicy: "all",
  });
};

export const useGetFamilySummaries = (limit: number = 5) => {
  return useQuery<any>(GET_FAMILY_SUMMARIES, {
    variables: { limit },
    errorPolicy: "all",
  });
};

export const useGetProfessionSummaries = (limit: number = 5) => {
  return useQuery<any>(GET_PROFESSION_SUMMARIES, {
    variables: { limit },
    errorPolicy: "all",
  });
};

export const useGetLocationSummaries = (limit: number = 5) => {
  return useQuery<any>(GET_LOCATION_SUMMARIES, {
    variables: { limit },
    errorPolicy: "all",
  });
};

// AUTHENTICATION HOOKS
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [login, { loading }] = useMutation<any>(LOGIN, {
    onCompleted: (data) => {
      const loginResponse = data?.login;

      if (loginResponse?.token && loginResponse?.user) {
        // Store token in localStorage
        localStorage.setItem("authToken", loginResponse.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.user));

        // Dispatch to Redux store
        dispatch(
          setCredentials({
            token: loginResponse.token,
            user: loginResponse.user,
          })
        );

        toast.success("Login successful!");
      } else {
        // Handle unsuccessful login
        const errorMessage = loginResponse?.message || "Login failed";
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
      toast.error(`Login failed: ${error.message}`);
    },
  });

  const handleLogin = async (input: { phone: string; password: string }) => {
    try {
      dispatch(setError(null)); // Clear any previous errors
      const result = await login({ variables: { input } });
      return result.data?.login;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  return { login: handleLogin, loading };
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [logout, { loading }] = useMutation<any>(LOGOUT, {
    onCompleted: () => {
      // Clear stored authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Dispatch to Redux store
      dispatch(clearCredentials());

      toast.success("Logged out successfully");
    },
    onError: (error) => {
      dispatch(setError(error.message));
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  const handleLogout = async () => {
    try {
      dispatch(setError(null)); // Clear any previous errors
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      // Even if logout fails on server, clear local data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      dispatch(clearCredentials());
    }
  };

  return { logout: handleLogout, loading };
};

// FAMILY LEADER SPECIFIC HOOKS
export const useGetFamilyMembers = (familyId: number) => {
  return useQuery<any>(GET_FAMILY_MEMBERS, {
    variables: { familyId },
    skip: !familyId,
    errorPolicy: "all",
  });
};

export const useGetFamilyStats = (familyId: number) => {
  return useQuery<any>(GET_FAMILY_STATS, {
    variables: { familyId },
    skip: !familyId,
    errorPolicy: "all",
  });
};
