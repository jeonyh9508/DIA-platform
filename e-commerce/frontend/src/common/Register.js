import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Register.module.css";

function Register({ onRegisterSuccess, onLogin }) {
  const navigate = useNavigate();

  const [isEmailColor, setIsEmailColor] = useState("");
  const [isCodeColor, setIsCodeColor] = useState("");
  const [isNameColor, setIsNameColor] = useState("");
  const [isPhoneColor, setIsPhoneColor] = useState("");
  const [isPwdColor, setIsPwdColor] = useState("");
  const [isPwdCheckColor, setIsPwdCheckColor] = useState("");

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [nameValid, setNameValid] = useState(false);

  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [verifyBtn, setVerifyBtn] = useState("인증");
  const [verifyBtnCheck, setVerifyBtnCheck] = useState(false);
  const [code, setCode] = useState("");
  const [codeCheck, setCodeCheck] = useState("");
  const [codeBtn, setCodeBtn] = useState(false);
  const [codeInput, setCodeInput] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdValid, setPwdValid] = useState(false);
  const [pwdCheck, setPwdCheck] = useState("");
  const [pwdCheckMsg, setPwdCheckMsg] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneMsg, setPhoneMsg] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);

  const [role, setRole] = useState("CUSTOMER");

  function nameInput(e) {
    const inputName = e.target.value;
    const regName = /^[a-zA-Z가-힣]{2,}$/;

    setName(inputName);

    if (inputName === "") {
      setNameMsg("");
      return;
    }

    if (regName.test(inputName.trim())) {
      setNameMsg("올바른 형식입니다");
      setNameValid(true);
      setIsNameColor("isGreen");
    } else {
      setNameMsg("입력값이 올바르지 않습니다");
      setNameValid(false);
      setIsNameColor("isRed");
    }
  }

  function emailInput(e) {
    const inputEmail = e.target.value;
    const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    setEmail(inputEmail);

    if (inputEmail === "") {
      setEmailMsg("");
      return;
    }

    if (regEmail.test(inputEmail.trim())) {
      setEmailMsg("올바른 형식입니다");
      setVerifyBtnCheck(true);
      setEmailValid(true);
      setIsEmailColor("isGreen");
    } else {
      setEmailMsg("입력값이 올바르지 않습니다");
      setVerifyBtnCheck(false);
      setEmailValid(false);
      setIsEmailColor("isRed");
    }
  }

  function emailVerify(e) {
    setVerifyBtn("재전송");
    setEmailVerified(false);
    setCode("");
    setCodeMsg("");
    setCodeInput(false);

    axios
      .post(`http://localhost:9090/api/auth/email-verify`, { email })
      .then((res) => {
        console.log(res.data);

        setCodeCheck(res.data);
        setCodeMsg("인증코드 6자리 입력");
        setCodeBtn(true);
      })
      .catch((err) => console.error("인증 실패: ", err));
  }

  function verifyCheck() {
    if (code == codeCheck) {
      setCodeMsg("인증 완료");
      setEmailVerified(true);
      setCodeInput(true);
      setCodeBtn(false);
      setIsCodeColor("isGreen");
    } else {
      setCodeMsg("인증번호가 일치하지 않습니다");
      setEmailVerified(false);
      setIsCodeColor("isRed");
    }
  }

  function pwdInput(e) {
    const inputPwd = e.target.value;
    const regPwd =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    setPwd(inputPwd);

    if (inputPwd === "") {
      setPwdMsg("");
      return;
    }

    if (regPwd.test(inputPwd) && pwdCheck === "") {
      setPwdMsg("올바른 형식입니다");
      setIsPwdColor("isGreen");
    } else if (!regPwd.test(inputPwd) && pwdCheck === "") {
      setPwdMsg("입력값이 올바르지 않습니다");
      setIsPwdColor("isRed");
      setPwdValid(false);
    } else if (regPwd.test(inputPwd) && regPwd.test(pwdCheck)) {
      setPwdMsg("올바른 형식입니다");
      setIsPwdColor("isGreen");
      setPwdCheckMsg("올바른 형식입니다");
      setIsPwdCheckColor("isGreen");
      setPwdValid(true);
    } else if (regPwd.test(inputPwd)) {
      setPwdMsg("올바른 형식입니다");
      setIsPwdColor("isGreen");
    } else {
      setPwdMsg("입력값이 올바르지 않습니다");
      setPwdCheckMsg("비밀번호가 조건에 맞지 않습니다");
      setPwdValid(false);
      setIsPwdColor("isRed");
      setIsPwdCheckColor("isRed");
    }
  }

  function pwdCheckInput(e) {
    const inputPwdCheck = e.target.value;
    const regPwd =
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    setPwdCheck(inputPwdCheck);

    if (inputPwdCheck === "" || pwd === "") {
      setPwdCheckMsg("");
      return;
    }

    if (!regPwd.test(pwd)) {
      setPwdCheckMsg("비밀번호가 조건에 맞지 않습니다");
      setIsPwdCheckColor("isRed");
      return;
    }

    if (inputPwdCheck == pwd && regPwd.test(inputPwdCheck)) {
      setPwdCheckMsg("올바른 형식입니다");
      setPwdValid(true);
      setIsPwdCheckColor("isGreen");
    } else if (inputPwdCheck != pwd && regPwd.test(inputPwdCheck)) {
      setPwdCheckMsg("비밀번호가 일치하지 않습니다");
      setPwdValid(false);
      setIsPwdCheckColor("isRed");
    } else {
      setPwdCheckMsg("입력값이 올바르지 않습니다");
      setPwdValid(false);
      setIsPwdCheckColor("isRed");
    }
  }

  function phoneInput(e) {
    const inputPhone = e.target.value;
    const regPhone = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;

    setPhone(inputPhone);

    if (inputPhone === "") {
      setPhoneMsg("");
      return;
    }

    if (regPhone.test(inputPhone.trim())) {
      setPhoneMsg("올바른 형식입니다");
      setPhoneValid(true);
      setIsPhoneColor("isGreen");
    } else {
      setPhoneMsg("입력값이 올바르지 않습니다");
      setPhoneValid(false);
      setIsPhoneColor("isRed");
    }
  }

  function resetBtn() {
    setNameMsg("");
    setEmailMsg("");
    setCodeMsg("");
    setPhoneMsg("");
    setPwdMsg("");
    setPwdCheckMsg("");
    setCode("");

    setVerifyBtn("인증");
  }

  function register(e) {
    e.preventDefault();

    if (!(nameValid && emailValid && emailVerified && pwdValid && phoneValid)) {
      toast("필수 정보를 모두 입력해주세요.");
      return;
    }

    axios
      .post(`http://localhost:9090/register`, {
        email,
        password: pwd,
        name,
        role,
        phone,
      })
      .then((res) => {
        if (res.data !== null) {
          console.log("회원가입 완료");
          toast("회원가입에 성공했습니다!");
          onRegisterSuccess();
        }
      })
      .catch((err) => {
        console.error(err);

        const errorMessage =
          err.response && err.response.data
            ? err.response.data
            : "알 수 없는 오류가 발생했습니다.";

        toast.error("회원가입에 실패: ", errorMessage);
      });
  }

  return (
    <div className={styles.regiCard}>
      <form onSubmit={register}>
        <div className={styles.regiContent}>
          <div className={styles.regiHeader}>
            <span className={styles.regiTitle}>회원가입</span>
          </div>

          <div className={styles.regiBody}>
            <div className={styles.formRow}>
              <div className={styles.email}>
                <div>이메일</div>
                <span className={styles.inputWrap}>
                  <input
                    className={styles.btnInput}
                    name="email"
                    onChange={emailInput}
                  />
                  <input
                    className={styles.btnInInput}
                    type="button"
                    value={verifyBtn}
                    disabled={!verifyBtnCheck}
                    onClick={emailVerify}
                  />
                </span>

                <div className={styles.guideMent}>example@domain.com</div>

                <div className={`${styles.emailMsg} ${styles[isEmailColor]}`}>
                  {emailMsg}
                </div>
              </div>

              <div className={styles.email}>
                <div>인증코드</div>

                <span className={styles.inputWrap}>
                  <input
                    className={styles.btnInput}
                    disabled={codeInput}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />

                  <input
                    className={styles.btnInInput}
                    type="button"
                    value="확인"
                    disabled={!codeBtn}
                    onClick={verifyCheck}
                  />
                </span>

                <div className={`${styles.codeMsg} ${styles[isCodeColor]}`}>
                  {codeMsg}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.name}>
                <div>이름</div>

                <input
                  className={styles.input}
                  name="name"
                  onChange={nameInput}
                />

                <div className={styles.guideMent}>
                  영문/한글로 최소 2글자 이상 입력해주세요
                </div>

                <div className={`${styles.nameMsg} ${styles[isNameColor]}`}>
                  {nameMsg}
                </div>
              </div>

              <div className={styles.phone}>
                <div>폰번호</div>

                <input
                  className={styles.input}
                  name="phone"
                  onChange={phoneInput}
                />

                <div className={styles.guideMent}>
                  "-" 없이 숫자만 입력해주세요
                </div>

                <div className={`${styles.phoneMsg} ${styles[isPhoneColor]}`}>
                  {phoneMsg}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.name}>
                <div>비밀번호</div>

                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  onChange={pwdInput}
                />

                <div className={styles.guideMent}>
                  영문, 숫자, 특수문자 조합 8자 이상 입력해주세요
                </div>

                <div className={`${styles.pwdMsg} ${styles[isPwdColor]}`}>
                  {pwdMsg}
                </div>
              </div>

              <div className={styles.phone}>
                <div>비밀번호 확인</div>

                <input
                  className={styles.input}
                  type="password"
                  onChange={pwdCheckInput}
                />

                <div className={styles.guideMent}>
                  영문, 숫자, 특수문자 조합 8자 이상 입력해주세요
                </div>

                <div
                  className={`${styles.pwdCheckMsg} ${styles[isPwdCheckColor]}`}
                >
                  {pwdCheckMsg}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.radioGroup}>
                <input
                  type="radio"
                  name="role"
                  checked={role == "CUSTOMER"}
                  value="CUSTOMER"
                  onChange={(e) => setRole("CUSTOMER")}
                  id="role_customer"
                  className={styles.radioInput}
                />
                <label htmlFor="role_customer" className={styles.radioLabel}>
                  소비자
                </label>

                <input
                  type="radio"
                  name="role"
                  checked={role == "WORKSHOP"}
                  value="WORKSHOP"
                  onChange={(e) => setRole("WORKSHOP")}
                  id="role_workshop"
                  className={styles.radioInput}
                />
                <label htmlFor="role_workshop" className={styles.radioLabel}>
                  공방
                </label>
              </div>
            </div>
          </div>

          <div className={styles.regiFooter}>
            <span className={styles.btn}>
              <input
                className={styles.cancelBtn}
                type="reset"
                value="초기화"
                onClick={resetBtn}
              />
              <input
                className={styles.regiBtn}
                type="submit"
                value="회원가입"
              />
            </span>

            <div className={styles.loginMsg}>
              <span>이미 아이디가 있으신가요? </span>
              <span
                className={styles.loginPage}
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={onLogin}
              >
                로그인하기
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
