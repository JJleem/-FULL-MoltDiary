"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import styles from "./AdvancedTipTapEditor.module.css";
import "./EditorStyles.css";
import CustomImage from "./CustomImage";
import ColorPicker from "./ColorPicker";
import FontSizeExtension from "./FontSizeExtension";
import FontSizePicker from "./fontSizePicker";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updatePost } from "@/store/postSlice";
import { useRouter } from "next/navigation";

interface EditAdvancedTipTapEditorProps {
  postId: string; // 수정할 게시물 ID
}

const EditAdvancedTipTapEditor: React.FC<EditAdvancedTipTapEditorProps> = ({
  postId,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // Redux 상태에서 게시물 가져오기
  const posts = useSelector((state: RootState) => state.posts);
  const [title, setTitle] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [initialContent, setInitialContent] = useState<string>("");
  const [url, setUrl] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [altText, setAltText] = useState("");
  // postId에 해당하는 게시물 데이터 로드
  useEffect(() => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setTitle(post.title);
      setInitialContent(post.content);
    }
  }, [postId, posts]);
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          // TipTap 에디터에 이미지 삽입
          editor?.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleSubmit = () => {
    if (url) {
      if (editor?.state.selection.empty) {
        // 선택된 텍스트가 없을 경우 대체 텍스트를 링크로 삽입
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${url}" target="_blank">${altText || "링크"}</a>`
          )
          .run();
      } else {
        // 선택된 텍스트가 있는 경우 해당 텍스트에 링크를 설정
        editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
      setUrl("");
      setAltText("");
      setIsFormVisible(false);
    }
  };

  // 에디터 초기화
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: false }),
      CustomImage,
      Image,
      Underline,
      TextStyle,
      Color,
      FontSizeExtension,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
    ],
    content: initialContent,
  });
  // 에디터 초기화 이후 콘텐츠 설정
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  const handleSave = () => {
    if (!editor || !editor.isEditable) return;
    const content = editor.getHTML();
    const timestamp = new Date().toISOString();

    setIsSaving(true);

    // Redux에 업데이트 디스패치
    dispatch(
      updatePost({
        id: postId,
        title,
        content,
        timestamp,
      })
    );

    // 저장 후 상태 초기화
    setTimeout(() => {
      setIsSaving(false);
      router.push("/"); // 저장 완료 후 메인 페이지로 이동
    }, 1000);
  };

  return (
    <div className="border border-gray-300 p-4 rounded">
      {isSaving && (
        <div className="absolute border bg-white z-10 p-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col">
          저장 중...
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full mb-4 p-2 border rounded text-lg"
      />

      {/* 툴바 */}
      <div className="mb-12 flex sm:gap-4 w-full xs:justify-between sm:justify-start  ">
        <div className="tooltip-container ">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 border rounded ${
              editor.isActive("bold") ? "bg-gray-300" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">굵게</span>
        </div>
        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 border rounded ${
              editor.isActive("italic") ? "bg-gray-300" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">기울임</span>
        </div>
        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 border rounded ${
              editor.isActive("underline") ? "bg-gray-300" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">밑줄</span>
        </div>
        <ColorPicker editor={editor} />
        <FontSizePicker editor={editor} />
        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="p-2 border rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">● 리스트</span>
        </div>
        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="p-2 border rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">Number 리스트</span>
        </div>

        <div className="tooltip-container">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="p-2 border rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M680-160v-120H560v-80h120v-120h80v120h120v80H760v120h-80ZM440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm560-40h-80q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">링크삽입</span>
          {isFormVisible && (
            <div className="absolute w-[200px] top-full mt-2 bg-white border p-4 rounded shadow z-50">
              <div className="mb-2">
                <label className="block text-sm font-medium">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="border p-1 w-full rounded"
                  placeholder="URL을 입력하세요"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">대체 텍스트</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="border p-1 w-full rounded"
                  placeholder="대체 텍스트를 입력하세요"
                />
              </div>
              <div className="w-full flex justify-between gap-2">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white p-1 rounded  w-full hover:bg-blue-600"
                >
                  링크 추가
                </button>
                <button
                  onClick={() => setIsFormVisible(false)}
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 w-full"
                >
                  취소하기
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="tooltip-container">
          <button onClick={addImage} className="p-2 border rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">이미지</span>
        </div>

        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="p-2 border rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">왼쪽 정렬</span>
        </div>
        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="p-2 border rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">중앙 정렬</span>
        </div>

        <div className="tooltip-container">
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="p-2 border rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z" />
            </svg>
          </button>
          <span className="tooltip-text text-p13">오른쪽&ensp; 정렬</span>
        </div>
      </div>

      {/* 에디터 콘텐츠 */}
      <div className={`${styles.editorContent} min-h-[500px]`}>
        <EditorContent editor={editor} spellCheck="false" />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        수정 완료
      </button>
    </div>
  );
};

export default EditAdvancedTipTapEditor;
