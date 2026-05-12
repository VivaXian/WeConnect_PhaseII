# WeConnect Phase II｜Design Intent for Vibe Designing

## 1. Product Context

WeConnect 是飞利浦医疗在线服务小程序。Phase I 已经完成核心报修能力，用户可以扫码报修、查看报修进展、查看工单、完成签字与评价。

Phase II 不是重做一个新产品，而是在 Phase I 的基础上继续扩展，尽量复用既有开发与用户心智。

Phase II 的主要新增方向：
- 引入 Super User 高权限角色
- 为普通用户补充设备列表能力
- 为 Super User 提供全院设备视角
- 在设备维度承载合同信息、报修情况、保养计划、风险提醒
- 补充消息中心，但消息中心不是核心任务入口

本设计只面向 WeConnect 小程序 customer-facing 端，不设计 D365 / 内部审批后台。由于小程序有它独特的开发要求，因此不要求样式完全严格使用Filament，样式尽可能贴近设计稿。

整体来说 WeConnect 的目标是提升设备线上报修率，鼓励用户通过小程序「极速报修」，弱化「电话」渠道。

---

## 2. Design Philosophy

### 2.1 Do not design from data fields first
不要因为 D365 有数据，就直接把字段堆进界面。

设计应围绕用户能否理解：
- 当前设备是什么状态
- 当前是否需要关注
- 下一步应该去哪里看更多信息或完成动作

### 2.2 Preserve Phase I value
Phase I 中最重要的价值不是单纯提交报修，而是：
- 用户可以看报修进展
- 用户可以跟踪设备服务状态
- 用户可以处理工单签字、评价、PDF 下载等动作

Phase II 不能削弱这些已有路径。

### 2.3 Device is the core object
Phase II 的复杂信息都应围绕“设备”组织：
- 合同信息属于设备
- PM / 保养计划属于设备
- 报修记录属于设备
- 风险提醒属于设备

不要设计独立的“合同中心”。

---

## 3. User Roles

Only two roles exist in product design:

### 3.1 普通用户
普通用户是 Phase I 的核心用户类型。

普通用户主要需要：
- 快速报修
- 查看自己的报修进展
- 查看与自己相关的工单
- 完成签字、评价、下载 PDF、发送邮箱等动作
- 查看自己相关的设备列表
- 查看自己相关的 PM 风险提醒

普通用户不具备合同信息权限。

普通用户不可见：
- 合同信息
- 合同到期提醒
- PM 月度计划总览
- 全院设备列表
- 全渠道报修历史

### 3.2 Super User
Super User 是 Phase II 引入的高权限客户角色。

Super User 主要需要：
- 清楚知道全院有哪些设备
- 知道哪些设备需要关注
- 查看每台设备的合同情况
- 查看每台设备的报修情况
- 查看每台设备的保养计划 / PM 状态
- 查看范围内工单，并快速筛选需要处理的工单

Super User 不是只看“自己的报修”，而是查看授权范围内的设备与服务信息。

---

## 4. Recommended Bottom Navigation

Use four bottom tabs for both roles:

1. 设备
2. 报修
3. 工单
4. 我的

Do not use:
- “首页”
- “服务进展”
- “待签工单”
- “合同”

Reason:
- “报修” is familiar from Phase I and maps to repair progress.
- “设备” becomes the core Phase II object view.
- “工单” is broader than pending signature.
- “我的” contains account, permissions, settings and message center.
- “合同” should not be a bottom tab because contract only makes sense under device and is visible only to Super User.

---

## 5. Tab Responsibilities

## 5.1 Tab 1｜设备

### Purpose
Device is the primary Phase II object container.

### 普通用户
Show:
- 我的设备（仅扫码或报修过的设备）
- 设备基础信息
- 本人相关报修记录
- 本人相关 PM 风险提醒

Do not show:
- 合同信息
- 合同到期提醒
- PM 月度计划
- 全渠道报修历史
- 「最近查看」分类（冗余，移除）
- 设备类型文字（磁共振成像系统、血管造影系统等型号文字不在卡片显示）

Device card status rules:
- 只展示异常状态 tag，正常设备不显示「正常运行」tag
- 支持用户自定义备注（自定义名称），备注在设备详情页录入，同步至设备列表卡片
- 有自定义备注时，卡片上以备注名为主，原设备名以小字弱化展示

### Super User
Show:
- 全院 / 授权范围内设备列表
- Quick filters:
  - 全部设备
  - 绑定设备
  - 本月保养
  - 风险设备
  - 报修中
- Device cards with one main status label
- Device detail with:
  - 基础信息
  - 合同信息
  - 报修情况
  - PM / 保养计划
  - 风险提醒
  - 历史服务记录

PM schedule must be strongly visible here. Do not hide PM schedule only inside message center.

- Device cards: only show abnormal state tags; 正常 devices show no extra tags
- Device cards: show specific PM date (「MM月DD日保养」) not just 「本月有PM」
- Device cards: no device type text in card (e.g. do not show 磁共振成像系统)

---

## 5.2 Tab 2｜报修

### Purpose
Continue Phase I’s key value:
- submit repair
- view repair progress
- track device service status

### 普通用户
Show:
- 扫码报修
- 输入设备号报修
- 与本人相关的报修记录
- 报修状态 such as 已报修 / 服务中 / 已完成 / 已取消
- 报修详情
- 设备详情入口

Do not show:
- 合同信息
- 全院摘要
- PM 月度计划

### Super User
Show:
- 报修入口
- 授权范围内的报修记录
- 状态筛选
- Optional lightweight summary, but do not turn this page into a heavy dashboard

Super User 报修页仍然以报修状态列表为主，不要堆满合同和 PM 详情。

Do not add:
- Statistics/summary panels with aggregated numbers on repair page (no correlation to individual repair records)
- Contract information

---

## 5.3 Tab 3｜工单

### Purpose
工单页 is for work orders and closure actions, not only pending signature.

### Why not “待签工单”
For Super User, 工单 includes full or broader range data. Only some work orders require signature. Therefore the tab should remain neutral as “工单”.

### 普通用户
Show:
- 本人相关工单
- 待签字
- 已签字
- 请求已失效
- 评价服务
- 下载 PDF
- 发送邮箱

### Super User
Show:
- 授权范围内工单
- Clear categorization and filtering
- Ability to quickly find:
  /- 待处理
  - 待签字
  - 已完成
  - 已失效
- 工单类型:
  - 维修
  - 保养
  - 安装
  - FCO

Super User 工单页 should help manage many records, not just show “待签”.

---

## 5.4 Tab 4｜我的

### Purpose
Account, permissions, settings, and message center.

### Show:
- 账户信息
- 权限状态说明
- Super User 授权范围说明 if applicable
- 常用设备 / 备注管理
- 消息中心入口

Because WeChat mini program has fixed top controls, do not rely on top bell as primary message center entry.

---

## 5.5 Global Scan FAB｜全局扫码入口

扫码报修和扫码绑定设备是全局功能，不限于某一 Tab。

实现方式：
- 悬浮按钮（FAB）固定于底部导航上方，两类角色均可见
- 点击展开操作菜单：
  - 「扫码报修」→ 报修流程
  - 「扫码绑定设备」→ 绑定设备流程
- 无论用户在哪个 Tab，FAB 始终可见

不要把扫码入口只放在报修 Tab 顶部（那样普通用户必须先切换 Tab 才能扫码）。

---

## 6. Message Center

### Placement
Message Center should be inside “我的”, not as a bottom tab and not primarily as a top bell.

### Role
Message Center is a weak reminder archive and review page, not a main task area.

### Message types
- 合同风险提醒（Super User only，到期前4个月/1个月/到期当天三次提醒）
- 设备待验收提醒（Super User only，新增"待验收"状态，每3个月提醒一次，验收前无保）
- PM 月度计划提醒（Super User only，每月初查询一次，多设备合并推送）
- PM 风险提醒（Both，多设备合并推送，每月初检查）
- 单次结果提醒（工单签字、评价等，即时推送）

### Aggregation Strategy (重要)
**多设备合并策略**：降低单次推送打扰率
- 合同风险提醒：多台设备同天到期 → 单条消息列表展示
- PM月度计划：该月所有PM计划 → 按医院/区域单条消息展示
- PM风险提醒：多台设备风险 → 按医院/区域单条消息展示
- 单次结果：原则上每次推送，但可考虑短时间窗口内同工单/同设备多次推送的合并

### Behavior
- Support read / unread
- Support batch delete if needed
- Clicking a message should navigate to the relevant device detail, work order detail, or reminder landing page

### Do not
- Do not make PM schedule only accessible from message center
- Do not put permission expiry reminder here unless explicitly required
- Do not use message center as the only access point for contract or PM information

---

## 7. Filtering Strategy

Reuse Phase I filtering logic where possible.

### 7.1 报修筛选
Use:
- 搜索：设备名称 / 医院
- 报修状态：
  - 已报修
  - 服务中
  - 已完成
  - 已取消
- 时间范围：
  - 近三个月
  - 近六个月
  - 近一年

For Super User, optionally add:
- 医院 / 院区
- 设备名称
- 服务状态

### 7.2 工单筛选
Use:
- 搜索：设备名称 / 医院
- 工单状态：
  - 待签字
  - 已签字
  - 请求已失效
  - 已完成
- 工单类型：
  - 维修
  - 保养
  - 安装
  - FCO
- 时间范围：
  - 近三个月
  - 近六个月
  - 近一年

For Super User, add:
- 医院 / 院区
- 是否需要处理
- 设备类型 if needed

### 7.3 设备筛选
普通用户:
- 搜索设备名称 / 医院 / 科室
- 最近设备
- 常用设备
- 有服务中记录
- 有风险提醒

Super User:
- 全部设备
- 即将到期
- 本月保养
- 风险设备
- 服务中
- 医院 / 院区 / 科室
- 合同状态
- PM 状态

### 7.4 消息中心筛选
Use:
- 全部 / 未读 / 已读
- 消息类型：
  - 合同提醒（`[SU]`）
  - 验收提醒（`[SU]`）
  - PM 计划（`[SU]`）
  - PM 风险
  - 服务提醒

---

## 8. Screen-Level Design Requirements

### 8.1 报修 tab
Design two role variants:
- 普通用户：Phase I-like, focused on repair entry and repair records
- Super User：same structure, broader data range and light summary, not a full dashboard

### 8.2 设备 tab
Design two role variants:
- 普通用户：my devices list
- Super User：full hospital device list with task filters

### 8.3 设备详情
Design two role variants:
- 普通用户：basic device information, personal repair records, related PM results / risks
- Super User：basic information + contract + repair history + PM schedule/status + risks

### 8.4 工单 tab
Design as work order management, not pending-signature-only.
Must support clear classification because Super User may see many records.

### 8.5 我的 tab
Include message center entry and permission status.

---

## 9. Global Copy and Terminology Rules

以下为全产品统一使用的文案规范，任何界面不得使用括号内的错误用词：

| 正确用词 | 避免用词 | 说明 |
|---------|---------|------|
| 在保 | 合同保障中、保修中、合同有效 | 合同正常有效时的状态 |
| 即将出保 | 即将脱保、合同即将到期 | 距到期 ≤ 4 个月时显示 |
| 已出保 | 脱保、合同已到期、无合同 | 合同已过期时显示 |
| 服务中 | 维修中 | 报修工单进行中的状态 |
| 服务完成 | 已完成维修 | 报修工单完结状态 |
| 保养工单 | 保养记录（作为可点击的工单列表标题时）| 与维修工单结构一致，均为工单对象 |
| 电话咨询 | 打电话、联系客服 | 设备详情页入口按钮 |
| 极速报修 | 快速报修、立刻报修 | 设备详情页主要动作按钮 |

---

## 10. Visual and UX Principles

- Mobile first
- Clean and lightweight
- Avoid dense dashboards
- Use cards, chips, status tags, and progressive disclosure
- One card should communicate one main problem
- Summary first, details later
- Do not overload first screen
- Keep both roles visually similar, but with different data scope
- **Only show abnormal states on cards** — do not display "正常运行" or "在保" as separate chips; positive/normal state is implied by the absence of alerts
- Use familiar Chinese terms:
  - 报修
  - 设备
  - 工单
  - 保养
  - 我的

Avoid unfamiliar terms for customer-facing labels:
- 服务进展
- Business Entitlement
- PM schedule
- Dashboard

Use customer-friendly translations:
- PM schedule → 本月保养 / 保养计划
- Business Entitlement → 合同信息 / 保障信息
- Service progress → 报修进展
- Work order → 工单

---

## 10. Do Not Design

Do not design:
- A separate homepage
- A contract bottom tab
- A heavy dashboard on first screen
- A top bell as the main message entry
- A D365 approval flow
- A Super User application workflow in mini program
- Contract information for ordinary users
- PM schedule only inside messages
- Work order tab named “待签工单”
- Two completely different navigation structures for two roles

---

## 11. Key Design Summary

Design WeConnect Phase II as an evolution of Phase I.

Use:
- 报修 for repair progress and service status
- 设备 for device-centered contract / PM / risk information
- 工单 for work order actions and classification
- 我的 for account, permissions, and message center

普通用户 should remain simple:
- repair
- own devices
- own work orders
- related PM result / risk

Super User should be device-centered:
- all authorized devices
- contract status
- repair status
- PM plan
- risk status

The product should feel consistent across roles, but data scope and information depth should differ.