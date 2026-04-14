import { invoke, isTauri } from '@tauri-apps/api/core';
import type { TranscriptWord } from '../types';

export interface StoredSource {
    id: string;
    projectId: string;
    sourceType: string;
    mimeType: string | null;
    fileName: string | null;
    filePath: string | null;
    sourceUrl: string | null;
    metadataJson: string | null;
    createdAt: string;
}

export interface StoredWorkflow {
    id: string;
    projectId: string;
    workflowType: string;
    status: string;
    inputJson: string | null;
    outputJson: string | null;
    error: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface StoredWorkflowStep {
    id: string;
    workflowId: string;
    stepKey: string;
    stepLabel: string;
    stepOrder: number;
    status: string;
    startedAt: string | null;
    endedAt: string | null;
    detailJson: string | null;
    error: string | null;
}

export interface StoredRender {
    id: string;
    projectId: string;
    workflowId: string | null;
    renderType: string;
    filePath: string;
    durationSec: number;
    resolutionWidth: number;
    resolutionHeight: number;
    status: string;
    createdAt: string;
}

export interface StoredCaption {
    id: string;
    projectId: string;
    clipId: string | null;
    style: string | null;
    language: string;
    srtContent: string | null;
    vttContent: string | null;
    createdAt: string;
}

export interface StoredProjectTranscript {
    id: string;
    projectId: string;
    modelSize: string;
    status: 'processing' | 'complete' | 'error';
    sourceStartMs: number | null;
    sourceEndMs: number | null;
    words: TranscriptWord[];
    language: string | null;
    error: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface StartAgentWorkflowPayload {
    projectId: string;
    prompt: string;
    targetPlatform?: string;
    aspectRatio?: string;
    hooksEnabled?: boolean;
    captionsEnabled?: boolean;
    sourceUrls?: string[];
}

export interface WorkflowRunResult {
    workflow: StoredWorkflow;
    steps: StoredWorkflowStep[];
    renders: StoredRender[];
}

export interface UpsertNotificationTargetPayload {
    channel: string;
    target: string;
    isEnabled: boolean;
}

export interface StoredNotificationTarget {
    id: string;
    channel: string;
    target: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StoredNotification {
    id: string;
    projectId: string | null;
    channel: string;
    target: string;
    message: string;
    status: string;
    createdAt: string;
    sentAt: string | null;
}

export interface UpsertCaptionPayload {
    projectId: string;
    clipId?: string;
    style?: string;
    language: string;
    srtContent?: string;
    vttContent?: string;
}

export interface TranscribeSourcePayload {
    projectId: string;
    videoPath?: string;
    modelSize?: string;
    startMs?: number;
    endMs?: number;
}

export interface TranscribeVideoPayload {
    videoPath: string;
    modelSize?: string;
}

export interface DirectTranscriptResult {
    modelSize: string;
    language: string | null;
    words: TranscriptWord[];
}

async function requireDesktop<T>(fn: () => Promise<T>): Promise<T> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for persisted workflow APIs.');
    }
    return fn();
}

export function listProjectSources(projectId: string): Promise<StoredSource[]> {
    return requireDesktop(() => invoke<StoredSource[]>('list_project_sources', { projectId }));
}

export function listProjectWorkflows(projectId: string): Promise<StoredWorkflow[]> {
    return requireDesktop(() => invoke<StoredWorkflow[]>('list_project_workflows', { projectId }));
}

export function listWorkflowSteps(workflowId: string): Promise<StoredWorkflowStep[]> {
    return requireDesktop(() => invoke<StoredWorkflowStep[]>('list_workflow_steps', { workflowId }));
}

export function listWorkflowRenders(workflowId: string): Promise<StoredRender[]> {
    return requireDesktop(() => invoke<StoredRender[]>('list_workflow_renders', { workflowId }));
}

export function startAgentWorkflow(payload: StartAgentWorkflowPayload): Promise<WorkflowRunResult> {
    return requireDesktop(() => invoke<WorkflowRunResult>('start_agent_workflow', { payload }));
}

export function upsertCaption(payload: UpsertCaptionPayload): Promise<StoredCaption> {
    return requireDesktop(() => invoke<StoredCaption>('upsert_caption', { payload }));
}

export function listProjectCaptions(projectId: string): Promise<StoredCaption[]> {
    return requireDesktop(() => invoke<StoredCaption[]>('list_project_captions', { projectId }));
}

export function transcribeSource(payload: TranscribeSourcePayload): Promise<StoredProjectTranscript> {
    return requireDesktop(() => invoke<StoredProjectTranscript>('transcribe_source', { payload }));
}

export function getProjectTranscript(projectId: string): Promise<StoredProjectTranscript | null> {
    return requireDesktop(() => invoke<StoredProjectTranscript | null>('get_project_transcript', { projectId }));
}

export function transcribeVideo(payload: TranscribeVideoPayload): Promise<DirectTranscriptResult> {
    return requireDesktop(() => invoke<DirectTranscriptResult>('transcribe_video', { payload }));
}

export function upsertNotificationTarget(payload: UpsertNotificationTargetPayload): Promise<StoredNotificationTarget> {
    return requireDesktop(() => invoke<StoredNotificationTarget>('upsert_notification_target', { payload }));
}

export function listNotificationTargets(): Promise<StoredNotificationTarget[]> {
    return requireDesktop(() => invoke<StoredNotificationTarget[]>('list_notification_targets'));
}

export function queueNotification(payload: { projectId?: string; channel: string; message: string }): Promise<StoredNotification> {
    const rustPayload = {
        projectId: payload.projectId ?? null,
        channel: payload.channel,
        message: payload.message
    };
    return requireDesktop(() => invoke<StoredNotification>('queue_notification', { payload: rustPayload }));
}

export function listNotifications(projectId?: string): Promise<StoredNotification[]> {
    return requireDesktop(() => invoke<StoredNotification[]>('list_notifications', { projectId: projectId ?? null }));
}

export function setAppSetting(key: string, value: string): Promise<{ key: string; value: string; updatedAt: string }> {
    return requireDesktop(() => invoke('set_app_setting', { key, value }));
}

export function getAppSetting(key: string): Promise<{ key: string; value: string; updatedAt: string } | null> {
    return requireDesktop(() => invoke('get_app_setting', { key }));
}
