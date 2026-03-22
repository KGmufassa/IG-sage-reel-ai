import { ProjectPreviewPage } from "@/features/preview/components/project-preview-page"

type PreviewPageProps = {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPreviewRoute({ params }: PreviewPageProps) {
  const { projectId } = await params

  return <ProjectPreviewPage projectId={projectId} />
}
