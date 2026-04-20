# 示例：editor-core-change-playbook

## 示例 1：新增描边样式工具

**触发词**
- 新增描边虚线样式
- 侧边栏增加描边类型选项

**标准输出**
1. 在 `useEditor.ts` 的 `buildEditor(...)` 新增或复用 `changeStrokeDashArray` 命令。
2. 在对应 sidebar 组件中仅绑定命令调用，不直接写 Fabric 对象变更。
3. 检查 `canvas.renderAll()` 是否在命令层统一触发。
4. 验证切换对象后，当前描边样式 getter 返回正确。
5. 手测：新增形状 -> 改描边类型 -> undo/redo -> 状态一致。

## 示例 2：修复撤销后选中态错乱

**触发词**
- undo 后对象丢失选中
- redo 后属性面板显示不对

**标准输出**
1. 检查历史快照保存时机，确认是否遗漏 `save()`。
2. 检查 `loadFromJSON` 回调后是否正确触发渲染和状态同步。
3. 校验 `selectedObjects` 更新来源，避免 UI 保留旧引用。
4. 回归测试：连续 5 次编辑 + 5 次撤销重做，属性面板不漂移。

## 示例 3：新增文本工具能力

**触发词**
- 增加文字阴影
- 新增文本字间距控制

**标准输出**
1. 先在 editor 命令层新增文本属性修改命令和对应 getter。
2. 在 `text-sidebar` 或 `toolbar` 仅消费命令和 getter。
3. 保持命名与既有 `changeFont*` 系列一致。
4. 手测：不同文本对象切换，面板状态实时同步。
