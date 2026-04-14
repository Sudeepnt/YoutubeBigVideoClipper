use chrono::{SecondsFormat, Utc};
use rusqlite::{params, Connection, OptionalExtension, Row};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::env;
use std::fs::File;
use std::fs;
use std::io::{Read, Seek, SeekFrom};
use std::net::TcpListener;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::sync::{Mutex, OnceLock};
use std::thread;
use tauri::Manager;
use tiny_http::{Header, Method, Response, Server, StatusCode};
use url::form_urlencoded;
use uuid::Uuid;

const MEDIA_SERVER_PORT: u16 = 14321;
static PYTHON_HELPER_LOCK: OnceLock<Mutex<()>> = OnceLock::new();

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredProject {
    id: String,
    name: String,
    source_type: String,
    source_url: Option<String>,
    source_path: String,
    file_name: String,
    file_size: i64,
    duration: f64,
    resolution_width: i32,
    resolution_height: i32,
    created_at: String,
    status: String,
    thumbnail_path: Option<String>,
    clip_count: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredClip {
    id: String,
    project_id: String,
    start_ms: i64,
    end_ms: i64,
    hook: String,
    reason: String,
    score: i32,
    selected: bool,
    video_path: String,
    thumbnail_path: Option<String>,
    aspect_ratio: Option<String>,
    created_at: String,
    processing_mode: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredSource {
    id: String,
    project_id: String,
    source_type: String,
    mime_type: Option<String>,
    file_name: Option<String>,
    file_path: Option<String>,
    source_url: Option<String>,
    metadata_json: Option<String>,
    created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredWorkflow {
    id: String,
    project_id: String,
    workflow_type: String,
    status: String,
    input_json: Option<String>,
    output_json: Option<String>,
    error: Option<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredWorkflowStep {
    id: String,
    workflow_id: String,
    step_key: String,
    step_label: String,
    step_order: i64,
    status: String,
    started_at: Option<String>,
    ended_at: Option<String>,
    detail_json: Option<String>,
    error: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredRender {
    id: String,
    project_id: String,
    workflow_id: Option<String>,
    render_type: String,
    file_path: String,
    duration_sec: f64,
    resolution_width: i32,
    resolution_height: i32,
    status: String,
    created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredCaption {
    id: String,
    project_id: String,
    clip_id: Option<String>,
    style: Option<String>,
    language: String,
    srt_content: Option<String>,
    vtt_content: Option<String>,
    created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct TranscriptWordRecord {
    word: String,
    start: i64,
    end: i64,
    confidence: f64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredProjectTranscript {
    id: String,
    project_id: String,
    model_size: String,
    status: String,
    source_start_ms: Option<i64>,
    source_end_ms: Option<i64>,
    words: Vec<TranscriptWordRecord>,
    language: Option<String>,
    error: Option<String>,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct DirectTranscriptResult {
    model_size: String,
    language: Option<String>,
    words: Vec<TranscriptWordRecord>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredNotificationTarget {
    id: String,
    channel: String,
    target: String,
    is_enabled: bool,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LinkInfoPayload {
    title: Option<String>,
    duration: f64,
    max_height: i32,
    quality_options: Vec<i32>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredNotification {
    id: String,
    project_id: Option<String>,
    channel: String,
    target: String,
    message: String,
    status: String,
    created_at: String,
    sent_at: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StoredSetting {
    key: String,
    value: String,
    updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PreparedProcessingSource {
    source_path: String,
    duration_sec: f64,
    thumbnail_path: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UploadProjectPayload {
    name: String,
    file_name: String,
    file_size: i64,
    duration: f64,
    resolution_width: i32,
    resolution_height: i32,
    source_path: Option<String>,
    source_bytes: Option<Vec<u8>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct StartAgentWorkflowPayload {
    project_id: String,
    prompt: String,
    target_platform: Option<String>,
    aspect_ratio: Option<String>,
    hooks_enabled: Option<bool>,
    captions_enabled: Option<bool>,
    source_urls: Option<Vec<String>>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct WorkflowRunResult {
    workflow: StoredWorkflow,
    steps: Vec<StoredWorkflowStep>,
    renders: Vec<StoredRender>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpsertNotificationTargetPayload {
    channel: String,
    target: String,
    is_enabled: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct QueueNotificationPayload {
    project_id: Option<String>,
    channel: String,
    message: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct UpsertCaptionPayload {
    project_id: String,
    clip_id: Option<String>,
    style: Option<String>,
    language: String,
    srt_content: Option<String>,
    vtt_content: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TranscribeSourcePayload {
    project_id: String,
    video_path: Option<String>,
    model_size: Option<String>,
    start_ms: Option<i64>,
    end_ms: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TranscribeVideoPayload {
    video_path: String,
    model_size: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiReframePayload {
    input_path: String,
    output_path: String,
    output_width: Option<u32>,
    output_height: Option<u32>,
    detection_interval: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AiReframeResult {
    status: String,
    output_path: String,
    width: i32,
    height: i32,
    fps: f64,
    processed_frames: u64,
    detection_interval: u32,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TranscriptSidecarPayload {
    model_size: String,
    language: Option<String>,
    word_count: usize,
    words: Vec<TranscriptWordRecord>,
}

#[derive(Debug)]
struct MediaProbe {
    duration: f64,
    width: i32,
    height: i32,
    file_size: i64,
}

fn now_iso() -> String {
    Utc::now().to_rfc3339_opts(SecondsFormat::Millis, true)
}

fn sanitize_file_part(name: &str) -> String {
    let mut out = String::with_capacity(name.len());
    for ch in name.chars() {
        if ch.is_ascii_alphanumeric() || ch == '-' || ch == '_' || ch == '.' {
            out.push(ch);
        } else {
            out.push('_');
        }
    }
    out.trim_matches('_').to_string()
}

fn strip_extension(file_name: &str) -> String {
    Path::new(file_name)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or(file_name)
        .to_string()
}

fn candidate_binary_paths(bin: &str) -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Some(path_var) = env::var_os("PATH") {
        candidates.extend(env::split_paths(&path_var).map(|dir| dir.join(bin)));
    }

    for dir in ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"] {
        candidates.push(PathBuf::from(dir).join(bin));
    }

    if let Some(home) = env::var_os("HOME").map(PathBuf::from) {
        for version in ["3.9", "3.10", "3.11", "3.12", "3.13"] {
            candidates.push(home.join("Library").join("Python").join(version).join("bin").join(bin));
        }
        candidates.push(home.join(".local").join("bin").join(bin));
        candidates.push(home.join(".cargo").join("bin").join(bin));
    }

    candidates
}

fn resolve_binary_path(bin: &str) -> Option<PathBuf> {
    candidate_binary_paths(bin)
        .into_iter()
        .find(|path| path.is_file())
}

fn command_exists(bin: &str) -> bool {
    resolve_binary_path(bin).is_some()
}

fn sanitize_quality(input: Option<i32>) -> i32 {
    let parsed = input.unwrap_or(1080);
    let safe = parsed.clamp(144, 1440);
    if safe == 0 { 1080 } else { safe }
}

fn collect_heights_from_formats(formats: &[Value]) -> Vec<i32> {
    let mut heights: Vec<i32> = Vec::new();

    for format in formats {
        let Some(height) = format.get("height").and_then(Value::as_i64) else {
            continue;
        };
        let vcodec = format
            .get("vcodec")
            .and_then(Value::as_str)
            .unwrap_or("none");
        let height = height as i32;

        if height > 0 && height <= 1440 && vcodec != "none" && !heights.contains(&height) {
            heights.push(height);
        }
    }

    heights.sort_unstable();
    heights
}

fn build_quality_options(max_height: i32) -> Vec<i32> {
    let safe_max = max_height.max(0);
    if safe_max >= 1080 {
        vec![480, 720, 1080]
    } else if safe_max >= 720 {
        vec![360, 480, 720]
    } else if safe_max >= 480 {
        vec![360, 480]
    } else if safe_max >= 360 {
        vec![360]
    } else if safe_max >= 240 {
        vec![240]
    } else {
        vec![144]
    }
}

fn format_selector_for_max_height(max_height: i32) -> String {
    format!(
        "bv*[height<=?{max_height}][ext=mp4]+ba[ext=m4a]/b[height<=?{max_height}][ext=mp4]/18/b[height<=?{max_height}]/best[height<=?{max_height}]/b/best"
    )
}

fn yt_dlp_error_message(output: &Output) -> String {
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    if !stderr.is_empty() {
        return stderr;
    }

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if !stdout.is_empty() {
        return stdout;
    }

    "Unknown yt-dlp error".to_string()
}

fn run_yt_dlp_attempt(args: &[String]) -> Result<Output, String> {
    let yt_dlp = resolve_binary_path("yt-dlp")
        .ok_or_else(|| "yt-dlp is not installed or not in a discoverable location.".to_string())?;

    Command::new(yt_dlp)
        .args(args)
        .output()
        .map_err(|e| format!("Failed to run yt-dlp: {e}"))
}

fn run_yt_dlp_with_fallback(base_args: &[String]) -> Result<Output, String> {
    let attempts: [Vec<String>; 6] = [
        base_args.to_vec(),
        {
            let mut args = vec![
                "--extractor-args".to_string(),
                "youtube:player_client=android".to_string(),
            ];
            args.extend(base_args.iter().cloned());
            args
        },
        {
            let mut args = vec![
                "--extractor-args".to_string(),
                "youtube:player_client=tv,android".to_string(),
            ];
            args.extend(base_args.iter().cloned());
            args
        },
        {
            let mut args = vec![
                "--cookies-from-browser".to_string(),
                "chrome".to_string(),
            ];
            args.extend(base_args.iter().cloned());
            args
        },
        {
            let mut args = vec![
                "--cookies-from-browser".to_string(),
                "brave".to_string(),
            ];
            args.extend(base_args.iter().cloned());
            args
        },
        {
            let mut args = vec![
                "--cookies-from-browser".to_string(),
                "safari".to_string(),
            ];
            args.extend(base_args.iter().cloned());
            args
        },
    ];
    let mut last_error = None;

    for args in attempts {
        let output = run_yt_dlp_attempt(&args)?;
        if output.status.success() {
            return Ok(output);
        }

        last_error = Some(yt_dlp_error_message(&output));
    }

    Err(last_error.unwrap_or_else(|| "yt-dlp failed before returning output.".to_string()))
}

fn extract_link_metadata(url: &str) -> Result<Value, String> {
    let args = vec![
        "--no-playlist".to_string(),
        "--dump-single-json".to_string(),
        "--no-warnings".to_string(),
        url.to_string(),
    ];
    let output = run_yt_dlp_with_fallback(&args)?;
    serde_json::from_slice::<Value>(&output.stdout)
        .map_err(|e| format!("Failed to parse yt-dlp metadata: {e}"))
}

fn app_library_root(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?;
    let root = app_data.join("clipforge-library");
    fs::create_dir_all(root.join("projects"))
        .map_err(|e| format!("Failed to create library folder: {e}"))?;
    Ok(root)
}

fn project_dir(app: &tauri::AppHandle, project_id: &str) -> Result<PathBuf, String> {
    Ok(app_library_root(app)?.join("projects").join(project_id))
}

fn db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(app_library_root(app)?.join("clipforge.sqlite3"))
}

fn column_exists(conn: &Connection, table: &str, column: &str) -> Result<bool, String> {
    let mut stmt = conn
        .prepare(&format!("PRAGMA table_info({table})"))
        .map_err(|e| format!("Failed to read table info for {table}: {e}"))?;
    let rows = stmt
        .query_map([], |row| row.get::<_, String>(1))
        .map_err(|e| format!("Failed to map table info for {table}: {e}"))?;

    for row in rows {
        let name = row.map_err(|e| format!("Failed to parse table info row: {e}"))?;
        if name == column {
            return Ok(true);
        }
    }
    Ok(false)
}

fn ensure_column(conn: &Connection, table: &str, column: &str, definition: &str) -> Result<(), String> {
    if column_exists(conn, table, column)? {
        return Ok(());
    }
    conn.execute(
        &format!("ALTER TABLE {table} ADD COLUMN {column} {definition}"),
        [],
    )
    .map_err(|e| format!("Failed to add column {table}.{column}: {e}"))?;
    Ok(())
}

fn init_schema_and_migrations(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        r#"
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            source_type TEXT NOT NULL,
            source_url TEXT,
            source_path TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_size INTEGER NOT NULL DEFAULT 0,
            duration REAL NOT NULL DEFAULT 0,
            resolution_width INTEGER NOT NULL DEFAULT 0,
            resolution_height INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'imported',
            thumbnail_path TEXT
        );

        CREATE TABLE IF NOT EXISTS clips (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            start_ms INTEGER NOT NULL,
            end_ms INTEGER NOT NULL,
            hook TEXT NOT NULL,
            reason TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0,
            selected INTEGER NOT NULL DEFAULT 0,
            video_path TEXT NOT NULL,
            created_at TEXT NOT NULL,
            processing_mode TEXT NOT NULL DEFAULT 'copy',
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
        );
        "#,
    )
    .map_err(|e| format!("Failed to initialize base schema: {e}"))?;

    ensure_column(conn, "projects", "updated_at", "TEXT")?;
    ensure_column(conn, "projects", "deleted_at", "TEXT")?;
    ensure_column(conn, "clips", "updated_at", "TEXT")?;
    ensure_column(conn, "clips", "workflow_id", "TEXT")?;
    ensure_column(conn, "clips", "thumbnail_path", "TEXT")?;
    ensure_column(conn, "clips", "aspect_ratio", "TEXT")?;

    conn.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS sources (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            source_type TEXT NOT NULL,
            mime_type TEXT,
            file_name TEXT,
            file_path TEXT,
            source_url TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS workflows (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            workflow_type TEXT NOT NULL,
            status TEXT NOT NULL,
            input_json TEXT,
            output_json TEXT,
            error TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS workflow_steps (
            id TEXT PRIMARY KEY,
            workflow_id TEXT NOT NULL,
            step_key TEXT NOT NULL,
            step_label TEXT NOT NULL,
            step_order INTEGER NOT NULL,
            status TEXT NOT NULL,
            started_at TEXT,
            ended_at TEXT,
            detail_json TEXT,
            error TEXT,
            FOREIGN KEY(workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS assets (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            asset_type TEXT NOT NULL,
            role TEXT,
            file_path TEXT,
            source_url TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS renders (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            workflow_id TEXT,
            render_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            duration_sec REAL NOT NULL DEFAULT 0,
            resolution_width INTEGER NOT NULL DEFAULT 0,
            resolution_height INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY(workflow_id) REFERENCES workflows(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS captions (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            clip_id TEXT,
            style TEXT,
            language TEXT NOT NULL DEFAULT 'en',
            srt_content TEXT,
            vtt_content TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY(clip_id) REFERENCES clips(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS project_transcripts (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL UNIQUE,
            model_size TEXT NOT NULL DEFAULT 'medium',
            status TEXT NOT NULL DEFAULT 'processing',
            source_start_ms INTEGER,
            source_end_ms INTEGER,
            words_json TEXT,
            language TEXT,
            error TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS notification_targets (
            id TEXT PRIMARY KEY,
            channel TEXT NOT NULL,
            target TEXT NOT NULL,
            is_enabled INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            channel TEXT NOT NULL,
            target TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            sent_at TEXT,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS app_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_clips_project_id ON clips(project_id);
        CREATE INDEX IF NOT EXISTS idx_sources_project_id ON sources(project_id);
        CREATE INDEX IF NOT EXISTS idx_workflows_project_id ON workflows(project_id);
        CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_assets_project_id ON assets(project_id);
        CREATE INDEX IF NOT EXISTS idx_renders_project_id ON renders(project_id);
        CREATE INDEX IF NOT EXISTS idx_renders_workflow_id ON renders(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_captions_project_id ON captions(project_id);
        CREATE INDEX IF NOT EXISTS idx_project_transcripts_project_id ON project_transcripts(project_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);
        "#,
    )
    .map_err(|e| format!("Failed to initialize extended schema: {e}"))?;

    ensure_column(conn, "project_transcripts", "source_start_ms", "INTEGER")?;
    ensure_column(conn, "project_transcripts", "source_end_ms", "INTEGER")?;

    conn.execute("PRAGMA user_version = 4", [])
        .map_err(|e| format!("Failed to set DB user_version: {e}"))?;
    Ok(())
}

fn open_db(app: &tauri::AppHandle) -> Result<Connection, String> {
    let conn = Connection::open(db_path(app)?).map_err(|e| format!("Failed to open DB: {e}"))?;
    init_schema_and_migrations(&conn)?;
    Ok(conn)
}

fn media_content_type(path: &Path) -> &'static str {
    match path
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.to_ascii_lowercase())
        .as_deref()
    {
        Some("mp4") | Some("m4v") => "video/mp4",
        Some("mov") => "video/quicktime",
        Some("webm") => "video/webm",
        Some("mkv") => "video/x-matroska",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("png") => "image/png",
        Some("gif") => "image/gif",
        Some("wav") => "audio/wav",
        Some("mp3") => "audio/mpeg",
        Some("aac") | Some("m4a") => "audio/aac",
        _ => "application/octet-stream",
    }
}

fn parse_range_header(value: &str, total_size: u64) -> Option<(u64, u64)> {
    if !value.starts_with("bytes=") || total_size == 0 {
        return None;
    }

    let (start_raw, end_raw) = value.trim_start_matches("bytes=").split_once('-')?;
    if start_raw.is_empty() {
        let suffix_len = end_raw.parse::<u64>().ok()?;
        if suffix_len == 0 {
            return None;
        }
        let start = total_size.saturating_sub(suffix_len);
        return Some((start, total_size.saturating_sub(1)));
    }

    let start = start_raw.parse::<u64>().ok()?;
    let end = if end_raw.is_empty() {
        total_size.saturating_sub(1)
    } else {
        end_raw.parse::<u64>().ok()?.min(total_size.saturating_sub(1))
    };

    if start > end || start >= total_size {
        return None;
    }

    Some((start, end))
}

fn text_header(name: &'static [u8], value: &str) -> Option<Header> {
    Header::from_bytes(name, value.as_bytes()).ok()
}

fn respond_with_status(request: tiny_http::Request, status: StatusCode, body: &str) {
    let mut response = Response::from_string(body.to_string()).with_status_code(status);
    if let Some(header) = text_header(b"Content-Type", "text/plain; charset=utf-8") {
        response = response.with_header(header);
    }
    let _ = request.respond(response);
}

fn handle_media_request(request: tiny_http::Request) {
    if request.method() != &Method::Get && request.method() != &Method::Head {
        respond_with_status(request, StatusCode(405), "Method not allowed");
        return;
    }

    let request_url = request.url().to_string();
    let (path_part, query_part) = request_url
        .split_once('?')
        .unwrap_or((request_url.as_str(), ""));

    if path_part != "/media" {
        respond_with_status(request, StatusCode(404), "Not found");
        return;
    }

    let media_path = form_urlencoded::parse(query_part.as_bytes())
        .find_map(|(key, value)| (key == "path").then(|| value.into_owned()))
        .filter(|value| !value.is_empty());

    let Some(media_path) = media_path else {
        respond_with_status(request, StatusCode(400), "Missing media path");
        return;
    };

    let file_path = PathBuf::from(media_path);
    if !file_path.exists() || !file_path.is_file() {
        respond_with_status(request, StatusCode(404), "Media file not found");
        return;
    }

    let metadata = match fs::metadata(&file_path) {
        Ok(metadata) => metadata,
        Err(error) => {
            respond_with_status(
                request,
                StatusCode(500),
                &format!("Failed to read media metadata: {error}"),
            );
            return;
        }
    };

    let total_size = metadata.len();
    let content_type = media_content_type(&file_path);
    let range_header = request
        .headers()
        .iter()
        .find(|header| header.field.equiv("Range"))
        .map(|header| header.value.as_str().to_string());

    if let Some(range_header) = range_header {
        let Some((start, end)) = parse_range_header(&range_header, total_size) else {
            respond_with_status(request, StatusCode(416), "Invalid range");
            return;
        };

        let read_len = end.saturating_sub(start).saturating_add(1);
        let mut file = match File::open(&file_path) {
            Ok(file) => file,
            Err(error) => {
                respond_with_status(
                    request,
                    StatusCode(500),
                    &format!("Failed to open media file: {error}"),
                );
                return;
            }
        };

        if let Err(error) = file.seek(SeekFrom::Start(start)) {
            respond_with_status(
                request,
                StatusCode(500),
                &format!("Failed to seek media file: {error}"),
            );
            return;
        }

        let mut buffer = vec![0_u8; read_len as usize];
        if let Err(error) = file.read_exact(&mut buffer) {
            respond_with_status(
                request,
                StatusCode(500),
                &format!("Failed to read media file range: {error}"),
            );
            return;
        }

        let mut response = Response::from_data(buffer).with_status_code(StatusCode(206));
        if let Some(header) = text_header(b"Content-Type", content_type) {
            response = response.with_header(header);
        }
        if let Some(header) = text_header(b"Accept-Ranges", "bytes") {
            response = response.with_header(header);
        }
        if let Some(header) = text_header(b"Content-Length", &read_len.to_string()) {
            response = response.with_header(header);
        }
        if let Some(header) = text_header(
            b"Content-Range",
            &format!("bytes {start}-{end}/{total_size}"),
        ) {
            response = response.with_header(header);
        }

        let _ = request.respond(response);
        return;
    }

    let file = match File::open(&file_path) {
        Ok(file) => file,
        Err(error) => {
            respond_with_status(
                request,
                StatusCode(500),
                &format!("Failed to open media file: {error}"),
            );
            return;
        }
    };

    let mut response = Response::from_file(file);
    if let Some(header) = text_header(b"Content-Type", content_type) {
        response = response.with_header(header);
    }
    if let Some(header) = text_header(b"Accept-Ranges", "bytes") {
        response = response.with_header(header);
    }
    if let Some(header) = text_header(b"Content-Length", &total_size.to_string()) {
        response = response.with_header(header);
    }

    let _ = request.respond(response);
}

fn start_media_server() {
    thread::spawn(|| {
        let listener = match TcpListener::bind(("127.0.0.1", MEDIA_SERVER_PORT)) {
            Ok(listener) => listener,
            Err(error) => {
                eprintln!("ClipForge media server bind skipped: {error}");
                return;
            }
        };

        let server = match Server::from_listener(listener, None) {
            Ok(server) => server,
            Err(error) => {
                eprintln!("ClipForge media server startup failed: {error}");
                return;
            }
        };

        for request in server.incoming_requests() {
            handle_media_request(request);
        }
    });
}

fn map_project_row(row: &Row<'_>) -> rusqlite::Result<StoredProject> {
    Ok(StoredProject {
        id: row.get("id")?,
        name: row.get("name")?,
        source_type: row.get("source_type")?,
        source_url: row.get("source_url")?,
        source_path: row.get("source_path")?,
        file_name: row.get("file_name")?,
        file_size: row.get("file_size")?,
        duration: row.get("duration")?,
        resolution_width: row.get("resolution_width")?,
        resolution_height: row.get("resolution_height")?,
        created_at: row.get("created_at")?,
        status: row.get("status")?,
        thumbnail_path: row.get("thumbnail_path")?,
        clip_count: row.get("clip_count")?,
    })
}

fn map_clip_row(row: &Row<'_>) -> rusqlite::Result<StoredClip> {
    let selected_int: i64 = row.get("selected")?;
    Ok(StoredClip {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        start_ms: row.get("start_ms")?,
        end_ms: row.get("end_ms")?,
        hook: row.get("hook")?,
        reason: row.get("reason")?,
        score: row.get("score")?,
        selected: selected_int != 0,
        video_path: row.get("video_path")?,
        thumbnail_path: row.get("thumbnail_path")?,
        aspect_ratio: row.get("aspect_ratio")?,
        created_at: row.get("created_at")?,
        processing_mode: row.get("processing_mode")?,
    })
}

fn map_source_row(row: &Row<'_>) -> rusqlite::Result<StoredSource> {
    Ok(StoredSource {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        source_type: row.get("source_type")?,
        mime_type: row.get("mime_type")?,
        file_name: row.get("file_name")?,
        file_path: row.get("file_path")?,
        source_url: row.get("source_url")?,
        metadata_json: row.get("metadata_json")?,
        created_at: row.get("created_at")?,
    })
}

fn map_workflow_row(row: &Row<'_>) -> rusqlite::Result<StoredWorkflow> {
    Ok(StoredWorkflow {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        workflow_type: row.get("workflow_type")?,
        status: row.get("status")?,
        input_json: row.get("input_json")?,
        output_json: row.get("output_json")?,
        error: row.get("error")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

fn map_workflow_step_row(row: &Row<'_>) -> rusqlite::Result<StoredWorkflowStep> {
    Ok(StoredWorkflowStep {
        id: row.get("id")?,
        workflow_id: row.get("workflow_id")?,
        step_key: row.get("step_key")?,
        step_label: row.get("step_label")?,
        step_order: row.get("step_order")?,
        status: row.get("status")?,
        started_at: row.get("started_at")?,
        ended_at: row.get("ended_at")?,
        detail_json: row.get("detail_json")?,
        error: row.get("error")?,
    })
}

fn map_render_row(row: &Row<'_>) -> rusqlite::Result<StoredRender> {
    Ok(StoredRender {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        workflow_id: row.get("workflow_id")?,
        render_type: row.get("render_type")?,
        file_path: row.get("file_path")?,
        duration_sec: row.get("duration_sec")?,
        resolution_width: row.get("resolution_width")?,
        resolution_height: row.get("resolution_height")?,
        status: row.get("status")?,
        created_at: row.get("created_at")?,
    })
}

fn map_caption_row(row: &Row<'_>) -> rusqlite::Result<StoredCaption> {
    Ok(StoredCaption {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        clip_id: row.get("clip_id")?,
        style: row.get("style")?,
        language: row.get("language")?,
        srt_content: row.get("srt_content")?,
        vtt_content: row.get("vtt_content")?,
        created_at: row.get("created_at")?,
    })
}

fn map_project_transcript_row(row: &Row<'_>) -> rusqlite::Result<StoredProjectTranscript> {
    let words_json: Option<String> = row.get("words_json")?;
    let words = words_json
        .as_deref()
        .map(|raw| serde_json::from_str::<Vec<TranscriptWordRecord>>(raw).unwrap_or_default())
        .unwrap_or_default();

    Ok(StoredProjectTranscript {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        model_size: row.get("model_size")?,
        status: row.get("status")?,
        source_start_ms: row.get("source_start_ms")?,
        source_end_ms: row.get("source_end_ms")?,
        words,
        language: row.get("language")?,
        error: row.get("error")?,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

fn map_notification_target_row(row: &Row<'_>) -> rusqlite::Result<StoredNotificationTarget> {
    let enabled: i64 = row.get("is_enabled")?;
    Ok(StoredNotificationTarget {
        id: row.get("id")?,
        channel: row.get("channel")?,
        target: row.get("target")?,
        is_enabled: enabled != 0,
        created_at: row.get("created_at")?,
        updated_at: row.get("updated_at")?,
    })
}

fn map_notification_row(row: &Row<'_>) -> rusqlite::Result<StoredNotification> {
    Ok(StoredNotification {
        id: row.get("id")?,
        project_id: row.get("project_id")?,
        channel: row.get("channel")?,
        target: row.get("target")?,
        message: row.get("message")?,
        status: row.get("status")?,
        created_at: row.get("created_at")?,
        sent_at: row.get("sent_at")?,
    })
}

fn get_project_by_id(conn: &Connection, project_id: &str) -> Result<StoredProject, String> {
    conn.query_row(
        r#"
        SELECT
            p.id,
            p.name,
            p.source_type,
            p.source_url,
            p.source_path,
            p.file_name,
            p.file_size,
            p.duration,
            p.resolution_width,
            p.resolution_height,
            p.created_at,
            p.status,
            p.thumbnail_path,
            COALESCE(COUNT(c.id), 0) AS clip_count
        FROM projects p
        LEFT JOIN clips c ON c.project_id = p.id
        WHERE p.id = ?1
        GROUP BY
            p.id, p.name, p.source_type, p.source_url, p.source_path, p.file_name,
            p.file_size, p.duration, p.resolution_width, p.resolution_height,
            p.created_at, p.status, p.thumbnail_path
        "#,
        [project_id],
        map_project_row,
    )
    .map_err(|e| format!("Project not found: {e}"))
}

fn get_clip_by_id(conn: &Connection, clip_id: &str) -> Result<StoredClip, String> {
    let mut clip = conn.query_row(
        r#"
        SELECT
            id, project_id, start_ms, end_ms, hook, reason, score,
            selected, video_path, thumbnail_path, aspect_ratio, created_at, processing_mode
        FROM clips
        WHERE id = ?1
        "#,
        [clip_id],
        map_clip_row,
    )
    .map_err(|e| format!("Clip not found: {e}"))?;

    hydrate_clip_aspect_ratio(conn, &mut clip);
    Ok(clip)
}

fn get_workflow_by_id(conn: &Connection, workflow_id: &str) -> Result<StoredWorkflow, String> {
    conn.query_row(
        r#"
        SELECT
            id, project_id, workflow_type, status, input_json, output_json, error, created_at, updated_at
        FROM workflows
        WHERE id = ?1
        "#,
        [workflow_id],
        map_workflow_row,
    )
    .map_err(|e| format!("Workflow not found: {e}"))
}

fn get_project_transcript_row(conn: &Connection, project_id: &str) -> Result<Option<StoredProjectTranscript>, String> {
    conn.query_row(
        r#"
        SELECT
            id, project_id, model_size, status, source_start_ms, source_end_ms, words_json, language, error, created_at, updated_at
        FROM project_transcripts
        WHERE project_id = ?1
        "#,
        [project_id],
        map_project_transcript_row,
    )
    .optional()
    .map_err(|e| format!("Failed to load project transcript: {e}"))
}

fn list_steps_by_workflow_id(conn: &Connection, workflow_id: &str) -> Result<Vec<StoredWorkflowStep>, String> {
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, workflow_id, step_key, step_label, step_order, status, started_at, ended_at, detail_json, error
            FROM workflow_steps
            WHERE workflow_id = ?1
            ORDER BY step_order ASC
            "#,
        )
        .map_err(|e| format!("Failed to query workflow steps: {e}"))?;
    let rows = stmt
        .query_map([workflow_id], map_workflow_step_row)
        .map_err(|e| format!("Failed to map workflow steps: {e}"))?;

    let mut out = Vec::new();
    for row in rows {
        out.push(row.map_err(|e| format!("Failed to parse workflow step row: {e}"))?);
    }
    Ok(out)
}

fn list_renders_by_workflow_id(conn: &Connection, workflow_id: &str) -> Result<Vec<StoredRender>, String> {
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, project_id, workflow_id, render_type, file_path, duration_sec,
                resolution_width, resolution_height, status, created_at
            FROM renders
            WHERE workflow_id = ?1
            ORDER BY created_at ASC
            "#,
        )
        .map_err(|e| format!("Failed to query renders: {e}"))?;
    let rows = stmt
        .query_map([workflow_id], map_render_row)
        .map_err(|e| format!("Failed to map renders: {e}"))?;

    let mut out = Vec::new();
    for row in rows {
        out.push(row.map_err(|e| format!("Failed to parse render row: {e}"))?);
    }
    Ok(out)
}

fn infer_mime_from_path(path: &Path) -> Option<String> {
    match path
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.to_ascii_lowercase())
        .as_deref()
    {
        Some("mp4") => Some("video/mp4".to_string()),
        Some("mov") => Some("video/quicktime".to_string()),
        Some("webm") => Some("video/webm".to_string()),
        Some("mp3") => Some("audio/mpeg".to_string()),
        Some("wav") => Some("audio/wav".to_string()),
        Some("jpg") | Some("jpeg") => Some("image/jpeg".to_string()),
        Some("png") => Some("image/png".to_string()),
        Some("pdf") => Some("application/pdf".to_string()),
        _ => None,
    }
}

fn insert_project_source_record(
    conn: &Connection,
    project_id: &str,
    source_type: &str,
    file_name: Option<String>,
    file_path: Option<String>,
    source_url: Option<String>,
    metadata_json: Option<String>,
) -> Result<(), String> {
    let source_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    let mime_type = file_path
        .as_ref()
        .and_then(|p| infer_mime_from_path(Path::new(p)));

    conn.execute(
        r#"
        INSERT INTO sources (
            id, project_id, source_type, mime_type, file_name, file_path, source_url, metadata_json, created_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        "#,
        params![
            source_id,
            project_id,
            source_type,
            mime_type,
            file_name,
            file_path,
            source_url,
            metadata_json,
            created_at
        ],
    )
    .map_err(|e| format!("Failed to insert source record: {e}"))?;
    Ok(())
}

fn probe_media(path: &Path) -> MediaProbe {
    let mut fallback = MediaProbe {
        duration: 0.0,
        width: 0,
        height: 0,
        file_size: fs::metadata(path).map(|m| m.len() as i64).unwrap_or(0),
    };

    let Some(ffprobe_path) = resolve_binary_path("ffprobe") else {
        return fallback;
    };

    let output = Command::new(ffprobe_path)
        .arg("-v")
        .arg("error")
        .arg("-print_format")
        .arg("json")
        .arg("-show_streams")
        .arg("-show_format")
        .arg(path)
        .output();

    let Ok(output) = output else {
        return fallback;
    };
    if !output.status.success() {
        return fallback;
    }

    let Ok(json) = serde_json::from_slice::<Value>(&output.stdout) else {
        return fallback;
    };

    if let Some(duration_str) = json
        .get("format")
        .and_then(|f| f.get("duration"))
        .and_then(|d| d.as_str())
    {
        if let Ok(duration) = duration_str.parse::<f64>() {
            fallback.duration = duration.max(0.0);
        }
    }

    if let Some(size_str) = json
        .get("format")
        .and_then(|f| f.get("size"))
        .and_then(|d| d.as_str())
    {
        if let Ok(size) = size_str.parse::<i64>() {
            fallback.file_size = size.max(0);
        }
    }

    if let Some(streams) = json.get("streams").and_then(|s| s.as_array()) {
        for stream in streams {
            if stream.get("codec_type").and_then(|c| c.as_str()) == Some("video") {
                if let Some(w) = stream.get("width").and_then(|v| v.as_i64()) {
                    fallback.width = w as i32;
                }
                if let Some(h) = stream.get("height").and_then(|v| v.as_i64()) {
                    fallback.height = h as i32;
                }
                break;
            }
        }
    }

    fallback
}

fn find_downloaded_source(project_folder: &Path) -> Result<PathBuf, String> {
    let entries = fs::read_dir(project_folder)
        .map_err(|e| format!("Failed to inspect download folder: {e}"))?;

    for entry in entries {
        let Ok(entry) = entry else {
            continue;
        };
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let Some(name) = path.file_name().and_then(|n| n.to_str()) else {
            continue;
        };
        if name.starts_with("source.") {
            return Ok(path);
        }
    }

    Err("Downloaded source file was not found.".to_string())
}

fn even_dimension(value: i32) -> i32 {
    if value % 2 == 0 {
        value
    } else {
        value - 1
    }
}

fn build_aspect_crop_filter(source_width: i32, source_height: i32, aspect_ratio: &str) -> Option<String> {
    if source_width <= 0 || source_height <= 0 {
        return None;
    }

    let (ratio_width, ratio_height) = match aspect_ratio {
        "9:16" => (9.0, 16.0),
        "1:1" => (1.0, 1.0),
        "16:9" => (16.0, 9.0),
        "4:5" => (4.0, 5.0),
        _ => return None,
    };

    let source_ratio = source_width as f64 / source_height as f64;
    let target_ratio = ratio_width / ratio_height;
    if (source_ratio - target_ratio).abs() < 0.01 {
        return None;
    }

    let (crop_width, crop_height) = if source_ratio > target_ratio {
        (even_dimension((source_height as f64 * target_ratio).round() as i32), even_dimension(source_height))
    } else {
        (even_dimension(source_width), even_dimension((source_width as f64 / target_ratio).round() as i32))
    };

    let offset_x = even_dimension(((source_width - crop_width) / 2).max(0));
    let offset_y = even_dimension(((source_height - crop_height) / 2).max(0));

    Some(format!("crop={crop_width}:{crop_height}:{offset_x}:{offset_y}"))
}

fn infer_aspect_ratio_from_dimensions(source_width: i32, source_height: i32) -> Option<String> {
    if source_width <= 0 || source_height <= 0 {
        return None;
    }

    let source_ratio = source_width as f64 / source_height as f64;
    let candidates = [
        ("9:16", 9.0 / 16.0),
        ("1:1", 1.0),
        ("16:9", 16.0 / 9.0),
        ("4:5", 4.0 / 5.0),
    ];

    candidates
        .iter()
        .min_by(|(_, left_ratio), (_, right_ratio)| {
            (source_ratio - left_ratio)
                .abs()
                .partial_cmp(&(source_ratio - right_ratio).abs())
                .unwrap_or(std::cmp::Ordering::Equal)
        })
        .map(|(label, _)| (*label).to_string())
}

fn hydrate_clip_aspect_ratio(conn: &Connection, clip: &mut StoredClip) {
    if clip.aspect_ratio.is_some() {
        return;
    }

    let probe = probe_media(Path::new(&clip.video_path));
    let inferred = infer_aspect_ratio_from_dimensions(probe.width, probe.height);

    if let Some(aspect_ratio) = inferred {
        clip.aspect_ratio = Some(aspect_ratio.clone());
        let _ = conn.execute(
            "UPDATE clips SET aspect_ratio = ?1, updated_at = ?2 WHERE id = ?3",
            params![aspect_ratio, now_iso(), clip.id.clone()],
        );
    }
}

fn extract_thumbnail_frame(source_path: &Path, output_path: &Path, seek_seconds: f64) -> Result<(), String> {
    let Some(ffmpeg_path) = resolve_binary_path("ffmpeg") else {
        return Err("ffmpeg is not installed or not in a discoverable location.".to_string());
    };

    let seek = format!("{:.3}", seek_seconds.max(0.0));
    let output = Command::new(&ffmpeg_path)
        .arg("-y")
        .arg("-ss")
        .arg(&seek)
        .arg("-i")
        .arg(source_path)
        .arg("-frames:v")
        .arg("1")
        .arg("-vf")
        .arg("scale=640:-2")
        .arg("-q:v")
        .arg("4")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg for thumbnail extraction: {e}"))?;

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Thumbnail extraction failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

fn resolve_python_path() -> Option<PathBuf> {
    resolve_binary_path("python3").or_else(|| resolve_binary_path("python"))
}

fn transcribe_script_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("python")
        .join("transcribe.py")
}

fn subtitle_burn_script_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("python")
        .join("burn_subtitles.py")
}

fn ai_reframe_script_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("python")
        .join("ai_reframe")
        .join("pipeline.py")
}

fn with_python_helper_lock<T>(
    helper_name: &str,
    action: impl FnOnce() -> Result<T, String>,
) -> Result<T, String> {
    let lock = PYTHON_HELPER_LOCK.get_or_init(|| Mutex::new(()));
    let _guard = lock
        .lock()
        .map_err(|_| format!("The {helper_name} helper queue is unavailable right now."))?;
    action()
}

#[cfg(unix)]
fn cleanup_stale_python_helpers() {
    let markers = [
        transcribe_script_path().to_string_lossy().into_owned(),
        subtitle_burn_script_path().to_string_lossy().into_owned(),
        ai_reframe_script_path().to_string_lossy().into_owned(),
        "src-tauri/python/transcribe.py".to_string(),
        "src-tauri/python/burn_subtitles.py".to_string(),
        "src-tauri/python/ai_reframe/pipeline.py".to_string(),
    ];

    let output = match Command::new("ps")
        .args(["-axo", "pid=,ppid=,command="])
        .output()
    {
        Ok(output) => output,
        Err(error) => {
            eprintln!("Failed to inspect stale ClipForge Python helpers: {error}");
            return;
        }
    };

    if !output.status.success() {
        eprintln!(
            "Failed to inspect stale ClipForge Python helpers: {}",
            String::from_utf8_lossy(&output.stderr)
        );
        return;
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        let mut parts = trimmed.split_whitespace();
        let Some(pid_str) = parts.next() else {
            continue;
        };
        let Some(ppid_str) = parts.next() else {
            continue;
        };
        let Ok(pid) = pid_str.parse::<u32>() else {
            continue;
        };
        let Ok(ppid) = ppid_str.parse::<u32>() else {
            continue;
        };

        if ppid > 1 {
            continue;
        }

        let command = parts.collect::<Vec<_>>().join(" ");
        if !markers.iter().any(|marker| command.contains(marker)) {
            continue;
        }

        match Command::new("kill")
            .arg("-TERM")
            .arg(pid.to_string())
            .status()
        {
            Ok(status) if status.success() => {
                eprintln!("Cleaned up stale ClipForge Python helper process {pid}.");
            }
            Ok(status) => {
                eprintln!(
                    "Failed to stop stale ClipForge Python helper process {pid}: exit status {status}."
                );
            }
            Err(error) => {
                eprintln!("Failed to stop stale ClipForge Python helper process {pid}: {error}");
            }
        }
    }
}

#[cfg(not(unix))]
fn cleanup_stale_python_helpers() {}

fn normalize_transcript_range(
    start_ms: Option<i64>,
    end_ms: Option<i64>,
) -> (Option<i64>, Option<i64>) {
    let normalized_start = start_ms.map(|value| value.max(0));
    let normalized_end = end_ms.map(|value| value.max(0));

    match (normalized_start, normalized_end) {
        (Some(start), Some(end)) if end > start => (Some(start), Some(end)),
        (Some(start), None) => (Some(start), None),
        (None, Some(end)) if end > 0 => (Some(0), Some(end)),
        _ => (None, None),
    }
}

fn transcript_covers_range(
    transcript: &StoredProjectTranscript,
    requested_start_ms: Option<i64>,
    requested_end_ms: Option<i64>,
) -> bool {
    let transcript_start_ms = transcript.source_start_ms.unwrap_or(0);
    let transcript_end_ms = transcript.source_end_ms.unwrap_or(i64::MAX);
    let requested_start_ms = requested_start_ms.unwrap_or(0);
    let requested_end_ms = requested_end_ms.unwrap_or(i64::MAX);

    transcript_start_ms <= requested_start_ms && transcript_end_ms >= requested_end_ms
}

fn transcript_matches_range(
    transcript: &StoredProjectTranscript,
    requested_start_ms: Option<i64>,
    requested_end_ms: Option<i64>,
) -> bool {
    transcript.source_start_ms == requested_start_ms
        && transcript.source_end_ms == requested_end_ms
}

fn ffmpeg_seconds_from_ms(ms: i64) -> String {
    format!("{:.3}", (ms.max(0) as f64) / 1000.0)
}

fn trim_media_to_range(
    source_path: &Path,
    output_path: &Path,
    start_ms: u64,
    end_ms: u64,
) -> Result<(), String> {
    let Some(ffmpeg_path) = resolve_binary_path("ffmpeg") else {
        return Err("ffmpeg is not installed or not in a discoverable location.".to_string());
    };

    let duration_ms = end_ms.saturating_sub(start_ms).max(1000);
    let start_arg = ffmpeg_seconds_from_ms(start_ms as i64);
    let duration_arg = ffmpeg_seconds_from_ms(duration_ms as i64);

    let copy_output = Command::new(&ffmpeg_path)
        .arg("-y")
        .arg("-ss")
        .arg(&start_arg)
        .arg("-i")
        .arg(source_path)
        .arg("-t")
        .arg(&duration_arg)
        .arg("-c")
        .arg("copy")
        .arg("-movflags")
        .arg("+faststart")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg source trim: {e}"))?;

    if copy_output.status.success() {
        return Ok(());
    }

    let hardware_output = Command::new(&ffmpeg_path)
        .arg("-y")
        .arg("-ss")
        .arg(&start_arg)
        .arg("-i")
        .arg(source_path)
        .arg("-t")
        .arg(&duration_arg)
        .arg("-c:v")
        .arg("h264_videotoolbox")
        .arg("-b:v")
        .arg("5M")
        .arg("-maxrate")
        .arg("7M")
        .arg("-bufsize")
        .arg("14M")
        .arg("-pix_fmt")
        .arg("yuv420p")
        .arg("-movflags")
        .arg("+faststart")
        .arg("-c:a")
        .arg("aac")
        .arg("-b:a")
        .arg("160k")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg hardware source trim: {e}"))?;

    if hardware_output.status.success() {
        return Ok(());
    }

    let software_output = Command::new(&ffmpeg_path)
        .arg("-y")
        .arg("-ss")
        .arg(&start_arg)
        .arg("-i")
        .arg(source_path)
        .arg("-t")
        .arg(&duration_arg)
        .arg("-c:v")
        .arg("libx264")
        .arg("-preset")
        .arg("veryfast")
        .arg("-crf")
        .arg("21")
        .arg("-pix_fmt")
        .arg("yuv420p")
        .arg("-movflags")
        .arg("+faststart")
        .arg("-c:a")
        .arg("aac")
        .arg("-b:a")
        .arg("160k")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg software source trim: {e}"))?;

    if software_output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "Selected range trim failed: {}",
            String::from_utf8_lossy(&software_output.stderr)
        ))
    }
}

fn extract_audio_for_transcription(
    media_path: &Path,
    start_ms: Option<i64>,
    end_ms: Option<i64>,
) -> Result<PathBuf, String> {
    let Some(ffmpeg_path) = resolve_binary_path("ffmpeg") else {
        return Err("ffmpeg is not installed or not in a discoverable location.".to_string());
    };

    let (start_ms, end_ms) = normalize_transcript_range(start_ms, end_ms);

    let temp_audio_path = std::env::temp_dir().join(format!(
        "clipforge-transcribe-{}.wav",
        Uuid::new_v4()
    ));

    let mut command = Command::new(ffmpeg_path);
    command.arg("-y");

    if let Some(start_ms) = start_ms {
        command.arg("-ss").arg(ffmpeg_seconds_from_ms(start_ms));
    }

    command.arg("-i").arg(media_path);

    if let (Some(start_ms), Some(end_ms)) = (start_ms, end_ms) {
        command
            .arg("-t")
            .arg(ffmpeg_seconds_from_ms(end_ms.saturating_sub(start_ms)));
    }

    let output = command
        .arg("-vn")
        .arg("-ac")
        .arg("1")
        .arg("-ar")
        .arg("16000")
        .arg("-c:a")
        .arg("pcm_s16le")
        .arg(&temp_audio_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg for transcription audio extraction: {e}"))?;

    if !output.status.success() {
        return Err(format!(
            "Audio extraction failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    Ok(temp_audio_path)
}

fn ensure_project_preview_proxy_file(source_path: &Path) -> Result<PathBuf, String> {
    let Some(ffmpeg_path) = resolve_binary_path("ffmpeg") else {
        return Err("ffmpeg is not installed or not in a discoverable location.".to_string());
    };

    let preview_folder = source_path
        .parent()
        .map(PathBuf::from)
        .unwrap_or_else(env::temp_dir);
    let preview_path = preview_folder.join("source_preview_proxy.mp4");

    if preview_path.exists() {
        return Ok(preview_path);
    }

    let copy_output = Command::new(&ffmpeg_path)
        .arg("-y")
        .arg("-i")
        .arg(source_path)
        .arg("-c")
        .arg("copy")
        .arg("-movflags")
        .arg("+faststart")
        .arg(&preview_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg preview proxy remux: {e}"))?;

    if copy_output.status.success() {
        return Ok(preview_path);
    }

    let scale_filter = "scale=w='min(960,iw)':h=-2";
    let mut hardware = Command::new(&ffmpeg_path);
    let hardware_output = hardware
        .arg("-y")
        .arg("-i")
        .arg(source_path)
        .arg("-vf")
        .arg(scale_filter)
        .arg("-c:v")
        .arg("h264_videotoolbox")
        .arg("-b:v")
        .arg("450k")
        .arg("-maxrate")
        .arg("650k")
        .arg("-bufsize")
        .arg("1300k")
        .arg("-pix_fmt")
        .arg("yuv420p")
        .arg("-movflags")
        .arg("+faststart")
        .arg("-c:a")
        .arg("aac")
        .arg("-b:a")
        .arg("48k")
        .arg(&preview_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg preview proxy encode: {e}"))?;

    if hardware_output.status.success() {
        return Ok(preview_path);
    }

    let mut software = Command::new(&ffmpeg_path);
    let software_output = software
        .arg("-y")
        .arg("-i")
        .arg(source_path)
        .arg("-vf")
        .arg(scale_filter)
        .arg("-c:v")
        .arg("libx264")
        .arg("-preset")
        .arg("veryfast")
        .arg("-crf")
        .arg("32")
        .arg("-pix_fmt")
        .arg("yuv420p")
        .arg("-movflags")
        .arg("+faststart")
        .arg("-c:a")
        .arg("aac")
        .arg("-b:a")
        .arg("48k")
        .arg(&preview_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg software preview proxy encode: {e}"))?;

    if software_output.status.success() {
        Ok(preview_path)
    } else {
        Err(format!(
            "Preview proxy generation failed: {}",
            String::from_utf8_lossy(&software_output.stderr)
        ))
    }
}

fn run_faster_whisper_transcription(
    media_path: &Path,
    model_size: &str,
) -> Result<TranscriptSidecarPayload, String> {
    run_faster_whisper_transcription_for_range(media_path, model_size, None, None, 0)
}

fn run_faster_whisper_transcription_for_range(
    media_path: &Path,
    model_size: &str,
    start_ms: Option<i64>,
    end_ms: Option<i64>,
    output_offset_ms: i64,
) -> Result<TranscriptSidecarPayload, String> {
    with_python_helper_lock("transcription", || {
        let python_path = resolve_python_path()
            .ok_or_else(|| "Python 3 was not found in a discoverable location.".to_string())?;
        let script_path = transcribe_script_path();
        let cpu_threads = std::thread::available_parallelism()
            .map(|count| count.get().to_string())
            .unwrap_or_else(|_| "4".to_string());

        if !script_path.is_file() {
            return Err(format!(
                "Transcription helper script was not found at {}",
                script_path.to_string_lossy()
            ));
        }

        let (start_ms, end_ms) = normalize_transcript_range(start_ms, end_ms);
        let audio_path = extract_audio_for_transcription(media_path, start_ms, end_ms)?;

        let output = Command::new(python_path)
            .env("CLIPFORGE_WHISPER_CPU_THREADS", cpu_threads)
            .arg("-u")
            .arg(script_path)
            .arg(&audio_path)
            .arg(model_size)
            .output()
            .map_err(|e| format!("Failed to launch faster-whisper helper: {e}"))?;

        let _ = fs::remove_file(&audio_path);

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            return Err(if !stderr.is_empty() {
                stderr
            } else if !stdout.is_empty() {
                stdout
            } else {
                "faster-whisper helper failed.".to_string()
            });
        }

        let mut transcript = serde_json::from_slice::<TranscriptSidecarPayload>(&output.stdout)
            .map_err(|e| format!("Failed to parse faster-whisper output: {e}"))?;

        if output_offset_ms != 0 {
            for word in &mut transcript.words {
                word.start += output_offset_ms;
                word.end += output_offset_ms;
            }
        }

        transcript.word_count = transcript.words.len();
        Ok(transcript)
    })
}

fn burn_subtitles_into_video(video_path: &Path, transcript: &TranscriptSidecarPayload) -> Result<(), String> {
    with_python_helper_lock("subtitle burn", || {
        let python_path = resolve_python_path()
            .ok_or_else(|| "Python 3 was not found in a discoverable location.".to_string())?;
        let script_path = subtitle_burn_script_path();

        if !script_path.is_file() {
            return Err(format!(
                "Subtitle burn helper script was not found at {}",
                script_path.to_string_lossy()
            ));
        }

        let transcript_path =
            env::temp_dir().join(format!("clipforge-burn-{}.json", Uuid::new_v4()));
        let temp_output_path =
            env::temp_dir().join(format!("clipforge-burn-{}.mp4", Uuid::new_v4()));
        let final_output_path =
            env::temp_dir().join(format!("clipforge-burn-final-{}.mp4", Uuid::new_v4()));

        let payload = serde_json::to_vec(transcript)
            .map_err(|e| format!("Failed to serialize subtitle transcript: {e}"))?;
        fs::write(&transcript_path, payload)
            .map_err(|e| format!("Failed to write subtitle transcript file: {e}"))?;

        let render_output = Command::new(&python_path)
            .arg("-u")
            .arg(&script_path)
            .arg(video_path)
            .arg(&transcript_path)
            .arg(&temp_output_path)
            .output()
            .map_err(|e| format!("Failed to launch subtitle burn helper: {e}"))?;

        let _ = fs::remove_file(&transcript_path);

        if !render_output.status.success() {
            let stderr = String::from_utf8_lossy(&render_output.stderr).trim().to_string();
            let stdout = String::from_utf8_lossy(&render_output.stdout).trim().to_string();
            let _ = fs::remove_file(&temp_output_path);
            return Err(if !stderr.is_empty() {
                stderr
            } else if !stdout.is_empty() {
                stdout
            } else {
                "Subtitle burn helper failed.".to_string()
            });
        }

        let Some(ffmpeg_path) = resolve_binary_path("ffmpeg") else {
            let _ = fs::remove_file(&temp_output_path);
            return Err("ffmpeg is not installed or not in a discoverable location.".to_string());
        };

        let mux_output = Command::new(ffmpeg_path)
            .arg("-y")
            .arg("-i")
            .arg(&temp_output_path)
            .arg("-i")
            .arg(video_path)
            .arg("-map")
            .arg("0:v:0")
            .arg("-map")
            .arg("1:a:0?")
            .arg("-c:v")
            .arg("copy")
            .arg("-c:a")
            .arg("aac")
            .arg("-b:a")
            .arg("160k")
            .arg("-shortest")
            .arg("-movflags")
            .arg("+faststart")
            .arg(&final_output_path)
            .output()
            .map_err(|e| format!("Failed to mux subtitle-burned output audio: {e}"))?;

        let _ = fs::remove_file(&temp_output_path);

        if !mux_output.status.success() {
            let stderr = String::from_utf8_lossy(&mux_output.stderr).trim().to_string();
            let _ = fs::remove_file(&final_output_path);
            return Err(if !stderr.is_empty() {
                stderr
            } else {
                "Failed to mux subtitle-burned output audio.".to_string()
            });
        }

        fs::rename(&final_output_path, video_path)
            .or_else(|_| {
                fs::copy(&final_output_path, video_path)?;
                fs::remove_file(&final_output_path)
            })
            .map_err(|e| {
                format!("Failed to replace output clip with subtitle-burned version: {e}")
            })?;

        Ok(())
    })
}

fn run_ffmpeg_clip_with_aspect_ratio(
    source_path: &Path,
    output_path: &Path,
    start_ms: u64,
    end_ms: u64,
    source_width: Option<i32>,
    source_height: Option<i32>,
    aspect_ratio: Option<&str>,
) -> Result<String, String> {
    if end_ms <= start_ms {
        return Err("Invalid clip range: end must be greater than start.".to_string());
    }
    let Some(ffmpeg_path) = resolve_binary_path("ffmpeg") else {
        return Err("ffmpeg is not installed or not in a discoverable location.".to_string());
    };

    let start_sec = format!("{:.3}", (start_ms as f64) / 1000.0);
    let duration_sec = format!("{:.3}", ((end_ms - start_ms) as f64) / 1000.0);
    let crop_filter = match (source_width, source_height, aspect_ratio) {
        (Some(width), Some(height), Some(ratio)) => build_aspect_crop_filter(width, height, ratio),
        _ => None,
    };

    if crop_filter.is_none() {
        let copy_out = Command::new(&ffmpeg_path)
            .arg("-y")
            .arg("-ss")
            .arg(&start_sec)
            .arg("-t")
            .arg(&duration_sec)
            .arg("-i")
            .arg(source_path)
            .arg("-map")
            .arg("0:v:0")
            .arg("-map")
            .arg("0:a:0?")
            .arg("-sn")
            .arg("-dn")
            .arg("-avoid_negative_ts")
            .arg("1")
            .arg("-c")
            .arg("copy")
            .arg(output_path)
            .output()
            .map_err(|e| format!("Failed to launch ffmpeg: {e}"))?;

        if copy_out.status.success() {
            return Ok("copy".to_string());
        }
    }

    let mut reencode_hw = Command::new(&ffmpeg_path);
    reencode_hw
        .arg("-y")
        .arg("-ss")
        .arg(&start_sec)
        .arg("-t")
        .arg(&duration_sec)
        .arg("-i")
        .arg(source_path)
        .arg("-map")
        .arg("0:v:0")
        .arg("-map")
        .arg("0:a:0?")
        .arg("-sn")
        .arg("-dn");

    if let Some(filter) = crop_filter.as_ref() {
        reencode_hw.arg("-vf").arg(filter);
    }

    let hw_out = reencode_hw
        .arg("-c:v")
        .arg("h264_videotoolbox")
        .arg("-profile:v")
        .arg("high")
        .arg("-realtime")
        .arg("true")
        .arg("-prio_speed")
        .arg("true")
        .arg("-b:v")
        .arg("8M")
        .arg("-maxrate")
        .arg("10M")
        .arg("-bufsize")
        .arg("16M")
        .arg("-pix_fmt")
        .arg("yuv420p")
        .arg("-movflags")
        .arg("+faststart")
        .arg("-c:a")
        .arg("aac")
        .arg("-b:a")
        .arg("128k")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg hardware reencode: {e}"))?;

    if hw_out.status.success() {
        return Ok("reencode-hw".to_string());
    }

    let mut reencode_sw = Command::new(ffmpeg_path);
    reencode_sw
        .arg("-y")
        .arg("-ss")
        .arg(&start_sec)
        .arg("-t")
        .arg(&duration_sec)
        .arg("-i")
        .arg(source_path)
        .arg("-map")
        .arg("0:v:0")
        .arg("-map")
        .arg("0:a:0?")
        .arg("-sn")
        .arg("-dn");

    if let Some(filter) = crop_filter.as_ref() {
        reencode_sw.arg("-vf").arg(filter);
    }

    let reencode_out = reencode_sw
        .arg("-c:v")
        .arg("libx264")
        .arg("-preset")
        .arg("veryfast")
        .arg("-crf")
        .arg("21")
        .arg("-pix_fmt")
        .arg("yuv420p")
        .arg("-movflags")
        .arg("+faststart")
        .arg("-c:a")
        .arg("aac")
        .arg("-b:a")
        .arg("128k")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to launch ffmpeg reencode: {e}"))?;

    if reencode_out.status.success() {
        Ok("reencode".to_string())
    } else {
        Err(format!(
            "ffmpeg failed: {}",
            String::from_utf8_lossy(&reencode_out.stderr)
        ))
    }
}

#[tauri::command]
fn init_library(app: tauri::AppHandle) -> Result<(), String> {
    let _ = open_db(&app)?;
    Ok(())
}

#[tauri::command]
fn list_projects(app: tauri::AppHandle) -> Result<Vec<StoredProject>, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                p.id,
                p.name,
                p.source_type,
                p.source_url,
                p.source_path,
                p.file_name,
                p.file_size,
                p.duration,
                p.resolution_width,
                p.resolution_height,
                p.created_at,
                p.status,
                p.thumbnail_path,
                COALESCE(COUNT(c.id), 0) AS clip_count
            FROM projects p
            LEFT JOIN clips c ON c.project_id = p.id
            GROUP BY
                p.id, p.name, p.source_type, p.source_url, p.source_path, p.file_name,
                p.file_size, p.duration, p.resolution_width, p.resolution_height,
                p.created_at, p.status, p.thumbnail_path
            ORDER BY p.created_at DESC
            "#,
        )
        .map_err(|e| format!("Failed to query projects: {e}"))?;

    let rows = stmt
        .query_map([], map_project_row)
        .map_err(|e| format!("Failed to map projects: {e}"))?;

    let mut projects = Vec::new();
    for row in rows {
        projects.push(row.map_err(|e| format!("Failed to read project row: {e}"))?);
    }
    Ok(projects)
}

#[tauri::command]
fn list_project_clips(app: tauri::AppHandle, project_id: String) -> Result<Vec<StoredClip>, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, project_id, start_ms, end_ms, hook, reason, score,
                selected, video_path, thumbnail_path, aspect_ratio, created_at, processing_mode
            FROM clips
            WHERE project_id = ?1
            ORDER BY start_ms ASC
            "#,
        )
        .map_err(|e| format!("Failed to query clips: {e}"))?;

    let rows = stmt
        .query_map([project_id], map_clip_row)
        .map_err(|e| format!("Failed to map clips: {e}"))?;

    let mut clips = Vec::new();
    for row in rows {
        let mut clip = row.map_err(|e| format!("Failed to read clip row: {e}"))?;
        hydrate_clip_aspect_ratio(&conn, &mut clip);
        clips.push(clip);
    }
    Ok(clips)
}

fn workflow_steps_blueprint() -> Vec<(&'static str, &'static str)> {
    vec![
        ("script_generation", "Script Generation"),
        ("script_approval", "Script & Voiceover Approval"),
        ("asset_sourcing", "Asset Sourcing"),
        ("hook_generation", "Hook Generation"),
        ("storyboard_generation", "Storyboard Generation"),
        ("scene_creation", "Video Creation Scene by Scene"),
        ("final_delivery", "Final Video Delivery"),
    ]
}

#[tauri::command]
fn list_project_sources(app: tauri::AppHandle, project_id: String) -> Result<Vec<StoredSource>, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, project_id, source_type, mime_type, file_name, file_path, source_url, metadata_json, created_at
            FROM sources
            WHERE project_id = ?1
            ORDER BY created_at ASC
            "#,
        )
        .map_err(|e| format!("Failed to query sources: {e}"))?;
    let rows = stmt
        .query_map([project_id], map_source_row)
        .map_err(|e| format!("Failed to map source rows: {e}"))?;

    let mut out = Vec::new();
    for row in rows {
        out.push(row.map_err(|e| format!("Failed to parse source row: {e}"))?);
    }
    Ok(out)
}

#[tauri::command]
fn list_project_workflows(app: tauri::AppHandle, project_id: String) -> Result<Vec<StoredWorkflow>, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, project_id, workflow_type, status, input_json, output_json, error, created_at, updated_at
            FROM workflows
            WHERE project_id = ?1
            ORDER BY created_at DESC
            "#,
        )
        .map_err(|e| format!("Failed to query workflows: {e}"))?;
    let rows = stmt
        .query_map([project_id], map_workflow_row)
        .map_err(|e| format!("Failed to map workflow rows: {e}"))?;
    let mut out = Vec::new();
    for row in rows {
        out.push(row.map_err(|e| format!("Failed to parse workflow row: {e}"))?);
    }
    Ok(out)
}

#[tauri::command]
fn list_workflow_steps(app: tauri::AppHandle, workflow_id: String) -> Result<Vec<StoredWorkflowStep>, String> {
    let conn = open_db(&app)?;
    list_steps_by_workflow_id(&conn, &workflow_id)
}

#[tauri::command]
fn list_workflow_renders(app: tauri::AppHandle, workflow_id: String) -> Result<Vec<StoredRender>, String> {
    let conn = open_db(&app)?;
    list_renders_by_workflow_id(&conn, &workflow_id)
}

#[tauri::command]
fn start_agent_workflow(
    app: tauri::AppHandle,
    payload: StartAgentWorkflowPayload,
) -> Result<WorkflowRunResult, String> {
    let conn = open_db(&app)?;
    let project = get_project_by_id(&conn, &payload.project_id)?;
    let workflow_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    let input_json = serde_json::to_string(&payload).map_err(|e| format!("Failed to serialize workflow input: {e}"))?;

    conn.execute(
        r#"
        INSERT INTO workflows (
            id, project_id, workflow_type, status, input_json, output_json, error, created_at, updated_at
        ) VALUES (?1, ?2, 'agent_opus', 'running', ?3, NULL, NULL, ?4, ?4)
        "#,
        params![workflow_id, payload.project_id.clone(), input_json, created_at],
    )
    .map_err(|e| format!("Failed to create workflow: {e}"))?;

    let workflow_folder = project_dir(&app, &project.id)?
        .join("workflow")
        .join(&workflow_id);
    fs::create_dir_all(&workflow_folder)
        .map_err(|e| format!("Failed to create workflow folder: {e}"))?;

    for (idx, (step_key, step_label)) in workflow_steps_blueprint().iter().enumerate() {
        conn.execute(
            r#"
            INSERT INTO workflow_steps (
                id, workflow_id, step_key, step_label, step_order, status, started_at, ended_at, detail_json, error
            ) VALUES (?1, ?2, ?3, ?4, ?5, 'pending', NULL, NULL, NULL, NULL)
            "#,
            params![
                Uuid::new_v4().to_string(),
                workflow_id,
                step_key,
                step_label,
                idx as i64
            ],
        )
        .map_err(|e| format!("Failed to initialize workflow step {step_key}: {e}"))?;
    }

    for (idx, (step_key, step_label)) in workflow_steps_blueprint().iter().enumerate() {
        let started_at = now_iso();
        conn.execute(
            r#"
            UPDATE workflow_steps
            SET status = 'running', started_at = ?1, error = NULL
            WHERE workflow_id = ?2 AND step_key = ?3
            "#,
            params![started_at, workflow_id, step_key],
        )
        .map_err(|e| format!("Failed to mark step running ({step_key}): {e}"))?;

        let detail = match *step_key {
            "script_generation" => json!({
                "scriptSummary": format!("Generated local script draft for project '{}'", project.name),
                "tone": "informative",
                "estimatedWords": (payload.prompt.split_whitespace().count() as i64).max(80)
            }),
            "script_approval" => json!({
                "approvalWindowSec": 300,
                "mode": "human_in_the_loop",
                "defaultState": "auto_continue_after_timeout"
            }),
            "asset_sourcing" => json!({
                "sourceCount": payload.source_urls.as_ref().map(|s| s.len()).unwrap_or(0),
                "strategy": "local-first references + uploaded assets"
            }),
            "hook_generation" => json!({
                "hookSelected": payload.hooks_enabled.unwrap_or(true),
                "hookText": format!("{}: local AI hook candidate", project.name)
            }),
            "storyboard_generation" => json!({
                "sceneCount": 6,
                "previewPath": workflow_folder.join("storyboard.json").to_string_lossy().to_string()
            }),
            "scene_creation" => json!({
                "directorAgent": "local-rule-engine",
                "motionDesigner": "local-template-engine",
                "voiceActor": "local-tts-placeholder"
            }),
            "final_delivery" => json!({
                "status": "render_plan_ready",
                "deliveryMode": "local files"
            }),
            _ => json!({ "status": "unknown-step" }),
        };

        if *step_key == "script_generation" {
            let script_path = workflow_folder.join("script.txt");
            fs::write(
                &script_path,
                format!(
                    "Title: {}\n\nPrompt:\n{}\n\nGenerated by local rule-based adapter.",
                    project.name, payload.prompt
                ),
            )
            .map_err(|e| format!("Failed to write local script file: {e}"))?;
        }

        if *step_key == "storyboard_generation" {
            let storyboard_path = workflow_folder.join("storyboard.json");
            fs::write(
                &storyboard_path,
                json!({
                    "projectId": project.id,
                    "workflowId": workflow_id,
                    "sceneCount": 6,
                    "scenes": [
                        {"index": 1, "title": "Hook scene"},
                        {"index": 2, "title": "Context scene"},
                        {"index": 3, "title": "Main idea"},
                        {"index": 4, "title": "Evidence"},
                        {"index": 5, "title": "Takeaway"},
                        {"index": 6, "title": "CTA"}
                    ]
                })
                .to_string(),
            )
            .map_err(|e| format!("Failed to write storyboard file: {e}"))?;
        }

        let ended_at = now_iso();
        conn.execute(
            r#"
            UPDATE workflow_steps
            SET status = 'complete', ended_at = ?1, detail_json = ?2
            WHERE workflow_id = ?3 AND step_key = ?4
            "#,
            params![ended_at, detail.to_string(), workflow_id, step_key],
        )
        .map_err(|e| format!("Failed to complete step ({step_label}): {e}"))?;

        if idx == 0 {
            conn.execute(
                "UPDATE projects SET status = 'analyzing', updated_at = ?1 WHERE id = ?2",
                params![now_iso(), project.id],
            )
            .map_err(|e| format!("Failed to update project status during workflow: {e}"))?;
        }
    }

    let render_plan_path = workflow_folder.join("final_video_plan.json");
    fs::write(
        &render_plan_path,
        json!({
            "projectId": project.id,
            "workflowId": workflow_id,
            "status": "ready_for_renderer",
            "aspectRatio": payload.aspect_ratio.unwrap_or_else(|| "9:16".to_string()),
            "targetPlatform": payload.target_platform.unwrap_or_else(|| "tiktok".to_string()),
            "captionsEnabled": payload.captions_enabled.unwrap_or(true)
        })
        .to_string(),
    )
    .map_err(|e| format!("Failed to write render plan file: {e}"))?;

    let render_id = Uuid::new_v4().to_string();
    conn.execute(
        r#"
        INSERT INTO renders (
            id, project_id, workflow_id, render_type, file_path, duration_sec,
            resolution_width, resolution_height, status, created_at
        ) VALUES (?1, ?2, ?3, 'agent_video_plan', ?4, ?5, ?6, ?7, 'complete', ?8)
        "#,
        params![
            render_id,
            project.id,
            workflow_id,
            render_plan_path.to_string_lossy().to_string(),
            project.duration,
            project.resolution_width,
            project.resolution_height,
            now_iso()
        ],
    )
    .map_err(|e| format!("Failed to insert render row: {e}"))?;

    let output_json = json!({
        "result": "success",
        "renderId": render_id,
        "renderPlanPath": render_plan_path.to_string_lossy().to_string()
    })
    .to_string();

    conn.execute(
        r#"
        UPDATE workflows
        SET status = 'complete', output_json = ?1, updated_at = ?2
        WHERE id = ?3
        "#,
        params![output_json, now_iso(), workflow_id],
    )
    .map_err(|e| format!("Failed to finalize workflow row: {e}"))?;

    conn.execute(
        "UPDATE projects SET status = 'ready', updated_at = ?1 WHERE id = ?2",
        params![now_iso(), project.id],
    )
    .map_err(|e| format!("Failed to finalize project status: {e}"))?;

    Ok(WorkflowRunResult {
        workflow: get_workflow_by_id(&conn, &workflow_id)?,
        steps: list_steps_by_workflow_id(&conn, &workflow_id)?,
        renders: list_renders_by_workflow_id(&conn, &workflow_id)?,
    })
}

#[tauri::command]
fn upsert_caption(app: tauri::AppHandle, payload: UpsertCaptionPayload) -> Result<StoredCaption, String> {
    let conn = open_db(&app)?;
    let caption_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    conn.execute(
        r#"
        INSERT INTO captions (
            id, project_id, clip_id, style, language, srt_content, vtt_content, created_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        "#,
        params![
            caption_id,
            payload.project_id,
            payload.clip_id,
            payload.style,
            payload.language,
            payload.srt_content,
            payload.vtt_content,
            created_at
        ],
    )
    .map_err(|e| format!("Failed to insert caption: {e}"))?;

    conn.query_row(
        r#"
        SELECT
            id, project_id, clip_id, style, language, srt_content, vtt_content, created_at
        FROM captions
        WHERE id = ?1
        "#,
        [caption_id],
        map_caption_row,
    )
    .map_err(|e| format!("Failed to read inserted caption: {e}"))
}

#[tauri::command]
fn list_project_captions(app: tauri::AppHandle, project_id: String) -> Result<Vec<StoredCaption>, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, project_id, clip_id, style, language, srt_content, vtt_content, created_at
            FROM captions
            WHERE project_id = ?1
            ORDER BY created_at DESC
            "#,
        )
        .map_err(|e| format!("Failed to query captions: {e}"))?;
    let rows = stmt
        .query_map([project_id], map_caption_row)
        .map_err(|e| format!("Failed to map captions: {e}"))?;
    let mut out = Vec::new();
    for row in rows {
        out.push(row.map_err(|e| format!("Failed to parse caption row: {e}"))?);
    }
    Ok(out)
}

fn transcribe_source_impl(
    app: tauri::AppHandle,
    payload: TranscribeSourcePayload,
) -> Result<StoredProjectTranscript, String> {
    let conn = open_db(&app)?;
    let project_id = payload.project_id;
    let model_size = payload.model_size.unwrap_or_else(|| "medium".to_string());
    let (requested_start_ms, requested_end_ms) =
        normalize_transcript_range(payload.start_ms, payload.end_ms);

    if let Some(existing) = get_project_transcript_row(&conn, &project_id)? {
        if existing.status == "complete"
            && transcript_covers_range(&existing, requested_start_ms, requested_end_ms)
        {
            return Ok(existing);
        }

        if existing.status == "processing"
            && transcript_matches_range(&existing, requested_start_ms, requested_end_ms)
        {
            return Ok(existing);
        }
    }

    let source_path = if let Some(path) = payload.video_path.filter(|value| !value.trim().is_empty()) {
        path
    } else {
        conn.query_row(
            "SELECT source_path FROM projects WHERE id = ?1",
            [project_id.clone()],
            |row| row.get::<_, String>(0),
        )
        .optional()
        .map_err(|e| format!("Failed to look up project source path: {e}"))?
        .ok_or_else(|| "Project source video was not found.".to_string())?
    };

    let transcript_id = Uuid::new_v4().to_string();
    let created_at = now_iso();

    conn.execute(
        r#"
        INSERT INTO project_transcripts (
            id, project_id, model_size, status, source_start_ms, source_end_ms, words_json, language, error, created_at, updated_at
        ) VALUES (?1, ?2, ?3, 'processing', ?4, ?5, NULL, NULL, NULL, ?6, ?6)
        ON CONFLICT(project_id) DO UPDATE SET
            id = excluded.id,
            model_size = excluded.model_size,
            status = 'processing',
            source_start_ms = excluded.source_start_ms,
            source_end_ms = excluded.source_end_ms,
            words_json = NULL,
            language = NULL,
            error = NULL,
            updated_at = excluded.updated_at
        "#,
        params![
            transcript_id,
            project_id.clone(),
            model_size.clone(),
            requested_start_ms,
            requested_end_ms,
            created_at
        ],
    )
    .map_err(|e| format!("Failed to mark project transcript as processing: {e}"))?;

    match run_faster_whisper_transcription_for_range(
        Path::new(&source_path),
        &model_size,
        requested_start_ms,
        requested_end_ms,
        requested_start_ms.unwrap_or(0),
    ) {
        Ok(result) => {
            let words_json = serde_json::to_string(&result.words)
                .map_err(|e| format!("Failed to serialize transcript words: {e}"))?;
            let updated_at = now_iso();
            conn.execute(
                r#"
                UPDATE project_transcripts
                SET status = 'complete', words_json = ?1, language = ?2, error = NULL, updated_at = ?3
                WHERE project_id = ?4 AND id = ?5
                "#,
                params![
                    words_json,
                    result.language,
                    updated_at,
                    project_id.clone(),
                    transcript_id.clone()
                ],
            )
            .map_err(|e| format!("Failed to store project transcript: {e}"))?;
        }
        Err(error) => {
            conn.execute(
                r#"
                UPDATE project_transcripts
                SET status = 'error', error = ?1, updated_at = ?2
                WHERE project_id = ?3 AND id = ?4
                "#,
                params![error, now_iso(), project_id.clone(), transcript_id.clone()],
            )
            .map_err(|e| format!("Failed to store transcript error: {e}"))?;
        }
    }

    get_project_transcript_row(&conn, &project_id)?
        .ok_or_else(|| "Project transcript row was not found after transcription.".to_string())
}

#[tauri::command]
async fn transcribe_source(
    app: tauri::AppHandle,
    payload: TranscribeSourcePayload,
) -> Result<StoredProjectTranscript, String> {
    tauri::async_runtime::spawn_blocking(move || transcribe_source_impl(app, payload))
        .await
        .map_err(|e| format!("Failed to join transcription task: {e}"))?
}

#[tauri::command]
async fn transcribe_video(
    _app: tauri::AppHandle,
    payload: TranscribeVideoPayload,
) -> Result<DirectTranscriptResult, String> {
    let video_path = payload.video_path;
    let model_size = payload.model_size.unwrap_or_else(|| "medium".to_string());

    tauri::async_runtime::spawn_blocking(move || {
        let transcript = run_faster_whisper_transcription(Path::new(&video_path), &model_size)?;
        Ok(DirectTranscriptResult {
            model_size: transcript.model_size,
            language: transcript.language,
            words: transcript.words,
        })
    })
    .await
    .map_err(|e| format!("Failed to join direct transcription task: {e}"))?
}

#[tauri::command]
fn get_project_transcript(app: tauri::AppHandle, project_id: String) -> Result<Option<StoredProjectTranscript>, String> {
    let conn = open_db(&app)?;
    get_project_transcript_row(&conn, &project_id)
}

#[tauri::command]
fn upsert_notification_target(
    app: tauri::AppHandle,
    payload: UpsertNotificationTargetPayload,
) -> Result<StoredNotificationTarget, String> {
    let conn = open_db(&app)?;
    let existing: Option<String> = conn
        .query_row(
            "SELECT id FROM notification_targets WHERE channel = ?1 AND target = ?2",
            params![payload.channel, payload.target],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| format!("Failed to query existing notification target: {e}"))?;

    let now = now_iso();
    let id = existing.unwrap_or_else(|| Uuid::new_v4().to_string());
    conn.execute(
        r#"
        INSERT INTO notification_targets (id, channel, target, is_enabled, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?5)
        ON CONFLICT(id) DO UPDATE SET
            is_enabled = excluded.is_enabled,
            updated_at = excluded.updated_at
        "#,
        params![
            id,
            payload.channel,
            payload.target,
            if payload.is_enabled { 1 } else { 0 },
            now
        ],
    )
    .map_err(|e| format!("Failed to upsert notification target: {e}"))?;

    conn.query_row(
        r#"
        SELECT
            id, channel, target, is_enabled, created_at, updated_at
        FROM notification_targets
        WHERE id = ?1
        "#,
        [id],
        map_notification_target_row,
    )
    .map_err(|e| format!("Failed to read notification target: {e}"))
}

#[tauri::command]
fn list_notification_targets(app: tauri::AppHandle) -> Result<Vec<StoredNotificationTarget>, String> {
    let conn = open_db(&app)?;
    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, channel, target, is_enabled, created_at, updated_at
            FROM notification_targets
            ORDER BY updated_at DESC
            "#,
        )
        .map_err(|e| format!("Failed to query notification targets: {e}"))?;
    let rows = stmt
        .query_map([], map_notification_target_row)
        .map_err(|e| format!("Failed to map notification targets: {e}"))?;
    let mut out = Vec::new();
    for row in rows {
        out.push(row.map_err(|e| format!("Failed to parse notification target row: {e}"))?);
    }
    Ok(out)
}

#[tauri::command]
fn queue_notification(app: tauri::AppHandle, payload: QueueNotificationPayload) -> Result<StoredNotification, String> {
    let conn = open_db(&app)?;
    let target = conn
        .query_row(
            "SELECT target FROM notification_targets WHERE channel = ?1 AND is_enabled = 1 ORDER BY updated_at DESC LIMIT 1",
            [payload.channel.clone()],
            |row| row.get::<_, String>(0),
        )
        .optional()
        .map_err(|e| format!("Failed to resolve notification target: {e}"))?
        .ok_or_else(|| format!("No enabled notification target found for channel '{}'", payload.channel))?;

    let notification_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    conn.execute(
        r#"
        INSERT INTO notifications (
            id, project_id, channel, target, message, status, created_at, sent_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, 'queued', ?6, NULL)
        "#,
        params![
            notification_id,
            payload.project_id,
            payload.channel,
            target,
            payload.message,
            created_at
        ],
    )
    .map_err(|e| format!("Failed to queue notification: {e}"))?;

    conn.query_row(
        r#"
        SELECT
            id, project_id, channel, target, message, status, created_at, sent_at
        FROM notifications
        WHERE id = ?1
        "#,
        [notification_id],
        map_notification_row,
    )
    .map_err(|e| format!("Failed to read queued notification: {e}"))
}

#[tauri::command]
fn list_notifications(app: tauri::AppHandle, project_id: Option<String>) -> Result<Vec<StoredNotification>, String> {
    let conn = open_db(&app)?;
    let mut out = Vec::new();

    if let Some(project_id) = project_id {
        let mut stmt = conn
            .prepare(
                r#"
                SELECT
                    id, project_id, channel, target, message, status, created_at, sent_at
                FROM notifications
                WHERE project_id = ?1
                ORDER BY created_at DESC
                "#,
            )
            .map_err(|e| format!("Failed to query project notifications: {e}"))?;
        let rows = stmt
            .query_map([project_id], map_notification_row)
            .map_err(|e| format!("Failed to map project notifications: {e}"))?;
        for row in rows {
            out.push(row.map_err(|e| format!("Failed to parse notification row: {e}"))?);
        }
    } else {
        let mut stmt = conn
            .prepare(
                r#"
                SELECT
                    id, project_id, channel, target, message, status, created_at, sent_at
                FROM notifications
                ORDER BY created_at DESC
                "#,
            )
            .map_err(|e| format!("Failed to query notifications: {e}"))?;
        let rows = stmt
            .query_map([], map_notification_row)
            .map_err(|e| format!("Failed to map notifications: {e}"))?;
        for row in rows {
            out.push(row.map_err(|e| format!("Failed to parse notification row: {e}"))?);
        }
    }

    Ok(out)
}

#[tauri::command]
fn set_app_setting(app: tauri::AppHandle, key: String, value: String) -> Result<StoredSetting, String> {
    let conn = open_db(&app)?;
    let updated_at = now_iso();
    conn.execute(
        r#"
        INSERT INTO app_settings (key, value, updated_at)
        VALUES (?1, ?2, ?3)
        ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            updated_at = excluded.updated_at
        "#,
        params![key, value, updated_at],
    )
    .map_err(|e| format!("Failed to upsert app setting: {e}"))?;

    conn.query_row(
        "SELECT key, value, updated_at FROM app_settings WHERE key = ?1",
        [key],
        |row| {
            Ok(StoredSetting {
                key: row.get("key")?,
                value: row.get("value")?,
                updated_at: row.get("updated_at")?,
            })
        },
    )
    .map_err(|e| format!("Failed to read app setting: {e}"))
}

#[tauri::command]
fn get_app_setting(app: tauri::AppHandle, key: String) -> Result<Option<StoredSetting>, String> {
    let conn = open_db(&app)?;
    conn.query_row(
        "SELECT key, value, updated_at FROM app_settings WHERE key = ?1",
        [key],
        |row| {
            Ok(StoredSetting {
                key: row.get("key")?,
                value: row.get("value")?,
                updated_at: row.get("updated_at")?,
            })
        },
    )
    .optional()
    .map_err(|e| format!("Failed to fetch app setting: {e}"))
}

fn persist_upload_project(app: &tauri::AppHandle, payload: UploadProjectPayload) -> Result<StoredProject, String> {
    let conn = open_db(&app)?;
    let project_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    let project_folder = project_dir(&app, &project_id)?;
    fs::create_dir_all(project_folder.join("clips"))
        .map_err(|e| format!("Failed to create project folder: {e}"))?;

    let source_ext = Path::new(&payload.file_name)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("mp4");
    let source_file_name = format!("source.{}", sanitize_file_part(source_ext));
    let source_dest = project_folder.join(source_file_name);

    if let Some(source_path) = payload.source_path.clone() {
        let src = PathBuf::from(source_path);
        if !src.exists() {
            return Err("Source file path does not exist on disk.".to_string());
        }
        fs::copy(&src, &source_dest)
            .map_err(|e| format!("Failed to copy uploaded source file: {e}"))?;
    } else if let Some(source_bytes) = payload.source_bytes.clone() {
        fs::write(&source_dest, source_bytes)
            .map_err(|e| format!("Failed to write uploaded source bytes: {e}"))?;
    } else {
        return Err("Missing source upload path and source bytes.".to_string());
    }

    let probe = probe_media(&source_dest);
    let name = if payload.name.trim().is_empty() {
        strip_extension(&payload.file_name)
    } else {
        payload.name.clone()
    };

    let duration = if payload.duration > 0.0 {
        payload.duration
    } else {
        probe.duration
    };
    let width = if payload.resolution_width > 0 {
        payload.resolution_width
    } else {
        probe.width
    };
    let height = if payload.resolution_height > 0 {
        payload.resolution_height
    } else {
        probe.height
    };
    let file_size = if payload.file_size > 0 {
        payload.file_size
    } else {
        probe.file_size
    };
    let thumbnail_path = project_folder.join("thumbnail.jpg");
    let thumbnail_path_string = match extract_thumbnail_frame(
        &source_dest,
        &thumbnail_path,
        if duration > 6.0 { 2.0 } else { 0.0 },
    ) {
        Ok(()) => Some(thumbnail_path.to_string_lossy().to_string()),
        Err(error) => {
            eprintln!("Failed to generate upload project thumbnail: {error}");
            None
        }
    };

    conn.execute(
        r#"
        INSERT INTO projects (
            id, name, source_type, source_url, source_path, file_name, file_size,
            duration, resolution_width, resolution_height, created_at, status, thumbnail_path, updated_at, deleted_at
        ) VALUES (?1, ?2, 'upload', NULL, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'imported', ?10, ?9, NULL)
        "#,
        params![
            project_id,
            name,
            source_dest.to_string_lossy().to_string(),
            payload.file_name,
            file_size,
            duration,
            width,
            height,
            created_at,
            thumbnail_path_string
        ],
    )
    .map_err(|e| format!("Failed to insert upload project: {e}"))?;

    insert_project_source_record(
        &conn,
        &project_id,
        "upload",
        Some(payload.file_name),
        Some(source_dest.to_string_lossy().to_string()),
        None,
        Some(
            json!({
                "durationSec": duration,
                "resolutionWidth": width,
                "resolutionHeight": height,
                "fileSize": file_size
            })
            .to_string(),
        ),
    )?;

    get_project_by_id(&conn, &project_id)
}

#[tauri::command]
fn create_upload_project(app: tauri::AppHandle, payload: UploadProjectPayload) -> Result<StoredProject, String> {
    persist_upload_project(&app, payload)
}

#[tauri::command]
fn pick_upload_project(app: tauri::AppHandle) -> Result<Option<StoredProject>, String> {
    let selected_path = rfd::FileDialog::new()
        .set_title("Select a video to upload")
        .add_filter(
            "Video",
            &[
                "mp4", "mov", "m4v", "mkv", "avi", "webm", "wmv", "flv", "mpeg", "mpg", "mts", "m2ts",
            ],
        )
        .pick_file();

    let Some(source_path) = selected_path else {
        return Ok(None);
    };

    let file_name = source_path
        .file_name()
        .and_then(|name| name.to_str())
        .filter(|name| !name.trim().is_empty())
        .unwrap_or("upload.mp4")
        .to_string();

    let payload = UploadProjectPayload {
        name: strip_extension(&file_name),
        file_name,
        file_size: 0,
        duration: 0.0,
        resolution_width: 0,
        resolution_height: 0,
        source_path: Some(source_path.to_string_lossy().to_string()),
        source_bytes: None,
    };

    persist_upload_project(&app, payload).map(Some)
}

#[tauri::command]
fn fetch_link_info(url: String) -> Result<LinkInfoPayload, String> {
    if !command_exists("yt-dlp") {
        return Err("yt-dlp is not installed. Install it to inspect YouTube links in the desktop app.".to_string());
    }

    let metadata = extract_link_metadata(url.trim())?;
    let formats = metadata
        .get("formats")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();
    let mut heights = collect_heights_from_formats(&formats);

    if heights.is_empty() {
        if let Some(height) = metadata.get("height").and_then(Value::as_i64) {
            let height = height as i32;
            if height > 0 {
                heights.push(height.min(1440));
            }
        }
    }

    let max_height = heights.last().copied().unwrap_or(0);
    Ok(LinkInfoPayload {
        title: metadata.get("title").and_then(Value::as_str).map(|value| value.to_string()),
        duration: metadata.get("duration").and_then(Value::as_f64).unwrap_or(0.0),
        max_height,
        quality_options: build_quality_options(max_height),
    })
}

#[tauri::command]
fn create_link_project(app: tauri::AppHandle, url: String, quality: Option<i32>) -> Result<StoredProject, String> {
    if !command_exists("yt-dlp") {
        return Err("yt-dlp is not installed. Install it to import YouTube links.".to_string());
    }

    let conn = open_db(&app)?;
    let project_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    let project_folder = project_dir(&app, &project_id)?;
    fs::create_dir_all(project_folder.join("clips"))
        .map_err(|e| format!("Failed to create project folder: {e}"))?;

    let requested_height = sanitize_quality(quality);
    let metadata = extract_link_metadata(url.trim()).ok();
    let out_template = project_folder.join("source.%(ext)s");
    let download_args = vec![
        "--no-playlist".to_string(),
        "--restrict-filenames".to_string(),
        "--no-warnings".to_string(),
        "--no-part".to_string(),
        "--retries".to_string(),
        "10".to_string(),
        "--fragment-retries".to_string(),
        "10".to_string(),
        "-f".to_string(),
        format_selector_for_max_height(requested_height),
        "--merge-output-format".to_string(),
        "mp4".to_string(),
        "-o".to_string(),
        out_template.to_string_lossy().to_string(),
        "--print".to_string(),
        "after_move:filepath".to_string(),
        url.clone(),
    ];

    let download_output = run_yt_dlp_with_fallback(&download_args)
        .map_err(|error| format!("yt-dlp failed: {error}"))?;

    let output_lines: Vec<String> = String::from_utf8_lossy(&download_output.stdout)
        .lines()
        .map(|line| line.trim().to_string())
        .filter(|line| !line.is_empty())
        .collect();
    let downloaded_path = output_lines.last().map(PathBuf::from);
    let source_path = downloaded_path
        .filter(|path| path.exists())
        .unwrap_or(find_downloaded_source(&project_folder)?);
    let probe = probe_media(&source_path);
    let file_name = source_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("source.mp4")
        .to_string();
    let project_name = metadata
        .as_ref()
        .and_then(|value| value.get("title"))
        .and_then(Value::as_str)
        .map(|value| value.to_string())
        .unwrap_or_else(|| strip_extension(&file_name));
    let thumbnail_path = project_folder.join("thumbnail.jpg");
    let thumbnail_path_string = match extract_thumbnail_frame(
        &source_path,
        &thumbnail_path,
        if probe.duration > 6.0 { 2.0 } else { 0.0 },
    ) {
        Ok(()) => Some(thumbnail_path.to_string_lossy().to_string()),
        Err(error) => {
            eprintln!("Failed to generate link project thumbnail: {error}");
            None
        }
    };

    conn.execute(
        r#"
        INSERT INTO projects (
            id, name, source_type, source_url, source_path, file_name, file_size,
            duration, resolution_width, resolution_height, created_at, status, thumbnail_path, updated_at, deleted_at
        ) VALUES (?1, ?2, 'link', ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'imported', ?11, ?10, NULL)
        "#,
        params![
            project_id,
            project_name,
            url,
            source_path.to_string_lossy().to_string(),
            file_name,
            probe.file_size,
            probe.duration,
            probe.width,
            probe.height,
            created_at,
            thumbnail_path_string
        ],
    )
    .map_err(|e| format!("Failed to insert URL project: {e}"))?;

    insert_project_source_record(
        &conn,
        &project_id,
        "link",
        Some(file_name),
        Some(source_path.to_string_lossy().to_string()),
        Some(url),
        Some(
            json!({
                "durationSec": probe.duration,
                "resolutionWidth": probe.width,
                "resolutionHeight": probe.height,
                "fileSize": probe.file_size
            })
            .to_string(),
        ),
    )?;

    get_project_by_id(&conn, &project_id)
}

#[tauri::command]
fn ensure_project_thumbnail(app: tauri::AppHandle, project_id: String) -> Result<StoredProject, String> {
    let conn = open_db(&app)?;
    let (source_path, duration, current_thumbnail): (String, f64, Option<String>) = conn
        .query_row(
            "SELECT source_path, duration, thumbnail_path FROM projects WHERE id = ?1",
            [project_id.clone()],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .optional()
        .map_err(|e| format!("Failed to load project thumbnail state: {e}"))?
        .ok_or_else(|| "Project not found".to_string())?;

    if let Some(path) = current_thumbnail {
        let thumb = PathBuf::from(&path);
        if thumb.exists() {
            return get_project_by_id(&conn, &project_id);
        }
    }

    let project_folder = project_dir(&app, &project_id)?;
    let thumbnail_path = project_folder.join("thumbnail.jpg");
    extract_thumbnail_frame(
        Path::new(&source_path),
        &thumbnail_path,
        if duration > 6.0 { 2.0 } else { 0.0 },
    )?;

    conn.execute(
        "UPDATE projects SET thumbnail_path = ?1, updated_at = ?2 WHERE id = ?3",
        params![thumbnail_path.to_string_lossy().to_string(), now_iso(), project_id],
    )
    .map_err(|e| format!("Failed to persist project thumbnail: {e}"))?;

    get_project_by_id(&conn, &project_id)
}

#[tauri::command]
fn load_project_preview_blob(app: tauri::AppHandle, project_id: String) -> Result<Vec<u8>, String> {
    let conn = open_db(&app)?;
    let source_path: String = conn
        .query_row(
            "SELECT source_path FROM projects WHERE id = ?1",
            [project_id],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| format!("Failed to load preview source path: {e}"))?
        .ok_or_else(|| "Project not found".to_string())?;

    let preview_proxy_path = ensure_project_preview_proxy_file(Path::new(&source_path))?;
    fs::read(&preview_proxy_path).map_err(|e| format!("Failed to read preview proxy: {e}"))
}

#[tauri::command]
fn prepare_project_preview(app: tauri::AppHandle, project_id: String) -> Result<String, String> {
    let conn = open_db(&app)?;
    let source_path: String = conn
        .query_row(
            "SELECT source_path FROM projects WHERE id = ?1",
            [project_id],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| format!("Failed to load preview source path: {e}"))?
        .ok_or_else(|| "Project not found".to_string())?;

    let preview_proxy_path = ensure_project_preview_proxy_file(Path::new(&source_path))?;
    Ok(preview_proxy_path.to_string_lossy().to_string())
}

#[tauri::command]
fn load_project_thumbnail_blob(app: tauri::AppHandle, project_id: String) -> Result<Vec<u8>, String> {
    let project = ensure_project_thumbnail(app, project_id)?;
    let thumbnail_path = project
        .thumbnail_path
        .ok_or_else(|| "Project thumbnail path is missing".to_string())?;
    fs::read(thumbnail_path).map_err(|e| format!("Failed to read project thumbnail: {e}"))
}

#[tauri::command]
fn clear_project_clips(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let conn = open_db(&app)?;

    let mut stmt = conn
        .prepare("SELECT video_path FROM clips WHERE project_id = ?1")
        .map_err(|e| format!("Failed to query clip files: {e}"))?;
    let paths = stmt
        .query_map([project_id.clone()], |row| row.get::<_, String>(0))
        .map_err(|e| format!("Failed to read clip file rows: {e}"))?;

    for path in paths {
        let Ok(path) = path else {
            continue;
        };
        let p = PathBuf::from(path);
        if p.exists() {
            let _ = fs::remove_file(p);
        }
    }

    let mut thumb_stmt = conn
        .prepare("SELECT thumbnail_path FROM clips WHERE project_id = ?1")
        .map_err(|e| format!("Failed to query clip thumbnails: {e}"))?;
    let thumb_paths = thumb_stmt
        .query_map([project_id.clone()], |row| row.get::<_, Option<String>>(0))
        .map_err(|e| format!("Failed to read clip thumbnail rows: {e}"))?;

    for thumb_path in thumb_paths {
        let Ok(Some(path)) = thumb_path else {
            continue;
        };
        let p = PathBuf::from(path);
        if p.exists() {
            let _ = fs::remove_file(p);
        }
    }

    conn.execute("DELETE FROM clips WHERE project_id = ?1", [project_id])
        .map_err(|e| format!("Failed to clear project clips: {e}"))?;
    Ok(())
}

fn prepare_processing_source_impl(
    app: tauri::AppHandle,
    project_id: String,
    start_ms: u64,
    end_ms: u64,
) -> Result<PreparedProcessingSource, String> {
    if end_ms <= start_ms {
        return Err("Selected processing timeframe must be at least 1 second long.".to_string());
    }

    let conn = open_db(&app)?;
    let source_path: String = conn
        .query_row(
            "SELECT source_path FROM projects WHERE id = ?1",
            [project_id.clone()],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| format!("Failed to load project source path: {e}"))?
        .ok_or_else(|| "Project not found".to_string())?;

    let source_path = PathBuf::from(source_path);
    if !source_path.exists() {
        return Err("Project source video file not found on disk.".to_string());
    }

    let processing_dir = project_dir(&app, &project_id)?.join("processing");
    fs::create_dir_all(&processing_dir)
        .map_err(|e| format!("Failed to create processing folder: {e}"))?;

    let output_path = processing_dir.join(format!("selected_source_{}_{}.mp4", start_ms, end_ms));
    if !output_path.exists() {
        trim_media_to_range(&source_path, &output_path, start_ms, end_ms)?;
    }

    let duration_sec = ((end_ms - start_ms) as f64) / 1000.0;
    let thumbnail_path = processing_dir.join(format!("selected_source_{}_{}.jpg", start_ms, end_ms));
    let thumbnail_path_string = match extract_thumbnail_frame(
        &output_path,
        &thumbnail_path,
        if duration_sec > 3.0 { 1.0 } else { 0.0 },
    ) {
        Ok(()) => Some(thumbnail_path.to_string_lossy().to_string()),
        Err(error) => {
            eprintln!("Failed to generate selected range thumbnail: {error}");
            None
        }
    };

    Ok(PreparedProcessingSource {
        source_path: output_path.to_string_lossy().to_string(),
        duration_sec,
        thumbnail_path: thumbnail_path_string,
    })
}

fn generate_clip_native_impl(
    app: tauri::AppHandle,
    project_id: String,
    source_path: Option<String>,
    start_ms: u64,
    end_ms: u64,
    index: u32,
    hook: String,
    reason: String,
    score: i32,
    selected: bool,
    aspect_ratio: Option<String>,
    burn_subtitles: bool,
    timeline_start_ms: Option<u64>,
    timeline_end_ms: Option<u64>,
) -> Result<StoredClip, String> {
    let conn = open_db(&app)?;
    let (project_source_path, project_source_width, project_source_height): (String, i32, i32) = conn
        .query_row(
            "SELECT source_path, resolution_width, resolution_height FROM projects WHERE id = ?1",
            [project_id.clone()],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .optional()
        .map_err(|e| format!("Failed to load project source path: {e}"))?
        .ok_or_else(|| "Project not found".to_string())?;

    let source_path = PathBuf::from(source_path.unwrap_or(project_source_path));
    if !source_path.exists() {
        return Err("Clip source video file not found on disk.".to_string());
    }

    let probe = probe_media(&source_path);
    let source_width = if probe.width > 0 { probe.width } else { project_source_width };
    let source_height = if probe.height > 0 { probe.height } else { project_source_height };

    let clips_folder = project_dir(&app, &project_id)?.join("clips");
    fs::create_dir_all(&clips_folder)
        .map_err(|e| format!("Failed to create clips folder: {e}"))?;

    let clip_id = Uuid::new_v4().to_string();
    let output_name = format!("clip_{:03}_{}_{}.mp4", index, start_ms, end_ms);
    let output_path = clips_folder.join(output_name);
    let persisted_aspect_ratio = aspect_ratio.unwrap_or_else(|| "9:16".to_string());
    let mode = run_ffmpeg_clip_with_aspect_ratio(
        &source_path,
        &output_path,
        start_ms,
        end_ms,
        Some(source_width),
        Some(source_height),
        Some(persisted_aspect_ratio.as_str()),
    )?;

    if burn_subtitles {
        let transcript = run_faster_whisper_transcription(&output_path, "medium")?;
        burn_subtitles_into_video(&output_path, &transcript)?;
    }

    let clip_duration_sec = ((end_ms - start_ms) as f64) / 1000.0;
    let thumbnail_path = clips_folder.join(format!("clip_{:03}_{}_{}.jpg", index, start_ms, end_ms));
    let thumbnail_path_string = match extract_thumbnail_frame(
        &output_path,
        &thumbnail_path,
        if clip_duration_sec > 3.0 { 1.0 } else { 0.0 },
    ) {
        Ok(()) => Some(thumbnail_path.to_string_lossy().to_string()),
        Err(error) => {
            eprintln!("Failed to generate clip thumbnail: {error}");
            None
        }
    };
    let created_at = now_iso();

    conn.execute(
        r#"
        INSERT INTO clips (
            id, project_id, start_ms, end_ms, hook, reason, score,
            selected, video_path, created_at, processing_mode, updated_at, workflow_id, thumbnail_path, aspect_ratio
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?10, NULL, ?12, ?13)
        "#,
        params![
            clip_id,
            project_id,
            timeline_start_ms.unwrap_or(start_ms) as i64,
            timeline_end_ms.unwrap_or(end_ms) as i64,
            hook,
            reason,
            score,
            if selected { 1 } else { 0 },
            output_path.to_string_lossy().to_string(),
            created_at,
            mode,
            thumbnail_path_string,
            persisted_aspect_ratio
        ],
    )
    .map_err(|e| format!("Failed to persist clip: {e}"))?;

    conn.execute(
        "UPDATE projects SET status = 'ready', updated_at = ?1 WHERE id = ?2",
        params![now_iso(), project_id],
    )
    .map_err(|e| format!("Failed to update project status after clip generation: {e}"))?;

    get_clip_by_id(&conn, &clip_id)
}

#[tauri::command]
async fn prepare_processing_source(
    app: tauri::AppHandle,
    project_id: String,
    start_ms: u64,
    end_ms: u64,
) -> Result<PreparedProcessingSource, String> {
    tauri::async_runtime::spawn_blocking(move || {
        prepare_processing_source_impl(app, project_id, start_ms, end_ms)
    })
    .await
    .map_err(|e| format!("Failed to join processing source task: {e}"))?
}

#[tauri::command]
async fn generate_clip_native(
    app: tauri::AppHandle,
    project_id: String,
    source_path: Option<String>,
    start_ms: u64,
    end_ms: u64,
    index: u32,
    hook: String,
    reason: String,
    score: i32,
    selected: bool,
    aspect_ratio: Option<String>,
    burn_subtitles: bool,
    timeline_start_ms: Option<u64>,
    timeline_end_ms: Option<u64>,
) -> Result<StoredClip, String> {
    tauri::async_runtime::spawn_blocking(move || {
        generate_clip_native_impl(
            app,
            project_id,
            source_path,
            start_ms,
            end_ms,
            index,
            hook,
            reason,
            score,
            selected,
            aspect_ratio,
            burn_subtitles,
            timeline_start_ms,
            timeline_end_ms,
        )
    })
    .await
    .map_err(|e| format!("Failed to join clip generation task: {e}"))?
}

fn burn_clip_subtitles_impl(
    app: tauri::AppHandle,
    clip_id: String,
    model_size: String,
) -> Result<StoredClip, String> {
    let conn = open_db(&app)?;
    let clip_state: (String, String, Option<String>, i64, i64) = conn
        .query_row(
            "SELECT project_id, video_path, thumbnail_path, start_ms, end_ms FROM clips WHERE id = ?1",
            [clip_id.clone()],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?)),
        )
        .optional()
        .map_err(|e| format!("Failed to load clip for subtitle burn: {e}"))?
        .ok_or_else(|| "Clip not found".to_string())?;

    let (project_id, video_path, thumbnail_path, start_ms, end_ms) = clip_state;
    let video_path = PathBuf::from(video_path);
    if !video_path.exists() {
        return Err("Clip video file not found on disk.".to_string());
    }

    let transcript_from_project = get_project_transcript_row(&conn, &project_id)?
        .filter(|stored| stored.status == "complete" && !stored.words.is_empty())
        .map(|stored| TranscriptSidecarPayload {
            model_size: stored.model_size,
            language: stored.language,
            word_count: stored
                .words
                .iter()
                .filter(|word| word.end > start_ms && word.start < end_ms)
                .count(),
            words: stored
                .words
                .into_iter()
                .filter(|word| word.end > start_ms && word.start < end_ms)
                .map(|word| TranscriptWordRecord {
                    word: word.word,
                    start: (word.start - start_ms).max(0),
                    end: (word.end.min(end_ms) - start_ms).max(0),
                    confidence: word.confidence,
                })
                .collect(),
        })
        .filter(|payload| !payload.words.is_empty());

    let transcript = if let Some(payload) = transcript_from_project {
        payload
    } else {
        run_faster_whisper_transcription(&video_path, &model_size)?
    };

    if transcript.words.is_empty() {
        return Err("No transcript words were available for this clip subtitle burn.".to_string());
    }

    burn_subtitles_into_video(&video_path, &transcript)?;

    if let Some(thumbnail_path) = thumbnail_path {
        let thumbnail_path = PathBuf::from(thumbnail_path);
        let clip_duration_sec = ((end_ms - start_ms).max(0) as f64) / 1000.0;
        if let Err(error) = extract_thumbnail_frame(
            &video_path,
            &thumbnail_path,
            if clip_duration_sec > 3.0 { 1.0 } else { 0.0 },
        ) {
            eprintln!("Failed to refresh subtitled clip thumbnail: {error}");
        }
    }

    conn.execute(
        "UPDATE clips SET updated_at = ?1 WHERE id = ?2",
        params![now_iso(), clip_id.clone()],
    )
    .map_err(|e| format!("Failed to update clip after subtitle burn: {e}"))?;

    get_clip_by_id(&conn, &clip_id)
}

#[tauri::command]
async fn burn_clip_subtitles(
    app: tauri::AppHandle,
    clip_id: String,
    model_size: Option<String>,
) -> Result<StoredClip, String> {
    let model_size = model_size.unwrap_or_else(|| "medium".to_string());

    tauri::async_runtime::spawn_blocking(move || burn_clip_subtitles_impl(app, clip_id, model_size))
        .await
        .map_err(|e| format!("Failed to join subtitle burn task: {e}"))?
}

fn process_ai_reframe_video_impl(payload: AiReframePayload) -> Result<AiReframeResult, String> {
    let input_path = PathBuf::from(payload.input_path.trim());
    if !input_path.exists() || !input_path.is_file() {
        return Err("AI reframe input video file was not found on disk.".to_string());
    }

    let output_path = PathBuf::from(payload.output_path.trim());
    if output_path.as_os_str().is_empty() {
        return Err("AI reframe output path cannot be empty.".to_string());
    }

    if let Some(parent) = output_path.parent() {
        if !parent.as_os_str().is_empty() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create AI reframe output folder: {e}"))?;
        }
    }

    let output_width = payload.output_width.unwrap_or(720);
    let output_height = payload.output_height.unwrap_or(1280);
    if !((output_width == 720 && output_height == 1280)
        || (output_width == 1080 && output_height == 1920))
    {
        return Err("AI reframe output must be 720x1280 or 1080x1920.".to_string());
    }

    let detection_interval = payload.detection_interval.unwrap_or(2).clamp(1, 8);
    let python_path = resolve_python_path()
        .ok_or_else(|| "Python 3 was not found in a discoverable location.".to_string())?;
    let script_path = ai_reframe_script_path();

    if !script_path.is_file() {
        return Err(format!(
            "AI reframe helper script was not found at {}",
            script_path.to_string_lossy()
        ));
    }

    with_python_helper_lock("ai reframe", || {
        let output = Command::new(python_path)
            .arg("-u")
            .arg(script_path)
            .arg(&input_path)
            .arg(&output_path)
            .arg("--width")
            .arg(output_width.to_string())
            .arg("--height")
            .arg(output_height.to_string())
            .arg("--detection-interval")
            .arg(detection_interval.to_string())
            .output()
            .map_err(|e| format!("Failed to launch AI reframe helper: {e}"))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            return Err(if !stderr.is_empty() {
                stderr
            } else if !stdout.is_empty() {
                stdout
            } else {
                "AI reframe helper failed.".to_string()
            });
        }

        serde_json::from_slice::<AiReframeResult>(&output.stdout)
            .map_err(|e| format!("Failed to parse AI reframe output: {e}"))
    })
}

#[tauri::command]
async fn process_ai_reframe_video(payload: AiReframePayload) -> Result<AiReframeResult, String> {
    tauri::async_runtime::spawn_blocking(move || process_ai_reframe_video_impl(payload))
        .await
        .map_err(|e| format!("Failed to join AI reframe task: {e}"))?
}

#[tauri::command]
fn delete_clip(app: tauri::AppHandle, clip_id: String) -> Result<(), String> {
    let conn = open_db(&app)?;
    let clip_file_state: Option<(String, Option<String>)> = conn
        .query_row(
            "SELECT video_path, thumbnail_path FROM clips WHERE id = ?1",
            [clip_id.clone()],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .optional()
        .map_err(|e| format!("Failed to read clip: {e}"))?;

    conn.execute("DELETE FROM clips WHERE id = ?1", [clip_id])
        .map_err(|e| format!("Failed to delete clip row: {e}"))?;

    if let Some((path, thumbnail_path)) = clip_file_state {
        let p = PathBuf::from(path);
        if p.exists() {
            let _ = fs::remove_file(p);
        }
        if let Some(thumbnail_path) = thumbnail_path {
            let thumb = PathBuf::from(thumbnail_path);
            if thumb.exists() {
                let _ = fs::remove_file(thumb);
            }
        }
    }
    Ok(())
}

#[tauri::command]
fn delete_project(app: tauri::AppHandle, project_id: String) -> Result<(), String> {
    let conn = open_db(&app)?;

    conn.execute("DELETE FROM projects WHERE id = ?1", [project_id.clone()])
        .map_err(|e| format!("Failed to delete project row: {e}"))?;

    let dir = project_dir(&app, &project_id)?;
    if dir.exists() {
        let _ = fs::remove_dir_all(dir);
    }
    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}! You've been greeted from Rust!")
}

#[tauri::command]
fn export_clip(
    input_path: &str,
    output_path: &str,
    start_ms: u64,
    end_ms: u64,
    srt_content: &str,
) -> Result<String, String> {
    let temp_dir = env::temp_dir();
    let srt_path = temp_dir.join(format!(
        "clipforge_{}.srt",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_err(|e| format!("Time error: {e}"))?
            .as_millis()
    ));

    fs::write(&srt_path, srt_content).map_err(|e| format!("Failed to write SRT file: {e}"))?;
    let start_sec = (start_ms as f64) / 1000.0;
    let end_sec = (end_ms as f64) / 1000.0;
    let escaped_srt_path = srt_path
        .to_string_lossy()
        .to_string()
        .replace(':', "\\:");
    let vf_arg = format!("subtitles={escaped_srt_path}");
    let ffmpeg_path = resolve_binary_path("ffmpeg")
        .ok_or_else(|| "ffmpeg is not installed or not in a discoverable location.".to_string())?;

    let output = Command::new(ffmpeg_path)
        .arg("-y")
        .arg("-i")
        .arg(input_path)
        .arg("-ss")
        .arg(start_sec.to_string())
        .arg("-to")
        .arg(end_sec.to_string())
        .arg("-vf")
        .arg(vf_arg)
        .arg("-c:v")
        .arg("libx264")
        .arg("-c:a")
        .arg("aac")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to execute ffmpeg: {e}"))?;

    let _ = fs::remove_file(srt_path);

    if output.status.success() {
        Ok(format!("Export successful: {output_path}"))
    } else {
        Err(format!(
            "FFmpeg failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    cleanup_stale_python_helpers();
    start_media_server();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if let Some(startup_hash) = env::args().nth(1).filter(|arg| arg.starts_with("#/")) {
                if let Some(window) = app.get_webview_window("main") {
                    let startup_hash_json = serde_json::to_string(&startup_hash).unwrap_or_else(|_| "\"#/home\"".to_string());
                    let _ = window.eval(&format!(
                        "setTimeout(function() {{ window.location.hash = {startup_hash_json}; }}, 250);"
                    ));
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            init_library,
            list_projects,
            list_project_clips,
            list_project_sources,
            list_project_workflows,
            list_workflow_steps,
            list_workflow_renders,
            start_agent_workflow,
            create_upload_project,
            pick_upload_project,
            fetch_link_info,
            create_link_project,
            ensure_project_thumbnail,
            load_project_preview_blob,
            prepare_project_preview,
            load_project_thumbnail_blob,
            clear_project_clips,
            prepare_processing_source,
            generate_clip_native,
            burn_clip_subtitles,
            process_ai_reframe_video,
            upsert_caption,
            list_project_captions,
            transcribe_source,
            transcribe_video,
            get_project_transcript,
            upsert_notification_target,
            list_notification_targets,
            queue_notification,
            list_notifications,
            set_app_setting,
            get_app_setting,
            delete_clip,
            delete_project,
            export_clip
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
