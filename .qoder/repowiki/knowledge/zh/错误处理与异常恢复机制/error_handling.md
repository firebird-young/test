该仓库采用**去中心化、场景化**的错误处理策略，主要依赖原生 JavaScript/TypeScript 的 `try/catch` 机制、Promise 拒绝处理以及 React 错误边界（Error Boundary）。由于项目定位为原型开发运行时与工程化基座，其错误处理重点在于**构建稳定性**、**通信可靠性**以及**前端渲染容错**。

### 1. 核心处理模式

*   **React 错误边界 (Error Boundaries)**：
    *   在 Vite 插件 (`vite-plugins/clientPreviewPlugin.ts`) 和 Chrome 导出转换器 (`scripts/chrome-export-converter.mjs`) 中，动态注入或定义了 `AxhubPreviewErrorBoundary` / `ErrorBoundary` 组件。
    *   **作用**：捕获原型页面在运行时的渲染错误，防止白屏。当发生错误时，它会向父窗口（AxHub Make 客户端）发送 `AXHUB_PREVIEW_UPDATED` 消息，并展示友好的错误提示 UI。
    *   **上报**：通过 `window.axhub?.prototypeRuntime?.reportError` 接口将错误堆栈、组件信息及资源 ID 上报给宿主环境。

*   **异步通信与状态机错误处理**：
    *   在 WebSocket 插件 (`vite-plugins/websocketPlugin.ts`) 和 Live Server (`rules/references/impeccable/scripts/live-server.mjs`) 中，广泛使用基于状态机的错误响应。
    *   **WebSocket**：对接收到的消息进行严格的类型校验（如 `chrome-export:init`），若参数非法（如 `transferId` 缺失或路径不安全），立即通过 WS 通道返回 `chrome-export:error` 消息，而非直接抛出未捕获异常。
    *   **Live Server**：采用“租约（Lease）”机制处理浏览器与 Agent 之间的长轮询。若 Agent 超时未响应（`APPLY_EVENT_HARD_TIMEOUT_MS`），服务器会自动触发超时逻辑，回滚文件变更并记录 `chat_agent_timeout` 错误。

*   **进程与子命令执行容错**：
    *   `scripts/utils/command-runtime.mjs` 提供了跨平台的命令执行封装。
    *   **编码容错**：在 Windows 环境下，自动检测代码页（Code Page），若 UTF-8 解码失败，则降级尝试 `gbk` 或 `gb18030`，确保中文输出不乱码。
    *   **同步/异步隔离**：`runCommandSync` 和 `runCommand` 均捕获底层 `spawn` 错误，并将 `error`、`stdout`、`stderr` 结构化返回，由调用方决定如何处理（如重试或终止）。

*   **编译期校验**：
    *   `scripts/utils/generatedTsxValidator.mjs` 利用 TypeScript Compiler API 对动态生成的 TSX 代码进行静态分析。若发现语法错误，直接抛出 `Error` 并附带格式化的诊断信息，阻止无效代码进入运行时。

### 2. 关键约定与规则

*   **安全路径校验**：在处理文件上传或解压时（如 `websocketPlugin.ts`），所有相对路径必须经过 `isSafeRelativePath` 校验，禁止包含 `..` 或绝对路径，防止目录遍历攻击导致的文件系统错误。
*   **超时与回滚**：在涉及文件修改的自动化流程（如 Impeccable Live Mode）中，必须定义硬超时（Hard Timeout）。一旦超时，系统应尝试回滚到快照状态（`rollbackApplySnapshot`），保证项目文件不被破坏。
*   **错误上报标准化**：前端运行时错误应通过 `window.axhub.prototypeRuntime.reportError` 统一上报，携带 `type`（如 `react-render`）、`sourceFile` 和 `resourceId`，以便在 AxHub Make 界面中定位问题原型。

### 3. 局限性

*   **缺乏全局中间件**：后端服务（如 Live Server）未使用 Express/Koa 等框架的全局错误中间件，而是依赖每个路由处理器内部的 `try/catch` 块，可能导致部分未预期错误的堆栈信息泄露或响应不一致。
*   **日志分散**：错误日志主要通过 `console.error` 或 WS 消息发送，缺乏统一的日志聚合或持久化机制（如写入 `.axhub/logs`）。
