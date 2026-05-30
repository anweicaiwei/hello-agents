<script setup lang="ts">
import { Trash2 } from '@lucide/vue'

import { useCourse } from '@/composables/useCourse'
import { useProgress } from '@/composables/useProgress'

const { chapters } = useCourse()
const progress = useProgress(chapters)
</script>

<template>
  <section class="settings-panel">
    <p class="eyebrow">Local Data</p>
    <h2>学习数据管理</h2>
    <p>
      当前版本不需要账号和后端服务，进度、收藏和检查点结果只保存在本浏览器。
    </p>
    <button class="danger-action" type="button" @click="progress.resetProgress">
      <Trash2 :size="18" aria-hidden="true" />
      <span>清空本地进度</span>
    </button>
  </section>
</template>
