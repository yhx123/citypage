
# CityPaper API 接口验证指南

本指南提供了验证地图壁纸生成器“接口化”功能的完整用例。

## 1. URL 参数接口测试 (Manual Test Cases)

访问以下 URL，验证应用是否按预期自动配置：

| 测试用例 ID | 目标行为 | 测试 URL | 预期结果 |
| :--- | :--- | :--- | :--- |
| **TC-01** | 指定城市定位 | `?lat=30.65&lng=104.06&name=成都` | 预览图自动定位到成都，标签显示“成都” |
| **TC-02** | 主题风格切换 | `?s=retro&lat=39.9&lng=116.4` | 地图呈现黄色“复古”风格 |
| **TC-03** | 强调色自定义 | `?c=00ff00` | 装饰条颜色变为鲜绿色 |
| **TC-04** | 缩放系数控制 | `?z=18` | 地图像素级放大，显示详细街道 |
| **TC-05** | 综合 API 调用 | `?lat=31.23&lng=121.47&z=15&s=silver&c=ff00ff&name=上海测试` | 银色风格、15倍缩放、粉色装饰的上海壁纸 |

## 2. 自动化验证脚本 (Browser Console)

在浏览器控制台 (F12) 中执行以下脚本，验证导出引擎：

```javascript
/**
 * 自动化导出验证脚本
 */
async function verifyExportAPI() {
  console.log("🚀 开始验证导出接口...");
  
  // 1. 验证是否存在导出目标
  const canvas = document.querySelector('[data-testid="wallpaper-canvas"]');
  if (!canvas) {
    console.error("❌ 错误：未找到壁纸渲染区域。请确保不在批量模式下。");
    return;
  }

  // 2. 验证参数应用
  const applyBtn = document.querySelector('[data-testid="btn-apply"]');
  const latInput = document.querySelector('[data-testid="input-lat"]');
  const lngInput = document.querySelector('[data-testid="input-lng"]');
  
  latInput.value = "22.54";
  lngInput.value = "114.05";
  latInput.dispatchEvent(new Event('change'));
  applyBtn.click();
  
  console.log("✅ 坐标参数已应用：22.54, 114.05");

  // 3. 验证图片导出
  const downloadBtn = document.querySelector('[data-testid="btn-download"]');
  console.log("⏳ 正在触发下载接口...");
  downloadBtn.click();
  
  console.log("✅ 接口测试完成。请检查浏览器下载项中是否生成了 PNG 文件。");
}

// 执行测试
// verifyExportAPI();
```

## 3. UI 交互测试 (Intergration Test)

1. **单点测试**：在“单个编辑”模式下更改城市，观察地址栏参数是否同步更新。
2. **批量压力测试**：点击“一键导出全城市”，观察进度条是否平稳前进（1/34 -> 34/34），并检查是否触发了多个文件下载。
3. **断网测试**：在无网络环境下，验证地图是否显示“加载中”并保持 UI 不崩溃。
