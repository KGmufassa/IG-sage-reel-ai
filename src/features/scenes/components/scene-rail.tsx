const scenes = [
  { title: "Scene 01", state: "READY" },
  { title: "Scene 02", state: "PROCESSING" },
  { title: "Scene 03", state: "QUEUED" },
] as const

export function SceneRail() {
  return (
    <aside className="psc-editor-rail">
      <p className="psc-kicker">Timeline Scenes</p>
      <div className="psc-scene-stack">
        {scenes.map((scene, index) => (
          <article className={index === 0 ? "psc-scene-card is-active" : "psc-scene-card"} key={scene.title}>
            <div className="psc-scene-card__thumb" />
            <div className="psc-scene-card__meta">
              <strong>{scene.title}</strong>
              <span>{scene.state}</span>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}
