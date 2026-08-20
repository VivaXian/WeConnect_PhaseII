# WeConnect Phase II — 代码库理解文档

> 基于 2026-06-15 代码状态（tag: PhaseII_0610）整理

---

## 一、产品概览

WeConnect Phase II 是一款面向医院设备管理场景的微信小程序原型（Web 仿真版本，运行在浏览器中）。

核心用户场景：
- **认证用户（普通医护/设备操作人员）**：查看自己名下设备、报修、跟踪报修进度
- **授权用户（设备管理员/超级用户）**：全院设备总览、合同/保养风险监控、查看全部报修记录、接收系统消息通知

产品整体以"飞利浦医疗设备服务"为主线，功能包括设备查看与管理、报修申请与跟踪、服务工单查看、消息通知、备件原厂验证、工程师资质查询。

---

## 二、技术栈

| 层次 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript（严格模式）|
| 构建 | Vite 8 + vite-plugin-vanilla-extract |
| 设计系统 | Philips Filament Design System（`@filament/react` 4.10.0）|
| 样式 | Vanilla Extract `.css.ts`（仅布局，视觉样式全部来自 Filament 组件属性）|
| 状态管理 | Zustand 5（部分 store 使用 `persist` 中间件持久化到 localStorage）|
| 动画 | `@react-spring/web` |
| 包管理 | Yarn 4（node-modules linker）|
| 部署 | GitHub Pages（`gh-pages` 分支，本地 `yarn deploy` 推送）|

### Filament 导入规范
必须从子路径导入，禁止桶导入：
```tsx
// ✅ 正确
import { Button } from '@filament/react/button';
import { FlexBox } from '@filament/react/layout';
// ❌ 错误（会破坏构建）
import { Button } from '@filament/react';
```

---

## 三、项目目录结构

```
src/
├── app.tsx              # 根组件，渲染手机框 + RoleSwitcher + AppShell
├── main.tsx             # 入口，挂载 Filament ThemeProvider
├── pages/               # 页面组件（每个页面配套 .css.ts）
├── components/          # 可复用 UI 组件
├── stores/              # Zustand 状态 store
├── types/               # TypeScript 类型定义
├── utils/               # 静态数据（device-data、repair-data、work-order-data 等）
├── hooks/               # 自定义 Hook（目前仅 use-load-more）
├── contexts/            # React Context（theme-context）
└── assets/icons/        # SVG + PNG 图标资源
```

---

## 四、角色体系

### 两种角色

| 角色 | 代号 | 说明 |
|------|------|------|
| 认证用户 | `user` | 普通用户，仅能看自己名下设备、提交报修 |
| 授权用户 | `admin` | 全院管理员，看全部设备、全部报修、系统消息 |

### Demo 切换
页面顶部有 `RoleSwitcher` 组件（仅 demo 环境），可在两种角色之间切换。切换时导航栈重置。

### 角色升级流程（`role-store.ts`）
认证用户可在"我的"页面申请升级为授权用户，状态机：
- `not-applied` → 提交申请（填写医院、销售姓名/电话）→ `pending`
- `pending` → 审批通过 → `admin` 角色
- `pending` → 拒绝 → `cooldown`（30天冷却，Demo 可手动重置）

### 院区扩展（授权用户专属）
授权用户可申请扩展关联院区，状态机与升级流程结构相同（`campusStatus`）。

---

## 五、导航架构

核心导航由 `AppShell`（`pages/app-shell.tsx`）管理。

### 底部导航栏（`SharedBottomBar`）

四个 Tab，两种角色共用（内容随角色变化）：

| Tab key | 图标 | 授权用户内容 | 认证用户内容 |
|---------|------|------------|------------|
| `devices` | Compass | 设备管理页 | 我的设备页 |
| `repair` | ClipboardPerson | 报修管理（全院）| 我的报修 |
| `orders` | ClipboardList | 工单列表 | 工单列表 |
| `profile` | PersonPortraitCircle | 我的（含消息） | 我的（含消息）|

### 全屏覆盖页（无底部栏）

导航栈（`navStack: NavState[]`）管理的二级页面：

| NavState 类型 | 页面 |
|--------------|------|
| `device-detail` | 设备详情页（含 initialTab 参数）|
| `repair-form` | 极速报修表单 |
| `spare-parts-auth` | 备件原厂验证 |
| `engineer-verify` | 工程师资质查询 |
| `engineer-chat` | 工程师聊天 |
| `scan-camera` | 扫码摄像头 |
| `scan-device-input` | 手动输入设备查找 |
| `repair-detail` | 报修详情 |
| `work-order-detail` | 工单详情 |
| `service-eval` | 服务评价 |
| `privacy-policy` | 隐私政策 |

### Profile 子页面
"我的" Tab 内部有子页状态 `profileSubPage`，管理消息列表和消息详情的层级。

---

## 六、设备数据模型

### Device 接口（`types/device.ts`）

```typescript
interface Device {
  id: string;               // 唯一标识，如 'dev-001'
  name: string;             // 设备名，如 'Ingenia 3.0T'
  type: string;             // 设备类型，如 '磁共振成像系统'
  department: string;       // 科室
  location: string;         // 位置
  status: DeviceStatus;     // 运行状态
  contract: ContractType;   // 合同等级
  businessContract?: BusinessContract; // 业务合同类型
  contractStart?: string;
  contractEnd?: string;     // 合同到期日期（YYYY-MM-DD）
  contractHistory?: ContractPeriod[]; // 合同历程（按时间倒序展示）
  serialNumber: string;
  eqNumber?: string;        // 设备 EQ 编号
  customName?: string;      // 数据层自定义名（会被 store 层覆盖）
  campus?: string;          // 院区名称
  pmLastDate?: string;      // 上次保养日期
  pmNextDate?: string;      // 下次保养日期
  installDate?: string;     // 装机日期
  createdAt?: string;       // 录入系统时间
  acceptancePending?: boolean; // 待验收状态
  isDistributedDevice?: boolean; // 是否为分布式渠道设备（超声/影像工作站）
  canShowInstallDate?: boolean;  // 是否可展示装机日期
  pmWorkOrders?: PmWorkOrderEntry[];
  deviceWorkOrders?: DeviceWorkOrderEntry[];
}
```

### 状态枚举

| DeviceStatus | 含义 |
|-------------|------|
| `normal` | 正常运行 |
| `under-repair` | 报修中 |
| `pending-repair` | 报修中（待处理）|
| `offline` | 停机 |

| ContractType | 含义 |
|-------------|------|
| `platinum` | 白金保 |
| `gold` | 金保 |
| `basic` | 基础保 |
| `none` | 无合同 |

| BusinessContract | 含义 |
|----------------|------|
| `warranty` | Warranty 保修期 |
| `csa` | CSA 服务合同 |
| `pos` | POS 按次计费 |
| `none` | 暂无服务合同 |

### 测试数据（`utils/device-data.ts`）

共 13 台设备，分布于 3 个院区：

| 院区 | 设备数 | 典型设备 |
|------|-------|---------|
| WeConnect医院主院区 | 6 | Ingenia 3.0T, BigBore CT 7500, EPIQ Elite 等 |
| WeConnect医院（南院）| 4 | Elition 磁共振, MR 5300, Vereos PET/CT 等 |
| WeConnect医院（北院）| 3 | Azurion M3, Sparq 超声, EPIQ 5 等 |

影像类型分布：磁共振3台、CT2台（含PET/CT）、血管机1台、超声7台（含便携式）、医学影像工作站1台。

---

## 七、页面详情

### 7.1 设备管理页（授权用户）— `device-list-page.tsx`

**入口**：`devices` Tab，`isAdmin === true`

**顶栏（蓝色背景）**：
- 标题"设备管理" + 右侧"扫码报修/绑定"胶囊按钮
- 院区选择器：名下医院 >1 家时显示下拉（含"全部院区"选项）；仅1家时静态展示院区名称
- 统计卡片横向滚动行：**全部设备 / 合同风险 / 保养风险 / 报修中 / 保养计划**

**搜索 + 设备类型筛选（同一行）**：
- 左侧：Filament Search 组件（固定宽 140px，placeholder "搜索设备"）
- 右侧：设备类型 chips 横向滚动（CT / 磁共振 / 血管机 / 超声 / 其他），右侧渐隐遮罩提示可滚动
- 选中的 chip 在组件挂载时自动滚动到可视区

**搜索逻辑（全字段匹配）**：
设备名、自定义名、设备类型、影像模态、科室、位置、院区、序列号、EQ号

**排序**（列表标题行右侧"按X排序"按钮）：
- 按设备名称（默认，汉字拼音序）
- 按装机日期（最新优先）
- 按录入时间（最新优先）
- 特例：保养计划筛选下强制按保养日期升序

**保养计划特殊展示**：激活时出现年份导航 + 月份横向滚动选择器

**设备卡片列表**：
- 默认每次显示6条，底部"加载更多"按钮
- 统计显示总台数（不受分页影响）
- 卡片包含：设备图标（按影像模态）+ 设备名称（含自定义名）+ 状态 tag + 科室·位置（两行元数据）+ 院区（多院区且"全部院区"视图时显示）

**筛选状态持久化**：院区、设备类型、状态筛选、排序方式通过 Zustand persist 中间件保存到 localStorage，进详情页返回后保持不变。

---

### 7.2 我的设备页（认证用户）— `user-device-page.tsx`

**入口**：`devices` Tab，`isAdmin === false`

**顶栏**：同设备管理页结构（标题"我的设备" + 扫码按钮 + 院区选择器 + 统计卡片）

**统计维度**（认证用户，无合同风险项）：全部设备 / 保养风险 / 报修中 / 本月保养

**搜索 + 筛选**：与授权用户设备管理页完全一致（Filament Search + 滚动 chips + 排序）

**搜索逻辑**：与设备管理页一致（全字段）

**设备卡片**：相同组件 `DeviceCard`，院区显示逻辑相同

**筛选持久化**：使用独立的 `useUserDeviceFilterStore`，与授权用户的 store 互相隔离

---

### 7.3 设备详情页 — `device-detail-page.tsx`

**入口**：点击任意设备卡片；部分入口可指定 `initialTab`

**顶栏**：`MiniProgramNav`（返回箭头 + 设备名称 + 可选"快速报修"按钮）

**Tab 导航**（5个 Tab）：

#### Tab 1：基本信息（`device-detail-info-tab.tsx`）
- 展示：设备名称（含自定义名）、设备类型、序列号、EQ号、科室（可编辑）、位置（可编辑）、医院/院区、装机日期（按 `canShowInstallDate` 控制可见性）
- **可编辑字段**：科室和位置，编辑后通过 `useDeviceLocationsStore` 保存，影响设备卡片展示（实时同步）
- **自定义设备名**：通过 `useDeviceCustomNamesStore` 保存

#### Tab 2：合同（`device-detail-contract-tab.tsx`）
合同状态卡片（单一信息源）有5种展示情况：

| 条件 | 显示 |
|------|------|
| `acceptancePending === true` | 待验收（设备当前无保障）|
| 装机不足6个月 | 合同未知（合同信息录入中）|
| `contractStatus === 'none'`（无 contractEnd）| 合同未知（暂无合同信息）|
| `contractStatus === 'expired'` | 无保（合同已到期）+ 续保咨询按钮 |
| `contractStatus === 'warning'`（≤120天到期）| 即将出保 + 续保咨询按钮 |
| `contractStatus === 'good'` | 在保中（绿色）|

合同历程：倒序展示 `contractHistory` 数组，每条显示状态标签（生效/已过期/待生效）。
分布式渠道设备（`isDistributedDevice`）：超声/影像工作站类型不展示质保合同，仅展示 CSA 合同。

#### Tab 3：保养（`device-detail-pm-tab.tsx`）
- 保养风险等级（高风险/正常）
- 上次保养日期、下次保养计划
- 保养工单历程列表

#### Tab 4：报修记录（`device-detail-repair-tab.tsx`）
- 当前进行中的报修（如有）
- 历史报修记录（认证用户仅看最近1条，授权用户全看）

#### Tab 5：工单（`device-detail-workorder-tab.tsx`）
- 所有关联工单（维修、保养、FCO、安装）

---

### 7.4 报修管理页 — `super-user-service-page.tsx`

**入口**：`repair` Tab（两种角色均使用此页面，通过 props 区分标题）

**授权用户**：标题"报修管理"，展示全院所有报修记录
**认证用户**：标题"我的报修"，展示自己的报修记录

**筛选能力**：
- 搜索（设备名 / 医院名）
- 状态筛选：全部 / 已报修 / 服务中 / 已完成 / 已取消
- 时间范围：不限 / 近3月 / 近6月 / 近1年
- 来源渠道：全渠道 / 小程序 / 电话 / 服务号

**列表**：分月分组，"加载更多"模式（每批10条）

---

### 7.5 极速报修表单 — `repair-form-page.tsx`

**入口**：设备详情页"快速报修"按钮，或扫码后

**必填项**：
- 故障紧急程度（停机急修 / 影响使用 / 轻微异常）
- 故障描述（文本）
- 联系人姓名
- 联系电话

**提交**：模拟800ms延迟后成功，返回上一页

---

### 7.6 工单列表页 — `work-order-list-page.tsx`

**入口**：`orders` Tab（两种角色共用）

**工单类型**：维修 / 保养 / FCO / 安装
**工单状态**：待签字 / 进行中 / 已过期 / 已完成

**筛选**：Filament Search 组件搜索设备名

**Badge**：待签字工单数量在底部导航栏工单 Tab 上显示角标

---

### 7.7 消息通知 — `messages-page.tsx` + `message-detail-page.tsx`

**入口**：`profile` Tab → 点击消息入口

**消息分类**（`MessageCategory`）：
- `contract-expiry`：即将出保
- `contract-expired`：合同出保
- `acceptance`：设备待验收
- `pm-plan`：保养月度计划
- `pm-risk`：保养风险
- `permission-upgrade`：权限升级审核通知
- `order-update`：服务节点提醒

**视图模式**：
- **摘要视图**（Digest）：按优先级分区展示风险汇总
- **列表视图**：按日期分组，支持已读/未读和类型筛选

**筛选**：已读/未读/全部 + 消息类型筛选

**角色差异**：`forAdminOnly: true` 的消息仅授权用户可见

---

### 7.8 我的页面 — `profile-page.tsx`

**顶部 Hero 区**：
- 头像（取用户名首字母）+ 用户名（可点击编辑）
- 认证用户显示升级入口，授权用户不显示
- 授权用户显示关联设备数量和院区数量

**快捷入口**（认证用户）：
- 扫码报修/绑定
- 手动输入设备查找

**功能入口**：
- 消息通知（含未读角标）
- 备件原厂验证
- 工程师资质查询
- 订阅与通知设置
- 隐私政策

**底部 Sheet**：AccountSheet（账号信息）、SubscriptionSheet（通知订阅）、UsernameEditSheet（用户名编辑）

---

### 7.9 扫码页面 — `scan-camera-page.tsx`

调用设备摄像头（后置摄像头优先），显示扫描取景框动画。浏览器环境无法真实解码，为 UI 原型展示。

---

### 7.10 备件原厂验证 — `spare-parts-auth-page.tsx`

两步流程：
1. 引导页（插画 + 说明文字 + "扫描防伪码"按钮）
2. 结果页（Demo 固定展示验证成功结果）

---

### 7.11 工程师资质查询 — `engineer-verify-page.tsx`

两步流程：
1. 引导页（插画 + 说明文字 + "扫描工程师二维码"按钮）
2. 结果页（Demo 固定展示资质信息）

---

## 八、状态管理（Stores）

| Store 文件 | 作用 | 持久化 |
|-----------|------|--------|
| `role-store.ts` | 用户角色、升级申请状态、院区扩展状态、用户名 | 否 |
| `device-custom-names-store.ts` | 设备自定义名称（deviceId → 名称）| 否 |
| `device-locations-store.ts` | 设备科室/位置覆盖（deviceId → {department, location}）| 否 |
| `device-list-filter-store.ts` | 授权用户设备列表筛选状态（activeFilter, activeCampus, activeModality, sortBy）| **是**（key: `device-list-filter`）|
| `device-list-filter-store.ts` | 认证用户设备列表筛选状态（useUserDeviceFilterStore）| **是**（key: `user-device-filter`）|
| `message-store.ts` | 消息列表及已读状态 | 否 |
| `subscription-store.ts` | 消息订阅设置 | 否 |
| `app-store.ts` | 通用计数示例（目前无实际业务用途）| 否 |

### 关键设计说明

**设备卡片与详情的数据流**：
- `device-data.ts` 是原始数据源（只读）
- `useDeviceCustomNamesStore` 存储用户在详情页编辑的自定义设备名
- `useDeviceLocationsStore` 存储用户在详情页编辑的科室/位置
- 设备卡片和详情页都从这两个 store 读取覆盖值，实现编辑后实时同步

**筛选状态保留**：
进入设备详情页后，页面卸载；返回时页面重新挂载。通过 Zustand persist 中间件，院区、类型、状态筛选、排序方式都能在返回后恢复。选中的 chip 会通过 `useEffect` + `data-active` 属性自动滚动到可视区。

---

## 九、设备卡片组件 — `components/device-card.tsx`

**Props**：
```typescript
interface DeviceCardProps {
  device: Device;
  onPress?: () => void;
  tags: TagItem[];            // 状态 tag，由各列表页计算
  customName?: string;        // 来自 device-custom-names-store
  showHospital?: boolean;     // 是否展示院区名称
}
```

**布局**：左侧色块（含设备图标 + 影像模态标签）+ 右侧内容区（设备名、tag、科室·位置、院区）

**影像模态图标**（`modality` 字段由设备 `type` 推断）：
- 磁共振：MR 图标（蓝色背景）
- CT/PET-CT：CT 图标
- 血管机：IGT 图标
- 超声：US 图标
- 其他/未知：Compass 图标

**院区显示条件**：`showHospital === true`，即满足以下两个条件：
1. 系统中存在多个院区（`hasMultipleCampuses`）
2. 当前选择的是"全部院区"视图（`activeCampus === 'all'`）

**Tag 类型**（`signal`）：
| 场景 | signal |
|------|--------|
| 报修中 | `information` |
| 合同即将到期 / 保养风险 | `caution` |
| 合同已到期 | `error` |
| 本月保养 | `information` |
| 待验收 | `warning` |

---

## 十、院区逻辑

### 多院区 vs 单院区

- 若 `device-data.ts` 中的设备涉及多个不同 `campus` 值（当前为3个），显示"全部院区"下拉选择器（含"全部院区"选项 + 各院区名称）
- 若仅有1个院区，顶栏静态显示该院区名称，无下拉，无"全部院区"概念，设备卡片不显示院区名称

### 院区排序
院区列表按中文拼音序排序（`localeCompare('zh-Hans-CN')`）：
WeConnect医院（北院）→ WeConnect医院（南院）→ WeConnect医院主院区

---

## 十一、工具与辅助 Hook

### `use-load-more.ts`
分页加载 Hook，用于设备列表和报修记录列表：
- 入参：完整列表 + 每批数量（设备列表为6，报修记录为10）
- 输出：`visibleItems`（当前显示）、`hasMore`、`loadMore`、`total`
- 筛选条件变化时自动重置到第一批

---

## 十二、数据约定

### 合同状态判断逻辑（`device-detail-page.tsx`）
```
contractDays = device.contractEnd ? daysFromToday(contractEnd) : null
contractStatus:
  null      → 'none'     （无合同到期日）
  > 120天   → 'good'     （在保中）
  1-120天   → 'warning'  （即将出保）
  ≤ 0天     → 'expired'  （已过期）
```

### 保养风险判断
- 非超声设备 + 无在保合同 + 无下次保养日期 → 高风险
- 超声设备不参与保养风险计算（系统暂未接入）

### 分布式渠道设备（`isDistributedDevice`）
部分超声设备和影像工作站通过分销渠道购入，特殊处理：
- 合同 Tab 不展示质保合同，只展示 CSA 合同（若有）
- 显示"部分合同记录暂未同步"提示

---

## 十三、已知 Demo 限制

1. **数据全部静态**：`device-data.ts`、`repair-data.ts`、`work-order-data.ts` 为硬编码数据，无后端
2. **扫码不解码**：`ScanCameraPage` 仅展示摄像头画面，无实际二维码识别
3. **备件验证/工程师查询**：结果页为 Demo 固定数据
4. **报修提交**：模拟延迟后直接成功，不写入任何持久化存储
5. **消息、工单**：静态数据，操作（如签字）为界面模拟
6. **store 无持久化（除筛选store）**：刷新页面后，自定义设备名、位置编辑、角色设置均会重置
