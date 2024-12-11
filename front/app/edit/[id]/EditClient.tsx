"use client";

import { useRouter } from "next/navigation";

interface EditClientProps {
  id: string;
}

const EditClient: React.FC<EditClientProps> = ({ id }) => {
  const router = useRouter();

  return (
    <div className="w-full h-[500px]">
      <h1>postId/params: {id}</h1>
      <button onClick={() => router.push("/")}>돌아가기</button>
    </div>
  );
};

export default EditClient;
