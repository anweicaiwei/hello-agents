export type CheckpointType = 'reflection'

export interface Checkpoint {
  id: string
  prompt: string
  type: CheckpointType
}

export interface LessonStep {
  id: string
  title: string
  level: number
  anchor: string
  sourceLine: number
  sourceUrl: string
  summary: string
  checkpoint: Checkpoint
}

export interface CourseChapter {
  id: string
  order: number
  title: string
  part: string
  sourcePath: string
  sourceUrl: string
  estimatedMinutes: number
  steps: LessonStep[]
}

export interface CourseData {
  generatedAt: string
  language: 'zh-CN'
  source: string
  chapters: CourseChapter[]
}

export interface ProgressState {
  completedStepIds: string[]
  favoriteStepIds: string[]
  lastChapterId: string | null
  checkpointResults: Record<string, boolean>
}
