import { redirect } from "next/navigation";

interface AIChatV2IdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AIChatV2IdPage({ params }: AIChatV2IdPageProps) {
  const { id } = await params;
  redirect(`/dashboard/communication/ai-chat/${id}`);
}
