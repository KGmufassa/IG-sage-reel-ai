const checklist = [
  "Layered Next.js backend foundation",
  "Typed config and environment validation",
  "Structured error handling and request correlation",
  "Prisma schema for guest and authenticated ownership",
  "Auth.js session resolution with guest session issuance",
  "Authorization policy layer for preview, save, claim, and export",
]

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero-card">
        <p className="eyebrow">Sprint 1 Backend Foundation</p>
        <h1>Parallax Story Composer</h1>
        <p className="lede">
          The repo now includes a Next.js backend foundation with versioned APIs, typed
          configuration, Prisma models, guest access support, and authenticated session
          resolution.
        </p>
        <div className="endpoint-grid">
          <a href="/api/v1/health/live">/api/v1/health/live</a>
          <a href="/api/v1/health/ready">/api/v1/health/ready</a>
          <a href="/api/v1/auth/session">/api/v1/auth/session</a>
          <a href="/api/v1/guest-sessions">/api/v1/guest-sessions</a>
        </div>
      </section>

      <section className="panel">
        <h2>Sprint 1 Coverage</h2>
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
