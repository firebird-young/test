## 1. 核心架构：基于 Design.md 的主题驱动系统

AxHub Make 采用**“Design.md 事实源 + 结构化元数据 + CSS Variables”**的三层样式架构。该系统不依赖单一的全局 UI 组件库，而是通过标准化的主题目录结构（`src/themes/<slug>/`）实现多品牌、多风格原型的快速切换与预览。

- **事实源 (Source of Truth)**: `DESIGN.md` 是视觉风格的唯一权威来源，包含色彩、字体、间距、圆角等设计规则的文本描述。
- **结构化映射**: `theme.json` 将 `DESIGN.md` 中的规则提取为机器可读的 JSON 结构（`tokens`, `display`），供 React 组件消费。
- **运行时样式**: `style.css` 利用 Tailwind v4 的 `@import "tailwindcss"` 引入基础能力，并通过 `.dmb-page` 作用域下的 CSS Custom Properties (`--dmb-*`) 注入具体品牌的视觉变量。

## 2. 关键技术栈与工具

- **CSS 框架**: **Tailwind CSS v4**。项目通过 `@tailwindcss/vite` 插件集成，支持在 CSS 文件中直接使用 `@import "tailwindcss"`。
- **样式方法论**: **Scoped CSS Variables**。每个主题在根容器（如 `.dmb-page`）定义一套以 `--dmb-` 为前缀的变量（如 `--dmb-accent`, `--dmb-bg`, `--dmb-radius-card`）。通用展示组件（`DesignMdBatchShowcase`）仅引用这些变量，从而实现“换肤”而不改逻辑。
- **构建工具**: Vite + React。通过自定义 Vite 插件（如 `axhubComponentEnforcer`）管理原型入口与资源引用。
- **辅助脚本**: `scripts/capture-theme-source.mjs` 等工具用于从网页或设计稿自动采集颜色、字体并生成初始的 `theme.json` 和 `DESIGN.md`。

## 3. 标准主题目录结构与约定

所有主题必须遵循 `src/themes/<theme-key>/` 的标准结构：

| 文件 | 职责 | 约束 |
| :--- | :--- | :--- |
| `DESIGN.md` | 视觉规范文档 | 必须包含 9 段式结构（氛围、色彩、字体、组件、布局等）。 |
| `theme.json` | 运行时元数据 | 必须包含 `identity`, `tokens`, `display` 字段；`slug` 需与目录名一致。 |
| `style.css` | 主题变量定义 | 必须以 `@import "tailwindcss";` 开头；在 `.dmb-page` 中定义 `--dmb-*` 变量。 |
| `tw.css` | Tailwind 片段 | 保留原始的 Tailwind 配置或作为最小可用片段。 |
| `index.tsx` | 演示页入口 | 必须 `export default Component`；静态 import 本地预览资源。 |
| `assets/` | 静态资源 | 必须包含 `tokens.json`（轻量快照）及至少一张预览图（如 `official-homepage.webp`）。 |

## 4. 开发规则与最佳实践

### 4.1 变量命名与作用域
- **全局前缀**: 所有主题级 CSS 变量必须使用 `--dmb-` 前缀（Design Md Batch）。
- **常用变量集**:
  - 色彩: `--dmb-accent`, `--dmb-bg`, `--dmb-ink` (主文本), `--dmb-ink-muted`, `--dmb-border`。
  - 尺寸: `--dmb-radius-xs/control/card/preview/pill`, `--dmb-spacing-xs/sm/md/lg`。
  - 字体: `--dmb-font-display`, `--dmb-font-body`, `--dmb-font-mono`。

### 4.2 一致性同步工作流
当修改主题视觉风格时，必须遵循以下同步顺序：
1. **更新事实源**: 首先修改 `DESIGN.md` 中的设计规则。
2. **同步元数据**: 根据 `DESIGN.md` 更新 `theme.json` 中的 `tokens` 和 `display` 字段。
3. **更新样式**: 在 `style.css` 中修正对应的 `--dmb-*` 变量值。
4. **验收**: 运行 `node scripts/check-app-ready.mjs /themes/[主题名]` 并进行视觉回归检查。

### 4.3 禁止行为
- **禁止硬编码颜色**: 在 `index.tsx` 或通用展示组件中，严禁直接写入 Hex 颜色值，必须引用 CSS 变量或 `theme.json` 中的数据。
- **禁止路径逃逸**: 主题内的资源引用（图片、字体）必须使用相对路径，禁止使用 `../` 逃逸出当前主题目录。
- **禁止覆盖事实源**: 不得根据截图或自动推断结果覆盖 `DESIGN.md` 中明确写明的规则。

## 5. 通用组件样式体系

项目提供了一套通用的展示与布局组件，其样式同样遵循变量化原则：
- **DesignMdBatchShowcase**: 位于 `src/common/DesignMdBatchShowcase`，通过 `base.css` 定义了一套完整的网格、卡片、色板展示布局，完全由 `--dmb-*` 变量驱动。
- **ThemeShell**: 位于 `src/common/ThemeShell`，提供深色/浅色模式切换的侧边栏布局，使用 JS 对象（`styles.ts`）管理中性色板，适用于管理端或预览外壳。
- **Side Menu**: 位于 `src/common/side-menu`，使用 BEM 命名规范（`.axhub-side-menu__*`）和硬编码的中性色（Gray/Slate 系列），作为系统级的导航组件，不随业务主题变化。