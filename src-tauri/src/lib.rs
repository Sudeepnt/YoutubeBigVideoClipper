use chrono::{SecondsFormat, Utc};
use rusqlite::{params, Connection, OptionalExtension, Row};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::Manager;
use uuid::Uuid;

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

fn command_exists(bin: &str) -> bool {
    Command::new(bin).arg("-version").output().is_ok()
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
        CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);
        "#,
    )
    .map_err(|e| format!("Failed to initialize extended schema: {e}"))?;

    conn.execute("PRAGMA user_version = 2", [])
        .map_err(|e| format!("Failed to set DB user_version: {e}"))?;
    Ok(())
}

fn open_db(app: &tauri::AppHandle) -> Result<Connection, String> {
    let conn = Connection::open(db_path(app)?).map_err(|e| format!("Failed to open DB: {e}"))?;
    init_schema_and_migrations(&conn)?;
    Ok(conn)
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
    conn.query_row(
        r#"
        SELECT
            id, project_id, start_ms, end_ms, hook, reason, score,
            selected, video_path, created_at, processing_mode
        FROM clips
        WHERE id = ?1
        "#,
        [clip_id],
        map_clip_row,
    )
    .map_err(|e| format!("Clip not found: {e}"))
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

    let output = Command::new("ffprobe")
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

fn run_ffmpeg_clip(source_path: &Path, output_path: &Path, start_ms: u64, end_ms: u64) -> Result<String, String> {
    if end_ms <= start_ms {
        return Err("Invalid clip range: end must be greater than start.".to_string());
    }
    if !command_exists("ffmpeg") {
        return Err("ffmpeg is not installed or not on PATH.".to_string());
    }

    let start_sec = format!("{:.3}", (start_ms as f64) / 1000.0);
    let duration_sec = format!("{:.3}", ((end_ms - start_ms) as f64) / 1000.0);

    let copy_out = Command::new("ffmpeg")
        .arg("-y")
        .arg("-ss")
        .arg(&start_sec)
        .arg("-t")
        .arg(&duration_sec)
        .arg("-i")
        .arg(source_path)
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

    let reencode_out = Command::new("ffmpeg")
        .arg("-y")
        .arg("-ss")
        .arg(&start_sec)
        .arg("-i")
        .arg(source_path)
        .arg("-t")
        .arg(&duration_sec)
        .arg("-c:v")
        .arg("libx264")
        .arg("-preset")
        .arg("veryfast")
        .arg("-c:a")
        .arg("aac")
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
                selected, video_path, created_at, processing_mode
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
        clips.push(row.map_err(|e| format!("Failed to read clip row: {e}"))?);
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

#[tauri::command]
fn create_upload_project(app: tauri::AppHandle, payload: UploadProjectPayload) -> Result<StoredProject, String> {
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

    conn.execute(
        r#"
        INSERT INTO projects (
            id, name, source_type, source_url, source_path, file_name, file_size,
            duration, resolution_width, resolution_height, created_at, status, thumbnail_path, updated_at, deleted_at
        ) VALUES (?1, ?2, 'upload', NULL, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'imported', NULL, ?9, NULL)
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
            created_at
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
fn create_link_project(app: tauri::AppHandle, url: String) -> Result<StoredProject, String> {
    if !command_exists("yt-dlp") {
        return Err("yt-dlp is not installed. Install it to import YouTube links.".to_string());
    }

    let conn = open_db(&app)?;
    let project_id = Uuid::new_v4().to_string();
    let created_at = now_iso();
    let project_folder = project_dir(&app, &project_id)?;
    fs::create_dir_all(project_folder.join("clips"))
        .map_err(|e| format!("Failed to create project folder: {e}"))?;

    let out_template = project_folder.join("source.%(ext)s");
    let download_output = Command::new("yt-dlp")
        .arg("--no-playlist")
        .arg("--restrict-filenames")
        .arg("-f")
        .arg("bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b")
        .arg("--merge-output-format")
        .arg("mp4")
        .arg("-o")
        .arg(out_template.to_string_lossy().to_string())
        .arg(&url)
        .output()
        .map_err(|e| format!("Failed to run yt-dlp: {e}"))?;

    if !download_output.status.success() {
        return Err(format!(
            "yt-dlp failed: {}",
            String::from_utf8_lossy(&download_output.stderr)
        ));
    }

    let source_path = find_downloaded_source(&project_folder)?;
    let probe = probe_media(&source_path);
    let file_name = source_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("source.mp4")
        .to_string();
    let project_name = strip_extension(&file_name);

    conn.execute(
        r#"
        INSERT INTO projects (
            id, name, source_type, source_url, source_path, file_name, file_size,
            duration, resolution_width, resolution_height, created_at, status, thumbnail_path, updated_at, deleted_at
        ) VALUES (?1, ?2, 'link', ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'imported', NULL, ?10, NULL)
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
            created_at
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

    conn.execute("DELETE FROM clips WHERE project_id = ?1", [project_id])
        .map_err(|e| format!("Failed to clear project clips: {e}"))?;
    Ok(())
}

#[tauri::command]
fn generate_clip_native(
    app: tauri::AppHandle,
    project_id: String,
    start_ms: u64,
    end_ms: u64,
    index: u32,
    hook: String,
    reason: String,
    score: i32,
    selected: bool,
) -> Result<StoredClip, String> {
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

    let clips_folder = project_dir(&app, &project_id)?.join("clips");
    fs::create_dir_all(&clips_folder)
        .map_err(|e| format!("Failed to create clips folder: {e}"))?;

    let clip_id = Uuid::new_v4().to_string();
    let output_name = format!("clip_{:03}_{}_{}.mp4", index, start_ms, end_ms);
    let output_path = clips_folder.join(output_name);
    let mode = run_ffmpeg_clip(&source_path, &output_path, start_ms, end_ms)?;
    let created_at = now_iso();

    conn.execute(
        r#"
        INSERT INTO clips (
            id, project_id, start_ms, end_ms, hook, reason, score,
            selected, video_path, created_at, processing_mode, updated_at, workflow_id, thumbnail_path
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?10, NULL, NULL)
        "#,
        params![
            clip_id,
            project_id,
            start_ms as i64,
            end_ms as i64,
            hook,
            reason,
            score,
            if selected { 1 } else { 0 },
            output_path.to_string_lossy().to_string(),
            created_at,
            mode
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
fn delete_clip(app: tauri::AppHandle, clip_id: String) -> Result<(), String> {
    let conn = open_db(&app)?;
    let clip_path: Option<String> = conn
        .query_row(
            "SELECT video_path FROM clips WHERE id = ?1",
            [clip_id.clone()],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| format!("Failed to read clip: {e}"))?;

    conn.execute("DELETE FROM clips WHERE id = ?1", [clip_id])
        .map_err(|e| format!("Failed to delete clip row: {e}"))?;

    if let Some(path) = clip_path {
        let p = PathBuf::from(path);
        if p.exists() {
            let _ = fs::remove_file(p);
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

    let output = Command::new("ffmpeg")
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
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
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
            create_link_project,
            clear_project_clips,
            generate_clip_native,
            upsert_caption,
            list_project_captions,
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
