// src/components/ProfitChart.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../css/Chart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

const getDefaultMonths = () => {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  let start = new Date(end);
  start.setMonth(end.getMonth() - 5);

  const format = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  return {
    startMonth: format(start),
    endMonth: format(end),
  };
};

function ProfitChart({ type, workshopId, monthly, programId, onClose }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultMonths = getDefaultMonths();
  const [periodType, setPeriodType] = useState("6month");
  const [startMonth, setStartMonth] = useState(defaultMonths.startMonth);
  const [endMonth, setEndMonth] = useState(defaultMonths.endMonth);

  useEffect(() => {
    if (type === "workshop" || type === "programProfit") {
      const defaultRange = getDefaultMonths();
      setPeriodType("6month");
      setStartMonth(defaultRange.startMonth);
      setEndMonth(defaultRange.endMonth);
    }
  }, [type]);

  useEffect(() => {
    const fetchProfitData = async () => {
      if (type === "workshop" && !workshopId) return;
      if (type === "programProfit" && !programId) return;
      if (type === "program" && !workshopId) return;

      setLoading(true);
      setError(null);

      let endpoint = "";
      let requestBody = {};
      let finalStartMonth = null;
      let finalEndMonth = null;

      if (type === "workshop" || type === "programProfit") {
        endpoint =
          type === "workshop"
            ? "/workshop/profit/workshop"
            : "/workshop/profit/program";

        if (type === "workshop") {
          requestBody.workshopId = workshopId;
        } else {
          requestBody.programId = programId;
        }

        if (periodType === "6month") {
          const defaultRange = getDefaultMonths();
          finalStartMonth = defaultRange.startMonth;
          finalEndMonth = defaultRange.endMonth;
        } else {
          finalStartMonth = startMonth;
          finalEndMonth = endMonth;
        }

        requestBody.startMonth = finalStartMonth;
        requestBody.endMonth = finalEndMonth;
        requestBody.monthly = null;
      } else if (type === "program") {
        endpoint = "/workshop/profit/graph";
        requestBody.workshopId = workshopId;
        requestBody.monthly = monthly;
        requestBody.startMonth = null;
        requestBody.endMonth = null;
      } else {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `http://localhost:9090${endpoint}`,
          requestBody
        );
        const receivedData = Array.isArray(res.data)
          ? res.data
          : res.data
          ? [res.data]
          : [];
        setChartData(receivedData);
      } catch (err) {
        console.error(`수익 데이터 로딩 실패 (${endpoint}):`, err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfitData();
  }, [type, workshopId, monthly, programId, periodType, startMonth, endMonth]);

  if (loading) return <p>📈 그래프 데이터 로딩 중...</p>;
  if (error) return <p className="ws-error-message">❌ {error}</p>;

  const finalStart =
    periodType === "custom" ? startMonth : getDefaultMonths().startMonth;
  const finalEnd =
    periodType === "custom" ? endMonth : getDefaultMonths().endMonth;

  const titleText =
    type === "workshop"
      ? `공방 매출 추이 (${finalStart} ~ ${finalEnd})`
      : type === "programProfit"
      ? `프로그램 매출 추이 (${finalStart} ~ ${finalEnd})`
      : `${monthly} 프로그램별 총 매출`;

  const data = {
    labels: chartData.map((item) =>
      type === "program" ? item.title : item.monthly
    ),
    datasets: [
      {
        label: "총 매출액 (Total Amount)",
        data: chartData.map((item) => item.totalAmount),
        backgroundColor:
          type === "program" ? "rgba(68, 68, 68, 0.6)" : "rgba(68, 68, 68, 1)",
        borderColor: "rgba(68, 68, 68, 1)",
        borderWidth: 2,
        type: type === "workshop" || type === "programProfit" ? "line" : "bar",
        tension:
          type === "workshop" || type === "programProfit" ? 0.3 : undefined,
        fill: false,
      },
    ],
  };

  const yScales = {
    beginAtZero: true,
    ticks: {
      callback: function (value) {
        return formatCurrency(value);
      },
    },
  };

  if (type === "programProfit" || type === "program") {
    yScales.ticks.stepSize = 50000;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: titleText },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null)
              label += formatCurrency(context.parsed.y);
            return label;
          },
        },
      },
    },
    scales: {
      y: yScales,
    },
  };

  if (type === "programProfit") {
    if (chartData.length === 0)
      return (
        <div className="ws-chart-modal-empty">
          <h3 className="ws-chart-modal-title">프로그램 매출 추이 분석</h3>
          <p>데이터가 없습니다.</p>
        </div>
      );

    return (
      <div className="ws-chart-modal">
        <div className="ws-chart-modal-header">
          <h3 className="ws-chart-modal-title">프로그램 매출 추이 분석</h3>
        </div>

        <div className="ws-chart-controls">
          <div className="ws-chart-controls-period">
            <div className="ws-chart-controls-radios">
              <label className="ws-chart-controls-label">
                <input
                  type="radio"
                  name="workshopPeriod"
                  value="6month"
                  checked={periodType === "6month"}
                  onChange={() => setPeriodType("6month")}
                />{" "}
                최근 6개월
              </label>
              <label className="ws-chart-controls-label">
                <input
                  type="radio"
                  name="workshopPeriod"
                  value="custom"
                  checked={periodType === "custom"}
                  onChange={() => setPeriodType("custom")}
                />{" "}
                기간 지정
              </label>
            </div>

            {periodType === "custom" && (
              <div className="ws-chart-controls-custom">
                <input
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                />
                <span> ~ </span>
                <input
                  type="month"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="ws-chart-modal-wrapper">
          <Line
            data={data}
            options={{ ...options, maintainAspectRatio: false }}
          />
        </div>
      </div>
    );
  }
  if (chartData.length === 0)
    return <p className="ws-chart-empty">데이터가 없습니다.</p>;

  return (
    <div className="ws-chart-container">
      {type === "workshop" && (
        <div className="ws-chart-controls">
          <div className="ws-chart-controls-radios">
            <label className="ws-chart-controls-label">
              <input
                type="radio"
                name="workshopPeriod"
                value="6month"
                checked={periodType === "6month"}
                onChange={() => setPeriodType("6month")}
              />{" "}
              최근 6개월
            </label>
            <label className="ws-chart-controls-label">
              <input
                type="radio"
                name="workshopPeriod"
                value="custom"
                checked={periodType === "custom"}
                onChange={() => setPeriodType("custom")}
              />{" "}
              기간 지정
            </label>
          </div>

          {periodType === "custom" && (
            <div className="ws-chart-controls-custom">
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
              <span> ~ </span>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* 차트 캔버스 자체를 감싸는 래퍼 */}
      <div className="ws-chart-wrapper">
        {type === "workshop" || type === "programProfit" ? (
          <Line data={data} options={options} />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default ProfitChart;
