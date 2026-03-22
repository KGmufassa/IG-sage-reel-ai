import type { Route } from "next"
import Link from "next/link"

import { AppIcon } from "@/features/shared/components/app-icon"

type ProjectCardProps = {
  title: string
  scenes: string
  updatedAt: string
  projectId: string
  image?: string | null
  viewMode?: "carousel" | "grid"
}

export function ProjectCard({ title, scenes, updatedAt, projectId, image, viewMode = "grid" }: ProjectCardProps) {
  const cardClassName =
    viewMode === "grid" ? "projects-card projects-card--grid-compact" : "projects-card"

  return (
    <article className={cardClassName}>
      <div className="projects-card__visual">
        <div className="projects-card__overlay" />
        <div className="projects-card__image" style={image ? { backgroundImage: `url("${image}")` } : undefined} />
        <div className="projects-card__meta">
          <h3>{title}</h3>
          <div>
            <span>
              <AppIcon className="projects-card__meta-icon" name="movie" />
              {scenes} Scenes
            </span>
            <span>
              <AppIcon className="projects-card__meta-icon" name="schedule" />
              {updatedAt}
            </span>
          </div>
        </div>
      </div>

      <div className="projects-card__actions">
        <Link className="projects-button projects-button--solid" href={`/projects/${projectId}/editor` as Route}>
          <AppIcon className="projects-inline-icon" name="edit" />
          Open Editor
        </Link>

        <div className="projects-card__secondary-actions">
          <Link className="projects-button projects-button--secondary" href={`/projects/${projectId}/preview` as Route}>
            <AppIcon className="projects-inline-icon" name="visibility" />
            Preview
          </Link>
          <button className="projects-button projects-button--secondary is-disabled" disabled type="button">
            <AppIcon className="projects-inline-icon" name="download" />
            Export
          </button>
        </div>
      </div>
    </article>
  )
}
