import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import useAxiosSecure from "../hook/useAxiosSecure";

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = null, isLoading: isRoleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !authLoading && !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data?.role;
    },
  });

  return { role, roleLoading: isRoleLoading || authLoading };
};

export default useRole;