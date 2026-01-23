import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { useAuth } from '../../App';
import styles from '../css/AdminLogin.module.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser, login, user } = useAuth();
  
  useEffect(() => {
    if (user) {
      navigate("/erp-system");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/login', formData);
      const userData = res.data; 
      
      if (userData.role !== 'ADMIN') {
        await api.post('/logout');
        setError('관리자 권한이 없는 계정입니다.');
        setIsLoading(false);
        return;
      }

      login(userData)
      setUser(userData); 

      const authList = userData.authorities.map(a => 
          typeof a === 'object' ? a.authority : a
      ) || [];

      // 권한별 로그인 후 페이지 이동 (보류)
      if (authList.includes('ROLE_SUPER') || authList.includes('SUPER')) {
        navigate('/erp-system');
      } else if (authList.includes('ROLE_SETTLEMENT') || authList.includes('PAY')) {
        navigate('/erp-system');
      } else if (authList.includes('ROLE_CS') || authList.includes('CS')) {
        navigate('/erp-system');
      } else {
        navigate('/erp-system'); 
      }

    } catch (err) {
        console.error(err);
        console.log("전체 에러 객체:", err);
        console.log("서버 응답:", err.response);
        const msg = err.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.';
        setError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const changePassword = () => {
    navigate("/find-password")
  }

  return (
    <div className={styles.container}>
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
      <div className={styles.loginCard}>
        <div className={styles.logoArea}>
            <h1 className={styles.title}>ERP ADMIN</h1>
            <p className={styles.subtitle}>통합 관리자 시스템</p>
        </div>

        {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>관리자 아이디</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <span
              className={styles.resetPwdMent}
              onClick={changePassword}
            >
              비밀번호 재설정
            </span>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton} 
            disabled={isLoading}
          >
            {isLoading ? '접속 중...' : '로그인'}
          </button>
        </form>
        
        <div className={styles.footerLinks}>
            <span
              className={styles.loginRefer}
            >
              처음 생성된 계정 비밀번호: qwer1234!
            </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;