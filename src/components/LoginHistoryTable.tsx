import { LoginAttempt } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Check, X, Smartphone, Globe, Key, Mail, Fingerprint } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LoginHistoryTableProps {
  logins: LoginAttempt[];
}

const loginTypeLabels = {
  password: 'Senha',
  passwordless: 'Passwordless',
  social: 'Social'
};

const twoFactorLabels = {
  email: 'Email',
  otp: 'OTP',
  none: 'Nenhum'
};

export function LoginHistoryTable({ logins }: LoginHistoryTableProps) {
  return (
    <div className="border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Data/Hora</TableHead>
              <TableHead className="font-semibold">Tipo Login</TableHead>
              <TableHead className="font-semibold">2FA</TableHead>
              <TableHead className="font-semibold">Fingerprint</TableHead>
              <TableHead className="font-semibold">SO / Browser</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logins.map((login) => (
              <TableRow key={login.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-mono text-sm">
                  <div className="flex flex-col">
                    <span>{login.dateTime.toLocaleDateString('pt-BR')}</span>
                    <span className="text-muted-foreground text-xs">
                      {login.dateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {login.loginType === 'password' && <Key className="h-4 w-4 text-muted-foreground" />}
                    {login.loginType === 'passwordless' && <Mail className="h-4 w-4 text-muted-foreground" />}
                    {login.loginType === 'social' && <Globe className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm">{loginTypeLabels[login.loginType]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-xs px-2 py-1",
                    login.twoFactorType === 'otp' 
                      ? "bg-status-success/20 text-status-success"
                      : login.twoFactorType === 'email'
                      ? "bg-primary/20 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                  )}>
                    {twoFactorLabels[login.twoFactorType]}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <code className="text-xs bg-muted/30 px-2 py-0.5">{login.fingerprint}</code>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm">{login.os}</span>
                      <span className="text-xs text-muted-foreground">{login.browser}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {login.success ? (
                    <div className="inline-flex items-center gap-1 bg-status-success/20 text-status-success px-2 py-1">
                      <Check className="h-3 w-3" />
                      <span className="text-xs font-medium">Sucesso</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 bg-destructive/20 text-destructive px-2 py-1">
                      <X className="h-3 w-3" />
                      <span className="text-xs font-medium">Falha</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
