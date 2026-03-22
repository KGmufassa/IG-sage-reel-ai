import { ProjectEditorPage } from "@/features/projects/components/project-editor-page"

type EditorPageProps = {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectEditorRoute({ params }: EditorPageProps) {
  const { projectId } = await params

  return <ProjectEditorPage projectId={projectId} />
}
