# Fuzzing Console Frontend Refactor

这是把原来的大 `App.tsx` 拆分后的版本，保留原有运行方式与 API 对接逻辑。

## 拆分结构

```text
src/
  App.tsx
  main.tsx
  styles.css
  config/
    navigation.ts
  context/
    AppContext.tsx
  lib/
    api.ts
    constants.ts
    format.ts
    storage.ts
  types/
    index.ts
  components/
    ActionButton.tsx
    ChartPanel.tsx
    CodeBlock.tsx
    EmptyState.tsx
    Field.tsx
    MetricCard.tsx
    PageFrame.tsx
    Panel.tsx
    StatsPanel.tsx
    TagList.tsx
    Toast.tsx
    UploadBox.tsx
    layout/
      Sidebar.tsx
      Topbar.tsx
  pages/
    OverviewPage.tsx
    ProtocolPage.tsx
    SeedPage.tsx
    RiskPage.tsx
    FuzzPage.tsx
```

## 保持不变的部分

- 路由形式仍然是 `HashRouter`
- 依赖仍然是 React + Vite + TypeScript + framer-motion + lucide-react + recharts
- 后端接口路径保持不变
- Base URL 与 fuzz session 仍然写入 localStorage
- 总览页和模糊测试页共享实时状态与覆盖率轮询

## 启动

```bash
npm install
npm run dev
```

## 建议你后续改尺寸时优先改这些位置

- 页面级网格比例：`src/styles.css`
  - `.overview-grid`
  - `.split-grid`
  - `.triple-grid`
  - `.risk-grid`
  - `.fuzz-grid`
- 卡片内部留白：`.panel`、`.metric-card`
- 组件高度：`.upload-box`、`.chart-box`、`.action-button`
- 页面内容：直接改 `src/pages/*.tsx`
