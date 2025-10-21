export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      <button 
        type="button"
        onClick={() => {
          window.location.href = '/';
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go back
      </button>
    </div>
  );
}
