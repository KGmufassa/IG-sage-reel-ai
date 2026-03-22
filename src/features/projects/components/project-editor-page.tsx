"use client"

import { useState } from "react"
import type { Route } from "next"
import Link from "next/link"

import { AppHeader } from "@/features/shared/components/app-header"
import { AppIcon } from "@/features/shared/components/app-icon"
import { getMockProjectById } from "@/features/projects/mock-projects"

type ProjectEditorPageProps = {
  projectId: string
}

const fallbackScenes = [
  {
    name: "Scene One",
    prompt:
      "Deep golden hour, volumetric lighting, slight mist over the Mediterranean, hyper-realistic parallax depth.",
    motionPreset: "Cinematic Push",
    motionIntensity: 75,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_v-7Nh0QR3utisJ4w0r88BIYx6IX78iUm2k3BMD86cmSlRTdr5eWbAyhuKJ4pDUQirkcRuzuZlD5A-0SNcnb_WGptKr-awW7jdxRTEFfw-uPrba4BVBgHvWKqfC7SvrZWCV_acNlnP2hkO6nE97djfCQFR_acNEzp2pIHXiU0QYv6buWNgUhDVbcOumCH_rFHYY65iOXfETauR6Yw7r5uvBSgTxPlGBt905IT-f2d47QmVmTnV55IcjdUcyMZtIvLO8_3eF78Amk",
  },
  {
    name: "Scene Two",
    prompt:
      "Cliffside terraces glow with warm sunset spill, layered buildings fade into sea haze, cinematic depth with gentle foreground separation.",
    motionPreset: "Standard Pan",
    motionIntensity: 62,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC3dtqQy_lVoORXf1yBbnAOOqeaBf6bs6JwxEAzRDFNWCpX8kXDYQC1a99tV4KYkWikGeuF-QzGRSooLvwtx8E3YIVF96zreFVRROsNNlUrofALxc1TgYbR3uLmBnZNQZ9_8u7T5bDqOIXN7uoNcA28iwesQUDKsIrYhqqk5BvZjjmQ1uYZfbE1lxVC9Tle7SvogoRfgyiXGQLIrBanEAOLcpSHAPLjHD0Lj79s-YmjqWHgCEIHRJ0LbbR5HqAPbdutl8_a2Ov2zE",
  },
  {
    name: "Scene Three",
    prompt:
      "A brighter harbor-facing angle with coastal reflections, soft atmosphere, and a calmer pace that emphasizes background depth.",
    motionPreset: "Vertical Scroll",
    motionIntensity: 54,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2SxaPbl5i3BcVyyiWZNME517Bb-fffNbkD-ZvkG7ZRf84QHhIDb5Iu4_HfiEYFvS87swKjMjAF6d3eyBKhbsk8gPU2yKnGrLaLoQ82wwBksubmTnlzkH3NZr7uPjqDEjfdOrzRCoZVqEaueawTUGPTOI4VdCH4gnyRthtCWDNB2NoReLeCZEMWW8DjPAfw4vRXt5_Jni-haCglUyMBli2-BFT1JLTdiAPTewxLVWNyNXXHOrz8B8WmxqUMqxs9zeIwQBnHFkUk64",
  },
] as const

export function ProjectEditorPage({ projectId }: ProjectEditorPageProps) {
  const mockProject = getMockProjectById(projectId)
  const projectTitle = mockProject?.title ?? "Sunset over Amalfi Coast"
  const projectStatus = mockProject?.status ?? "draft"
  const projectContext =
    mockProject?.globalContext ?? "A cinematic journey along the Italian coast during summer sunset."
  const scenes =
    mockProject?.scenes ??
    fallbackScenes.map((scene, index) => ({
      id: `fallback-scene-${index + 1}`,
      name: scene.name,
      prompt: scene.prompt,
      contextText: scene.prompt,
      motionPreset: scene.motionPreset,
      motionIntensity: scene.motionIntensity,
      status: "ready",
      image: scene.image,
    }))

  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const activeScene = scenes[activeSceneIndex] ?? scenes[0]

  return (
    <main className="editor-screen">
      <AppHeader active="projects" />

      <section className="editor-action-bar">
        <div className="editor-action-bar__title-wrap">
          <button className="editor-icon-button is-disabled" disabled type="button">
            <AppIcon className="editor-icon" name="arrow_back" />
          </button>
            <div className="editor-action-bar__title-block">
              <div className="editor-title-row">
                <input defaultValue={projectTitle} readOnly type="text" />
                <span>{projectStatus}</span>
              </div>
              <p>Project ID: {projectId}</p>
            </div>
        </div>

        <div className="editor-action-bar__actions">
          <button className="editor-top-button is-disabled" disabled type="button">
            <AppIcon className="editor-inline-icon" name="save" />
            Save
          </button>
          <Link className="editor-top-button" href={`/projects/${projectId}/preview` as Route}>
            <AppIcon className="editor-inline-icon" name="visibility" />
            Preview
          </Link>
          <button className="editor-top-button is-disabled" disabled type="button">
            <AppIcon className="editor-inline-icon" name="ios_share" />
            Export
          </button>
          <button className="editor-top-button editor-top-button--primary is-disabled" disabled type="button">
            <AppIcon className="editor-inline-icon" name="bolt" />
            Generate
          </button>
        </div>
      </section>

      <section className="editor-layout">
        <aside className="editor-scenes-panel">
          <div className="editor-upload-box">
            <button className="editor-upload-button is-disabled" disabled type="button">
              <AppIcon className="editor-upload-icon" name="upload_file" />
              <span>Upload Images</span>
            </button>
          </div>
          <div className="editor-scenes-list">
            <h3>Timeline Scenes</h3>
            {scenes.map((scene, index) => (
              <article className={index === activeSceneIndex ? "editor-scene-card is-active" : "editor-scene-card"} key={scene.name}>
                {index === activeSceneIndex ? (
                  <AppIcon className="editor-scene-card__drag" name="drag_indicator" />
                ) : null}
                <button className="editor-scene-card__button" onClick={() => setActiveSceneIndex(index)} type="button">
                  <div className="editor-scene-card__image-wrap">
                    <div className="editor-scene-card__image" style={{ backgroundImage: `url("${scene.image}")` }} />
                  </div>
                  <div className="editor-scene-card__meta">
                    <span>{scene.name}</span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </aside>

        <section className="editor-stage-panel">
          <div className="editor-stage-frame">
            <div
              className="editor-stage-frame__image"
              style={{
                backgroundImage: `url("${activeScene.image}")`,
              }}
            />
            <div className="editor-stage-frame__safe-zone">Safe Zone Area</div>
          </div>
        </section>

        <aside className="editor-inspector-panel">
          <div className="editor-tab-row">
            <button className="editor-tab-row__item is-active" type="button">
              Scene
            </button>
            <button className="editor-tab-row__item" type="button">
              Project
            </button>
          </div>

          <div className="editor-inspector-panel__body">
            <div key={activeScene.name}>
              <div className="editor-form-group">
                <label>Scene Name</label>
                <div className="editor-select-wrap">
                  <select onChange={(event) => setActiveSceneIndex(Number(event.target.value))} value={activeSceneIndex}>
                    {scenes.map((scene, index) => (
                      <option key={scene.name} value={index}>
                        {scene.name}
                      </option>
                    ))}
                  </select>
                  <AppIcon className="editor-select-icon" name="expand_more" />
                </div>
              </div>
              <div className="editor-form-group">
                <label>Scene Context (AI Prompt)</label>
                <textarea defaultValue={activeScene.prompt} rows={4} />
              </div>
              <div className="editor-form-group">
                <label>Motion Preset</label>
                <div className="editor-select-wrap">
                  <select defaultValue={activeScene.motionPreset}>
                    <option>Standard Pan</option>
                    <option>Cinematic Push</option>
                    <option>Parallax Tilt</option>
                    <option>Vertical Scroll</option>
                  </select>
                  <AppIcon className="editor-select-icon" name="expand_more" />
                </div>
              </div>
              <div className="editor-slider-group">
                <div>
                  <label>Motion Intensity</label>
                  <span>{activeScene.motionIntensity}%</span>
                </div>
                <input defaultValue={String(activeScene.motionIntensity)} type="range" />
              </div>
              <div className="editor-form-group">
                <label>Depth Focus</label>
                <div className="editor-depth-grid">
                  <button className="editor-depth-grid__button" type="button">
                    Subject
                  </button>
                  <button className="editor-depth-grid__button is-active" type="button">
                    Balanced
                  </button>
                  <button className="editor-depth-grid__button" type="button">
                    Background
                  </button>
                </div>
              </div>
            </div>

            <div className="editor-global-section">
              <h3>Global Settings</h3>
              <div className="editor-form-group">
                <label>Project Context</label>
                <textarea defaultValue={projectContext} rows={2} />
              </div>
              <div className="editor-balance-row">
                <label>Story Pace</label>
                <div className="editor-story-pace">
                  <span>Calm</span>
                  <span className="is-active">Balanced</span>
                  <span>Fast</span>
                </div>
              </div>
              <div className="editor-balance-row">
                <label>Reduced Motion</label>
                <button className="editor-toggle is-disabled" disabled type="button">
                  <div />
                </button>
              </div>
              <div className="editor-output-row">
                <div>
                  <span>Output Format</span>
                  <strong>9:16 Portrait</strong>
                </div>
                <AppIcon className="editor-output-icon" name="lock" />
              </div>
            </div>
          </div>

          <div className="editor-inspector-panel__footer">
            <button className="editor-reprocess-button is-disabled" disabled type="button">
              <AppIcon className="editor-inline-icon" name="restart_alt" />
              Reprocess Scene
            </button>
          </div>
        </aside>
      </section>
    </main>
  )
}
