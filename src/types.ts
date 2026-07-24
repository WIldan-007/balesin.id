export type ViewMode = 
  | 'landing' 
  | 'terminal' 
  | 'dashboard' 
  | 'flows' 
  | 'builder' 
  | 'new-flow' 
  | 'campaigns' 
  | 'connections' 
  | 'logs'
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
  isNewUserRegistration?: boolean;
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

export type KeywordMatchType = 'Exact Match' | 'Contains' | 'Starts With' | 'Ends With' | 'Regex';

export interface KeywordRule {
  id: string;
  word: string;
  matchType: KeywordMatchType;
}

export type CampaignCategory = 'Post Automation' | 'Story Automation' | 'Live Automation' | 'DM Automation' | 'Broadcast Automation';
export type CampaignStatus = 'Running' | 'Paused' | 'Draft' | 'Archived' | 'Failed' | 'Waiting Approval';
export type CampaignHealth = 'Running' | 'Low CTR' | 'Error' | 'Draft';

export interface Campaign {
  id: string;
  name: string;
  code: string;
  platform: 'Instagram' | 'WhatsApp' | 'TikTok' | 'Discord';
  category: CampaignCategory;
  status: CampaignStatus;
  health: CampaignHealth;
  thumbnailUrl: string;
  postUrl?: string;
  instagramUsername?: string;
  keywords: KeywordRule[];
  dmSent: number;
  clicks: number;
  followers: number;
  ctr: number;
  revenue: number;
  commentCount: number;
  averageResponse: string;
  aiCost: string;
  conversionRate: number;
  activeLinksCount: number;
  uptimeVelocity: number;
  createdAt: string;
  aiPrompt?: string;
  brandVoice?: string;
  shortlink?: string;
  destinationUrl?: string;
}

export interface LiveActivity {
  id: string;
  timestamp: string;
  username: string;
  avatar?: string;
  action: 'COMMENTED' | 'AI_REPLIED' | 'DM_SENT' | 'LINK_CLICKED' | 'PURCHASE';
  details: string;
  campaignName: string;
  platform: string;
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
