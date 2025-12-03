> Original filename: README.md

# API 接口文档

本文档描述平台的API接口规范�?

## 基础信息

- **Base URL**: `https://api.example.com/v1`
- **认证方式**: Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误描述",
  "errors": []
}
```

## 认证接口

### 用户注册
- **接口**: `POST /auth/register`
- **说明**: 用户注册接口
- **请求参数**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": "string",
    "token": "string"
  }
}
```

### 用户登录
- **接口**: `POST /auth/login`
- **说明**: 用户登录接口
- **请求参数**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user_id": "string",
    "token": "string",
    "expires_in": 3600
  }
}
```

## 需求管理接�?

### 发布需�?
- **接口**: `POST /demands`
- **说明**: 发布新需�?
- **请求�?*: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "deadline": "datetime"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "demand_id": "string",
    "created_at": "datetime"
  }
}
```

### 获取需求列�?
- **接口**: `GET /demands`
- **说明**: 获取需求列�?
- **查询参数**:
  - `page`: 页码（默认：1�?
  - `limit`: 每页数量（默认：20�?
  - `category`: 分类筛选（可选）
  - `tag`: 标签筛选（可选）
- **响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "items": [
      {
        "demand_id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "tags": ["string"],
        "status": "string",
        "created_at": "datetime"
      }
    ]
  }
}
```

### 获取需求详�?
- **接口**: `GET /demands/{demand_id}`
- **说明**: 获取单个需求的详细信息
- **响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "demand_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "tags": ["string"],
    "status": "string",
    "creator": {
      "user_id": "string",
      "username": "string"
    },
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

## 资源管理接口

### 发布资源
- **接口**: `POST /resources`
- **说明**: 发布新资�?
- **请求�?*: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "title": "string",
  "description": "string",
  "type": "string",
  "quantity": "number",
  "tags": ["string"]
}
```

### 获取资源列表
- **接口**: `GET /resources`
- **说明**: 获取资源列表
- **查询参数**:
  - `page`: 页码
  - `limit`: 每页数量
  - `type`: 资源类型筛�?

## 进度管理接口

### 创建进度日志
- **接口**: `POST /progress`
- **说明**: 创建新的进度日志
- **请求�?*: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "demand_id": "string",
  "title": "string",
  "content": "string",
  "status": "string"
}
```

### 获取进度日志
- **接口**: `GET /progress/{demand_id}`
- **说明**: 获取某个需求的所有进度日�?
- **响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "log_id": "string",
        "title": "string",
        "content": "string",
        "status": "string",
        "created_at": "datetime"
      }
    ]
  }
}
```

## 分组与协作接�?

### 创建分组
- **接口**: `POST /groups`
- **说明**: 创建新的协作分组
- **请求�?*: `Authorization: Bearer {token}`

### 获取分组列表
- **接口**: `GET /groups`
- **说明**: 获取分组列表

### 分组成员管理
- **接口**: `POST /groups/{group_id}/members`
- **说明**: 添加分组成员

## 消息通知接口

### 获取消息列表
- **接口**: `GET /notifications`
- **说明**: 获取当前用户的消息列�?
- **请求�?*: `Authorization: Bearer {token}`

### 标记消息已读
- **接口**: `PUT /notifications/{notification_id}/read`
- **说明**: 标记消息为已�?

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授�?|
| 403 | 无权�?|
| 404 | 资源不存�?|
| 500 | 服务器错�?|

## 限流说明

- 每个IP地址�?00 请求/分钟
- 每个用户�?000 请求/小时

## 版本历史

- v1.0.0 (当前): 初始版本，包含核心功能接�?

---

更多接口将在开发过程中持续添加�?
