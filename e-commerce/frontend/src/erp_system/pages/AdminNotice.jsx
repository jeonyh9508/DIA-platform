import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeBoard from "../components/AdminNotice/NoticeBoard";
import NoticeForm from "../components/AdminNotice/NoticeForm";
import { useAuth } from "../../App";
import "../css/AdminNotice.css";

function AdminNotice({ adminId }) {
  const { user, hasRole } = useAuth();
  const [notice, setNotice] = useState([]);
  const [type, setType] = useState("board");

  const fetchNoticeList = () => {
    axios
      .get("http://localhost:9090/erp-system/view")
      .then((res) => setNotice(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNoticeList();
  }, []);

  return (
    <div className="erp-an-page">
      <h2>공지사항</h2>

      {type === "board" ? (
        <button className="erp-an-btn" onClick={() => {
          if(hasRole(["SUPER", "CS"])) {
            setType("write")
          } else {
            alert("권한이 없습니다.");
            return;
          }
        }}>
          글쓰기
        </button>
      ) : (
        <button className="erp-an-btn" onClick={() => setType("board")}>
          목록으로
        </button>
      )}

      {type === "board" && (
        <NoticeBoard
          className="erp-an-board"
          notice={notice}
          adminId={adminId}
          setType={setType}
          onUpdate={fetchNoticeList}
        />
      )}

      {type === "write" && (
        <NoticeForm
          className="erp-an-form"
          adminId={adminId}
          onUpdate={fetchNoticeList}
          setType={setType}
        />
      )}
    </div>
  );
}

export default AdminNotice;
