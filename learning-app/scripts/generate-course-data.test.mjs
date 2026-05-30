import { describe, expect, it } from 'vitest'

import { parseMarkdownSteps, parseSidebar, slugify } from './generate-course-data.mjs'

describe('course data generator', () => {
  it('parses Chinese chapters from docsify sidebar only', () => {
    const sidebar = `
- [Hello-Agents](./README.md)
  - [前言](./前言.md)
- <strong>第一部分：智能体与语言模型基础</strong>
  - [第一章 初识智能体](./chapter1/第一章%20初识智能体.md)
  - [Chapter 1 Introduction](/en/chapter1/Chapter1-Introduction-to-Agents.md)
`

    expect(parseSidebar(sidebar)).toEqual([
      {
        id: 'chapter1',
        order: 1,
        part: '第一部分：智能体与语言模型基础',
        sourcePath: 'chapter1/第一章 初识智能体.md',
        title: '第一章 初识智能体',
      },
    ])
  })

  it('ignores markdown headings inside long fenced code blocks', () => {
    const content = `
# 第一章 初识智能体

## 1.1 什么是智能体
正文第一段。

\`\`\`\`python
# 这不是标题
## 1.2 这也不是标题
\`\`\`bash
# nested example
\`\`\`
\`\`\`\`

### 1.1.1 智能体定义
更多说明。
`

    const steps = parseMarkdownSteps(content, {
      id: 'chapter1',
      sourcePath: 'chapter1/第一章 初识智能体.md',
    })

    expect(steps.map((step) => step.title)).toEqual(['1.1 什么是智能体', '1.1.1 智能体定义'])
  })

  it('keeps duplicate numbered headings unique by order', () => {
    const content = `
## 1.4 第一次出现
正文。

## 1.4 第二次出现
正文。
`

    const steps = parseMarkdownSteps(content, {
      id: 'chapter1',
      sourcePath: 'chapter1/第一章 初识智能体.md',
    })

    expect(steps).toHaveLength(2)
    expect(steps[0].id).not.toBe(steps[1].id)
  })

  it('excludes numbered chapter wrap-up headings from core learning steps', () => {
    const content = `
## 10.5 协议实践
正文。

## 10.6 本章总结
总结内容。

## 10.7 总结与展望
展望内容。
`

    const steps = parseMarkdownSteps(content, {
      id: 'chapter10',
      sourcePath: 'chapter10/第十章 智能体通信协议.md',
    })

    expect(steps.map((step) => step.title)).toEqual(['10.5 协议实践'])
  })

  it('creates stable readable slugs for mixed Chinese and English titles', () => {
    expect(slugify('chapter7-1-7.1 Agent Framework')).toBe('chapter7-1-7-1-agent-framework')
  })
})
