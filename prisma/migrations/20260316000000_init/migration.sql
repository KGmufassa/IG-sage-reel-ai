CREATE TYPE "AuthProvider" AS ENUM ('credentials', 'google');
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'ready', 'archived');
CREATE TYPE "SceneStatus" AS ENUM ('uploaded', 'queued', 'processing', 'ready', 'failed');
CREATE TYPE "AssetType" AS ENUM ('original', 'thumbnail', 'layer', 'composite', 'manifest');
CREATE TYPE "JobType" AS ENUM ('decomposition', 'motion', 'stitching');
CREATE TYPE "JobStatus" AS ENUM ('queued', 'processing', 'ready', 'failed');
CREATE TYPE "ExportStatus" AS ENUM ('pending', 'locked', 'ready', 'failed');

CREATE TABLE "users" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "auth_provider" "AuthProvider" NOT NULL,
  "password_hash" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "guest_sessions" (
  "id" UUID NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "claimed_at" TIMESTAMPTZ,
  "claimed_by_user_id" UUID,
  "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "projects" (
  "id" UUID NOT NULL,
  "owner_id" UUID,
  "guest_session_id" UUID,
  "title" TEXT NOT NULL,
  "global_context" TEXT,
  "style_preset" TEXT,
  "output_format" TEXT NOT NULL DEFAULT '9:16',
  "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
  "scroll_engine_version" TEXT,
  "expires_at" TIMESTAMPTZ,
  "claimed_at" TIMESTAMPTZ,
  "claimed_by_user_id" UUID,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "scenes" (
  "id" UUID NOT NULL,
  "project_id" UUID NOT NULL,
  "order_index" INTEGER NOT NULL,
  "generation_version" INTEGER NOT NULL DEFAULT 1,
  "source_image_url" TEXT,
  "thumbnail_url" TEXT,
  "context_text" TEXT,
  "motion_preset" TEXT,
  "motion_intensity" TEXT,
  "motion_blueprint_json" JSONB,
  "status" "SceneStatus" NOT NULL DEFAULT 'uploaded',
  "framing_data" JSONB,
  "mobile_render_hints" JSONB,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "scenes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "scene_assets" (
  "id" UUID NOT NULL,
  "scene_id" UUID NOT NULL,
  "asset_type" "AssetType" NOT NULL,
  "asset_url" TEXT NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "layer_order" INTEGER,
  "metadata_json" JSONB,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "scene_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "processing_jobs" (
  "id" UUID NOT NULL,
  "scene_id" UUID NOT NULL,
  "job_type" "JobType" NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'queued',
  "provider_job_id" TEXT,
  "correlation_id" TEXT,
  "attempt_count" INTEGER NOT NULL DEFAULT 0,
  "error_message" TEXT,
  "metadata_json" JSONB,
  "started_at" TIMESTAMPTZ,
  "completed_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "processing_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "playback_plans" (
  "id" UUID NOT NULL,
  "project_id" UUID NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "timeline_json" JSONB NOT NULL,
  "is_reduced_motion" BOOLEAN NOT NULL DEFAULT false,
  "is_fallback" BOOLEAN NOT NULL DEFAULT false,
  "export_status" "ExportStatus" NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "playback_plans_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "guest_sessions_expires_at_idx" ON "guest_sessions"("expires_at");
CREATE INDEX "guest_sessions_claimed_by_user_id_idx" ON "guest_sessions"("claimed_by_user_id");
CREATE INDEX "projects_owner_id_idx" ON "projects"("owner_id");
CREATE INDEX "projects_guest_session_id_idx" ON "projects"("guest_session_id");
CREATE INDEX "projects_status_idx" ON "projects"("status");
CREATE INDEX "projects_expires_at_idx" ON "projects"("expires_at");
CREATE INDEX "projects_claimed_by_user_id_idx" ON "projects"("claimed_by_user_id");
CREATE INDEX "scenes_project_id_idx" ON "scenes"("project_id");
CREATE INDEX "scenes_status_idx" ON "scenes"("status");
CREATE UNIQUE INDEX "scenes_project_id_order_index_key" ON "scenes"("project_id", "order_index");
CREATE INDEX "scene_assets_scene_id_idx" ON "scene_assets"("scene_id");
CREATE INDEX "scene_assets_asset_type_idx" ON "scene_assets"("asset_type");
CREATE INDEX "processing_jobs_scene_id_idx" ON "processing_jobs"("scene_id");
CREATE INDEX "processing_jobs_status_idx" ON "processing_jobs"("status");
CREATE INDEX "processing_jobs_scene_id_job_type_status_idx" ON "processing_jobs"("scene_id", "job_type", "status");
CREATE INDEX "playback_plans_project_id_idx" ON "playback_plans"("project_id");

ALTER TABLE "projects"
ADD CONSTRAINT "projects_owner_id_fkey"
FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "projects"
ADD CONSTRAINT "projects_guest_session_id_fkey"
FOREIGN KEY ("guest_session_id") REFERENCES "guest_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "scenes"
ADD CONSTRAINT "scenes_project_id_fkey"
FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "scene_assets"
ADD CONSTRAINT "scene_assets_scene_id_fkey"
FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "processing_jobs"
ADD CONSTRAINT "processing_jobs_scene_id_fkey"
FOREIGN KEY ("scene_id") REFERENCES "scenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playback_plans"
ADD CONSTRAINT "playback_plans_project_id_fkey"
FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
