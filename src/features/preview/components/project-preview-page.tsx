"use client"

import { useEffect, useMemo, useState } from "react"
import type { Route } from "next"
import Link from "next/link"

import { AppHeader } from "@/features/shared/components/app-header"
import { getMockProjectById } from "@/features/projects/mock-projects"

type ProjectPreviewPageProps = {
  projectId: string
}

type ApiEnvelope<T> = {
  data: T
}

type ApiErrorEnvelope = {
  error?: {
    message?: string
  }
}

type ProjectResponse = {
  title: string
  status: string
  scenes: Array<{
    id: string
    orderIndex: number
    status: string
    contextText: string | null
    sourceImageUrl: string | null
    thumbnailUrl: string | null
    assets?: Array<{
      assetUrl: string
    }>
  }>
}

type PlaybackResponse = {
  isFallback: boolean
  isReducedMotion: boolean
  timelineJson?: {
    scenes?: Array<{
      sceneId: string
      orderIndex: number
      status: string
      sourceImageUrl: string | null
      thumbnailUrl: string | null
      fallback: boolean
      startsAtMs: number
      durationMs: number
      cameraMovement: string
      intensity: string
    }>
  }
}

type PreviewScene = {
  id: string
  orderIndex: number
  status: string
  title: string
  detail: string
  imageUrl: string | null
  fallback: boolean
}

type PreviewState = {
  isLoading: boolean
  errorMessage: string | null
  projectTitle: string
  projectStatus: string
  isFallback: boolean
  isReducedMotion: boolean
  scenes: PreviewScene[]
}

const initialState: PreviewState = {
  isLoading: true,
  errorMessage: null,
  projectTitle: "Project Preview",
  projectStatus: "draft",
  isFallback: false,
  isReducedMotion: false,
  scenes: [],
}

function isRenderableImageUrl(value: string | null | undefined) {
  if (!value) {
    return false
  }

  return value.startsWith("https://") || value.startsWith("http://") || value.startsWith("/") || value.startsWith("data:")
}

function resolveProjectSceneImage(scene: ProjectResponse["scenes"][number]) {
  if (isRenderableImageUrl(scene.sourceImageUrl)) {
    return scene.sourceImageUrl
  }

  if (isRenderableImageUrl(scene.thumbnailUrl)) {
    return scene.thumbnailUrl
  }

  const assetUrl = scene.assets?.find((asset) => isRenderableImageUrl(asset.assetUrl))?.assetUrl
  return assetUrl ?? null
}

async function parseResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json")
    ? ((await response.json().catch(() => null)) as ApiEnvelope<T> | ApiErrorEnvelope | null)
    : null

  if (!response.ok) {
    throw new Error(payload && "error" in payload ? payload.error?.message ?? "Unable to load preview data." : "Unable to load preview data.")
  }

  if (!payload || !("data" in payload)) {
    throw new Error("Unexpected response from the server.")
  }

  return payload.data
}

function normalizeProject(project: ProjectResponse | null | undefined) {
  return {
    title: project?.title ?? "Project Preview",
    status: project?.status ?? "draft",
    scenes: Array.isArray(project?.scenes) ? project.scenes : [],
  }
}

function normalizePlayback(playback: PlaybackResponse | null) {
  return {
    isFallback: playback?.isFallback ?? false,
    isReducedMotion: playback?.isReducedMotion ?? false,
    scenes: Array.isArray(playback?.timelineJson?.scenes) ? playback.timelineJson.scenes : [],
  }
}

function formatSceneTitle(index: number) {
  return `Scene ${String(index + 1).padStart(2, "0")}`
}

function formatSceneDetail(source: { startsAtMs?: number; durationMs?: number; contextText?: string | null; cameraMovement?: string }) {
  if (source.contextText) {
    return source.contextText
  }

  if (typeof source.startsAtMs === "number" && typeof source.durationMs === "number") {
    const startSeconds = (source.startsAtMs / 1000).toFixed(1)
    const durationSeconds = (source.durationMs / 1000).toFixed(1)
    const movement = source.cameraMovement ? ` - ${source.cameraMovement}` : ""
    return `Starts at ${startSeconds}s for ${durationSeconds}s${movement}`
  }

  return "Preview section ready for scroll playback."
}

export function ProjectPreviewPage({ projectId }: ProjectPreviewPageProps) {
  const [state, setState] = useState<PreviewState>(initialState)

  useEffect(() => {
    let cancelled = false

    async function loadPreview() {
      setState(initialState)

      try {
        const mockProject = getMockProjectById(projectId)

        if (mockProject) {
          const mockScenes = mockProject.scenes.map((scene, index) => ({
            id: scene.id,
            orderIndex: index,
            status: scene.status,
            title: formatSceneTitle(index),
            detail: formatSceneDetail({ contextText: scene.contextText }),
            imageUrl: scene.image,
            fallback: false,
          }))

          setState({
            isLoading: false,
            errorMessage: null,
            projectTitle: mockProject.title,
            projectStatus: mockProject.status,
            isFallback: true,
            isReducedMotion: false,
            scenes: mockScenes,
          })
          return
        }

        const [projectResult, playbackResult] = await Promise.allSettled([
          fetch(`/api/v1/projects/${projectId}`, { cache: "no-store" }).then((response) => parseResponse<ProjectResponse>(response)),
          fetch(`/api/v1/projects/${projectId}/preview/playback`, { cache: "no-store" }).then((response) =>
            parseResponse<PlaybackResponse>(response),
          ),
        ])

        if (cancelled) {
          return
        }

        if (projectResult.status !== "fulfilled") {
          setState({
            ...initialState,
            isLoading: false,
            errorMessage: "This project preview could not be loaded.",
          })
          return
        }

        const project = normalizeProject(projectResult.value)
        const playback = normalizePlayback(playbackResult.status === "fulfilled" ? playbackResult.value : null)

        const scenesFromPlayback = playback.scenes
          .map((scene, index) => {
            const projectScene = project.scenes.find((item) => item.id === scene.sceneId)

            return {
              id: scene.sceneId,
              orderIndex: scene.orderIndex,
              status: scene.status,
              title: formatSceneTitle(index),
              detail: formatSceneDetail({
                startsAtMs: scene.startsAtMs,
                durationMs: scene.durationMs,
                cameraMovement: scene.cameraMovement,
                contextText: projectScene?.contextText,
              }),
              imageUrl:
                (isRenderableImageUrl(scene.sourceImageUrl) ? scene.sourceImageUrl : null) ??
                (isRenderableImageUrl(scene.thumbnailUrl) ? scene.thumbnailUrl : null) ??
                (projectScene ? resolveProjectSceneImage(projectScene) : null),
              fallback: scene.fallback,
            }
          })
          .sort((left, right) => left.orderIndex - right.orderIndex)

        const scenesFromProject = project.scenes
          .map((scene, index) => ({
            id: scene.id,
            orderIndex: scene.orderIndex,
            status: scene.status,
            title: formatSceneTitle(index),
            detail: formatSceneDetail({ contextText: scene.contextText }),
            imageUrl: resolveProjectSceneImage(scene),
            fallback: false,
          }))
          .sort((left, right) => left.orderIndex - right.orderIndex)

        setState({
          isLoading: false,
          errorMessage: null,
          projectTitle: project.title,
          projectStatus: project.status,
          isFallback: playback.isFallback,
          isReducedMotion: playback.isReducedMotion,
          scenes: scenesFromPlayback.length > 0 ? scenesFromPlayback : scenesFromProject,
        })
      } catch {
        if (!cancelled) {
          setState({
            ...initialState,
            isLoading: false,
            errorMessage: "This project preview could not be loaded.",
          })
        }
      }
    }

    void loadPreview()

    return () => {
      cancelled = true
    }
  }, [projectId])

  const previewCountLabel = useMemo(() => {
    if (state.scenes.length === 1) {
      return "1 scene"
    }

    return `${state.scenes.length} scenes`
  }, [state.scenes.length])

  return (
    <main className="misc-screen preview-screen">
      <AppHeader active="projects" />

      <section className="misc-shell misc-shell--wide preview-shell">
        <div className="misc-panel preview-page-panel">
          <div className="preview-page-header">
            <div>
              <p className="misc-kicker">Preview</p>
              <h1>{state.projectTitle}</h1>
              <p className="misc-copy">A mobile-first stitched scroll preview for project `{projectId}`.</p>
            </div>
            <div className="preview-page-header__actions">
              <div className="preview-page-badges">
                <span>{previewCountLabel}</span>
                <span>{state.projectStatus}</span>
                {state.isFallback ? <span>Fallback playback</span> : null}
                {state.isReducedMotion ? <span>Reduced motion</span> : null}
              </div>
              <Link className="misc-button misc-button--secondary" href={`/projects/${projectId}/editor` as Route}>
                Back to Editor
              </Link>
            </div>
          </div>

          {state.isLoading ? (
            <div className="preview-empty-state">
              <div className="preview-empty-state__phone" />
              <div>
                <h2>Loading preview</h2>
                <p>Gathering scene order, images, and playback details for this project.</p>
              </div>
            </div>
          ) : null}

          {!state.isLoading && state.errorMessage ? (
            <div className="preview-empty-state preview-empty-state--error">
              <div>
                <h2>Preview unavailable</h2>
                <p>{state.errorMessage}</p>
              </div>
            </div>
          ) : null}

          {!state.isLoading && !state.errorMessage && state.scenes.length === 0 ? (
            <div className="preview-empty-state">
              <div>
                <h2>No scenes yet</h2>
                <p>Upload images in the editor to build a stitched mobile preview for this project.</p>
              </div>
            </div>
          ) : null}

          {!state.isLoading && !state.errorMessage && state.scenes.length > 0 ? (
            <div className="preview-scroll-stack">
              {state.scenes.map((scene, index) => (
                <section className="preview-scene-section" key={scene.id}>
                  <div className="preview-scene-copy">
                    <p className="preview-scene-copy__eyebrow">{scene.title}</p>
                    <h2>{index === 0 ? "Opening frame" : "Next chapter"}</h2>
                    <p>{scene.detail}</p>
                    <div className="preview-scene-copy__badges">
                      <span>{scene.status}</span>
                      {scene.fallback ? <span>Fallback</span> : <span>Primary render</span>}
                    </div>
                  </div>

                  <div className="preview-phone preview-phone--scene">
                    <div className="preview-phone__chrome">
                      <span className="preview-phone__dot" />
                      <span>{scene.title}</span>
                    </div>

                    {scene.imageUrl ? (
                      <div className="preview-phone__scene-image" style={{ backgroundImage: `url("${scene.imageUrl}")` }} />
                    ) : (
                      <div className="preview-phone__scene-image preview-phone__scene-image--placeholder">
                        <div>
                          <strong>Image unavailable</strong>
                          <span>This scene is linked, but its asset URL is not public yet.</span>
                        </div>
                      </div>
                    )}

                    <div className="preview-phone__scene-overlay" />
                    <div className="preview-phone__scene-meta">
                      <span>{scene.title}</span>
                      <span>{index + 1} / {state.scenes.length}</span>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
