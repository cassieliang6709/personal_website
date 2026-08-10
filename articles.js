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
    id: "mushroom",
    cat: "reflection",
    title: ["待机小蘑菇", "The little idle mushroom"],
    meta: ["随笔 · 节选重写", "ESSAY · ADAPTED"],
    deck: ["关于等待、节奏，以及害怕的时候不要把方向盘抢碎。", "On waiting, rhythm, and not breaking the steering wheel when fear shows up."],
    body: [[
      "有一阵子，我每天醒来的第一件事不是起床，是开庭。昨天没回的邮件、今天要投的岗位、还没改完的简历，一件一件冲进脑子里，争着证明我哪里做得不够好。",
      "后来我给脑子画了一个控制室。里面有戴安全帽的小工头、抱着旧录像带的小 C，还有总想在控制台种蘑菇的小 E。这样做并没有让我忽然不焦虑，只是终于能看见：原来不是‘我’坏掉了，是三个频道同时抢方向盘。",
      "小工头想检查第十一遍，因为他相信只要足够认真，就不会出错。小 C 会把小学演讲失败的录像带拿出来全屏播放。小 E 倒是很快乐，她想做一个会长蘑菇的简历，也觉得奶茶具有战略意义。",
      "我给他们定的第一条规则是：今天不开法庭，今天开调度会。做错了不算塌房，算待修。传错简历也不是世界末日，只是 v1.0 已发布，允许热修复。",
      "这条规则最有用的地方，不是把错误说得可爱一点。它把‘我完了’变成了几个能处理的动作：重新投、补一封邮件、下次改好文件名。害怕可以发言，但不能抢方向盘。灵感也可以来，只是要排队。",
      "我后来还发现，脑子里的念头其实有三条频道。默念最快，也最乱，因为它没有质检口；说出口会慢一点，词开始排队；写下来最慢，却是唯一允许回头修改、保留上一版的频道。",
      "所以默念很烂，不等于我很烂。默念只是草稿在跑。真的需要想清楚时，我要么说出来，让它排队；要么写下来，让它过质检。",
      "待机也一样。游戏角落里的小蘑菇没有任务提示，没有进度条，看起来什么都没做。但没有进度条，不代表地下没有长根。人也不需要每一分钟都拿出产出来证明自己还在运行。",
      "我现在还会害怕，也还是会打开太多窗口。成功并不是控制室从此安静，而是红灯亮起来的时候，没有人把方向盘抢碎。今天先喝水。奶茶暂列第二。"
    ], [
      "For a while, the first thing I did each morning was not get out of bed. It was hold court. Unanswered emails, applications, and unfinished résumé edits rushed in, each trying to prove what I had done wrong.",
      "I eventually drew a control room inside my head. It contained a foreman in a red hard hat, little C carrying old failure tapes, and little E trying to grow mushrooms on the console. The drawing did not remove anxiety. It showed me that I was not broken; three channels were fighting over the wheel.",
      "The foreman wants an eleventh review because he believes enough checking can eliminate mistakes. Little C plays an elementary-school speech failure in full screen. Little E is happier. She wants a résumé that grows mushrooms and considers milk tea strategically important.",
      "The first rule I gave them was simple: no courtroom today; today is a scheduling meeting. A mistake is not a demolition. It is a repair ticket. Sending the wrong résumé is not the end of the world. Version 1.0 shipped, and hotfixes are allowed.",
      "The rule works because it does more than make error sound cute. It turns ‘I am ruined’ into actions: apply again, send a correction, fix the filename next time. Fear may speak, but it cannot seize the steering wheel. Ideas may arrive too; they just need to queue.",
      "I later noticed that thoughts run through three channels. Silent thought is fastest and messiest because it has no quality gate. Speaking is slower because words must line up. Writing is slowest, but it is the only channel that keeps a previous version and allows revision.",
      "A messy inner monologue does not mean I am a messy thinker. It only means the draft is running. When something needs to become clear, I say it so the words can queue, or write it so the idea can pass inspection.",
      "Idle time works the same way. A little mushroom in the corner of a game has no quest marker or progress bar. It looks as if nothing is happening, but the absence of a progress bar does not mean roots have stopped growing underground.",
      "I still get scared, and I still open too many windows. Success is not a silent control room. It is reaching a red light without breaking the steering wheel. Water first today. Milk tea remains number two."
    ]]
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
  }
];
