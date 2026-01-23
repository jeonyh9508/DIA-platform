import React, { useState } from "react";
import styles from "./FindPassword.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FindPassword( {onPasswordChanged, onLogin, findPwdPage} ) {
    const navigate = useNavigate();
    const steps = 3;
    const movePage = 100 / steps;

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [pwd, setPwd] = useState("");
    const [pwdCheck, setPwdCheck] = useState("");

    const [pwdMsg, setPwdMsg] = useState("");
    const [pwdCheckMsg, setPwdCheckMsg] = useState("");
    const [codeMsg, setCodeMsg] = useState("");

    const [isPwdColor, setIsPwdColor] = useState("");
    const [isPwdCheckColor, setIsPwdCheckColor] = useState("");
    
    const [pwdValid, setPwdValid] = useState(false);

    const pageMove = () => {
        onLogin();
    }

    const emailCheck = () => {
        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if( !regEmail.test( email.trim() ) ) {
            toast("이메일이 올바르지 않습니다.");
            return;
        }

        axios
            .post(`http://localhost:9090/api/auth/email-verify`, {email})
            .then((res) => {
                console.log(res.data)
                setCode(res.data)
                setStep(2)
            })
            .catch((err) => {
                console.error("인증 실패: ", err)
            })
    }

    const emailVertify = (e) => {
        if(codeInput == code) {
            setStep(3)
        } else {
            setCodeMsg("일치하지 않습니다.")
        }
    }

    function pwdInput(e) {
        const inputPwd = e.target.value;
        const regPwd = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        setPwd(inputPwd)

        if(inputPwd === "") {
            setPwdMsg("")
            return;
        }

        if( regPwd.test( inputPwd ) && pwdCheck === "" ) {
            setPwdMsg("올바른 형식입니다")
            setIsPwdColor("isGreen")
        } else if( !regPwd.test( inputPwd ) && pwdCheck === "" ) {
            setPwdMsg("입력값이 올바르지 않습니다")
            setIsPwdColor("isRed")
            setPwdValid(false)
        } else if( regPwd.test( inputPwd ) && regPwd.test( pwdCheck ) ) {
            setPwdMsg("올바른 형식입니다")
            setIsPwdColor("isGreen")
            setPwdCheckMsg("올바른 형식입니다")
            setIsPwdCheckColor("isGreen")
            setPwdValid(true)
        } else if(regPwd.test( inputPwd )) {
            setPwdMsg("올바른 형식입니다")
            setIsPwdColor("isGreen")
        } else {
            setPwdMsg("입력값이 올바르지 않습니다")
            setPwdCheckMsg("비밀번호가 조건에 맞지 않습니다")
            setPwdValid(false)
            setIsPwdColor("isRed")
            setIsPwdCheckColor("isRed")
        }

    }

    function pwdCheckInput(e) {
        const inputPwdCheck = e.target.value;
        const regPwd = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        setPwdCheck(inputPwdCheck)

        if(inputPwdCheck === "" || pwd === ""){
            setPwdCheckMsg("")
            return;
        }

        if(!regPwd.test(pwd)) {
            setPwdCheckMsg("비밀번호가 조건에 맞지 않습니다")
            setIsPwdCheckColor("isRed")
            return;
        }

        if( inputPwdCheck == pwd && regPwd.test(inputPwdCheck) ) {
            setPwdCheckMsg("올바른 형식입니다")
            setPwdValid(true)
            setIsPwdCheckColor("isGreen")
        } else if( inputPwdCheck != pwd && regPwd.test(inputPwdCheck) ) {
            setPwdCheckMsg("비밀번호가 일치하지 않습니다")
            setPwdValid(false)
            setIsPwdCheckColor("isRed")
        } else {
            setPwdCheckMsg("입력값이 올바르지 않습니다")
            setPwdValid(false)
            setIsPwdCheckColor("isRed")
        }
        
    }

    const changePwd = () => {
        if(!pwdValid) {
            toast("형식에 맞게 비밀번호를 입력해주세요.");
            return;
        }

        axios
            .post("http://localhost:9090/api/auth/change-password", {
                email: email,
                password: pwd,
            }, {
                withCredentials: true, 
                headers: { "Authorization": "" }
            })
            .then(() => {
                toast("비밀번호 변경이 완료되었습니다.");
                if(!findPwdPage){
                    onPasswordChanged();
                } else {
                    navigate('/erp-system/login');
                }
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    toast.error(err.response.data); // 회원가입 되지 않은 이메일 에러 메세지 표시
                } else {
                    toast.error("알 수 없는 오류가 발생했습니다.");
                }

                console.error(err);
            })
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div 
                    className={styles.viewWrapper}
                    style={{ transform: `translateX(${-movePage * (step - 1)}%)` }}
                >
                    <div className={styles.stepPage}>
                        <div className={styles.title}>
                            이메일 인증
                        </div>

                        <input 
                            className={styles.input}
                            name="email" 
                            placeholder="아이디(이메일)" 
                            value={email}
                            onChange={e => setEmail(e.target.value)} 
                        />

                        <div className={styles.comment}>
                            재설정하려는 비밀번호의 이메일을 입력해 주세요.
                        </div>

                        <input 
                            className={styles.btn}
                            type="button" 
                            value="이메일 인증"
                            onClick={emailCheck} />

                        {
                            !findPwdPage &&
                            <div
                                className={styles.pageMove}
                                onClick={pageMove}
                            >
                                이전으로
                            </div>
                        }
                    </div>
                    
                    <div className={styles.stepPage}>
                        <div className={styles.title}>
                            인증코드
                        </div>

                        <input 
                            className={styles.input}
                            placeholder="인증코드 6자리 입력" 
                            value={codeInput}
                            onChange={e => setCodeInput(e.target.value)} />

                        <div className={styles.comment}>
                            {codeMsg}
                        </div>

                        <input 
                            className={styles.btn}
                            type="button" 
                            value="인증하기"
                            onClick={emailVertify} />
                    </div>
                    
                    <div className={styles.stepPage}>
                        <div className={styles.title}>
                            비밀번호 변경
                        </div>

                        <input 
                            className={styles.input} 
                            type="password" 
                            name="password" 
                            placeholder="변경할 비밀번호"
                            value={pwd}
                            onChange={pwdInput} 
                        />
                        <div className={styles.comment}>
                            영문, 숫자, 특수문자 조합 8자 이상 입력해주세요
                        </div>
                        <div className={`${styles.comment2} ${styles[isPwdColor]}`}>
                            {pwdMsg}
                        </div>

                        <input 
                            className={styles.input} 
                            type="password" 
                            placeholder="비밀번호 확인"
                            value={pwdCheck}
                            onChange={pwdCheckInput} 
                        />
                        <div className={styles.comment}>
                            영문, 숫자, 특수문자 조합 8자 이상 입력해주세요
                        </div>
                        <div className={`${styles.comment2} ${styles[isPwdCheckColor]}`}>
                            {pwdCheckMsg}
                        </div>

                        <input 
                            className={styles.btn}
                            type="button" 
                            value="변경하기" 
                            onClick={changePwd} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FindPassword;