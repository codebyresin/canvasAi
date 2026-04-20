---
name: editor-core-change-playbook
description: 规范 AICanva 中 Fabric.js 编辑器核心改动。用于新增或修改画布工具、对象操作、侧边栏交互、选中态行为，以及撤销重做相关逻辑时。
---

# 编辑器核心改动手册

## 目标
通过“命令优先”的改动方式，保证编辑器功能一致、可测试、可维护。

## 何时使用
- 新增编辑器工具（形状、文本、样式、变换、滤镜）
- 调整画布交互行为
- 修改工具栏或侧边栏动作
- 修复选中态、活动对象、撤销重做相关问题

## 架构约束
1. 画布行为集中在 `features/editor/hooks/useEditor.ts`。
2. UI 组件保持轻量，放在 `features/editor/components/*`。
3. 组件只调用 editor 命令，不在组件层重复写 Fabric 变更逻辑。
4. 共享常量和类型放在 `features/editor/type.ts`。

## 必走流程
1. 明确目标交互和用户预期结果。
2. 在 `useEditor.ts` 的 `buildEditor(...)` 中新增或修改命令。
3. 若 UI 需要当前状态，补充 getter（例如当前描边宽度）。
4. 在组件中绑定命令和 getter。
5. 确认渲染生命周期正确（需要时调用 `canvas.renderAll()`）。
6. 检查撤销重做和选中态副作用。

## 撤销重做检查清单
- 该动作是否在正确时机调用了 `save()`？
- undo 是否能正确恢复对象状态？
- redo 是否会出现重复对象或状态错位？
- undo/redo 后选中态是否仍然正确？

## 质量门槛
- 非展示逻辑不得把 Fabric 变更散落在各个 sidebar
- 命令不得绕开 editor 状态同步
- 不破坏既有 activeTool 切换流程
- 命名风格与现有命令保持一致

## 输出格式
应用本 skill 时按以下结构汇报：
1. 变更了哪些命令
2. 更新了哪些 UI 绑定
3. 对撤销重做行为的影响
4. 手动测试步骤
