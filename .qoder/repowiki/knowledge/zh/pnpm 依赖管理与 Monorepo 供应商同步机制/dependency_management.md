## 1. 核心依赖管理系统
本项目采用 **pnpm** 作为主要的包管理器，配合 **Vite** 构建工具进行前端原型的开发与构建。依赖管理具有以下显著特征：

- **包管理器**: `pnpm` (通过 `pnpm-lock.yaml` 锁定版本，lockfileVersion: '9.0')。
- **依赖声明**: 在 `package.json` 中明确区分 `dependencies` (运行时依赖，如 `@axhub/annotation`, `lucide-react`) 和 `devDependencies` (开发时依赖，如 `vite`, `typescript`, `vitest`, `tailwindcss`)。
- **私有包支持**: 项目依赖了私有或内部包 `@axhub/annotation` 和 `@axhub/make-client`，表明其处于一个更大的 AxHub 生态系统中。

## 2. Monorepo 与 Vendor 同步策略
项目设计了一套独特的 **Vendor 同步机制**，以应对 Monorepo 环境下的内部依赖更新问题：

- **工作区检测**: 脚本 `scripts/sync-vendor-if-present.mjs` 会向上递归查找 `pnpm-workspace.yaml` 文件，以确定当前是否处于 Monorepo 根目录下。
- **自动同步**: 在 `dev`, `build`, `test` 等关键生命周期钩子中，会自动执行 `vendor:sync` 脚本。该脚本通过 `pnpm --filter @axhub/make vendor:sync` 命令，从 Monorepo 中的 `@axhub/make` 包同步必要的资源或依赖到当前客户端项目中。
- **跨平台兼容**: 内置了 `scripts/utils/command-runtime.mjs` 工具库，专门处理 Windows 环境下 `cmd.exe` 的命令执行、编码转换（GBK/UTF-8）及路径解析，确保依赖同步脚本在 Windows 和 Unix-like 系统上均能稳定运行。

## 3. 关键配置文件
- **`package.json`**: 定义了项目元数据、脚本命令及第三方依赖版本范围。
- **`pnpm-lock.yaml`**: 严格锁定所有直接和间接依赖的版本、哈希值及依赖树结构，确保构建的可重复性。
- **`skills-lock.json`**: 用于管理 AI Agent Skills（如 `.agents/skills/` 下的技能包），目前版本为 1，内容为空，但预留了技能依赖的锁定机制。
- **`scripts/sync-vendor-if-present.mjs`**: 核心的依赖同步入口脚本，实现了 Monorepo 环境感知的依赖更新逻辑。

## 4. 开发者规范与建议
- **依赖安装**: 必须使用 `pnpm install` 而非 `npm install`，以确保 `pnpm-lock.yaml` 的正确生成和 node_modules 的链接结构符合预期。
- **内部依赖更新**: 若在 Monorepo 环境下开发，修改 `@axhub/make` 后，无需手动复制文件，只需重新运行 `pnpm run dev` 或 `pnpm run build`，系统会自动触发 `vendor:sync` 进行同步。
- **脚本兼容性**: 新增自动化脚本时，应优先使用 `scripts/utils/command-runtime.mjs` 提供的 `runCommandSync` 或 `runCommand` 方法，以保证跨平台执行的稳定性，特别是处理 Windows 下的编码问题。
- **版本锁定**: 严禁手动修改 `pnpm-lock.yaml`。如需更新依赖，应使用 `pnpm update <package>` 命令。