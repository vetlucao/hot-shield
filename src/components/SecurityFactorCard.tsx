import { cn } from "@/lib/utils";
import { Check, AlertTriangle, ChevronDown, ChevronUp, Shield, Key, AlertCircle } from "lucide-react";
import { useState } from "react";
import { SecurityFactorGroup, SecuritySubFactor } from "@/lib/mockData";

interface SecurityFactorCardProps {
  group: SecurityFactorGroup;
}

const groupIcons = {
  security_activity: Shield,
  signin_recovery: Key,
  alert_factors: AlertCircle
};

function SubFactorItem({ factor, isNegativeGroup }: { factor: SecuritySubFactor; isNegativeGroup: boolean }) {
  const isProtected = isNegativeGroup ? !factor.isActive : factor.isActive;
  
  return (
    <div className={cn(
      "p-3 border-b border-border/30 last:border-b-0",
      isProtected ? "bg-status-success/5" : "bg-status-warning/5"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-1.5 rounded-full",
          isProtected ? "bg-status-success/20" : "bg-status-warning/20"
        )}>
          {isProtected ? (
            <Check className="h-3.5 w-3.5 text-status-success" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-status-warning" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{factor.name}</p>
          <p className="text-xs text-muted-foreground">{factor.details}</p>
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded",
          isProtected 
            ? "bg-status-success/20 text-status-success" 
            : "bg-status-warning/20 text-status-warning"
        )}>
          {factor.weight > 0 ? '+' : ''}{factor.weight} pts
        </span>
      </div>
    </div>
  );
}

export function SecurityFactorCard({ group }: SecurityFactorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isNegative = group.category === 'negative';
  const Icon = groupIcons[group.id as keyof typeof groupIcons] || Shield;
  
  const hasIssues = isNegative ? group.currentScore > 0 : group.currentScore < group.maxScore;

  const statusConfig = hasIssues
    ? {
        bgClass: 'bg-status-warning/10',
        borderClass: 'border-status-warning/30',
        iconBgClass: 'bg-status-warning/20',
        iconClass: 'text-status-warning'
      }
    : {
        bgClass: 'bg-status-success/10',
        borderClass: 'border-status-success/30',
        iconBgClass: 'bg-status-success/20',
        iconClass: 'text-status-success'
      };

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
        <div className={cn("p-2.5", statusConfig.iconBgClass)}>
          <Icon className={cn("h-5 w-5", statusConfig.iconClass)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground">{group.name}</h4>
          <p className="text-sm text-muted-foreground">{group.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={cn(
              "text-lg font-bold",
              isNegative 
                ? (group.currentScore > 0 ? "text-status-warning" : "text-status-success")
                : (group.currentScore === group.maxScore ? "text-status-success" : "text-status-warning")
            )}>
              {isNegative ? `-${group.currentScore}` : group.currentScore}
            </span>
            <span className="text-sm text-muted-foreground">/{isNegative ? group.maxScore : group.maxScore}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="border-t border-border/30">
          {group.subFactors.map(factor => (
            <SubFactorItem 
              key={factor.id} 
              factor={factor} 
              isNegativeGroup={isNegative}
            />
          ))}
        </div>
      )}
    </div>
  );
}
