import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

interface SecurityScoreBadgeProps {
  score: number;
  scoreLevel: 'critical' | 'warning' | 'caution' | 'safe';
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const levelConfig = {
  critical: {
    icon: ShieldX,
    bgClass: 'bg-score-critical/10 hover:bg-score-critical/20',
    textClass: 'text-score-critical',
    borderClass: 'border-score-critical/30',
    label: 'Crítico'
  },
  warning: {
    icon: ShieldAlert,
    bgClass: 'bg-score-warning/10 hover:bg-score-warning/20',
    textClass: 'text-score-warning',
    borderClass: 'border-score-warning/30',
    label: 'Alerta'
  },
  caution: {
    icon: Shield,
    bgClass: 'bg-score-caution/10 hover:bg-score-caution/20',
    textClass: 'text-score-caution',
    borderClass: 'border-score-caution/30',
    label: 'Atenção'
  },
  safe: {
    icon: ShieldCheck,
    bgClass: 'bg-score-safe/10 hover:bg-score-safe/20',
    textClass: 'text-score-safe',
    borderClass: 'border-score-safe/30',
    label: 'Seguro'
  }
};

const sizeConfig = {
  sm: {
    wrapper: 'px-2 py-1 gap-1.5',
    icon: 'h-4 w-4',
    text: 'text-sm font-medium'
  },
  md: {
    wrapper: 'px-3 py-1.5 gap-2',
    icon: 'h-5 w-5',
    text: 'text-base font-semibold'
  },
  lg: {
    wrapper: 'px-4 py-2 gap-2.5',
    icon: 'h-6 w-6',
    text: 'text-lg font-bold'
  }
};

export function SecurityScoreBadge({ 
  score, 
  scoreLevel, 
  onClick,
  size = 'md'
}: SecurityScoreBadgeProps) {
  const config = levelConfig[scoreLevel];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center border transition-all duration-200 cursor-pointer",
        config.bgClass,
        config.borderClass,
        sizes.wrapper
      )}
    >
      <Icon className={cn(sizes.icon, config.textClass)} />
      <span className={cn(sizes.text, config.textClass)}>
        {score}
      </span>
      <span className={cn("text-xs opacity-70", config.textClass)}>
        / 100
      </span>
    </button>
  );
}
