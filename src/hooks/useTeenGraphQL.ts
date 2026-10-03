import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import {
  ASSIGN_CLASS_TEACHER,
  BULK_CREATE_TEEN_ATTENDANCE,
  CREATE_CLASS_SESSION_BATCH,
  CREATE_TEEN_CLASS,
  CREATE_TEENAGER,
  DELETE_CLASS_SESSION_BATCH,
  DELETE_TEEN_CLASS,
  DELETE_TEENAGER,
  GET_CLASS_SESSION,
  GET_CLASS_SESSION_BATCHES,
  GET_CLASS_SESSIONS,
  GET_MY_TEEN_CLASSES,
  GET_TEEN_ATTENDANCES,
  GET_TEEN_CLASS,
  GET_TEEN_CLASSES,
  GET_TEEN_OVERVIEW_STATS,
  GET_TEENAGER,
  GET_TEENAGERS,
  PROMOTE_TEENAGER_TO_MEMBER,
  REMOVE_CLASS_TEACHER,
  TRANSFER_TEENAGER,
  UPDATE_CLASS_SESSION,
  UPDATE_CLASS_SESSION_BATCH,
  UPDATE_TEEN_CLASS,
  UPDATE_TEENAGER,
} from "../graphql/operations";

export const useGetTeenClasses = () =>
  useQuery(GET_TEEN_CLASSES, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetMyTeenClasses = () =>
  useQuery(GET_MY_TEEN_CLASSES, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetTeenClass = (id: number) =>
  useQuery(GET_TEEN_CLASS, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetTeenagers = (filter?: any, pagination?: any) =>
  useQuery(GET_TEENAGERS, {
    variables: { filter, pagination },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetTeenager = (id: number) =>
  useQuery(GET_TEENAGER, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });

export const useGetTeenOverviewStats = (options?: { skip?: boolean }) =>
  useQuery(GET_TEEN_OVERVIEW_STATS, {
    errorPolicy: "all",
    skip: options?.skip,
  });

export const useGetClassSessions = (filter?: any, pagination?: any) =>
  useQuery(GET_CLASS_SESSIONS, {
    variables: { filter, pagination },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetClassSession = (id: number) =>
  useQuery(GET_CLASS_SESSION, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetClassSessionBatches = (filter?: any, pagination?: any) =>
  useQuery(GET_CLASS_SESSION_BATCHES, {
    variables: { filter, pagination },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useGetTeenAttendances = (filter?: any, pagination?: any) =>
  useQuery(GET_TEEN_ATTENDANCES, {
    variables: { filter, pagination },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

export const useCreateTeenClass = () => {
  const [mutate, { loading }] = useMutation(CREATE_TEEN_CLASS, {
    onCompleted: () => toast.success("Class created successfully"),
    onError: (e) => toast.error(e.message),
  });
  return {
    createTeenClass: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.createTeenClass;
    },
    loading,
  };
};

export const useUpdateTeenClass = () => {
  const [mutate, { loading }] = useMutation(UPDATE_TEEN_CLASS, {
    onCompleted: () => toast.success("Class updated successfully"),
    onError: (e) => toast.error(e.message),
  });
  return {
    updateTeenClass: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.updateTeenClass;
    },
    loading,
  };
};

export const useDeleteTeenClass = () => {
  const [mutate, { loading }] = useMutation(DELETE_TEEN_CLASS, {
    onCompleted: () => toast.success("Class deleted"),
    onError: (e) => toast.error(e.message),
  });
  return {
    deleteTeenClass: async (id: number) => {
      const result = await mutate({ variables: { id } });
      return (result.data as any)?.deleteTeenClass;
    },
    loading,
  };
};

export const useCreateTeenager = () => {
  const [mutate, { loading }] = useMutation(CREATE_TEENAGER, {
    onCompleted: () => toast.success("Teenager registered successfully"),
    onError: (e) => toast.error(e.message),
  });
  return {
    createTeenager: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.createTeenager;
    },
    loading,
  };
};

export const useUpdateTeenager = () => {
  const [mutate, { loading }] = useMutation(UPDATE_TEENAGER, {
    onCompleted: () => toast.success("Teenager updated successfully"),
    onError: (e) => toast.error(e.message),
  });
  return {
    updateTeenager: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.updateTeenager;
    },
    loading,
  };
};

export const useDeleteTeenager = () => {
  const [mutate, { loading }] = useMutation(DELETE_TEENAGER, {
    onCompleted: () => toast.success("Teenager deleted"),
    onError: (e) => toast.error(e.message),
  });
  return {
    deleteTeenager: async (id: number) => {
      const result = await mutate({ variables: { id } });
      return (result.data as any)?.deleteTeenager;
    },
    loading,
  };
};

export const useTransferTeenager = () => {
  const [mutate, { loading }] = useMutation(TRANSFER_TEENAGER, {
    onCompleted: (data: any) =>
      toast.success(data?.transferTeenager?.message || "Transferred"),
    onError: (e) => toast.error(e.message),
  });
  return {
    transferTeenager: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.transferTeenager;
    },
    loading,
  };
};

export const useAssignClassTeacher = () => {
  const [mutate, { loading }] = useMutation(ASSIGN_CLASS_TEACHER, {
    onCompleted: (data: any) =>
      toast.success(data?.assignClassTeacher?.message || "Teacher assigned"),
    onError: (e) => toast.error(e.message),
  });
  return {
    assignClassTeacher: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.assignClassTeacher;
    },
    loading,
  };
};

export const useRemoveClassTeacher = () => {
  const [mutate, { loading }] = useMutation(REMOVE_CLASS_TEACHER, {
    onCompleted: () => toast.success("Teacher removed"),
    onError: (e) => toast.error(e.message),
  });
  return {
    removeClassTeacher: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.removeClassTeacher;
    },
    loading,
  };
};

export const useCreateClassSessionBatch = () => {
  const [mutate, { loading }] = useMutation(CREATE_CLASS_SESSION_BATCH, {
    onCompleted: () => toast.success("Session batch created"),
    onError: (e) => toast.error(e.message),
  });
  return {
    createClassSessionBatch: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.createClassSessionBatch;
    },
    loading,
  };
};

export const useUpdateClassSessionBatch = () => {
  const [mutate, { loading }] = useMutation(UPDATE_CLASS_SESSION_BATCH, {
    onCompleted: () => toast.success("Session batch updated"),
    onError: (e) => toast.error(e.message),
  });
  return {
    updateClassSessionBatch: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.updateClassSessionBatch;
    },
    loading,
  };
};

export const useUpdateClassSession = () => {
  const [mutate, { loading }] = useMutation(UPDATE_CLASS_SESSION, {
    onCompleted: () => toast.success("Session updated"),
    onError: (e) => toast.error(e.message),
  });
  return {
    updateClassSession: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.updateClassSession;
    },
    loading,
  };
};

export const useDeleteClassSessionBatch = () => {
  const [mutate, { loading }] = useMutation(DELETE_CLASS_SESSION_BATCH, {
    onCompleted: () => toast.success("Session batch deleted"),
    onError: (e) => toast.error(e.message),
  });
  return {
    deleteClassSessionBatch: async (id: number) => {
      const result = await mutate({ variables: { id } });
      return (result.data as any)?.deleteClassSessionBatch;
    },
    loading,
  };
};

export const useBulkCreateTeenAttendance = () => {
  const [mutate, { loading }] = useMutation(BULK_CREATE_TEEN_ATTENDANCE, {
    onError: (e) => toast.error(e.message),
  });
  return {
    bulkCreateTeenAttendance: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.bulkCreateTeenAttendance;
    },
    loading,
  };
};

export const usePromoteTeenagerToMember = () => {
  const [mutate, { loading }] = useMutation(PROMOTE_TEENAGER_TO_MEMBER, {
    onCompleted: (data: any) =>
      toast.success(
        data?.promoteTeenagerToMember?.message || "Promoted to youth member",
      ),
    onError: (e) => toast.error(e.message),
  });
  return {
    promoteTeenagerToMember: async (input: any) => {
      const result = await mutate({ variables: { input } });
      return (result.data as any)?.promoteTeenagerToMember;
    },
    loading,
  };
};
