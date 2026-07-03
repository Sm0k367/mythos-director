export type CampaignStatus =
  | 'draft'
  | 'planning'
  | 'generating_media'
  | 'review'
  | 'completed'
  | 'failed';

export type PipelineStep =
  | 'brief_analysis'
  | 'creative_direction'
  | 'storyboard'
  | 'hero_image'
  | 'social_copy'
  | 'review';

export interface CampaignBrief {
  product: string;
  audience: string;
  goal: string;
  tone: string;
  budget?: string;
  channels?: string[];
}

export interface StoryboardFrame {
  shot: number;
  duration: string;
  description: string;
  visualPrompt: string;
}

export interface SocialCopy {
  headline: string;
  tagline: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  cta: string;
}

export interface CreativeDirection {
  concept: string;
  taglines: string[];
  messagingPillars: string[];
  colorPalette: string[];
  moodKeywords: string[];
}

export interface CampaignAssets {
  heroImageUrl?: string;
  heroImageNote?: string;
}

export interface Campaign {
  id: string;
  name: string;
  brief: CampaignBrief;
  status: CampaignStatus;
  creative?: CreativeDirection;
  storyboard?: StoryboardFrame[];
  socialCopy?: SocialCopy;
  assets?: CampaignAssets;
  script?: string;
  events: PipelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineEvent {
  step: PipelineStep;
  status: 'started' | 'completed' | 'failed' | 'skipped';
  message: string;
  timestamp: string;
  data?: unknown;
}

export interface CreateCampaignInput {
  name: string;
  brief: CampaignBrief;
}