import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import api from "./api/axiosConfig";
import AuthWrapper from "./components/AuthWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Home from "./customer/pages/Home";
import WorkshopInfo from "./customer/pages/WorkshopInfo";
import ProgramInfo from "./customer/pages/ProgramInfo";
import WorkshopRouter from "./workshop/WorkshopRouter";
import MyPage from "./customer/pages/MyPage";
import MyFollow from "./customer/pages/MyFollow";
import MyReservation from "./customer/pages/MyReservation";
import MyProgram from "./customer/pages/MyProgram";
import MyNotification from "./customer/pages/MyNotification";
import MyQna from "./customer/pages/MyQna";
import MyReview from "./customer/pages/MyReview";
import Search from "./customer/pages/Search";
import ReservationInfo from "./customer/pages/ReservationInfo";
import MyWish from "./customer/pages/MyWish";
import Workshops from "./customer/pages/WorkshopAll";
import WorkshopAll from "./customer/pages/WorkshopAll";
import Register from "./common/Register";
import RegisterTest from "./common/RegisterTest";
import ReservationDetail from "./customer/pages/ReservationDetail";
import FindPasswordPage from "./erp_system/pages/FindPasswordPage";
import ErpRouter from "./erp_system/ErpRouter";
import AdminLogin from "./erp_system/pages/AdminLogin";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = user ? user.userId : null;

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/current-user");
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUser(null);
        } else {
          console.error("Failed to fetch user info:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      toast("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패: ", error);
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;

    const rolesToCheck = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    const userAuthorities = user.authorities
      ? user.authorities.map((auth) =>
          typeof auth === "object" ? auth.authority : auth
        )
      : [];

    return rolesToCheck.some((role) => {
      if (
        userAuthorities.includes("SUPER") ||
        userAuthorities.includes("ROLE_SUPER")
      )
        return true;

      if (user.role === role) return true;

      if (
        userAuthorities.includes(role) ||
        userAuthorities.includes(`ROLE_${role}`)
      )
        return true;

      return false;
    });
  };

  const authContextValue = { user, login, logout, loading, setUser, hasRole };

  return (
    <AuthContext.Provider value={authContextValue}>
      <ToastContainer
        className="Toastify__toast"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick
        limit={2}
      />
      <Routes>
        {/* 메인 선택 화면 */}
        <Route path="/" element={<Home />} />
        <Route path="/find-password" element={<FindPasswordPage />} />

        {/* 고객 페이지 */}
        <Route
          path="/customer/workshop/:id"
          element={<WorkshopInfo userId={userId} />}
        />
        <Route
          path="/customer/program/:id"
          element={<ProgramInfo userId={userId} />}
        />
        <Route path="/customer/search" element={<Search userId={userId} />} />
        <Route
          path={`/customer/workshopall`}
          element={<WorkshopAll userId={userId} />}
        />
        <Route element={<AuthWrapper allowedRoles={["CUSTOMER"]} />}>
          <Route
            path="/customer/reservation-info"
            element={<ReservationInfo userId={userId} />}
          />

          <Route
            path={`/customer/mypage`}
            element={<MyPage userId={userId} />}
          />
          <Route
            path={`/customer/my-wish`}
            element={<MyWish userId={userId} />}
          />
          <Route
            path={`/customer/my-follow`}
            element={<MyFollow userId={userId} />}
          />
          <Route
            path={`/customer/my-reservation`}
            element={<MyReservation userId={userId} />}
          />
          <Route
            path={`/customer/my-program`}
            element={<MyProgram userId={userId} />}
          />
          <Route
            path={`/customer/my-notification`}
            element={<MyNotification userId={userId} />}
          />
          <Route
            path={`/customer/my-qna`}
            element={<MyQna userId={userId} />}
          />
          <Route
            path={`/customer/my-review`}
            element={<MyReview userId={userId} />}
          />
          <Route
            path={`/customer/reservation-detail/:id`}
            element={<ReservationDetail userId={userId} />}
          />
        </Route>
        {/* 공방 페이지 */}
        <Route element={<AuthWrapper allowedRoles={["WORKSHOP"]} />}>
          <Route path="/workshop/*" element={<WorkshopRouter />} />
        </Route>
        <Route path="/erp-system/login" element={<AdminLogin />} />
        <Route element={<AuthWrapper allowedRoles={["ADMIN"]} />}>
          <Route path="/erp-system/*" element={<ErpRouter />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
