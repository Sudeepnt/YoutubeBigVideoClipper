import { convertFileSrc, invoke, isTauri } from '@tauri-apps/api/core';
import { ClipSuggestion, Project, SourceType } from '../types';

interface StoredProject {
    id: string;
    name: string;
    sourceType: SourceType;
    sourceUrl: string | null;
    sourcePath: string;
    nativeSourcePath?: string | null;
    fileName: string;
    fileSize: number;
    duration: number;
    resolutionWidth: number;
    resolutionHeight: number;
    createdAt: string;
    status: string;
    thumbnailPath: string | null;
    clipCount: number;
}

interface StoredClip {
    id: string;
    projectId: string;
    startMs: number;
    endMs: number;
    hook: string;
    reason: string;
    score: number;
    selected: boolean;
    videoPath: string;
    thumbnailPath: string | null;
    aspectRatio?: string | null;
    createdAt: string;
    processingMode: 'copy' | 'reencode';
}

interface PreparedProcessingSource {
    sourcePath: string;
    durationSec: number;
    thumbnailPath: string | null;
}

interface UploadProjectPayload {
    name: string;
    fileName: string;
    fileSize: number;
    duration: number;
    resolutionWidth: number;
    resolutionHeight: number;
    sourcePath?: string;
    sourceBytes?: number[];
}

export interface LinkInfo {
    title?: string;
    duration?: number;
    maxHeight: number;
    qualityOptions: number[];
}

const assetUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('asset:')) {
        return path;
    }
    if (path.startsWith('/imports/') || path.startsWith('/generated-clips/')) {
        return path;
    }
    if (isTauri() && isLocalDevHost() && path.startsWith('/')) {
        return `/api/local-file?path=${encodeURIComponent(path)}`;
    }
    if (isTauri()) {
        if (path.startsWith('/')) {
            return `http://127.0.0.1:14321/media?path=${encodeURIComponent(path)}`;
        }
        return convertFileSrc(path);
    }
    return path;
};

const isLocalDevHost = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
};

async function fetchLocalDevJson<T>(path: string, payload: unknown): Promise<T> {
    const response = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => ({} as { error?: string }));
    if (!response.ok) {
        throw new Error(body.error || `Request failed with status ${response.status}.`);
    }

    return body as T;
}

const mapProject = (p: StoredProject): Project => {
    const resolvedSourcePath = isTauri() ? (p.nativeSourcePath ?? p.sourcePath) : p.sourcePath;
    const resolvedPreviewPath = isTauri() && p.nativeSourcePath && p.sourcePath.startsWith('/')
        ? p.sourcePath
        : assetUrl(resolvedSourcePath);

    return {
        id: p.id,
        name: p.name,
        filePath: resolvedPreviewPath,
        sourcePath: resolvedSourcePath,
        fileName: p.fileName,
        duration: p.duration,
        fileSize: p.fileSize,
        resolution: { width: p.resolutionWidth, height: p.resolutionHeight },
        createdAt: p.createdAt,
        status: (p.status as Project['status']) ?? 'imported',
        thumbnailUrl: p.thumbnailPath ? assetUrl(p.thumbnailPath) : undefined,
        sourceType: p.sourceType,
        sourceUrl: p.sourceUrl ?? undefined,
        clipCount: p.clipCount
    };
};

const mapClip = (c: StoredClip): ClipSuggestion => ({
    id: c.id,
    projectId: c.projectId,
    startMs: c.startMs,
    endMs: c.endMs,
    hook: c.hook,
    reason: c.reason,
    score: c.score,
    selected: c.selected,
    videoPath: c.videoPath,
    videoUrl: assetUrl(c.videoPath),
    thumbnailUrl: c.thumbnailPath ? assetUrl(c.thumbnailPath) : undefined,
    aspectRatio: (c.aspectRatio as ClipSuggestion['aspectRatio']) ?? '9:16',
    createdAt: c.createdAt,
    processingMode: c.processingMode
});

export async function initLibrary(): Promise<void> {
    if (!isTauri()) return;
    await invoke('init_library');
}

export async function listProjects(): Promise<Project[]> {
    if (!isTauri()) return [];
    const rows = await invoke<StoredProject[]>('list_projects');
    return rows.map(mapProject);
}

export async function listProjectClips(projectId: string): Promise<ClipSuggestion[]> {
    if (!isTauri()) return [];
    const rows = await invoke<StoredClip[]>('list_project_clips', { projectId });
    return rows.map(mapClip);
}

export async function createUploadProject(payload: UploadProjectPayload): Promise<Project> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for persisted uploads.');
    }
    const row = await invoke<StoredProject>('create_upload_project', { payload });
    return mapProject(row);
}

export async function pickUploadProject(): Promise<Project | null> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for native uploads.');
    }
    const row = await invoke<StoredProject | null>('pick_upload_project');
    return row ? mapProject(row) : null;
}

export async function ensureProjectThumbnail(projectId: string): Promise<Project> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for project thumbnails.');
    }
    const row = await invoke<StoredProject>('ensure_project_thumbnail', { projectId });
    return mapProject(row);
}

export async function loadProjectPreviewBlobUrl(projectId: string): Promise<string> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for source preview blobs.');
    }
    const bytes = await invoke<number[]>('load_project_preview_blob', { projectId });
    const blob = new Blob([Uint8Array.from(bytes)], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
}

export async function prepareProjectPreviewUrl(projectId: string): Promise<string> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for source preview preparation.');
    }
    const previewPath = await invoke<string>('prepare_project_preview', { projectId });
    return assetUrl(previewPath);
}

export async function loadProjectThumbnailBlobUrl(projectId: string): Promise<string> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for thumbnail blobs.');
    }
    const bytes = await invoke<number[]>('load_project_thumbnail_blob', { projectId });
    const blob = new Blob([Uint8Array.from(bytes)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
}

export async function createLinkProject(url: string, quality = 1080): Promise<Project> {
    if (!isTauri()) {
        const payload = await fetchLocalDevJson<StoredProject>('/api/link-import', { url, quality });
        return mapProject(payload);
    }

    try {
        const row = await invoke<StoredProject>('create_link_project', { url, quality });
        return mapProject(row);
    } catch (error) {
        if (!isLocalDevHost()) {
            throw error;
        }
        const payload = await fetchLocalDevJson<StoredProject>('/api/link-import', { url, quality });
        return mapProject(payload);
    }
}

export async function fetchLinkInfo(url: string): Promise<LinkInfo> {
    if (!isTauri()) {
        return fetchLocalDevJson<LinkInfo>('/api/link-info', { url });
    }

    try {
        return await invoke<LinkInfo>('fetch_link_info', { url });
    } catch (error) {
        if (!isLocalDevHost()) {
            throw error;
        }
        return fetchLocalDevJson<LinkInfo>('/api/link-info', { url });
    }
}

export async function clearProjectClips(projectId: string): Promise<void> {
    if (!isTauri()) {
        await fetch('/api/clear-project-clips', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ projectId }),
        }).catch(() => undefined);
        return;
    }
    await invoke('clear_project_clips', { projectId });
}

export async function prepareProcessingSource(args: {
    projectId: string;
    startMs: number;
    endMs: number;
}): Promise<{ sourcePath: string; durationSec: number; thumbnailUrl?: string }> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for selected-range source preparation.');
    }

    const row = await invoke<PreparedProcessingSource>('prepare_processing_source', args);
    return {
        sourcePath: row.sourcePath,
        durationSec: row.durationSec,
        thumbnailUrl: row.thumbnailPath ? assetUrl(row.thumbnailPath) : undefined,
    };
}

export async function generateClipNative(args: {
    projectId: string;
    sourcePath?: string;
    startMs: number;
    endMs: number;
    timelineStartMs?: number;
    timelineEndMs?: number;
    index: number;
    hook: string;
    reason: string;
    score: number;
    selected: boolean;
    aspectRatio?: string;
    burnSubtitles?: boolean;
}): Promise<ClipSuggestion> {
    if (!isTauri()) {
        const response = await fetch('/api/generate-clip', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(args),
        });
        const payload = await response.json().catch(() => ({} as { error?: string }));
        if (!response.ok) {
            throw new Error(payload.error || `Clip generation failed with status ${response.status}.`);
        }
        return mapClip(payload as StoredClip);
    }
    const row = await invoke<StoredClip>('generate_clip_native', args);
    return mapClip(row);
}

export async function burnClipSubtitles(clipId: string, modelSize = 'medium'): Promise<ClipSuggestion> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for subtitle burn.');
    }
    const row = await invoke<StoredClip>('burn_clip_subtitles', { clipId, modelSize });
    return mapClip(row);
}

export async function deleteProject(projectId: string): Promise<void> {
    if (!isTauri()) return;
    await invoke('delete_project', { projectId });
}

export async function deleteClip(clipId: string): Promise<void> {
    if (!isTauri()) return;
    await invoke('delete_clip', { clipId });
}
