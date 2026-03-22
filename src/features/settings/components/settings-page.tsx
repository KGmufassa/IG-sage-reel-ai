import { AppIcon } from "@/features/shared/components/app-icon"
import { AppHeader } from "@/features/shared/components/app-header"

const preferenceFields = [
  { label: "Default Story Pace", value: "Balanced" },
  { label: "Default Transition Style", value: "Smooth Crossfade" },
  { label: "Default Motion Preset", value: "Deep Parallax" },
] as const

export function SettingsPage() {
  return (
    <main className="settings-screen">
      <AppHeader active="settings" />

      <section className="settings-shell">
        <div className="settings-header">
          <span className="settings-kicker">Creative controls</span>
          <h1>Settings</h1>
          <p>Manage your account details and app preferences for a tailored creative experience.</p>
        </div>

        <div className="settings-stack">
          <section className="settings-panel settings-panel--account">
            <div className="settings-panel__heading">
              <AppIcon className="settings-panel__icon" name="person" />
              <div>
                <h2>Account Information</h2>
                <p>Keep your studio identity and recovery details up to date.</p>
              </div>
            </div>

            <div className="settings-grid">
              <label className="settings-field">
                <span className="settings-field__label">Display Name</span>
                <input defaultValue="Alex Creator" type="text" />
              </label>

              <label className="settings-field">
                <span className="settings-field__label">Email Address</span>
                <input defaultValue="alex@parallax.studio" type="email" />
              </label>
            </div>

            <button className="settings-text-button" type="button">
              <AppIcon className="settings-inline-icon" name="restart_alt" />
              Change Password
            </button>
          </section>

          <section className="settings-panel settings-panel--preferences">
            <div className="settings-panel__heading">
              <AppIcon className="settings-panel__icon" name="tune" />
              <div>
                <h2>App Preferences</h2>
                <p>Set your default pacing, transitions, and motion language.</p>
              </div>
            </div>

            <div className="settings-toggle-row">
              <div className="settings-toggle-copy">
                <strong>Reduced Motion</strong>
                <p>Reduce interface animation and preview movement for a calmer editing flow.</p>
              </div>

              <button aria-pressed="false" className="settings-toggle" type="button">
                <span className="settings-toggle__thumb" />
              </button>
            </div>

            <div className="settings-grid settings-grid--spacious">
              {preferenceFields.map(({ label, value }) => (
                <div className="settings-field settings-select" key={label}>
                  <span className="settings-field__label">{label}</span>
                  <button className="settings-select__trigger" type="button">
                    <span>{value}</span>
                    <AppIcon className="settings-select__icon" name="expand_more" />
                  </button>
                </div>
              ))}

              <div className="settings-field settings-field--locked">
                <span className="settings-field__label">Output Format</span>
                <div aria-disabled="true" className="settings-locked-field">
                  <span>9:16 Vertical Story</span>
                  <AppIcon className="settings-select__icon" name="lock" />
                </div>
              </div>
            </div>
          </section>

          <section className="settings-panel settings-panel--session">
            <div className="settings-panel__heading settings-panel__heading--danger">
              <AppIcon className="settings-panel__icon" name="logout" />
              <div>
                <h2>Session</h2>
                <p>Monitor where your account is active and revoke stale sessions fast.</p>
              </div>
            </div>

            <p className="settings-session-copy">Logged in from San Francisco, CA. Last active 2 minutes ago.</p>

            <button className="settings-danger-outline" type="button">
              Sign Out of All Devices
            </button>
          </section>

          <div className="settings-bottom-row">
            <div className="settings-bottom-row__actions">
              <button className="settings-primary-button" type="button">
                Save Changes
              </button>
              <button className="settings-secondary-button" type="button">
                Reset Defaults
              </button>
            </div>

            <button className="settings-signout-link" type="button">
              <svg
                aria-hidden="true"
                className="settings-signout-link__icon"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
