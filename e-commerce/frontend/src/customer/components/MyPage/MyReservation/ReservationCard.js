import React from "react";
import { Link } from "react-router-dom";
import LoadMore from "../../LoadMore";

function ReservationCard({
  filteredList,
  visibleCount,
  handleLoadMore,
  cancelReservation,
  isCancelled,
  openReviewModal,
  openQnaModal,
}) {
  return (
    <div className="content-wrapper">
      {filteredList.length > 0 ? (
        filteredList.slice(0, visibleCount).map((reservation) => (
          <div key={reservation.reservationId} className="reservation-card">
            <div className="reservation-card-header">
              <div className={`reservation-status ${reservation.status}`}>
                {reservation.status}
              </div>
              <div>
                <Link
                  to={`/customer/reservation-detail/${reservation.reservationId}`}
                  className="link"
                >
                  <button className="detail-btn">상세보기</button>
                </Link>
              </div>
            </div>

            <div className="reservation-card-content">
              <Link
                to={`/customer/program/${reservation.programId}`}
                className="link"
              >
                <div
                  className={`program-thumb ${
                    reservation.thumb == null ? "no-image" : ""
                  }`}
                >
                  {reservation.thumb != null ? (
                    <img
                      src={`http://localhost:9090/upload/workshop/${reservation.workshopId}/program/${reservation.programId}/${reservation.thumb}`}
                      alt="프로그램 썸네일"
                    />
                  ) : (
                    <p>이미지 없음</p>
                  )}
                </div>
              </Link>

              <div className="program-content">
                <div className="info-grid">
                  <div className="label">프로그램명</div>
                  <div className="value">{reservation.title}</div>

                  <div className="label">일시</div>
                  <div className="value">{reservation.scheduleDate}</div>

                  <div className="label">가격 (인원)</div>
                  <div className="value">
                    {reservation.totalPrice.toLocaleString()}원 (
                    {reservation.numPeople}인)
                  </div>
                </div>

                <div className="reservation-btn-set">
                  <button
                    className="reservation-buttons"
                    disabled={!(reservation.status === "수강종료")}
                    onClick={() => openReviewModal(reservation)}
                  >
                    리뷰 작성
                  </button>
                  <button
                    className="reservation-buttons"
                    onClick={() => openQnaModal(reservation)}
                  >
                    문의하기
                  </button>
                  <button
                    className="reservation-buttons"
                    onClick={() => cancelReservation(reservation.reservationId)}
                    disabled={
                      isCancelled ||
                      reservation.status === "수강종료" ||
                      reservation.status === "취소"
                    }
                  >
                    예약 취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-message">결제 또는 예약된 내역이 없습니다.</div>
      )}

      <LoadMore
        visibleCount={visibleCount}
        items={filteredList}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
}

export default ReservationCard;
