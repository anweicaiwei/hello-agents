<script setup lang="ts">
import { ArrowRight, Clock3, ListChecks } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import ProgressSummary from '@/components/ProgressSummary.vue'
import { useCourse } from '@/composables/useCourse'
import { useProgress } from '@/composables/useProgress'

const { chapters, totalMinutes, totalSteps } = useCourse()
const progress = useProgress(chapters)

const completedCount = progress.completedCount
const completionRate = progress.completionRate
const nextChapterId = computed(() => {
  if (progress.state.lastChapterId) return progress.state.lastChapterId
  return chapters[0]?.id ?? ''
})
</script>

<template>
  <div class="dashboard-grid">
    <ProgressSummary
      :chapter-count="chapters.length"
      :completion-rate="completionRate"
      :completed-count="completedCount"
      :total-minutes="totalMinutes"
      :total-steps="totalSteps"
    />

    <section class="action-panel" aria-labelledby="continue-title">
      <p class="eyebrow">Current Focus</p>
      <h2 id="continue-title">从路线图进入下一步</h2>
      <p>
        首版自动解析现有中文章节标题，将每个小节转成学习步骤和自测检查点。完成进度会保存在当前浏览器。
      </p>
      <RouterLink class="primary-action" :to="`/chapter/${nextChapterId}`">
        <span>继续学习</span>
        <ArrowRight :size="18" aria-hidden="true" />
      </RouterLink>
    </section>
  </div>

  <section class="chapter-section" aria-labelledby="chapter-map-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Course Map</p>
        <h2 id="chapter-map-title">章节路线</h2>
      </div>
      <div class="section-meta">
        <ListChecks :size="18" aria-hidden="true" />
        <span>{{ totalSteps }} 个步骤</span>
        <Clock3 :size="18" aria-hidden="true" />
        <span>约 {{ totalMinutes }} 分钟</span>
      </div>
    </div>

    <div class="chapter-list">
      <article v-for="chapter in chapters" :key="chapter.id" class="chapter-card">
        <p class="chapter-part">{{ chapter.part }}</p>
        <h3>{{ chapter.title }}</h3>
        <p>{{ chapter.steps.length }} 个步骤 · 约 {{ chapter.estimatedMinutes }} 分钟</p>
        <RouterLink class="chapter-link" :to="`/chapter/${chapter.id}`">
          <span>进入章节</span>
          <ArrowRight :size="16" aria-hidden="true" />
        </RouterLink>
      </article>
    </div>
  </section>
</template>
