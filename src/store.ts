import { Project, ClipSuggestion, TranscriptSegment, PipelineStage, SystemStatus, ExportSettings } from './types';

// ═══════════════════════════════════════════════════════
// Demo data for the UI prototype
// ═══════════════════════════════════════════════════════

export const mockProjects: Project[] = [
    {
        id: '1',
        name: 'How I Built a $1M SaaS in 6 Months',
        filePath: '/videos/saas-talk.mp4',
        fileName: 'saas-talk.mp4',
        duration: 3847,
        fileSize: 1_240_000_000,
        resolution: { width: 1920, height: 1080 },
        createdAt: '2026-03-04T10:30:00Z',
        status: 'ready',
    },
    {
        id: '2',
        name: 'Deep Work — Full Podcast Episode',
        filePath: '/videos/deep-work-ep.mp4',
        fileName: 'deep-work-ep.mp4',
        duration: 5423,
        fileSize: 2_100_000_000,
        resolution: { width: 1920, height: 1080 },
        createdAt: '2026-03-03T14:20:00Z',
        status: 'complete',
    },
    {
        id: '3',
        name: 'React Advanced Patterns Workshop',
        filePath: '/videos/react-workshop.mp4',
        fileName: 'react-workshop.mp4',
        duration: 7200,
        fileSize: 3_500_000_000,
        resolution: { width: 3840, height: 2160 },
        createdAt: '2026-03-02T09:00:00Z',
        status: 'transcribing',
    },
];

export const mockClips: ClipSuggestion[] = [
    {
        id: 'clip-1',
        startMs: 124000,
        endMs: 178000,
        hook: "Here's the thing nobody tells you about building a SaaS...",
        reason: 'Strong emotional hook + contrarian take that challenges common beliefs. High engagement potential.',
        score: 9,
        selected: true,
    },
    {
        id: 'clip-2',
        startMs: 456000,
        endMs: 512000,
        hook: "I lost $50,000 in one weekend because of this one mistake.",
        reason: 'Dramatic personal story with financial stakes. Creates intense curiosity and relatability.',
        score: 8,
        selected: true,
    },
    {
        id: 'clip-3',
        startMs: 890000,
        endMs: 945000,
        hook: "The 5-minute morning routine that changed everything.",
        reason: 'Actionable framework with clear promise. Viewers love numbered frameworks.',
        score: 8,
        selected: false,
    },
    {
        id: 'clip-4',
        startMs: 1200000,
        endMs: 1248000,
        hook: "Stop building features nobody asked for.",
        reason: 'Bold statement that resonates with builder community. High share potential.',
        score: 7,
        selected: false,
    },
    {
        id: 'clip-5',
        startMs: 2100000,
        endMs: 2160000,
        hook: "My first customer paid me $10,000 and I almost said no.",
        reason: 'Story arc with unexpected twist. Generates strong emotional response.',
        score: 7,
        selected: false,
    },
];

export const mockTranscript: TranscriptSegment[] = [
    {
        id: 1,
        start: 0,
        end: 5200,
        text: "Welcome back to the channel. Today I want to talk about something that changed my entire perspective on building software.",
        words: [
            { word: "Welcome", start: 0, end: 400, confidence: 0.98 },
            { word: "back", start: 420, end: 700, confidence: 0.99 },
            { word: "to", start: 720, end: 850, confidence: 0.99 },
            { word: "the", start: 870, end: 980, confidence: 0.99 },
            { word: "channel.", start: 1000, end: 1500, confidence: 0.98 },
            { word: "Today", start: 1800, end: 2200, confidence: 0.99 },
            { word: "I", start: 2250, end: 2350, confidence: 0.99 },
            { word: "want", start: 2380, end: 2600, confidence: 0.99 },
            { word: "to", start: 2620, end: 2700, confidence: 0.99 },
            { word: "talk", start: 2720, end: 3000, confidence: 0.99 },
            { word: "about", start: 3020, end: 3300, confidence: 0.98 },
            { word: "something", start: 3320, end: 3800, confidence: 0.97 },
            { word: "that", start: 3820, end: 4000, confidence: 0.99 },
            { word: "changed", start: 4020, end: 4400, confidence: 0.98 },
            { word: "my", start: 4420, end: 4550, confidence: 0.99 },
            { word: "entire", start: 4570, end: 4850, confidence: 0.97 },
            { word: "perspective", start: 4870, end: 5100, confidence: 0.96 },
            { word: "on", start: 5100, end: 5150, confidence: 0.99 },
            { word: "building", start: 5150, end: 5180, confidence: 0.98 },
            { word: "software.", start: 5180, end: 5200, confidence: 0.98 },
        ],
    },
    {
        id: 2,
        start: 5400,
        end: 12000,
        text: "Six months ago, I was a solo developer working from my bedroom. I had no funding, no team, and honestly, no idea what I was doing. But here's the thing nobody tells you about building a SaaS product.",
        words: [
            { word: "Six", start: 5400, end: 5600, confidence: 0.99 },
            { word: "months", start: 5620, end: 5900, confidence: 0.99 },
            { word: "ago,", start: 5920, end: 6200, confidence: 0.98 },
            { word: "I", start: 6400, end: 6500, confidence: 0.99 },
            { word: "was", start: 6520, end: 6700, confidence: 0.99 },
            { word: "a", start: 6720, end: 6800, confidence: 0.99 },
            { word: "solo", start: 6820, end: 7100, confidence: 0.98 },
            { word: "developer", start: 7120, end: 7600, confidence: 0.97 },
            { word: "working", start: 7620, end: 7900, confidence: 0.98 },
            { word: "from", start: 7920, end: 8100, confidence: 0.99 },
            { word: "my", start: 8120, end: 8250, confidence: 0.99 },
            { word: "bedroom.", start: 8270, end: 8700, confidence: 0.98 },
            { word: "I", start: 8900, end: 9000, confidence: 0.99 },
            { word: "had", start: 9020, end: 9200, confidence: 0.99 },
            { word: "no", start: 9220, end: 9400, confidence: 0.99 },
            { word: "funding,", start: 9420, end: 9800, confidence: 0.98 },
            { word: "no", start: 9900, end: 10050, confidence: 0.99 },
            { word: "team,", start: 10070, end: 10350, confidence: 0.99 },
            { word: "and", start: 10500, end: 10600, confidence: 0.99 },
            { word: "honestly,", start: 10620, end: 11000, confidence: 0.97 },
            { word: "no", start: 11020, end: 11150, confidence: 0.99 },
            { word: "idea", start: 11170, end: 11400, confidence: 0.98 },
            { word: "what", start: 11420, end: 11550, confidence: 0.99 },
            { word: "I", start: 11570, end: 11620, confidence: 0.99 },
            { word: "was", start: 11640, end: 11750, confidence: 0.99 },
            { word: "doing.", start: 11770, end: 12000, confidence: 0.98 },
        ],
    },
    {
        id: 3,
        start: 12200,
        end: 18500,
        text: "But here's the thing nobody tells you about building a SaaS product. The technology is the easy part. The hard part is everything else — finding your first customer, pricing your product, dealing with churn.",
        words: [
            { word: "But", start: 12200, end: 12400, confidence: 0.99 },
            { word: "here's", start: 12420, end: 12700, confidence: 0.98 },
            { word: "the", start: 12720, end: 12850, confidence: 0.99 },
            { word: "thing", start: 12870, end: 13100, confidence: 0.99 },
            { word: "nobody", start: 13120, end: 13450, confidence: 0.98 },
            { word: "tells", start: 13470, end: 13700, confidence: 0.98 },
            { word: "you", start: 13720, end: 13850, confidence: 0.99 },
            { word: "about", start: 13870, end: 14100, confidence: 0.98 },
            { word: "building", start: 14120, end: 14450, confidence: 0.98 },
            { word: "a", start: 14470, end: 14550, confidence: 0.99 },
            { word: "SaaS", start: 14570, end: 14900, confidence: 0.95 },
            { word: "product.", start: 14920, end: 15300, confidence: 0.97 },
            { word: "The", start: 15500, end: 15650, confidence: 0.99 },
            { word: "technology", start: 15670, end: 16100, confidence: 0.97 },
            { word: "is", start: 16120, end: 16250, confidence: 0.99 },
            { word: "the", start: 16270, end: 16380, confidence: 0.99 },
            { word: "easy", start: 16400, end: 16650, confidence: 0.98 },
            { word: "part.", start: 16670, end: 16950, confidence: 0.98 },
            { word: "The", start: 17100, end: 17250, confidence: 0.99 },
            { word: "hard", start: 17270, end: 17500, confidence: 0.98 },
            { word: "part", start: 17520, end: 17700, confidence: 0.99 },
            { word: "is", start: 17720, end: 17850, confidence: 0.99 },
            { word: "everything", start: 17870, end: 18200, confidence: 0.97 },
            { word: "else.", start: 18220, end: 18500, confidence: 0.98 },
        ],
    },
];

export const mockPipeline: PipelineStage[] = [
    { id: 'ingest', label: 'Import', icon: '📥', status: 'complete', progress: 100 },
    { id: 'transcribe', label: 'Transcribe', icon: '🗣️', status: 'complete', progress: 100 },
    { id: 'analyze', label: 'AI Analysis', icon: '🧠', status: 'active', progress: 67, message: 'Finding viral moments...' },
    { id: 'clip', label: 'Generate', icon: '✂️', status: 'pending', progress: 0 },
    { id: 'caption', label: 'Captions', icon: '💬', status: 'pending', progress: 0 },
    { id: 'export', label: 'Export', icon: '📦', status: 'pending', progress: 0 },
];

export const defaultExportSettings: ExportSettings = {
    format: 'mp4',
    codec: 'h264',
    quality: 'high',
    aspectRatio: '9:16',
    platform: 'tiktok',
    captions: {
        enabled: true,
        style: 'dream-classic',
        fontSize: 42,
        fontFamily: 'Inter',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        position: 'bottom',
        animation: 'word-by-word',
    },
    outputDir: '~/Downloads/ClipForge',
};

export const defaultSystemStatus: SystemStatus = {
    ollamaRunning: true,
    ollamaModel: 'mistral:7b-q4',
    whisperReady: true,
    ffmpegReady: true,
    gpuDetected: true,
    gpuName: 'Apple M1 Pro',
};

// Helper functions
export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatMs(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    return formatDuration(totalSec);
}

export function formatFileSize(bytes: number): string {
    if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
    return `${bytes} B`;
}

export function getScoreClass(score: number): string {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        imported: 'Imported',
        transcribing: 'Transcribing',
        analyzing: 'Analyzing',
        clipping: 'Generating',
        ready: 'Ready',
        exporting: 'Exporting',
        complete: 'Complete',
    };
    return labels[status] || status;
}

export function getStatusClass(status: string): string {
    if (status === 'complete' || status === 'ready') return 'complete';
    if (status === 'transcribing' || status === 'analyzing' || status === 'clipping' || status === 'exporting') return 'processing';
    return 'ready';
}
