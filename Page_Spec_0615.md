# WeConnect Phase II — Page Specification

> 版本：0615 | 基于代码状态 tag PhaseII_0610

---

## 目录

1. [全局框架 & 导航](#1-全局框架--导航)
2. [设备管理页（授权用户）](#2-设备管理页授权用户)
3. [我的设备页（认证用户）](#3-我的设备页认证用户)
4. [设备详情页](#4-设备详情页)
   - 4.1 总览 Tab
   - 4.2 合同 Tab（授权用户专属）
   - 4.3 报修 Tab
   - 4.4 保养 Tab
   - 4.5 工单 Tab
5. [报修管理页 / 我的报修页](#5-报修管理页--我的报修页)
6. [极速报修表单](#6-极速报修表单)
7. [工单列表页](#7-工单列表页)
8. [工单详情页](#8-工单详情页)
9. [消息通知页](#9-消息通知页)
10. [消息详情页](#10-消息详情页)
11. [我的页面](#11-我的页面)
12. [扫码页面](#12-扫码页面)
13. [手动输入设备页](#13-手动输入设备页)
14. [备件原厂验证](#14-备件原厂验证)
15. [工程师资质查询](#15-工程师资质查询)
16. [服务评价页](#16-服务评价页)
17. [报修详情页](#17-报修详情页)
18. [隐私政策页](#18-隐私政策页)

---

## 1. 全局框架 & 导航

### 1.1 应用框架

整体呈现为手机框（375px 宽）居中展示，背景为浅灰色台面。手机框顶部有 **RoleSwitcher** 组件用于 Demo 切换角色。

### 1.2 SharedBottomBar — 底部导航栏

四个 Tab，两种角色均使用同一组件，内容随角色变化：

| Tab key | 图标 | 授权用户（admin）| 认证用户（user）|
|---------|------|----------------|----------------|
| `devices` | Compass | 设备管理页 | 我的设备页 |
| `repair` | ClipboardPerson | 报修管理（全院视图）| 我的报修 |
| `orders` | ClipboardList | 工单列表 | 工单列表 |
| `profile` | PersonPortraitCircle | 我的 | 我的 |

**工单 Tab** 显示 `pending-sign` 状态工单数量角标（红色数字徽标）。  
**profile Tab** 显示未读消息数量角标。

切换 Tab 时导航栈重置为 `[{ type: 'tab-content' }]`，ProfileSubPage 状态也清除。

### 1.3 NavState 导航栈

以下页面以全屏覆盖方式显示（**无底部导航栏**）：

| NavState 类型 | 触发入口 | 携带参数 |
|--------------|---------|---------|
| `device-detail` | 点击任意设备卡片 | `device`, `initialTab?` |
| `repair-form` | 设备详情"极速报修"按钮 | `device` |
| `spare-parts-auth` | 我的页"备件原厂验证" | — |
| `engineer-verify` | 我的页"工程师资质查询" | — |
| `engineer-chat` | 工程师验证结果页"联系工程师" | — |
| `scan-camera` | 扫码按钮（多处触发）| — |
| `scan-device-input` | 我的页"输入编号" | `confirmDevice?` |
| `repair-detail` | 报修卡片点击 | `repairId` |
| `work-order-detail` | 工单卡片点击 | `orderId` |
| `service-eval` | 报修完成后评价入口 | `repairId` |
| `privacy-policy` | 我的页隐私政策 | — |

### 1.4 ProfileSubPage 子页状态

Profile Tab 内部管理两级子页：
- `null`：显示我的主页面
- `'messages'`：显示消息通知列表
- `{ type: 'message-detail', messageId, backTarget }`：显示消息详情，返回目标为 `'profile'` 或 `'messages'`

---

## 2. 设备管理页（授权用户）

**组件**：`DeviceListPage`  
**入口**：`devices` Tab，role = admin

### 2.1 顶栏（蓝色背景）

#### 标题行
- 左：大标题"设备管理"
- 右：胶囊按钮"扫码报修/绑定"（扫码图标 + 文字，白底蓝字，高度 32px，圆角 16px）
  - 点击 → 进入 `scan-camera` 页

#### 院区选择器行
- **多院区**（`hasMultipleCampuses === true`）：显示下拉按钮，展示当前选中院区或"全部院区"，含 ▾ 箭头
  - 点击展开 Dropdown：选项含"全部院区" + 各院区名（3个院区按中文拼音序排列）
  - 选中后关闭 Dropdown，`activeCampus` 更新
  - 背景遮罩（`campusBackdrop`）点击可关闭 Dropdown
- **单院区**：静态文字展示院区名，无交互

#### 统计卡片横向滚动行
5个统计卡片，横向可滚动（超出时），当前激活项有蓝色高亮样式：

| Key | 标签 | 计算逻辑 |
|-----|------|---------|
| `all` | 全部设备 | 院区过滤后总台数 |
| `contract-risk` | 合同风险 | `contractEnd ≤ 120天` 或 `acceptancePending === true` |
| `pm-risk` | 保养风险 | 非超声 + 无有效合同 + 无 `pmNextDate` |
| `in-repair` | 报修中 | status = `under-repair` 或 `pending-repair` |
| `pm-plan` | 保养计划 | 本月有计划保养（`pmNextDate` 在当月）|

点击卡片 → 切换 `activeFilter`（持久化到 localStorage）

### 2.2 搜索 + 设备类型筛选行（同一行）

```
[ Search 140px ] [ CT | 磁共振 | 血管机 | 超声 | 其他  >>>fade ]
```

- **搜索框**（左侧，固定宽 140px，不伸缩）
  - Filament `Search` 组件，`placeholder="搜索设备"`，`isFullWidth={false}`
  - `onInputChange` 更新 `searchValue`（本地 state，不持久化）
  - 全字段搜索：设备名、自定义名、设备类型、影像模态、科室、位置、院区、序列号、EQ号

- **设备类型 Chips**（右侧，flex:1，可水平滚动）
  - 选项：CT / 磁共振 / 血管机 / 超声 / 其他（默认"全部"不显示 chip，不选时全显）
  - 实现方式：5个 chip，`activeModality` 控制哪个被激活（`data-active="true"`）
  - 选中后更新 `activeModality`（持久化到 localStorage）
  - **右侧渐隐遮罩**：`maskImage: linear-gradient(to right, #000 calc(100% - 22px), transparent)` 提示可滚动
  - **自动居中滚动**：组件挂载时若有选中 chip（非 `all`），通过 `useEffect` + `chipScrollRef` 将其滚动到容器中央

### 2.3 设备列表区域

#### 标题行
```
[ 共 N 台 ]  [ 按设备名称排序 ▾ ]
```

- 左：当前可见总台数（`devicesTotal`，为过滤后全部结果总数，不受分页影响）
- 右：排序按钮 "按{label}排序"（蓝字，无背景，12px）
  - 点击展开排序下拉菜单（`sortOpen` 控制）
  - 选项：按设备名称 / 按装机日期 / 按录入时间（持久化到 localStorage）
  - 背景遮罩点击可关闭

#### 保养计划特殊视图（`activeFilter === 'pm-plan'` 时）

标题行上方额外显示年份 + 月份导航：
- 年份：`◂ 2026 ▸` 左右切换
- 月份：12个月份横向滚动选择器
- 列表展示该月有保养计划的设备，强制按保养日期升序排列（忽略 `sortBy` 设置）

#### 设备卡片列表

每张 `DeviceCard` 展示：
- 左色块：设备影像模态图标（按 `type` 字段推断：磁共振/CT/血管机/超声/其他）
- 设备名称（若有自定义名则显示自定义名，原名显示为灰色副标题）
- 状态 Tag（见"Tag 计算规则"）
- 元数据两行：科室·位置；院区名（`showHospital` 为 true 时显示）

**`showHospital` 条件**：`hasMultipleCampuses && activeCampus === 'all'`

**Tag 计算规则**（`computeDeviceTags`）：

| 条件 | Tag | Signal |
|------|-----|--------|
| `pm-plan` 筛选激活 | `计划保养·M月D日` | information |
| `acceptancePending === true` | `设备待验收` | warning |
| 分布式/装机<6个月 | `合同未知` | 无 |
| `businessContract === 'none'` 或合同已到期 | `无保` | error |
| 合同 ≤120天到期 | `即将出保` | warning |
| `in-repair` | `报修中` | information |
| `pm-risk` 成立 | `保养风险` | caution |
| `pm-plan`（本月保养）成立 | `本月保养·M月D日` | information |

#### 分页加载

- 默认每次显示 6 条（`useLoadMore` hook，batch=6）
- 列表底部显示"加载更多"按钮（`hasMore` 为 true 时）
- 筛选条件变化时自动重置到第一页

### 2.4 空态

筛选结果为空时显示"没有匹配的设备"提示（或空列表）。

---

## 3. 我的设备页（认证用户）

**组件**：`UserDevicePage`  
**入口**：`devices` Tab，role = user

与"设备管理页"整体结构相同，以下列出差异点：

### 差异一：标题

页面标题为"我的设备"（非"设备管理"）。

### 差异二：统计卡片

4个卡片（无"合同风险"项）：

| Key | 标签 | 计算逻辑 |
|-----|------|---------|
| `all` | 全部设备 | 院区过滤后总台数 |
| `pm-risk` | 保养风险 | 非超声 + 无有效合同 + 无 `pmNextDate` |
| `in-repair` | 报修中 | status = under-repair / pending-repair |
| `pm-plan` | 本月保养 | `pmNextDate` 在30天内 |

> 注：认证用户的"本月保养"判断用 `daysFromToday <= 30`，而非管理员版的"当月内"，实现略有差异。

### 差异三：设备类型 Chips

无"保养计划"年份/月份扩展视图，筛选逻辑较简单（`matchesUserFilter`）。

### 差异四：设备 Tag 计算

认证用户 Tag 仅显示：报修中 / 保养风险 / 本月保养·日期，不显示合同风险类 Tag。

### 差异五：状态持久化

使用独立的 `useUserDeviceFilterStore`（localStorage key: `user-device-filter`），与授权用户的 store 互相隔离。

---

## 4. 设备详情页

**组件**：`DeviceDetailPage`  
**入口**：点击任意设备卡片；`initialTab` 参数可指定打开时激活的 Tab

### 页面结构

```
┌─────────────────────────────┐
│ ← 设备详情           [极速报修] │  MiniProgramNav + 操作按钮
├─────────────────────────────┤
│ 设备名称（大）               │
│ 原型号（若有自定义名时显示）   │
├─────────────────────────────┤
│ [总览][合同][报修][保养][工单]│  Tab 导航（合同仅 admin 可见）
├─────────────────────────────┤
│ Tab 内容区域                │
└─────────────────────────────┘
```

**Tab 列表**（`admin` 时5个，`user` 时4个）：

| key | 标签 | 可见角色 |
|-----|------|--------|
| `info` | 总览 | 两者 |
| `contract` | 合同 | admin 专属 |
| `repair` | 报修 | 两者 |
| `pm` | 保养 | 两者 |
| `workorder` | 工单 | 两者 |

**极速报修按钮**：点击 → push `repair-form` NavState（携带当前 device）

---

### 4.1 总览 Tab（DeviceDetailInfoTab）

#### 状态提示卡片区

根据设备状态动态生成，每种状态对应一张彩色卡片，可点击卡片跳转到对应子 Tab：

| 条件 | badge | 卡片色 | 跳转 Tab |
|------|-------|-------|---------|
| admin + `acceptancePending` | 待验收 | 橙 | contract |
| 报修中 | 报修中 | 蓝 | repair |
| admin + 合同 warning | 即将出保 | 橙 | contract |
| admin + 合同 expired/none（非分布式）| 无保 | 红 | contract |
| `pmRiskLevel === 'high'` | 保养风险 | 黄 | pm |
| `showPmSoon === true` | 本月保养 | 蓝 | pm |

多个状态同时成立时全部显示（纵向排列）。设备状态良好时不显示任何卡片。

#### 基本信息区

| 字段 | 可编辑 | 说明 |
|------|-------|------|
| 设备名称 | 是（自定义名）| 编辑保存到 `useDeviceCustomNamesStore` |
| 设备类型 | 否 | 如"磁共振成像系统" |
| 序列号 | 否 | |
| EQ号 | 否 | 若有则显示 |
| 科室 | 是 | 编辑保存到 `useDeviceLocationsStore` |
| 位置 | 是 | 同上 |
| 医院/院区 | 否 | |
| 装机日期 | 否 | 仅 `canShowInstallDate === true` 时显示 |

编辑操作：点击字段右侧编辑图标 → 展开内联输入框 → 确认/取消。

---

### 4.2 合同 Tab（DeviceDetailContractTab）— admin 专属

#### 合同状态卡片（单一信息源）

根据以下优先级依次判断，显示唯一一张状态卡：

| 优先级 | 条件 | 卡片类型 | badge | 内容要点 |
|--------|------|---------|-------|---------|
| 1 | `acceptancePending === true` | 橙色警告 | 待验收 | "设备当前无保障，完成验收后质保自动开始" |
| 2 | 装机 < 6个月（非待验收）| 灰色中性 | 合同未知 | "合同信息录入中，预计{装机+6月}起可查" |
| 3 | `contractStatus === 'none'`（无 contractEnd）| 灰色中性 | 合同未知 | "暂无合同信息" |
| 4 | `contractStatus === 'expired'` | 红色危险 | 无保 | "合同已到期" + **续保咨询**按钮 |
| 5 | `contractStatus === 'warning'`（≤120天）| 橙色警告 | 即将出保 | "合同将在N天后到期" + **续保咨询**按钮 |
| 6 | `contractStatus === 'good'`（>120天）| 绿色正常 | 在保中 | 合同到期日期 |

**续保咨询**：点击 → 弹出 `BizConsultSheet`（业务咨询底部弹窗），记录咨询状态（`localStorage` 保存，下一个工作日凌晨失效）。咨询后按钮变为"再次咨询"。

#### 合同历程列表（`showHistory === true` 时显示）

倒序展示 `contractHistory` 数组：

| 每条信息 | 说明 |
|---------|------|
| 合同类型 | 质保合同 / 延保合同 / 维保合同 |
| 日期范围 | startDate ~ endDate |
| 状态徽标 | 生效中 / 已过期 / 待生效 |

**分布式设备（`isDistributedDevice === true` + 超声/影像工作站）**：
- 只显示 `type === 'csa'` 的合同记录（过滤掉质保合同）
- 顶部显示"部分合同记录暂未同步"提示

---

### 4.3 报修 Tab（DeviceDetailRepairTab）

#### 时间范围筛选 Chips
```
[ 近3个月 ]  [ 近6个月 ]  [ 近一年 ]
```
默认选中"近3个月"，切换时重置加载数量到5条。

#### 数据范围提示
- admin："完整历史请联系飞利浦销售团队"
- user："仅显示本账号相关记录，完整历史请联系飞利浦销售团队"

#### 报修记录列表

每条记录显示：
- 报修号、状态徽标（服务中/待签字/已取消）
- 报修时间、完成时间（若已结束）
- 故障描述、完成情况摘要

点击 → navigate 到 `repair-detail` 页

默认显示5条，"加载更多"按钮分批加载。

---

### 4.4 保养 Tab（DeviceDetailPmTab）

#### 超声设备特殊提示
若 `isUltrasound === true`，顶部显示"超声设备保养数据完善中"灰色提示卡。

#### 保养状态卡片

| 条件 | 卡片类型 |
|------|---------|
| `pmRiskLevel === 'high'` | 黄色风险卡："设备已N天未保养" + **保养咨询**按钮 |
| `pmRiskLevel === 'ok'` + `showPmSoon === true` | 蓝色信息卡："计划于M月D日进行保养" |

**保养咨询**：点击 → 弹出 `BizConsultSheet`（同合同Tab，key 不同：`pmConsult_${deviceId}`）

#### 保养状态信息行

| 字段 | 说明 |
|------|------|
| 上次保养 | `pmLastDate` 格式化 |
| 下次计划保养 | `pmNextDate` 格式化 |

#### 保养工单历程

时间范围筛选：近3个月 / 近6个月 / 近一年（默认3个月）  
列表每条显示工单号、状态（颜色编码）、日期  
分批加载（每批5条）  
有工单导航权限（在 `workOrderData` 中存在的 id）→ 可点击跳转工单详情

---

### 4.5 工单 Tab（DeviceDetailWorkOrderTab）

展示该设备的全部关联工单，数据来源：
1. 报修记录中的 `linkedWorkOrders`
2. `device.pmWorkOrders`（保养工单）
3. `device.deviceWorkOrders`（安装/FCO等工单）

每条工单展示：工单类型 Tag、工单号、日期、状态；点击可进入工单详情页。

---

## 5. 报修管理页 / 我的报修页

**组件**：`SuperUserServicePage`  
**入口**：
- `repair` Tab，admin → 标题"报修管理"，副标题"全院视图"
- `repair` Tab，user → 标题"我的报修"（或无副标题）

### 5.1 顶部搜索 + 筛选区

```
[ 搜索框 ] [ 筛选 ▾ N ]
```

**搜索**（Filament Search）：匹配 `deviceName` 和 `hospital` 字段

**筛选面板**（点击"筛选"按钮展开，底部弹出式面板）：

| 维度 | 选项 |
|------|------|
| 状态 | 全部 / 已报修 / 服务中 / 已完成 / 已取消 |
| 时间范围 | 不限 / 近3月 / 近6月 / 近1年 |
| 来源渠道 | 全渠道 / 小程序 / 电话 / 服务号 |

**筛选计数 badge**：激活的非"全部"筛选项数量显示在"筛选"按钮上（最大3）。

### 5.2 报修记录列表

- 当有筛选/搜索时：展示为单个分组"筛选结果（N条）"
- 无筛选时：按月份分组（如"2026年5月"）展示
- 分批加载（每批10条），底部"加载更多"按钮

每条 **RepairCard** 展示：
- 状态徽标（服务中/已报修/已完成/已取消）
- 设备名称 + 医院名
- 故障描述摘要
- 报修时间
- 来源渠道图标（小程序/电话/服务号）
- 点击 → navigate 到 `repair-detail` 页

---

## 6. 极速报修表单

**组件**：`RepairFormPage`  
**入口**：设备详情页"极速报修"按钮

### 布局

```
← 极速报修

[ 设备名称 ]
[ 科室 · 位置 · EQ号 ]   ← 设备信息横幅

故障紧急程度
[ 停机急修 ] [ 影响使用 ] [ 轻微异常 ]

故障描述
[ textarea placeholder: 请描述故障现象... ]

联系信息
  联系人   [ 输入框 ]
  联系电话  [ 输入框 ]

[ 提交报修 ]
```

### 交互规则

- 4个字段全部填写后"提交报修"按钮可用（`canSubmit`）
- 点击提交 → `isSubmitting = true`，800ms 后调用 `onSubmitSuccess()` 返回上一页
- 提交期间按钮 loading 状态

---

## 7. 工单列表页

**组件**：`WorkOrderListPage`  
**入口**：`orders` Tab（两种角色共用）

### 7.1 顶部

- 标题"工单列表"
- Filament Search 搜索框（匹配 `deviceName`）

### 7.2 工单 Tab 角标

底部导航 orders Tab 上显示 `pending-sign` 状态工单总数（角标）。

### 7.3 工单卡片

每张 WorkOrderCard 展示：

| 字段 | 说明 |
|------|------|
| 工单类型 Tag | 维修（error）/ 保养（success）/ FCO（caution）/ 安装（warning）|
| 设备名称 | |
| 医院名称 | |
| 工单编号 | |
| 请求时间 | |
| 状态操作区 | 见下表 |

| 工单状态 | 底部操作区（admin）| 底部操作区（user）|
|---------|-----------------|-----------------|
| `pending-sign` | "查看详情 ›" 按钮 | 蓝色"去签字"按钮 |
| `in-progress` | "›" 箭头 | "›" 箭头 |
| `completed` | "›" 箭头 | "›" 箭头 |
| `expired` | "请求已失效" Tag | "请求已失效" Tag |

点击进入 `work-order-detail` 页。

---

## 8. 工单详情页

**组件**：`WorkOrderDetailPage`  
**入口**：工单卡片点击

展示单个工单的完整信息：
- 工单基本信息（编号、类型、设备、医院、科室、创建时间）
- 工单状态时间轴（关键节点）
- 签字确认操作（`pending-sign` 状态时显示确认按钮）

---

## 9. 消息通知页

**组件**：`MessagesPage`  
**入口**：profile Tab → 消息入口（含未读数角标）

### 9.1 视图模式切换

顶部切换按钮：**风险摘要** / **消息列表**

### 9.2 风险摘要视图（DigestView）

按优先级分区展示设备风险汇总（授权用户专用内容）：

| 分区 | 消息类型 | 样式 |
|------|---------|------|
| 已出保 | `contract-expired` | 红色危险 |
| 保养风险 | `pm-risk` | 橙色警告 |
| 即将出保 | `contract-expiry` | 橙色警告 |
| 待验收 | `acceptance` | 橙色警告 |
| 本月保养计划 | `pm-plan` | 蓝色信息 |
| 账号通知 | `permission-upgrade` | 灰色中性 |

每个分区展示受影响设备列表（若为聚合消息则展开 `devices` 数组），点击设备 → navigate 到对应 `device-detail`。

若无任何风险 → 显示"目前没有需要关注的风险"空态。

### 9.3 消息列表视图（CompactCard）

#### 顶部筛选行

```
[ 全部 | 未读 | 已读 ]    [ 合同提醒 | 验收提醒 | ... ▾ ]
```

**已读/未读筛选**：`ReadFilter` = all / unread / read  
**类型筛选**：`TypeFilter`，以下类型仅 admin 可见（`adminOnly: true`）：合同提醒 / 验收提醒 / 保养计划

#### 消息列表

按日期分为"本月"和"更早"两组，分批加载（每批10条）。

每条 CompactCard 展示：
- 类型 badge（颜色编码）+ 未读红点 + 时间（MM/DD）
- 消息标题（未读时加粗）
- 消息摘要（body 字段）

#### 编辑模式

顶部"编辑"按钮 → 进入编辑模式，卡片左侧显示复选框 → 可批量操作（标记已读 / 删除）。

### 9.4 角色过滤

`forAdminOnly: true` 的消息仅 admin 可见（渲染前过滤）。

---

## 10. 消息详情页

**组件**：`MessageDetailPage`  
**入口**：点击消息卡片

展示完整消息内容，打开时自动将该消息标记为已读（`markAsRead`）。

- 显示消息标题、类型 badge、时间
- 显示完整消息正文（body）
- 若消息关联设备（`deviceId` 或 `devices`）：展示设备信息摘要，点击可跳转设备详情
- 若消息关联工单（`workOrderId`）：展示工单链接，点击跳转工单详情

---

## 11. 我的页面

**组件**：`ProfilePage`  
**入口**：`profile` Tab（直接内容，无导航栈包裹）

### 11.1 Hero 区（蓝色背景）

| 元素 | 说明 |
|------|------|
| 头像 | `Avatar`，展示用户名首字母（大写），透明白色背景 |
| 用户名 | 可点击（编辑图标）→ 弹出 `UsernameEditSheet` |
| 设备摘要（admin）| "关联 N 台设备 \| 覆盖 N 个院区"，可点击 |
| 账号权限行 | 锁图标 + "账号与权限" + 角色文字（授权用户/认证用户）+ 右侧说明（已授权N个院区 / 账号升级 ›）|

点击账号权限行 → 弹出 `AccountSheet`（账号与权限底部弹窗）。

### 11.2 快捷工具卡片

**2×1 图标网格**（认证用户和授权用户均显示）：
- 扫设备码（报修/绑定）→ `scan-camera`
- 输入编号（报修/绑定）→ `scan-device-input`

**列表型工具链接**：
- 备件原厂验证 → `spare-parts-auth`
- 工程师资质查询 → `engineer-verify`
- 飞利浦官方服务热线（静态信息）

### 11.3 消息通知区

- 显示最近3条消息的摘要卡片
- "查看全部 N 条 ›"链接 → `profileSubPage = 'messages'`
- 右上角"设置"图标 → 弹出 `SubscriptionSheet`

### 11.4 系统设置区

- 订阅与通知 → 弹出 `SubscriptionSheet`
- 隐私政策 → `privacy-policy` NavState

---

## 12. 扫码页面

**组件**：`ScanCameraPage`  
**入口**：多处"扫码"按钮

- 调用后置摄像头（`facingMode: 'environment'`）
- 展示取景框 + 扫描线动画
- 浏览器无法解码二维码（Demo UI 展示）
- 左上角返回按钮

---

## 13. 手动输入设备页

**组件**：`ScanDeviceInputPage`  
**入口**：我的页"输入编号"

- 输入序列号或 EQ 号查找设备
- 若 `confirmDevice` 参数存在（已扫码识别到设备），直接展示确认界面
- 查到设备后显示确认卡片，可进行"报修"或"绑定"操作

---

## 14. 备件原厂验证

**组件**：`SparePartsAuthPage`  
**入口**：我的页"备件原厂验证"

**两步流程**：
1. **引导页**：插画 + 说明文字（"扫描备件防伪码即可验证是否为飞利浦原厂备件"）+ "扫描防伪码"按钮 → 触发扫码
2. **结果页**（Demo 固定）：展示验证成功结果，包含备件名称、型号、原厂确认信息

---

## 15. 工程师资质查询

**组件**：`EngineerVerifyPage`  
**入口**：我的页"工程师资质查询"

**两步流程**：
1. **引导页**：插画 + 说明文字 + "扫描工程师二维码"按钮 → 触发扫码
2. **结果页**（Demo 固定）：展示工程师信息（姓名、工号、服务资质认证状态）+ "联系工程师"按钮 → `engineer-chat`

---

## 16. 服务评价页

**组件**：`ServiceEvaluationPage`  
**入口**：报修完成后的评价入口（AppShell 传递 `repairId`）

- 星级评分（1-5星）
- 文字评价输入
- 提交后返回上一页

---

## 17. 报修详情页

**组件**：`RepairDetailPage`  
**入口**：报修卡片点击（携带 `repairId`）

- 顶部：设备名称 + 报修状态 badge
- 报修基本信息：报修号、时间、紧急程度、故障描述
- 服务进度时间轴（`timeline`）：每个节点显示状态、时间、描述
- 已完成节点标为绿色，当前节点标为蓝色
- 若报修已完成：显示"服务评价"入口 → `service-eval`

---

## 18. 隐私政策页

**组件**：`PrivacyPolicyPage`  
**入口**：我的页"隐私政策"

静态文本页，展示飞利浦隐私政策内容，含返回导航。
