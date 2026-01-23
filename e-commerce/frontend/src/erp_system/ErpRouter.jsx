import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import AuthWrapper from "../components/AuthWrapper";
import ErpDashboard from "./pages/ErpDashboard";
import CsDashboard from "./pages/CsDashboard";
import SettlementList from "./settlement/SettlementList";
import { useEffect, useRef, useState } from "react";
import ErpQnaAdmin from "./pages/ErpQnaAdmin";
import WorkshopApproval from "./pages/WorkshopApproval";
import ProgramApproval from "./pages/ProgramApproval";
import BannerAdmin from "./pages/BannerAdmin";
import AdminNotice from "./pages/AdminNotice";
import ErpHeader from "./ErpHeader";
import SettlementView from "./settlement/SettlementView";
import ActionLog from "./pages/ActionLog";
import AdminRegister from "./pages/AdminRegister";
import ApprovalLog from "./pages/ApprovalLog";

function ErpRouter() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const alertCheck = useRef(false);

  useEffect(() => {
    if (!user) {
      if (loading) return;
      if (alertCheck.current) return;

      alertCheck.current = true;
      alert("로그인이 필요한 페이지입니다.");
      navigate("/erp-system/login");
    }
  }, [loading, navigate, user]);

  if (loading) {
    return <div className="ws-container">로딩 중...</div>;
  }

  const userId = user?.userId;

  return (
    <div>
      <ErpHeader userId={userId} />
      <Routes>
        <Route />
        
        <Route path="/admin/action-log" element={<ActionLog />} />
        <Route
          path="/settlement/list"
          element={<SettlementList adminId={userId} />}
        />
        <Route
          path="/settlement/dashboard"
          element={<SettlementView adminId={userId} />}
        />

        <Route path="/notice" element={<AdminNotice adminId={userId} />} />
        <Route />

        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/" element={<ErpDashboard userId={userId} />} />

        <Route path="/dashboard/cs" element={<CsDashboard userId={userId} />} />

        <Route path="/qna-admin" element={<ErpQnaAdmin userId={userId} />} />

        <Route
          path="/approval/workshop"
          element={<WorkshopApproval userId={userId} />}
        />

        <Route
          path="/approval/program"
          element={<ProgramApproval userId={userId} />}
        />

        <Route
          path="/admin/approval-log"
          element={<ApprovalLog userId={userId} />}
        />

        <Route path="/banner" element={<BannerAdmin userId={userId} />} />
      </Routes>
    </div>
  );
}

export default ErpRouter;
