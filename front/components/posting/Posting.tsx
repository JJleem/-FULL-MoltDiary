"use client";

import { RootState } from "@/store/store";
import { loadState } from "@/utils/Localstorage";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface dateProps {
  date: string;
}

const Posting: React.FC<dateProps> = ({ date }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    const savedPosts = loadState();
    if (savedPosts) {
      // 초기 상태를 클라이언트에서 업데이트
      // 예: dispatch(loadPosts(savedPosts));
    }
  }, [dispatch]);

  return (
    <div className="w-full border border-red-500 ">
      <div>작성일: {date}</div>
      <div>
        {[...posts]
          .slice() // 원본 배열을 복사 (필요에 따라 생략 가능)
          .reverse() // 배열을 역순으로 정렬
          .map((post) => (
            <div key={post.id} className="border p-2 my-2">
              <h3>{post.title}</h3>
              <div
                className="min-h-[500px]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Posting;
