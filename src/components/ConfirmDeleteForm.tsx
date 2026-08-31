'use client';

export default function ConfirmDeleteForm({
  action,
  className,
  children,
}: {
  action: (formData: FormData) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Are you sure you want to delete this?')) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </form>
  );
}
