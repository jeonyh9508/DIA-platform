import React, { useEffect, useRef, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import "../css/AddressSearch.css";
const KAKAO_JAVASCRIPT_KEY = "0c716bfe246918e14d81837c3c89b09e";

const geocodeAddress = (addr, kakao, setMapCenter, isSearchMode) => {
  if (!kakao || !kakao.maps || !kakao.maps.services || !addr) return;

  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(addr, (result, status) => {
    if (status === kakao.maps.services.Status.OK && result.length > 0) {
      const pos = {
        lat: parseFloat(result[0].y),
        lng: parseFloat(result[0].x),
      };
      setMapCenter(pos);
    } else {
      if (isSearchMode) {
        alert("주소 검색에 실패했습니다.");
      }
    }
  });
};

function AddressSearch({ addressSelect, onClose, workshopLoc }) {
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 37.566826,
    lng: 126.978656,
  });

  const [isZoomable, setIsZoomable] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimeoutRef = useRef(null);

  useKakaoLoader({ appkey: KAKAO_JAVASCRIPT_KEY, libraries: ["services"] });

  const { kakao } = window;
  const isSearchMode = !workshopLoc || workshopLoc === "";

  useEffect(() => {
    const handleKey = (e) => {
      // Ctrl 키나 Mac의 Command 키가 눌려있는지 확인
      if (e.ctrlKey || e.metaKey) {
        setIsZoomable(true);
        setShowOverlay(false);
      } else {
        setIsZoomable(false);
      }
    };

    // 키를 누를 때와 뗄 때 모두 체크
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (workshopLoc) {
      setAddress(workshopLoc);

      geocodeAddress(workshopLoc, kakao, setMapCenter, isSearchMode);
    } else {
      setAddress("");
      setMapCenter({ lat: 37.566826, lng: 126.978656 });
    }
  }, [workshopLoc, kakao, isSearchMode]);

  const searchAddress = () => {

    if (!address) return alert("주소를 입력해주세요.");
    geocodeAddress(address, kakao, setMapCenter, isSearchMode);
  };

  const handleConfirm = () => {
    if (!address) return alert("주소를 입력해주세요.");
    addressSelect(address);
    onClose();
  };

  const handleMapWheel = () => {
    if (!isZoomable) {
      setShowOverlay(true);

      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }

      overlayTimeoutRef.current = setTimeout(() => {
        setShowOverlay(false);
        overlayTimeoutRef.current = null;
      }, 1500);
    }
  };

  const MapComponent = (
    <Map
      center={mapCenter}
      style={{ width: "100%", height: isSearchMode ? "400px" : "300px" }}
      level={3}
      zoomable={isZoomable}
      onLoad={(map) => {
        if (!isSearchMode) {
          setTimeout(() => {
            map.setCenter(mapCenter);
          }, 200);
        }
      }}
    >
      <MapMarker position={mapCenter} />
    </Map>
  );

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // 반투명 검은색
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.1rem",
    fontWeight: "bold",
    zIndex: 10, // 지도 위에 표시
    pointerEvents: "none", // 마우스 클릭이 지도에 전달되도록 설정
    transition: "opacity 0.3s ease-in-out", // 부드러운 효과
    opacity: showOverlay ? 1 : 0,
  };

  return (
    <div className="ws-address-search-modal">
      <input type="hidden" value={address} />
      {isSearchMode ? (
        <>
          <h3>주소 검색</h3>
          <div className="ws-search-input-group">
            <input
              type="text"
              placeholder="주소를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={searchAddress}>검색</button>

          </div>
        </>
      ) : (
        <></>
      )}

      <div 
        style={{ position: "relative", height: isSearchMode ? "400px" : "300px" }} 
        onWheel={handleMapWheel}
      >
        {MapComponent}
        
        {/* 안내 오버레이 */}
        <div style={overlayStyle}>
          Ctrl + 스크롤을 사용하여 지도를 확대/축소할 수 있습니다.
        </div>
      </div>

      {isSearchMode && (
        <div className="ws-modal-action-buttons">
          <button onClick={handleConfirm}>확인</button>
        </div>
      )}
    </div>
  );
}

export default AddressSearch;
