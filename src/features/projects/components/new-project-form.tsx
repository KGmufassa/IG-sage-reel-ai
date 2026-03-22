"use client"

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AppIcon } from "@/features/shared/components/app-icon"

type QueueItem = {
  id: string
  file: File
  previewUrl: string
  width?: number
  height?: number
}

type ApiSuccess<T> = {
  data: T
}

type ProjectResponse = {
  id: string
}

type UploadContract = {
  uploadToken: string
  uploadUrl: string
  storageKey: string
  expiresAt: string
  mimeType: string
  sizeBytes: number
}

async function readImageDimensions(file: File) {
  const objectUrl = URL.createObjectURL(file)

  try {
    const dimensions = await new Promise<{ width?: number; height?: number }>((resolve) => {
      const image = new Image()

      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight })
      }

      image.onerror = () => {
        resolve({})
      }

      image.src = objectUrl
    })

    return dimensions
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function parseJsonResponse<T>(response: Response) {
  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | { error?: { message?: string } }
    | null

  if (!response.ok) {
    throw new Error(payload && "error" in payload ? payload.error?.message ?? "Request failed." : "Request failed.")
  }

  if (!payload || !("data" in payload)) {
    throw new Error("Unexpected response from the server.")
  }

  return payload.data
}

function reorderItems(items: QueueItem[], activeId: string, targetId: string) {
  const activeIndex = items.findIndex((item) => item.id === activeId)
  const targetIndex = items.findIndex((item) => item.id === targetId)

  if (activeIndex === -1 || targetIndex === -1 || activeIndex === targetIndex) {
    return items
  }

  const nextItems = [...items]
  const [activeItem] = nextItems.splice(activeIndex, 1)
  nextItems.splice(targetIndex, 0, activeItem)
  return nextItems
}

export function NewProjectForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const queueItemsRef = useRef<QueueItem[]>([])
  const [title, setTitle] = useState("Sunset over Amalfi Coast")
  const [globalContext, setGlobalContext] = useState(
    "A cinematic coastal journey during golden hour with gentle vertical pacing.",
  )
  const [stylePreset, setStylePreset] = useState("Cinematic Push")
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragTargetId, setDragTargetId] = useState<string | null>(null)

  useEffect(() => {
    queueItemsRef.current = queueItems
  }, [queueItems])

  useEffect(() => {
    return () => {
      for (const item of queueItemsRef.current) {
        URL.revokeObjectURL(item.previewUrl)
      }
    }
  }, [])

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    const nextItems = await Promise.all(
      selectedFiles.map(async (file) => {
        const dimensions = await readImageDimensions(file)

        return {
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          width: dimensions.width,
          height: dimensions.height,
        } satisfies QueueItem
      }),
    )

    setQueueItems((current) => [...current, ...nextItems])
    setErrorMessage(null)
    setFeedback(`${selectedFiles.length} image${selectedFiles.length === 1 ? "" : "s"} added to the story queue.`)
    event.target.value = ""
  }

  function removeQueueItem(itemId: string) {
    setQueueItems((current) => {
      const item = current.find((entry) => entry.id === itemId)

      if (item) {
        URL.revokeObjectURL(item.previewUrl)
      }

      return current.filter((entry) => entry.id !== itemId)
    })
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

  async function createProject() {
    const requestBody = {
      title,
      globalContext: globalContext.trim() ? globalContext : null,
      stylePreset: stylePreset.trim() ? stylePreset : null,
    }

    let response = await fetch("/api/v1/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (response.status === 401) {
      await ensureGuestSession()
      response = await fetch("/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
    }

    return parseJsonResponse<ProjectResponse>(response)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      setErrorMessage("Add a project title before creating your story.")
      return
    }

    if (queueItems.length === 0) {
      setErrorMessage("Upload at least one image to build your first story sequence.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      setFeedback("Creating project shell...")
      const project = await createProject()

      setFeedback("Preparing upload slots...")
      const uploadContracts = await parseJsonResponse<{ uploads: UploadContract[] }>(
        await fetch(`/api/v1/projects/${project.id}/uploads/init`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            files: queueItems.map(({ file }) => ({
              filename: file.name,
              mimeType: file.type || "application/octet-stream",
              sizeBytes: file.size,
            })),
          }),
        }),
      )

      setFeedback("Uploading images to the scene queue...")

      await Promise.all(
        uploadContracts.uploads.map((contract, index) =>
          fetch(contract.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": queueItems[index]?.file.type || contract.mimeType,
            },
            body: queueItems[index]?.file,
          }).then((response) => parseJsonResponse<{ accepted: boolean }>(response)),
        ),
      )

      setFeedback("Finalizing scene order...")
      await parseJsonResponse<unknown>(
        await fetch(`/api/v1/projects/${project.id}/uploads/finalize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uploads: queueItems.map((item, index) => ({
              uploadToken: uploadContracts.uploads[index]?.uploadToken,
              originalFilename: item.file.name,
              mimeType: item.file.type || uploadContracts.uploads[index]?.mimeType || "application/octet-stream",
              sizeBytes: item.file.size,
              width: item.width,
              height: item.height,
            })),
          }),
        }),
      )

      setFeedback("Project ready. Opening the editor...")
      router.push(`/projects/${project.id}/editor`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong while creating the project.")
      setFeedback(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="misc-form new-project-form" onSubmit={handleSubmit}>
      <label className="misc-field">
        <span>Project Title</span>
        <input onChange={(event) => setTitle(event.target.value)} type="text" value={title} />
      </label>

      <label className="misc-field">
        <span>Global Context</span>
        <textarea onChange={(event) => setGlobalContext(event.target.value)} rows={5} value={globalContext} />
      </label>

      <label className="misc-field">
        <span>Style Preset</span>
        <input onChange={(event) => setStylePreset(event.target.value)} type="text" value={stylePreset} />
      </label>

      <section className="new-project-upload-panel">
        <div className="new-project-upload-panel__header">
          <div>
            <p className="misc-kicker">Uploads</p>
            <h2>Build your story sequence</h2>
            <p className="misc-copy">
              Upload multiple images at once, then drag them into the order you want viewers to move through the story.
            </p>
          </div>

          <button
            className="misc-button misc-button--secondary new-project-upload-panel__button"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <AppIcon className="new-project-upload-panel__button-icon" name="upload_file" />
            Select Images
          </button>
        </div>

        <input
          accept="image/*"
          className="new-project-file-input"
          hidden
          multiple
          onChange={handleFileSelection}
          ref={fileInputRef}
          type="file"
        />

        <div className="new-project-dropzone">
          <AppIcon className="new-project-dropzone__icon" name="layers" />
          <div>
            <strong>{queueItems.length === 0 ? "No images added yet" : `${queueItems.length} image${queueItems.length === 1 ? "" : "s"} ready`}</strong>
            <p>Each uploaded image becomes the next page/scene in your story. Drag cards below to reorder the sequence.</p>
          </div>
        </div>

        {queueItems.length > 0 ? (
          <div className="new-project-queue">
            {queueItems.map((item, index) => (
              <article
                className={dragTargetId === item.id ? "new-project-queue__item is-drag-target" : "new-project-queue__item"}
                draggable
                key={item.id}
                onDragEnd={() => {
                  setDraggedItemId(null)
                  setDragTargetId(null)
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  if (draggedItemId && draggedItemId !== item.id) {
                    setDragTargetId(item.id)
                  }
                }}
                onDragStart={() => {
                  setDraggedItemId(item.id)
                  setDragTargetId(item.id)
                }}
                onDrop={(event: DragEvent<HTMLElement>) => {
                  event.preventDefault()

                  if (!draggedItemId || draggedItemId === item.id) {
                    setDraggedItemId(null)
                    setDragTargetId(null)
                    return
                  }

                  setQueueItems((current) => reorderItems(current, draggedItemId, item.id))
                  setDraggedItemId(null)
                  setDragTargetId(null)
                }}
              >
                <div className="new-project-queue__handle" title="Drag to reorder">
                  <AppIcon className="new-project-queue__handle-icon" name="drag_indicator" />
                </div>

                <div className="new-project-queue__preview" style={{ backgroundImage: `url("${item.previewUrl}")` }} />

                <div className="new-project-queue__meta">
                  <div className="new-project-queue__order">Scene {String(index + 1).padStart(2, "0")}</div>
                  <strong>{item.file.name}</strong>
                  <p>
                    {(item.file.size / (1024 * 1024)).toFixed(1)} MB
                    {item.width && item.height ? ` • ${item.width}x${item.height}` : ""}
                  </p>
                </div>

                <button className="new-project-queue__remove" onClick={() => removeQueueItem(item.id)} type="button">
                  <AppIcon className="new-project-queue__remove-icon" name="delete" />
                  Remove
                </button>
              </article>
            ))}
          </div>
        ) : null}

        {feedback ? <p className="new-project-feedback">{feedback}</p> : null}
        {errorMessage ? <p className="new-project-error">{errorMessage}</p> : null}
      </section>

      <div className="misc-actions">
        <button className="misc-button misc-button--primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </button>
        <Link className="misc-button misc-button--secondary" href="/projects">
          Back to Projects
        </Link>
      </div>
    </form>
  )
}
