"use client";

import EditAdvancedTipTapEditor from "@/components/editor/EditAdvancedTipTapEditor";
import { useRouter } from "next/navigation";

interface EditClientProps {
  id: string;
}

const EditClient: React.FC<EditClientProps> = ({ id }) => {
  return (
    <div className="max-w-3xl mx-auto min-h-[91vh]  pb-[200px] p-6">
      <h1 className="text-2xl font-bold mb-4">글 수정하기</h1>
      <EditAdvancedTipTapEditor postId={id} />
    </div>
  );
};

export default EditClient;
