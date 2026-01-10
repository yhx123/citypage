# CityPaper - 城市地图 wallpaper 自动化生成引擎

CityPaper 是一个专为手机壁纸设计的 minimalist 地图渲染工具。它采用“配置即接口”的设计理念，支持通过 URL 参数精准控制地图状态，并具备高清批量导出能力。

---

## 🚀 快速启动 (Quick Start)

本项目基于 **Vite + React** 构建，请按照以下步骤启动：

1.  **安装依赖**：
    ```bash
    npm install
    ```
2.  **启动开发服务器**：
    ```bash
    npm run dev
    ```
3.  **访问应用**：在浏览器中打开生成的地址（默认通常是 `http://localhost:3000`）。

### 生产环境构建
若需部署到生产环境，请运行：
```bash
npm run build
```
生成的静态文件将存放在 `dist` 目录中。

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
| `name` | 城市名称 | `深圳` |
| `desc` | 标语描述 | `Shenzhen: Silicon Valley of Hardware` |
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

[shot-scraper](https://shot-scraper.datasette.io/) 是一个强大的命令行截图工具。你可以利用它实现壁纸的批量自动化生成。

#### 1) 安装
```bash
# 使用 pip 安装
pip install shot-scraper

# 关键步骤：安装浏览器驱动
playwright install
```

> [!IMPORTANT]
> `playwright install` 这一步至关重要。如果缺少它，运行截图时会报错 `Executable doesn't exist`。

#### 2) 生成壁纸
确保开发服务器正在运行（通常是 `http://localhost:3000`），然后运行：

```bash
# 生成带有自定义名称和标语的壁纸
shot-scraper "http://127.0.0.1:3000/?lat=22.54&lng=114.05&s=dark&r=9:19.5&name=深圳&desc=创新之城" \
  --selector '[data-testid="wallpaper-canvas"]' \
  --scale-factor 3 \
  --wait 3000 \
  -o shenzhen_wallpaper.png
```

**参数详解：**
-   `--selector`: 指定截取的 DOM 元素，这里我们截取壁纸预览中心区域。
-   `--scale-factor 3`: 3 倍采样率（对应参数 `--scale-factor`），确保输出图为超清分辨率。
-   `-o`: 输出文件名。

---

## ⚠️ 导出注意事项 (Export Tips)

-   **多文件下载权限**：批量导出时请点击浏览器弹窗中的 **“允许”**。
-   **高清采样**：导出的图片默认为 **3 倍像素密度 (3x)**。

## 📁 目录结构

-   `App.tsx`: 核心逻辑与导出引擎。
-   `components/MapPreview.tsx`: 高清地图组件。
-   `TESTING.md`: 完整的 API 自动化验证脚本。
