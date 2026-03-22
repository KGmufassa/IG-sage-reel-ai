export function UploadPanel() {
  return (
    <section className="psc-panel psc-panel--dashed">
      <p className="psc-kicker">Uploads</p>
      <h2>Upload Images</h2>
      <p className="psc-copy">
        This visual shell is ready for the upload-init and upload-finalize flow. Actual file persistence
        remains limited by the current backend storage implementation.
      </p>
      <button className="psc-button psc-button--secondary is-disabled" disabled type="button">
        Select Files
        <span className="psc-status-pill">Phase 2</span>
      </button>
    </section>
  )
}
