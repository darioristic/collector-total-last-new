import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Text to Speech",
    description:
      "Text to speech app is a ui template that converts written text into spoken audio. Built with shadcn/ui, Tailwind CSS, Next.js and React.",
    canonical: "/text-to-speech"
  });
}

export default function Page() {
  return (
    <div className="flex h-[90vh] items-center justify-center">
      <div className="max-w-(--breakpoint-sm) space-y-4 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="mb-4 flex items-center gap-3">
              <svg
                className="size-6 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h1 className="text-xl">Text to Speech</h1>
            </CardTitle>
            <CardDescription>
              Text to speech app is a ui template that converts written text into spoken audio.
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t pt-4">
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <AlertCircleIcon className="size-4 text-orange-400" />
              This page is currently under construction.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
