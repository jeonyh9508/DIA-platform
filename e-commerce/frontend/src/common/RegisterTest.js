import axios from "axios";
import React, { useState } from "react";

function Register(){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("CUSTOMER");

    function register(e){
        e.preventDefault();

        axios
        .post(`http://localhost:9090/register`, {name, password: pwd, email, role, phone})
        .then((res) => {
            console.log("회원가입 완료")
            window.location.href = "/";
        })
        .catch((err) => {
            console.error("회원가입 실패: ", err);
        })
    }

    return(
        <form style={{border:"1px solid black", width:"350px", padding:"10px"}} 
              onSubmit={register}>

            <div>
                이름: <input name="name" onChange={e => setName(e.target.value)} />
            </div>

            <div>
                이메일: <input name="email" onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
                비밀번호: <input type="password" name="password" onChange={e => setPwd(e.target.value)} />
            </div>

            <div>
                번호: <input name="phone" onChange={e => setPhone(e.target.value)} />
            </div>

            <div>
                소비자: <input type="radio" name="role" checked={role == "CUSTOMER"} value="CUSTOMER"
                              onClick={e => setRole("CUSTOMER")} /> 
                공방: <input type="radio" name="role" checked={role == "WORKSHOP"} value="WORKSHOP"
                              onClick={e => setRole("WORKSHOP")} />
            </div>

            <div>
                <input type="submit" value="회원가입" />
            </div>

        </form>
    );
}

export default Register;