import { cn } from "@/lib/utils";
import { Check, AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { SecurityFactor } from "@/lib/mockData";

interface SecurityFactorCardProps {
  factor: SecurityFactor;
}

export function SecurityFactorCard({ factor }: SecurityFactorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isPositive = factor.category === 'positive';
  const isProtected = isPositive ? factor.isActive : !factor.isActive;

  const statusConfig = isProtected
    ? {
        icon: Check,
        bgClass: 'bg-status-success/10',
        borderClass: 'border-status-success/30',
        iconBgClass: 'bg-status-success/20',
        iconClass: 'text-status-success'
      }
    : {
        icon: isPositive ? AlertTriangle : X,
        bgClass: 'bg-status-warning/10',
        borderClass: 'border-status-warning/30',
        iconBgClass: 'bg-status-warning/20',
        iconClass: 'text-status-warning'
      };

  const Icon = statusConfig.icon;

  return (
    <div
      className={cn(
        "border transition-all duration-200",
        statusConfig.bgClass,
        statusConfig.borderClass
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className={cn("p-2", statusConfig.iconBgClass)}>
          <Icon className={cn("h-5 w-5", statusConfig.iconClass)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground">{factor.name}</h4>
          <p className="text-sm text-muted-foreground truncate">{factor.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs px-2 py-1",
            isProtected ? "bg-status-success/20 text-status-success" : "bg-status-warning/20 text-status-warning"
          )}>
            {isProtected ? (isPositive ? 'Ativo' : 'Inativo') : (isPositive ? 'Inativo' : 'Detectado')}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && factor.details && (
        <div className="px-4 pb-4 pt-0">
          <div className="ml-14 p-3 bg-card/50 border border-border/50">
            <p className="text-sm text-muted-foreground">{factor.details}</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Peso no cálculo:</span>
              <span className={cn(
                "font-medium",
                factor.weight > 0 ? "text-status-success" : "text-destructive"
              )}>
                {factor.weight > 0 ? '+' : ''}{factor.weight} pontos
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
