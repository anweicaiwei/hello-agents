<script setup lang="ts">
import { Star } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useCourse } from '@/composables/useCourse'
import { useProgress } from '@/composables/useProgress'

const { chapters } = useCourse()
const progress = useProgress(chapters)

const favoriteSteps = computed(() =>
  chapters.flatMap((chapter) =>
    chapter.steps
      .filter((step) => progress.state.favoriteStepIds.includes(step.id))
      .map((step) => ({ chapter, step })),
  ),
)

const unfinishedSteps = computed(() =>
  chapters.flatMap((chapter) =>
    chapter.steps
      .filter((step) => !progress.state.completedStepIds.includes(step.id))
      .slice(0, 3)
      .map((step) => ({ chapter, step })),
  ),
)
</script>

<template>
  <section class="review-grid">
    <article class="review-panel">
      <p class="eyebrow">Favorites</p>
      <h2>收藏步骤</h2>
      <div v-if="favoriteSteps.length" class="compact-list">
        <RouterLink
          v-for="{ chapter, step } in favoriteSteps"
          :key="step.id"
          :to="`/chapter/${chapter.id}`"
          class="compact-row"
        >
          <Star :size="16" aria-hidden="true" />
          <span>{{ step.title }}</span>
        </RouterLink>
      </div>
      <p v-else class="muted">还没有收藏步骤。进入章节后点击星标即可加入复习列表。</p>
    </article>

    <article class="review-panel">
      <p class="eyebrow">Next Review</p>
      <h2>待完成步骤</h2>
      <div v-if="unfinishedSteps.length" class="compact-list">
        <RouterLink
          v-for="{ chapter, step } in unfinishedSteps"
          :key="step.id"
          :to="`/chapter/${chapter.id}`"
          class="compact-row"
        >
          <span class="step-dot" aria-hidden="true"></span>
          <span>{{ step.title }}</span>
        </RouterLink>
      </div>
      <p v-else class="muted">所有步骤都已标记完成。</p>
    </article>
  </section>
</template>
