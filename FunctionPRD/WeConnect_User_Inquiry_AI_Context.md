# WeConnect 用户咨询功能 AI Context Pack / PRD

> 用途：给 GitHub Copilot、Claude Code、CodeX 或其他 AI coding agent 读取，帮助其理解 WeConnect 用户咨询功能的产品定位、业务规则、交互逻辑、数据实体、功能需求和未来演进方向。
>
> 重要更正：本文件只描述 WeConnect 用户咨询 / 图文沟通 / Self Service 入口相关能力，不包含微信服务号迁移引流页方案。

---

## 0. One-line Summary

WeConnect 用户咨询功能是未来 Self Service 服务入口体系中的 V1.0 初级版本，目标是在小程序内为客户提供一个稳定、可持续演进的统一服务入口，支持 FAQ 自助引导、图文沟通、Case 级用户联系入口、智能提示，以及远程服务工程师基于 Work Order 主动向用户发起对话。

---

## 1. Product Positioning

### 1.1 产品定位

WeConnect 不是一个临时客服入口，而是未来 Philips Healthcare 在线服务 Self Service 平台的一部分。

当前版本的用户咨询功能应被视为：

- Self Service 入口的 V1.0 简化版本
- 客户与 Philips 服务团队在线互动的统一入口
- 后续 FAQ、知识库、AI Assistant、智能推荐、远程诊断、消息中心的基础容器
- 连接客户、设备、Case、工单、服务工程师和知识内容的交互层

### 1.2 设计原则

1. 入口稳定，不频繁变化
   - 当前的 General Inquiry 入口未来应自然演进为更完整的 Self Service 入口。
   - 不应因为后续增加 FAQ、AI Bot 或更多自助服务能力而频繁更换用户入口。

2. 先人工，后智能
   - V1.0 以人工咨询、FAQ 展示、图文沟通为主。
   - 后续逐步加入智能问答、智能推荐、意图识别和自动分流。

3. 以用户任务为中心，而不是以内部组织为中心
   - 用户不需要理解 CCC、RSE、FSE、Sales、D365、Case routing 等内部流程。
   - 用户只需要知道在哪里提问、是否有人处理、如何继续跟进。

4. 主动服务优先
   - 页面不应只是被动等待用户输入。
   - 系统应根据用户已有设备、进行中 Case、报修记录、远程工程师消息等上下文，主动提示用户可能需要的服务。

5. 图文沟通是核心能力
   - 咨询功能不是纯文本表单。
   - 应支持文字、图片、视频/音视频文件等多媒体信息，帮助远程判断问题。

6. 前台以 Case 为沟通锚点，后台可关联多个 Work Order
   - 一个 Case 下可能存在多个 Work Order。
   - Work Order 是内部服务执行和工程师工作的关联对象，不应要求用户识别或选择具体 Work Order。
   - 用户通过 Case 联系 Philips，系统负责将对话映射到正确的 Work Order 和工程师上下文。

7. 对话支持双向发起
   - 用户可以从 General Inquiry 或 Case Detail 主动发起咨询。
   - 远程服务工程师也可以基于 Work Order 主动向用户发起对话。
   - 工程师主动发起的消息必须在用户侧有明确、可发现的入口和未读提醒。

---

## 2. Scope Definition

### 2.1 In Scope for V1.0

V1.0 需要支持：

- General Inquiry 统一咨询入口
- Case Detail Inquiry 已有 Case 详情页咨询入口
- 用户以前台 Case 为沟通锚点，不要求选择 Work Order
- 远程服务工程师基于 Work Order 主动发起对话
- 系统建立 Case、Work Order、Conversation 之间的映射
- 图文沟通能力
- 用户发送文本和图片
- 后续兼容视频、语音、文件等多媒体消息
- FAQ / 高频问题展示区
- 根据上下文展示智能提示卡片
- 对认证用户和授权用户开放
- 客户响应中心 7x24 小时接收、响应和分流咨询
- 仅在远程服务工程师 available 时，由客户响应中心将工程师类问题分配给远程服务工程师
- 与 Case / Work Order 的关联
- 小程序端聊天界面
- D365 端 CCC / RSE 回复界面
- 历史咨询记录
- 消息提醒 / 红点提示
- 设备信息可选关联

### 2.2 Out of Scope for V1.0

V1.0 不包含：

- 完整 AI 自动问答闭环
- 完整意图识别模型
- 全自动 Case 创建和派单决策
- 排队序号展示
- 微信服务号迁移引流页
- 独立视频会议系统完整实现
- 复杂知识库管理后台
- 支付、电商订单、商业报价闭环

### 2.3 Future Scope

未来可扩展：

- AI Assistant / Copilot 式智能助手
- Self Service Portal
- 动态 FAQ 推荐
- Case 进度智能解释
- 远程诊断辅助
- 智能派单建议
- 用户意图识别
- 自动生成标准回复
- 服务知识库搜索
- 设备风险提醒
- 合同、保养、工单、备件、工程师资质等自助查询入口

---

## 3. Key Concepts

### 3.1 Self Service Entry

Self Service Entry 是 WeConnect 未来面向客户的统一服务入口。

它可以聚合：

- 咨询
- 报修
- 工单查询
- 设备管理
- 保养查询
- 合同提醒
- 工程师资质查询
- 备件防伪查询
- FAQ
- AI Assistant
- 消息中心

当前 User Inquiry 功能是这个 Self Service Entry 的 V1.0 基础形态。

### 3.2 General Inquiry

General Inquiry 是统一咨询入口。

适用场景：

- 用户不知道该进入哪个服务流程
- 用户想咨询业务、服务、设备或订单相关问题
- 用户想快速联系 Philips
- 用户想查看常见问题
- 用户想从 FAQ 或智能提示进入某个具体服务任务

General Inquiry 不应只是一个输入框，而应是一个轻量 Self Service 首页。

### 3.3 Case Detail Inquiry

Case Detail Inquiry 是 Case 详情页中的咨询入口。

适用场景：

- 用户正在查看某个 Case
- 用户希望追问该 Case 进展
- 用户希望补充图片、视频或说明
- 远程服务工程师/RSE 已经基于该 Case 发起沟通

Case Detail Inquiry 与具体 Case 强绑定。

### 3.4 Case 与 Work Order 的沟通关系

- **Case 是用户侧的沟通锚点。** 用户知道自己提交了一次报修或正在跟进一个 Case，因此用户应通过 Case 联系 Philips。
- **Work Order 是内部服务执行对象。** 一个 Case 下可能有多个 Work Order，分别对应不同服务任务或工程师工作。
- 用户不应被要求理解、识别或选择具体 Work Order。
- 远程服务工程师可以基于某个 Work Order 主动发起对话。
- 系统需要把工程师基于 Work Order 发起的消息，聚合并呈现在对应 Case 的用户会话中。
- 后台必须保留消息对应的 Work Order 标识，以便工程师和内部系统追踪；前台默认不暴露复杂 Work Order 选择和路由。

### 3.5 图文沟通

图文沟通是指客户与 CCC / RSE / 服务团队之间通过聊天式界面进行文字、图片以及未来扩展的语音、视频、文件沟通。

图文沟通不是 FAQ，也不是静态表单，而是一个双向互动通道。

---

## 4. User Roles

### 4.1 Customer / End User

典型用户：

- 临床科室人员
- 医工 / 设备科人员
- 已注册小程序用户
- 报修人
- 工单签字人
- 授权用户 / Super User

核心需求：

- 快速找到服务入口
- 提交问题或补充资料
- 查看服务进展
- 与 Philips 服务人员沟通
- 不需要理解复杂内部流程

### 4.2 客户响应中心 / CCC Agent

CCC 在用户前台统一称为 **客户响应中心**。客户响应中心提供 **7x24 小时服务**，是所有 General Inquiry 的第一接触点，并承担接收、初步响应和分流职责。

能力与规则：

- 7x24 小时接收 General Inquiry
- 查看用户输入内容和附件
- 判断咨询类型及是否需要工程师介入
- 对可直接处理的问题，使用经业务确认的话术自行回复
- 对需要工程师处理的问题，仅在有 available 的远程服务工程师时进行分配
- 当没有 available 的远程服务工程师时，不对用户承诺实时工程师响应，由客户响应中心继续使用合适话术进行回复和承接
- 在 D365 中处理、分流或查看会话记录

用户不需要知道客户响应中心到远程服务工程师的内部转派路径。

### 4.3 RSE / Remote Service Engineer

远程服务工程师不提供 7x24 小时响应。只有在远程服务工程师 available 且问题需要工程师介入时，客户响应中心才将问题分配给远程服务工程师。

能力：

- 基于具体 Work Order 主动向用户发起图文沟通
- 参与由用户从 Case 入口发起的图文沟通
- 查看客户上传的图片、视频、文字描述
- 通过图文或视频方式远程澄清问题
- 判断是否需要 FSE 上门
- 将沟通记录保留在系统中

### 4.4 FSE / Field Service Engineer

现场工程师。

可能需要查看与 Case / Work Order 相关的用户补充资料和沟通记录。

注意：FSE 是否需要查看完整图文沟通记录是待确认事项。

### 4.5 Sales / Business Team

处理部分商务、合同、订单、服务权益相关咨询。


### 4.6 Eligible Users

本功能同时对以下两类用户开放：

- **认证用户**
- **授权用户**

两类用户均可：

- 进入 General Inquiry / Self Service 入口
- 浏览 FAQ 与智能提示
- 发起图文咨询
- 查看自己有权限访问的 Case、工单和相关会话

具体数据可见范围仍应遵循用户身份、设备归属和 Case / 工单权限规则，不应因为可使用咨询功能而扩大现有业务数据权限。

---

## 5. Core User Scenarios

### 5.1 Scenario A: 用户从 General Inquiry 发起普通咨询

用户进入 Self Service / General Inquiry 页面后：

1. 页面展示 FAQ 和智能推荐卡片
2. 用户可点击 FAQ 自助查看答案
3. 如果 FAQ 不能解决，用户可继续发起咨询
4. 用户输入问题并可上传图片
5. 用户可选择关联设备，也可不选择
6. 咨询提交后进入 7x24 小时客户响应中心
7. 客户响应中心判断问题类型
8. 若可直接处理，由客户响应中心使用标准话术回复
9. 若需要工程师介入且有 available 的远程服务工程师，则分配给远程服务工程师
10. 若当前没有 available 的远程服务工程师，则由客户响应中心继续承接并使用合适话术回复
11. 用户在聊天界面收到回复

### 5.2 Scenario B: 用户有进行中的报修 Case

如果系统识别用户有进行中的 Case：

- 在 General Inquiry 页面主动展示提示卡片
- 示例：
  - “您当前有一个报修正在处理中，是否要查看进展？”
  - “远程服务工程师已发来消息，是否立即查看？”
  - “是否要对 Case #xxx 补充故障图片？”

用户点击后进入对应 Case Detail Inquiry 或 Case 详情页。

### 5.3 Scenario C: RSE 基于 Work Order 主动向用户发起沟通

当远程服务工程师需要基于某个 Work Order 联系用户时：

1. RSE 在内部工程师工作界面中，从目标 Work Order 发起图文对话
2. 系统读取该 Work Order 所属的 Case 和对应用户
3. 系统创建或复用该 Case 下的用户会话，并在后台保留 origin_work_order_id
4. 小程序通过消息中心、Self Service 首页智能提示、Case 列表/详情红点等方式提示用户
5. 用户看到“远程服务工程师发来新消息”，点击后进入对应 Case 会话
6. 用户无需判断该消息来自哪个 Work Order，也无需手动选择 Work Order
7. 用户回复后，系统将消息同步到 Case 会话，并关联到发起对话的 Work Order
8. RSE 在内部界面继续查看和回复，所有记录支持追溯

关键规则：

- 工程师主动发起对话是正式功能要求，不是仅预留的未来能力。
- 用户前台以 Case 为上下文，后台以 Work Order 保留精确执行上下文。
- 如果同一 Case 下多个 Work Order 的工程师分别发起消息，前台仍应保持清晰的 Case 级沟通体验，后台必须保留每条消息的 Work Order 来源。

### 5.4 Scenario D: 用户想咨询报修相关问题但尚未提交报修

系统可根据用户入口、设备状态或最近行为，主动提示：

- “是否遇到设备报修相关问题？”
- “您可以先查看常见故障处理方式”
- “如需报修，可通过扫码或输入设备编号快速提交”

用户可选择：

- 查看 FAQ
- 进入报修流程
- 继续人工咨询

### 5.5 Scenario E: 用户从 Case Detail 发起补充说明

用户进入某个 Case 详情页后：

1. 点击“咨询 / 补充说明 / 联系服务工程师”
2. 系统自动关联当前 Case
3. 用户发送文字和图片
4. CCC / RSE 在 D365 查看
5. 消息记录归档到对应 Case / Work Order

---

## 6. UX Requirements

### 6.1 General Inquiry 页面结构

General Inquiry 页面建议包含：

1. Header
   - 页面标题建议避免内部术语
   - 推荐名称：在线咨询 / 服务助手 / 自助服务

2. Smart Prompt Area
   - 主动提示用户可能关心的事项
   - 根据用户上下文动态展示

3. FAQ Area
   - 高频问题列表
   - FAQ 内容由 Judy / CCC Team 提供并维护
   - FAQ 可以按场景分类

4. Quick Actions
   - 报修
   - 查看工单
   - 设备查询
   - 保养查询
   - 联系客服 / 继续咨询

5. Inquiry Composer
   - 文本输入框
   - 图片上传入口
   - 未来扩展：视频、语音、文件

6. Device Association
   - 选择已绑定设备
   - 输入设备编号
   - 跳过设备信息

7. Conversation History
   - 最近咨询
   - 与 Case 关联的聊天记录

### 6.2 Case Detail Inquiry 页面结构

Case Detail Inquiry 页面建议包含：

1. Case Context Header
   - Case 编号
   - 设备名称 / 设备编号
   - 当前状态
   - 前台不要求用户选择 Work Order

2. Conversation Thread
   - 显示当前 Case 相关对话
   - 聚合同一 Case 下由不同 Work Order 触发的相关消息
   - 不混入无关 General Inquiry 对话
   - 默认不向用户展示内部 Work Order 路由，但可显示必要的服务角色和消息时间

3. Attachment Composer
   - 文本
   - 图片
   - 后续扩展：视频、语音、文件

4. Service Staff Message
   - 前台可区分“客户响应中心”“远程服务工程师”和“系统消息”三种消息身份
   - 用户可以知道当前回复者属于客户响应中心还是远程服务工程师
   - 用户不需要看到内部转派步骤、队列、团队路由或 D365 处理路径
   - 身份切换应以自然的系统提示表达，例如“远程服务工程师已加入对话”，而不是展示内部派单日志

---

## 7. Smart Prompt Requirements

### 7.1 智能提示目标

General Inquiry 页面需要“更智能”，不能只等待用户输入。

系统应根据用户上下文主动推荐下一步。

### 7.2 Prompt Types

#### 7.2.1 Ongoing Case Prompt

条件：用户有进行中的 Case。

示例：

```text
您当前有一个报修正在处理中，是否要查看进展或补充信息？
```

Action：进入 Case Detail。

#### 7.2.2 RSE Message Prompt

条件：远程服务工程师基于某个 Work Order 主动发来新消息，且系统已确定其所属 Case 和目标用户。

示例：

```text
远程服务工程师已发来消息，建议尽快查看并回复。
```

Action：进入对应 Case 会话。用户无需选择 Work Order。

#### 7.2.3 Repair Intent Prompt

条件：系统识别用户可能与报修相关。

示例：

```text
您是否遇到设备报修相关问题？可以先查看常见问题，或直接发起报修。
```

Action：查看 FAQ / 发起报修 / 联系客服。

#### 7.2.4 Missing Information Prompt

条件：用户已经提交问题但缺少设备或图片信息。

示例：

```text
为了更快判断问题，您可以补充设备编号或上传故障图片。
```

Action：补充设备 / 上传图片。

#### 7.2.5 FAQ Suggestion Prompt

条件：FAQ 中存在相关问题。

示例：

```text
我们找到几个可能相关的问题，您可以先查看答案。
```

Action：打开 FAQ。

---

## 8. FAQ Requirements

### 8.1 FAQ 内容来源

FAQ 内容需要由：

- Judy Team
- CCC Team

共同梳理和维护。

### 8.2 FAQ 内容类型

建议覆盖：

- 报修相关问题
- 设备绑定问题
- 工单进度问题
- 远程服务工程师联系问题
- 图片/视频补充说明问题
- 保养查询问题
- 合同/服务权益问题
- 工程师资质查询问题
- 备件防伪查询问题
- 小程序使用问题

### 8.3 FAQ 展示原则

- 不要一次展示过多问题
- 优先展示高频问题
- 根据用户上下文动态推荐
- 允许用户继续人工咨询
- FAQ 不能阻断人工入口

### 8.4 FAQ Data Model

```json
{
  "faq_id": "string",
  "category": "repair | device | work_order | contract | maintenance | account | other",
  "question": "string",
  "answer": "string",
  "priority": "number",
  "tags": ["string"],
  "related_action": {
    "type": "open_page | start_inquiry | start_repair | view_case",
    "target": "string"
  },
  "status": "draft | active | archived",
  "owner": "Judy / CCC Team",
  "last_updated_at": "datetime"
}
```

---

## 9. Functional Requirements

### FR-001: Unified Inquiry Entry

系统必须提供一个统一咨询入口，用于承接客户的通用咨询。

Acceptance Criteria：

- 用户可从小程序进入 General Inquiry。
- 用户可查看 FAQ。
- 用户可输入文字。
- 用户可上传图片。
- 用户可提交咨询。
- 咨询默认进入 CCC。

### FR-002: Support Rich Media Communication

系统必须支持图文沟通。

Acceptance Criteria：

- 用户可发送文字。
- 用户可发送图片。
- 系统应预留视频、语音、文件扩展能力。
- CCC / RSE 可在后台查看用户发送内容。
- 消息记录可与 Case / Work Order 关联。

### FR-003: Device Association Optional

设备信息推荐提供，但不应作为提交咨询的强制前置条件。

Acceptance Criteria：

- 用户可选择已绑定设备。
- 用户可手动输入设备编号。
- 用户可跳过设备信息并提交问题。
- 系统可在后续会话中提示用户补充设备信息。

### FR-004: Case Detail Inquiry

系统必须支持用户在 Case 详情页发起或继续咨询。

Acceptance Criteria：

- 从 Case 详情页进入时，咨询自动关联当前 Case。
- 对话记录展示当前 Case 相关内容。
- 用户可补充文字和图片。
- 后台可识别该消息属于具体 Case。

### FR-005: Smart Prompt Cards

General Inquiry 页面应支持上下文智能提示卡片。

Acceptance Criteria：

- 当用户有进行中 Case 时，显示 Case 相关提示。
- 当 RSE 有新消息时，显示消息提醒。
- 当用户可能需要报修帮助时，显示报修相关提示。
- 提示卡片应提供明确行动入口。

### FR-006: FAQ Display

系统必须支持 FAQ 展示。

Acceptance Criteria：

- FAQ 支持后台或配置文件维护。
- FAQ 可按 priority 排序。
- FAQ 可按 category 分组。
- FAQ 可被 General Inquiry 页面展示。
- FAQ 可关联下一步操作。

### FR-007: Customer Response Center Routing

所有 General Inquiry 默认先进入 7x24 小时客户响应中心，由其负责接收、初步响应和分流。

Acceptance Criteria：

- 用户提交 General Inquiry 后，系统可在后台创建 inquiry record。
- 客户响应中心可查看 inquiry 内容和附件。
- 客户响应中心可直接使用标准话术回复。
- 当问题需要工程师介入且有 available 的远程服务工程师时，客户响应中心可将咨询分配给该工程师。
- 当没有 available 的远程服务工程师时，客户响应中心继续承接咨询并回复，不向用户承诺远程服务工程师实时响应。
- 用户侧不展示内部转派路径。
- 用户侧可区分当前消息来自客户响应中心还是远程服务工程师。

### FR-008: RSE Conversation Trigger

当问题需要工程师介入、存在 available 的远程服务工程师且客户响应中心完成分配后，小程序应能展示远程服务工程师沟通入口。

Acceptance Criteria：

- 客户响应中心完成 RSE 分配后，前端可显示或更新聊天入口。
- 前端明确显示远程服务工程师已加入对话，但不显示背后的分配路径。
- 没有 available 的 RSE 时，前端继续由客户响应中心承接，不显示虚假的工程师在线状态。
- 新消息有红点或消息提示。
- 用户可进入对应对话。
- RSE 可在 D365 回复。

### FR-008A: Engineer-initiated Conversation from Work Order

远程服务工程师必须能够基于 Work Order 主动向用户发起图文对话。

Acceptance Criteria：

- RSE 可从一个明确的 Work Order 发起对话。
- 系统可找到该 Work Order 所属 Case 和有权接收消息的用户。
- 工程师消息在用户侧归入该 Case 的会话上下文。
- 用户不需要查看或选择 Work Order。
- 后台保留 origin_work_order_id、case_id、sender_id 和 conversation_id。
- 用户回复能够回到与原 Work Order 相关的工程师工作上下文。

### FR-008B: Case-level User Contact Entry

用户必须通过 Case 级入口联系 Philips，不应要求用户在一个 Case 下选择具体 Work Order。

Acceptance Criteria：

- Case Detail 提供清晰的“联系 Philips / 继续沟通”入口。
- 一个 Case 下存在多个 Work Order 时，用户仍从同一个 Case 入口进入。
- 系统负责把用户消息路由至正确的客户响应中心或相关工程师上下文。
- 前台不展示内部 Work Order 选择器。
- 后台保留 Case 到多个 Work Order 的映射关系。

### FR-008C: Engineer Message Discovery and Notification

工程师主动发出的消息必须在用户侧清晰可发现。

Acceptance Criteria：

- 未读工程师消息在消息中心显示。
- Self Service / General Inquiry 首页可显示“远程服务工程师发来消息”的智能提示。
- 对应 Case 在 Case 列表或详情入口显示未读标识。
- 点击任一提醒均进入同一个对应 Case 会话。
- 用户读完消息后，未读状态在相关入口同步更新。
- 通知文案区分“客户响应中心回复”和“远程服务工程师消息”。

### FR-009: Conversation History

系统必须保存会话历史。

Acceptance Criteria：

- 用户可查看历史咨询记录。
- Case 相关对话应与 Case 关联。
- General Inquiry 历史与 Case 详情历史的展示规则需要明确。
- 聊天记录应支持长期归档。

### FR-010: Internal Workflow Hidden from User

用户侧不展示内部 Case 流转细节。

Acceptance Criteria：

- 用户看不到 CCC / RSE / FSE 复杂转派路径。
- 用户只看到可理解的状态和回复。
- 内部处理记录仅用于后台。

### FR-011: User Eligibility and Access Control

用户咨询功能必须同时对认证用户和授权用户开放。

Acceptance Criteria：

- 认证用户可进入咨询入口并发起图文咨询。
- 授权用户可进入咨询入口并发起图文咨询。
- 两类用户仅可查看其权限范围内的设备、Case、工单和会话。
- 咨询功能的开放不应绕过现有数据权限控制。

---

## 10. Non-functional Requirements

### NFR-001: Stability of Entry

General Inquiry / Self Service 入口应保持长期稳定，避免后续功能升级导致入口频繁迁移。

### NFR-002: Scalability

功能架构应支持从 V1.0 人工咨询扩展到未来 AI Assistant 和智能 self service。

### NFR-003: Traceability

咨询、图片、回复、Case 关联和操作记录应可追溯。

### NFR-004: Data Privacy

用户上传的图片、视频、设备信息、Case 信息需要符合隐私、安全和合规要求。

### NFR-005: Usability

页面应参考主流电商和本地生活平台的智能客服体验，例如：

- 先展示常见问题
- 根据上下文推荐问题
- 支持用户直接输入
- 支持人工介入
- 支持消息提醒
- 支持订单/工单上下文跳转

注意：上述是 UX 参考方向，不代表直接复制任何第三方产品界面。

---

## 11. Conversation Data Model

```json
{
  "conversation_id": "string",
  "conversation_type": "general_inquiry | case_inquiry | rse_conversation",
  "user_id": "string",
  "case_id": "string | null",
  "work_order_id": "string | null",
  "related_work_order_ids": ["string"],
  "origin_work_order_id": "string | null",
  "user_context_anchor": "case",
  "device_id": "string | null",
  "source_entry": "general_inquiry | case_detail | message_center | smart_prompt",
  "status": "open | pending_customer | pending_internal | resolved | closed",
  "created_at": "datetime",
  "updated_at": "datetime",
  "participants": [
    {
      "participant_id": "string",
      "role": "customer | customer_response_center | rse | fse | sales | system"
    }
  ],
  "messages": [
    {
      "message_id": "string",
      "origin_work_order_id": "string | null",
      "sender_role": "customer | customer_response_center | rse | system",
      "message_type": "text | image | video | audio | file | system_card",
      "content": "string",
      "attachments": [
        {
          "attachment_id": "string",
          "file_type": "image | video | audio | file",
          "url": "string",
          "thumbnail_url": "string | null"
        }
      ],
      "created_at": "datetime",
      "read_status": "unread | read"
    }
  ]
}
```

---

## 12. Inquiry Entity Model

```json
{
  "inquiry_id": "string",
  "user_id": "string",
  "inquiry_type": "general | repair_related | order_related | commercial | maintenance | unknown",
  "title": "string",
  "description": "string",
  "device_id": "string | null",
  "case_id": "string | null",
  "work_order_id": "string | null",
  "assigned_team": "customer_response_center | rse | sales | service | other",
  "rse_required": "boolean",
  "rse_availability_at_routing": "available | unavailable | unknown",
  "priority": "low | normal | high | urgent",
  "status": "submitted | triaged | in_progress | waiting_for_user | resolved | closed",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## 13. Case / Work Order / Conversation Mapping Model

```json
{
  "case_id": "string",
  "work_orders": [
    {
      "work_order_id": "string",
      "assigned_engineer_id": "string | null",
      "status": "string",
      "can_initiate_conversation": "boolean"
    }
  ],
  "customer_conversation_id": "string",
  "customer_entry_anchor": "case",
  "routing_mode": "customer_response_center | work_order_engineer | mixed",
  "unread_engineer_message_count": "number"
}
```

规则：

- `customer_entry_anchor` 固定为 `case`。
- 用户侧不根据 `work_order_id` 创建多个难以理解的入口。
- 每条工程师消息仍保留 `origin_work_order_id`，用于后台追踪和回复路由。
- 同一 Case 下多个 Work Order 的信息可以聚合到一个 Case 会话，但不能丢失内部来源关系。

---

## 14. Smart Prompt Data Model

```json
{
  "prompt_id": "string",
  "prompt_type": "ongoing_case | rse_message | repair_intent | missing_info | faq_suggestion | system_notice",
  "user_id": "string",
  "case_id": "string | null",
  "device_id": "string | null",
  "title": "string",
  "description": "string",
  "priority": "number",
  "action": {
    "label": "string",
    "type": "navigate | open_conversation | start_repair | upload_attachment | view_faq",
    "target": "string"
  },
  "display_condition": "string",
  "status": "active | dismissed | expired",
  "created_at": "datetime",
  "expires_at": "datetime | null"
}
```

---

## 15. Conversation Display Rules

### 14.1 General Inquiry History

General Inquiry 可展示：

- 用户最近的通用咨询
- 尚未绑定 Case 的咨询
- 与 General Inquiry 发起相关的历史
- 系统推荐进入相关 Case 的入口

### 14.2 Case Detail History

Case Detail 只展示：

- 当前 Case 的相关对话
- 同一 Case 下由一个或多个 Work Order 触发的工程师消息，以 Case 会话聚合展示
- 当前 Case 的用户补充内容
- 当前 Case 的 RSE / CCC 回复
- 与当前 Case 关联的系统提示

### 14.3 Open Question

仍需确认：

- General Inquiry 是否展示所有历史会话全集
- Case Detail 是否只展示 Case-specific 会话
- 如果 General Inquiry 后续被 CCC 创建为 Case，如何在用户侧呈现关联关系

推荐方向：

- General Inquiry 页面展示“服务消息/历史咨询”的聚合列表
- Case Detail 页面只展示当前 Case 的上下文
- 聚合列表中可跳转至具体 Case 对话

---

## 16. State Machine

### 15.1 Inquiry Status

```text
submitted
  -> triaged
  -> in_progress
  -> waiting_for_user
  -> resolved
  -> closed
```

### 15.2 Conversation Status

```text
open
  -> pending_internal
  -> pending_customer
  -> resolved
  -> closed
```

### 15.3 Message Read Status

```text
unread
  -> read
```

---

## 17. Error & Edge Cases

### EC-001: 用户未绑定设备

系统允许提交咨询。

后续可提示用户补充设备编号或选择设备。

### EC-002: 用户上传图片失败

系统应提示重新上传，并保留已输入文本。

### EC-003: 用户从 General Inquiry 提交的问题后来生成 Case

系统应将 inquiry 与新 Case 建立关联。

用户侧应能从历史咨询跳转到 Case。

### EC-004: RSE 发来消息但用户未读

系统应显示红点或消息提醒。

### EC-005: FAQ 无法解决问题

FAQ 页面必须保留“继续咨询”入口。

### EC-006: 用户重复发起相同问题

系统可提示已有相关 Case 或历史咨询，但不应阻止用户继续提交。

### EC-007: 内部多团队处理

用户侧不展示内部团队流转，仅展示可理解的状态和回复。

### EC-008: 同一 Case 下多个 Work Order 均产生消息

系统在前台以 Case 会话聚合消息，避免用户选择 Work Order。

后台必须为每条工程师消息保留 origin_work_order_id，并确保用户回复可正确回到相关工程师工作上下文。

### EC-009: 工程师主动消息触达失败

系统应保留未读状态，并在用户下次进入 Self Service 首页、消息中心或对应 Case 时继续展示提醒。

---

## 18. Acceptance Criteria Summary

V1.0 可以认为完成，当满足以下条件：

- 用户可进入稳定的 General Inquiry / Self Service 入口
- 页面展示 FAQ 和智能提示区域
- 用户可发起图文咨询
- 用户可上传图片
- 用户可选择或跳过设备信息
- 咨询默认进入 7x24 小时客户响应中心
- 客户响应中心可直接回复，或仅在有 available 的远程服务工程师时完成工程师分配
- 前台可区分客户响应中心与远程服务工程师，但不展示内部转派路径
- 认证用户和授权用户均可使用咨询功能
- Case Detail 可发起 Case-specific 咨询
- RSE 可基于 Work Order 主动发起对话
- 工程师消息可通过消息中心、Self Service 智能提示和 Case 未读标识被用户发现
- 用户始终通过 Case 联系 Philips，不需要选择 Work Order
- 聊天记录可保存并关联 Case / Work Order，且每条工程师消息可追溯到来源 Work Order
- 用户侧不暴露内部 Case 流转过程
- 架构支持未来 AI Assistant 和更丰富 Self Service 能力扩展

---

## 19. Implementation Notes for AI Coding Agent

### 18.1 Recommended Frontend Modules

```text
/pages/self-service/index
/pages/inquiry/general
/pages/inquiry/conversation/[conversationId]
/pages/case/[caseId]/inquiry
/components/FaqList
/components/SmartPromptCard
/components/ConversationThread
/components/MessageComposer
/components/AttachmentUploader
/components/DeviceSelector
/components/UnreadBadge
```

### 18.2 Recommended Backend APIs

```text
GET    /api/self-service/context
GET    /api/faqs
GET    /api/smart-prompts
POST   /api/inquiries
GET    /api/conversations
GET    /api/conversations/{conversationId}
POST   /api/conversations/{conversationId}/messages
POST   /api/attachments
GET    /api/cases/{caseId}/conversation
POST   /api/cases/{caseId}/messages
POST   /api/work-orders/{workOrderId}/conversations
GET    /api/cases/{caseId}/work-order-mapping
PATCH  /api/messages/{messageId}/read
```

### 18.3 Suggested Service Layer

```text
FaqService
SmartPromptService
InquiryService
ConversationService
AttachmentService
CaseLinkingService
NotificationService
D365SyncService
```

### 18.4 Suggested Event Names

```text
INQUIRY_SUBMITTED
MESSAGE_SENT
MESSAGE_RECEIVED
RSE_ASSIGNED
RSE_CONVERSATION_INITIATED
WORK_ORDER_MESSAGE_RECEIVED
CASE_LINKED
ATTACHMENT_UPLOADED
FAQ_CLICKED
SMART_PROMPT_CLICKED
CONVERSATION_READ
```

---

## 20. Design References

The experience can borrow interaction patterns from mainstream intelligent customer service systems, such as e-commerce and local delivery platforms:

- contextual service cards
- order/case-aware assistant prompts
- FAQ before human support
- image-based issue explanation
- quick action buttons
- unread message badges
- escalation to human service

The goal is not to copy visual design, but to adopt the interaction logic of “context-aware self-service + chat-based human support”.

---

## 21. Open Questions

1. General Inquiry 与 Case-specific conversation 的历史展示边界如何定义？
2. 哪些 FAQ 必须在 V1.0 上线？需要 Judy / CCC Team 提供优先级。
3. FSE 是否需要查看完整图文沟通记录？
4. 图片、视频、音频、文件分别在哪个阶段支持？
5. 消息通知优先通过小程序消息中心、服务号消息还是短信？
6. General Inquiry 未来升级为完整 Self Service 首页时，当前页面结构如何平滑演进？
7. 远程服务工程师的 available 状态由哪个系统提供，更新频率和分配规则是什么？
8. 前台应如何呈现“客户响应中心处理中”和“远程服务工程师已加入”两种服务状态？
9. 同一 Case 下多个 Work Order 的工程师同时发消息时，前台是否需要展示工程师姓名或服务任务标签？
10. 用户从 Case 会话回复时，后台如何确定回复到最近消息对应的 Work Order，还是由客户响应中心再次分流？
11. 工程师主动消息的外部通知渠道和优先级规则是什么？

---

## 22. Explicit Non-goals

本功能不是：

- 微信服务号迁移页
- 简单留言表单
- 纯 FAQ 页面
- 独立客服系统
- 独立电商客服复制品
- 完整 AI Agent 系统

本功能是：

- WeConnect Self Service 能力的第一阶段入口
- 客户在线咨询和图文沟通的基础能力
- 后续 AI、自助服务、远程诊断、消息中心的体验容器
