import { AppHeader } from "@/features/shared/components/app-header"

import { NewProjectForm } from "./new-project-form"

export function NewProjectPage() {
  return (
    <main className="misc-screen">
      <AppHeader active="new" />

      <section className="misc-shell misc-shell--wide">
        <div className="misc-panel">
          <div className="new-project-intro">
            <p className="misc-kicker">Create</p>
            <h1>Start a new parallax story</h1>
            <p className="misc-copy">
              Set the story tone, upload all of your source images in one pass, and arrange them into the exact order you want the final sequence to follow.
            </p>
          </div>

          <NewProjectForm />
        </div>
      </section>
    </main>
  )
}
