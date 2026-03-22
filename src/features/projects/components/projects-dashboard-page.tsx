"use client"

import { useEffect, useMemo, useState } from "react"

import { AppHeader } from "@/features/shared/components/app-header"
import { AppIcon } from "@/features/shared/components/app-icon"
import { mockProjects } from "@/features/projects/mock-projects"

import { ProjectCard } from "./project-card"

type ViewMode = "carousel" | "grid"

type ApiEnvelope<T> = {
  data: T
}

type ApiErrorEnvelope = {
  error?: {
    message?: string
  }
}

type ProjectSummary = {
  id: string
  title: string
  updatedAt: string
  scenes: Array<{
    sourceImageUrl: string | null
    thumbnailUrl: string | null
    assets?: Array<{
      assetUrl: string
    }>
  }>
}

type DashboardProject = {
  title: string
  scenes: string
  updatedAt: string
  projectId: string
  image: string | null
}

function mapProjectToDashboardProject(project: {
  id: string
  title: string
  updatedAt: string
  scenes: Array<{
    sourceImageUrl?: string | null
    thumbnailUrl?: string | null
    assets?: Array<{
      assetUrl: string
    }>
    image?: string
  }>
}) {
  return {
    title: project.title,
    scenes: String(Array.isArray(project.scenes) ? project.scenes.length : 0),
    updatedAt: formatUpdatedAt(project.updatedAt),
    projectId: project.id,
    image: resolveProjectImage({
      ...project,
      scenes: (Array.isArray(project.scenes) ? project.scenes : []).map((scene) => ({
        sourceImageUrl: scene.sourceImageUrl ?? scene.image ?? null,
        thumbnailUrl: scene.thumbnailUrl ?? scene.image ?? null,
        assets: scene.assets,
      })),
    }),
  }
}

const mockDashboardProjects = mockProjects.map((project) =>
  mapProjectToDashboardProject({
    ...project,
    scenes: project.scenes.map((scene) => ({ image: scene.image })),
  }),
)

const PROJECTS_PER_PAGE = 4

function isRenderableImageUrl(value: string | null | undefined) {
  if (!value) {
    return false
  }

  return value.startsWith("https://") || value.startsWith("http://") || value.startsWith("/") || value.startsWith("data:")
}

function formatUpdatedAt(value: string) {
  const updatedAt = new Date(value)
  const distanceMs = Date.now() - updatedAt.getTime()

  if (Number.isNaN(updatedAt.getTime()) || distanceMs < 0) {
    return "just now"
  }

  const hours = Math.floor(distanceMs / (60 * 60 * 1000))

  if (hours < 1) {
    return "just now"
  }

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function resolveProjectImage(project: ProjectSummary) {
  const scenes = Array.isArray(project.scenes) ? project.scenes : []
  const firstScene = scenes[0]

  if (!firstScene) {
    return null
  }

  if (isRenderableImageUrl(firstScene.thumbnailUrl)) {
    return firstScene.thumbnailUrl
  }

  if (isRenderableImageUrl(firstScene.sourceImageUrl)) {
    return firstScene.sourceImageUrl
  }

  const assetUrl = firstScene.assets?.find((asset) => isRenderableImageUrl(asset.assetUrl))?.assetUrl
  return assetUrl ?? null
}

function normalizeProjects(payload: ApiEnvelope<ProjectSummary[]> | null | undefined) {
  return Array.isArray(payload?.data) ? payload.data : []
}

async function parseJsonResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json")
    ? ((await response.json().catch(() => null)) as ApiEnvelope<T> | ApiErrorEnvelope | null)
    : null

  if (!response.ok) {
    throw new Error(payload && "error" in payload ? payload.error?.message ?? "Request failed." : "Request failed.")
  }

  if (!payload || !("data" in payload)) {
    throw new Error("Unexpected response from the server.")
  }

  return payload.data
}

async function ensureGuestSession() {
  const response = await fetch("/api/v1/guest-sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  await parseJsonResponse<{ id: string }>(response)
}

export function ProjectsDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [carouselPage, setCarouselPage] = useState(0)
  const [projects, setProjects] = useState<DashboardProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        let response = await fetch("/api/v1/projects", { cache: "no-store" })

        if (response.status === 401) {
          await ensureGuestSession()
          response = await fetch("/api/v1/projects", { cache: "no-store" })
        }

        if (cancelled) {
          return
        }

        const payload = await parseJsonResponse<ProjectSummary[]>(response)
        const projects = normalizeProjects({ data: payload })

        if (projects.length === 0) {
          setProjects(mockDashboardProjects)
          return
        }

        setProjects(
          projects.map((project) => mapProjectToDashboardProject(project)),
        )
      } catch {
        if (!cancelled) {
          setProjects(mockDashboardProjects)
          setErrorMessage(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadProjects()

    return () => {
      cancelled = true
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE))
  const carouselPages = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, pageIndex) => {
        const start = pageIndex * PROJECTS_PER_PAGE
        return projects.slice(start, start + PROJECTS_PER_PAGE)
      }),
    [projects, totalPages],
  )

  const setMode = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode !== "carousel") {
      setCarouselPage(0)
    }
  }

  return (
    <main className="projects-screen">
      <AppHeader active="projects" />

      <section className="projects-shell">
        <div className="projects-header-row">
          <div>
            <p className="projects-kicker">Library</p>
            <h1>Your Projects</h1>
            <p>
              Manage and preview your cinematic story sequences. You have {projects.length} active
              {projects.length === 1 ? " project" : " projects"} in your library.
            </p>
          </div>
          <button className="projects-mobile-create is-disabled" disabled type="button">
            <AppIcon className="projects-inline-icon" name="add" />
            Create New Sequence
          </button>
        </div>

        <div className="projects-controls-row">
          <label className="projects-search-field">
            <AppIcon className="projects-search-field__icon" name="search" />
            <input placeholder="Search by title or scene..." type="search" />
          </label>
          <div className="projects-controls-group">
            <div className="projects-view-toggle" aria-label="Project layout view">
              <button
                aria-label="Carousel view"
                aria-pressed={viewMode === "carousel"}
                data-active={viewMode === "carousel"}
                className={viewMode === "carousel" ? "projects-view-toggle__button is-active" : "projects-view-toggle__button"}
                onClick={() => setMode("carousel")}
                title="Carousel view"
                type="button"
              >
                <AppIcon className="projects-view-toggle__icon" name="view_carousel" />
              </button>
              <button
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                data-active={viewMode === "grid"}
                className={viewMode === "grid" ? "projects-view-toggle__button is-active" : "projects-view-toggle__button"}
                onClick={() => setMode("grid")}
                title="Grid view"
                type="button"
              >
                <AppIcon className="projects-view-toggle__icon" name="view_quilt" />
              </button>
            </div>
            <div className="projects-select-wrap">
              <select defaultValue="Sort by: Recent">
                <option>Sort by: Recent</option>
                <option>Sort by: Name</option>
                <option>Sort by: Scenes</option>
              </select>
              <AppIcon className="projects-select-wrap__icon" name="expand_more" />
            </div>
            <button className="projects-filter-button is-disabled" disabled type="button">
              <AppIcon className="projects-inline-icon" name="filter_list" />
              Filter
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="projects-empty-state">
            <div className="projects-empty-state__icon">
              <AppIcon className="projects-empty-state__icon-svg" name="hourglass_top" />
            </div>
            <div>
              <h3>Loading your projects</h3>
              <p>Fetching your latest stories and preview routes.</p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="projects-empty-state">
            <div className="projects-empty-state__icon">
              <AppIcon className="projects-empty-state__icon-svg" name="info" />
            </div>
            <div>
              <h3>Projects unavailable</h3>
              <p>{errorMessage}</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-empty-state">
            <div className="projects-empty-state__icon">
              <AppIcon className="projects-empty-state__icon-svg" name="create_new_folder" />
            </div>
            <div>
              <h3>Ready to start something new?</h3>
              <p>Harness the power of parallax layers and cinematic AI to bring your stories to life.</p>
            </div>
            <button className="projects-empty-state__button is-disabled" disabled type="button">
              New Project
            </button>
          </div>
        ) : viewMode === "carousel" ? (
          <section className="projects-carousel" aria-label="Projects carousel">
            <button
              aria-label="Previous projects"
              className="projects-carousel__nav"
              disabled={carouselPage === 0}
              onClick={() => setCarouselPage((page) => Math.max(0, page - 1))}
              type="button"
            >
              <AppIcon className="projects-inline-icon" name="arrow_back" />
            </button>

            <div className="projects-carousel__viewport">
              <div
                className="projects-carousel__track"
                style={{
                  width: `${carouselPages.length * 100}%`,
                  transform: `translateX(-${carouselPage * (100 / carouselPages.length)}%)`,
                }}
              >
                {carouselPages.map((pageProjects, pageIndex) => (
                  <div
                    className="projects-carousel__page"
                    key={`page-${pageIndex}`}
                    style={{ width: `${100 / carouselPages.length}%` }}
                  >
                    <div className="projects-grid projects-grid--carousel">
                      {pageProjects.map((project) => (
                        <ProjectCard key={project.projectId} {...project} viewMode="carousel" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              aria-label="Next projects"
              className="projects-carousel__nav projects-carousel__nav--next"
              disabled={carouselPage >= totalPages - 1}
              onClick={() => setCarouselPage((page) => Math.min(totalPages - 1, page + 1))}
              type="button"
            >
              <AppIcon className="projects-inline-icon" name="arrow_back" />
            </button>
          </section>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.projectId} {...project} viewMode={viewMode} />
            ))}
          </div>
        )}
      </section>

      <footer className="projects-footer">
        <div>
          <AppIcon className="projects-footer__icon" name="auto_awesome_motion" />
          <span>© 2024 Parallax Story Composer. All rights reserved.</span>
        </div>
        <div>
          {[
            "Documentation",
            "API Reference",
            "Support",
            "Terms",
          ].map((item) => (
            <button className="projects-footer__link is-disabled" disabled key={item} type="button">
              {item}
            </button>
          ))}
        </div>
      </footer>
    </main>
  )
}
