import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(appRoot, '..')
const docsRoot = path.join(repoRoot, 'docs')

const sidebarPath = path.join(docsRoot, '_sidebar.md')
const outputPath = path.join(appRoot, 'src', 'data', 'generated', 'course.zh.json')

function stripHtml(value) {
  return value.replace(/<[^>]+>/g, '').trim()
}

function normalizeHref(href) {
  return decodeURIComponent(href.replace(/\\/g, '/').replace(/^\.\//, ''))
}

export function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseSidebar(content) {
  const chapters = []
  let currentPart = '未分组'
  let order = 0

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    const partMatch = line.match(/<strong>(.*?)<\/strong>/)
    if (partMatch) {
      currentPart = stripHtml(partMatch[1])
      continue
    }

    const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/)
    if (!linkMatch) continue

    const [, title, href] = linkMatch
    if (!href.includes('chapter') || !href.includes('第')) continue

    const sourcePath = normalizeHref(href)
    const chapterMatch = sourcePath.match(/chapter(\d+)/)
    if (!chapterMatch) continue

    order += 1
    chapters.push({
      id: `chapter${chapterMatch[1]}`,
      order,
      part: currentPart,
      sourcePath,
      title: stripHtml(title),
    })
  }

  return chapters
}

function isFenceStart(trimmedLine) {
  const match = trimmedLine.match(/^(`{3,}|~{3,})/)
  return match?.[1] ?? null
}

function cleanInlineMarkdown(value) {
  return stripHtml(value)
    .replace(/&emsp;|&nbsp;/g, ' ')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function isSupportHeading(title) {
  const withoutNumber = title.replace(/^\d+(?:\.\d+)*\s*/, '').trim()
  return /^(本章小结|本章总结|本章总结与展望|总结与展望|参考文献|习题|讨论|讨论与交流|References|Summary)$/i.test(
    withoutNumber,
  )
}

function findSummary(lines, startIndex) {
  let inFence = false
  let fenceMarker = ''

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    const marker = isFenceStart(trimmed)

    if (marker && !inFence) {
      inFence = true
      fenceMarker = marker
      continue
    }

    if (inFence) {
      if (trimmed.startsWith(fenceMarker)) {
        inFence = false
        fenceMarker = ''
      }
      continue
    }

    if (!trimmed) continue
    if (/^#{1,6}\s+/.test(trimmed)) break
    if (/^[-|:]{3,}/.test(trimmed) || trimmed.startsWith('|')) continue
    if (trimmed.startsWith('![') || trimmed.startsWith('<')) continue

    const cleaned = cleanInlineMarkdown(trimmed)
    if (cleaned) return cleaned.slice(0, 150)
  }

  return ''
}

export function parseMarkdownSteps(content, chapter) {
  const lines = content.split(/\r?\n/)
  const chapterNumber = chapter.id.replace('chapter', '')
  const steps = []
  let inFence = false
  let fenceMarker = ''
  let duplicateIndex = 0

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()
    const marker = isFenceStart(trimmed)

    if (marker && !inFence) {
      inFence = true
      fenceMarker = marker
      continue
    }

    if (inFence) {
      if (trimmed.startsWith(fenceMarker)) {
        inFence = false
        fenceMarker = ''
      }
      continue
    }

    const headingMatch = trimmed.match(/^(#{2,3})\s+(.+?)\s*#*$/)
    if (!headingMatch) continue

    const level = headingMatch[1].length
    const title = cleanInlineMarkdown(headingMatch[2])
    const isMainNumberedHeading = title.startsWith(`${chapterNumber}.`)
    const isIgnoredSupportHeading = isSupportHeading(title)

    if (!isMainNumberedHeading || isIgnoredSupportHeading) continue

    duplicateIndex += 1
    const slug = slugify(`${chapter.id}-${duplicateIndex}-${title}`)
    const lineNumber = index + 1
    const sourcePath = chapter.sourcePath.replace(/\\/g, '/')
    const sourceUrl = `https://github.com/datawhalechina/hello-agents/blob/main/docs/${encodeURI(sourcePath)}#L${lineNumber}`
    const summary =
      findSummary(lines, index) ||
      `围绕“${title}”完成概念理解、关键步骤梳理和实践复盘。`

    steps.push({
      id: `${chapter.id}-step-${String(duplicateIndex).padStart(2, '0')}`,
      title,
      level,
      anchor: slug,
      sourceLine: lineNumber,
      sourceUrl,
      summary,
      checkpoint: {
        id: `${chapter.id}-checkpoint-${String(duplicateIndex).padStart(2, '0')}`,
        prompt: `完成本节后，用自己的话说明“${title}”的核心目的、关键步骤和一个可实践的例子。`,
        type: 'reflection',
      },
    })
  }

  return steps
}

export function buildCourseData({ sidebar, readFile }) {
  const chapters = parseSidebar(sidebar).map((chapter) => {
    const absolutePath = path.join(docsRoot, chapter.sourcePath)
    const markdown = readFile(absolutePath)
    const steps = parseMarkdownSteps(markdown, chapter)
    const sourcePath = chapter.sourcePath.replace(/\\/g, '/')

    return {
      ...chapter,
      sourcePath: `docs/${sourcePath}`,
      sourceUrl: `https://github.com/datawhalechina/hello-agents/blob/main/docs/${encodeURI(sourcePath)}`,
      estimatedMinutes: Math.max(12, steps.length * 4),
      steps,
    }
  })

  return {
    generatedAt: new Date().toISOString(),
    language: 'zh-CN',
    source: 'docs/_sidebar.md',
    chapters,
  }
}

export function generateCourseData() {
  const sidebar = fs.readFileSync(sidebarPath, 'utf8')
  const courseData = buildCourseData({
    sidebar,
    readFile: (filePath) => fs.readFileSync(filePath, 'utf8'),
  })

  if (courseData.chapters.length !== 16) {
    throw new Error(`Expected 16 chapters, found ${courseData.chapters.length}`)
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(courseData, null, 2)}\n`, 'utf8')
  console.log(`Generated ${courseData.chapters.length} chapters -> ${path.relative(repoRoot, outputPath)}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateCourseData()
}
