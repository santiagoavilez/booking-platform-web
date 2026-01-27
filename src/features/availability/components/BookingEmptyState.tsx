interface BookingEmptyStateProps {
  title: string;
  message: string;
}

export function BookingEmptyState({ title, message }: BookingEmptyStateProps) {
  return (
    <div>
      <h3 className="mb-2 text-base font-semibold md:text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
