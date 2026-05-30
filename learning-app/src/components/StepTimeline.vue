<script setup lang="ts">
import { Check, ExternalLink, Star } from '@lucide/vue'

import type { LessonStep } from '@/types/course'

defineProps<{
  isStepCompleted: (stepId: string) => boolean
  isStepFavorite: (stepId: string) => boolean
  steps: LessonStep[]
}>()

defineEmits<{
  toggleFavorite: [stepId: string]
  toggleStep: [stepId: string]
}>()
</script>

<template>
  <section class="timeline-panel" aria-labelledby="steps-title">
    <div class="section-heading compact">
      <div>
        <p class="eyebrow">Step Flow</p>
        <h3 id="steps-title">步骤学习流</h3>
      </div>
    </div>

    <ol class="step-list">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="step-item"
        :class="{ completed: isStepCompleted(step.id) }"
      >
        <span class="step-index">{{ index + 1 }}</span>
        <div class="step-body">
          <div class="step-heading">
            <h4>{{ step.title }}</h4>
            <div class="step-actions">
              <button
                class="icon-button"
                type="button"
                :aria-label="isStepFavorite(step.id) ? '取消收藏' : '收藏步骤'"
                @click="$emit('toggleFavorite', step.id)"
              >
                <Star :size="17" :fill="isStepFavorite(step.id) ? 'currentColor' : 'none'" />
              </button>
              <a
                class="icon-button"
                :href="step.sourceUrl"
                target="_blank"
                rel="noreferrer"
                aria-label="打开原文位置"
              >
                <ExternalLink :size="17" aria-hidden="true" />
              </a>
            </div>
          </div>
          <p>{{ step.summary }}</p>
          <button
            class="complete-button"
            type="button"
            @click="$emit('toggleStep', step.id)"
          >
            <Check :size="17" aria-hidden="true" />
            <span>{{ isStepCompleted(step.id) ? '已完成' : '标记完成' }}</span>
          </button>
        </div>
      </li>
    </ol>
  </section>
</template>
