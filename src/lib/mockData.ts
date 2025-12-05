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

export interface SecuritySubFactor {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  weight: number;
  details?: string;
}

export interface SecurityFactorGroup {
  id: string;
  name: string;
  description: string;
  category: 'positive' | 'negative';
  maxScore: number;
  currentScore: number;
  subFactors: SecuritySubFactor[];
}

export interface UserSecurityData {
  score: number;
  scoreLevel: 'critical' | 'warning' | 'caution' | 'safe';
  hasOtpEnabled: boolean;
  hasRecentPasswordChange: boolean;
  lastPasswordChange: Date | null;
  isNewUser: boolean;
  failedLoginAttempts: number;
  factorGroups: SecurityFactorGroup[];
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

// Analyze login history to determine infrastructure factors
function analyzeLoginHistory(history: LoginAttempt[]) {
  if (history.length < 2) {
    return {
      sameIPUsed: false,
      sameFingerprintUsed: false,
      sameCountryUsed: false,
      sameUserAgentUsed: false,
      goodIPReputation: false,
      ipConsistencyRate: 0,
      fingerprintConsistencyRate: 0,
      countryConsistencyRate: 0,
      userAgentConsistencyRate: 0,
      mostUsedIP: '',
      mostUsedFingerprint: '',
      mostUsedCountry: '',
      mostUsedUserAgent: ''
    };
  }

  // Get the most recent login as "current"
  const currentLogin = history[0];
  const previousLogins = history.slice(1);
  
  // Count occurrences
  const ipCount: Record<string, number> = {};
  const fingerprintCount: Record<string, number> = {};
  const countryCount: Record<string, number> = {};
  const userAgentCount: Record<string, number> = {};
  
  previousLogins.forEach(login => {
    ipCount[login.ip] = (ipCount[login.ip] || 0) + 1;
    fingerprintCount[login.fingerprint] = (fingerprintCount[login.fingerprint] || 0) + 1;
    countryCount[login.country] = (countryCount[login.country] || 0) + 1;
    const userAgent = `${login.os}|${login.browser}`;
    userAgentCount[userAgent] = (userAgentCount[userAgent] || 0) + 1;
  });
  
  // Find most common values
  const getMostCommon = (counts: Record<string, number>) => {
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  };
  
  const mostUsedIP = getMostCommon(ipCount);
  const mostUsedFingerprint = getMostCommon(fingerprintCount);
  const mostUsedCountry = getMostCommon(countryCount);
  const mostUsedUserAgent = getMostCommon(userAgentCount);
  
  // Calculate consistency rates (how often the current matches historical)
  const totalPrevious = previousLogins.length;
  const ipConsistencyRate = (ipCount[currentLogin.ip] || 0) / totalPrevious;
  const fingerprintConsistencyRate = (fingerprintCount[currentLogin.fingerprint] || 0) / totalPrevious;
  const countryConsistencyRate = (countryCount[currentLogin.country] || 0) / totalPrevious;
  const currentUserAgent = `${currentLogin.os}|${currentLogin.browser}`;
  const userAgentConsistencyRate = (userAgentCount[currentUserAgent] || 0) / totalPrevious;
  
  // Check if current login matches most common patterns (threshold: 30%)
  const sameIPUsed = ipConsistencyRate >= 0.3 || currentLogin.ip === mostUsedIP;
  const sameFingerprintUsed = fingerprintConsistencyRate >= 0.3 || currentLogin.fingerprint === mostUsedFingerprint;
  const sameCountryUsed = countryConsistencyRate >= 0.3 || currentLogin.country === mostUsedCountry;
  const sameUserAgentUsed = userAgentConsistencyRate >= 0.3 || currentUserAgent === mostUsedUserAgent;
  
  // IP reputation - check if country is not high risk
  const goodIPReputation = !highRiskCountries.includes(currentLogin.country);
  
  return {
    sameIPUsed,
    sameFingerprintUsed,
    sameCountryUsed,
    sameUserAgentUsed,
    goodIPReputation,
    ipConsistencyRate,
    fingerprintConsistencyRate,
    countryConsistencyRate,
    userAgentConsistencyRate,
    mostUsedIP,
    mostUsedFingerprint,
    mostUsedCountry,
    mostUsedUserAgent
  };
}

export function generateSecurityData(): UserSecurityData {
  const isNewUser = Math.random() > 0.85;
  
  // Generate login history first
  const loginHistoryCount = isNewUser ? 1 : Math.floor(Math.random() * 6) + 5;
  const loginHistory = generateLoginHistory(loginHistoryCount, Math.random() > 0.4);
  
  // Analyze login history for infrastructure factors
  const historyAnalysis = analyzeLoginHistory(loginHistory);
  
  // Randomly determine other factor states
  const hasOtpEnabled = Math.random() > 0.5;
  const hasRecentPasswordChange = Math.random() > 0.5;
  const manyFailedAttempts = Math.random() > 0.7;
  
  const failedLoginAttempts = manyFailedAttempts ? Math.floor(Math.random() * 7) + 3 : Math.floor(Math.random() * 2);
  
  const lastPasswordChange = hasRecentPasswordChange 
    ? new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
    : new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000) - 90 * 24 * 60 * 60 * 1000);
  
  // Random factor states for Comportamento Temporal (based on history analysis)
  const standardShift = !isNewUser && Math.random() > 0.4;
  const lowDispersion = !isNewUser && Math.random() > 0.4;
  const noAnomalies = !isNewUser && Math.random() > 0.3;
  
  // Random factor states for Segurança de Conta
  const lowFailedAttempts = Math.random() > 0.3;

  // 1. Infraestrutura e Rede - max 40 points (based on login history)
  const infraNetworkSubFactors: SecuritySubFactor[] = [
    {
      id: 'same_ip',
      name: 'Endereço IP Reconhecido',
      description: 'Utilizando mesmo IP de sessões anteriores',
      isActive: !isNewUser && historyAnalysis.sameIPUsed,
      weight: 8,
      details: historyAnalysis.sameIPUsed 
        ? `IP corresponde ao histórico (${Math.round(historyAnalysis.ipConsistencyRate * 100)}% consistência)` 
        : 'IP não reconhecido no histórico'
    },
    {
      id: 'same_fingerprint',
      name: 'Fingerprint Reconhecido',
      description: 'Dispositivo identificado em sessões anteriores',
      isActive: !isNewUser && historyAnalysis.sameFingerprintUsed,
      weight: 8,
      details: historyAnalysis.sameFingerprintUsed 
        ? `Fingerprint corresponde ao histórico (${Math.round(historyAnalysis.fingerprintConsistencyRate * 100)}% consistência)` 
        : 'Fingerprint não reconhecido'
    },
    {
      id: 'ip_reputation',
      name: 'Reputação do IP',
      description: 'IP sem histórico de atividades suspeitas',
      isActive: !isNewUser && historyAnalysis.goodIPReputation,
      weight: 8,
      details: historyAnalysis.goodIPReputation 
        ? 'IP verificado - sem riscos detectados' 
        : 'IP de região com alto risco identificado'
    },
    {
      id: 'same_country',
      name: 'Geolocalização Reconhecida',
      description: 'Login do mesmo país de sessões anteriores',
      isActive: !isNewUser && historyAnalysis.sameCountryUsed,
      weight: 6,
      details: historyAnalysis.sameCountryUsed 
        ? `Localização consistente com histórico (${Math.round(historyAnalysis.countryConsistencyRate * 100)}% consistência)` 
        : 'País diferente do habitual'
    },
    {
      id: 'same_device',
      name: 'Dispositivo Reconhecido',
      description: 'Mesmo dispositivo de sessões anteriores',
      isActive: !isNewUser && historyAnalysis.sameFingerprintUsed,
      weight: 5,
      details: historyAnalysis.sameFingerprintUsed 
        ? 'Dispositivo corresponde ao histórico' 
        : 'Dispositivo não reconhecido'
    },
    {
      id: 'same_user_agent',
      name: 'User Agent Reconhecido',
      description: 'Mesmo navegador e SO de sessões anteriores',
      isActive: !isNewUser && historyAnalysis.sameUserAgentUsed,
      weight: 5,
      details: historyAnalysis.sameUserAgentUsed 
        ? `User agent corresponde ao histórico (${Math.round(historyAnalysis.userAgentConsistencyRate * 100)}% consistência)` 
        : 'User agent não reconhecido'
    }
  ];

  // 2. Comportamento Temporal - max 25 points
  const temporalBehaviorSubFactors: SecuritySubFactor[] = [
    {
      id: 'standard_shift',
      name: 'Turno de Acesso Padrão',
      description: 'Login em horário habitual do usuário',
      isActive: standardShift,
      weight: 10,
      details: standardShift ? 'Horário consistente com padrão histórico' : 'Acesso em horário atípico'
    },
    {
      id: 'low_dispersion',
      name: 'Baixa Dispersão de Acessos',
      description: 'Frequência de login dentro do padrão',
      isActive: lowDispersion,
      weight: 8,
      details: lowDispersion ? 'Intervalo entre logins consistente' : 'Padrão de acessos irregular'
    },
    {
      id: 'no_anomalies',
      name: 'Sem Anomalias Detectadas',
      description: 'Comportamento temporal sem desvios suspeitos',
      isActive: noAnomalies,
      weight: 7,
      details: noAnomalies ? 'Nenhuma anomalia temporal identificada' : 'Anomalias comportamentais detectadas'
    }
  ];

  // 3. Segurança de Conta - max 35 points
  const accountSecuritySubFactors: SecuritySubFactor[] = [
    {
      id: 'otp_enabled',
      name: '2FA via OTP Habilitado',
      description: 'Autenticação de dois fatores via aplicativo',
      isActive: hasOtpEnabled,
      weight: 15,
      details: hasOtpEnabled ? 'Proteção adicional ativa' : 'Considere habilitar OTP para maior segurança'
    },
    {
      id: 'password_change',
      name: 'Troca de Senha Recente',
      description: 'Senha alterada nos últimos 3 meses',
      isActive: hasRecentPasswordChange,
      weight: 10,
      details: hasRecentPasswordChange 
        ? `Última alteração: ${lastPasswordChange?.toLocaleDateString('pt-BR')}`
        : 'Senha não alterada há mais de 3 meses'
    },
    {
      id: 'low_failed_attempts',
      name: 'Baixa Taxa de Falhas de Login',
      description: 'Poucas tentativas de login sem sucesso',
      isActive: lowFailedAttempts,
      weight: 10,
      details: lowFailedAttempts 
        ? 'Histórico de logins com baixa taxa de falhas' 
        : `${failedLoginAttempts} tentativas falhas recentes detectadas`
    }
  ];

  const calcGroupScore = (subFactors: SecuritySubFactor[]) => {
    return subFactors.filter(f => f.isActive).reduce((sum, f) => sum + f.weight, 0);
  };

  const factorGroups: SecurityFactorGroup[] = [
    {
      id: 'infra_network',
      name: 'Infraestrutura e Rede',
      description: 'IP, fingerprint, reputação, geolocalização, device, user-agent',
      category: 'positive',
      maxScore: 40,
      currentScore: calcGroupScore(infraNetworkSubFactors),
      subFactors: infraNetworkSubFactors
    },
    {
      id: 'temporal_behavior',
      name: 'Comportamento Temporal',
      description: 'Turnos, dispersão e anomalias',
      category: 'positive',
      maxScore: 25,
      currentScore: calcGroupScore(temporalBehaviorSubFactors),
      subFactors: temporalBehaviorSubFactors
    },
    {
      id: 'account_security',
      name: 'Segurança de Conta',
      description: '2FA via OTP, reset de senha, falhas de login',
      category: 'positive',
      maxScore: 35,
      currentScore: calcGroupScore(accountSecuritySubFactors),
      subFactors: accountSecuritySubFactors
    }
  ];

  // Calculate score based on factors sum (all positive now, max 100)
  const score = Math.max(0, Math.min(100, factorGroups.reduce((sum, g) => sum + g.currentScore, 0)));
  const scoreLevel = getScoreLevel(score);
  
  return {
    score,
    scoreLevel,
    hasOtpEnabled,
    hasRecentPasswordChange,
    lastPasswordChange,
    isNewUser,
    failedLoginAttempts,
    factorGroups,
    loginHistory
  };
}
