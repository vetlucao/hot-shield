import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  scoreLevel: 'critical' | 'warning' | 'caution' | 'safe';
}

const levelConfig = {
  critical: {
    colorClass: 'text-score-critical',
    strokeClass: 'stroke-score-critical',
    label: 'Crítico',
    description: 'Risco muito alto - ação imediata necessária'
  },
  warning: {
    colorClass: 'text-score-warning',
    strokeClass: 'stroke-score-warning',
    label: 'Alerta',
    description: 'Risco moderado - melhorias recomendadas'
  },
  caution: {
    colorClass: 'text-score-caution',
    strokeClass: 'stroke-score-caution',
    label: 'Atenção',
    description: 'Risco baixo - pequenos ajustes sugeridos'
  },
  safe: {
    colorClass: 'text-score-safe',
    strokeClass: 'stroke-score-safe',
    label: 'Seguro',
    description: 'Excelente! Conta bem protegida'
  }
};

export function ScoreGauge({ score, scoreLevel }: ScoreGaugeProps) {
  const config = levelConfig[scoreLevel];
  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className="stroke-muted/30"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className={cn(config.strokeClass, "transition-all duration-1000 ease-out")}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold", config.colorClass)}>{score}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <span className={cn("text-lg font-semibold px-3 py-1", config.colorClass, `bg-current/10`)}>
          <span className={config.colorClass}>{config.label}</span>
        </span>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">{config.description}</p>
      </div>
    </div>
  );
}
