import api from "../api/axiosConfig";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { toast } from "react-toastify";
import styles from "./Login.module.css";

function Login({ onLoginSuccess, onRegister, onFindPwd }) {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email) {
      toast("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      toast("패스워드를 입력해주세요.");
      return;
    }

    try {
      const response = await api.post(`/login`, { email, password });
      const userData = response.data;
      const loginSuccess = true;

      if (loginSuccess) {
        onLoginSuccess();
      }

      if (userData.role === 'ADMIN') {
        await api.post('/logout');
        alert("관리자 계정으로는 쇼핑몰을 이용할 수 없습니다.\n관리자 페이지를 이용해주세요.");
        window.location.href = '/erp-system/login';
        return;
      }

      login(userData);
      toast(`${userData.name}님 환영합니다!`);

      if (userData.role === "WORKSHOP") {
        navigate("/workshop");
      } else if (userData.role === "CUSTOMER") {
        navigate("/");
      }
    } catch (err) {
      console.error("로그인 실패: ", err);

      const errMsg =
        err.response?.data?.message || "아이디 또는 비밀번호가 올바르지 않습니다.";
      toast.error(`${errMsg}`);
    }
  };

  return (
    <div className={styles.loginWrraper}>
      <form onSubmit={handleLogin}>
        <div className={styles.loginCard}>
          <div className={styles.loginContent}>
            <div className={styles.loginHeader}>
              <div className={styles.headerTitle}>로그인</div>
              <div className={styles.headerComment}>
                자세한 내용을 입력해주세요
              </div>
            </div>

            <div className={styles.loginBody}>
              <div>
                <div className={styles.emailLable}>이메일</div>
                <div className={styles.emailValue}>
                  <input
                    className={styles.emailInput}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className={styles.passwordLable}>비밀번호</div>
                <div className={styles.passwordValue}>
                  <input
                    className={styles.passwordInput}
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <span className={styles.findPwd} onClick={onFindPwd}>
                비밀번호 재설정
              </span>

              <div>
                <div>
                  <button type="submit" className={styles.loginBtn}>
                    로그인
                  </button>

                  <div className={styles.regiMsg}>
                    <span>아직 회원이 아니신가요? </span>
                    <span
                      className={styles.regiPage}
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={onRegister}
                    >
                      회원가입
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
