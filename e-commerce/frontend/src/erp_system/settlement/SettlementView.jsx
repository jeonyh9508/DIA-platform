import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./css/SettlementView.css";

function SettlementView() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);

  useEffect(() => {
    axios
      .post("http://localhost:9090/erp-system/settlement/dashboard")
      .then((res) => {
        const data = res.data;
        setMonthlyData(data);

        let approvedSum = 0;
        let refundSum = 0;

        data.forEach((item) => {
          approvedSum += item.approvedAmount || 0;
          refundSum += item.refundAmount || 0;
        });

        setTotalApproved(approvedSum);
        setTotalRefund(refundSum);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="erp-settlement-container">
      <div className="erp-settlement-grid">
        <div className="erp-settlement-card">
          <h3>정산 완료</h3>
          <div className="erp-settlement-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="monthly"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 10000}만`}
                />
                <Tooltip
                  cursor={{ fill: "#f0f0f0" }}
                  contentStyle={{
                    border: "1px solid #ccc",
                    borderRadius: "0",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value.toLocaleString()}원`, "금액"]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="approvedAmount"
                  name="정산 완료"
                  fill="#3f51b5"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="erp-settlement-card">
          <h3>정산 완료 내역</h3>
          <div className="erp-settlement-summary-box erp-settlement-approval-type">
            <span className="erp-settlement-label">합계</span>
            <span className="erp-settlement-value">
              {totalApproved.toLocaleString()} 원
            </span>
          </div>
          <div className="erp-settlement-list-wrapper">
            <table className="erp-settlement-table">
              <colgroup>
                <col width="40%" />
                <col width="60%" />
              </colgroup>
              <thead>
                <tr>
                  <th>연 월</th>
                  <th>금액 (원)</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.monthly}</td>
                    <td>{item.approvedAmount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="erp-settlement-card">
          <h3>환불</h3>
          <div className="erp-settlement-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="monthly"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f0f0f0" }}
                  contentStyle={{
                    border: "1px solid #ccc",
                    borderRadius: "0",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value.toLocaleString()}원`, "금액"]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="refundAmount"
                  name="환불"
                  fill="#d32f2f"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="erp-settlement-card">
          <h3>환불 내역</h3>
          <div className="erp-settlement-summary-box erp-settlement-refund-type">
            <span className="erp-settlement-label">합계</span>
            <span className="erp-settlement-value">
              {totalRefund.toLocaleString()} 원
            </span>
          </div>
          <div className="erp-settlement-list-wrapper">
            <table className="erp-settlement-table">
              <colgroup>
                <col width="40%" />
                <col width="60%" />
              </colgroup>
              <thead>
                <tr>
                  <th>연 월</th>
                  <th>금액 (원)</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.monthly}</td>
                    <td className="erp-settlement-text-red">
                      {item.refundAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettlementView;
