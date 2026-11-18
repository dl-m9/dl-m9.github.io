# Paper Pages 技能文档（仓库定制版）

本文件基于当前仓库 `paper-pages` 的真实结构总结，不是通用模板。

---

## 1. 目录与架构现状

当前论文页面目录：

- `paper-pages/SVDecode/index.html`
- `paper-pages/cpguard/index.html`
- `paper-pages/cpguardp/index.html`
- `paper-pages/cp-uniguard/index.html`
- `paper-pages/InfoReasoner/index.html`
- `paper-pages/SIOP/index.html`

样式：所有论文页与博客文章（例如 `smol-training-playbook-en`）使用同一套模板。

- `../paper.css`：从博客 `assets/post.css` 复制，末尾加了论文页组件
- `../paper.js`：从博客 `assets/post.js` 复制，负责主题切换、阅读进度、目录和阅读时长
- 页面不加载 `../../styles.css`，也不写内联 `<style>`。需要新样式时加到 `paper.css`
- 博客模板改动后，如需保持一致，把改动同步到这两个文件

---

## 2. 新建论文页的标准骨架（本仓库）

新页面放在 `paper-pages/<paper-folder>/index.html`，复制一个现有页面再改内容最省事。

`<head>`：IBM Plex Sans 字体、Font Awesome、favicon、`../paper.css`、`../paper.js`，有公式时再加 MathJax。

`<body>` 结构与博客文章一致：

1. `nav.topbar`：和博客文章一样，左边 "Senkang Forest Hu · Blog"，右边 "← All posts" 和主题切换按钮，都链接到博客首页 `../../blog/`
2. `header.hero`：`.category` 写会议简称（如 ICML'26），`h1` 写论文标题
3. `div.meta`：Authors 和 Affiliations 用 `dl.meta-wide` 占整行，作者备注（共同一作、通讯作者）用 `.note-line`；然后是 Venue、Links（`dd.links`，链接之间自动加点）、Length（`data-reading-time`）
4. `div.layout`：左侧 `nav.toc` 和正文 `.post-body`。正文里的 h2、h3、h4 自动生成目录。目录默认折叠，和 Smol 一样只展开当前所在的小节，不用加属性。只有用户要求平铺时才在 `.post-body` 上加 `data-toc-flat`
5. `footer.post-footer`

正文建议顺序：

1. Abstract 或 Why This Project Exists
2. Method
3. Figures
4. Formulas（如有）
5. Results tables
6. Case study（如有）
7. BibTeX
8. Related Work
9. Disclaimer（放最后）

---

## 3. 可复用组件（定义在 `paper.css`）

- `.story-callout` / `.highlight-box`：浅色提示块
- `.story-steps` / `.story-step`：带编号的步骤
- `.case-box`、`.mono-line`：案例展示
- `.image-container` / `.figure-panel` + `.image-caption`：图和说明
- `.comparison-grid`、`.figure-grid`（`.source-figure-pair`、`.training-figure-grid`）：并排图
- `.table-container` + `.paper-table` / `.result-table`：表格，横向可滚动；我们的方法行用 `.ours-row`
- `.math-block`：公式
- `.bibtex`：BibTeX，内容顶格写，字段缩进两个空格
- `.paper-disclaimer`：免责声明
- `.contribution-list`：带勾号的列表

## 4. 图、公式、表格的实战规则

### 4.1 图（最容易出问题）

- 建议统一放：`paper-pages/<paper-folder>/fig/`
- 页面中使用相对路径：`fig/xxx.png`
- 文件名和大小写必须严格一致（GitHub Pages 对大小写敏感）
- 页面展示风格默认使用“裸图”：
  - 不加卡片背景
  - 不加边框
  - 不加圆角
  - 不额外外层框包裹（除非用户明确要求）
- 每张图必须配“详细解释”（不能只写 Figure X）：
  - 图在讲什么（任务/流程/对比对象）
  - 关键元素含义（颜色、箭头、坐标轴、指标）
  - 读图结论（从图中得到的核心发现）
  - 与正文关系（该图支持哪一段主张）

### 4.2 公式（MathJax）

- 有公式就在 `<head>` 配置 MathJax，再 `defer` 加载脚本
- 使用 `$$...$$` 块公式
- 公式容器建议带横向滚动（避免移动端溢出）
- 文案策略默认“少公式”：
  - 优先文字解释
  - 非必要推导不放页面（细节指向论文原文）

### 4.3 表格

- 大表必须套 `.table-container`
- 第一列左对齐，其余列居中
- “我们的方法”行可加浅色高亮，保持可读性

---

## 5. publications.json 联动规范

新增论文页后，必须同步更新 `data/publications.json` 的 `Project` 标签：

- 链接格式：`paper-pages/<paper-folder>/index.html`
- `paper-folder` 名字与实际目录**完全一致**（包括大小写）

这是首页“Project”能否正常打开的关键点。

---

## 6. 本仓库已踩坑（重点）

1. **路径大小写不一致会导致线上 404**  
   `data/publications.json` 中链接与 `paper-pages` 实际文件夹名必须逐字符一致。

2. **图文件缺失会直接破图**  
   页面里引用了 `fig/*.png`，仓库里若没提交同名文件，页面不会显示。

3. **内联 SVG 特殊字符未转义会整图失效**  
   例如 `&` 必须写成 `&amp;`。

4. **样式只写在 `paper.css`**  
   不要在单页里加内联 `<style>`，改样式后检查全部论文页。

5. **不要使用未定义 CSS 变量**  
   使用 `var(--xxx)` 前先确认在 `paper.css` 已定义。

---

## 7. 上线前检查清单（必跑）

- [ ] 页面能打开，顶栏、目录和主题切换正常
- [ ] PDF / Code / Project / BibTeX 链接全部可用
- [ ] 所有图片加载正常（无破图）
- [ ] 每张图都有详细 caption/解释（含图意+结论）
- [ ] MathJax 公式渲染正常（如适用）
- [ ] 大表在手机上可横向滚动
- [ ] 作者与单位信息完整
- [ ] 免责声明在页面末尾
- [ ] `data/publications.json` 的 Project 链接路径正确

---

## 8. InfoReasoner 当前说明（按现状）

当前页面：

- `paper-pages/InfoReasoner/index.html`

若使用论文原图，默认引用位置应为：

- `paper-pages/InfoReasoner/fig/overview.png`
- `paper-pages/InfoReasoner/fig/em_score_mean_comparison.png`
- `paper-pages/InfoReasoner/fig/all_score_infogain_iroutput_comparison.png`
- `paper-pages/InfoReasoner/fig/entropy_loss_comparison.png`
- `paper-pages/InfoReasoner/fig/response_length_comparison.png`
- `paper-pages/InfoReasoner/fig/boxplot_comparison.png`
- `paper-pages/InfoReasoner/fig/dict_lineplot.png`
- `paper-pages/InfoReasoner/fig/case_study.png`（可选）

如需改目录名或改为 `assets/`，请同时批量更新 HTML 路径，避免混用。

---

## 9. 已确认的页面规范（本轮沉淀）

以下规范已在 `InfoReasoner` 页面实践并确认：

1. **图不加框**  
   图像不使用卡片背景/边框/圆角，直接展示论文图。

2. **图要有详细解释**  
   每张图至少给出：图意、关键元素说明、读图结论、与正文关系。

3. **公式从简**  
   页面仅保留最关键的公式，其余改为可读性更高的文字说明。

4. **免责声明放最后**  
   Disclaimer 固定放在页面末尾（通常在 BibTeX 后），不放在页首。

5. **作者信息详细化**  
   作者使用单位上标，单位映射与通讯作者信息完整展示。

6. **细节以原文为准**  
   页面作为导读，不替代论文原文；定义、推导、实验细节、结论以论文为准。
