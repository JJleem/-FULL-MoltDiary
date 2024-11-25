"use client";

import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./GithubGrassStyle.css";
import axios from "axios";

// startDate부터 endDate까지의 모든 날짜를 생성
const generateDateRange = (startDate: Date, endDate: Date) => {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

const GithubGrass = () => {
  const [commitCounts, setCommitCounts] = useState<{ [date: string]: number }>(
    {}
  );
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        // 로컬 스토리지에서 데이터를 불러옴 (클라이언트 측에서만 실행)
        const storedData = localStorage.getItem("commitCounts");
        if (storedData) {
          setCommitCounts(JSON.parse(storedData));
          setLoading(false); // 로컬 데이터가 있으면 로딩 상태 해제
          return;
        }

        // API 호출
        const response = await axios.get("/api/commits");
        const commits = response.data.commits;

        // 날짜별로 커밋 개수를 계산
        const counts: { [date: string]: number } = {};
        commits.forEach((commit: any) => {
          const date = new Date(commit.commit.author.date)
            .toISOString()
            .split("T")[0]; // YYYY-MM-DD 형식
          counts[date] = (counts[date] || 0) + 1;
        });

        // 데이터를 상태와 로컬 스토리지에 저장
        setCommitCounts(counts);
        localStorage.setItem("commitCounts", JSON.stringify(counts));
      } catch (error) {
        console.error("Failed to fetch commits:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    // 클라이언트에서만 실행
    if (typeof window !== "undefined") {
      fetchCommits();
    }
  }, []);

  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-12-31");

  const commitValues = Object.entries(commitCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // 모든 날짜에 대해 `values` 생성
  const allDates = generateDateRange(startDate, endDate).map((date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const commit = commitValues.find((val) => val.date === formattedDate);
    return { date: formattedDate, count: commit ? commit.count : 0 };
  });

  return (
    <div className="h-[200px] flex flex-col gap-4 xxs:w-[900px] border border-AlmondPeach p-1 pr-2 pl-2 pb-2 sm:w-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="spinner"></div> {/* 로딩 스피너 */}
        </div>
      ) : (
        <>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={allDates}
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              return `color-scale-${value.count}`;
            }}
            titleForValue={(value) =>
              value ? `${value.date} : ${value.count} posts` : "No data"
            }
          />
          <div className="w-[100%] flex justify-end gap-1 items-center">
            <div className="text-sm font-bold">Less</div>
            <div className="w-[16px] h-[16px] bg-AlmondPeach"></div>
            <div className="w-[16px] h-[16px] bg-Aquamarine"></div>
            <div className="w-[16px] h-[16px] bg-LittleBoyBlue"></div>
            <div className="w-[16px] h-[16px] bg-Seaport"></div>
            <div className="w-[16px] h-[16px] bg-LegionBlue"></div>
            <div className="text-sm font-bold">More</div>
          </div>
        </>
      )}
    </div>
  );
};

export default GithubGrass;
