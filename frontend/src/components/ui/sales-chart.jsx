import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const SalesChart = ({ data, className }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#F8FAFC]">{item.label}</span>
              <span className="text-sm font-mono text-[#D4AF37]">{item.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={cn(
                  "h-full rounded-sm",
                  item.color || "bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]"
                )}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const CircularProgress = ({ value, size = 120, strokeWidth = 8, className }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D4AF37"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold font-mono text-[#F8FAFC]">
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
};

export const StatCard = ({ icon: Icon, label, value, change, trend, className }) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-[#94A3B8]';

  return (
    <div className={cn("glass p-6 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-24 h-24 vip-glow" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#1E3A8A]/20 rounded-sm flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <p className="text-xs uppercase tracking-widest text-[#94A3B8]">{label}</p>
        </div>
        <p className="font-mono text-3xl font-bold text-[#F8FAFC] mb-2">{value}</p>
        {change && (
          <p className={cn("text-sm flex items-center gap-1", trendColor)}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export const MetricGrid = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>
  );
};
