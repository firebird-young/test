## 1. 系统概述
AxHub Make 采用**基于文件系统的静态配置与动态元数据生成相结合**的配置管理模式。系统核心围绕 `.axhub/make` 目录展开，通过 JSON 格式存储项目身份、入口映射、服务器状态及 UI 结构。配置加载主要发生在构建时（Vite 插件扫描）和运行时（脚本读取状态文件），不依赖传统的 `.env` 文件或复杂的配置中心，而是通过约定优于配置（Convention over Configuration）的方式管理原型（Prototypes）和主题（Themes）。

## 2. 核心配置文件与位置

### 2.1 静态项目配置
- **`.axhub/make/axhub.config.json`**: 顶层应用配置。定义服务器行为（如 `allowLAN`、`enableCommandAPI`）和项目默认值（如 `defaultTheme`）。这是开发者最常修改的配置文件之一。
- **`package.json`**: 定义工程化脚本入口。通过 `scripts` 字段编排 `dev`、`build`、`metadata:sync` 等命令，是配置执行的触发器。
- **`vite.config.ts`**: 构建工具配置。作为配置系统的“大脑”，它在启动时动态读取其他配置文件，并决定 Vite 的行为（如端口、主机、入口点）。

### 2.2 动态生成的元数据
- **`.axhub/make/entries.json`**: **入口清单**。由 `scripts/scan-entries.js` 或 Vite 插件在启动/构建前自动生成。它扫描 `src/prototypes` 和 `src/themes` 目录，建立 `name` 到 `js/html` 文件路径的映射。这是实现“新增原型无需手动配置路由”的关键。
- **`.axhub/make/project.json`**: **项目资源索引**。包含所有原型和主题的详细元数据（ID、标题、页面结构、更新时间）。由 `scripts/sync-project-metadata.mjs` 维护，用于侧边栏导航和资源管理。
- **`.axhub/make/.dev-server-info.json`**: **运行时状态**。记录当前开发服务器的 PID、端口、Host 和启动时间。用于多进程通信和健康检查。

## 3. 架构与约定

### 3.1 配置分层与加载流程
1. **初始化阶段**: `vite.config.ts` 启动，调用 `scanProjectEntries` 扫描文件系统，生成/更新 `entries.json`。
2. **配置合并**: Vite 插件读取 `axhub.config.json` 获取网络设置（如 LAN 访问权限），并结合 `entries.json` 确定 Rollup 的 `input` 入口点。
3. **运行时注入**: `writeDevServerInfoPlugin` 将服务器信息写入 `.dev-server-info.json`，供客户端或其他脚本通过 `scripts/utils/serverInfo.mjs` 读取。

### 3.2 关键设计决策
- **去中心化入口管理**: 不再使用硬编码的路由表。通过在 `src/prototypes` 或 `src/themes` 下增加文件夹并包含 `index.tsx`，系统自动将其识别为可用入口。
- **状态文件共享**: 使用 `.json` 文件作为进程间通信（IPC）的轻量级媒介。例如，Make Server 和 Vite Dev Server 通过读写 `.dev-server-info.json` 来协调状态。
- **环境变量极简主义**: 仅少量使用环境变量（如 `ENTRY_KEY` 用于单入口构建模式），大部分配置通过 JSON 文件管理，降低了环境配置的复杂度。

## 4. 开发者规则与最佳实践

### 4.1 新增原型/主题
- **无需修改配置**: 直接在 `src/prototypes/<name>/` 或 `src/themes/<name>/` 下创建目录，并确保包含 `index.tsx`。
- **自动同步**: 运行 `npm run dev` 或 `npm run build` 时，`entries.json` 和 `project.json` 会自动更新。

### 4.2 修改服务器行为
- **网络访问**: 若需局域网访问，修改 `.axhub/make/axhub.config.json` 中的 `server.allowLAN` 为 `true`。
- **端口冲突**: 默认端口为 `51720`。若需修改，应在 `vite.config.ts` 中调整 `OFFICIAL_CLIENT_DEV_PORT` 常量，或通过环境变量覆盖。

### 4.3 元数据维护
- **手动同步**: 若侧边栏或资源列表未更新，可手动运行 `npm run metadata:sync` 强制刷新 `project.json`。
- **不要手动编辑生成文件**: `entries.json` 和 `project.json` 是自动生成的，手动修改会在下次扫描时被覆盖。

### 4.4 脚本开发
- **引用常量**: 在编写新脚本时，应使用 `vite-plugins/utils/makeConstants.ts` 中定义的路径常量，以确保对 `.axhub/make` 目录结构的引用保持一致。
- **状态读取**: 使用 `scripts/utils/serverInfo.mjs` 提供的 `readServerInfo` 函数安全地读取服务器状态，避免直接解析 JSON 文件导致的竞态条件。