# Personal Website Deployment Guide

This folder contains a lightweight personal website. All files are ready to deploy!

## 🚀 Quick Deploy: GitHub Pages (推荐)

### 方法 1: 使用 GitHub Web 界面（最简单）

1. **创建仓库**
   - 登录 GitHub，点击右上角 "+" → "New repository"
   - 仓库名：`yourusername.github.io`（会生成 `https://yourusername.github.io`）
   - 或使用其他名字如 `portfolio`（会生成 `https://yourusername.github.io/portfolio`）
   - 设置为 **Public**
   - **不要**勾选 "Initialize with README"

2. **上传文件**
   - 在仓库页面点击 "uploading an existing file"
   - 拖拽这个文件夹里的**所有文件**：
     - `index.html`
     - `article-*.html` (所有 6 个文章文件)
   - 点击 "Commit changes"

3. **启用 GitHub Pages**
   - 进入仓库 **Settings** → **Pages**
   - Source: 选择 **Deploy from a branch**
   - Branch: 选择 **main**，文件夹选择 **/(root)**
   - 点击 **Save**
   - 等待 1-2 分钟，刷新后看到 "Your site is live at..."

### 方法 2: 使用 Git 命令行

```bash
# 进入网站文件夹
cd "/Users/liangyue/src0811/coop preparation courses/resumes/1月14日投递/personal_website"

# 初始化 git
git init
git add .
git commit -m "Initial commit: Personal website"

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送
git branch -M main
git push -u origin main
```

然后在 GitHub 仓库 Settings → Pages 启用即可。

---

## ⚡ 备选方案：Vercel（更快速，推荐）

### 优势：
- 自动 HTTPS + 全球 CDN
- 连接 GitHub 后，每次 push 自动部署
- 30 秒上线

### 步骤：
1. 访问 [vercel.com](https://vercel.com)，用 GitHub 登录
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 点击 "Deploy"
5. 完成！

---

## 📋 部署前检查

- [x] 所有 HTML 文件都在根目录
- [x] 所有文章链接使用相对路径（如 `article-wordforge.html`）
- [ ] 测试所有链接是否正常工作
- [ ] 检查移动端显示

---

## 🔧 常见问题

**Q: 网站显示 404？**
A: 确保 `index.html` 在仓库根目录，并且 GitHub Pages 已启用。

**Q: 样式丢失？**
A: 你的 CSS 已经内嵌在 HTML 中，应该没问题。

**Q: 想更新网站？**
A: 修改文件后 push 到 GitHub，GitHub Pages 会自动更新（可能需要几分钟）。

---

## 💡 后续优化建议

1. **添加 Analytics**（可选）：
   - [GoatCounter](https://goatcounter.com) - 隐私友好
   - Google Analytics

2. **添加 Favicon**：
   - 创建 `favicon.ico`，在 `index.html` 的 `<head>` 添加：
   ```html
   <link rel="icon" href="favicon.ico">
   ```

3. **SEO 优化**（可选）：
   - 添加 meta 标签和 Open Graph 标签

---

**推荐：先用 GitHub Pages 快速上线，之后可以迁移到 Vercel 获得更好性能！**
