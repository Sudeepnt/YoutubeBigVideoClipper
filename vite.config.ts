import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import ytdl from '@distube/ytdl-core';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

type CmdResult = {
  code: number;
  stdout: string;
  stderr: string;
};

type JsonObject = Record<string, unknown>;

type LinkImportRequest = {
  url?: string;
  quality?: number;
};

type GenerateClipRequest = {
  projectId?: string;
  sourcePath?: string;
  startMs?: number;
  endMs?: number;
  index?: number;
  hook?: string;
  reason?: string;
  score?: number;
  selected?: boolean;
};

function runCommand(command: string, args: string[], cwd?: string): Promise<CmdResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      resolve({ code: 1, stdout, stderr: `${stderr}\n${err.message}`.trim() });
    });

    child.on('close', (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

async function runYtDlpWithFallback(args: string[]): Promise<CmdResult> {
  const attempts = [
    args,
    ['--extractor-args', 'youtube:player_client=android', ...args],
    ['--extractor-args', 'youtube:player_client=tv,android', ...args],
    ['--cookies-from-browser', 'chrome', ...args],
    ['--cookies-from-browser', 'brave', ...args],
    ['--cookies-from-browser', 'safari', ...args],
  ];

  let lastResult: CmdResult | null = null;
  for (const attempt of attempts) {
    const result = await runCommand('yt-dlp', attempt);
    if (result.code === 0) {
      return result;
    }
    lastResult = result;
  }

  return lastResult ?? { code: 1, stdout: '', stderr: 'yt-dlp failed before returning output.' };
}

function parseJsonSafe<T = JsonObject>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function readBody<T = JsonObject>(req: NodeJS.ReadableStream): Promise<T | null> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return null;
  return parseJsonSafe<T>(Buffer.concat(chunks).toString('utf8'));
}

function sendJson(res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void }, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

function inferContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.mp4':
      return 'video/mp4';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

function sanitizeFilePart(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'video';
}

function isYouTubeUrl(value: string): boolean {
  return /(?:youtube\.com|youtu\.be)/i.test(value);
}

function sanitizeQuality(input?: number): number {
  const parsed = Number(input ?? 1080);
  if (!Number.isFinite(parsed)) return 1080;
  const rounded = Math.round(parsed);
  return Math.max(144, Math.min(1440, rounded));
}

function collectHeightsFromFormats(formats: Array<Record<string, unknown>> | undefined): number[] {
  const unique = new Set<number>();
  for (const format of formats ?? []) {
    const height = Number(format.height ?? 0);
    const vcodec = String(format.vcodec ?? 'none');
    if (Number.isFinite(height) && height > 0 && height <= 1440 && vcodec !== 'none') {
      unique.add(height);
    }
  }
  return Array.from(unique).sort((a, b) => a - b);
}

function buildQualityOptions(maxHeight: number): number[] {
  const safeMax = Math.max(0, Math.floor(maxHeight));
  if (safeMax >= 1080) return [480, 720, 1080];
  if (safeMax >= 720) return [360, 480, 720];
  if (safeMax >= 480) return [360, 480];
  if (safeMax >= 360) return [360];
  if (safeMax >= 240) return [240];
  return [144];
}

function formatSelectorForMaxHeight(maxHeight: number): string {
  return `bv*[height<=?${maxHeight}][ext=mp4]+ba[ext=m4a]/b[height<=?${maxHeight}][ext=mp4]/18/b[height<=?${maxHeight}]/best[height<=?${maxHeight}]/b/best`;
}

function resolvePublicFilePath(publicUrlPath: string): string {
  const normalized = publicUrlPath.replace(/^\/+/, '');
  return path.resolve(process.cwd(), 'public', normalized);
}

async function probeMedia(filePath: string): Promise<{ duration: number; fileSize: number; width: number; height: number }> {
  const probe = await runCommand('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration,size:stream=width,height',
    '-of',
    'json',
    filePath,
  ]);

  if (probe.code !== 0) {
    const stat = await fs.stat(filePath);
    return { duration: 0, fileSize: stat.size, width: 0, height: 0 };
  }

  const parsed = parseJsonSafe<{ format?: { duration?: string; size?: string }; streams?: Array<{ width?: number; height?: number }> }>(probe.stdout);
  const stream = (parsed?.streams ?? []).find((item) => Number(item?.width) > 0 && Number(item?.height) > 0);
  const duration = Number(parsed?.format?.duration ?? '0');
  const size = Number(parsed?.format?.size ?? '0');

  return {
    duration: Number.isFinite(duration) ? duration : 0,
    fileSize: Number.isFinite(size) && size > 0 ? size : (await fs.stat(filePath)).size,
    width: stream?.width ?? 0,
    height: stream?.height ?? 0,
  };
}

async function downloadWithYtdlCore(
  url: string,
  outputPath: string,
  maxHeight: number
): Promise<{ title: string; durationSec: number; filePath: string }> {
  const info = await ytdl.getInfo(url);
  const combinedMp4 = info.formats
    .filter((format) => format.hasAudio && format.hasVideo && format.container === 'mp4' && (format.height ?? 0) <= maxHeight)
    .sort((a, b) => (b.height ?? 0) - (a.height ?? 0) || (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];

  if (!combinedMp4?.itag) {
    throw new Error(`No progressive MP4 format found up to ${maxHeight}p for this YouTube video.`);
  }

  await new Promise<void>((resolve, reject) => {
    const stream = ytdl.downloadFromInfo(info, { quality: combinedMp4.itag });
    const writeStream = createWriteStream(outputPath);

    stream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', () => resolve());
    stream.pipe(writeStream);
  });

  return {
    title: info.videoDetails.title || path.basename(outputPath, path.extname(outputPath)),
    durationSec: Number(info.videoDetails.lengthSeconds || 0),
    filePath: outputPath,
  };
}

async function runFfmpegClip(sourcePath: string, outputPath: string, startMs: number, endMs: number): Promise<'copy' | 'reencode'> {
  const start = (Math.max(0, startMs) / 1000).toFixed(3);
  const durationSec = Math.max(0.2, (endMs - startMs) / 1000).toFixed(3);

  const copyAttempt = await runCommand('ffmpeg', [
    '-y',
    '-ss',
    start,
    '-i',
    sourcePath,
    '-t',
    durationSec,
    '-c',
    'copy',
    outputPath,
  ]);

  if (copyAttempt.code === 0) {
    return 'copy';
  }

  const reencodeAttempt = await runCommand('ffmpeg', [
    '-y',
    '-ss',
    start,
    '-i',
    sourcePath,
    '-t',
    durationSec,
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '23',
    '-c:a',
    'aac',
    '-movflags',
    '+faststart',
    outputPath,
  ]);

  if (reencodeAttempt.code !== 0) {
    throw new Error(`ffmpeg failed: ${reencodeAttempt.stderr.trim() || copyAttempt.stderr.trim() || 'Unknown error'}`);
  }

  return 'reencode';
}

function linkImportPlugin(): Plugin {
  return {
    name: 'clipforge-link-import',
    configureServer(server) {
      server.middlewares.use('/api/local-file', async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          next();
          return;
        }

        try {
          const requestUrl = new URL(req.url ?? '', 'http://localhost');
          const targetPath = requestUrl.searchParams.get('path')?.trim();
          if (!targetPath || !path.isAbsolute(targetPath)) {
            sendJson(res, 400, { error: 'Missing absolute path.' });
            return;
          }

          const stat = await fs.stat(targetPath);
          const contentType = inferContentType(targetPath);
          const range = req.headers.range;

          res.setHeader('accept-ranges', 'bytes');
          res.setHeader('cache-control', 'no-store');
          res.setHeader('content-type', contentType);

          if (!range) {
            res.statusCode = 200;
            res.setHeader('content-length', stat.size);
            if (req.method === 'HEAD') {
              res.end();
              return;
            }
            createReadStream(targetPath).pipe(res);
            return;
          }

          const match = /bytes=(\d*)-(\d*)/.exec(range);
          if (!match) {
            res.statusCode = 416;
            res.end();
            return;
          }

          const start = match[1] ? Number(match[1]) : 0;
          const end = match[2] ? Number(match[2]) : stat.size - 1;
          const safeStart = Math.max(0, Math.min(start, stat.size - 1));
          const safeEnd = Math.max(safeStart, Math.min(end, stat.size - 1));
          const chunkSize = safeEnd - safeStart + 1;

          res.statusCode = 206;
          res.setHeader('content-length', chunkSize);
          res.setHeader('content-range', `bytes ${safeStart}-${safeEnd}/${stat.size}`);

          if (req.method === 'HEAD') {
            res.end();
            return;
          }

          createReadStream(targetPath, { start: safeStart, end: safeEnd }).pipe(res);
        } catch (error) {
          sendJson(res, 404, { error: error instanceof Error ? error.message : String(error) });
        }
      });

      server.middlewares.use('/api/clear-project-clips', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const payload = (await readBody<{ projectId?: string }>(req)) ?? {};
          const projectId = payload.projectId?.trim();
          if (!projectId) {
            sendJson(res, 400, { error: 'Missing projectId' });
            return;
          }

          const folder = resolvePublicFilePath(`/generated-clips/${projectId}`);
          await fs.rm(folder, { recursive: true, force: true }).catch(() => undefined);
          sendJson(res, 200, { ok: true });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      });

      server.middlewares.use('/api/generate-clip', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const payload = (await readBody<GenerateClipRequest>(req)) ?? {};
          const projectId = payload.projectId?.trim();
          const sourcePath = payload.sourcePath?.trim();
          const startMs = Number(payload.startMs ?? 0);
          const endMs = Number(payload.endMs ?? 0);
          const index = Number(payload.index ?? 1);

          if (!projectId || !sourcePath) {
            sendJson(res, 400, { error: 'Missing projectId/sourcePath.' });
            return;
          }
          if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
            sendJson(res, 400, { error: 'Invalid start/end time range.' });
            return;
          }

          const ffmpegCheck = await runCommand('ffmpeg', ['-version']);
          if (ffmpegCheck.code !== 0) {
            sendJson(res, 500, { error: 'ffmpeg is not installed. Install it first (brew install ffmpeg).' });
            return;
          }

          let sourceDiskPath = sourcePath;
          if (sourcePath.startsWith('/')) {
            sourceDiskPath = resolvePublicFilePath(sourcePath);
          }
          if (sourcePath.startsWith('blob:') || sourcePath.startsWith('http://') || sourcePath.startsWith('https://')) {
            sendJson(res, 400, { error: 'Web clipping currently supports persisted local files only. Import from link first.' });
            return;
          }

          await fs.access(sourceDiskPath);

          const outFolder = resolvePublicFilePath(`/generated-clips/${projectId}`);
          await fs.mkdir(outFolder, { recursive: true });

          const outputFileName = `clip_${index}_${Math.floor(startMs / 1000)}_${Date.now()}.mp4`;
          const outputDiskPath = path.join(outFolder, outputFileName);
          const processingMode = await runFfmpegClip(sourceDiskPath, outputDiskPath, startMs, endMs);

          const responseClip = {
            id: randomUUID(),
            projectId,
            startMs,
            endMs,
            hook: payload.hook ?? `Clip ${index}`,
            reason: payload.reason ?? 'Web workflow clip',
            score: Number(payload.score ?? 7),
            selected: Boolean(payload.selected ?? true),
            videoPath: `/generated-clips/${projectId}/${outputFileName}`,
            aspectRatio: payload.aspectRatio ?? '9:16',
            createdAt: new Date().toISOString(),
            processingMode,
          };

          sendJson(res, 200, responseClip);
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      });

      server.middlewares.use('/api/link-info', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const payload = (await readBody<{ url?: string }>(req)) ?? {};
          const url = payload.url?.trim();
          if (!url) {
            sendJson(res, 400, { error: 'Missing URL' });
            return;
          }

          let validatedUrl: URL;
          try {
            validatedUrl = new URL(url);
          } catch {
            sendJson(res, 400, { error: 'Invalid URL' });
            return;
          }

          if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
            sendJson(res, 400, { error: 'Only http/https URLs are supported' });
            return;
          }

          const checkYtDlp = await runCommand('yt-dlp', ['--version']);
          const ytDlpAvailable = checkYtDlp.code === 0;

          if (ytDlpAvailable) {
            const metadataResult = await runYtDlpWithFallback(['--no-playlist', '--dump-single-json', '--no-warnings', url]);
            if (metadataResult.code !== 0) {
              sendJson(res, 500, { error: metadataResult.stderr.trim() || 'Unable to inspect link metadata.' });
              return;
            }

            const metadata = parseJsonSafe<{
              title?: string;
              duration?: number;
              formats?: Array<Record<string, unknown>>;
            }>(metadataResult.stdout);

            const heights = collectHeightsFromFormats(metadata?.formats);
            const maxHeight = heights.length ? heights[heights.length - 1] : 0;
            const qualityOptions = buildQualityOptions(maxHeight);

            sendJson(res, 200, {
              title: metadata?.title,
              duration: Number(metadata?.duration ?? 0),
              maxHeight,
              qualityOptions,
            });
            return;
          }

          if (isYouTubeUrl(url)) {
            const info = await ytdl.getInfo(url);
            const heights = Array.from(new Set(info.formats.map((format) => Number(format.height ?? 0))))
              .filter((height) => Number.isFinite(height) && height > 0 && height <= 1440)
              .sort((a, b) => a - b);
            const maxHeight = heights.length ? heights[heights.length - 1] : 0;
            const qualityOptions = buildQualityOptions(maxHeight);

            sendJson(res, 200, {
              title: info.videoDetails.title,
              duration: Number(info.videoDetails.lengthSeconds || 0),
              maxHeight,
              qualityOptions,
            });
            return;
          }

          sendJson(res, 500, { error: 'yt-dlp is required to inspect non-YouTube links.' });
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      });

      server.middlewares.use('/api/link-import', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        try {
          const payload = (await readBody<LinkImportRequest>(req)) ?? {};
          const url = payload.url?.trim();

          if (!url) {
            sendJson(res, 400, { error: 'Missing URL' });
            return;
          }

          let validatedUrl: URL;
          try {
            validatedUrl = new URL(url);
          } catch {
            sendJson(res, 400, { error: 'Invalid URL' });
            return;
          }

          if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
            sendJson(res, 400, { error: 'Only http/https URLs are supported' });
            return;
          }

          const requestedHeight = sanitizeQuality(payload.quality);
          const importId = randomUUID();
          const importsDir = resolvePublicFilePath('/imports');
          await fs.mkdir(importsDir, { recursive: true });

          const isYouTube = isYouTubeUrl(url);
          const checkYtDlp = await runCommand('yt-dlp', ['--version']);
          const ytDlpAvailable = checkYtDlp.code === 0;

          let metadata: { title?: string; duration?: number; filesize?: number } = {};
          let downloadedPath = '';

          if (ytDlpAvailable) {
            const metadataResult = await runYtDlpWithFallback(['--no-playlist', '--dump-single-json', '--no-warnings', url]);
            metadata = parseJsonSafe<{ title?: string; duration?: number; filesize?: number }>(metadataResult.stdout) ?? {};

            const fileStem = sanitizeFilePart(`${metadata.title ?? 'video'}_${importId.slice(0, 8)}`);
            const outputTemplate = path.join(importsDir, `${fileStem}.%(ext)s`);

            const firstPassArgs = [
              '--no-playlist',
              '--restrict-filenames',
              '--no-warnings',
              '--no-part',
              '--retries',
              '10',
              '--fragment-retries',
              '10',
              '-f',
              formatSelectorForMaxHeight(requestedHeight),
              '--merge-output-format',
              'mp4',
              '-o',
              outputTemplate,
              '--print',
              'after_move:filepath',
              url,
            ];

            const downloadResult = await runYtDlpWithFallback(firstPassArgs);

            if (downloadResult.code !== 0) {
              sendJson(res, 500, {
                error: `yt-dlp failed: ${downloadResult.stderr.trim() || downloadResult.stdout.trim() || 'Unknown error'}`,
              });
              return;
            }

            const outputLines = downloadResult.stdout
              .split(/\r?\n/g)
              .map((line) => line.trim())
              .filter(Boolean);
            const downloadedPathRaw = outputLines[outputLines.length - 1];

            if (!downloadedPathRaw) {
              sendJson(res, 500, { error: 'Unable to determine downloaded file path from yt-dlp output.' });
              return;
            }

            downloadedPath = path.isAbsolute(downloadedPathRaw)
              ? downloadedPathRaw
              : path.resolve(process.cwd(), downloadedPathRaw);
          } else if (isYouTube) {
            const fileStem = sanitizeFilePart(`youtube_${importId.slice(0, 8)}`);
            const outputPath = path.join(importsDir, `${fileStem}.mp4`);
            const fallback = await downloadWithYtdlCore(url, outputPath, requestedHeight);
            downloadedPath = fallback.filePath;
            metadata = { title: fallback.title, duration: fallback.durationSec };
          } else {
            sendJson(res, 500, {
              error: 'yt-dlp is not installed and this URL is not a YouTube link. Install yt-dlp for non-YouTube links.',
            });
            return;
          }

          await fs.access(downloadedPath);

          const probe = await probeMedia(downloadedPath);
          const fileName = path.basename(downloadedPath);

          const project = {
            id: importId,
            name: metadata.title || fileName.replace(path.extname(fileName), ''),
            sourceType: 'link',
            sourceUrl: url,
            sourcePath: `/imports/${fileName}`,
            nativeSourcePath: downloadedPath,
            fileName,
            fileSize: probe.fileSize || metadata.filesize || 0,
            duration: probe.duration || metadata.duration || 0,
            resolutionWidth: probe.width,
            resolutionHeight: probe.height,
            createdAt: new Date().toISOString(),
            status: 'imported',
            thumbnailPath: null,
            clipCount: 0,
            downloadQuality: requestedHeight,
          };

          sendJson(res, 200, project);
        } catch (error) {
          sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}

export default defineConfig(async () => ({
  plugins: [react(), linkImportPlugin()],

  clearScreen: false,
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
}));
