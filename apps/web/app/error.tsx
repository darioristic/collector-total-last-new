"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <p className="text-lg text-muted-foreground">Something went wrong!</p>
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => {
          window.location.href = '/';
        }}>
          Go home
        </Button>
      </div>
    </div>
  );
}
