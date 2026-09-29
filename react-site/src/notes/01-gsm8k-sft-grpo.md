# GSM8K 后训练：SFT、CoT 蒸馏与 GRPO

- **模型**：Qwen2.5-0.5B
- **代码与原始结果**：[ai-infra-gsm8k](https://github.com/cassieliang6709/ai-infra-gsm8k)
- **硬件**：1 × RTX 4090（24 GB）
- **耗时**：SFT 约 4 分钟 / 次；GRPO 约 100 秒 / 步（116 步约 3.3 小时）；GSM8K 评测约 2 分钟
- **框架**：ms-swift（SFT），verl（GRPO，FSDP + vLLM rollout），vLLM，lm-evaluation-harness

## 问题

在同一个 0.5B 模型上比较三类后训练方法对 GSM8K 的影响：

1. SFT 的不同参数范围（LoRA、全量、LoRA + 可训练 embedding / lm_head）
2. CoT 蒸馏（用更大模型生成的推理过程做 SFT）
3. GRPO（可验证奖励的在线 RL）

并按错误类型拆分，确定每种方法消除的是哪一类错误。

## 设置

**SFT 变体**

| 名称 | 可训练参数 |
| --- | --- |
| `sft_lora` | 线性层上的 LoRA |
| `sft_full` | 全量参数，lr 1e-5 |
| `sft_lora_mts` | LoRA + `embed_tokens` + `lm_head` |
| `sft_cot` | 训练数据为 Qwen2.5-7B-Instruct 生成的推理过程 |

CoT 数据经过拒绝采样：7,473 条教师输出中保留最后一行 `#### n` 答案正确的 4,426 条（59.2%），平均长度 206 token。

**GRPO**

- 起点：`sft_lora_mts` 合并后的模型
- 两组运行，除奖励外超参数完全相同：
  - `acc`：答案正确得分
  - `composite`：答案正确 + 格式分
- 训练 116 步

**评测**

| 协议 | 工具 | 说明 |
| --- | --- | --- |
| 5-shot | lm-evaluation-harness + vLLM | 对话模板，greedy；报告 strict-match |
| zero-shot | verl 训练内验证 | greedy；GSM8K test（1,319 题） |
| 通用能力 | lm-evaluation-harness | MMLU、C-Eval（valid），5-shot，log-likelihood |

**错误分类**（`analysis/error_analysis.py`，规则按顺序匹配）：runaway（输出 ≥ 2,000 token）、格式、计算、推理。

## 结果

### 5-shot（lm-eval）

| 模型 | strict-match | flexible-extract |
| --- | ---: | ---: |
| base，纯文本 prompt | 34.0% | 34.9% |
| base，对话模板 | 29.3% | 29.6% |
| `sft_lora` | 35.5% | 27.9% |
| `sft_full` | 33.1% | 33.1% |
| `sft_lora_mts` | 34.0% | 34.0% |
| `sft_cot` | **47.9%** | 47.9% |
| GRPO `acc`（step 80） | 45.6% | 45.6% |
| GRPO `composite`（step 116） | 44.9% | 44.9% |

来源：`results/lm_eval/`

### zero-shot（verl 验证）

| 步数 | 0 | 20 | 40 | 60 | 80 | 100 | 116 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `acc` | 34.7% | 40.3% | 45.3% | 47.5% | 48.7% | 49.2% | **52.2%** |
| `composite` | 34.5% | 38.1% | 42.7% | 46.9% | 47.9% | 50.3% | **51.1%** |

来源：`results/logs/grpo_*_val_curve.log`

### 错误构成（5-shot）

| 模型 | 错误 | 计算 | 推理 | runaway |
| --- | ---: | ---: | ---: | ---: |
| base，对话模板 | 932 | 193（21%） | 655（70%） | 84（9%） |
| `sft_lora` | 851 | 73（9%） | 253（30%） | **525（62%）** |
| `sft_full` | 883 | 164（19%） | 665（75%） | 54（6%） |
| `sft_lora_mts` | 871 | 184（21%） | 653（75%） | 34（4%） |
| `sft_cot` | 687 | 53（8%） | 613（89%） | 21（3%） |
| GRPO `acc`（step 80） | 718 | 172（24%） | 545（76%） | 1（0%） |

所有模型的格式错误均为 0。

### 通用能力

| 模型 | MMLU | C-Eval |
| --- | ---: | ---: |
| base | 47.6% | 54.3% |
| `sft_full` | 47.7% | 55.0% |
| `sft_lora_mts` | 47.0% | 53.6% |
| GRPO `acc`（step 80） | 47.0% | 52.5% |

## 分析

### `sft_lora` 的 runaway

`sft_lora` 的 851 个错误中有 525 个是 runaway：答案已经给出，但模型没有输出 `<|im_end|>`，一直生成到 2,000 token 上限。strict-match 与 flexible-extract 之间 7.6 个百分点的差距也来自这里：flexible-extract 取输出中最后一个数字，而这个数字位于答案之后继续生成的文本中。

对 `<|im_end|>` 的探针（`analysis/eos_probe.py`，50 道训练题取中位数）：

| 模型 | `lm_head` 行范数 | 答案后 P(`<\|im_end\|>`) | 排名 |
| --- | ---: | ---: | ---: |
| base | 0.301（全词表中位数 0.461） | 0.0000 | 141,238 |
| `sft_lora` | 0.301（未变） | 0.0003 | 356 |
| `sft_lora_mts` | 0.306（与 embedding 解绑） | **0.9998** | 1 |
| `sft_full` | 0.302 | 0.13 | 1 |

- base 模型中 `<|im_end|>` 与 `<|im_start|>` 的行范数同为 0.301，显著低于普通 token，符合「初始化后从未被训练」的特征
- Qwen2.5-0.5B 的 embedding 与 `lm_head` 共享权重；线性层上的 LoRA 不更新这两者，该行保持原值
- 放开 `embed_tokens` / `lm_head` 后，停止概率升至 0.9998，runaway 从 525 降到 34

[02](02-stop-token-pretraining.md) 用对照预训练实验单独验证了这一机制。

### CoT 蒸馏

5-shot 协议下，`sft_cot` 是提升最大的单项变体（34.0% → 47.9%）。计算错误占比从 21% 降到 8%，runaway 降到 3%。

### GRPO

- `acc` 在 116 步内把 zero-shot 从 34.7% 提升到 52.2%，runaway 基本消失
- 增加格式分（`composite`）没有带来提升：51.1% 对 52.2%，差距在单 seed 的噪声范围内
- MMLU 与 base 的差距在 0.6 个百分点以内；C-Eval 最多下降 1.8 个百分点

## 局限

- 每个配置只有 1 个 seed，约 1 个百分点的差异在运行间噪声范围内
- zero-shot（verl）与 5-shot（lm-eval）使用不同的 prompt，两组数字不能直接比较
- GSM8K test 同时作为 GRPO 的监控验证集；没有基于它选择 checkpoint，报告的是最后一步
- `acc` 的 step 116 checkpoint 在 lm-eval 运行前被清理脚本删除，因此 5-shot 只有 step 80 的结果，不应作为最终结果引用；zero-shot 曲线覆盖全部 116 步
- `acc` 从 step 80 恢复过训练，日志中 step 80 有两条记录（恢复前 48.7%，恢复后 48.8%）
- verl 需要独立的虚拟环境，因为它与 SFT 工具链要求的 transformers 版本冲突

## 复现

```bash
python scripts/prepare_data.py            # HF openai/gsm8k -> data/
bash scripts/setup.sh                     # ms-swift、vLLM、lm-eval、base 模型
bash scripts/s0_install_verl.sh           # verl 独立 venv

bash scripts/sft.sh                       # sft_lora
bash scripts/sft_full.sh                  # sft_full
bash scripts/sft_lora_mts.sh              # sft_lora_mts
python scripts/gen_cot.py <Qwen2.5-7B-Instruct 路径> data/gsm8k_cot_train.jsonl
bash scripts/sft_cot.sh                   # sft_cot

MODE=full bash scripts/grpo.sh            # GRPO acc
MODE=full bash scripts/grpo_composite.sh  # GRPO composite

bash scripts/eval.sh <model> <name> chat  # GSM8K 5-shot
bash scripts/eval_knowledge.sh            # MMLU + C-Eval
python analysis/eos_probe.py <model> ...
python analysis/summarize.py
```

## 待做

- [ ] 多 seed，给 1 个百分点量级的差异加误差条
- [x] runaway 成因的对照实验 → [02](02-stop-token-pretraining.md)
