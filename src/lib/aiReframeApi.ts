import { invoke, isTauri } from '@tauri-apps/api/core';

export interface ProcessAiReframeArgs {
    inputPath: string;
    outputPath: string;
    outputWidth?: number;
    outputHeight?: number;
    detectionInterval?: number;
}

export interface AiReframeResult {
    status: string;
    outputPath: string;
    width: number;
    height: number;
    fps: number;
    processedFrames: number;
    detectionInterval: number;
}

export async function processAiReframeVideo(args: ProcessAiReframeArgs): Promise<AiReframeResult> {
    if (!isTauri()) {
        throw new Error('Desktop mode is required for AI reframe processing.');
    }

    return invoke<AiReframeResult>('process_ai_reframe_video', {
        payload: {
            inputPath: args.inputPath,
            outputPath: args.outputPath,
            outputWidth: args.outputWidth,
            outputHeight: args.outputHeight,
            detectionInterval: args.detectionInterval,
        },
    });
}
