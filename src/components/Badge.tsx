type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
