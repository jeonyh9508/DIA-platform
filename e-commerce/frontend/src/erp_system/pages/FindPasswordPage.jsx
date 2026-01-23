import React from "react";
import FindPassword from "../../common/FindPassword";
import styles from "../css/FindPasswordPage.module.css";
import { useNavigate } from "react-router-dom";

function FindPasswordPage() {
    const findPwdPage = true;
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.length > 1) {
        navigate(-1);
        } else {
        navigate('/');
        }
    };

    return(
        <div className={styles.wrapper}>
            <button 
            type="button" 
            className={styles.backButton} 
            onClick={handleGoBack}
            aria-label="뒤로 가기"
            >
                <img 
                    src="http://localhost:9090/upload/btn/left-arrow-icon.png"
                    alt="뒤로가기 아이콘"
                    className={styles.backIcon} 
                />
                뒤로가기
            </button>
            <div className={styles.container}>
                <FindPassword findPwdPage={findPwdPage} />
            </div>
        </div>
    );
}

export default FindPasswordPage;