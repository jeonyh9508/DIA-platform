import React, { useRef } from "react";
import "../../css/BannerAdmin.css";
import HomeBanner from "../../../customer/components/Home/HomeBanner";

function PreviewModal({ show, onClose, banners }) {
  const scrollRef = useRef(null);

  if (!show) return null;

  return (
    <div className="banner-preview-modal">
      <div className="banner-preview-content">
        <h3>배너 미리보기</h3>

        {/* HomeBanner 컴포넌트 그대로 사용 */}
        <HomeBanner scrollRef={scrollRef} bannersOverride={banners} />

        <button className="banner-preview-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default PreviewModal;
