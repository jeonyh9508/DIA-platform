import { Routes, Route, useLocation } from "react-router-dom";
import WorkshopHome from "./pages/WorkshopHome";
import WorkshopInfo from "./pages/WorkshopInfo";
import WorkshopAdd from "./pages/WorkshopAdd";
import WorkshopModi from "./pages/WorkshopModi";
import WsHeader from "./components/WsHeader";
import Report from "./pages/Report";
import ProfitDetail from "./pages/ProfitDetail";
import "./css/Layout.css";
import { useAuth } from "../App";

function WorkshopRouter() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="ws-container">로딩 중...</div>;
  }

  if (!user) {
    alert("로그인이 필요한 페이지입니다.");
    return null;
  }

  const ownerId = user.userId;
  const role = ownerId ? user.role : "";
  const name = user.name;

  const monthly = () => {
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() - 1);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const lastMonth = `${year}-${month}`;

    return lastMonth;
  };
  console.log(monthly());
  return (
    <div className="ws-container ws-costom-font">
      <div className="ws-header">
        <WsHeader ownerId={ownerId} role={role} />
      </div>
      <main className="ws-content">
        <Routes>
          <Route
            path="/"
            element={
              <WorkshopHome
                ownerId={ownerId}
                role={role}
                name={name}
                monthly={monthly()}
              />
            }
          />
          <Route
            path="info/:workshopId"
            element={<WorkshopInfo ownerId={ownerId} role={role} />}
          />
          <Route
            path="add"
            element={<WorkshopAdd ownerId={ownerId} role={role} />}
          />
          <Route
            path="ws-modi/:workshopId"
            element={<WorkshopModi ownerId={ownerId} />}
          />
          <Route
            path="report/view/:workshopId/:name"
            element={<Report ownerId={ownerId} key={location.key} />}
          />
          <Route
            path="profit/ws-detail/:workshopId"
            element={<ProfitDetail ownerId={ownerId} monthly={monthly()} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default WorkshopRouter;
