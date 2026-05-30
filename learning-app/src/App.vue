<script setup lang="ts">
import { BookOpenCheck, Gauge, RotateCcw, Settings } from '@lucide/vue'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/" aria-label="返回学习总览">
        <span class="brand-mark">HA</span>
        <span>
          <strong>Hello-Agents Learning</strong>
          <small>交互式步骤学习台</small>
        </span>
      </RouterLink>

      <nav class="topnav" aria-label="主导航">
        <RouterLink to="/">
          <Gauge :size="18" aria-hidden="true" />
          <span>总览</span>
        </RouterLink>
        <RouterLink to="/review">
          <RotateCcw :size="18" aria-hidden="true" />
          <span>复习</span>
        </RouterLink>
        <RouterLink to="/settings">
          <Settings :size="18" aria-hidden="true" />
          <span>设置</span>
        </RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <section class="intro-band" aria-labelledby="app-title">
        <div>
          <p class="eyebrow">AI Native Agent Learning Path</p>
          <h1 id="app-title">把 16 章教程拆成可执行的学习步骤</h1>
        </div>
        <BookOpenCheck class="intro-icon" :size="42" aria-hidden="true" />
      </section>

      <RouterView />
    </main>
  </div>
</template>
