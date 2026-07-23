# NovaTrail Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将默认 Firefly 站点初始化为 NovaTrail，并清理原作者公开资料、示例数据和失效资源。

**Architecture:** 保持 Astro、Svelte 和现有路由。集中配置负责站点身份与导航；内容集合和外部数据源清空“我的”页面；既有页面的无数据分支显示定制提示，不增加新服务。

**Tech Stack:** Astro 7、Svelte 5、TypeScript、Astro Content Collections、pnpm、Cloudflare Workers Assets。

---

## 文件范围

- 品牌：`src/config/siteConfig.ts`、`backgroundWallpaper.ts`、`profileConfig.ts`、`announcementConfig.ts`、两个新增图片资源。
- 导航与互动：`navBarConfig.ts`、`friendsConfig.ts`、`commentConfig.ts`、`musicConfig.ts`、`sponsorConfig.ts`、`sidebarConfig.ts`。
- 内容：`src/content/spec/about.md`、`friends.mdx`、全部 `src/content/posts/*`，及动态集合。
- “我的”：动态、相册、追番、番组计划页面与其配置。
- 清理：默认壁纸、头像、音乐、打赏码、示例相册、看板娘、评论样式和未使用缓存。
- `wrangler.toml` 的现有 Assets 配置已获用户授权纳入提交；不更改 Cloudflare 账号、项目名、DNS 或远端域名绑定。

### Task 1: 建立回归检查基线

**Files:**
- Modify: `docs/superpowers/plans/2026-07-23-novatrail-initialization.md`
- Inspect only: `wrangler.toml`

- [ ] **Step 1: 确认工作区边界**

Run: `git status --short`

Expected: `wrangler.toml` 的用户修改保持未暂存，绝不写入或提交。

- [ ] **Step 2: 记录旧资料匹配项**

Run:

~~~powershell
rg -n 'firefly\.cuteleaf\.cn|blog\.cuteleaf\.cn|CuteLeaf|xiaye@msn\.com|qm\.qq\.com|gitee\.com' src public --glob '!public/pio/**'
~~~

Expected: 实施前能发现默认资料；实施后访客可见的应用文件没有这些匹配。

### Task 2: 品牌、域名与背景

**Files:**
- Create: `src/assets/images/novatrail-wallpaper.webp`
- Create: `public/assets/images/novatrail-avatar.svg`
- Modify: `src/config/siteConfig.ts`
- Modify: `src/config/backgroundWallpaper.ts`
- Modify: `src/config/profileConfig.ts`
- Modify: `src/config/announcementConfig.ts`

- [ ] **Step 1: 写入品牌资源**

复制 `D:\\Blog\\202408114ea7lj.webp` 为 `src/assets/images/novatrail-wallpaper.webp`。创建带深蓝至青绿渐层、白色字母 `N` 的 `novatrail-avatar.svg`；SVG 的 `title` 为 `NovaTrail`。

- [ ] **Step 2: 更新站点配置**

在 `siteConfig.ts` 设置：`title: "NovaTrail"`、`subtitle: "NovaTrail"`、`site_url: "https://novatrailx.qzz.io/"`、`description: "记录技术、思考与沿途风景。"`、关键词 `["NovaTrail", "博客", "技术", "思考", "指南"]` 与色相 `198`。导航 Logo 改用 `/assets/images/novatrail-avatar.svg`。清空 Bangumi 用户 ID 与 Bilibili UID，并禁用全部 Bangumi 分类。

- [ ] **Step 3: 更新背景和侧栏资料**

在 `backgroundWallpaper.ts` 使用单张 `assets/images/novatrail-wallpaper.webp` 作为 desktop/mobile 背景，关闭 `playerEnable`，禁用轮播和打字机，标题为 `NovaTrail`、副标题为 `记录技术、思考与沿途风景。`、遮罩为 `0.38`、位置为 `right center`。在 `profileConfig.ts` 使用新头像、名称和简介，仅保留 GitHub `https://github.com/Q11071` 与 RSS。将公告改为 NovaTrail 欢迎语。

- [ ] **Step 4: 验证配置**

Run: `pnpm check`

Expected: PASS，没有配置对象、路由或图片解析错误。

- [ ] **Step 5: 提交**

~~~powershell
git add src/assets/images/novatrail-wallpaper.webp public/assets/images/novatrail-avatar.svg src/config/siteConfig.ts src/config/backgroundWallpaper.ts src/config/profileConfig.ts src/config/announcementConfig.ts
git commit -m "feat: brand site as novatrail"
~~~

### Task 3: 导航、友链、关于与作者专属功能

**Files:**
- Modify: `src/config/navBarConfig.ts`
- Modify: `src/config/friendsConfig.ts`
- Modify: `src/config/commentConfig.ts`
- Modify: `src/config/musicConfig.ts`
- Modify: `src/config/sponsorConfig.ts`
- Modify: `src/config/sidebarConfig.ts`
- Modify: `src/content/spec/about.md`
- Modify: `src/content/spec/friends.mdx`
- Delete: `src/content/spec/guestbook.md`

- [ ] **Step 1: 写入失败预期的导航检查**

Run: `rg -n 'QQ交流群|Gitee|Firefly文档|Guestbook|Sponsor|CuteLeaf' src/config/navBarConfig.ts src/config/profileConfig.ts`

Expected before implementation: 有旧导航匹配；完成后无公开链接匹配。

- [ ] **Step 2: 重建公开菜单**

保留主页、文章、社交、我的、关于、链接。“社交”只使用 `LinkPresets.Friends`；“关于”只使用 `LinkPresets.About`；“链接”只保留名为 GitHub、URL 为 `https://github.com/Q11071` 的外链。禁用 `pages.guestbook` 与 `pages.sponsor`。

- [ ] **Step 3: 清空社交和作者专属服务**

令 `friendsConfig` 为空，友链页标题为“友链”、描述为“友链正在整理中，欢迎日后再来看看。”且 `showComment: false`。保持 `commentConfig.type: "none"`；关闭音乐在导航和侧栏的展示；清空打赏方式和名单，并关闭打赏按钮。关闭所有侧边栏的音乐和最新动态组件。

- [ ] **Step 4: 重写静态页面**

将关于页写为以下内容：

~~~markdown
# 关于 NovaTrail

NovaTrail 记录技术、思考与沿途风景。

## 关于本站

本站地址：[novatrailx.qzz.io](https://novatrailx.qzz.io/)。内容会从博客指南开始，逐步沉淀值得回看的笔记与实践。

## 联系与关注

- [GitHub](https://github.com/Q11071)
- [RSS](/rss/)
~~~

将友链页面写为“友链正在整理中，欢迎日后再来看看。”，删除留言板内容文件。

- [ ] **Step 5: 验证并提交**

Run: `pnpm check`

Expected: PASS，禁用页面不会出现在导航。

~~~powershell
git add src/config/navBarConfig.ts src/config/friendsConfig.ts src/config/commentConfig.ts src/config/musicConfig.ts src/config/sponsorConfig.ts src/config/sidebarConfig.ts src/config/siteConfig.ts src/content/spec/about.md src/content/spec/friends.mdx
git add -u -- src/content/spec/guestbook.md
git commit -m "feat: reset public navigation and profile pages"
~~~

### Task 4: 初始化“我的”页面

**Files:**
- Modify: `src/types/dynamicConfig.ts`
- Modify: `src/config/dynamicConfig.ts`
- Modify: `src/config/galleryConfig.ts`
- Modify: `src/pages/dynamic/index.astro`
- Modify: `src/pages/gallery/index.astro`
- Modify: `src/pages/anime.astro`
- Modify: `src/pages/bangumi.astro`
- Delete: all `src/content/dynamic/*.md`

- [ ] **Step 1: 为动态页增加空状态字段**

在 `DynamicConfig` 增加可选字段 `emptyText?: string`。在 `dynamicConfig.ts` 设为标题“动态”、描述“这里会陆续记录新的想法与片段。”、空文案“尚未发布动态，欢迎稍后再来。”、`showComment: false`，并关闭 Memos。将 `dynamic/index.astro` 的 `emptyText` prop 改为 `dynamicConfig.emptyText || i18n(I18nKey.dynamicEmpty)`。

- [ ] **Step 2: 清空动态与相册数据**

删除四个 `src/content/dynamic/2026-07-15-*.md` 文件；将 `galleryConfig.albums` 设为 `[]`。保持动态、相册、追番、番组页面开关为 `true`。

- [ ] **Step 3: 添加专属空提示**

在相册无数据分支显示“相册正在整理中，敬请期待。”和“新的沿途风景会在这里出现。”。在追番未配置分支显示“追番记录筹备中，暂未同步任何公开数据。”。在番组无用户 ID 分支跳过请求，显示“番组计划尚未开始记录。”，不渲染配置教程。

- [ ] **Step 4: 验证无作者数据**

Run:

~~~powershell
rg -n '1143164|38932988|users/xiaye|流萤真可爱|美好的一天' src public
pnpm check
~~~

Expected: 第一条无匹配，第二条 PASS。

- [ ] **Step 5: 提交**

~~~powershell
git add src/types/dynamicConfig.ts src/config/dynamicConfig.ts src/config/galleryConfig.ts src/pages/dynamic/index.astro src/pages/gallery/index.astro src/pages/anime.astro src/pages/bangumi.astro src/config/siteConfig.ts
git add -u -- src/content/dynamic
git commit -m "feat: initialize personal sections"
~~~

### Task 5: 规范化博客指南

**Files:**
- Modify: every Markdown and MDX file in `src/content/posts/`

- [ ] **Step 1: 统一元数据**

对每篇文章把 `published`（以及存在的 `updated`）改为 `2026-07-23`，把 `category` 改为 `博客指南`。把 `draft.md` 改为公开的“写作草稿指南”，删除 `draft: true`。

- [ ] **Step 2: 清理公开个人推广**

删除文章中的原作者博客、文档、QQ群、个人仓库卡片和个人站推广。保留 Astro、Markdown、Mermaid、PlantUML 和 KaTeX 的官方技术链接；主题来源仅保留中性归属说明。

- [ ] **Step 3: 验证文章规则**

Run:

~~~powershell
rg -n '^published: (?!2026-07-23)' src/content/posts --pcre2
rg -n '^category: (?!博客指南)' src/content/posts --pcre2
rg -n 'CuteLeaf|firefly\.cuteleaf\.cn|blog\.cuteleaf\.cn|qm\.qq\.com|gitee\.com|xiaye@msn\.com' src/content/posts
pnpm check
~~~

Expected: 前三条无匹配，内容检查 PASS。

- [ ] **Step 4: 提交**

~~~powershell
git add src/content/posts
git commit -m "docs: normalize blog guide content"
~~~

### Task 6: 清理冗余公开文件

**Files:**
- Delete: `src/assets/images/firefly.png`
- Delete: `src/assets/images/DesktopWallpaper/d1.avif` through `d6.avif`
- Delete: `src/assets/images/MobileWallpaper/m1.avif` through `m6.avif`
- Delete: `public/assets/music/`
- Delete: `public/assets/images/sponsor/`
- Delete: `public/gallery/firefly-2026/`
- Delete: `public/gallery/encrypted-test/`
- Delete: `public/anime-list.json`
- Delete: `public/assets/css/twikoo-custom.css`
- Delete: `public/pio/`

- [ ] **Step 1: 验证无运行时引用**

Run:

~~~powershell
rg -n 'firefly\.png|DesktopWallpaper/d[1-6]|MobileWallpaper/m[1-6]|assets/music|assets/images/sponsor|gallery/firefly-2026|gallery/encrypted-test|anime-list\.json|twikoo-custom\.css|/pio/' src public --glob '!public/pio/**'
~~~

Expected: 在前序配置变更完成后无运行时引用。

- [ ] **Step 2: 删除已核验资源**

先以 `Resolve-Path` 确认 `public/pio` 精确为 `D:\\Blog\\Firefly\\public\\pio`，然后用 PowerShell 的 `Remove-Item -LiteralPath` 对每项精确目标删除；不使用通配符删除项目根目录的内容。

- [ ] **Step 3: 验证并提交**

Run: `pnpm check`

Expected: PASS，不存在死链接或资源导入错误。

~~~powershell
git add -u -- src/assets/images public/assets public/gallery public/anime-list.json public/pio
git commit -m "chore: remove unused default assets"
~~~

### Task 7: 构建、扫描、推送与 Cloudflare 检查

**Files:**
- Inspect: `dist/`
- Inspect only: `wrangler.toml`

- [ ] **Step 1: 运行完整验证**

Run:

~~~powershell
pnpm check
pnpm type-check
pnpm build
~~~

Expected: 三条命令退出码均为 0。

- [ ] **Step 2: 扫描构建产物**

Run:

~~~powershell
rg -n 'firefly\.cuteleaf\.cn|blog\.cuteleaf\.cn|CuteLeaf|xiaye@msn\.com|qm\.qq\.com|gitee\.com|1143164|38932988|users/xiaye' dist
rg -n 'NovaTrail|novatrailx\.qzz\.io|记录技术、思考与沿途风景' dist
~~~

Expected: 第一条没有访客可见旧资料匹配；第二条在首页、关于页或元数据中有匹配。

- [ ] **Step 3: 审查提交边界**

Run: `git status --short; git log --oneline -6`

Expected: `wrangler.toml` 是唯一未提交的预存用户修改；NovaTrail 改动已分为聚焦提交。

- [ ] **Step 4: 获得最终外部发布确认后推送**

Run: `git push origin master`

Expected: 远端接受提交，既有 Cloudflare Git 集成触发新构建。若不存在该集成，停止并报告需要在 Cloudflare 控制台完成关联。

- [ ] **Step 5: 检查线上页面**

打开 `https://novatrailx.qzz.io/`，检查首页背景、关于、友链、动态、相册、追番、番组计划，以及 GitHub 链接；确认没有留言、QQ 群、Gitee、原作者资料或示例数据。
