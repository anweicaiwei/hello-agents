<script setup lang="ts">
import { ArrowLeft, ExternalLink } from '@lucide/vue'
import { computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import CheckpointPanel from '@/components/CheckpointPanel.vue'
import StepTimeline from '@/components/StepTimeline.vue'
import { useCourse } from '@/composables/useCourse'
import { useProgress } from '@/composables/useProgress'

const route = useRoute()
const { chapters, findChapter } = useCourse()
const progress = useProgress(chapters)

const chapter = computed(() => findChapter(route.params.chapterId))
const chapterCompleted = computed(() => {
  if (!chapter.value || chapter.value.steps.length === 0) return 0
  return chapter.value.steps.filter((step) => progress.isStepCompleted(step.id)).length
})

watch(
  chapter,
  (current) => {
    if (current) progress.setLastChapter(current.id)
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="chapter" class="chapter-view">
    <RouterLink class="text-link" to="/">
      <ArrowLeft :size="16" aria-hidden="true" />
      <span>返回总览</span>
    </RouterLink>

    <div class="chapter-hero">
      <div>
        <p class="eyebrow">{{ chapter.part }}</p>
        <h2>{{ chapter.title }}</h2>
        <p>
          已完成 {{ chapterCompleted }} / {{ chapter.steps.length }} 个步骤。本页由教程 Markdown 自动生成。
        </p>
      </div>
      <a class="source-link" :href="chapter.sourceUrl" target="_blank" rel="noreferrer">
        <ExternalLink :size="18" aria-hidden="true" />
        <span>查看原文</span>
      </a>
    </div>

    <div class="chapter-content-grid">
      <StepTimeline
        :steps="chapter.steps"
        :is-step-completed="progress.isStepCompleted"
        :is-step-favorite="progress.isStepFavorite"
        @toggle-step="progress.toggleStep"
        @toggle-favorite="progress.toggleFavorite"
      />
      <CheckpointPanel
        :steps="chapter.steps"
        :completed-checkpoints="progress.state.checkpointResults"
        @set-result="progress.setCheckpointResult"
      />
    </div>
  </section>

  <section v-else class="empty-state">
    <h2>未找到章节</h2>
    <p>课程数据可能尚未生成，请在 learning-app 目录运行 npm run generate。</p>
    <RouterLink class="primary-action" to="/">返回总览</RouterLink>
  </section>
</template>
