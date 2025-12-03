// Mock data generator for security score system

export interface LoginAttempt {
  id: string;
  dateTime: Date;
  loginType: 'password' | 'passwordless' | 'social';
  twoFactorType: 'email' | 'otp' | 'none';
  fingerprint: string;
  os: string;
  browser: string;
  ip: string;
  country: string;
  success: boolean;
}

export interface SecurityFactor {
  id: string;
  name: string;
  description: string;
  category: 'positive' | 'negative';
  isActive: boolean;
  weight: number;
  details?: string;
}

export interface UserSecurityData {
  score: number;
  scoreLevel: 'critical' | 'warning' | 'caution' | 'safe';
  hasOtpEnabled: boolean;
  hasRecentPasswordChange: boolean;
  lastPasswordChange: Date | null;
  isNewUser: boolean;
  failedLoginAttempts: number;
  factors: SecurityFactor[];
  loginHistory: LoginAttempt[];
}

const browsers = ['Chrome 120', 'Firefox 121', 'Safari 17', 'Edge 120', 'Opera 105'];
const operatingSystems = ['Windows 11', 'macOS Sonoma', 'Ubuntu 22.04', 'iOS 17', 'Android 14'];
const countries = ['Brasil', 'Estados Unidos', 'Portugal', 'Argentina', 'México', 'Nigéria', 'Rússia'];
const highRiskCountries = ['Nigéria', 'Rússia'];
const loginTypes: ('password' | 'passwordless' | 'social')[] = ['password', 'passwordless', 'social'];

function generateFingerprint(): string {
  return 'fp_' + Math.random().toString(36).substring(2, 10);
}

function generateIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getScoreLevel(score: number): 'critical' | 'warning' | 'caution' | 'safe' {
  if (score < 40) return 'critical';
  if (score < 70) return 'warning';
  if (score < 90) return 'caution';
  return 'safe';
}

export function generateLoginHistory(count: number, consistentData: boolean = true): LoginAttempt[] {
  const baseFingerprint = generateFingerprint();
  const baseIP = generateIP();
  const baseOS = getRandomElement(operatingSystems);
  const baseBrowser = getRandomElement(browsers);
  const baseCountry = 'Brasil';
  
  const logins: LoginAttempt[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    
    const useConsistentData = consistentData && Math.random() > 0.3;
    const success = Math.random() > 0.15;
    const loginType = getRandomElement(loginTypes);
    
    let twoFactorType: 'email' | 'otp' | 'none' = 'none';
    if (loginType === 'password') {
      twoFactorType = Math.random() > 0.5 ? 'otp' : 'email';
    } else if (Math.random() > 0.6) {
      twoFactorType = 'otp';
    }
    
    logins.push({
      id: `login_${i}_${Math.random().toString(36).substring(2, 8)}`,
      dateTime: date,
      loginType,
      twoFactorType,
      fingerprint: useConsistentData ? baseFingerprint : generateFingerprint(),
      os: useConsistentData ? baseOS : getRandomElement(operatingSystems),
      browser: useConsistentData ? baseBrowser : getRandomElement(browsers),
      ip: useConsistentData ? baseIP : generateIP(),
      country: useConsistentData ? baseCountry : getRandomElement(countries),
      success
    });
  }
  
  return logins.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
}

export function generateSecurityData(): UserSecurityData {
  const score = Math.floor(Math.random() * 101);
  const scoreLevel = getScoreLevel(score);
  
  const isNewUser = Math.random() > 0.85;
  const hasOtpEnabled = score > 50 ? Math.random() > 0.3 : Math.random() > 0.7;
  const hasRecentPasswordChange = score > 60 ? Math.random() > 0.4 : Math.random() > 0.8;
  const failedLoginAttempts = score < 50 ? Math.floor(Math.random() * 10) + 3 : Math.floor(Math.random() * 3);
  
  const lastPasswordChange = hasRecentPasswordChange 
    ? new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
    : new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000) - 90 * 24 * 60 * 60 * 1000);
  
  const loginHistory = generateLoginHistory(Math.floor(Math.random() * 6) + 5, score > 50);
  
  // Calculate factor states based on score
  const sameIPUsed = score > 40 && Math.random() > 0.3;
  const sameUserAgentUsed = score > 45 && Math.random() > 0.35;
  const sameCountryUsed = score > 35 && Math.random() > 0.25;
  const sameFingerprintUsed = score > 50 && Math.random() > 0.4;
  const standardBehavior = score > 55 && Math.random() > 0.35;
  const manyFailedAttempts = score < 50 && Math.random() > 0.4;
  const differentInfrastructure = score < 45 && Math.random() > 0.5;
  
  const factors: SecurityFactor[] = [
    {
      id: 'password_change',
      name: 'Troca de Senha Recente',
      description: 'Senha alterada nos últimos 3 meses',
      category: 'positive',
      isActive: hasRecentPasswordChange,
      weight: 10,
      details: hasRecentPasswordChange 
        ? `Última alteração: ${lastPasswordChange.toLocaleDateString('pt-BR')}`
        : 'Senha não alterada há mais de 3 meses'
    },
    {
      id: 'same_ip',
      name: 'Endereço IP Reconhecido',
      description: 'Utilizando mesmo IP de sessões anteriores',
      category: 'positive',
      isActive: !isNewUser && sameIPUsed,
      weight: 8,
      details: sameIPUsed ? 'IP corresponde ao histórico de logins' : 'IP não reconhecido no histórico'
    },
    {
      id: 'same_user_agent',
      name: 'User Agent Reconhecido',
      description: 'Mesmo navegador e SO de sessões anteriores',
      category: 'positive',
      isActive: !isNewUser && sameUserAgentUsed,
      weight: 8,
      details: sameUserAgentUsed ? 'Dispositivo corresponde ao histórico' : 'Dispositivo não reconhecido'
    },
    {
      id: 'same_country',
      name: 'Geolocalização Reconhecida',
      description: 'Login do mesmo país de sessões anteriores',
      category: 'positive',
      isActive: !isNewUser && sameCountryUsed,
      weight: 10,
      details: sameCountryUsed ? 'Localização consistente com histórico' : 'País diferente do habitual'
    },
    {
      id: 'same_fingerprint',
      name: 'Fingerprint Reconhecido',
      description: 'Dispositivo identificado em sessões anteriores',
      category: 'positive',
      isActive: !isNewUser && sameFingerprintUsed,
      weight: 12,
      details: sameFingerprintUsed ? 'Fingerprint corresponde ao histórico' : 'Fingerprint não reconhecido'
    },
    {
      id: 'otp_enabled',
      name: '2FA via OTP Habilitado',
      description: 'Autenticação de dois fatores via aplicativo',
      category: 'positive',
      isActive: hasOtpEnabled,
      weight: 15,
      details: hasOtpEnabled ? 'Proteção adicional ativa' : 'Considere habilitar OTP para maior segurança'
    },
    {
      id: 'standard_behavior',
      name: 'Comportamento Padrão',
      description: 'Horário e frequência de login consistentes',
      category: 'positive',
      isActive: !isNewUser && standardBehavior,
      weight: 10,
      details: standardBehavior ? 'Padrão de acesso consistente' : 'Comportamento fora do padrão habitual'
    },
    {
      id: 'failed_attempts',
      name: 'Tentativas de Login Falhas',
      description: 'Múltiplas tentativas sem sucesso detectadas',
      category: 'negative',
      isActive: manyFailedAttempts,
      weight: -15,
      details: manyFailedAttempts ? `${failedLoginAttempts} tentativas falhas recentes` : 'Nenhuma tentativa suspeita'
    },
    {
      id: 'different_infrastructure',
      name: 'Infraestrutura Variável',
      description: 'Logins de múltiplos dispositivos/locais',
      category: 'negative',
      isActive: differentInfrastructure,
      weight: -12,
      details: differentInfrastructure ? 'Possível ataque de validação de lista' : 'Infraestrutura consistente'
    }
  ];
  
  return {
    score,
    scoreLevel,
    hasOtpEnabled,
    hasRecentPasswordChange,
    lastPasswordChange,
    isNewUser,
    failedLoginAttempts,
    factors,
    loginHistory
  };
}
