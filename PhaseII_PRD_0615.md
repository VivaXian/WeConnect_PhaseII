# WeConnect Phase II — 产品需求文档（PRD）

> 版本：0615 | 日期：2026-06-15 | 阶段：Phase II Demo

---

## 目录

1. [产品背景与目标](#1-产品背景与目标)
2. [用户角色与场景](#2-用户角色与场景)
3. [功能模块全景](#3-功能模块全景)
4. [核心功能需求](#4-核心功能需求)
   - 4.1 设备列表与筛选
   - 4.2 设备详情
   - 4.3 合同管理
   - 4.4 保养管理
   - 4.5 报修服务
   - 4.6 工单管理
   - 4.7 消息通知
   - 4.8 账号与权限
5. [业务规则](#5-业务规则)
6. [数据模型](#6-数据模型)
7. [非功能需求](#7-非功能需求)
8. [已知范围限制（Demo 阶段）](#8-已知范围限制demo-阶段)

---

## 1. 产品背景与目标

### 1.1 背景

WeConnect 是飞利浦医疗针对医院客户提供的设备服务管理微信小程序。本文档覆盖 **Phase II** 版本，核心目标是为医院设备管理人员和医护操作人员提供数字化的设备全生命周期服务入口。

### 1.2 产品目标

| 目标 | 说明 |
|------|------|
| **透明化设备状态** | 实时掌握全院设备运行、合同、保养状态 |
| **降低沟通摩擦** | 通过小程序完成报修提交、工程师信息核验等自助操作 |
| **主动风险预警** | 提前推送合同到期、保养逾期等风险信息，助力设备管理员预防性管理 |
| **权限分层管理** | 认证用户（普通使用者）与授权用户（管理员）差异化功能，按需开放 |

### 1.3 Phase II 新增内容（相较 Phase I）

- 多院区支持：院区筛选、设备卡片院区标注
- 设备列表分页加载（Load More）
- 筛选状态持久化（返回列表页恢复筛选）
- 设备类型（影像模态）筛选
- 三种排序方式（名称 / 装机日期 / 录入时间）
- 认证用户页面与授权用户页面完全同步（搜索、排序、院区）
- 合同 Tab 逻辑修复（无合同日期时正确展示"合同未知"）
- 消息通知风险摘要视图（DigestView）

---

## 2. 用户角色与场景

### 2.1 角色定义

| 角色 | 代号 | 获取方式 | 说明 |
|------|------|---------|------|
| 认证用户 | `user` | 默认注册后 | 一线医护人员、设备操作人员 |
| 授权用户 | `admin` | 申请审核通过 | 医院设备科管理员、设备主任 |

### 2.2 认证用户核心使用场景

1. **查看我名下的设备**：浏览关联设备列表，了解设备运行状态和保养情况
2. **设备报修**：扫码或手动输入设备编号，填写故障信息快速提交报修
3. **跟踪报修进度**：在"我的报修"查看所有报修记录及当前服务进度
4. **工单签字**：收到通知后，对完成的维修工单进行确认签字
5. **备件/工程师核验**：扫码验证备件原厂身份、查询工程师资质

### 2.3 授权用户核心使用场景

1. **全院设备总览**：按院区、设备类型、状态筛选浏览全院设备
2. **合同风险管控**：监控即将到期和已到期合同，及时续保
3. **保养计划跟踪**：查看月度保养计划，推动按期保养
4. **报修管理**：掌握全院所有报修记录，按来源/状态/时间段分析
5. **消息风险预警**：通过摘要视图快速了解全院设备风险优先级
6. **账号权限管理**：审核认证用户升级申请，管理关联院区

### 2.4 角色升级流程

```
认证用户
  └─ "账号升级"入口（我的页面）
       ↓ 填写表单（关联医院、飞利浦销售姓名/电话）
  upgradeStatus: 'not-applied' → 'pending'
       ↓ 飞利浦后台审核
  通过 → role: 'admin'（upgradeStatus reset）
  拒绝 → upgradeStatus: 'cooldown'（30天冷却）
  冷却期结束 → upgradeStatus: 'not-applied'（可再次申请）
```

### 2.5 授权用户院区扩展流程

```
授权用户
  └─ "已授权院区"管理入口
       ↓ 选择目标院区 + 飞利浦销售信息
  campusStatus: 'not-applied' → 'pending'
       ↓ 飞利浦审核
  通过 → adminCampuses 增加新院区 + 系统消息通知
  拒绝 → campusStatus: 'cooldown'
```

---

## 3. 功能模块全景

```
WeConnect Phase II
├── 设备管理
│   ├── 设备列表（授权用户）        ← 筛选/搜索/排序/分页
│   ├── 我的设备（认证用户）        ← 同上，较少维度
│   └── 设备详情
│       ├── 总览 Tab               ← 状态摘要 + 基本信息编辑
│       ├── 合同 Tab（admin）       ← 合同状态 + 历程
│       ├── 报修 Tab               ← 报修历史
│       ├── 保养 Tab               ← 保养状态 + 工单
│       └── 工单 Tab               ← 所有关联工单
├── 报修服务
│   ├── 报修管理（授权用户）        ← 全院视图
│   ├── 我的报修（认证用户）        ← 个人视图
│   ├── 极速报修表单               ← 从设备发起
│   └── 报修详情 + 服务评价
├── 工单管理
│   ├── 工单列表                   ← 两种角色共用
│   └── 工单详情                   ← 签字确认
├── 消息通知
│   ├── 风险摘要视图（admin）       ← 按优先级分区
│   └── 消息列表视图               ← 筛选/编辑/已读
├── 工具服务
│   ├── 扫码（报修/绑定）
│   ├── 备件原厂验证
│   └── 工程师资质查询
└── 账号管理
    ├── 角色升级申请（user）
    ├── 院区扩展申请（admin）
    └── 消息订阅设置
```

---

## 4. 核心功能需求

### 4.1 设备列表与筛选

#### FR-01：院区选择

- 若系统中设备跨多个院区（campus），顶栏显示院区下拉选择器，含"全部院区"选项
- 若设备仅属于单一院区，静态显示该院区名称，无选择器
- 院区选项按中文拼音升序排列
- 当前选择的院区持久化保存（返回页面时恢复）

#### FR-02：统计卡片（状态筛选）

**授权用户**：5个卡片 — 全部设备 / 合同风险 / 保养风险 / 报修中 / 保养计划  
**认证用户**：4个卡片 — 全部设备 / 保养风险 / 报修中 / 本月保养

- 卡片数字实时反映当前院区过滤后的统计数值
- 点击卡片切换设备列表内容，激活卡片高亮
- 筛选状态持久化（localStorage）

#### FR-03：设备类型（影像模态）筛选

选项：CT / 磁共振 / 血管机 / 超声 / 其他

- 横向滚动 Chips，右侧渐隐遮罩提示可滚动
- 返回页面时，已选中的 Chip 自动滚动到可视区居中位置
- 筛选状态持久化（localStorage）

#### FR-04：关键词搜索

搜索范围（全字段匹配，不区分大小写）：
- 设备名称、自定义设备名
- 设备类型字符串、影像模态标签
- 科室、位置、院区
- 序列号、EQ号

搜索为本地 state，不持久化，返回页面后清空。

#### FR-05：排序

3种排序方式，通过列表标题行"按X排序"按钮切换：

| key | 显示标签 | 排序逻辑 |
|-----|---------|---------|
| `name-asc` | 设备名称（默认）| 汉字按拼音升序 `localeCompare('zh-Hans-CN')` |
| `install-date-desc` | 装机日期 | `installDate` 降序（最新优先）|
| `created-date-desc` | 录入时间 | `createdAt` 降序（最新优先）|

**特例**：激活"保养计划"筛选时，强制按 `pmNextDate` 升序排列（最近优先），忽略 `sortBy` 设置。  
排序方式持久化（localStorage）。

#### FR-06：保养计划月历视图（授权用户）

激活"保养计划"筛选时，标题行上方显示：
- 年份切换（`◂ YYYY ▸`）
- 12个月份横向选择器
- 列表显示选中年月内有保养计划的设备

#### FR-07：分页加载

- 授权用户设备列表：每批加载6条
- 认证用户设备列表：每批加载6条
- 报修记录列表：每批加载10条
- 筛选/排序变化时自动重置到第一页
- 总台数统计（列表标题行左侧）显示所有过滤结果总数，不受分页影响

#### FR-08：筛选状态持久化

以下状态通过 Zustand `persist` 中间件保存到 localStorage：
- `activeFilter`（状态筛选卡）
- `activeCampus`（院区）
- `activeModality`（设备类型）
- `sortBy`（排序方式）

两个页面使用独立 Store 键：`device-list-filter`（授权用户）、`user-device-filter`（认证用户）。

### 4.2 设备详情

#### FR-09：设备名称自定义

- 在总览 Tab 可编辑设备"自定义名称"
- 保存后在设备卡片和详情页标题处生效（原名作为副标题显示）
- 跨页面实时同步（通过 `useDeviceCustomNamesStore`）

#### FR-10：科室/位置编辑

- 在总览 Tab 可编辑设备所在科室和位置
- 保存后在设备卡片元数据处生效
- 跨页面实时同步（通过 `useDeviceLocationsStore`）

#### FR-11：合同 Tab 仅授权用户可见

合同详情对认证用户不可见；Tab 栏中不显示"合同"Tab（auth 用户设备详情为4个Tab）。

#### FR-12：分时间段查看报修/保养历史

报修 Tab 和保养 Tab 均提供时间范围筛选：近3个月 / 近6个月 / 近一年。

### 4.3 合同管理

#### FR-13：合同状态单一信息源

合同 Tab 顶部状态卡片是唯一的合同状态展示入口，优先级规则：

1. **待验收**：`acceptancePending === true`
2. **合同未知（录入中）**：装机 < 6个月（非待验收设备）
3. **合同未知（暂无记录）**：`contractEnd` 字段为空
4. **无保（已过期）**：`contractEnd` 距今 ≤ 0天
5. **即将出保**：`contractEnd` 距今 1~120天
6. **在保中**：`contractEnd` 距今 > 120天

#### FR-14：分布式渠道设备合同差异展示

满足以下条件的设备为"分布式设备"（`isDistributedDevice === true` 且设备类型为超声/影像工作站）：
- 合同 Tab 不显示质保合同（`type: 'warranty'`）历程
- 只显示 CSA 维保合同
- 顶部显示"部分合同记录暂未同步"说明

#### FR-15：续保咨询 CTA

当合同状态为"即将出保"或"无保"时，显示"续保咨询"按钮。点击后：
- 弹出业务咨询底部弹窗（`BizConsultSheet`）
- 本地记录咨询时间（localStorage），下一个工作日凌晨后失效
- 失效前按钮文字改为"再次咨询"

### 4.4 保养管理

#### FR-16：保养风险判断

非超声设备满足以下全部条件时为"高风险"：
- 无有效合同（`contractEnd` 为空或已过期）
- 无下次保养计划（`pmNextDate` 为空）

超声设备不参与保养风险判断（数据接入中）。

#### FR-17：保养咨询 CTA

当设备存在保养风险时，保养 Tab 显示"保养咨询"按钮，行为与续保咨询相同（localStorage 记录，独立 key）。

### 4.5 报修服务

#### FR-18：极速报修表单

必填字段：
1. 故障紧急程度（停机急修 / 影响使用 / 轻微异常）
2. 故障描述（文本）
3. 联系人姓名
4. 联系电话

全部填写后提交按钮可用，提交后模拟800ms延迟返回上一页。

#### FR-19：报修记录筛选（报修管理页）

| 筛选维度 | 选项 |
|---------|------|
| 状态 | 全部 / 已报修 / 服务中 / 已完成 / 已取消 |
| 时间范围 | 不限 / 近3月 / 近6月 / 近1年 |
| 来源渠道 | 全渠道 / 小程序 / 电话 / 服务号 |

同时激活的非"全部"筛选项数量在按钮上显示角标。

### 4.6 工单管理

#### FR-20：工单角标

底部导航"工单"Tab 显示当前 `pending-sign`（待签字）状态工单总数。

#### FR-21：角色差异化工单操作

| 工单状态 | 认证用户操作 | 授权用户操作 |
|---------|------------|------------|
| 待签字 | 蓝色"去签字"主按钮 | "查看详情 ›"次按钮 |
| 进行中/已完成 | 箭头跳转详情 | 箭头跳转详情 |
| 已失效 | 静态"请求已失效" | 静态"请求已失效" |

### 4.7 消息通知

#### FR-22：消息可见性过滤

`forAdminOnly: true` 的消息（合同相关、验收提醒、保养计划）仅授权用户可见，认证用户的消息列表中不展示。

#### FR-23：消息类型

| 类型 key | 标签 | 可见角色 |
|---------|------|---------|
| `contract-expiry` | 即将出保 | admin |
| `contract-expired` | 合同到期 | admin |
| `acceptance` | 待验收 | admin |
| `pm-plan` | 保养计划 | admin |
| `pm-risk` | 保养风险 | 两者 |
| `permission-upgrade` | 账号通知 | 两者 |
| `order-update` | 服务提醒 | 两者 |

#### FR-24：风险摘要视图（授权用户）

按优先级（已出保 > 保养风险 > 即将出保 > 待验收 > 本月保养 > 账号通知）分区展示，每区支持展开关联设备列表并跳转到设备详情。

#### FR-25：消息批量操作

进入编辑模式后支持批量标记已读、批量删除。

### 4.8 账号与权限

#### FR-26：角色升级申请

认证用户可填写表单申请升级为授权用户。表单字段：
- 关联医院名称（可多选）
- 飞利浦销售姓名
- 飞利浦销售联系电话

#### FR-27：院区扩展申请（授权用户）

已是授权用户可申请扩展关联院区，字段同升级申请。

---

## 5. 业务规则

### 5.1 合同天数计算

```
contractDays = today 到 contractEnd 的天数差（负数表示已过期）

contractStatus:
  contractEnd 为空 → 'none'
  contractDays > 120 → 'good'（在保中）
  0 < contractDays ≤ 120 → 'warning'（即将出保）
  contractDays ≤ 0 → 'expired'（已过期）
```

### 5.2 保养风险计算

```
isPmRisk(device):
  if device.type.includes('超声') → false（超声豁免）
  hasContract = contractEnd 存在 && contractDays > 0
  return !hasContract && !device.pmNextDate
```

### 5.3 报修中状态

```
isInRepair(device):
  device.status === 'under-repair' || device.status === 'pending-repair'
```

### 5.4 "本月保养"判断

- 授权用户版（设备列表统计卡、月历视图）：`pmNextDate` 在当前年月内
- 认证用户版：`pmNextDate` 距今30天以内

### 5.5 装机日期可见性

`canShowInstallDate: false` 的设备不在总览 Tab 展示装机日期字段。

### 5.6 设备影像模态推断

```
getModality(device.type):
  includes('磁共振') → '磁共振'
  includes('CT') || includes('PET') → 'CT'
  includes('血管') → '血管机'
  includes('超声') → '超声'
  其他 → null（归入"其他"分类）
```

### 5.7 院区排序

院区选项按 `localeCompare('zh-Hans-CN')` 拼音升序：  
WeConnect医院（北院）→ WeConnect医院（南院）→ WeConnect医院主院区

### 5.8 咨询状态有效期

业务咨询（续保/保养）通过 localStorage 记录提交时间，下一个工作日（跳过周末）凌晨0点失效。

---

## 6. 数据模型

### 6.1 Device（核心实体）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识 |
| `name` | string | 设备名称（原名）|
| `type` | string | 设备类型全称 |
| `department` | string | 科室（可被 store 覆盖）|
| `location` | string | 位置（可被 store 覆盖）|
| `status` | DeviceStatus | normal / under-repair / pending-repair / offline |
| `contract` | ContractType | platinum / gold / basic / none |
| `businessContract` | BusinessContract? | warranty / csa / pos / none |
| `contractStart` | string? | YYYY-MM-DD |
| `contractEnd` | string? | YYYY-MM-DD |
| `contractHistory` | ContractPeriod[]? | 合同历程（含 type、startDate、endDate）|
| `serialNumber` | string | 序列号 |
| `eqNumber` | string? | EQ 编号 |
| `customName` | string? | 数据层自定义名（可被 Store 覆盖）|
| `campus` | string? | 院区名称 |
| `pmLastDate` | string? | 上次保养日期 |
| `pmNextDate` | string? | 下次保养计划日期 |
| `installDate` | string? | 装机日期 |
| `createdAt` | string? | 系统录入时间（用于排序）|
| `acceptancePending` | boolean? | 是否待验收 |
| `isDistributedDevice` | boolean? | 是否为分销渠道设备 |
| `canShowInstallDate` | boolean? | 是否可展示装机日期 |
| `pmWorkOrders` | PmWorkOrderEntry[]? | 保养工单列表 |
| `deviceWorkOrders` | DeviceWorkOrderEntry[]? | 其他工单列表 |

### 6.2 State Stores（客户端状态）

| Store | 持久化 | localStorage key | 内容 |
|-------|--------|-----------------|------|
| `useDeviceListFilterStore` | 是 | `device-list-filter` | 授权用户设备列表筛选+排序 |
| `useUserDeviceFilterStore` | 是 | `user-device-filter` | 认证用户设备列表筛选+排序 |
| `useRoleStore` | 否 | — | 角色、升级状态、院区权限、用户名 |
| `useDeviceCustomNamesStore` | 否 | — | 自定义设备名（id → string）|
| `useDeviceLocationsStore` | 否 | — | 设备科室/位置覆盖 |
| `useMessageStore` | 否 | — | 消息列表及已读状态 |
| `useSubscriptionStore` | 否 | — | 消息订阅偏好 |

### 6.3 持久化筛选 State 结构

```typescript
{
  activeFilter: FilterStatus,   // 'all' | 'contract-risk' | 'pm-risk' | 'in-repair' | 'pm-plan'
  activeCampus: string,         // 'all' | 院区名称
  activeModality: string,       // 'all' | 'CT' | '磁共振' | '血管机' | '超声' | '其他'
  sortBy: SortBy,               // 'name-asc' | 'install-date-desc' | 'created-date-desc'
}
```

---

## 7. 非功能需求

### 7.1 性能

- 设备列表过滤与排序：纯客户端计算，`useMemo` 依赖收敛，避免无谓重算
- 分页加载：默认不渲染全部设备卡片，按需加载减少 DOM 节点

### 7.2 设计系统合规

- 全部 UI 使用 Philips Filament Design System 组件（`@filament/react` 子路径导入）
- 视觉样式（颜色、字体、间距、圆角）通过组件属性（`variant`, `size`, `signal` 等）表达，不在 CSS 中硬编码
- 布局样式在 Vanilla Extract `.css.ts` 文件中管理，不使用 `style={{}}` 内联样式

### 7.3 TypeScript 严格模式

- 全部代码启用 TypeScript strict，无 `any` 类型
- 组件 Props 必须有显式 interface 定义
- 函数参数和返回值有显式类型注解

### 7.4 可访问性

- 所有交互元素有 `aria-label`
- 原生 button 元素使用 `type="button"` 防止意外表单提交
- Filament 组件使用 `onPress`（React Aria），原生元素使用 `onClick`

---

## 8. 已知范围限制（Demo 阶段）

| 限制 | 说明 |
|------|------|
| **数据全部静态** | `device-data.ts`、`repair-data.ts`、`work-order-data.ts` 为硬编码 JSON，无后端 API |
| **扫码功能不解码** | `ScanCameraPage` 打开摄像头但不做二维码识别，为 UI 展示 |
| **备件/工程师查询结果固定** | Demo 展示固定结果，非真实数据查询 |
| **报修提交不持久化** | 表单提交模拟成功，不写入任何存储 |
| **工单签字仅 UI** | 签字操作不触发实际业务流程 |
| **Store 刷新后重置** | 除筛选 Store 外，自定义设备名、位置编辑、角色设置在页面刷新后恢复为初始值 |
| **消息/工单数据静态** | 消息标记已读等操作仅改变内存 state，刷新后重置 |
| **单用户视角** | 无多用户或服务器端数据同步 |
