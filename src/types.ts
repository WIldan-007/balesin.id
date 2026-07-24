export type ViewMode = 
  | 'landing' 
  | 'terminal' 
  | 'dashboard' 
  | 'flows' 
  | 'builder' 
  | 'new-flow' 
  | 'campaigns' 
  | 'connections' 
  | 'affiliate' 
  | 'settings' 
  | 'checkout-plus' 
  | 'checkout-pro';

export interface UserProfile {
  name: string;
  id: string;
  tier: 'FREE_TRIAL' | 'PLUS' | 'PRO' | 'AGENCY';
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  createdAt?: string;
  trialStartDate?: string;
  trialEndsAt?: string; // ISO string
  trialDaysLeft?: number;
  isTrialExpired?: boolean;
}

export interface AutomationFlow {
  id: string;
  designation: string;
  platform: 'Instagram' | 'WhatsApp' | 'TikTok' | 'Discord' | 'Webhook';
  triggerType: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  totalReplies: number;
  clicks: number;
  efficiency: number;
  createdAt: string;
  lastExecution: string;
}

export interface PlatformNode {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'TikTok' | 'Telegram' | 'Discord';
  handle: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'RE_AUTH_REQUIRED';
  tokenExpires: string;
  apiVersion: string;
  lastSync: string;
  iconName: string;
  apiKey?: string;
  appSecret?: string;
}

export interface Campaign {
  id: string;
  name: string;
  code: string;
  ctr: number;
  revenue: number;
  activeLinksCount: number;
  uptimeVelocity: number;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  createdAt: string;
}

export interface ShortLink {
  id: string;
  slug: string;
  url: string;
  destination: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export interface AffiliateNode {
  id: string;
  operatorId: string;
  joinDate: string;
  tier: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  yield: number;
  lifetimeValue: number;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  title: string;
  description: string;
  platform?: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  event: string;
  node: string;
}
