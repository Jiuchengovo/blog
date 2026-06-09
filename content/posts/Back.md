---
title: "后端笔记（承担测试任务）"
date: "2026-06-09"
tags: ["http", "javascript"]
---

## 后端基础

### 什么是后端

1. 前后端分工

- 前端负责界面展示和用户交互（浏览器里运行）
- 后端负责数据处理、业务逻辑、存储（服务器上运行）
- 用户点击按钮 → 前端发请求 → 后端处理并返回数据 → 前端更新界面

2. 后端的核心职责

- 接收并解析客户端请求
- 执行业务逻辑（计算、校验、权限判断）
- 与数据库交互（增删改查）
- 返回响应（JSON、HTML、文件等）

3. 一个最简单的后端例子

```javascript
// Node.js 原生 http 模块
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: '你好，这是后端返回的数据' }));
});

server.listen(3000);
```

### HTTP 协议

1. 什么是 HTTP

- **H**yper**T**ext **T**ransfer **P**rotocol（超文本传输协议）
- 客户端和服务端之间通信的规则——"你按这个格式发，我按这个格式回"
- 基于 TCP，无状态（每次请求互相独立，服务端默认不记得你是谁）

2. 请求（Request）的结构

- **请求行**：`GET /api/users HTTP/1.1`（方法 + 路径 + 协议版本）
- **请求头**：`Content-Type: application/json`、`Authorization: Bearer xxx` 等元信息
- **请求体**：POST / PUT 时携带的数据（JSON、表单等）

3. 常见 HTTP 方法

| 方法 | 含义 | 幂等性 | 示例 |
| :--- | :--- | :--- | :--- |
| **GET** | 获取资源 | 是 | `GET /users/1` 获取用户 1 |
| **POST** | 创建资源 | 否 | `POST /users` 新增用户 |
| **PUT** | 整体更新资源 | 是 | `PUT /users/1` 完整替换用户 1 |
| **PATCH** | 部分更新资源 | 否 | `PATCH /users/1` 只改用户名 |
| **DELETE** | 删除资源 | 是 | `DELETE /users/1` 删除用户 1 |

幂等：多次相同请求，结果一致（GET 查 10 次不变，DELETE 删第 2 次时资源已不存在但结果相同）

4. 常见 HTTP 状态码

- **2xx 成功**：`200 OK`（请求成功）、`201 Created`（创建成功）
- **3xx 重定向**：`301`（永久移动）、`302`（临时跳转）、`304`（内容未修改，用缓存）
- **4xx 客户端错误**：`400 Bad Request`（请求格式错误）、`401 Unauthorized`（未登录）、`403 Forbidden`（无权限）、`404 Not Found`（资源不存在）、`422 Unprocessable Entity`（参数校验失败）
- **5xx 服务端错误**：`500 Internal Server Error`（服务器代码崩了）、`502 Bad Gateway`（网关错误）、`503 Service Unavailable`（服务暂时不可用）

```javascript
// 不同状态码的响应
res.status(200).json({ data: user });
res.status(201).json({ message: '创建成功' });
res.status(404).json({ error: '用户不存在' });
res.status(500).json({ error: '服务器内部错误' });
```

5. 请求/响应的完整流程

用户浏览器输入 `https://example.com/api/users` 后发生了什么：
- 浏览器解析 URL，提取域名和路径
- DNS 将域名解析为服务器 IP 地址
- 通过 TCP 三次握手建立连接（HTTPS 还有 TLS 握手）
- 浏览器构造 HTTP 请求报文，发送到服务器
- 服务器收到请求，路由到对应的处理函数
- 处理函数执行业务逻辑、查数据库、组装数据
- 服务器返回 HTTP 响应（状态码 + 响应头 + JSON 数据）
- 浏览器收到响应，前端代码解析 JSON 并渲染界面

### API 设计（RESTful）

1. 什么是 RESTful

- **Re**presentational **S**tate **T**ransfer —— 一种设计风格，不是协议也不是标准
- 核心思想：把服务端的一切都视为"资源"（Resource），用 URL 定位资源，用 HTTP 方法操作资源
- 优点：统一接口、无状态、易于理解和扩展

2. URL 设计规范

- 名词用复数：`/users` 不写 `/getUsers` 或 `/user-list`
- 层级表示关系：`/users/1/orders`（用户 1 的所有订单）
- 过滤、排序用查询参数：`/users?role=admin&sort=created_at`

```javascript
// 好的设计
GET    /api/users           // 获取用户列表
GET    /api/users/1         // 获取用户 1
POST   /api/users           // 创建用户
PUT    /api/users/1         // 更新用户 1
DELETE /api/users/1         // 删除用户 1
GET    /api/users/1/orders  // 用户 1 的订单

// 不好的设计
GET /api/getUsers
POST /api/createUser
GET /api/deleteUser?id=1
```

3. 返回数据格式

- 统一使用 JSON
- 字段命名用 camelCase（`createdAt`）或 snake_case（`created_at`），团队统一即可
- 建议统一响应结构

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "小明",
        "email": "xiaoming@example.com"
    }
}
```

4. 无状态（Stateless）

- 服务端不保存客户端的状态（不存 session）
- 每次请求必须携带完整的认证信息（通常通过请求头 `Authorization: Bearer <token>`）
- 优点：方便水平扩展，加服务器不需要同步 session
