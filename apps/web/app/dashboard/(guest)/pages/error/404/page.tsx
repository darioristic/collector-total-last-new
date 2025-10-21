// biome-ignore assist/source/organizeImports: imports are organized correctly
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "404 Page",
    description:
      "This is an example of a template for 404 error pages. Built with Collector CRM, Tailwind CSS and Next.js.",
    canonical: "/pages/error/404"
  });
}

export default function Page() {
  return (
    <div className="from-background to-secondary/10 flex min-h-screen flex-col items-center justify-center bg-linear-to-b p-4">
      <div className="w-full max-w-3xl space-y-4 lg:space-y-8">
        <div className="bg-primary/5 border-primary/10 relative flex h-64 items-center justify-center overflow-hidden rounded-lg border sm:h-80">
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
            {Array.from({ length: 100 }, () => (
              <div
                key={Math.random().toString(36).substr(2, 9)}
                className="border-primary/30 border"
                style={{
                  opacity: Math.random() * 0.5 + 0.5
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            <div className="text-primary mb-4 text-8xl font-black tracking-tighter sm:text-9xl">
              404
            </div>
            <div className="text-foreground text-xl font-medium sm:text-2xl">Page Not Found</div>
          </div>

          <div className="from-background/80 absolute right-0 bottom-0 left-0 h-1/3 bg-linear-to-t to-transparent" />
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/">
              Back to Home
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
