"use client";

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
        <p className="text-lg text-gray-600">Something went wrong!</p>
        <p className="text-sm text-gray-500">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try again
        </button>
        <button 
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Go home
        </button>
      </div>
    </div>
  );
}
