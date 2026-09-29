# 结束符与预训练：LoRA SFT 后的 runaway 对照实验

- **模型**：MiniMind，64M 参数，从零预训练
- **代码与原始结果**：[stop-token-study](https://github.com/cassieliang6709/stop-token-study)
- **硬件**：1 × RTX 4090
- **耗时**：第 1 轮（数据、两组预训练、3 次 SFT、探针）约 2.7 小时；第 2 轮约 40 分钟
- **实现**：预训练与 SFT 训练循环为纯 PyTorch；复用 MiniMind 的模型定义、分词器、对话数据与 LoRA 模块

## 问题

[01](01-gsm8k-sft-grpo.md) 在 Qwen2.5-0.5B 上观察到：`<|im_end|>` 在 base 模型中未被训练，线性层 LoRA SFT 之后模型几乎无法停止。这是观察性结论。本实验控制其他变量，检验因果：

> 预训练阶段是否见过对话结束符，会不会改变 LoRA SFT 之后模型输出结束符的能力？

## 设置

**预训练**：两组只在文档格式上不同。

| 组 | 预训练文档格式 | 预训练中的 `<\|im_end\|>` |
| --- | --- | --- |
| A（MiniMind 默认） | `<\|im_start\|> 正文 <\|im_end\|>` | 每篇文档结尾都是预测目标 |
| B（类似 Qwen base） | `正文 <\|endoftext\|>` | 语料中出现 0 次 |

- 语料 `pretrain_t2t_mini`，1,270,238 篇文档
- 文档顺序、随机种子、优化器、学习率调度完全一致
- 最终预训练 loss：A 2.07，B 2.06

**SFT**

- 两组使用相同的 LoRA SFT：rank 16，作用于方阵投影，embedding / LM head 冻结
- 数据为 MiniMind 对话数据 10 万条
- B 组额外运行一次 embedding 可训练（与 LM head 绑定）的 SFT，对应 [01](01-gsm8k-sft-grpo.md) 中在 Qwen 上有效的修复

**评测**

- 200 个 held-out prompt，greedy 解码
- 512 token 内未生成 `<|im_end|>` 记为 runaway
- 探针：参考答案结束处 P(`<|im_end|>`) 的中位数，以及 `<|im_end|>` 在词表中的排名

## 结果

| 模型 | runaway（第 1 轮） | runaway（第 2 轮） | P(`<\|im_end\|>`) 中位数 | `<\|im_end\|>` 排名 |
| --- | ---: | ---: | ---: | ---: |
| A，仅预训练 | 0 / 200 | — | 0.034 | 5 |
| B，仅预训练 | 200 / 200 | — | 0.0000004 | 5,261 |
| A + LoRA SFT | 96 / 200 | **52 / 200** | 0.010 | 17 |
| B + LoRA SFT | 149 / 200 | **93 / 200** | 0.000019 | 330 |
| B + LoRA SFT，embedding 可训练 | 133 / 200 | 78 / 200 | 0.0014 | 50 |

仅预训练两行的探针值来自第 1 轮，SFT 三行来自第 2 轮。来源：`results/probe.json`、`results/run2/probe.json`

## 分析

- **结束符需要在预训练中被学到，LoRA SFT 才能利用它**。在相同的 LoRA SFT 下，B 组的 runaway 接近 A 组的两倍：第 2 轮 93 对 52（z = 4.4），第 1 轮 149 对 96（z = 5.7）。在参考答案结束处，B 组给结束符的概率约低 500 倍（0.000019 对 0.010）
- **只训练 embedding 只能部分修复**：排名 330 → 50，runaway 93 → 78（第 2 轮）、149 → 133（第 1 轮），在 n = 200 下都不显著（z = 1.5、1.8）。同样的修复在 Qwen2.5-0.5B 上接近完全有效（P(stop) 0.0003 → 0.9998）；64M 模型在 3k 步 SFT 内恢复的程度低得多
- **loss 看不出这个差异**：两组预训练 loss 为 2.07 对 2.06，第 2 轮 SFT loss 为 1.85 对 1.86

## 局限

- **第 1 轮 SFT 数据截断**：10 万条对话中有 49,096 条超过 340 token 的训练长度，结束符被截掉，等于在所有组中训练「不停止」。第 2 轮只使用 ≤ 300 token 的对话，各组 runaway 约减半，A/B 差距保持
- 第 2 轮 A 组仍有 52 / 200 runaway。可能原因：生成上限（512）超过训练长度（≤ 340）；64M 模型在 greedy 解码下出现重复循环。尚未检查具体输出
- 每组 1 个 seed，n = 200

## 复现

```bash
git clone --depth 1 https://github.com/jingyaogong/minimind.git   # 版本见 results/minimind_commit.txt
bash scripts/run.sh     # 第 1 轮：数据、A/B 并行预训练、3 次 SFT、探针（约 2.7 小时）
bash scripts/run2.sh    # 第 2 轮：过滤后的 SFT 数据，复用预训练 checkpoint（约 40 分钟）
```

| 路径 | 内容 |
| --- | --- |
| `src/pretrain.py` | 从零预训练，A 组或 B 组 |
| `src/sft.py` | LoRA / LoRA + embedding 对话 SFT |
| `src/probe.py` | 行范数、答案后 P(end)、runaway 率 |
| `src/filter_sft.py` | 第 2 轮数据：只保留不超过训练长度的对话 |

## 待做

- [ ] 检查第 2 轮 A 组 52 条 runaway 的输出，区分重复循环与其他原因
- [ ] 多 seed
