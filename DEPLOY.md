# Deployment Guide

## 重要约束

`@filament` 系列包托管在 Philips Artifactory（需要 VPN），GitHub Actions 服务器无法访问。
**所有部署必须在本地（连接 Philips VPN）执行**，不能依赖 CI/CD 自动构建安装依赖。

## 部署方式：本地构建 → 推送 gh-pages 分支

GitHub Pages 设置为从 `gh-pages` 分支的根目录 `/` 发布。

### 一键部署命令

```bash
yarn deploy
```

该命令等同于以下步骤：

```bash
yarn build:pages
cd dist
git init -b gh-pages
git add -A
git commit -m "Deploy $(date +%Y-%m-%d)"
git remote add origin https://github.com/VivaXian/WeConnect_PhaseII.git
git push -f origin gh-pages
cd ..
rm -rf dist/.git
```

### 前提条件

- 已连接 Philips VPN（用于 `node_modules` 安装，若已安装则不需要）
- 已登录 GitHub（HTTPS 凭据或 SSH）

## 版本管理流程

开发在 `main` 分支，部署前打 tag 记录版本：

```bash
# 1. 确认在 main 分支
git branch --show-current

# 2. 提交当前改动
git add -A
git commit -m "描述本次改动"

# 3. 打版本 tag（格式：PhaseII_MMDD_review）
git tag PhaseII_MMDD_review

# 4. 推送 main 和 tag
git push origin main
git push origin PhaseII_MMDD_review

# 5. 部署到 gh-pages
yarn deploy
```

## GitHub Pages 设置

仓库 Settings → Pages：
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `/ (root)`

## GitHub Actions Workflow

`.github/workflows/deploy-pages.yml` 当前仅在 PR 时做 type-check，**不执行部署**（因为 CI 无法访问 Artifactory）。部署完全由本地 `yarn deploy` 完成。

## 注意事项

- `dist/`、`.vite/`、`.DS_Store`、`weapp/dist/`、`weapp/.swc/` 均已加入 `.gitignore`，不提交到 `main` 分支
- `gh-pages` 分支不要手动修改，完全由 `yarn deploy` 管理
- `gh-pages` 分支允许 force push（部署分支，不保留历史）
- `main` 分支和 tag **不使用** force push，保留完整版本历史
