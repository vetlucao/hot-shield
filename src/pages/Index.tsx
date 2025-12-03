import { useState, useEffect } from "react";
import { User, Settings, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityScoreBadge } from "@/components/SecurityScoreBadge";
import { SecurityScorePage } from "@/pages/SecurityScorePage";
import { generateSecurityData, UserSecurityData } from "@/lib/mockData";

const Index = () => {
  const [securityData, setSecurityData] = useState<UserSecurityData | null>(null);
  const [showSecurityPage, setShowSecurityPage] = useState(false);

  useEffect(() => {
    setSecurityData(generateSecurityData());
  }, []);

  const handleRefresh = () => {
    setSecurityData(generateSecurityData());
  };

  if (!securityData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (showSecurityPage) {
    return (
      <SecurityScorePage 
        securityData={securityData} 
        onBack={() => setShowSecurityPage(false)}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-foreground">SecureAccount</span>
            </div>

            {/* Right Side - Score Badge & User Menu */}
            <div className="flex items-center gap-4">
              <SecurityScoreBadge 
                score={securityData.score}
                scoreLevel={securityData.scoreLevel}
                onClick={() => setShowSecurityPage(true)}
                size="sm"
              />
              
              <div className="h-6 w-px bg-border" />
              
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Gerencie sua conta e monitore a segurança do seu acesso
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Security Score Card */}
          <div 
            className="md:col-span-1 bg-card border border-border p-6 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setShowSecurityPage(true)}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Score de Segurança</h2>
            <div className="flex flex-col items-center">
              <SecurityScoreBadge 
                score={securityData.score}
                scoreLevel={securityData.scoreLevel}
                size="lg"
              />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Clique para ver detalhes do cálculo e fatores de risco
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="md:col-span-2 bg-card border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumo da Conta</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">2FA Ativo</p>
                <p className="text-xl font-bold text-foreground">
                  {securityData.hasOtpEnabled ? 'OTP + Email' : 'Apenas Email'}
                </p>
              </div>
              <div className="p-4 bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">Última Troca de Senha</p>
                <p className="text-xl font-bold text-foreground">
                  {securityData.lastPasswordChange 
                    ? securityData.lastPasswordChange.toLocaleDateString('pt-BR')
                    : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">Logins Recentes</p>
                <p className="text-xl font-bold text-foreground">{securityData.loginHistory.length}</p>
              </div>
              <div className="p-4 bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">Tentativas Falhas</p>
                <p className="text-xl font-bold text-foreground">{securityData.failedLoginAttempts}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="md:col-span-3 bg-card border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Atividade Recente</h2>
            <div className="space-y-3">
              {securityData.loginHistory.slice(0, 3).map((login) => (
                <div 
                  key={login.id} 
                  className="flex items-center justify-between p-3 bg-muted/20 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-status-success' : 'bg-destructive'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Login via {login.loginType === 'password' ? 'senha' : login.loginType === 'passwordless' ? 'passwordless' : 'social'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {login.os} • {login.browser} • {login.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">
                      {login.dateTime.toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {login.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-primary hover:text-primary/80"
              onClick={() => setShowSecurityPage(true)}
            >
              Ver histórico completo
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 SecureAccount. Motor de Risco v1.0</p>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
