import { spawn } from "node:child_process"
import { copyFile, mkdir, readdir, stat } from "node:fs/promises"
import { constants } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const serverDir = join(root, ".next", "server")
const chunksDir = join(serverDir, "chunks")

async function syncChunkFiles() {
  try {
    await mkdir(serverDir, { recursive: true })
    const entries = await readdir(chunksDir)

    await Promise.all(
      entries
        .filter((name) => name.endsWith(".js"))
        .map(async (name) => {
          const source = join(chunksDir, name)
          const target = join(serverDir, name)

          try {
            const [sourceStat, targetStat] = await Promise.allSettled([stat(source), stat(target)])

            if (sourceStat.status !== "fulfilled") {
              return
            }

            const shouldCopy =
              targetStat.status !== "fulfilled" ||
              sourceStat.value.mtimeMs > targetStat.value.mtimeMs ||
              sourceStat.value.size !== targetStat.value.size

            if (shouldCopy) {
              await copyFile(source, target, constants.COPYFILE_FICLONE)
            }
          } catch {
            await copyFile(source, target)
          }
        }),
    )
  } catch {
    // Next dev may not have emitted chunks yet.
  }
}

const child = spawn("node_modules/.bin/next", ["dev"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
})

const interval = setInterval(() => {
  void syncChunkFiles()
}, 500)

child.on("exit", (code, signal) => {
  clearInterval(interval)

  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

process.on("SIGINT", () => {
  clearInterval(interval)
  child.kill("SIGINT")
})

process.on("SIGTERM", () => {
  clearInterval(interval)
  child.kill("SIGTERM")
})
