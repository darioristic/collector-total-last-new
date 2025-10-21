import { generateMeta } from "@/lib/utils";
import { FileManager } from "./components/file-manager";
import {
  StorageStatusCard,
  FolderListCards
} from "@/app/dashboard/(auth)/file-manager/components";

export async function generateMetadata() {
  return generateMeta({
    title: "File Manager App",
    description:
      "A file manager app is an app template used to browse, organize and manage files and folders. Built with Collector CRM, React, Next.js and Tailwind CSS.",
    canonical: "/apps/file-manager"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FolderListCards />
        </div>
        <StorageStatusCard />
      </div>
      <FileManager />
    </div>
  );
}
