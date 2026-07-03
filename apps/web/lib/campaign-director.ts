import { chatCompletion } from './openai';
import { generateHeroImage } from './media';
import { getCampaign, saveCampaign } from './store';
import type {
  Campaign,
  CampaignBrief,
  CreativeDirection,
  PipelineEvent,
  PipelineStep,
  SocialCopy,
  StoryboardFrame,
} from './types';

function now(): string {
  return new Date().toISOString();
}

function addEvent(
  campaign: Campaign,
  step: PipelineStep,
  status: PipelineEvent['status'],
  message: string,
  data?: unknown
): Campaign {
  const event: PipelineEvent = { step, status, message, timestamp: now(), data };
  const updated: Campaign = {
    ...campaign,
    events: [...campaign.events, event],
    updatedAt: now(),
  };
  return saveCampaign(updated);
}

function buildFallbackCreative(brief: CampaignBrief): CreativeDirection {
  return {
    concept: `${brief.product} campaign targeting ${brief.audience} with a ${brief.tone} tone to achieve: ${brief.goal}`,
    taglines: [
      `${brief.product} — built for ${brief.audience}`,
      `The ${brief.tone} way to ${brief.goal.toLowerCase()}`,
      `Meet ${brief.product}. Change how you ${brief.goal.toLowerCase()}.`,
    ],
    messagingPillars: [
      `Solve the core problem for ${brief.audience}`,
      `Deliver a clear, ${brief.tone} brand promise`,
      `Drive measurable results: ${brief.goal}`,
    ],
    colorPalette: ['#0f0f0f', '#e94560', '#f5f5f5', '#1a1a2e'],
    moodKeywords: [brief.tone, 'modern', 'confident', 'authentic'],
  };
}

function buildFallbackStoryboard(brief: CampaignBrief, creative: CreativeDirection): StoryboardFrame[] {
  return [
    {
      shot: 1,
      duration: '3s',
      description: `Open on ${brief.audience} facing the problem ${brief.product} solves.`,
      visualPrompt: `Cinematic opening shot, ${brief.tone} mood, ${creative.moodKeywords.join(', ')}, problem awareness for ${brief.product}`,
    },
    {
      shot: 2,
      duration: '5s',
      description: `Introduce ${brief.product} as the solution with key benefit highlighted.`,
      visualPrompt: `Product hero reveal, ${creative.colorPalette[1]} accent lighting, premium ${brief.tone} aesthetic`,
    },
    {
      shot: 3,
      duration: '4s',
      description: `Show real-world usage and emotional payoff for ${brief.audience}.`,
      visualPrompt: `Lifestyle scene, diverse ${brief.audience}, authentic moment, warm natural light`,
    },
    {
      shot: 4,
      duration: '3s',
      description: `Close with tagline "${creative.taglines[0]}" and clear call to action.`,
      visualPrompt: `Bold end card, minimal typography, ${creative.colorPalette.join(' and ')} color scheme`,
    },
  ];
}

function buildFallbackSocial(brief: CampaignBrief, creative: CreativeDirection): SocialCopy {
  const tagline = creative.taglines[0];
  return {
    headline: `${brief.product}: ${brief.goal}`,
    tagline,
    instagram: `${tagline} ✨\n\nBuilt for ${brief.audience} who want to ${brief.goal.toLowerCase()}.\n\n#${brief.product.replace(/\s+/g, '')} #marketing`,
    linkedin: `Introducing ${brief.product}.\n\n${creative.concept}\n\n${creative.messagingPillars[0]}\n\nLearn more →`,
    twitter: `${tagline} — ${brief.product} is here. ${brief.goal}.`,
    cta: `Get started with ${brief.product}`,
  };
}

async function generateCreative(brief: CampaignBrief): Promise<CreativeDirection> {
  try {
    const raw = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are Mythos Director, a senior creative director at a marketing agency.
Return valid JSON with keys: concept, taglines (array of 3), messagingPillars (array of 3), colorPalette (array of 4 hex codes), moodKeywords (array of 4 strings).
Be specific to the brief. No markdown.`,
        },
        {
          role: 'user',
          content: JSON.stringify(brief),
        },
      ],
      { json: true }
    );
    return JSON.parse(raw) as CreativeDirection;
  } catch {
    return buildFallbackCreative(brief);
  }
}

async function generateStoryboard(
  brief: CampaignBrief,
  creative: CreativeDirection
): Promise<{ frames: StoryboardFrame[]; script: string }> {
  try {
    const raw = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are a commercial director. Return valid JSON with:
- frames: array of 4 objects with shot (number), duration (string like "3s"), description, visualPrompt (detailed image gen prompt)
- script: full 15-second voiceover script as a single string
No markdown.`,
        },
        {
          role: 'user',
          content: JSON.stringify({ brief, creative }),
        },
      ],
      { json: true }
    );
    const parsed = JSON.parse(raw) as { frames: StoryboardFrame[]; script: string };
    return { frames: parsed.frames, script: parsed.script };
  } catch {
    const frames = buildFallbackStoryboard(brief, creative);
    const script = frames.map((f) => `[${f.duration}] ${f.description}`).join('\n');
    return { frames, script };
  }
}

async function generateSocialCopy(
  brief: CampaignBrief,
  creative: CreativeDirection
): Promise<SocialCopy> {
  try {
    const raw = await chatCompletion(
      [
        {
          role: 'system',
          content: `You are a copywriter. Return valid JSON with keys: headline, tagline, instagram, linkedin, twitter, cta.
Platform copy should be ready to publish. No markdown.`,
        },
        {
          role: 'user',
          content: JSON.stringify({ brief, creative }),
        },
      ],
      { json: true }
    );
    return JSON.parse(raw) as SocialCopy;
  } catch {
    return buildFallbackSocial(brief, creative);
  }
}

export type PipelineCallback = (event: PipelineEvent, campaign: Campaign) => void;

export async function runCampaignPipeline(
  campaignId: string,
  onEvent?: PipelineCallback
): Promise<Campaign> {
  let campaign = getCampaign(campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const emit = (step: PipelineStep, status: PipelineEvent['status'], message: string, data?: unknown) => {
    campaign = addEvent(campaign!, step, status, message, data);
    onEvent?.(campaign.events[campaign.events.length - 1], campaign);
  };

  try {
    campaign = { ...campaign, status: 'planning', updatedAt: now() };
    saveCampaign(campaign);

    emit('brief_analysis', 'started', 'Analyzing campaign brief');
    emit('brief_analysis', 'completed', `Brief locked: ${campaign.brief.product} → ${campaign.brief.goal}`);

    emit('creative_direction', 'started', 'Generating creative direction');
    const creative = await generateCreative(campaign.brief);
    campaign = { ...campaign, creative, updatedAt: now() };
    saveCampaign(campaign);
    emit('creative_direction', 'completed', 'Creative direction ready', creative);

    emit('storyboard', 'started', 'Building storyboard and script');
    const { frames, script } = await generateStoryboard(campaign.brief, creative);
    campaign = { ...campaign, storyboard: frames, script, updatedAt: now() };
    saveCampaign(campaign);
    emit('storyboard', 'completed', `${frames.length} shots scripted`, { frames, script });

    campaign = { ...campaign, status: 'generating_media', updatedAt: now() };
    saveCampaign(campaign);

    emit('hero_image', 'started', 'Generating hero image from shot 2');
    const heroPrompt = frames[1]?.visualPrompt ?? creative.concept;
    const image = await generateHeroImage(heroPrompt);
    campaign = {
      ...campaign,
      assets: { heroImageUrl: image.url, heroImageNote: image.note },
      updatedAt: now(),
    };
    saveCampaign(campaign);
    emit('hero_image', 'completed', image.note, image);

    emit('social_copy', 'started', 'Writing platform-specific copy');
    const socialCopy = await generateSocialCopy(campaign.brief, creative);
    campaign = { ...campaign, socialCopy, updatedAt: now() };
    saveCampaign(campaign);
    emit('social_copy', 'completed', 'Social copy ready', socialCopy);

    campaign = { ...campaign, status: 'review', updatedAt: now() };
    saveCampaign(campaign);
    emit('review', 'started', 'Campaign package ready for human review');

    campaign = { ...campaign, status: 'completed', updatedAt: now() };
    saveCampaign(campaign);
    emit('review', 'completed', 'Campaign production complete — export when ready');

    return campaign;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Pipeline failed';
    campaign = { ...campaign, status: 'failed', updatedAt: now() };
    saveCampaign(campaign);
    emit('review', 'failed', message);
    return campaign;
  }
}

export function createCampaignPackage(campaign: Campaign) {
  return {
    id: campaign.id,
    name: campaign.name,
    exportedAt: now(),
    brief: campaign.brief,
    creative: campaign.creative,
    storyboard: campaign.storyboard,
    script: campaign.script,
    socialCopy: campaign.socialCopy,
    assets: campaign.assets,
    status: campaign.status,
  };
}