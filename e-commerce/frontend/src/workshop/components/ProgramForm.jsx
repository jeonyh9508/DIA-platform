import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import "../css/ProgramForm.css";
import { toast } from "react-toastify";

function ProgramForm({
  workshopId,
  programId,
  onClose,
  onSuccess,
  type,
  update,
}) {
  const navigate = useNavigate();
  const [scheduleType, setScheduleType] = useState("ALWAYS");
  const [thumb, setThumb] = useState(null);
  const [multiImages, setMultiImages] = useState([]);

  const [active, setActive] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [approved, setApproved] = useState("");
  const [price, setPrice] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [durationMin, setDurationMin] = useState("");

  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  useEffect(() => {
    if (programId) {
      axios
        .get(
          `http://localhost:9090/workshop/program/select-one?programId=${programId}`
        )
        .then((res) => {
          setTitle(res.data.title);
          setDescription(res.data.description);
          setPrice(res.data.price);
          setDifficulty(res.data.difficulty);
          setDurationMin(res.data.durationMin);
          setActive(res.data.active);
          setApproved(res.data.approved);
        });
    }
  }, [programId]);

  const insert = (e) => {
    e.preventDefault();

    const f = e.target;

    const data = {
      workshopId: workshopId,
      title: f.title.value,
      description: f.description.value,
      category: f.category.value,
      price: Number(f.price.value),
      durationMin: Number(f.durationMin.value),
      difficulty: f.difficulty.value,
      scheduleType: f.scheduleType.value,
      periodStart: periodStart || null,
      periodEnd: periodEnd || null,
    };

    const formData = new FormData();
    formData.append(
      "program",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    if (thumb) formData.append("thumb", thumb);
    if (multiImages && multiImages.length > 0) {
      multiImages.forEach((file) => formData.append("multiImages", file));
    }

    axios
      .post("http://localhost:9090/workshop/program/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        //navigate(`/customer/program/${res.data}`);
        toast.success("프로그램이 등록되었습니다! (승인 대기 중)");
        onSuccess();
        onClose();
      });
  };

  const modi = (e) => {
    e.preventDefault();

    const data = {
      programId: programId,
      title: title,
      description: description,
      price: price,
      difficulty: difficulty,
      durationMin: Number(durationMin),
      approved: approved,
    };

    axios
      .post("http://localhost:9090/workshop/program/modi", data)
      .then((res) => {
        alert("성공적으로 수정되었습니다.");
        onClose();
        if (update) {
          update();
        }
        if (onSuccess) onSuccess();
      });
  };

  function toggleActive() {
    if (active) {
      if (!window.confirm("프로그램을 비활성화 하시겠습니까?")) {
        return;
      }
    } else {
      if (!window.confirm("프로그램을 활성화 하시겠습니까?")) {
        return;
      }
    }

    const newActive = !active;
    setActive(newActive);

    const data = {
      programId: Number(programId),
      active: newActive,
    };
    axios
      .post(`http://localhost:9090/workshop/program/active`, data)
      .then((res) => {
        alert("정상적으로 처리되었습니다.");
        navigate(`/workshop/info/${workshopId}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <div className="ws-program-form-container">
      {type === "programAdd" ? (
        <>
          <h3 className="ws-form-title">프로그램 추가</h3>
          <form onSubmit={insert}>
            <div className="ws-form-group">
              <input name="title" placeholder="프로그램명" type="text" />
            </div>
            <div className="ws-form-group">
              <textarea
                name="description"
                placeholder="설명"
                type="text"
                rows={1}
              />
            </div>
            <div className="ws-form-group">
              <input name="category" placeholder="카테고리" type="text" />
            </div>
            <div className="ws-form-group">
              <input name="price" placeholder="가격" type="number" />
            </div>
            <div className="ws-form-group">
              <FileUpload
                label="썸네일"
                type="single"
                name="thumb"
                onChange={setThumb}
              />
            </div>
            <div className="ws-form-group">
              <FileUpload
                label="상세 이미지"
                type="multi"
                name="multiImages"
                onChange={setMultiImages}
              />
            </div>
            <div className="ws-form-group">
              <input
                name="durationMin"
                placeholder="진행 시간(분)"
                type="number"
              />
            </div>
            <div className="ws-form-group">
              <select name="difficulty" defaultValue="">
                <option value="" disabled>
                  -- 난이도 선택 --
                </option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>

            <div className="ws-form-group">
              <select
                name="scheduleType"
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
              >
                <option value="ALWAYS">정기</option>
                <option value="PERIOD">기간</option>
              </select>
            </div>

            {scheduleType === "PERIOD" && (
              <div className="ws-form-group ws-period-inputs">
                <label>
                  시작일:
                  <input
                    type="date"
                    name="periodStart"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </label>
                <label>
                  종료일:
                  <input
                    type="date"
                    name="periodEnd"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    disabled={!periodStart}
                    min={periodStart || new Date().toISOString().split("T")[0]}
                  />
                </label>
              </div>
            )}
            <div className="ws-modal-action-buttons">
              <button type="submit">프로그램 생성</button>
            </div>
          </form>
        </>
      ) : (
        <div className="ws-pg-modi-form">
          <form onSubmit={modi}>
            {type === "programReject" ? (
              <></>
            ) : (
              <h3 className="ws-form-title">{title || "프로그램 수정"}</h3>
            )}
            <input type="hidden" value={programId} />

            <div className="ws-form-group">
              <label>설명</label>
              <textarea
                id="modi-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명"
              />
            </div>
            <div className="ws-form-group">
              <label>가격</label>
              <input
                id="modi-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="가격"
              />
            </div>
            <div className="ws-form-group">
              <label>난이도</label>
              <select
                id="modi-difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="" disabled>
                  -- 난이도 선택 --
                </option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>
            <div className="ws-form-group">
              <label>진행 시간(분)</label>
              <input
                id="modi-duration"
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                placeholder="진행 시간(분)"
              />
            </div>
            <div className="ws-modal-action-buttons">
              <button type="submit">프로그램 수정</button>
              {type === "programReject" ? (
                <></>
              ) : (
                <>
                  {active ? (
                    <button
                      type="button"
                      onClick={toggleActive}
                      className="ws-btn-deactivate"
                    >
                      프로그램 비활성화
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleActive}
                      className="ws-btn-deactivate"
                    >
                      프로그램 활성화
                    </button>
                  )}
                </>
              )}

              <button type="button" onClick={onClose}>
                닫기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProgramForm;
