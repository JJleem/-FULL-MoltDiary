"use client";

import { deletePost, updatePost } from "@/store/postSlice";
import { RootState } from "@/store/store";
import { loadState } from "@/utils/Localstorage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface dateProps {
  date: string;
}

const Posting: React.FC<dateProps> = ({ date }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

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

  const handleEditPost = (post: {
    id: string;
    title: string;
    content: string;
  }) => {
    setEditingPostId(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleUpdatePost = () => {
    if (editingPostId) {
      dispatch(
        updatePost({
          id: editingPostId,
          title: editedTitle,
          content: editedContent,
          timestamp: new Date().toISOString(), // 수정된 시간 업데이트
        })
      );
      setEditingPostId(null); // 수정 모드 종료
      setEditedTitle("");
      setEditedContent("");
    }
  };

  return (
    <div className="w-full border border-red-500">
      <div>작성일: {date === "" ? "" : date}</div>
      <div>
        {[...posts]
          .slice()
          .reverse()
          .map((post) => (
            <div key={post.id} className="border p-2 my-2">
              {editingPostId === post.id ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="제목 수정"
                    className="border p-2"
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="내용 수정"
                    className="border p-2 min-h-[100px]"
                  />
                  <button
                    onClick={handleUpdatePost}
                    className="bg-blue-500 text-white px-4 py-2"
                  >
                    수정 완료
                  </button>
                </div>
              ) : (
                <div>
                  <h3>{post.title}</h3>
                  <div
                    className="min-h-[500px]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="bg-yellow-500 text-white px-4 py-2"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-500 text-white px-4 py-2"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Posting;
