# CityPaper - 城市地图 wallpaper 自动化生成引擎

CityPaper 是一个专为手机壁纸设计的 minimalist 地图渲染工具。它采用“配置即接口”的设计理念，支持通过 URL 参数精准控制地图状态，并具备高清批量导出能力。

---

## 🚀 快速启动 (Quick Start)

本项目采用 **纯 ESM (ES Modules) 架构**，无需复杂的 `npm install` 或 `npm build` 过程。

1.  **准备环境**：确保你的电脑安装了浏览器。
2.  **启动本地服务**：
    -   **命令行用户**：在项目根目录运行 `python -m http.server 8000`。
3.  **访问应用**：打开浏览器访问 `http://localhost:8000`。

---

## 🛠️ 接口化操作指南 (API Usage)

### 1. 核心参数映射表
你可以通过修改 URL 直接触发特定的渲染配置：

| 参数 | 含义 | 可选值示例 |
| :--- | :--- | :--- |
| `lat` | 纬度 | `31.23` |
| `lng` | 经度 | `121.47` |
| `z` | 缩放级别 | `10` 到 `18` |
| `s` | 地图风格 | `dark`, `light`, `silver`, `retro` |
| `c` | 装饰色 (Hex) | `ff3b30` |
| `r` | **屏幕比例** | `9:16`, `9:19`, `9:19.5`, `9:21` |

---

## 💻 命令行测试 (CLI & Curl)

虽然本应用是前端渲染，但你可以使用以下命令验证服务状态或进行自动化截图。

### 1. 连通性测试 (Curl)
验证本地服务器是否正常响应请求：
```bash
curl -I "http://localhost:8000/?lat=31.23&lng=121.47&z=15&s=silver&c=ff00ff&r=9:19.5"
```
*预期返回：`HTTP/1.0 200 OK`*

### 2. 自动化截图测试 (Shot-Scraper)
如果你安装了 [shot-scraper](https://shot-scraper.datasette.io/)，可以直接从命令行生成壁纸：
```bash
shot-scraper "http://localhost:8000/?lat=22.54&lng=114.05&s=dark&r=9:19.5" \
  --selector '[data-testid="wallpaper-canvas"]' \
  --scale 3 \
  -o shenzhen_wallpaper.png
```

---

## ⚠️ 导出注意事项 (Export Tips)

-   **多文件下载权限**：批量导出时请点击浏览器弹窗中的 **“允许”**。
-   **高清采样**：导出的图片默认为 **3 倍像素密度 (3x)**。

## 📁 目录结构

-   `App.tsx`: 核心逻辑与导出引擎。
-   `components/MapPreview.tsx`: 高清地图组件。
-   `TESTING.md`: 完整的 API 自动化验证脚本。
