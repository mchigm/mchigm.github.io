# 部署指南

本文档介绍平台的分阶段部署方案。

## 部署策略演进

项目采用分阶段的部署策略，逐步从简单到复杂、从集中式到去中心化演进：

### 阶段一：静态托管 + Serverless
**目标**: 快速原型验证  
**适用场景**: 初期开发测试  
**技术栈**:
- 前端：GitHub Pages / Netlify
- 后端：AWS Lambda / Vercel Serverless Functions
- 数据库：Firebase / Supabase

**优势**:
- 零运维成本
- 快速部署
- 自动扩展

### 阶段二：GitHub Pages + Firebase
**目标**: 稳定的云端服务  
**适用场景**: 正式上线初期  
**技术栈**:
- 前端托管：GitHub Pages
- 后端服务：Firebase Functions
- 数据库：Firebase Firestore
- 认证：Firebase Authentication
- 存储：Firebase Storage

**部署步骤**:

#### 1. GitHub Pages 配置
```bash
# 在仓库设置中启用 GitHub Pages
# 选择分支：main
# 目录：/frontend 或 /docs
```

#### 2. Firebase 项目设置
```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录 Firebase
firebase login

# 初始化项目
firebase init

# 选择功能：Hosting, Functions, Firestore
```

#### 3. 部署到 Firebase
```bash
# 部署所有服务
firebase deploy

# 仅部署托管
firebase deploy --only hosting

# 仅部署函数
firebase deploy --only functions
```

### 阶段三：本地虚拟机部署
**目标**: 独立可控的部署方案  
**适用场景**: 数据敏感、需要完全控制的场景  
**技术栈**:
- 虚拟化：VirtualBox / VMware / Docker
- 操作系统：Ubuntu Server 22.04 LTS
- Web服务器：Nginx
- PHP运行环境：PHP-FPM
- Python运行环境：Gunicorn / uWSGI
- 数据库：PostgreSQL / MySQL

**部署步骤**:

#### 1. 准备虚拟机
```bash
# 安装必要软件
sudo apt update
sudo apt install nginx php-fpm php-mysql python3 python3-pip mysql-server

# 配置防火墙
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

#### 2. 配置 Nginx
```nginx
# /etc/nginx/sites-available/mchigm
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mchigm/frontend;
    index index.html;

    # 前端静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PHP 后端 API
    location /api {
        root /var/www/mchigm/backend;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Python 后端服务
    location /py-api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 部署应用
```bash
# 克隆代码
cd /var/www
git clone https://github.com/mchigm/source-MCHIGM.git mchigm
cd mchigm

# 安装依赖
cd backend
composer install
pip3 install -r requirements.txt

cd ../frontend
npm install
npm run build

# 设置权限
sudo chown -R www-data:www-data /var/www/mchigm
sudo chmod -R 755 /var/www/mchigm
```

#### 4. 启动服务
```bash
# 启动 PHP-FPM
sudo systemctl start php8.1-fpm
sudo systemctl enable php8.1-fpm

# 启动 Python 服务
cd /var/www/mchigm/backend
gunicorn -w 4 -b 127.0.0.1:8000 app:app

# 重启 Nginx
sudo systemctl restart nginx
```

### 阶段四：去中心化架构（未来规划）
**目标**: 用户PC互访存储  
**适用场景**: 大规模社区化运营  
**技术方向**:
- IPFS：去中心化存储
- WebRTC：点对点通信
- Blockchain：信任机制
- DHT：分布式哈希表

**技术探索**:
- 研究 IPFS 集成方案
- 探索 P2P 网络架构
- 设计去中心化身份系统
- 构建分布式数据同步机制

## CI/CD 配置

### GitHub Actions 工作流

详见 `.github/workflows/` 目录下的配置文件。

主要工作流：
- **CI**: 代码检查、测试
- **CD**: 自动部署到 GitHub Pages
- **Build**: 构建前端和后端

## 环境配置

### 开发环境
```yaml
# config/config.example.yml
environment: development
database:
  host: localhost
  port: 3306
  name: mchigm_dev
  user: dev_user
  password: dev_password

api:
  base_url: http://localhost:8000
  version: v1

frontend:
  dev_server: http://localhost:3000
```

### 生产环境
```yaml
environment: production
database:
  host: prod-db.example.com
  port: 3306
  name: mchigm_prod
  user: prod_user
  password: ${DB_PASSWORD}  # 从环境变量读取

api:
  base_url: https://api.example.com
  version: v1

frontend:
  url: https://www.example.com
```

## 监控与维护

### 日志管理
- 应用日志：`/var/log/mchigm/`
- Nginx 日志：`/var/log/nginx/`
- PHP 日志：`/var/log/php-fpm/`

### 备份策略
- 数据库：每日自动备份
- 文件系统：每周完整备份
- 配置文件：版本控制

### 性能监控
- 使用 Prometheus + Grafana
- 监控指标：CPU、内存、磁盘、网络
- 告警设置：邮件 + 短信

## 故障排查

### 常见问题

#### 1. 前端无法访问
- 检查 Nginx 配置
- 验证文件权限
- 查看 Nginx 错误日志

#### 2. API 响应 502
- 检查 PHP-FPM 状态
- 验证 Python 服务运行
- 查看后端日志

#### 3. 数据库连接失败
- 验证数据库服务状态
- 检查连接配置
- 确认防火墙规则

## 安全建议

1. 使用 HTTPS（Let's Encrypt）
2. 定期更新系统和依赖
3. 配置 WAF（Web Application Firewall）
4. 启用数据库访问控制
5. 实施日志审计

---

根据项目发展阶段选择合适的部署方案。
