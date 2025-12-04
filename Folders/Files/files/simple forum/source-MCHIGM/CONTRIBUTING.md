# 贡献指南

感谢您对社会需求/资源对接社区平台的关注！我们欢迎各种形式的贡献。

## 贡献方式

### 报告问题
- 使用 GitHub Issues 报告 bug
- 提供详细的复现步骤
- 包含系统环境信息
- 附上相关截图或日志

### 提出建议
- 在 Issues 中使用 "enhancement" 标签
- 清楚描述建议的功能
- 说明该功能的使用场景
- 讨论可能的实现方案

### 提交代码
- Fork 本仓库
- 创建特性分支
- 编写清晰的代码和注释
- 提交 Pull Request

## 开发流程

### 1. 准备工作

```bash
# Fork 并克隆仓库
git clone https://github.com/YOUR_USERNAME/source-MCHIGM.git
cd source-MCHIGM

# 添加上游仓库
git remote add upstream https://github.com/mchigm/source-MCHIGM.git

# 创建开发分支
git checkout -b feature/your-feature-name
```

### 2. 开发规范

#### 代码风格

**TypeScript/JavaScript**
- 使用 2 空格缩进
- 使用分号
- 使用单引号
- 遵循 ESLint 规则

**PHP**
- 遵循 PSR-12 编码规范
- 使用 4 空格缩进
- 类名使用 PascalCase
- 方法名使用 camelCase

**Python**
- 遵循 PEP 8 规范
- 使用 4 空格缩进
- 使用 type hints
- 编写 docstrings

#### 命名规范

- **变量名**: camelCase (JS/TS), snake_case (Python)
- **函数名**: camelCase (JS/TS/PHP), snake_case (Python)
- **类名**: PascalCase
- **常量**: UPPER_SNAKE_CASE
- **文件名**: kebab-case.ts, snake_case.py

#### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat(frontend): add user profile page

- Created user profile component
- Added profile editing functionality
- Implemented avatar upload

Closes #123
```

### 3. 测试

在提交代码前，请确保：

```bash
# 前端测试
cd frontend
npm run lint
npm test
npm run build

# PHP 后端测试
cd backend/php
composer test
./vendor/bin/phpcs

# Python 后端测试
cd backend/python
flake8 .
pytest
```

### 4. 提交 Pull Request

#### PR 标题格式
```
[类型] 简短描述
```

示例：
- `[Feature] 添加用户认证功能`
- `[Fix] 修复资源列表分页问题`
- `[Docs] 更新 API 文档`

#### PR 描述模板

```markdown
## 变更说明
简要描述此 PR 的目的和改动内容

## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 测试
描述如何测试这些变更

## 截图
如果有 UI 变更，请提供截图

## 相关 Issue
Closes #issue_number

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 已添加/更新测试
- [ ] 所有测试通过
- [ ] 没有引入新的警告
```

### 5. 代码审查

- 至少需要一位维护者的批准
- 解决所有审查意见
- 保持 PR 专注于单一目的
- 及时响应反馈

## 开发环境设置

### 必需工具

- Git
- Node.js 14+
- PHP 7.4+
- Python 3.8+
- Composer
- npm/yarn

### 推荐 IDE

- Visual Studio Code
- PHPStorm
- PyCharm

### 推荐插件

**VS Code:**
- ESLint
- Prettier
- PHP Intelephense
- Python
- GitLens

## 项目架构

在贡献代码前，请先了解项目架构：

1. 阅读 [README.md](./README.md)
2. 查看 [技术文档](./docs/)
3. 浏览现有代码了解结构
4. 参考 [API 文档](./docs/api/)

## 社区准则

### 行为准则

- 尊重所有贡献者
- 建设性的讨论和反馈
- 专注于解决问题
- 维护友好的社区氛围

### 沟通渠道

- GitHub Issues: 问题报告和功能讨论
- GitHub Discussions: 一般性讨论
- Pull Requests: 代码审查

## 版本发布

项目遵循语义化版本控制：

- 主版本号：不兼容的 API 变更
- 次版本号：向后兼容的功能新增
- 修订号：向后兼容的问题修正

## 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。

## 问题反馈

如有任何问题，请：
1. 查看现有 Issues
2. 阅读文档
3. 创建新 Issue

---

感谢您的贡献！Together we can build something amazing! 🚀
