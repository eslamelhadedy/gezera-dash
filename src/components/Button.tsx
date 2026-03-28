import { Video as LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-[#1e3a5f] to-[#0f1f3d] text-white hover:shadow-lg',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg',
  outline: 'border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  size = 'md',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-lg font-medium transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}
