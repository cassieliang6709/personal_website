# 🚀 部署完成 - 启用 GitHub Pages

代码已成功推送到 GitHub！现在只需要启用 GitHub Pages 即可在线访问你的网站。

## ✅ 已完成
- ✅ Git 仓库已初始化
- ✅ 所有文件已提交
- ✅ 代码已推送到 GitHub: https://github.com/cassieliang6709/personal_website

## 📝 下一步：启用 GitHub Pages

### 方法（只需 2 分钟）

1. **打开仓库页面**
   - 访问：https://github.com/cassieliang6709/personal_website

2. **进入 Settings**
   - 点击仓库顶部的 **Settings** 标签

3. **找到 Pages 设置**
   - 在左侧菜单中找到 **Pages**（在 "Code and automation" 部分下）

4. **配置部署源**
   - 在 "Source" 部分：
     - 选择 **Deploy from a branch**
     - Branch: 选择 **main**
     - Folder: 选择 **/(root)**
   - 点击 **Save**

5. **等待部署**
   - GitHub 会在 1-2 分钟内构建你的网站
   - 刷新页面后，你会看到绿色的提示框显示：
     ```
     Your site is live at https://cassieliang6709.github.io/personal_website/
     ```

## 🌐 访问你的网站

部署完成后，你的网站地址将是：
**https://cassieliang6709.github.io/personal_website/**

## 🔄 更新网站

以后如果需要更新网站内容：

```bash
cd "/Users/liangyue/src0811/coop preparation courses/resumes/1月14日投递/personal_website"
# 修改文件后
git add .
git commit -m "Update website content"
git push
```

GitHub Pages 会自动重新部署（通常需要 1-2 分钟）。

## ✨ 可选：使用自定义域名

如果你想使用自己的域名（如 `liangyue.site`）：

1. 在仓库 Settings → Pages → Custom domain 添加你的域名
2. 在你的域名 DNS 设置中添加 CNAME 记录指向 `cassieliang6709.github.io`

---

**提示**：如果 2 分钟后网站还是 404，检查一下：
- 确保 `index.html` 在仓库根目录
- 确保 GitHub Pages 已启用并选择了 main 分支
- 等待几分钟后再次访问
