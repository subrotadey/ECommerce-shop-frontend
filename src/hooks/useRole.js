// ============================================
// hooks/useRole.js - IMPROVED
// ============================================
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

const useRole = (email) => {
  const { 
    data: roleData, 
    isLoading, 
    error,
    refetch // ✅ Expose refetch for manual updates
  } = useQuery({
    queryKey: ["role", email],
    queryFn: async () => {
      if (!email) {
        return { role: null };
      }
      
      const res = await axiosInstance.get(`/api/users/role/${email}`);
      return res.data;
    },
    enabled: !!email,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000, // ✅ Cache for 10 minutes
  });

  return {
    role: roleData?.role || null,
    isLoading,
    error,
    isAdmin: roleData?.role === 'admin',
    isStaff: roleData?.role === 'staff',
    isUser: roleData?.role === 'user',
    refetch // ✅ Allow manual refresh
  };
};

export default useRole;