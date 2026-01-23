import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, loginUser, logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 30, // 30분간 데이터 유지
    gcTime: 1000 * 60 * 60,    // 1시간 뒤 캐시 삭제
    retry: 0, 
    refetchOnWindowFocus: false,
    onError: (err) => {
      if (err.response?.status === 401) {
        queryClient.setQueryData(['currentUser'], null);
      }
    },
  });

  // 2. 권한 확인 함수
  const hasRole = (requiredRoles) => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // authorities가 없으면 빈 배열 처리
    const userAuthorities = user.authorities 
        ? user.authorities.map(auth => auth.authority) 
        : [];

    return rolesToCheck.some(role => {
      if (userAuthorities.includes('ROLE_SUPER')) return true;
      if (user.role === role) return true;
      if (userAuthorities.includes(`ROLE_${role}`)) return true;
      return false;
    });
  };

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // 로그인 성공 시 즉시 캐시 업데이트 -> App.js 등 모든 곳에 즉시 반영됨
      queryClient.setQueryData(['currentUser'], data);
      toast.success("로그인 성공!");
      
      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard'); 
      } else {
        navigate('/');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "로그인 실패");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      toast.info("로그아웃 되었습니다.");
      navigate('/login');
    },
  });

  return {
    user,
    // 데이터가 없는데 가져오는 중이면 로딩으로 침
    loading: isLoading || (isFetching && !user), 
    hasRole,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
};