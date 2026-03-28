import { Video as LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gold';
};

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  gold: 'from-[#c9a961] to-[#d4af37]',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {trend.value}
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-[#1e3a5f]">{value}</p>
      </div>
    </div>
  );
}
