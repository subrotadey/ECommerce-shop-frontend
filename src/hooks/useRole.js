// hooks/useRole.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

const useRole = (email) => {
  const { data: roleData = {}, isLoading, error } = useQuery({
    queryKey: ["role", email],
    queryFn: async () => {
      if (!email) return { role: null };
      
      const res = await axiosInstance.get(`/api/users/role/${email}`);
      return res.data;
    },
    enabled: !!email, // শুধুমাত্র email থাকলে query চালাবে
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    role: roleData?.role || null,
    isLoading,
    error,
    isAdmin: roleData?.role === 'admin',
    isStaff: roleData?.role === 'staff',
    isUser: roleData?.role === 'user',
  };
};

export default useRole;