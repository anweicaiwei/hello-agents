import rawCourseData from '@/data/generated/course.zh.json'
import type { CourseChapter, CourseData, LessonStep } from '@/types/course'

const courseData = rawCourseData as CourseData

export function useCourse() {
  const chapters = courseData.chapters
  const totalSteps = chapters.reduce((total, chapter) => total + chapter.steps.length, 0)
  const totalMinutes = chapters.reduce((total, chapter) => total + chapter.estimatedMinutes, 0)

  function findChapter(chapterId: string | string[] | undefined): CourseChapter | undefined {
    if (typeof chapterId !== 'string') return undefined
    return chapters.find((chapter) => chapter.id === chapterId)
  }

  function findStep(stepId: string): LessonStep | undefined {
    for (const chapter of chapters) {
      const step = chapter.steps.find((item) => item.id === stepId)
      if (step) return step
    }
    return undefined
  }

  return {
    chapters,
    courseData,
    findChapter,
    findStep,
    totalMinutes,
    totalSteps,
  }
}
