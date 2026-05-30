import { computed, reactive, readonly } from 'vue'

import type { CourseChapter, ProgressState } from '@/types/course'

const STORAGE_KEY = 'hello-agents-learning-progress-v1'
let storageAvailable = true

const defaultState: ProgressState = {
  completedStepIds: [],
  favoriteStepIds: [],
  lastChapterId: null,
  checkpointResults: {},
}

function loadState(): ProgressState {
  if (typeof window === 'undefined' || !storageAvailable) return { ...defaultState }

  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    storageAvailable = false
    return { ...defaultState }
  }

  if (!stored) return { ...defaultState }

  try {
    return { ...defaultState, ...JSON.parse(stored) }
  } catch {
    return { ...defaultState }
  }
}

const state = reactive<ProgressState>(loadState())

function persist() {
  if (typeof window === 'undefined' || !storageAvailable) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    storageAvailable = false
  }
}

function uniqueList(list: string[], value: string) {
  return list.includes(value) ? list : [...list, value]
}

export function useProgress(chapters: CourseChapter[]) {
  const allStepIds = computed(() => chapters.flatMap((chapter) => chapter.steps.map((step) => step.id)))

  const completedCount = computed(
    () => state.completedStepIds.filter((stepId) => allStepIds.value.includes(stepId)).length,
  )

  const completionRate = computed(() => {
    if (allStepIds.value.length === 0) return 0
    return Math.round((completedCount.value / allStepIds.value.length) * 100)
  })

  function isStepCompleted(stepId: string) {
    return state.completedStepIds.includes(stepId)
  }

  function isStepFavorite(stepId: string) {
    return state.favoriteStepIds.includes(stepId)
  }

  function setLastChapter(chapterId: string) {
    state.lastChapterId = chapterId
    persist()
  }

  function toggleStep(stepId: string) {
    state.completedStepIds = isStepCompleted(stepId)
      ? state.completedStepIds.filter((item) => item !== stepId)
      : uniqueList(state.completedStepIds, stepId)
    persist()
  }

  function toggleFavorite(stepId: string) {
    state.favoriteStepIds = isStepFavorite(stepId)
      ? state.favoriteStepIds.filter((item) => item !== stepId)
      : uniqueList(state.favoriteStepIds, stepId)
    persist()
  }

  function setCheckpointResult(checkpointId: string, passed: boolean) {
    state.checkpointResults[checkpointId] = passed
    persist()
  }

  function resetProgress() {
    state.completedStepIds = []
    state.favoriteStepIds = []
    state.lastChapterId = null
    state.checkpointResults = {}
    persist()
  }

  return {
    completedCount,
    completionRate,
    isStepCompleted,
    isStepFavorite,
    resetProgress,
    setCheckpointResult,
    setLastChapter,
    state: readonly(state),
    toggleFavorite,
    toggleStep,
  }
}
