# 主页内容与排版规范

本文件是 Li Zhang 个人主页的维护指南。修改内容或设计前先读这里；以后调整规则，直接编辑本文件。用户当前明确指令优先于本指南。

最后更新：2026-10-21。

## 当前状态

- 使用 `academic` 模板，主页展示英文。
- 用户于 2026-10-21 确认采用大字版，并授权将内容清理、顶栏模式切换与排版调整一并发布。
- 大字版现为全站默认样式，无需预览参数；已移除字号比较工具条。
- 实际发布状态以 GitHub Actions 的 Deploy to GitHub Pages 运行结果为准。
- 用户已选定桌面“宽度 90%”方案：1024px 及以上视口缩窄内容区，保留大字号、图片大小与纵向间距；已移除临时方案切换工具。

## 内容放在哪里

| 内容 | 唯一主要维护位置 | 使用方式 |
| --- | --- | --- |
| 姓名、联系方式、CV、导航开关、首页栏目顺序 | `content/site.json` | 调整 `sections`、`features`、`contact`、`social` 等字段 |
| About 正文与研究方向 | `content/about.md` 的 YAML 之后 | Markdown 段落、加粗、链接和编号列表 |
| 论文、作者、摘要、关键词与资源链接 | `content/publications/*.md` | 每篇一个文件；首页和 Publications 页复用同一数据 |
| 首页代表论文 | `content/site.json` → `selectedPublicationIds` | 仅维护论文 ID 和顺序，不另复制一套论文条目 |
| News | `content/news.json` | 新消息置于列表中，展示按 `sortDate` 倒序排列 |
| 学历与详细工作经历 | `content/experience.json` | Education 与 Positions 页 |
| 奖项 | `content/awards.json` | 记录奖项、授予机构与日期 |
| 审稿与学术服务 | `content/service.json` | 维护会议／工作坊和期刊列表 |
| 页面结构与显示逻辑 | `src/templates/academic/*.tsx` | 内容优先改 Markdown／JSON，不把文案写死在组件里 |
| 正式样式 | `src/templates/academic/academic.css` | 全站通用、响应式和深色模式样式 |

`content/zh/` 目前保留了一套对应内容，很多仍是英文镜像。修改已有镜像字段时同步维护，避免语言回退出现旧版本；用户要求真正翻译时再翻译，不自行改变学位、职位或论文名称。

`content/about.md` 的 `journeyPhases` 是旧时间线数据。当前首页不展示 My Journey；新经历只需维护 `experience.json`，不要为恢复旧时间线重复添加内容。

## 首页的分工

首页顺序：**About → News → Selected Publications → Awards & Honors → Service**。

- 侧栏放姓名、当前身份、所属学校、办公地址、邮箱、学术与社交链接、一个 CV 入口。
- 办公地址在街道后换行：第一行 `3420 Forbes Ave`，第二行 `Pittsburgh, PA 15260`。源数据仍使用完整地址字符串，组件在第一个逗号处分行，避免桌面端随宽度随机断行。
- 顶栏放导航与明亮／深色／跟随系统切换；不再重复放 CV。
- About 交代当前身份、导师、近期研究经历、简短学历背景和研究方向。
- 详细工作职责、完整教育时间线、成绩等放 Experience；不再把整套经历复制到首页。
- News 记录发生了什么新事件；代表论文记录成果本身。二者可以指向同一论文，但文字应承担不同功能。
- 奖项栏目汇总荣誉；论文上的获奖标记帮助识别对应成果，可以保留。
- 联系方式集中在侧栏；不再增加重复的 Contact 区块。

## About 写作

1. 身份段：当前项目／学校／导师，必要时一句近期研究经历。
2. 学历段：保持简短，学校名称使用正式链接。
3. 研究段：一句概括，接两条编号方向：`Evaluation & Benchmarks.`、`Training & Optimization.`。

- 直接写研究对象、方法与任务，避免空泛的个人成长叙述。
- 不恢复已删除的银行 Legal Counselor 工作经历句；该经历留在 Experience 页。
- Thomson Reuters 简介使用用户确认的 `In Summer 2026, I interned at Thomson Reuters Labs on legal agents.`；不要自行恢复 About 中的 long-term memory 长版本。
- 段落之间一个空行。只加粗研究核心概念和方向标题，不整段加粗。
- 链接写成 `[有意义的名称](完整 URL)`，不要直接展示很长的网址。
- 添加或修改链接后，逐项打开并核对目标的机构、人物或论文标题；不能只凭 HTTP 状态码判断正确。最近一次 About 核对见 [链接核对记录](docs/about-link-audit.md)。
- 每一条研究方向之间留出清晰间距；不要把完整论文作者、发表信息复制进 About。
- 用户提供的原文优先保留。超出明确指定的删改范围时，先列出具体建议或制作本地预览。

## 论文条目

### 必要字段

使用稳定 `id`、准确 `title`、完整有序 `authors`、`venue`、`venueType`、数值 `year`、`status` 和 `links`。摘要写在 frontmatter 之后。

- `venueType`：`conference`、`workshop`、`demo`、`preprint`。
- `status`：`accepted`、`published`、`preprint`。仅依据用户提供或已核实的来源更新。
- `venue` 保留真实类别，例如 Main／Findings／Workshop，不能因精简而丢失。
- 已确认 PLawBench 为 `ACL 2026 Main`，论文条目与 News 使用一致的类别。
- 会议与年份在每张卡片内只显示一次。当前位置在作者下方；模板仅在 `venue` 未含年份时补上年份。
- 始终保存完整作者列表和顺序。网页可以折叠长作者列表，不可从源数据删除作者。
- 本人姓名由 `site.json` 的 `name.authorVariants` 自动识别并突出显示。
- `isFirstAuthor`、`isCoFirst` 等是事实与筛选元数据；即使不显示标签也应保留。
- 不添加 `First Author` 文字徽章：作者顺序已经显示这一事实。
- `specialBadges` 用于真实奖项等额外信息；共同一作说明由 `isCoFirst` 渲染。
- 摘要和关键词保留在可展开的 Abstract 区域。关键词也用于检索和筛选，不因隐藏其他标签行而删除。
- 首页精选默认维持精炼的约 4–6 篇；新增前先考虑替换哪篇，避免无限增长。
- 不改已有 ID 来追随会议变更；ID 可能被首页配置或链接引用。

结构示例（占位值，发布前替换并核实）：

```yaml
---
id: stable-paper-id
title: "Exact Paper Title"
authors: [Li Zhang, Coauthor Name]
venue: "Conference Name"
venueType: conference
year: 2026
status: accepted
isFirstAuthor: true
keywords: [Topic One, Topic Two]
links:
  paper: "https://example.org/paper"
  code: "https://github.com/owner/repository"
---

A concise, source-backed abstract of the paper.
```

## News 与经历

### News

- 标题写事件及结果，例如 `DLawBench accepted to EMNLP 2026 Main`。
- 展开说明只补充标题没有提供的信息，例如研究任务、论文全名或活动地点；不要再次写一遍“该论文已被该会议接收”。
- 通常一条短句即可。Paper／Code／Event 等操作放 `links`。
- `date` 使用可读的月年，例如 `Aug 2026`；`sortDate` 使用已知事件日期 `YYYY-MM-DD`。不知道确切日期时先核实，不编造。
- 首页默认展示最近 3 条，旧消息通过 Earlier updates 展开。
- 新增时检查同一事件是否已有条目；获奖和接收是不同事件，可分别记录。

### Experience

- 学历放 `education.courses`；工作或研究职位放 `timeline`。
- `start`／`end` 使用 ISO 日期；未结束的职位省略 `end`，按事实设置 `isCurrent`。
- 机构、职位和日期仅在标题区出现一次；`summary` 概括职责，`highlights` 提供新增细节。
- 不添加 “building a strong foundation”“broadening exposure” 等没有具体信息的句子。
- 已结束的经历用过去时；不要把经历中的具体事实随意迁移到简介。
- 不在经历、项目或文章卡片底部重复显示用圆点连接的关键词串。
- 学位名称需要依据用户或原始证书确认，不能仅凭专业方向自行改写正式学位。

## 排版与交互

以下为已确认的正式排版标准，维护位置是 `academic.css` 末尾的 `Approved typography and spacing` 样式区及其响应式规则。

| 元素 | 正式标准 |
| --- | --- |
| 桌面 About 正文 | 18px，行高 1.8 |
| 手机 About 正文 | 17px |
| 论文标题 | 18px |
| 作者与会议信息 | 15px |
| 摘要 | 16px |
| 日期、资源按钮、关键词 | 14px |
| 栏目标题 | 27px，手机 25px |

- 桌面内容区宽度采用已选定的 90% 方案：视口大于 1100px 时为 `min(1080px, calc(90% - 86.4px))`；1024–1100px 时为 `calc(90% - 57.6px)`。低于 1024px 的布局保持原样。
- 缩窄仅作用于内容区宽度，不缩放字体、头像或间距；正文保持桌面 18px／手机 17px。文字自然换行，页面长度可能增加。
- 保持系统无衬线字体和现有蓝色主题；不为单个栏目任意添加字体或颜色。
- 大字号应配合行距、段距和栏目留白；不要用浏览器整体缩放代替排版调整。
- 正文采用相对清楚的深灰，辅助信息仍需可读，不使用极浅灰或极小字。
- 论文没有插图时使用单栏；有真实插图时才保留缩略图列，避免空出一整列。
- 手机导航与模式切换可分行；内容不得水平溢出。
- 模式切换放顶栏，保留明亮、深色、跟随系统三种模式及原有持久化行为。
- 保留键盘焦点样式、按钮可访问名称、摘要展开状态和作者展开功能。
- 论文标题、摘要、作者、链接之间应形成清晰层级。不要用更多标签来填充留白。

## 修改、预览与发布

1. 检查当前 Git 改动和本文件，定位对应内容源。
2. 对文本更新优先改内容文件；对表现更新改模板，避免无关重写和全文件格式化。
3. 检查对应 `content/zh/` 镜像，保留 ID、作者顺序和来源链接。
4. 使用 `npm run build` 与 `git diff --check`；组件变动运行相应 ESLint 检查。
5. 视觉变更在浏览器检查桌面与手机，至少检查首屏、论文卡片、展开摘要、模式切换和无水平溢出。
6. 用户要求“先列出来”时先列清具体删改；要求“预览”时保持本地，不默认推送上线。
7. 得到发布指令后提交并推送。`main` 推送触发 `.github/workflows/deploy.yml`，必须确认 Actions 成功并检查线上版本后再报告上线。
8. 用户改变设计或内容规则时直接更新本文件，避免另建一份互相冲突的指引。

本地启动：

```sh
npm run dev -- --host 127.0.0.1 --port 5173
```

- 普通本地页面：`http://127.0.0.1:5173/`
- 手机预览：`http://127.0.0.1:5173/design/typography-preview/mobile.html`

手机检查入口位于 `design/typography-preview/mobile.html`，仅用于本地开发。预览截图也放在该目录，作为本地审阅材料，不纳入 Git 或生产构建；其中旧截图可能保留历史方案，以当前页面和本规范为准。

## 待确认事项

- About 使用用户确认的 `Master of Law`，Experience 的历史数据仍为 `Master of Computational Law`。正式名称需确认后再统一，当前不擅自改动学历记录。
