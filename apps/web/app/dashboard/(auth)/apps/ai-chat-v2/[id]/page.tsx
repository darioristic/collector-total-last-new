import { redirect } from "next/navigation";

interface AIChatV2IdPageProps {
  params: {
    id: string;
  };
}

export default function AIChatV2IdPage({ params }: AIChatV2IdPageProps) {
  redirect(`/dashboard/communication/ai-chat/${params.id}`);
}
