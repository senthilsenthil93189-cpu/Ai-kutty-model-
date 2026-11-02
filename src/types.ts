export type TabType = 'trending' | 'optimizer' | 'story' | 'animals' | 'media' | 'three' | 'music' | 'science' | 'transcribe' | 'grounding' | 'nanobanana' | 'vault' | 'coach';

export interface TrendingTopic {
  id: string;
  topic: string;
  momentumScore: number;
  viewPotential: string;
  competition: string;
  growthRate: string;
  description: string;
  suggestedTitles: string[];
}

export interface TitleIdea {
  title: string;
  score: number;
  type: string;
  rationale: string;
}

export interface ScriptChapter {
  time: string;
  title: string;
  talkingPoints: string;
  visualCue: string;
}

export interface ThumbnailConcept {
  focalPoint: string;
  colorPalette: string;
  textOverlay: string;
  emotionalTrigger: string;
  layoutDescription: string;
}

export interface OptimizationResult {
  id?: string;
  topic: string;
  niche: string;
  titles: TitleIdea[];
  description: string;
  tags: string[];
  hookScript: string;
  scriptOutline: ScriptChapter[];
  thumbnailConcept: ThumbnailConcept;
  createdAt: string;
  status: 'Idea' | 'Scripting' | 'Filming' | 'Published';
}
