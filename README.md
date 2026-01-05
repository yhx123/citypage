# CityPaper - 城市地图壁纸自动化生成引擎

CityPaper 是一个专为手机壁纸设计的 minimalist 地图渲染工具。它不仅支持交互式生成，还提供了一套类似“接口”的 URL 参数控制系统，支持一键高清批量导出。

## 🚀 快速启动

由于本项目采用了现代化的 ES Modules 架构，建议通过以下方式运行：

1. **本地预览**：
   - 使用 VS Code 的 **Live Server** 插件打开 `index.html`。
   - 或者使用 Python 快速启动服务：`python -m http.server 8000`。
2. **访问地址**：
   - 打开浏览器访问 `http://localhost:8000`。

---

## 🛠️ 核心功能说明

### 1. URL 接口模式 (URL-as-an-Interface)
应用会自动将当前状态同步到 URL 参数中，您可以直接通过修改 URL 来控制渲染，无需手动点击：

- **基础格式**：`index.html?lat=[纬度]&lng=[经度]&z=[缩放]&s=[风格]&c=[强调色]`
- **示例**：[查看深圳 retro 风格](?lat=22.5431&lng=114.0579&z=15&s=retro&c=ff3b30&name=深圳测试)
- **参数说明**：
  - `lat` / `lng`: 中心点坐标。
  - `z`: 缩放级别 (10-18)。
  - `s`: 风格 ID (`dark`, `light`, `silver`, `retro`)。
  - `c`: 十六进制颜色代码（不含#）。
  - `debug=true`: 开启实时参数监控面板。

### 2. 批量导出管线 (Batch Export)
- **操作方式**：切换至“批量预览”模式，点击“一键导出全城市接口”。
- **技术原理**：应用会循环遍历 `constants.tsx` 中的预设城市，自动切换渲染上下文并触发浏览器的高清 PNG 下载。
- **画质**：默认开启 3 倍像素采样 (3x Pixel Ratio)，确保在 iPhone/Android 高刷屏上依然清晰。

### 3. API 调试模式
在 URL 后面添加 `&debug=true`，左侧侧边栏会显示一个黄色的 **Debug API Console**，实时反馈当前的接口参数映射状态。

---

## 🧪 验证与测试

详细的接口验证用例请参考项目根目录下的 [TESTING.md](./TESTING.md)。

## 📁 目录结构

- `App.tsx`: 接口逻辑、状态同步与导出引擎。
- `components/MapPreview.tsx`: 基于 Leaflet 的地图渲染核心组件。
- `constants.tsx`: 预设城市坐标库与全局风格配置。
- `types.ts`: API 类型定义。

---

## 🎨 视觉设计规范
- **比例**：固定为 9:19（标准手机屏幕比例）。
- **动效**：预览区带有缓动漂浮动画，导出时会自动隐藏所有 UI 干扰项。
- **字体**：采用 Inter 字体族，增强科技感。
