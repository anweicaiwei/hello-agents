<script setup lang="ts">
import { BookOpen, CheckCircle2, Clock3, Gauge } from '@lucide/vue'

defineProps<{
  chapterCount: number
  completedCount: number
  completionRate: number
  totalMinutes: number
  totalSteps: number
}>()
</script>

<template>
  <section class="summary-panel" aria-labelledby="summary-title">
    <div class="summary-header">
      <div>
        <p class="eyebrow">Progress</p>
        <h2 id="summary-title">学习进度</h2>
      </div>
      <Gauge :size="28" aria-hidden="true" />
    </div>

    <div class="progress-meter" role="img" :aria-label="`当前完成度 ${completionRate}%`">
      <span>{{ completionRate }}%</span>
    </div>

    <div class="metric-grid">
      <div class="metric-item">
        <CheckCircle2 :size="18" aria-hidden="true" />
        <span>{{ completedCount }} / {{ totalSteps }} 步</span>
      </div>
      <div class="metric-item">
        <BookOpen :size="18" aria-hidden="true" />
        <span>{{ chapterCount }} 章</span>
      </div>
      <div class="metric-item">
        <Clock3 :size="18" aria-hidden="true" />
        <span>约 {{ totalMinutes }} 分钟</span>
      </div>
    </div>
  </section>
</template>
