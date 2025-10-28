interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading data..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="loader" />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
