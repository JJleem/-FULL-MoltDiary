"use client";

import { deletePost } from "@/store/postSlice";
import { RootState } from "@/store/store";
import { loadState } from "@/utils/Localstorage";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface dateProps {
  date: string;
}

const Posting: React.FC<dateProps> = ({ date }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);

  const router = useRouter();
  useEffect(() => {
    const savedPosts = loadState();
    if (savedPosts) {
      // 초기 상태를 클라이언트에서 업데이트
      // 예: dispatch(loadPosts(savedPosts));
    }
  }, [dispatch]);

  const handleDeletePost = (id: string) => {
    dispatch(deletePost(id));
  };

  const handleEditPost = (id: string) => {
    router.push(`/edit/${id}`); // edit/[id] 경로로 이동
  };

  function formatDate(isoString: string) {
    // ISO 8601 문자열을 Date 객체로 변환
    const date = new Date(isoString);

    // 연도, 월, 일 추출
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, "0"); // 일자가 한 자리일 경우 앞에 0 추가

    // "YYYY-MM-DD" 형식으로 반환
    return `${year}년 ${month}월 ${day}일`;
  }

  return (
    <div className="w-full border border-red-500">
      <div>
        작성일:
        {date === "" && posts.length > 0 && posts[0]?.timestamp
          ? formatDate(posts[0]?.timestamp)
          : date || ""}
      </div>
      <div>
        {[...posts]
          .slice()
          .reverse()
          .map((post) => (
            <div key={post.id} className="border p-2 my-2">
              <div>
                <h3>{post.title}</h3>
                <div
                  className="min-h-[500px]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="bg-Baltic text-white px-4 py-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-LittleBoyBlue text-white px-4 py-2"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Posting;
