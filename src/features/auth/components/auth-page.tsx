import type { Route } from "next"
import Link from "next/link"

import { AppHeader } from "@/features/shared/components/app-header"
import { AppIcon } from "@/features/shared/components/app-icon"

type AuthPageProps = {
  mode: "login" | "signup"
}

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login"
  const benefits: Array<{ icon: "cloud_upload" | "file_export" | "group"; title: string; body: string }> = [
    {
      icon: "cloud_upload",
      title: "Cloud Syncing",
      body: "Never lose a draft. Your story fragments are automatically saved and synced across all your devices.",
    },
    {
      icon: "file_export",
      title: "Advanced Export",
      body: "Export your parallax experiences directly to web-ready formats or high-quality video renders.",
    },
    {
      icon: "group",
      title: "Collaboration",
      body: "Invite editors to your canvas. Build complex multi-layered narratives together in real-time.",
    },
  ]

  return (
    <main className="auth-screen">
      <AppHeader variant="auth" />
      <div className="auth-layout">
        <section className="auth-side-panel">
          <div className="auth-side-panel__content">
            <div className="auth-side-panel__brand">
              <AppIcon className="auth-brand-icon" name="storm" />
              <h1>Parallax Story Composer</h1>
            </div>
            <div className="auth-side-panel__stack">
              <h2>
                Create worlds that <span>move</span> with you.
              </h2>
              <div className="auth-benefit-list">
                {benefits.map(({ icon, title, body }) => (
                  <article className="auth-benefit" key={title}>
                    <div className="auth-benefit__icon">
                      <AppIcon className="auth-benefit__icon-svg" name={icon} />
                    </div>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="auth-side-panel__bg" />
          <p className="auth-side-panel__footer">© 2024 Parallax Story Composer. Professional Grade Creative Tools.</p>
        </section>

        <section className="auth-form-side">
          <div className="auth-form-wrap">
            <div className="auth-mobile-brand">
              <AppIcon className="auth-brand-icon auth-brand-icon--mobile" name="storm" />
              <span>Parallax</span>
            </div>

            <div className="auth-tabs">
              <Link className={isLogin ? "auth-tabs__item is-active" : "auth-tabs__item"} href={"/login" as Route}>
                Log In
              </Link>
              <Link className={!isLogin ? "auth-tabs__item is-active" : "auth-tabs__item"} href={"/signup" as Route}>
                Sign Up
              </Link>
            </div>

            <div className="auth-card">
              <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
              <p className="auth-card__lede">
                {isLogin
                  ? "Access your studio and continue your creative journey."
                  : "Start building your cinematic workspace and unlock cloud-powered collaboration later."}
              </p>

              <Link className="auth-google-button" href={"/api/auth/signin/google" as Route}>
                <svg className="auth-google-button__icon" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </Link>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <form className="auth-form">
                {!isLogin ? (
                  <label className="auth-field">
                    <span>Display Name</span>
                    <input placeholder="Alex Creator" type="text" />
                  </label>
                ) : null}

                <label className="auth-field">
                  <span>Email Address</span>
                  <input placeholder="name@studio.com" type="email" />
                </label>

                <div className="auth-field">
                  <div className="auth-field__row">
                    <span>Password</span>
                    <button className="auth-inline-button is-disabled" disabled type="button">
                      Forgot?
                    </button>
                  </div>
                  <div className="auth-password-wrap">
                    <input placeholder="••••••••" type="password" />
                    <button className="auth-password-toggle is-disabled" disabled type="button">
                      <AppIcon className="auth-password-toggle__icon" name="visibility" />
                    </button>
                  </div>
                </div>

                <label className="auth-checkbox-row">
                  <input type="checkbox" />
                  <span>{isLogin ? "Remember this device" : "Remember this device"}</span>
                </label>

                <button className="auth-submit-button is-disabled" disabled type="button">
                  {isLogin ? "Enter Studio" : "Create Account"}
                </button>
              </form>

              <p className="auth-card__footer">
                {isLogin ? "New to Parallax? " : "Already have an account? "}
                <Link href={(isLogin ? "/signup" : "/login") as Route}>{isLogin ? "Create an account" : "Log In"}</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
