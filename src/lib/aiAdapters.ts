export type AgentMode = 'local-rule-based' | 'local-llm';

export interface ScriptRequest {
    prompt: string;
    context?: string;
    targetPlatform?: string;
}

export interface ScriptResult {
    title: string;
    script: string;
    tone: string;
}

export interface HookRequest {
    script: string;
    maxHooks?: number;
}

export interface HookResult {
    hooks: string[];
}

export interface SegmentCandidate {
    startMs: number;
    endMs: number;
    transcript?: string;
}

export interface ClipScoreRequest {
    projectTitle: string;
    segments: SegmentCandidate[];
}

export interface ClipScoreResult {
    scored: Array<SegmentCandidate & { score: number; reason: string }>;
}

export interface CaptionRequest {
    transcript: string;
    language?: string;
}

export interface CaptionCue {
    startMs: number;
    endMs: number;
    text: string;
}

export interface CaptionResult {
    cues: CaptionCue[];
}

export interface StoryboardRequest {
    script: string;
    sceneCount?: number;
}

export interface StoryboardScene {
    index: number;
    title: string;
    visualDirection: string;
}

export interface StoryboardResult {
    scenes: StoryboardScene[];
}

export interface VoiceoverRequest {
    script: string;
    voiceStyle?: string;
}

export interface VoiceoverResult {
    narrationPlan: string;
    estimatedDurationSec: number;
}

export interface AssetSelectionRequest {
    script: string;
    availableAssets: Array<{ id: string; kind: string; label: string }>;
}

export interface AssetSelectionResult {
    selectedAssetIds: string[];
    reasoning: string;
}

export interface ScriptGenerator {
    generateScript(input: ScriptRequest): Promise<ScriptResult>;
}

export interface HookGenerator {
    generateHooks(input: HookRequest): Promise<HookResult>;
}

export interface ClipScorer {
    scoreSegments(input: ClipScoreRequest): Promise<ClipScoreResult>;
}

export interface CaptionGenerator {
    generateCaptions(input: CaptionRequest): Promise<CaptionResult>;
}

export interface StoryboardGenerator {
    generateStoryboard(input: StoryboardRequest): Promise<StoryboardResult>;
}

export interface VoiceoverGenerator {
    generateVoiceoverPlan(input: VoiceoverRequest): Promise<VoiceoverResult>;
}

export interface AssetSelector {
    selectAssets(input: AssetSelectionRequest): Promise<AssetSelectionResult>;
}

export interface LocalAiAdapter
    extends ScriptGenerator,
        HookGenerator,
        ClipScorer,
        CaptionGenerator,
        StoryboardGenerator,
        VoiceoverGenerator,
        AssetSelector {}

export class RuleBasedLocalAiAdapter implements LocalAiAdapter {
    async generateScript(input: ScriptRequest): Promise<ScriptResult> {
        const title = input.prompt.split('.').find(Boolean)?.trim().slice(0, 80) || 'Untitled Video';
        const lines = [
            `Hook: ${title}`,
            `Context: ${input.context || 'Local-first generation pipeline.'}`,
            `Main Point: ${input.prompt}`,
            `CTA: Follow for more short-form insights.`,
        ];
        return {
            title,
            script: lines.join('\n\n'),
            tone: 'informative'
        };
    }

    async generateHooks(input: HookRequest): Promise<HookResult> {
        const base = input.script.split('\n').filter(Boolean).slice(0, input.maxHooks ?? 3);
        const hooks = base.map((line, i) => `Hook ${i + 1}: ${line.replace(/^Hook:\s*/i, '')}`);
        return { hooks: hooks.length ? hooks : ['Hook 1: Start with a bold claim.'] };
    }

    async scoreSegments(input: ClipScoreRequest): Promise<ClipScoreResult> {
        const scored = input.segments.map((segment, idx) => {
            const durationSec = (segment.endMs - segment.startMs) / 1000;
            const durationFactor = Math.max(0, 10 - Math.abs(35 - durationSec) / 5);
            const score = Math.max(1, Math.min(10, Math.round(durationFactor - idx * 0.3)));
            return {
                ...segment,
                score,
                reason: `Rule-based score for ${durationSec.toFixed(1)}s duration and rank ${idx + 1}.`
            };
        });
        return { scored };
    }

    async generateCaptions(input: CaptionRequest): Promise<CaptionResult> {
        const words = input.transcript.split(/\s+/).filter(Boolean);
        const chunkSize = 6;
        const cues: CaptionCue[] = [];
        for (let i = 0; i < words.length; i += chunkSize) {
            const text = words.slice(i, i + chunkSize).join(' ');
            const startMs = i * 350;
            const endMs = startMs + Math.max(800, text.length * 70);
            cues.push({ startMs, endMs, text });
        }
        return { cues };
    }

    async generateStoryboard(input: StoryboardRequest): Promise<StoryboardResult> {
        const sceneCount = Math.max(3, input.sceneCount ?? 6);
        const scenes: StoryboardScene[] = [];
        for (let i = 0; i < sceneCount; i += 1) {
            scenes.push({
                index: i + 1,
                title: `Scene ${i + 1}`,
                visualDirection: i === 0 ? 'Strong opening visual and title card.' : 'Supporting b-roll with animated text.'
            });
        }
        return { scenes };
    }

    async generateVoiceoverPlan(input: VoiceoverRequest): Promise<VoiceoverResult> {
        const words = input.script.split(/\s+/).filter(Boolean).length;
        const estimatedDurationSec = Math.max(8, Math.round(words / 2.4));
        return {
            narrationPlan: `Voice style: ${input.voiceStyle || 'neutral'}. Pace: medium. Emphasize hooks and CTA.`,
            estimatedDurationSec
        };
    }

    async selectAssets(input: AssetSelectionRequest): Promise<AssetSelectionResult> {
        const selectedAssetIds = input.availableAssets.slice(0, 5).map((asset) => asset.id);
        return {
            selectedAssetIds,
            reasoning: `Selected top ${selectedAssetIds.length} assets in deterministic local mode.`
        };
    }
}

let adapterMode: AgentMode = 'local-rule-based';
let adapterInstance: LocalAiAdapter = new RuleBasedLocalAiAdapter();

export function setAdapterMode(mode: AgentMode): void {
    adapterMode = mode;
    if (mode === 'local-rule-based') {
        adapterInstance = new RuleBasedLocalAiAdapter();
        return;
    }
    // Placeholder until a real local LLM adapter is added.
    adapterInstance = new RuleBasedLocalAiAdapter();
}

export function getAdapterMode(): AgentMode {
    return adapterMode;
}

export function getLocalAiAdapter(): LocalAiAdapter {
    return adapterInstance;
}
