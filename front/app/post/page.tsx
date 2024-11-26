import React from "react";
import AdvancedTipTapEditor from "@/components/editor/AdvancedTipTapEditor";

const WritePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto min-h-[91vh]  pb-[200px] p-6">
      <h1 className="text-2xl font-bold mb-4">글 작성하기</h1>
      <AdvancedTipTapEditor />
    </div>
  );
};

export default WritePage;
