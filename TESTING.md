# CityPaper API 接口验证指南

## 1. URL 参数接口测试 (Manual Test Cases)

| 测试用例 ID | 目标行为 | 测试 URL |
| :--- | :--- | :--- |
| **TC-06** | 综合 API 调用 | `?lat=31.23&lng=121.47&z=15&s=silver&c=ff00ff&r=9:19.5` |

## 2. 命令行验证 (CLI Verification)

如果你在本地 8000 端口启动了服务，可以使用以下 `curl` 命令测试接口参数是否被正确接收（通过检查返回的 HTML 结构）：

### 验证服务存活
```bash
curl -s "http://localhost:8000/" | grep -o "<title>.*</title>"
```
*预期输出：`<title>CityPaper - Map Wallpaper Generator</title>`*

### 模拟自动化请求 (带参数)
```bash
# 这个 curl 仅用于验证 URL 拼写和服务器路由是否正确
curl -v "http://localhost:8000/?lat=39.9&lng=116.4&s=retro&r=9:16"
```

## 3. 浏览器自动化验证脚本 (Browser Console)

在浏览器控制台执行：

```javascript
/**
 * 自动化导出验证脚本 (v2.1)
 */
async function verifyExportAPI() {
  const params = new URLSearchParams(window.location.search);
  console.log("🚀 正在验证参数接口...");
  console.log("📍 坐标:", params.get('lat'), params.get('lng'));
  console.log("📐 比例:", params.get('r'));
  
  const canvas = document.querySelector('[data-testid="wallpaper-canvas"]');
  if (canvas) {
    console.log("✅ 渲染容器匹配成功，比例为:", canvas.style.aspectRatio);
  } else {
    console.error("❌ 错误：未找到渲染区域，请检查当前是否处于“单个编辑”模式。");
  }
}
```
