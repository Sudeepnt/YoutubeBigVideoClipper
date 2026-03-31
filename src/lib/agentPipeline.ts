import { getLocalAiAdapter, ScriptRequest, StoryboardRequest, VoiceoverRequest } from './aiAdapters';
import { StartAgentWorkflowPayload, startAgentWorkflow, WorkflowRunResult } from './workflowApi';

export interface AgentPipelineInput {
    projectId: string;
    prompt: string;
    context?: string;
    targetPlatform?: string;
    aspectRatio?: string;
    hooksEnabled?: boolean;
    captionsEnabled?: boolean;
    sourceUrls?: string[];
}

export interface AgentDraftBundle {
    scriptTitle: string;
    scriptBody: string;
    hooks: string[];
    storyboardScenes: number;
    estimatedVoiceoverSec: number;
}

export async function buildLocalAgentDraft(input: AgentPipelineInput): Promise<AgentDraftBundle> {
    const adapter = getLocalAiAdapter();

    const scriptReq: ScriptRequest = {
        prompt: input.prompt,
        context: input.context,
        targetPlatform: input.targetPlatform
    };
    const script = await adapter.generateScript(scriptReq);
    const hooks = await adapter.generateHooks({ script: script.script, maxHooks: 3 });

    const storyboardReq: StoryboardRequest = {
        script: script.script,
        sceneCount: 6
    };
    const storyboard = await adapter.generateStoryboard(storyboardReq);

    const voiceReq: VoiceoverRequest = {
        script: script.script,
        voiceStyle: 'neutral'
    };
    const voice = await adapter.generateVoiceoverPlan(voiceReq);

    return {
        scriptTitle: script.title,
        scriptBody: script.script,
        hooks: hooks.hooks,
        storyboardScenes: storyboard.scenes.length,
        estimatedVoiceoverSec: voice.estimatedDurationSec
    };
}

export async function runAgentWorkflow(input: AgentPipelineInput): Promise<WorkflowRunResult> {
    const payload: StartAgentWorkflowPayload = {
        projectId: input.projectId,
        prompt: input.prompt,
        targetPlatform: input.targetPlatform,
        aspectRatio: input.aspectRatio,
        hooksEnabled: input.hooksEnabled,
        captionsEnabled: input.captionsEnabled,
        sourceUrls: input.sourceUrls
    };
    return startAgentWorkflow(payload);
}
