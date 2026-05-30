<script setup lang="ts">
import { CheckCircle2, CircleHelp } from '@lucide/vue'

import type { LessonStep } from '@/types/course'

defineProps<{
  completedCheckpoints: Record<string, boolean>
  steps: LessonStep[]
}>()

defineEmits<{
  setResult: [checkpointId: string, passed: boolean]
}>()
</script>

<template>
  <aside class="checkpoint-panel" aria-labelledby="checkpoint-title">
    <p class="eyebrow">Checkpoints</p>
    <h3 id="checkpoint-title">自测检查点</h3>
    <p class="muted">这些问题由章节小节标题生成，用于快速确认你是否真正理解当前步骤。</p>

    <div class="checkpoint-list">
      <article v-for="step in steps" :key="step.checkpoint.id" class="checkpoint-item">
        <div class="checkpoint-title-row">
          <CheckCircle2
            v-if="completedCheckpoints[step.checkpoint.id]"
            :size="18"
            aria-hidden="true"
          />
          <CircleHelp v-else :size="18" aria-hidden="true" />
          <h4>{{ step.title }}</h4>
        </div>
        <p>{{ step.checkpoint.prompt }}</p>
        <div class="checkpoint-actions">
          <button
            type="button"
            class="small-button"
            @click="$emit('setResult', step.checkpoint.id, true)"
          >
            能讲清
          </button>
          <button
            type="button"
            class="small-button secondary"
            @click="$emit('setResult', step.checkpoint.id, false)"
          >
            待复习
          </button>
        </div>
      </article>
    </div>
  </aside>
</template>
