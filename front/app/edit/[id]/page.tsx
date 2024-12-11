import EditClient from "./EditClient";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // params를 언래핑
  const { id } = await params;

  return (
    <div>
      <EditClient id={id} />
    </div>
  );
}
