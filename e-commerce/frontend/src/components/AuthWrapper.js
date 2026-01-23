import React, { useEffect, useRef } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../App"; // 경로는 프로젝트 구조에 맞게 확인해주세요
import { toast } from 'react-toastify';

function AuthWrapper({ allowedRoles }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const wasLoggedIn = useRef(!!user);

    // 1. 유저의 모든 권한(Role + Authorities)을 1차원 배열로 추출하는 함수
    const getUserRoles = (currentUser) => {
        if (!currentUser) return [];

        // 기본 role (ADMIN, WORKSHOP, CUSTOMER)
        const roles = [currentUser.role];

        // 상세 authorities (SUPER, PAY, CS 등)
        if (currentUser.authorities && Array.isArray(currentUser.authorities)) {
            const parsedAuthorities = currentUser.authorities.map(auth => {
                // Spring Security가 객체({ authority: "SUPER" })로 줄 경우와 문자열("SUPER")로 줄 경우 모두 대비
                return typeof auth === 'object' ? auth.authority : auth;
            });
            roles.push(...parsedAuthorities);
        }
        return roles;
    };

    // 2. 권한 체크 로직
    const checkPermission = () => {
        if (!user || !allowedRoles) return false;

        const userRoles = getUserRoles(user);

        // A. 'SUPER' 권한이 있다면 프리패스 (최고 관리자는 모든 관리자 페이지 접근 가능)
        if (userRoles.includes('SUPER')) return true;

        // B. 요구되는 권한 중 하나라도 가지고 있는지 확인 (교집합 확인)
        return allowedRoles.some(role => userRoles.includes(role));
    };

    const hasPermission = checkPermission();

    useEffect(() => {
        if (loading) return;

        // 비로그인 상태 처리
        if (!user) {
            if (!wasLoggedIn.current) {
                toast.error("로그인이 필요합니다.", { toastId: "login-needed" });
            }
            return; 
        }

        // 로그인 상태 업데이트
        wasLoggedIn.current = true;

        // 권한 없음 처리
        if (!hasPermission) {
            toast.error('이 페이지에 접근할 권한이 없습니다.', { toastId: "permission-denied" });
            navigate('/', { replace: true });
        }
    }, [user, loading, hasPermission, navigate]);


    // --- 렌더링 로직 ---

    if (loading) {
        return <div>인증 정보 로딩 중...</div>; // 스피너 컴포넌트로 대체 가능
    }

    // 비로그인 시 리다이렉트
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // 권한 없을 시 (useEffect에서 navigate 하지만, 화면 깜빡임 방지용 null 리턴)
    if (!hasPermission) {
        return null;
    }

    return <Outlet />;
}

export default AuthWrapper;