import type { Route } from "next"
import Link from "next/link"

import { AppIcon } from "@/features/shared/components/app-icon"

type AppHeaderProps = {
  active?: "home" | "projects" | "new" | "settings"
  variant?: "marketing" | "app" | "auth"
}

function navClass(isActive: boolean) {
  return isActive ? "psc-top-nav__link is-active" : "psc-top-nav__link"
}

export function AppHeader({ active, variant = "app" }: AppHeaderProps) {
  return (
    <header className="psc-top-nav">
      <div className="psc-top-nav__inner">
        <Link className="psc-top-nav__brand" href={"/" as Route}>
          <span aria-hidden className="psc-top-nav__brand-icon">
            <span className="psc-top-nav__brand-spark" />
          </span>
          <span className="psc-top-nav__brand-text">Parallax</span>
        </Link>

        <nav aria-label="Primary navigation" className="psc-top-nav__links">
          <Link className={navClass(active === "home")} href={"/" as Route}>
            Home
          </Link>
          <Link className={navClass(active === "projects")} href={"/projects" as Route}>
            Projects
          </Link>
          <Link className={navClass(active === "new")} href={"/projects/new" as Route}>
            New Project
          </Link>
          <Link className={navClass(active === "settings")} href={"/settings" as Route}>
            Settings
          </Link>
        </nav>

        <div className="psc-top-nav__actions">
          {variant === "marketing" || variant === "auth" ? (
            <Link className="psc-top-nav__cta" href={"/login" as Route}>
              Sign In
            </Link>
          ) : (
            <>
              <button aria-label="Notifications" className="psc-top-nav__icon-button" type="button">
                <AppIcon className="psc-top-nav__icon" name="notifications" />
              </button>
              <button aria-label="Open account menu" className="psc-top-nav__avatar" type="button">
                <span className="psc-top-nav__avatar-face" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
