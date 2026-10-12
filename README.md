# Northstar VPN 客户端原型

这是一个自包含的响应式产品原型。直接在浏览器打开 `index.html`，或在此目录执行：

```sh
python3 -m http.server 8080
```

再访问 `http://localhost:8080`。界面适配桌面与手机尺寸，支持节点选择、搜索、自动优选、模拟连接、会话统计和偏好开关。

## 上线所需的实现边界

浏览器网页不能创建系统级 VPN 隧道。本原型的“连接”是交互演示，不能作为真实 VPN 服务使用。要发布可用产品，建议采用：

- **客户端**：iOS 使用 Network Extension + WireGuardKit；Android 使用 `VpnService` + WireGuard Go；桌面使用 Tauri/Electron 配合 WireGuard 原生隧道。
- **控制面**：认证、订阅、设备管理、节点健康检查与一次性 WireGuard 配置下发 API。
- **数据面**：在获授权的美国（和其他地区）云服务器上部署 WireGuard，私钥只保留在用户设备，配置实行轮换和吊销。
- **必备产品项**：隐私政策、适用地区法律审查、滥用处理渠道、断线保护（kill switch）、DNS/IPv6 防泄漏测试、监控与客服。

请勿将此原型的模拟连接状态用于安全决策。
