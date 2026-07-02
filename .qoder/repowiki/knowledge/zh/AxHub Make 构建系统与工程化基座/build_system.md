## 1. 核心构建体系
本项目采用 **Vite** 作为核心构建工具，配合 **TypeScript** 进行类型检查与编译。项目定位为“原型开发运行时”，因此构建流程高度定制化，旨在将设计资产（原型、主题）转换为可交互的 Web 应用。

- **包管理器**: `pnpm` (由 `pnpm-lock.yaml` 确认)。
- **构建工具**: Vite 5.x，利用其插件系统实现多入口管理、热更新过滤及元数据注入。
- **测试框架**: Vitest，用于单元测试与覆盖率报告。

## 2. 关键构建脚本与流程
构建逻辑并非简单的 `vite build`，而是通过一系列 Node.js 脚本编排的自动化流水线：

### 2.1 入口扫描与清单生成
- **脚本**: `scripts/scan-entries.js`
- **功能**: 在构建前自动扫描 `src/prototypes` 和 `src/themes` 目录，识别所有有效的 TSX/CSS 入口点。
- **输出**: 生成 `.axhub/make/entries.json`，作为 Vite 多入口构建的配置依据。

### 2.2 多入口并行/串行构建
- **脚本**: `scripts/build-all.js`
- **逻辑**: 
  1. 清理 `dist` 目录。
  2. 遍历 `entries.json` 中的所有 JS 入口。
  3. 通过 `spawnSync` 为每个入口单独触发 `vite build`，并设置环境变量 `ENTRY_KEY` 以区分当前构建目标。
  4. 这种“单入口独立构建”策略确保了每个原型/主题都能生成独立的 IIFE (Immediately Invoked Function Expression)  bundle，便于运行时动态加载。

### 2.3 元数据同步
- **脚本**: `scripts/sync-project-metadata.mjs`
- **功能**: 解析源码中的 JSDoc (`@name`)、路由定义 (`defineHashPageRoute`) 以及设计令牌，生成 `.axhub/make/project.json`。该文件是 AxHub Make 客户端识别项目结构、导航菜单及资源 URL 的核心依据。

## 3. Vite 插件架构
项目在 `vite.config.ts` 中集成了一套自定义插件集 (`vite-plugins/`)，实现了以下工程化能力：
- **autoStartMakeServerPlugin**: 开发环境下自动启动 AxHub Make 后端服务。
- **websocketPlugin**: 建立前端与后端的实时通信通道，支持原型热更新与状态同步。
- **canvasHotUpdateFilter**: 过滤掉非代码类资源（如 `.excalidraw` 文件）触发的无效 HMR。
- **injectStablePageIds**: 确保页面 ID 在构建间保持稳定，避免哈希变化导致的状态丢失。
- **axhubComponentEnforcer**: 在 IIFE 构建模式下强制注入 AxHub 组件运行时依赖。

## 4. 开发约定与规范
- **目录结构**: 
  - `src/prototypes/*`: 存放具体业务原型，每个子目录为一个独立入口。
  - `src/themes/*`: 存放视觉主题，同样作为独立入口构建。
  - `.axhub/make/`: 存放运行时生成的配置、会话记录及元数据。
- **入口标识**: 每个原型/主题必须在 `index.tsx` 中通过 `@name` 注释或 `defineHashPageRoute` 显式声明身份。
- **构建产物**: 最终产物位于 `dist/` 目录，每个入口对应一个 `.js` 文件，格式为 IIFE，全局暴露为 `UserComponent`。
- **类型检查**: 使用 `tsconfig.typecheck.json` 进行严格的类型校验，排除测试文件与生成代码。