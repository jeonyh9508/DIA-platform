import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../App";
import styles from "../css/AdminRegister.module.css"; 

function AdminRegister() {
    const { hasRole, user, loading } = useAuth();
    const [list, setList] = useState([]);
    const [register, setRegister] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        roleName: 'SUPER'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 

    const roleNameMapping = {
        SUPER: '최고 관리자',
        SETTLEMENT: '정산',
        CS: '고객지원'
    };
    
    const formatPhoneNumber = (value) => {
        if (!value) return "";
        const clean = value.replace(/[^0-9]/g, "");
        return clean.replace(
            /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/,
            "$1-$2-$3"
        );
    };

    const getList = () => {
        axios.get("http://localhost:9090/erp-system/admin/list")
            .then((res) => setList(res.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
        const totalPages = Math.ceil(list.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [list, currentPage, itemsPerPage]);

    if (loading || !user) {
        return <div>로딩 중...</div>; 
    }

    const handleEditClick = (li) => {
        setRegister(false);
        setEditingId(li.userId);
        setEditData({ ...li });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEditSave = () => {
        const regName = /^[a-zA-Z가-힣]{2,}$/;
        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const regPhone = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;

        if( !editData.name || !editData.email || !editData.phone ) {
            alert("필수 내용을 모두 입력해주세요.");
            return;
        }

        if( !regName.test(editData.name) ) {
            alert("이름은 한글 또는 영문 2자 이상이어야 합니다.");
            return;
        }

        if( !regEmail.test(editData.email) ) {
            alert("올바른 이메일 형식이 아닙니다.");
            return;
        }

        if( !regPhone.test(editData.phone) ) {
            alert("올바른 휴대전화 번호 형식이 아닙니다.");
            return;
        }

        axios
            .post("http://localhost:9090/erp-system/admin/update", editData, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => {
                if( res.data === "수정 완료" ) {
                    const newList = list.map((li) => (li.userId === editingId ? editData : li));
                    setList(newList);
                    
                    alert("수정이 완료되었습니다!");
                    setEditingId(null);
                } else {
                    alert(res.data);
                    setEditingId(null);
                }
            })
            .catch((err) => {
                console.error(err);
                alert("수정 중 오류가 발생했습니다.");
            })
    };

    const handleDelClick = (adminRoleId, userId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        axios
            .post("http://localhost:9090/erp-system/admin/delete", {
                adminRoleId: adminRoleId,
                userId :userId,
            })
            .then((res) => {
                if(res) {
                    alert("삭제 완료되었습니다!");
                    getList();
                }
            })
            .catch((err) => console.error(err))
    }

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    const handleNewUserSubmit = () => {
        console.log("저장될 데이터:", newUser);
        const regName = /^[a-zA-Z가-힣]{2,}$/;
        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const regPhone = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;

        if( !newUser.name || !newUser.email || !newUser.phone ) {
            alert("필수 내용을 모두 입력해주세요.");
            return;
        }

        if( !regName.test(newUser.name) ) {
            alert("이름은 한글 또는 영문 2자 이상이어야 합니다.");
            return;
        }

        if( !regEmail.test(newUser.email) ) {
            alert("올바른 이메일 형식이 아닙니다.");
            return;
        }

        if( !regPhone.test(newUser.phone) ) {
            alert("올바른 휴대전화 번호 형식이 아닙니다.");
            return;
        }

        axios
            .post(`http://localhost:9090/erp-system/admin/register`, newUser, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if( res.data === "중복 이메일이 존재합니다" ) {
                    alert(res.data);
                    setEditingId(null)
                    return;
                } else {
                    alert(res.data);
                    getList();
                    setNewUser({ name: '', email: '', phone: '', roleName: 'SUPER' });
                    setRegister(false);
                    setCurrentPage(1); 
                }
            })
            .catch((err) => alert(err))
        
        setRegister(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(list.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h2 className='erp-page-title'>관리자 계정 관리</h2>
                
                {
                    hasRole("SUPER") &&
                    <div className={styles.headerActions}>
                        <button 
                            className={`${styles.toggleBtn} ${register ? styles.cancel : ''}`} 
                            onClick={() => setRegister(!register)}
                        >
                            {register ? "등록 취소" : " + 관리자 신규 등록"}
                        </button>
                    </div>
                }

                <div className={`${styles['erp-table']} ${styles['management-table']}`}>
                    
                    <div className={styles['erp-table-header']}>
                        <div>이름</div>
                        <div>이메일</div>
                        <div>번호</div>
                        <div>권한</div>
                        <div>비고</div>
                    </div>

                    {register && (
                        <div className={`${styles['erp-table-row']} ${styles.newRow}`}>
                            <div>
                                <input 
                                    className={styles.input}
                                    name="name" 
                                    value={newUser.name} 
                                    onChange={handleNewUserChange} 
                                    placeholder="이름 입력" 
                                />
                            </div>
                            <div>
                                <input 
                                    className={styles.input}
                                    name="email" 
                                    value={newUser.email} 
                                    onChange={handleNewUserChange} 
                                    placeholder="example@email.com" 
                                />
                            </div>
                            <div>
                                <input 
                                    className={styles.input}
                                    name="phone" 
                                    value={newUser.phone} 
                                    onChange={handleNewUserChange} 
                                    placeholder="01012345678" 
                                />
                            </div>
                            <div>
                                <select 
                                    className={styles.select}
                                    name="roleName" 
                                    value={newUser.roleName} 
                                    onChange={handleNewUserChange}
                                >
                                    <option value="SUPER">최고 관리자</option>
                                    <option value="SETTLEMENT">정산</option>
                                    <option value="CS">고객지원</option>
                                </select>
                            </div>
                            <div>
                                <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleNewUserSubmit}>저장</button>
                            </div>
                        </div>
                    )}

                    {currentItems.map((li) => (
                        <div key={li.userId} className={styles['erp-table-row']}>
                            {editingId === li.userId ? (
                                <>
                                    <div>
                                        <input 
                                            className={styles.input}
                                            name="name" 
                                            value={editData.name || ''} 
                                            onChange={handleEditChange} 
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            className={styles.input}
                                            name="email" 
                                            value={editData.email || ''} 
                                            onChange={handleEditChange} 
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            className={styles.input}
                                            name="phone" 
                                            value={editData.phone || ''} 
                                            onChange={handleEditChange} 
                                        />
                                    </div>
                                    <div>
                                        {
                                            hasRole("SUPER") ? (
                                            <select 
                                                className={styles.select}
                                                name="roleName" 
                                                value={editData.roleName}
                                                onChange={handleEditChange}
                                            >
                                                <option value="SUPER">최고 관리자</option>
                                                <option value="SETTLEMENT">정산</option>
                                                <option value="CS">고객지원</option>
                                            </select> 
                                            ) : (
                                            roleNameMapping[li.roleName] || li.roleName
                                        )}
                                    </div>
                                    <div>
                                        <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleEditSave}>확인</button>
                                        <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => setEditingId(null)}>취소</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>{li.name}</div>
                                    <div>{li.email}</div>
                                    <div>{ formatPhoneNumber(li.phone) }</div>
                                    <div>{ roleNameMapping[li.roleName] || li.roleName }</div>
                                    <div>
                                        {
                                            (hasRole("SUPER") || li.userId === user.userId) &&
                                            <button 
                                                className={`${styles.actionBtn} ${styles.editBtn}`} 
                                                onClick={() => handleEditClick(li)}
                                            >
                                                수정
                                            </button>
                                        }
                                        {
                                            hasRole("SUPER") &&
                                            <button 
                                                className={`${styles.actionBtn} ${styles.delBtn}`} 
                                                onClick={() => {handleDelClick(li.adminRoleId, li.userId);}}
                                            >
                                                삭제
                                            </button>
                                        }
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {list.length === 0 && (
                        <div className={styles['erp-table-row']}>
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#888' }}>
                                데이터가 없습니다.
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.paginationContainer}>
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className={styles.pageBtn}
                    >
                        ◀
                    </button>

                    {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={styles.pageBtn}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;