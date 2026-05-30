# Hello-Agents Learning App

`learning-app` 是为 `Hello-Agents` 教程新增的独立交互式学习前端。它面向希望高效学习 Agent 理论、代码示例和真实项目案例的读者，把原本线性阅读的 Markdown 教程转换为“章节路线图、学习步骤、自测检查点、复习列表和本地进度”的学习工作台。

这个应用不会替换现有 Docsify 文档站。Docsify 仍然是完整原文阅读入口；`learning-app` 负责提供更适合按步骤学习、跟踪进度和复盘知识点的交互体验。

## 核心能力

- 自动读取 `../docs/_sidebar.md`，生成 16 章中文学习路线。
- 自动解析 `../docs/chapter*/第*.md`，将编号小节转换为步骤卡。
- 为每个步骤生成反思型自测检查点。
- 支持标记完成、收藏步骤、查看待复习内容。
- 使用浏览器本地存储保存学习进度，不需要后端服务或账号。
- 提供 Windows 一键启动脚本，适合本地学习和演示。

## 启动命令

### Windows 一键启动

在 `learning-app/` 目录中运行：

```bash
.\start-learning-app.cmd
```

也可以直接双击 `learning-app/start-learning-app.cmd`。

脚本会自动完成以下流程：

1. 检查本机是否安装 `npm`。
2. 如果缺少 `node_modules`，自动执行 `npm install`。
3. 执行 `npm run generate` 生成课程数据。
4. 打开浏览器访问 `http://127.0.0.1:5173/`。
5. 启动 Vite 开发服务。

启动后请保持命令窗口打开；关闭窗口或按 `Ctrl+C` 会停止本地服务。

### 手动启动

```bash
cd learning-app
npm install
npm run generate
npm run dev
```

常用命令：

```bash
npm run generate  # 重新解析 docs/ 下的中文教程并生成课程 JSON
npm run test      # 运行解析脚本单元测试
npm run build     # 类型检查并构建生产产物
npm run preview   # 本地预览构建产物
```

## 首版范围

- 覆盖 16 章中文教程概要。
- 使用 Vue 3 + Vite + TypeScript 实现独立前端。
- 自动解析中文 Docsify 侧边栏和章节标题。
- 将编号小节转成学习步骤和反思型检查点，并过滤本章小结、总结与展望等辅助章节。
- 使用浏览器本地存储保存完成进度、收藏和检查点结果。

## 数据生成策略

`scripts/generate-course-data.mjs` 会：

- 读取 `../docs/_sidebar.md`，保留中文章节顺序和五大部分分组。
- 读取 `../docs/chapter*/第*.md`。
- 忽略代码块里的伪标题，并优先把 `章节号.x` / `章节号.x.x` 标题识别为主学习步骤。
- 过滤本章小结、参考文献、习题、讨论等不适合作为主学习步骤的辅助内容。
- 输出 `src/data/generated/course.zh.json` 供前端直接加载。

## 后续更新计划

这些内容已按用户要求记录为后续扩展，不纳入首版交付：

- **重点章节深做**：在 16 章概要稳定后，优先深做第 4、7、13、14、15 章。
- **案例流程演示**：为第 13 章智能旅行助手、第 14 章 Deep Research、第 15 章赛博小镇增加流程动画、架构走读和运行导览。
- **代码运行沙盒**：后续评估安全边界后，再支持浏览器内代码实验、命令模拟或远程沙盒。
- **双语同步**：接入 `docs/_sidebar_en.md` 和英文章节，增加中英切换。
- **高质量题库**：从章节习题、案例目标和人工审校内容生成选择题、判断题和错题复习。
- **公开部署**：首版先支持本地开发预览，后续再接 GitHub Pages 或现有文档站入口。
