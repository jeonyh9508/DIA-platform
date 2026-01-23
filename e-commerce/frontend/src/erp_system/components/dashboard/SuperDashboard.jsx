import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WeeklyVisitChart from '../chart/WeeklyVisitChart';
import HotWorkshopChart from '../chart/HotWorkshopChart';
import styles from '../../css/SuperDashboard.module.css';

const SuperDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const goToWorkshop = (id) => {
    navigate(`/customer/workshop/${id}`);
  };

  useEffect(() => {
    axios.get('http://localhost:9090/erp-system/dashboard/super')
         .then(res => {
           setData(res.data);
         })
         .catch(err => console.error(err));
  }, []);

  if (!data) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* 0. 상단 지표 영역 (카드 형태로 개선) */}
      <div className={styles.metricsContainer}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>오늘 방문자</span>
          <span className={styles.metricValue}>{data.todayVisitors.toLocaleString()}명</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>총 회원수</span>
          <span className={styles.metricValue}>{data.totalUsers.toLocaleString()}명</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>실시간 접속자</span>
          <span className={styles.metricValue}>{data.onlineUsers.toLocaleString()}명</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>실시간 트래픽</span>
          <span className={styles.metricValue}>{data.currentTraffic.toLocaleString()}건</span>
        </div>
      </div>

      {/* 1. 차트 영역 */}
      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>📉 주간 방문 추이</h4>
          <div className={styles.chartWrapper}>
             <WeeklyVisitChart data={data.weeklyTraffic} />
          </div>
        </div>
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>🔥 인기 공방 TOP 5</h4>
          <div className={styles.chartWrapper}>
            <HotWorkshopChart data={data.hotWorkshops} />
          </div>
        </div>
      </div>

      {/* 2. 리스트 영역 */}
      <div className={styles.listSection}>
        
        {/* 최근 가입 회원 */}
        <div className={styles.listCard}>
          <h3 className={styles.listTitle}>👤 최근 가입 회원</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>이름</th>
                <th className={styles.th}>이메일</th>
                <th className={styles.th}>가입일</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers?.map((user) => (
                <tr key={user.userId} className={styles.trUser}>
                  <td className={styles.td}>{user.name}</td>
                  <td className={styles.td}>{user.email}</td>
                  <td className={`${styles.td} ${styles.dateText}`}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 최근 생성 공방 */}
        <div className={styles.listCard}>
          <h3 className={styles.listTitle}>🏠 최근 생성 공방</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>공방명</th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>승인여부</th>
              </tr>
            </thead>
            <tbody>
              {data.recentWorkshops?.map((ws) => (
                <tr 
                  key={ws.workshopId} 
                  className={styles.tr}
                  onClick={() => goToWorkshop(ws.workshopId)}
                >
                  <td className={styles.td}>{ws.name}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${ws.status === '정상' ? styles.badgeNormal : styles.badgeWarning}`}>
                      {ws.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={ws.approved === '대기' ? styles.approveWait : styles.approveDone}>
                      {ws.approved}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SuperDashboard;