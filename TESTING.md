# CityPaper API 接口验证指南

本指南提供了验证地图壁纸生成器“接口化”功能的完整用例。

## 1. URL 参数接口测试 (Manual Test Cases)

访问以下 URL，验证应用是否按预期自动配置：

| 测试用例 ID | 目标行为 | 测试 URL | 预期结果 |
| :--- | :--- | :--- | :--- |
| **TC-01** | 指定城市定位 | `?lat=30.65&lng=104.06&name=成都` | 预览图自动定位到成都 |
| **TC-02** | 主题风格切换 | `?s=retro&lat=39.9&lng=116.4` | 地图呈现“复古”风格 |
| **TC-03** | 强调色自定义 | `?c=00ff00` | 装饰条颜色变为鲜绿色 |
| **TC-04** | 屏幕比例适配 | `?r=9:16` | 壁纸容器变为较短的 16:9 比例 |
| **TC-05** | 超长屏适配 | `?r=9:21` | 壁纸容器变为极长的 21:9 比例 |
| **TC-06** | 综合 API 调用 | `?lat=31.23&lng=121.47&z=15&s=silver&c=ff00ff&r=9:19.5` | 银色风格、现代长屏比例的上海壁纸 |

## 2. 自动化验证脚本 (Browser Console)

在浏览器控制台 (F12) 中执行以下脚本，验证导出引擎：

```javascript
/**
 * 自动化导出验证脚本 (v2.0 - 包含比例验证)
 */
async function verifyExportAPI() {
  console.log("🚀 开始验证导出接口...");
  
  // 1. 验证渲染容器
  const canvas = document.querySelector('[data-testid="wallpaper-canvas"]');
  if (!canvas) {
    console.error("❌ 错误：未找到壁纸渲染区域。");
    return;
  }

  // 2. 验证比例应用
  const currentRatio = canvas.style.aspectRatio;
  const urlParams = new URLSearchParams(window.location.search);
  const targetRatio = urlParams.get('r')?.replace(':', '/') || "默认";
  
  console.log(`📊 比例同步验证: URL参数(${targetRatio}) vs 渲染样式(${currentRatio})`);

  // 3. 模拟应用自定义坐标
  const applyBtn = document.querySelector('[data-testid="btn-apply"]');
  const latInput = document.querySelector('[data-testid="input-lat"]');
  const lngInput = document.querySelector('[data-testid="input-lng"]');
  
  if (latInput && applyBtn) {
    latInput.value = "22.54";
    latInput.dispatchEvent(new Event('change'));
    applyBtn.click();
    console.log("✅ 坐标应用测试完成");
  }

  // 4. 触发下载
  const downloadBtn = document.querySelector('[data-testid="btn-download"]');
  console.log("⏳ 正在请求高清下载 (3x Sampling)...");
  downloadBtn.click();
  
  console.log("✅ 接口验证流程结束。");
}

// 提示：你可以直接在控制台输入 verifyExportAPI() 运行
```
