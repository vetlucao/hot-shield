import { ArrowLeft, RefreshCw, Shield, History, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSecurityData } from "@/lib/mockData";
import { SecurityFactorCard } from "@/components/SecurityFactorCard";
import { LoginHistoryTable } from "@/components/LoginHistoryTable";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SecurityScorePageProps {
  securityData: UserSecurityData;
  onBack: () => void;
  onRefresh: () => void;
}

export function SecurityScorePage({ securityData, onBack, onRefresh }: SecurityScorePageProps) {
  const positiveGroups = securityData.factorGroups.filter(g => g.category === 'positive');
  const negativeGroups = securityData.factorGroups.filter(g => g.category === 'negative');
  
  const totalPositiveScore = positiveGroups.reduce((sum, g) => sum + g.currentScore, 0);
  const totalMaxPositive = positiveGroups.reduce((sum, g) => sum + g.maxScore, 0);
  const totalNegativePenalty = negativeGroups.reduce((sum, g) => sum + g.currentScore, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Score de Segurança</h1>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Score Overview */}
        <div className="bg-card border border-border p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ScoreGauge score={securityData.score} scoreLevel={securityData.scoreLevel} />
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Resumo da Análise</h2>
                <p className="text-muted-foreground text-sm">
                  Seu score de segurança é calculado com base em múltiplos fatores do motor de risco, 
                  incluindo comportamento de acesso, autenticação e infraestrutura utilizada.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-status-success/10 border border-status-success/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-status-success" />
                    <span className="font-medium text-status-success">Pontos Positivos</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {totalPositiveScore}/{totalMaxPositive}
                  </p>
                  <p className="text-xs text-muted-foreground">pontos ativos</p>
                </div>
                
                <div className="bg-status-warning/10 border border-status-warning/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-status-warning" />
                    <span className="font-medium text-status-warning">Penalidades</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    -{totalNegativePenalty}
                  </p>
                  <p className="text-xs text-muted-foreground">pontos de alerta</p>
                </div>
              </div>

              {securityData.isNewUser && (
                <div className="bg-primary/10 border border-primary/30 p-3">
                  <p className="text-sm text-primary">
                    <strong>Novo usuário:</strong> Alguns fatores comportamentais ainda não foram avaliados 
                    por falta de histórico de logins.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for Factors and History */}
        <Tabs defaultValue="factors" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="factors" className="gap-2">
              <Shield className="h-4 w-4" />
              Fatores de Risco
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Histórico de Logins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="factors" className="space-y-4">
            {/* All Factor Groups */}
            {securityData.factorGroups.map(group => (
              <SecurityFactorCard key={group.id} group={group} />
            ))}
          </TabsContent>

          <TabsContent value="history">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Últimos Logins</h3>
                <span className="text-sm text-muted-foreground">
                  Exibindo {securityData.loginHistory.length} registros
                </span>
              </div>
              <LoginHistoryTable logins={securityData.loginHistory} />
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
