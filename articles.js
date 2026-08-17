window.CASSIE_ARTICLES = [
  {
    id: "capture",
    cat: "build",
    title: ["为什么我做 Cassie Capture", "Why I built Cassie Capture"],
    meta: ["BUILD LOG · 已扩写", "BUILD LOG · EXPANDED"],
    deck: ["长文档不应该消失在滚动条里。", "Long documents should not vanish inside a scrollbar."],
    body: [[
      "我经常需要保存很长的网页文档。课程笔记、飞书文档、Google Docs，三四百页的那种。普通截图工具在几十页以内都很好，一旦超过一百页，要么浏览器崩掉，要么最后导出的 PDF 有一半是空白。",
      "我一开始以为这只是一个截图问题。后来才发现，真正的问题是内存：如果把三百页未压缩图像一直留在浏览器里，二三 GB 很快就没有了。于是 Cassie Capture 有了一个很简单、也很固执的原则——一帧都不留在内存里。",
      "每一帧都有一段很短的生命。页面滚动，Service Worker 请求截图，Offscreen Document 立刻把图片写进 IndexedDB，再回一个 ACK。只有确认这一帧已经落盘，系统才继续下一帧。任何时刻，后台拿着的都只是一张图。",
      "真正麻烦的反而不是截图按钮。Google Docs 和飞书并不一定滚动 window，它们有自己的内部容器。我给候选容器算分：可滚动距离乘上可见面积。最大的那个通常才是正文，旁边的聊天框和工具栏会自然输掉。",
      "最后一屏也会骗人。浏览器会自动限制滚动位置，所以它常常和前一屏重叠一小截。我把内容边界单独记下来，用一个纯函数计算应该裁掉多少；它很不起眼，但有单元测试，因为这种地方一旦错了，三百页之后才发现会很痛苦。",
      "PDF 也不能一次吃下所有图片。Cassie Capture 每一百页生成一个分卷：读一帧、裁一帧、加入当前 PDF、释放引用。满一百页就下载并删除已经使用的帧，再开始下一卷。最后得到的是 part-01-of-05，而不是一个把浏览器拖死的巨大 Canvas。",
      "Manifest V3 会随时终止 Service Worker，Chrome 又限制截图频率。这些限制最初都很烦，但它们逼着我把协调、存储和生成拆开。Content Script 管页面，Service Worker 管节奏，Offscreen Document 管重活。",
      "我以前很容易把约束理解成‘这里做不了’。做完这个项目后，我更愿意把它当成架构的起点。长文档不是因为太长就应该消失在滚动条里；系统只是需要学会，一次认真接住一页。",
      "Cassie Capture 目前已经准备好 v1.2 上架包、商店文案和截图，还在等待真正提交与审核。它不是一个什么都能截的工具，只认真做一件事：把超长网页文档变成可以保存、可以翻阅的 PDF。"
    ], [
      "I often need to save very long web documents: course notes, Feishu docs, and Google Docs that run to three or four hundred pages. Most capture tools work well for a few dozen pages. Past a hundred, the browser may crash or the exported PDF comes out half blank.",
      "I first treated it as a screenshot problem. The real problem was memory. Keeping hundreds of uncompressed frames alive can consume several gigabytes, so Cassie Capture adopted one stubborn rule: never keep the whole page in memory.",
      "Each frame has a short life. The page scrolls, the service worker requests a capture, and the offscreen document immediately persists it to IndexedDB and returns an ACK. Only then does the next frame begin. The background process holds one image, not hundreds.",
      "The capture button was not the hardest part. Google Docs and Feishu often scroll inside their own containers. I score candidates by scrollable distance times visible area; the document tends to win while chat panels and toolbars fall away.",
      "The last viewport is deceptive too. Browsers clamp the final scroll position, creating overlap with the previous frame. A small pure function tracks content boundaries and calculates the crop. It has tests because discovering a seam after page three hundred is a terrible debugging strategy.",
      "A single canvas cannot safely hold five hundred pages, either. Cassie Capture builds one PDF part per hundred pages: read a frame, crop it, append it, release it. Once a part is full, it downloads and its source frames are deleted before the next part begins.",
      "Manifest V3 may terminate the service worker at any time, and Chrome limits capture frequency. Those constraints forced the architecture to become clearer: the content script handles the page, the service worker coordinates, and the offscreen document performs storage and PDF work.",
      "I used to hear a constraint as a reason something could not be done. This project taught me to use it as the first design input. A long document should not disappear because it is long; the system just needs to learn to hold one page carefully at a time.",
      "Cassie Capture now has a v1.2 release package, store copy, and screenshots prepared; submission and review are still ahead. It is not trying to capture everything. It does one job: turn very long web documents into PDFs people can keep and read."
    ]]
  },
  {
    id: "1day",
    cat: "build",
    title: ["我想保留的不是视频，而是一天的感觉", "I want to keep the feeling of a day, not just a video"],
    meta: ["1DAY · 创作笔记", "1DAY · MAKING NOTES"],
    deck: ["记录应该发生在生活里，而不是生活结束之后。", "Recording should happen inside life, not after it ends."],
    body: [[
      "大多数日子不会被记住。不是因为它们不好，是因为没有留下什么。",
      "我不太想拍 vlog。它需要计划、拍摄、剪辑，一打开前置摄像头，人也很容易开始表演。我真正想留下来的，常常只是两秒钟的风、五秒钟的笑声，或者十秒钟一起走回家的路。",
      "所以 1Day 没有先给你一个空白的录像按钮。它给的是一组时刻提示：Wake up、Coffee、Golden hour、Wind down。不同模板不是滤镜，而是不同的叙事顺序。Perfect Day 从日出走到月光，Soft Reset 记录一天怎么慢慢恢复。",
      "这些提示都用稳定的 moment key 保存，而不是直接存显示文字。听起来很像一个很小的工程决定，但它意味着中英文切换时，已经拍下来的生活不会因为翻译改变而坏掉。",
      "所有视频合成都在手机上完成，不需要上传。片段会在两条视频轨道之间交替，用很短的交叉淡入淡出接起来；方向会归一化，竖屏和横屏不会突然打架。模拟器不支持的 Core Animation overlay，则只在真机上启用。",
      "多人模式让我重新想了一遍‘一起记录’是什么。朋友不需要同时在线，也不需要学习一套复杂流程。房间只有一个六位码，同一个人重新录同一天，会更新确定的 CloudKit 记录，而不是制造重复。表情反应也是幂等的。",
      "单人模式不需要账户，也不需要网络。CloudKit 只是可选协作层。我很在意这件事，因为记录生活不应该先要求你把生活交给一个服务器。",
      "做 1Day 的时候，我反复问自己：什么值得被记住？后来答案没有变得更宏大，反而越来越小。咖啡的热度、窗外的光、回家路上耳机里的歌。文字有时候说不清，但两秒钟刚好。",
      "两秒够短，短到你还没来得及表演；也够长，长到几个月以后，你会突然想起那一天。1Day 目前还在 Private Beta。它不是一个更复杂的剪辑器，是一个尽量不打断生活的记忆容器。"
    ], [
      "Most days are forgotten. Not because they were bad, but because nothing stayed.",
      "I do not really want to make vlogs. They require planning, filming, and editing, and the front camera can make ordinary life feel like a performance. What I want to keep is usually smaller: two seconds of wind, five seconds of laughter, or ten seconds of walking home together.",
      "That is why 1Day does not begin with an empty record button. It offers moment prompts such as Wake up, Coffee, Golden hour, and Wind down. The templates are not filters; they are different narrative shapes. Perfect Day moves from sunrise to moonlight. Soft Reset follows a day gradually recovering.",
      "The prompts are stored as stable moment keys rather than display text. It sounds like a tiny engineering choice, but it means switching between Chinese and English never corrupts a memory that has already been recorded.",
      "All video composition happens on the phone. Clips alternate between two tracks with short crossfades, orientation is normalized, and Core Animation overlays that fail in the simulator are enabled only on real devices.",
      "Friend mode made me rethink what recording together should require. People do not need to be online at the same time or learn a complicated workflow. A room has a six-character code, and recording the same day again updates a deterministic CloudKit record instead of creating duplicates. Reactions are idempotent too.",
      "Solo mode needs no account and no network. CloudKit is only an optional collaboration layer. I care about that boundary because recording a life should not begin by asking someone to hand that life to a server.",
      "While building 1Day, I kept asking what deserves to be remembered. The answer became smaller, not grander: the warmth of coffee, the light outside a window, the song playing on the walk home. Words sometimes miss those things, but two seconds can hold them.",
      "Two seconds is short enough that I do not begin performing, and long enough to bring a day back months later. 1Day is currently in private beta. It is not a more complicated editor; it is a memory container designed not to interrupt the life it records."
    ]]
  },
  {
    id: "tabspace",
    cat: "build",
    title: ["Tabspace：把决定权留给用户", "Tabspace: keeping the final say with the user"],
    meta: ["PRODUCT NOTE · 已扩写", "PRODUCT NOTE · EXPANDED"],
    deck: ["AI 可以整理，但不能偷偷替你整理。", "AI can organize, but it should not do so secretly."],
    body: [[
      "我的浏览器长期有六十到一百个标签页。不是每一个都重要，只是关掉任何一个时，我都会想：万一等一下要用呢？",
      "很多整理工具给出的答案是自动分类、自动关闭、自动替你决定。我不太喜欢。混乱当然让人累，但一个工具如果在背后悄悄改变你的工作现场，也会制造另一种不安。",
      "Tabspace 最早只是把标签页按域名放进卡片里。你可以看到 GitHub 开了几个页面、哪些 URL 重复、哪一组可以关掉。去重、分组和关闭都是真实操作，但执行之前，变化先摆在你面前。",
      "后来我把同样的逻辑放进书签整理：搜索、重复检测、批量移动和推荐文件夹都可以做，但破坏性操作必须先预览。‘先预览，再执行’不是为了多一个确认弹窗，而是为了让用户仍然知道自己的东西去了哪里。",
      "Reader Assist 则是另一种整理。它不替你总结文章，而是把当前段落亮起来，让其他内容安静一点。你可以用键盘移动焦点、设置十五分钟计时，也可以把一句话标成重点、概念、行动或疑问。它帮助的是阅读动作，不是假装替你读完。",
      "Manifest V3 的内容安全策略不喜欢现代打包工具的默认输出。为了让 React 页面同时跑在扩展和本地预览里，我做了自定义构建改写，也把 Chrome 的回调 API 集中包装成 Promise。技术细节很多，但它们都服务于一件事：工具要在真实浏览器里稳定工作，而不是只在 demo 里好看。",
      "商店里的 0.1.0 版本完全本地运行。后来仓库加入过可选 AI 分组建议：只发送 tabId、标题、hostname 和当前分组，不发完整 URL 或页面内容，而且必须由用户主动点击。建议回来以后，也还是先看、再 Apply。",
      "这个项目并不是一条很整齐的产品路线。上架以后我做过 Focus Assistant，后来又把它拆掉；当前仓库和商店版本也不是同一个时间切片。以前我会觉得这种反复很难看，现在我更愿意把它留下来——做产品本来就包括删掉自己曾经很认真做过的东西。",
      "Tabspace 教会我的不是‘自动化越多越好’。恰恰相反：AI 可以帮忙看见模式，可以提出建议，但最后那一下，应该由用户自己按。"
    ], [
      "My browser often holds sixty to a hundred tabs. They are not all important. Closing any one of them simply triggers the same thought: what if I need it in five minutes?",
      "Many organization tools answer with automatic grouping, closing, and decision-making. I do not love that. Clutter is tiring, but a tool that silently changes a working environment creates a different kind of anxiety.",
      "Tabspace began by placing tabs into domain cards. I can see how many GitHub pages are open, which URLs repeat, and which group might be safe to close. Deduping, grouping, and closing are real actions, but the change appears before it happens.",
      "I later applied the same rule to bookmarks. Search, duplicate detection, bulk moves, and folder suggestions are useful, but destructive operations must be previewed. Preview before apply is not an extra confirmation dialog; it is how the user continues to know where their things went.",
      "Reader Assist organizes attention instead. It does not pretend to read an article for me. It highlights the current paragraph, quiets the rest of the page, supports keyboard navigation and a fifteen-minute timer, and lets me mark a line as an idea, action, question, or key point.",
      "Manifest V3 content security rules do not cooperate with the default output of modern bundlers. I built a custom output rewrite, supported both Chrome and local preview runtimes, and wrapped callback APIs in promises. The details serve one purpose: the tool must work inside a real browser, not only look convincing in a demo.",
      "The 0.1.0 store release runs locally. A later repository version added optional AI grouping suggestions that send only tab IDs, titles, hostnames, and current group IDs—not full URLs or page content—and only after an explicit user action. Returned suggestions are still reviewed before Apply.",
      "The product history is not a clean line. I built a Focus Assistant after release and later removed it; the repository and store release now represent different moments. I used to think that history looked messy. I now want to keep it visible because building products includes deleting things I once worked hard on.",
      "Tabspace did not teach me that more automation is always better. It taught me the opposite: AI can reveal patterns and make suggestions, but the final click should stay with the user."
    ]]
  },
  {
    "id": "mushroom",
    "cat": "reflection",
    "title": [
      "待机小蘑菇",
      "The Little Idle Mushroom"
    ],
    "meta": [
      "随笔 · 五集重构版",
      "ESSAY · FIVE-EPISODE EDITION"
    ],
    "deck": [
      "一颗长期待机的小蘑菇，怎样停止空转，重新开始行动。",
      "How a little mushroom stuck in idle mode learns to stop spinning and start moving."
    ],
    "body": [
      [
        "## 第一集：先按下去",
        "网申页面终于走到最后一步。",
        "<strong>Step 12 of 12：Upload Resume</strong>",
        "我松了一口气，点开文件夹。",
        "里面躺着一整个简历家族：",
        "<em>Resume_final.pdf</em><br><em>Resume_final_final.pdf</em><br><em>Resume_USE_THIS.pdf</em><br><em>Resume_USE_THIS_REALLY.pdf</em><br><em>Resume_不要用这个.pdf</em><br><em>Resume_真的最终版.pdf</em>",
        "我的手停在鼠标上。",
        "脑内控制室红灯爆闪。",
        "小工头一把拉响警报：“版本管理事故！”",
        "小C抱着一摞尴尬录像带滚进战壕：“传错以后，HR 会不会永远记得我们？”",
        "小E已经打开了一个空白文档：“我建议现在重写一版。做一个有灵魂的简历，点开还会长蘑菇。”",
        "“现在不是长蘑菇的时候！”",
        "我打开一个版本，放大，关掉。又打开一个，搜索 typo，再关掉。",
        "就在这时，页面右上角弹出一行字：",
        "<strong>Session expires in 30 seconds.</strong>",
        "控制室里三个人同时尖叫。",
        "“选最新的！”",
        "“最新的不一定最好！”",
        "“要不趁最后三十秒重新规划人生？”",
        "倒计时往下跳。",
        "<strong>10。9。8。</strong>",
        "我越紧张越想打哈欠。终于，一个巨大的哈欠把意识从现实里拽了出去——下一秒，我从控制室天花板上掉下来，一屁股坐在三个人中间。",
        "全场安静。",
        "小工头第一个站直：“老板！我们正在抢救您的职业生涯！”",
        "他递给我一本皱巴巴的手册。封面是我的笔迹：",
        "> <strong>《绝对不能搞砸的人生应急预案》</strong>",
        "我翻开第一页，只写了一条：",
        "> 不能出错。出错会引发连锁坍塌。",
        "“所以，”我抬头看着他们，“你们每天这么忙，是因为把每一个错误都当成拆迁？”",
        "小C小声说：“我们只是想让你安全一点。”",
        "我拿起笔，把那句话划掉。",
        "> <strong>做错了，不算塌房，算待修。</strong>",
        "“传错简历怎么办？”小工头问。",
        "“重新投，补邮件，下次改好文件名。”",
        "“尴尬怎么办？”小C问。",
        "“先尴尬。尴尬完继续。”",
        "“奶茶怎么办？”小E问。",
        "“先闭麦。”",
        "现实里的倒计时还剩三秒。",
        "我选中 <em>Resume_USE_THIS_REALLY.pdf</em>，上传，点击 <strong>Submit</strong>。",
        "页面转了一圈。",
        "<strong>Application submitted.</strong>",
        "控制室没有烟花。小工头摘下安全帽，小C从指缝里往外看。",
        "“系统没崩。”小工头说。",
        "“我们也没死。”小C说。",
        "小E立刻举手：“那现在可以喝奶茶了吗？”",
        "我站起来，走进厨房，接了一杯温水。",
        "“先喝水。”",
        "小E震惊：“这是什么冷酷的世界。”",
        "## 第二集：麻辣香锅公司侥幸存活",
        "上周，我看了一个美食综艺，叫《一饭封神》。",
        "看着看着，我的脑子就自己开了一家公司。",
        "一开始，好像是一家毛血旺公司。",
        "过了一会儿，又变成了麻辣香锅公司。为什么突然更换主营业务，没有人知道。总之，这家公司经营得很艰难，眼看就快撑不下去了。",
        "就在这个时候——",
        "牛奶降价了。",
        "于是，我的麻辣香锅公司侥幸存活。",
        "梦进行到这里，我突然清醒了一下。",
        "等等。",
        "牛奶降价，和麻辣香锅公司活下来，到底有什么关系？",
        "我停下来，认真回看了整段剧情。",
        "毛血旺。麻辣香锅。公司。牛奶降价。侥幸存活。",
        "这他妈到底是个什么故事？",
        "控制室里，小工头已经把紧急调查报告投到了大屏上：",
        "> <strong>事故名称：麻辣香锅公司异常存活事件</strong><br><strong>主营业务：不明确</strong><br><strong>盈利模式：不明确</strong><br><strong>牛奶价格与公司存亡的关系：完全不明确</strong>",
        "小C抱着脑部档案，脸色苍白：“我们的脑子是不是有点大病？”",
        "小E很不服气：“也可能这家公司同时卖奶茶。”",
        "“没有这个设定。”小工头说。",
        "“现在有了。”",
        "“不允许事后补设定！”",
        "三个人围着那份报告吵了起来，试图从一段根本没有逻辑的梦里，找出一条完整的商业链路。",
        "我看了一会儿，决定放弃调查。",
        "有些念头可能真的没有什么意义。只是刚刚看进去的东西，被脑子随手倒进一口锅里，炒了炒，就端上来了。",
        "闻着挺香。",
        "逻辑没熟。",
        "小工头仍然无法接受：“那这家公司现在怎么办？”",
        "“先让它活着吧。”",
        "“靠什么活？”",
        "“牛奶不是降价了吗？”",
        "## 第三集：地图只画了一条路",
        "控制室的墙上，一直挂着一张很大的地图。",
        "地图上只有一条红色路线：",
        "> <strong>找到工作 → 人生恢复正常</strong>",
        "那条路被描得很粗，几乎占满整张纸。小工头每天站在下面调度，小C负责标记沿途所有可能失败的地方，小E偶尔试图往旁边画一条岔路，都会被小工头立刻擦掉。",
        "“这条跟当前目标无关。”他说。",
        "我盯着这张地图太久了。",
        "久到后来，我真的以为，世界上只有这一条路。只要还没走通，其他事情就都不应该开始；只要还没得到它，我的人生就还停在原地。",
        "回国以后，生活里忽然冒出了很多和这张地图无关的事情。",
        "我去了韩国，决定做之前纠结了很久的全飞秒。两个小时内，检查、复查、手术全部做完。院长长得很像梁朝伟，我还用破碎的韩语夸他帅。",
        "我在那里认识了几个很聊得来的中国小姐姐。手术后，三个人坐在一起吃饭：两个戴着墨镜，睁不开眼，另一个脸上还敷着麻药，刚好能拼出一张完整的脸。",
        "控制室里，小工头看着行程记录，很困惑：“这件事对求职有什么帮助？”",
        "“没有。”我说。",
        "“那为什么要做？”",
        "“因为我想做。”",
        "他说不出话了。",
        "我开始发现，自己能做的事情比原来以为的多。它们不需要先证明对某个目标有帮助，也不需要排在“人生恢复正常”之后。",
        "我回到控制室，把墙上那张地图摘了下来。",
        "翻到背面，才看见角落里印着一行很小的字：",
        "> <strong>紧急疏散示意图</strong>",
        "原来它从来都不是世界地图。",
        "它只是在我很害怕的时候，为我画出了一个最近的出口。控制室拿着它用了太久，最后连自己也忘了，出口外面还有路，墙的另一边也还有房间。",
        "我重新摊开一张纸。",
        "找工作仍然在上面，但不再占满整页。周围暂时还是空白，我也不知道以后会画出什么。",
        "小工头拿着笔问：“那哪一条才是正确答案？”",
        "“没有固定答案。”",
        "“那我们必须想要什么？”",
        "我想了想。",
        "“没有什么是必须想要的。”",
        "我可以认真走一条路，也可以发现不喜欢以后再转弯。地图不是命令，它只是让我看见：这里有路。",
        "至于走哪一条——",
        "尽量选我真的想走的。",
        "## 第四集：不等心情开机",
        "最近，我认识了一些无时无刻不在工作的人。",
        "最让我意外的，不是他们能工作多久，而是他们好像并不需要先举行一场仪式。",
        "事情来了，就处理。做完一件，再做下一件。",
        "工作就是工作。",
        "控制室却不是这样。",
        "每天早上，小工头都抱着一张表守在门口：",
        "> <strong>工作状态准入检测</strong>",
        "“昨晚睡够了吗？”",
        "“没有。”",
        "“心情稳定吗？”",
        "“也没有。”",
        "“对今天的任务有热情吗？”",
        "我想了想：“现在只对重新躺下有热情。”",
        "小工头沉重地盖下红章：<strong>未通过。</strong>",
        "于是大家决定，先把心情调整好，再开始工作。",
        "小C搬出情绪档案，准备调查我为什么抗拒。小E打开十几个页面，搜索“如何在三分钟内恢复能量”。小工头坐下来，开始制定《进入工作状态前的准备工作清单》。",
        "他们忙得不可开交。",
        "只有工作没有开始。",
        "我原来总觉得，要先不焦虑、不内耗、想明白，最好还能产生一点期待，才可以开始做事。",
        "可心情很像一台永远差百分之三才更新完成的电脑。你盯着它，它就一直转圈。",
        "“最佳状态什么时候到？”我问。",
        "小工头翻了翻表格：“没有预计到达时间。”",
        "“那把门拆了。”",
        "“可是状态检测——”",
        "“状态可以检测，不能拿来当门禁。”",
        "我拿过他的表格，在最下面加了一行：",
        "> <strong>心情未就绪，不影响文件打开。</strong>",
        "然后我坐下来，打开要做的事。",
        "焦虑没有消失，动力也没有突然出现。小C照常抱着档案坐在二号位，小E还在旁边研究那套晨间仪式。",
        "但屏幕上的光标开始往前走。",
        "我好像到最近才重新意识到，工作很重要。很多能力不是等我准备好以后才长出来的，是一遍遍做的时候长出来的。",
        "累了就休息，方向错了就调整。但休息就是休息，调整就是调整，不再把它们变成一道永远过不完的前置流程。",
        "与其花很久说服自己心甘情愿地工作，不如就工作。",
        "就是工作。",
        "小工头重新画了一张流程图。",
        "原来的版本是：",
        "> 调整心情 → 找到动力 → 进入最佳状态 → 开始工作",
        "他把整张图划掉，只留下两个格子：",
        "> 打开 → 做",
        "小E很不满意：“这也太不浪漫了。”",
        "“可以再加一个格子。”我说。",
        "她眼睛一亮：“做完奖励奶茶？”",
        "“做完检查下一步。”",
        "小E把笔放下：“比不浪漫还不浪漫。”",
        "第二天早上，我还是有点困，也没有突然热爱上所有任务。",
        "小工头摸了摸口袋里的准入表格，又把它放了回去。",
        "我坐下来，打开文件。",
        "小C问：“今天不开状态审核会吗？”",
        "“不开。”",
        "“那我们什么时候开始？”",
        "我的手已经放在键盘上。",
        "“已经开始了。”",
        "## 第五集：把脑子放回身体里",
        "最近，我开始看一些和礼仪有关的书。",
        "也是在这个时候，我想起那天去寺里，自己很难把注意力留在手上的感觉。",
        "手明明在这里，脑子却一会儿想这件事，一会儿跳到另一件事。身体已经开始做了，思想还在外面四处乱跑。",
        "控制室里，情况更加严重。",
        "小E同时放飞了二十几个念头。有的飞向昨天，有的飞向明天，还有几个没有明确目的地，只是在天花板附近高速盘旋。",
        "小工头追着它们逐个登记。",
        "小C抱着档案问：“刚才那件事是不是还没有想完？”",
        "大屏正中央，手部操作画面已经卡住很久。",
        "“停。”我说。",
        "三个人一起看向我。",
        "“先把脑子放回手上。”",
        "我开始想，专注也许不只是要求自己“不要乱想”。这个指令太空了，脑子听完以后，还是不知道应该去哪里。",
        "它需要一个可以落下来的地方。",
        "如果我正在落笔，就看着自己的手：下一笔落在哪里，怎样把它落稳。",
        "如果我正在坐着，就把坐姿坐好。",
        "如果我正在站着，就把站姿站好。",
        "不再任由一个想法把下一个想法拖出来。先给身体一个明确的任务，让思想回来和它做同一件事。",
        "小E指着天上那些还在飞的念头：“那它们怎么办？”",
        "“能变成行动的，就告诉我现在可以做什么。”",
        "“暂时不能的呢？”",
        "“排队。不要占着整个屏幕。”",
        "小工头立刻搬来一只箱子，上面写着：",
        "> <strong>以后再想，不等于现在要想</strong>",
        "我不需要把脑子彻底清空。它可以有声音，也可以冒出一些奇怪的东西——毕竟它连靠牛奶降价存活的麻辣香锅公司都想得出来。",
        "但如果我想把一件事做好，脑子就不能永远只负责发散，身体也不能永远等在那里。",
        "思想要落到动作上。",
        "坐，就坐好。",
        "站，就站好。",
        "下一次落笔的时候，我想先试着只做一件事：看着自己的手，把这一笔稳稳地落下去。",
        "控制室的大屏上，二十几个窗口慢慢退到后台。",
        "手部画面重新回到正中央。",
        "这一次，脑子和手在同一个地方。"
      ],
      [
        "## Episode One: Just Click It",
        "The application finally reached its last step.",
        "<strong>Step 12 of 12: Upload Resume</strong>",
        "I exhaled and opened the folder.",
        "An entire résumé family was waiting inside:",
        "<em>Resume_final.pdf</em><br><em>Resume_final_final.pdf</em><br><em>Resume_USE_THIS.pdf</em><br><em>Resume_USE_THIS_REALLY.pdf</em><br><em>Resume_DO_NOT_USE.pdf</em><br><em>Resume_ACTUAL_FINAL.pdf</em>",
        "My hand froze over the mouse.",
        "Red lights erupted in the control room inside my head.",
        "The foreman yanked the alarm. “Version-control incident!”",
        "Little C rolled into a trench clutching a stack of embarrassing old tapes. “If we upload the wrong one, will HR remember us forever?”",
        "Little E had already opened a blank document. “I suggest we rewrite it now. Something with soul. Maybe mushrooms grow when you open it.”",
        "“This is not the time to grow mushrooms!”",
        "I opened one version, zoomed in, and closed it. I opened another, searched for typos, and closed that too.",
        "Then a line appeared in the top-right corner:",
        "<strong>Session expires in 30 seconds.</strong>",
        "All three people in the control room screamed.",
        "“Choose the newest one!”",
        "“Newest does not mean best!”",
        "“Should we use the last thirty seconds to redesign our entire life?”",
        "The countdown continued.",
        "<strong>10. 9. 8.</strong>",
        "The more nervous I get, the more I yawn. One enormous yawn finally pulled my consciousness out of reality. A second later, I fell through the control-room ceiling and landed between the three of them.",
        "Silence.",
        "The foreman snapped to attention. “Boss! We are actively rescuing your career!”",
        "He handed me a crumpled manual. The title was in my handwriting:",
        "> <strong>The Emergency Plan for a Life That Absolutely Must Not Go Wrong</strong>",
        "I opened to the first page. It contained one rule:",
        "> No mistakes. One mistake will trigger a total collapse.",
        "“So,” I said, looking at them, “you stay this busy because every mistake becomes a demolition order?”",
        "Little C lowered his voice. “We only wanted to keep you safe.”",
        "I picked up a pen and crossed out the rule.",
        "> <strong>A mistake is not a collapse. It is a repair ticket.</strong>",
        "“What if we send the wrong résumé?” the foreman asked.",
        "“Apply again. Send a correction. Name the file properly next time.”",
        "“What about the embarrassment?” Little C asked.",
        "“Be embarrassed. Then keep going.”",
        "“What about milk tea?” Little E asked.",
        "“Mute yourself for a moment.”",
        "The real countdown had three seconds left.",
        "I selected <em>Resume_USE_THIS_REALLY.pdf</em>, uploaded it, and clicked <strong>Submit</strong>.",
        "The page spun once.",
        "<strong>Application submitted.</strong>",
        "There were no fireworks in the control room. The foreman took off his hard hat. Little C peeked through his fingers.",
        "“The system did not crash,” the foreman said.",
        "“We did not die either,” Little C said.",
        "Little E raised a hand immediately. “Can we have milk tea now?”",
        "I stood up, walked into the kitchen, and poured a cup of warm water.",
        "“Water first.”",
        "Little E stared at me. “What kind of cruel world is this?”",
        "## Episode Two: The Mala Xiang Guo Company Survives Somehow",
        "Last week, I watched a food competition show called <em>Yi Fan Feng Shen</em>.",
        "Somewhere along the way, my brain started a company by itself.",
        "At first, it seemed to be a maoxuewang company.",
        "Then it became a mala xiang guo company. No one knows why the business suddenly changed its main product. In any case, the company was struggling and about to go under.",
        "At that exact moment—",
        "milk prices fell.",
        "And so my mala xiang guo company survived by sheer luck.",
        "Halfway through this dream, I suddenly became lucid.",
        "Wait.",
        "What did cheaper milk have to do with the survival of a mala xiang guo company?",
        "I stopped and reviewed the plot carefully.",
        "Maoxuewang. Mala xiang guo. A company. Cheaper milk. Miraculous survival.",
        "What the hell kind of story was this?",
        "In the control room, the foreman had already projected an emergency investigation report onto the main screen:",
        "> <strong>Incident: Unexplained Survival of the Mala Xiang Guo Company</strong><br><strong>Core business: Unknown</strong><br><strong>Revenue model: Unknown</strong><br><strong>Connection between milk prices and corporate survival: Entirely unknown</strong>",
        "Little C held the brain archive with a pale face. “Is there something seriously wrong with our brain?”",
        "Little E objected. “Maybe the company also sells milk tea.”",
        "“That was not part of the story,” the foreman said.",
        "“It is now.”",
        "“No retroactive world-building!”",
        "The three of them crowded around the report, trying to recover a complete business model from a dream with no logic at all.",
        "I watched for a while, then abandoned the investigation.",
        "Some thoughts may genuinely mean nothing. The brain takes whatever just went in, dumps it into a wok, gives it a few tosses, and serves it.",
        "Smells great.",
        "Logic undercooked.",
        "The foreman still could not accept this. “What happens to the company now?”",
        "“Let it live for a while.”",
        "“On what?”",
        "“Milk is cheaper now, isn't it?”",
        "## Episode Three: The Map With Only One Road",
        "A large map had always hung on the control-room wall.",
        "It showed one red route:",
        "> <strong>Get a job → Life returns to normal</strong>",
        "The line was drawn so thick that it filled almost the entire page. The foreman scheduled everything beneath it. Little C marked every place where the route might fail. Whenever Little E tried to draw a side road, the foreman erased it at once.",
        "“Not relevant to the current objective,” he said.",
        "I stared at that map for too long.",
        "Eventually, I really believed the world contained only that road. Until I finished it, nothing else should begin. Until I got the answer, my life had not moved.",
        "After I returned to China, life began producing things that had nothing to do with the map.",
        "I went to Korea and finally chose the SMILE Pro procedure I had debated for a long time. The examination, follow-up, and surgery were finished within two hours. The director looked like Tony Leung, and I used my broken Korean to tell him he was handsome.",
        "I met a few Chinese women there, and we got along immediately. After surgery, three of us ate together: two wearing sunglasses because they could not open their eyes, and one with anesthetic still on her face. Together, we could just about assemble one complete face.",
        "The foreman studied the itinerary in confusion. “How does this help the job search?”",
        "“It doesn't,” I said.",
        "“Then why do it?”",
        "“Because I wanted to.”",
        "He had no reply.",
        "I began to notice that I could do more than I had imagined. Those things did not have to prove their usefulness to one goal, and they did not have to wait until after “life returns to normal.”",
        "I went back to the control room and took the map off the wall.",
        "On the back, in tiny print, I found a label:",
        "> <strong>Emergency evacuation diagram</strong>",
        "It had never been a map of the world.",
        "It had only shown me the nearest exit when I was scared. The control room used it for so long that everyone forgot there were roads outside the exit and more rooms beyond the wall.",
        "I spread out a new sheet of paper.",
        "The job search was still on it, but it no longer filled the page. The space around it remained blank. I did not yet know what would be drawn there.",
        "The foreman held up his pen. “Which road is the correct answer?”",
        "“There is no fixed answer.”",
        "“Then what are we required to want?”",
        "I thought for a moment.",
        "“Nothing is automatically required.”",
        "I can take one road seriously and still turn when I discover I do not like it. A map is not an order. It only shows me that roads exist.",
        "As for which one to take—",
        "I will try to choose the one I actually want.",
        "## Episode Four: Do Not Wait for the Mood to Boot",
        "Recently, I met a few people who seem to be working all the time.",
        "What surprised me was not how long they worked. It was that they did not seem to need a ceremony before starting.",
        "Something arrives; they handle it. They finish one thing and begin the next.",
        "Work is work.",
        "The control room worked differently.",
        "Every morning, the foreman guarded the door with a form:",
        "> <strong>Work Readiness Admission Test</strong>",
        "“Did you sleep enough?”",
        "“No.”",
        "“Is your mood stable?”",
        "“Also no.”",
        "“Do you feel enthusiastic about today's tasks?”",
        "I thought about it. “Right now, I am only enthusiastic about lying down again.”",
        "The foreman stamped the form: <strong>FAILED.</strong>",
        "So everyone decided to fix my mood before work could begin.",
        "Little C brought out the emotion archives to investigate my resistance. Little E opened a dozen pages and searched “how to restore energy in three minutes.” The foreman sat down to draft a Pre-Work Preparation Checklist.",
        "They were extremely busy.",
        "Only the work had not started.",
        "I used to believe I had to stop worrying, stop spiraling, understand everything, and preferably feel a little hope before I could begin.",
        "But mood is like a computer update forever stuck at ninety-seven percent. If you keep watching, it keeps spinning.",
        "“When does the ideal state arrive?” I asked.",
        "The foreman checked his form. “No estimated arrival time.”",
        "“Then take down the door.”",
        "“But the readiness test—”",
        "“State can be observed. It cannot become an access gate.”",
        "I took the form and added one line at the bottom:",
        "> <strong>Mood not ready. File may still open.</strong>",
        "Then I sat down and opened the work in front of me.",
        "The anxiety did not disappear. Motivation did not suddenly arrive. Little C sat in seat two with the archives. Little E continued researching that morning ritual.",
        "But the cursor began to move.",
        "Only recently did I remember that work matters. Many abilities do not appear after I become ready. They grow through doing the thing again and again.",
        "If I am tired, I rest. If the direction is wrong, I adjust it. But rest is rest, and adjustment is adjustment. They do not need to become an entrance ritual with no end.",
        "Instead of spending hours persuading myself to want the work, I can work.",
        "Just work.",
        "The foreman drew a new flowchart.",
        "The old one said:",
        "> Fix mood → Find motivation → Reach ideal state → Begin work",
        "He crossed out the whole diagram and left two boxes:",
        "> Open → Do",
        "Little E frowned. “That is extremely unromantic.”",
        "“We can add one more box,” I said.",
        "Her eyes lit up. “Finish, then milk tea?”",
        "“Finish, then check the next step.”",
        "Little E put down the pen. “That is worse than unromantic.”",
        "The next morning, I was still sleepy. I had not fallen in love with every task overnight.",
        "The foreman touched the admission form in his pocket, then left it there.",
        "I sat down and opened the file.",
        "Little C asked, “No readiness review today?”",
        "“No.”",
        "“Then when do we start?”",
        "My hands were already on the keyboard.",
        "“We already did.”",
        "## Episode Five: Put the Mind Back in the Body",
        "Recently, I started reading books about etiquette.",
        "Around the same time, I remembered how hard it had been at the temple to keep my attention on my own hands.",
        "My hands were here, but my mind jumped from one subject to another. The body had begun the task. Thought was still running around somewhere else.",
        "Inside the control room, the situation was worse.",
        "Little E released more than twenty thoughts at once. Some flew toward yesterday, some toward tomorrow, and several had no destination at all. They simply circled the ceiling at high speed.",
        "The foreman chased them and tried to register each one.",
        "Little C held up the archives. “Did we ever finish thinking about that earlier thing?”",
        "In the center of the main screen, the camera feed from my hands had been frozen for a long time.",
        "“Stop,” I said.",
        "All three looked at me.",
        "“Put the mind back in the hands.”",
        "I began to think that focus might require more than telling myself not to wander. That instruction is too empty. The brain hears it and still has no idea where to go.",
        "It needs somewhere to land.",
        "If I am making a mark, I can watch my hand: where should the next stroke go, and how can I place it steadily?",
        "If I am sitting, I can sit well.",
        "If I am standing, I can stand well.",
        "Instead of letting one thought drag out the next, I can give the body one clear task and ask the mind to return and do the same thing.",
        "Little E pointed at the thoughts still flying overhead. “What happens to those?”",
        "“If one can become an action, tell me what I can do now.”",
        "“And if it cannot?”",
        "“It queues. It does not get the whole screen.”",
        "The foreman immediately carried in a box labeled:",
        "> <strong>Think about it later does not mean think about it now</strong>",
        "I do not need to empty my head completely. It can make noise and produce strange things. This is, after all, the brain that kept a mala xiang guo company alive by lowering the price of milk.",
        "But if I want to do something well, the mind cannot spend forever generating possibilities while the body waits.",
        "Thought has to land in action.",
        "Sit, and sit well.",
        "Stand, and stand well.",
        "The next time I make a mark, I want to try one thing first: watch my hand and place that stroke steadily.",
        "On the control-room screen, more than twenty windows slowly moved into the background.",
        "The camera feed from my hands returned to the center.",
        "This time, my mind and my hands were in the same place."
      ]
    ]
  },
  {
    id: "route",
    cat: "life",
    title: ["从哈密到 San Jose：一路把自己重新搭起来", "From Hami to San Jose: rebuilding myself along the way"],
    meta: ["LIFE ARCHIVE · 已扩写", "LIFE ARCHIVE · EXPANDED"],
    deck: ["我不是一路规划着来到这里的，只是每到一个阶段，都决定再往前走一点。", "I did not plan the whole route here. At each stage, I chose to move a little farther."],
    body: [[
      "我不是一路规划着来到这里的。如果十八岁的时候有人把哈密、上海、杭州和 San Jose 连成一条线给我看，我大概也不会相信。很多决定当时没有一个很漂亮的解释，只是觉得：要不再往前走一点。",
      "我在哈密长大。风很大，天很蓝，日子也慢。小时候我会在网上学修手机、折纸，也给陌生人做动态签名。那时候当然没有人把这些叫作‘产品意识’或者‘工程兴趣’，我只是天然觉得东西可以拆开，也可以重新做一遍。",
      "十八岁以后去了上海，在上财读国际会计，后来进德勤生命科学与医疗组。会计没有成为我的终点，但审计留下了很顽固的习惯：这个数从哪里来？为什么应该相信它？材料再乱，也要找到一条能复核的证据链。",
      "我写第一行 Python 的动机也没有多高尚，只是想少加一点班。后来自动化总账映射、异常检测，再后来做出一个别的团队也愿意继续用的工具。不是先决定转行再开始写代码，而是先解决了一个眼前的问题，门才开了一点。",
      "杭州是履历里最难用一句话讲清楚的部分。我注册公司、开过店、参加创业比赛，也把一些想法做成真的能打开的产品。那段时间并不稳定，我也没有突然想明白人生，只是把能推的门都推了一遍。",
      "我原来以为自己在不断换方向。后来才发现，行业确实在换，但我总会绕回同一批问题：人为什么会卡住？工具能不能让一个复杂动作变得更清楚？我真正喜欢的，是把问题拆开，再做出一个可以被使用的东西。",
      "2025 年到了 San Jose。在 Smith-Kettlewell 的 YouDescribe 项目里，我参与了 30 人研究；新的工作流把人工撰写时间缩短了 64%。这段经历第一次让我看见，技术不是简历上的新标签，它真的可以改变一个人完成任务的方式。",
      "现在我在 Northeastern 读人工智能硕士，补以前没有系统学过的计算机基础，也继续做自己的 app。来这里不是为了把会计和审计重新包装成技术故事，而是承认基础不够，然后从底下重新学一遍。",
      "这四个地方不是履历上的四个点。哈密给了我拆开看看的习惯，上海给了我商业和证据，杭州让我开始造东西，San Jose 让我重新打地基。我说不清下一站在哪里，但现在我不再要求整条路先有答案。环境对了，人会长出原来想不到的部分。"
    ], [
      "I did not plan the route that brought me here. If someone had connected Hami, Shanghai, Hangzhou, and San Jose on a map when I was eighteen, I probably would not have believed it. Many choices had no elegant explanation at the time. I simply wondered if I should move a little farther.",
      "I grew up in Hami, where the wind is strong, the sky is blue, and days move slowly. I learned phone repair and origami online and made animated forum signatures for strangers. No one called that product instinct or engineering interest. I just believed things could be opened and made again.",
      "At eighteen I moved to Shanghai to study international accounting at SUFE, then joined Deloitte's Life Sciences and Health Care practice. Accounting was not the destination, but audit left a stubborn habit: where did this number come from, and why should anyone trust it? Messy material still needs a traceable evidence chain.",
      "My reason for writing the first line of Python was not noble. I wanted less overtime. General-ledger mapping led to anomaly checks, and eventually to a tool another team wanted to keep using. I did not decide on a career change and then begin coding. I solved an immediate problem, and a door opened slightly.",
      "Hangzhou is the hardest chapter to summarize on a résumé. I registered a company, opened a store, entered startup competitions, and turned a few ideas into products that could actually be opened. It was not stable, and I did not suddenly understand my life. I simply pushed every door I could find.",
      "I used to think I kept changing direction. Later I noticed that the industries changed while the questions did not. Why do people get stuck? Can a tool make a complicated action clearer? What I enjoy is taking a problem apart and building something another person can use.",
      "In 2025 I arrived in San Jose and worked on YouDescribe at Smith-Kettlewell. I participated in a thirty-person study, and the new workflow reduced manual writing time by 64 percent. It was the first time I saw technology not as a new label for my résumé, but as a real change in how someone completes a task.",
      "I now study artificial intelligence at Northeastern, rebuilding computer science foundations I had never learned systematically while continuing to deepen my own apps. I did not come here to repackage accounting and audit as a technology story. I came to admit what I did not know and learn it from the bottom.",
      "These places are not four résumé points. Hami gave me the habit of opening things up. Shanghai gave me business and evidence. Hangzhou made me start building. San Jose made me rebuild the foundation. I do not know the next stop yet, but I no longer need the entire road to explain itself in advance."
    ]]
  },
  {
    "id": "principles",
    "cat": "reflection",
    "title": [
      "我的原则",
      "The principles I actually use"
    ],
    "meta": [
      "公开版 · 2026",
      "PUBLIC EDITION · 2026"
    ],
    "deck": [
      "原则如果不能改变下一步行动，就只是一句话。",
      "A principle that cannot change the next action is only a sentence."
    ],
    "body": [
      [
        "我不把这些原则当成真理。它们是我在做选择、卡住、开始新项目或复盘失败时调用的规则。原则如果不能改变下一步行动，就只是一句话。",
        "## 使用顺序",
        "> 先守住身体、注意力、诚实、口碑和时间主权；再看方向是否让我更有能力、更自由、更能创造，也更平静；最后才选择速度、坚持、合作和项目数量这些手段。",
        "## 1. 先保护那个还要继续生活和判断的自己",
        "健康、睡眠、注意力和判断能力不是完成目标时可以随意消耗的成本。任务超过产能时，先排序，再删除低价值工作；低能量时，分清自己需要休息，还是在逃避一个具体动作。",
        "## 2. 用兴趣选择方向，用逻辑优化路径",
        "逻辑可以证明一件事可行，不能替我决定是否想长期做它。我会先真实试做，观察自己是否愿意承受具体、重复和无聊的部分，再规划怎样走。",
        "## 3. 先接触现实，再完善叙事",
        "报告、课程和逻辑模型可以帮助理解问题，不能替代真实的人和真实反馈。尽快做一次真实试验，优先验证整条推理里最承重的假设。",
        "## 4. 任何重要判断都要回答「凭什么相信」",
        "给结论附上来源与口径、关键假设、反例和下一次验证。无法证明的内容标成假设、回忆、估算或待核，不把它包装成事实。",
        "## 5. 先判断门能不能退，再决定要想多久",
        "可逆、损失可控、反馈快的双向门，信息够用就行动；健康、法律、移民、长期债务和不可逆声誉风险这样的单向门，要放慢速度、寻找一手信息，并提前写下止损条件。",
        "## 6. 把害怕拆成一个会留下证据的动作",
        "把问题缩成短周期内可以验证的里程碑，再拆成今天能完成的最小产物。一段代码、一页文字、一次访谈、一个原型或一次提交，都比“想了很多”更接近现实。",
        "## 7. 先完成、交付和维护，再奖励开新项目",
        "开始带来的兴奋不等于进展。新项目开始前，要说明它替代、合并或结束什么；每次探索最终进入完成、合并、停止或归档中的一种状态。",
        "## 8. 把人、环境和外部结构当成基础设施",
        "需要合作、反馈和约束不是意志力不足。给重要目标绑定一个人、一个时间和一个交付物；少做没有后续的 networking，多做能够共同完成的事。",
        "## 9. 责任在我，帮助要尽早、具体地去要",
        "对结果负责，不等于每一步都独自完成。说清楚已经试过什么、卡在哪里、希望对方具体帮助什么；建议是输入，不是授权。",
        "## 10. 只批评行为和系统，不审判身份",
        "先写事实：原本预期什么，实际发生什么。判断差异来自信息、执行、环境还是运气，每次只修改一个条件或动作，不把计划失败升级成身份失败。",
        "## 原则也需要更新",
        "一次顿悟只能算假设。在不同情境里重复有效以后，才能升级成稳定原则。我想建立的不是一个永远强大、永远自驱的人格，而是一套在低能量、害怕、笨拙和被拒绝时，仍然能够继续运转的系统。"
      ],
      [
        "I do not treat these principles as truths. They are rules I call when I am choosing, stuck, starting something, or reviewing a failure. A principle that cannot change the next action is only a sentence.",
        "## Order of use",
        "> Protect health, attention, honesty, reputation, and ownership of time first. Then ask whether a direction makes me more capable, free, creative, and calm. Speed, persistence, collaboration, money, and project count are tools that come last.",
        "## 1. Protect the person who still has to live and decide",
        "Sleep, health, attention, and judgment are not disposable costs. When work exceeds capacity, I rank it and remove low-value tasks. When energy is low, I ask whether I need rest or am avoiding one concrete action.",
        "## 2. Let interest choose the direction and logic improve the route",
        "Logic can show that something is feasible; it cannot decide whether I want to do it for years. I test the work in reality, including its repetitive and boring parts, before optimizing the path.",
        "## 3. Touch reality before polishing the story",
        "Reports, courses, and models help explain a problem but cannot replace real people and real feedback. I run a small real experiment early and test the assumption carrying the most weight.",
        "## 4. Every important claim must answer: why believe it?",
        "A conclusion needs a source, a measurement definition, key assumptions, counterevidence, and a next test. Anything unproven stays labeled as memory, estimate, hypothesis, or pending verification.",
        "## 5. Ask whether the door swings both ways before deciding how long to think",
        "For reversible decisions with limited downside and fast feedback, enough information is enough. Health, law, immigration, long-term debt, and irreversible reputation risk deserve slower judgment, first-hand evidence, and written exit conditions.",
        "## 6. Turn fear into an action that leaves evidence",
        "I shrink a problem into a short experiment and then into today's smallest artifact. Code, a page, an interview, a prototype, or a submission moves reality more than hours of thinking.",
        "## 7. Finish, deliver, and maintain before rewarding myself with another start",
        "The excitement of starting is not progress. A new project must replace, merge, or end something, and every exploration eventually becomes completed, merged, stopped, or archived.",
        "## 8. Treat people, environments, and external structure as infrastructure",
        "Needing feedback and constraints is not weak willpower. I bind important goals to a person, a date, and a deliverable, and prefer making something together over networking with no next step.",
        "## 9. The responsibility is mine, and help should be requested early and specifically",
        "Owning the result does not mean doing every step alone. I explain what I tried, where I am stuck, and what help I need. Advice is input, not authorization.",
        "## 10. Critique behavior and systems, not identity",
        "I write what I expected and what happened, then locate the difference in information, execution, environment, or luck. I change one condition at a time instead of turning a failed plan into a verdict about myself.",
        "## Principles must change too",
        "One insight is only a hypothesis. It becomes a stable principle only after working across situations. I am not trying to build a personality that is always strong. I want a system that can still run when I am tired, afraid, awkward, or rejected."
      ]
    ]
  },
  {
    "id": "coding-roadmap",
    "cat": "reflection",
    "title": [
      "如果现在重新学 Coding，我会这样开始",
      "How I would learn coding if I started again"
    ],
    "meta": [
      "学习方法 · 公开版",
      "LEARNING NOTE · PUBLIC EDITION"
    ],
    "deck": [
      "先建立地图，再练抽象，最后把知识交给真实用户。",
      "Build a map, practice abstraction, then put the knowledge in front of a real user."
    ],
    "body": [
      [
        "我自己的学习路径并不整齐。我看过 CS50 和 CS61A，也一边使用 AI 写代码，一边通过项目补知识。下面不是对经历的重新包装，而是走过一遍以后会推荐的顺序。",
        "## 先用 CS50 建立地图",
        "CS50 从 C、内存、算法和数据结构走到 Python、SQL 与 Web。真正重要的是 problem sets：只看课很容易觉得自己懂了，报错和重写才会诚实地告诉我哪里没有懂。",
        "## 再用 CS61A 练习组织程序",
        "函数、environment、递归、高阶函数、数据抽象、树、对象和解释器，训练的是怎样管理复杂度。CS50 画地图，CS61A 改变拆解问题和组织代码的方式。",
        "## 把知识接到 Web 和真实使用",
        "继续补 HTML、CSS、JavaScript、HTTP、API、数据库、权限、Git、测试和部署，但不等全部学完再开始。做项目遇到不知道的部分，再回到文档补课。",
        "第一个项目应该解决真实问题，有界面、逻辑和数据存储，部署到网上，并交给至少一个不是自己的人使用。课程让我解决已经定义好的题；产品还要求我决定什么值得做、功能停在哪里、出了错怎么办。",
        "## AI 的用途要分开",
        "做基础习题时，把 AI 当助教，让它解释报错、指出思路缺口、生成测试，不直接交完整答案。做自己的产品时可以更激进，但至少要能解释数据、请求、状态和错误怎样流动。",
        "> 最短版本：CS50 建地图，CS61A 练抽象，Web 项目把知识接到现实，然后尽快把一个东西交给别人使用。"
      ],
      [
        "My own learning path was not tidy. I sampled CS50 and CS61A while using AI to code and filling gaps through projects. This is not a polished retelling of my history; it is the sequence I would recommend after walking through it once.",
        "## Start with CS50 to build a map",
        "CS50 moves from C, memory, algorithms, and data structures into Python, SQL, and the web. The problem sets matter most. Lectures create confidence; errors and rewrites reveal what I actually understand.",
        "## Use CS61A to learn how programs are organized",
        "Functions, environments, recursion, higher-order functions, abstraction, trees, objects, and interpreters train the management of complexity. CS50 draws the map; CS61A changes how I decompose a problem.",
        "## Connect the knowledge to the web and real use",
        "I would add HTML, CSS, JavaScript, HTTP, APIs, databases, permissions, Git, testing, and deployment without waiting to master them all. A project makes each missing concept concrete enough to return to the documentation.",
        "A first project should solve a real problem, include an interface, logic, and storage, run somewhere beyond localhost, and reach at least one other person. Courses define the question; products force me to decide what matters, where a feature stops, and what happens when it fails.",
        "## Separate the two uses of AI",
        "During foundational exercises, AI is a tutor: explain the error, expose the gap, propose tests, and avoid handing over the full solution. During product work, I can use coding agents more aggressively, but I still need to explain where data lives, how requests and state move, and how failure becomes visible.",
        "> Short version: CS50 builds the map, CS61A trains abstraction, a web project connects knowledge to reality, and a real user makes the learning honest."
      ]
    ]
  },
  {
    "id": "hema-recommendation",
    "cat": "life",
    "title": [
      "盒马实习：一条推荐理由怎样连接商品、菜谱和购物篮",
      "Hema: connecting a product, a recipe, and a basket"
    ],
    "meta": [
      "实习复盘 · 公开版",
      "INTERNSHIP NOTE · PUBLIC EDITION"
    ],
    "deck": [
      "推荐不是一句文案，而是一条从商品走向使用场景的链路。",
      "A recommendation is not one line of copy; it is a route from a product to a use case."
    ],
    "body": [
      [
        "2021 年初，我在盒马总部做 APP 产品运营实习。最让我记住的，是商品详情页里一条很短的推荐理由：它从当前商品出发，把用户带到相关菜品或菜谱，再连接到同一顿饭需要的其他商品。",
        "## 菜谱和商品之间还有一层翻译",
        "菜谱写番茄、牛腩和洋葱，商品库放的是不同品牌、规格、价格和门店库存的 SKU。我的工作包括建立食材与商品的映射，并逐条走查推荐组合。一个错别字或错误映射，会一路传到用户看到的结果。",
        "## 一个功能有两条价值链",
        "推荐理由既可能帮助用户理解当前商品为什么值得买，也可能通过菜谱增加关联商品。比点击率更接近业务结果的指标，是每次商品详情页访问带来的整体购物篮价值。",
        "走查让我形成三个判断：价格带需要和用户及品类匹配；核心食材与补全食材承担不同任务；菜谱适合生成冷启动候选，真实购买组合更适合逐步校正排序。",
        "我没有在这段实习中训练推荐模型。我的工作是人工走查、数据分析和规则整理。它没有让我变成算法工程师，却让我第一次看见，产品判断怎样进入一条推荐链路。"
      ],
      [
        "In early 2021 I worked in product operations at Hema. What stayed with me was a short recommendation line on a product page. It began with the item already in view, led to a dish or recipe, and then connected the rest of the basket for that meal.",
        "## A recipe and a catalog speak different languages",
        "A recipe says tomato, beef brisket, and onion. A catalog contains brands, sizes, prices, store inventory, and SKUs. My work included mapping ingredients to products and reviewing combinations one by one. A typo or bad mapping upstream could travel all the way to the customer.",
        "## One feature can create value in two directions",
        "The recommendation can make the current item easier to understand and can also add related items through a recipe. A metric closer to the business outcome than click-through rate is the total basket value created per product-detail visit.",
        "The reviews left me with three judgments: price range must fit the user and category; core ingredients and completion ingredients do different jobs; recipes are useful for cold-start candidates, while real baskets should gradually correct the ranking.",
        "I did not train a recommendation model during this internship. I reviewed data, analyzed the flow, and organized rules. It was my first clear view of how product judgment enters a recommendation system."
      ]
    ]
  },
  {
    "id": "deloitte-mapping",
    "cat": "life",
    "title": [
      "德勤审计：我第一次把一套人工作业写成工具",
      "Deloitte: the first workflow I turned into a tool"
    ],
    "meta": [
      "工作复盘 · 公开版",
      "WORK NOTE · PUBLIC EDITION"
    ],
    "deck": [
      "自动化的价值不只在速度，还在一致、留痕和可复核。",
      "Automation is valuable not only for speed, but for consistency, traceability, and review."
    ],
    "body": [
      [
        "在德勤做审计时，我经常要把客户的明细总账重新映射到审计底稿使用的标准科目。这项工作不难，却很容易占掉整个下午。我写代码的动机很直接：少做重复工作，也少加一点班。",
        "## 真正费时间的不是匹配",
        "不同客户的表头、金额格式、科目层级和命名都不一样。我用 Python 和 Pandas 处理读取、清洗、映射与校验，再通过 VBA 把结果放回审计员熟悉的 Excel。流程是：异构总账 → 统一字段 → 分级匹配 → 人工复核 → 勾稽校验。",
        "自动化不应该替人猜。确定性高的项目可以自动处理，模糊部分必须留下来交给审计员判断。完成映射后，系统还要重新计算并确认结果与源数据一致。",
        "这套工具覆盖过多家客户的不同格式，但没有推广到其他审计组，也没有成为正式团队工具。它证明的是我能把个人的重复操作变成可重复、可检查的工作流，而不是组织范围的影响力。",
        "它给我留下一个后来一直使用的标准：程序输出一个数字，不代表数字天然可信。自动化还要让规则一致、异常可见、结果可以被复核。"
      ],
      [
        "At Deloitte I often remapped detailed ledgers from client-specific accounts into the standard structure used by audit workpapers. The task was not intellectually difficult, but it could consume an afternoon. My reason for coding was simple: less repetition and a little less overtime.",
        "## Matching was not the expensive part",
        "Headers, amount formats, account hierarchies, and names changed across clients. I used Python and Pandas for reading, cleaning, mapping, and checks, then VBA to return the result to the familiar Excel workflow: heterogeneous ledgers → normalized fields → layered matching → human review → reconciliation.",
        "Automation should not guess on a person's behalf. High-confidence items can move automatically; ambiguous accounts stay visible for an auditor. After mapping, a separate calculation checks that the result still reconciles to the source.",
        "The tool handled formats from several clients, but it did not spread to other audit teams or become an official team product. The honest claim is narrower: I turned my own repetitive operation into a repeatable, reviewable workflow.",
        "It left me with a standard I still use: a program producing a number does not make the number trustworthy. Automation should also make rules consistent, exceptions visible, and results reviewable."
      ]
    ]
  },
  {
    "id": "locki",
    "cat": "build",
    "title": [
      "Locki：把解锁规则留给用户，不交给 AI",
      "Locki: keep unlocking rules with the user, not AI"
    ],
    "meta": [
      "BUILD LOG · 边界已核对",
      "BUILD LOG · VERIFIED BOUNDARIES"
    ],
    "deck": [
      "AI 可以建议下一步，但不能决定一个人能不能使用自己的手机。",
      "AI may suggest the next step, but it should not decide whether someone may use their own phone."
    ],
    "body": [
      [
        "Locki 是一个 SwiftUI 专注工具原型：先选择要限制的 app，再通过完成当天的任务清单换回使用权。主 app、Widget 和 Screen Time 相关 extension 通过 App Group 同步状态。",
        "## 解锁是一条确定性规则",
        "解锁条件直接写成布尔逻辑：必做任务全部完成，选做任务达到目标数。条件不满足就返回 false。温和模式允许解锁后不因修改清单重新锁上；严格模式会重新检查。",
        "截图证明使用设备端 Vision OCR，不上传图片。AI 生成的任务建议必须经过用户勾选才进入清单，AI 服务没有调用解锁函数；发布配置里 AI 伴侣也默认关闭。",
        "当前边界必须说清：Locki Lite 正在准备 TestFlight；系统级 Family Controls、DeviceActivity 和真正的 app shield 仍需要 Apple capability 与真机验收，不能当成已发布能力。",
        "我最初想让 AI 判断用户是否应该解锁，后来意识到这正是最不该外包给黑盒的权力。工具可以帮助人行动，最终行为边界仍然应该透明、可预测，并由人掌握。"
      ],
      [
        "Locki is a SwiftUI focus-tool prototype: choose apps to restrict, then earn access back by completing a daily checklist. The main app, widget, and Screen Time extensions share state through an App Group.",
        "## Unlocking is a deterministic rule",
        "The condition is explicit Boolean logic: all required tasks plus the target number of optional tasks. If the condition is false, the function returns false. Gentle mode keeps the day unlocked after later edits; strict mode checks again.",
        "Screenshot proof uses on-device Vision OCR and never uploads the image. AI-generated task suggestions enter the list only after the user selects them, and the AI service never calls the unlock function. The release configuration disables the AI companion by default.",
        "The boundary matters: Locki Lite is preparing for TestFlight. System-level Family Controls, DeviceActivity, and a real app shield still require Apple capabilities and device acceptance testing, so they are not presented as shipped.",
        "I first imagined letting AI decide whether a person deserved to unlock a phone. I later realized that was exactly the power a black box should not receive. A tool can support action, but the behavioral boundary should stay transparent and human-controlled."
      ]
    ]
  },
  {
    "id": "mindbridge",
    "cat": "build",
    "title": [
      "MindBridge：人在难受的时候，需要怎样的 AI 陪伴？",
      "MindBridge: what should AI support feel like when someone is hurting?"
    ],
    "meta": [
      "BUILD LOG · 前端原型",
      "BUILD LOG · FRONTEND PROTOTYPE"
    ],
    "deck": [
      "可见的记忆、具体的反思，以及不假装治疗的边界。",
      "Visible memory, concrete reflection, and a boundary that never pretends to be therapy."
    ],
    "body": [
      [
        "MindBridge 追问的是：人在难受的时候，需要怎样的陪伴？我以前在 Know Yourself 尝试把人组织起来；这个原型则探索一段 AI 对话应该怎样反思、记忆和保持边界。",
        "## 先把完成度说清楚",
        "当前版本是 Next.js 前端产品 demo。回复、建议和反思卡片都是确定性样例，没有后端、数据库、模型 SDK 或网络请求。它展示的是产品语言和交互原则，不是已经运行的 AI 服务。",
        "原型把记忆来源直接挂在消息下面，让用户看见某句话连接到哪一段旧内容；Reflection 视图给出观察到的模式、更温和的重述和一个两分钟动作，而不是只做笼统安慰。",
        "页面明确写着它不是治疗、诊断或紧急救助。五条原则比模型能力更重要：反思优先、记忆可见、下一步具体、安全与隐私优先、不把 AI 呈现成持照专业人士。",
        "这个 demo 还没有证明模型能做到这些。它先把一条产品标准画了出来：AI 可以陪着想，但不能靠隐藏画像、过度附和或专业身份幻觉换取信任。"
      ],
      [
        "MindBridge asks what support should feel like when someone is hurting. I once explored that question by organizing people at Know Yourself; this prototype asks how an AI conversation should reflect, remember, and hold boundaries.",
        "## State the completion level first",
        "The current version is a Next.js frontend demo. Replies, suggestions, and reflection cards are deterministic samples. There is no backend, database, model SDK, or network request. It demonstrates product language and interaction principles, not a live AI service.",
        "Memory provenance appears directly under a message so the user can see what earlier material it connects to. The Reflection view offers an observed pattern, a gentler reframe, and a two-minute action instead of generic reassurance.",
        "The interface says clearly that it is not therapy, diagnosis, or crisis support. Its five principles matter more than model capability: reflection first, visible memory, concrete next steps, safety and privacy first, and no imitation of a licensed professional.",
        "The demo has not yet proven that a model can deliver those standards. It first draws the product boundary: AI may help someone think, but it should not earn trust through hidden profiling, endless agreement, or professional-role illusion."
      ]
    ]
  },
  {
    "id": "memoryos",
    "cat": "build",
    "title": [
      "MemoryOS：让会过期的信息慢慢退出检索结果",
      "MemoryOS: letting outdated information fade from retrieval"
    ],
    "meta": [
      "CAPSTONE · BUILD LOG",
      "CAPSTONE · BUILD LOG"
    ],
    "deck": [
      "个人记忆不只需要相关性，也需要时间、类别和被新信息替代的方式。",
      "Personal memory needs more than relevance; it needs time, categories, and a way to be superseded."
    ],
    "body": [
      [
        "MemoryOS 是我独立完成的 capstone 项目，研究个人记忆检索怎样处理时间。一个旧计划和一个长期偏好不应该以同样速度衰减，也不应该永远因为语义相似而排在前面。",
        "## 时间进入检索分数",
        "Postgres RPC 直接计算语义分与时间分，默认权重是 0.65 与 0.35。preferences、work、notes、stale 和 plans 使用不同衰减率；计划退得快，偏好留得久。",
        "存储前会用相似度阈值去重。陈旧检测既看时间分，也检查是否出现更新、语义相近的记忆。被标记的内容保留原分类，用户选择“保留”时可以恢复。",
        "项目还包括 Chrome 扩展、认证与 RLS，以及 8 个测试。RLS 是第一版后补的，嵌入维度也经历过迁移；这些修补记录比一张看起来很完整的架构图更能说明真实成本。",
        "我想解决的不是让 AI 记住更多，而是让记忆系统承认：有些信息会过期，有些会被修订，忘记本身也可以是一种产品能力。"
      ],
      [
        "MemoryOS is an independent capstone project about time in personal-memory retrieval. An old plan and a durable preference should not decay at the same rate, and semantic similarity alone should not keep stale information at the top forever.",
        "## Time enters the retrieval score",
        "A Postgres RPC combines semantic and temporal scores with default weights of 0.65 and 0.35. Preferences, work, notes, stale items, and plans use different decay rates: plans fade quickly; preferences last longer.",
        "A similarity threshold removes duplicates before storage. Staleness detection looks at both temporal decay and newer, semantically similar memories. A stale record keeps its original category so a user can restore it.",
        "The project also includes a Chrome extension, authentication, row-level security, and eight tests. RLS arrived after the first backend version, and embedding dimensions required migrations. Those repairs show the real cost better than a perfectly clean architecture diagram.",
        "The goal is not to make AI remember more. It is to let a memory system admit that information expires, gets revised, and sometimes should gradually leave the answer."
      ]
    ]
  },
  {
    "id": "visocode",
    "cat": "build",
    "title": [
      "Visocode：一句话生成教学动画，代码先过两道安全门",
      "Visocode: generated animation code passes two safety gates"
    ],
    "meta": [
      "HACKATHON · BUILD LOG",
      "HACKATHON · BUILD LOG"
    ],
    "deck": [
      "模型写出的代码先被检查，再进入没有网络的 Docker 沙箱。",
      "Model-generated code is inspected before it reaches a networkless Docker sandbox."
    ],
    "body": [
      [
        "Visocode 是一个独立完成的 AdventureX 项目：输入一句英文描述，生成 Manim 代码并渲染成教学动画。LangGraph 编排生成、审计、执行、调试、降级和上传。",
        "## 审计发生在执行之前",
        "第一层用 AST 扫描拦截 os、subprocess、eval 等危险能力；第二层再用 LLM 判断代码是否通过。只有两层都通过，代码才进入无网络、1 GB 内存、120 秒上限的 Docker 沙箱。",
        "执行失败后，系统压缩 traceback，查询一份手写的 Manim API 索引，再让模型修改代码，最多重试三次。仍然失败就生成一个最小安全场景，而不是无限循环。",
        "RAG 一部分从过去成功的生成记录里取 few-shot，另一部分根据错误查静态 API 表。Streamlit、CLI 和 MCP 只是入口；MCP 不允许绕过审计、重试和沙箱。",
        "这个项目让我更确定：给模型增加入口很容易，真正重要的是每个入口都不能绕过不依赖模型的安全关卡。"
      ],
      [
        "Visocode is an independent AdventureX project that turns an English prompt into Manim code and a rendered teaching animation. LangGraph coordinates generation, audit, execution, debugging, fallback, and upload.",
        "## Audit happens before execution",
        "An AST scanner first blocks capabilities such as os, subprocess, and eval. An LLM then performs a second review. Only code that passes both reaches a Docker sandbox with no network, a 1 GB memory limit, and a 120-second timeout.",
        "When execution fails, the system compresses the traceback, consults a hand-written Manim API index, and asks the model to revise the code for at most three attempts. Continued failure produces a minimal safe scene instead of an infinite loop.",
        "One retrieval layer selects few-shot examples from previously successful runs; another maps errors to a static API table. Streamlit, CLI, and MCP are only interfaces. The MCP path cannot bypass audit, retry, or sandboxing.",
        "The project reinforced a rule I now reuse: adding another model interface is easy; ensuring that every interface still passes through a non-model safety gate is the real work."
      ]
    ]
  },
  {
    "id": "auditflow",
    "cat": "build",
    "title": [
      "AuditFlow：把审计里的「拦、提醒、记录」写进发票流程",
      "AuditFlow: block, warn, or record an invoice exception"
    ],
    "meta": [
      "BACKEND · BUILD LOG",
      "BACKEND · BUILD LOG"
    ],
    "deck": [
      "并非每个异常都该被同样处理，规则的处置强度也需要可解释。",
      "Not every exception deserves the same treatment; enforcement strength should be explainable."
    ],
    "body": [
      [
        "AuditFlow 是一个 Django 发票审核后端。我把在审计里见过的判断拆成四张表、七条规则和三档处置：直接拦截、要求人工确认、只记录备查。",
        "重复发票和采购单供应商不一致会被阻断；名称不一致需要再次确认；高风险供应商、缺少采购单、金额超限和高价值发票会形成 finding。OCR 是可选输入，失败时仍可以使用人工录入内容。",
        "Redis 队列负责异步处理，worker 用数据库行锁避免重复完成；LLM 只根据已经结构化的供应商、金额、规则命中和 OCR 文本生成审核摘要，不决定规则是否通过。",
        "完成边界必须说清：仓库的 Django、Postgres、Redis、Docker 和监控骨架来自课程项目；发票数据模型、七条规则、三档异常和 OCR 流程是后来替换进去的业务判断。",
        "我最喜欢的不是 OCR 或 LLM，而是“拦、提醒、记录”的区别。一个系统不仅要发现异常，还要解释为什么这件事必须停、需要人看，还是只需留下证据。"
      ],
      [
        "AuditFlow is a Django invoice-review backend. I translated audit judgment into four tables, seven rules, and three enforcement levels: block the action, require human confirmation, or record a finding.",
        "Duplicate invoices and purchase-order vendor mismatches are blocked. Name mismatches require confirmation. High-risk vendors, missing purchase orders, excess amounts, and high-value invoices create findings. OCR is optional, and manual text remains usable when extraction fails.",
        "A Redis queue handles asynchronous processing, while a database row lock prevents duplicate completion. The LLM writes a review summary from already structured vendor, amount, rule, and OCR evidence; it does not decide whether a rule passes.",
        "The boundary matters: the Django, Postgres, Redis, Docker, and monitoring skeleton came from a course project. The invoice schema, seven rules, three exception levels, and OCR workflow are the business judgment I added later.",
        "The part I value most is not OCR or the LLM. It is the difference between block, warn, and record. A system should explain why something must stop, needs a person's attention, or only needs an evidence trail."
      ]
    ]
  },
  {
    "id": "leetcode-learning",
    "cat": "build",
    "title": [
      "LeetCode Learning Platform：让提示停在下一步",
      "LeetCode Learning Platform: hints that stop at the next step"
    ],
    "meta": [
      "COURSE PROJECT → PORTFOLIO",
      "COURSE PROJECT → PORTFOLIO"
    ],
    "deck": [
      "学习工具应该暴露下一步，而不是直接夺走解题过程。",
      "A learning tool should reveal the next step without taking away the problem-solving process."
    ],
    "body": [
      [
        "这个项目从 CS5001 课程作业开始，后来继续扩成个人作品集。课程阶段完成全栈骨架、认证、代码执行、算法文章和测试；第二阶段加入课程内容检索、三级 AI 提示和代码检查。",
        "## 提示分三级",
        "第一层只指出应该观察什么，第二层提示可能的数据结构或模式，第三层才接近伪代码。目标不是让模型最快交出答案，而是让学习者在卡住时还能保留下一步思考。",
        "题目数据来自手写 seed，不是爬虫。仓库里存在多套历史 seed 和内容脚本，反复运行可能产生重复；后来的查询层去重是真的，也暴露出生成脚本没有收敛。",
        "已有 110 个测试主要覆盖课程阶段的认证、模型、schema、知识路由和执行路由。后来增加的 RAG、Gemini 和代码检查没有对应测试，工作区的新组件也尚未全部进入 GitHub。",
        "因此它适合被描述为一个仍在整理的学习平台，而不是完成的在线判题系统。最值得保留的产品选择，是让提示停在“下一步”，不要用一次漂亮的答案替代学习。"
      ],
      [
        "This project began as a CS5001 assignment and later grew into a portfolio project. The course phase delivered the full-stack skeleton, authentication, code execution, algorithm articles, and tests. A second phase added course-content retrieval, three levels of AI hints, and code checking.",
        "## Hints come in three levels",
        "The first points to what to observe, the second suggests a data structure or pattern, and the third approaches pseudocode. The goal is not to let the model produce the fastest answer; it is to preserve the learner's next reasoning step.",
        "Question data comes from hand-written seed files, not scraping. Several historical seed and content scripts coexist, and repeated runs can create duplicates. Query-time deduplication works, but it also reveals that the data-generation path never converged.",
        "The 110 existing tests mainly cover the course phase: authentication, models, schemas, knowledge routes, and execution routes. Later RAG, Gemini, and code-checking work is not covered, and some newer components have not reached GitHub.",
        "It should therefore be presented as a learning platform still being consolidated, not a finished online judge. Its strongest product choice is keeping the hint at the next step instead of replacing learning with a polished answer."
      ]
    ]
  },
  {
    "id": "jobfit-baseline",
    "cat": "build",
    "title": [
      "JobFit AI：先做一条能解释的招聘推荐基线",
      "JobFit AI: start with an explainable recommendation baseline"
    ],
    "meta": [
      "EARLY BUILD · HONEST SCOPE",
      "EARLY BUILD · HONEST SCOPE"
    ],
    "deck": [
      "现在能重跑的只有确定性基线，复杂架构仍然是 roadmap。",
      "Only the deterministic baseline runs today; the complex architecture remains a roadmap."
    ],
    "body": [
      [
        "JobFit AI 当前能跑的是一条 125 行的确定性排序基线：技能匹配、标题、地点和岗位新鲜度做加权和，同时返回匹配技能、缺失技能和拆开的得分理由。",
        "README 里画了 PostgreSQL、Redis、双塔召回、FAISS、LightGBM 和 LLM 解释层，但都明确放在 MVP Roadmap。代码里还没有这些组件，也没有数据库、网络或 API key。",
        "项目的设计原则是推荐优先、LLM 其次；系统给出排序和解释，但不投递；公开数字只来自能够重复运行的评测；推荐结果要保存下来才能比较。",
        "当前最大缺口是第一个可测 benchmark。没有数据集，Recall@50、NDCG@10 和 AUC 就只能留在评估计划里。",
        "我想把这个早期状态也公开，是因为“只有一条能解释的 baseline”比一张没有实现的完整架构图更诚实，也更容易决定下一步是否值得继续。"
      ],
      [
        "What runs today in JobFit AI is a 125-line deterministic ranking baseline. It combines skill, title, location, and recency scores, then returns matched skills, missing skills, and a reason for each score component.",
        "The README diagrams PostgreSQL, Redis, two-tower retrieval, FAISS, LightGBM, and an LLM explanation layer, but labels them as an MVP roadmap. None of those components, a database, networking, or API keys exist in the current code.",
        "The design principles are recommendation first and LLM second; rank and explain but never submit; publish only metrics from rerunnable evaluations; and persist recommendations so they can be compared.",
        "The largest gap is the first measurable benchmark. Without a dataset, Recall@50, NDCG@10, and AUC remain an evaluation plan rather than results.",
        "I am publishing the early state because “one explainable baseline” is more honest than a complete architecture diagram that has not been implemented, and it makes the next investment decision easier."
      ]
    ]
  },
  {
    "id": "lifepulse-boundary",
    "cat": "build",
    "title": [
      "LifePulse：这次我只完成了包装，还没有完成重写",
      "LifePulse: I repackaged it; I did not rewrite it"
    ],
    "meta": [
      "PROJECT BOUNDARY NOTE",
      "PROJECT BOUNDARY NOTE"
    ],
    "deck": [
      "把教程代码说成自己的系统很容易，真正重要的是标清贡献边界。",
      "Calling tutorial code a personal system is easy; marking the contribution boundary matters more."
    ],
    "body": [
      [
        "LifePulse 当前的大部分代码来自苍穹外卖教程，包名、模块、支付、OSS、WebSocket、定时任务和 Redis 缓存都保留了上游结构。",
        "我完成的是重新包装、固定 JDK 17 的可复现运行方式，以及 README 与系统文档；我没有完成性能重写，也没有实现宣传里曾经设想的两级缓存。",
        "Redis 目前只是标准单层 cache-aside，而且缓存清理仍使用生产上有阻塞风险的 KEYS。仓库没有测试，也没有真实压测结果。",
        "如果继续做，至少需要真正实现 Lua 原子预扣减、Caffeine + Redis 两级缓存、JMeter 场景与测试，并把结果保存进仓库。",
        "这篇不是一个成功案例，而是一条贡献边界：能跑起来、换名字和补文档，不等于完成了系统重写。"
      ],
      [
        "Most of the current LifePulse code comes from the Sky Take Out tutorial. Package names, modules, payment, OSS, WebSocket notifications, scheduled jobs, and Redis caching retain the upstream structure.",
        "My contribution is the repackaging, a reproducible JDK 17 setup, and new README and system documentation. I did not complete a performance rewrite or the two-level cache once imagined in the positioning.",
        "Redis currently provides a standard single-layer cache-aside, and invalidation still uses KEYS, which can block in production. The repository has no tests and no measured load-test results.",
        "A serious continuation would require a real Lua atomic reservation path, Caffeine plus Redis caching, JMeter scenarios, tests, and stored results.",
        "This is not a success story. It is a contribution boundary: making a tutorial run, renaming it, and improving documentation is not the same as rewriting the system."
      ]
    ]
  },
  {
    "id": "careerops-study",
    "cat": "reflection",
    "title": [
      "我从 career-ops 学到的：把 AI 判断和确定性脚本分开",
      "What career-ops taught me about agents and deterministic scripts"
    ],
    "meta": [
      "开源项目阅读 · 非本人作品",
      "OPEN-SOURCE STUDY · NOT MY PROJECT"
    ],
    "deck": [
      "需要判断的交给 agent，能够验证的留给脚本。",
      "Give judgment to the agent and verifiable operations to scripts."
    ],
    "body": [
      [
        "先说最重要的事：career-ops 是 Santiago Fernández de Valderrama 发起的开源项目，不是我的作品。我克隆并安装过依赖，但没有完成配置，也没有用它跑过自己的求职流程。项目展示的岗位评估、简历和结果数字都属于原作者。",
        "值得记录的是它的边界：AI 负责评估岗位、匹配材料和写故事，人负责最终决定与提交。系统明确把自己定义成 filter，而不是自动海投工具。",
        "架构把需要判断的部分写成 mode 指令，把去重、合并、状态归一、时效检查、PDF 生成和环境自检写成确定性脚本。能用零 token 完成的检查，就不要求模型猜。",
        "这和我在 Locki、Tabspace 和 JobFit AI 里反复遇到的是同一个问题：AI 擅长提出判断，最终动作与可验证规则应该保留在人和普通代码一侧。"
      ],
      [
        "The most important fact comes first: career-ops is an open-source project created by Santiago Fernández de Valderrama, not my work. I cloned it and installed dependencies, but never completed configuration or ran my own job search through it. Its application, résumé, and outcome numbers belong to the original author.",
        "What I wanted to study was its boundary. AI evaluates roles, matches materials, and drafts stories; the person decides and submits. The project calls itself a filter, not an automatic spray-and-pray tool.",
        "Judgment-heavy work lives in mode instructions, while deduplication, merging, status normalization, liveness checks, PDF generation, and environment diagnostics live in deterministic scripts. A zero-token check does not ask a model to guess.",
        "This is the same question I keep meeting in Locki, Tabspace, and JobFit AI: AI can propose judgment, while final action and verifiable rules remain with people and ordinary code."
      ]
    ]
  },
  {
    "id": "becoming",
    "cat": "build",
    "title": [
      "Becoming：把 todo 放进一张会生长的星图里",
      "Becoming: placing todos in a growing star map"
    ],
    "meta": [
      "PROTOTYPE · BUILD LOG",
      "PROTOTYPE · BUILD LOG"
    ],
    "deck": [
      "任务不只属于日期，也可以连接到正在生长的能力。",
      "A task can belong not only to a date, but to a capability that is growing."
    ],
    "body": [
      [
        "Becoming 是一个从 Lovable 起步的 Web 原型，把心理、健康和技能画成一张星图，再把 todo 连接到具体节点。节点有前置条件和解锁状态，任务完成会进入对应的成长路径。",
        "Supabase 保存用户、任务、聊天、星图节点、进度和测试结果，并通过 RLS 限制到当前用户。天赋测试是五道题的规则计分，不是 AI。",
        "任务分类采用关键词兜底、模型处理长尾的顺序：没有模型 key 时仍然能运行。这个设计比“所有分类都交给 AI”更便宜，也更容易预测。",
        "仓库里仍并存两条历史 AI 链路：一条调用模型，另一条转发到旧后端并带静态降级。这是方案切换后没有清理干净的技术债，不应该包装成双后端能力。",
        "它还不是完成的产品。最值得继续验证的是核心比喻：当 todo 连接到“我正在长成什么”，任务会不会比普通清单更有方向感。"
      ],
      [
        "Becoming is a web prototype that began in Lovable. It draws psychology, health, and skills as a star map, then connects each todo to a node with prerequisites and unlock state.",
        "Supabase stores users, todos, chat, star-map nodes, progress, and test results, with row-level security scoped to the current user. The talent test is a five-question rule-based score, not AI.",
        "Todo classification uses keywords first and a model for the long tail. The product still works without a model key, making the common path cheaper and more predictable.",
        "Two historical AI routes still coexist: one calls a model, while another forwards to an older backend and falls back to static replies. That is technical debt from a changed plan, not a feature to market as dual backends.",
        "It is not a finished product. The question worth testing is the metaphor itself: does a task feel more directed when it connects to who I am becoming rather than only to a date?"
      ]
    ]
  },
  {
    "id": "helping",
    "cat": "build",
    "title": [
      "正在帮助：我把「做一秒也算成功」放进任务管理里",
      "Helping: putting “one second still counts” into task management"
    ],
    "meta": [
      "WECHAT PROTOTYPE · BUILD LOG",
      "WECHAT PROTOTYPE · BUILD LOG"
    ],
    "deck": [
      "任务启动不了时，第一步可以小到只有一秒。",
      "When a task will not start, the first step can be only one second long."
    ],
    "body": [
      [
        "“正在帮助”是一个把任务管理、认知行为工具和 AI 对话放在一起的微信小程序尝试。核心工具包括十秒启动、认知重述、做一秒也算成功、逃避记录和把负面情绪转成行动语句。",
        "项目有两个版本：第一天用微信云开发做出 22 个页面，之后三周改成 Supabase。后端切换带来了认证、数据表和迁移成本，后来又从 Supabase Auth 退回自建用户表。",
        "第一版一次加入了十二个认知和专注工具，后续删除了其中一部分。这个删减说明原型阶段最容易把“想到的都做进去”误认为产品完整。",
        "早期 AI 对话从小程序直接调用外部接口并依赖用户填写 key，不适合作为生产架构。它保留下来的价值主要是产品动作，而不是后端实现。",
        "我现在最想留下的是“做一秒也算成功”：任务管理不一定先要求更强的意志力，也可以先把行动门槛缩小到身体愿意开始。"
      ],
      [
        "Helping was a WeChat mini-program experiment combining task management, cognitive-behavioral tools, and AI conversation. Its core tools included a ten-second start, cognitive reframing, “one second still counts,” avoidance logging, and turning negative emotion into an action sentence.",
        "The project had two versions: a 22-page WeChat Cloud prototype built on the first day, followed by three weeks of migration to Supabase. That backend switch introduced authentication, schema, and migration costs, and later moved again from Supabase Auth to a custom users table.",
        "The first version added twelve cognitive and focus tools at once, then removed several. The deletion shows how easily prototype breadth can be mistaken for product completeness.",
        "The early AI chat called an external API directly from the mini-program and relied on users entering a key, so it is not a production architecture. The durable value is in the behavioral design, not that backend.",
        "The idea I still want to keep is “one second still counts.” Task management does not always need stronger willpower first; sometimes it needs an action small enough for the body to begin."
      ]
    ]
  },
  {
    "id": "corpcheck",
    "cat": "build",
    "title": [
      "CorpCheck：怎样证明一条 SEC 回答真的找对了证据",
      "CorpCheck: proving that an SEC answer found the right evidence"
    ],
    "meta": [
      "RAG · BUILD LOG",
      "RAG · BUILD LOG"
    ],
    "deck": [
      "回答像真的不够，检索、版本、拒答和评测都要留下证据。",
      "Sounding right is not enough; retrieval, filing versions, abstention, and evaluation need evidence."
    ],
    "body": [
      [
        "CorpCheck 从一个四人课程 RAG 项目继续发展。旧仓库由团队共同完成，我负责数据管线；新的 corpcheck 仓库是个人重写，两个项目的归属和贡献不能混在一起。",
        "公开公司披露会被修订，同一份 filing 也可能有多个版本。新版本把修订版过滤放进数据管线，避免旧文本和新文本同时进入检索结果。",
        "检索不只依赖单一向量分数，而是组合关键词与语义结果，再通过 RRF 融合。系统还加入拒答闸门：证据不足时，输出“不足以回答”比生成一段像答案的话更可靠。",
        "我保留了没有达到预期的 baseline，并把评测写成可以重复运行的 IR 流程。公开的指标必须来自当前代码和保存的评测结果，不能从旧课程仓库或一次手工 demo 借数字。",
        "这个项目真正回答的问题不是“怎样让 RAG 说得更像专家”，而是怎样让每个答案回到 filing、段落和可复现的检索过程。"
      ],
      [
        "CorpCheck grew from a four-person course RAG project. The original repository was team work, where I owned the data pipeline; the newer corpcheck repository is a solo rewrite. Those ownership boundaries must stay separate.",
        "Public-company disclosures can be amended, leaving multiple versions of what appears to be the same filing. The new pipeline filters amendments so old and revised text do not compete silently in retrieval.",
        "Retrieval combines lexical and semantic candidates and fuses them with reciprocal rank fusion rather than trusting one vector score. An abstention gate returns insufficient evidence instead of producing an answer-shaped paragraph when support is weak.",
        "I kept a baseline that failed to meet expectations and turned evaluation into a rerunnable information-retrieval workflow. Public metrics must come from the current code and stored results, not numbers borrowed from the course repository or one manual demo.",
        "The real question is not how to make RAG sound like an expert. It is how to make every answer trace back to a filing, a passage, and a reproducible retrieval process."
      ]
    ]
  },
];
