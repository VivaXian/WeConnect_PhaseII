# 通用展示规则

跨功能的展示约束。不属于某一个功能，但每个功能都要遵守。

---

## 1. 医院 / 院区名称展示

### 1.1 问题

系统中的医院名称长度不可控，实际数据里存在如：

> 上海交通大学医学院附属瑞金医院北院区

这类名称在 375px 宽的小程序容器内会撑破布局、把同行的其他信息挤没，或把卡片撑成不规则高度导致列表节奏混乱。

### 1.2 规则

**医院名称一律单行显示，超出宽度时以省略号截断，不允许换行。**

| 要求 | 说明 |
| --- | --- |
| 单行 | `white-space: nowrap` |
| 截断 | `overflow: hidden` + `text-overflow: ellipsis` |
| 可收缩 | 所有祖先 flex 容器需 `min-width: 0`，否则截断不生效 |
| 完整值可访问 | 元素上带 `title` 属性，供无障碍与桌面端 hover 使用 |
| 独立成行 | 医院名称不要与其他信息拼在同一行 |

**"独立成行"这条同样重要。** 如果写成 `超声 · 上海交通大学医学院附属瑞金医院北院区`，截断会先吃掉医院名称的尾部，而尾部的「北院区」恰恰是区分院区的关键信息，前缀「上海交通大学医学院附属」反而人人都一样。把医院名称单独成行，至少保证它拿到整行宽度。

### 1.3 何时可以省略

用户名下只有一个院区时，所有列表中都不显示医院名称 —— 全部相同的信息没有区分度，只占空间。

判断依据是**用户名下的院区数**，不是当前筛选结果的院区数。

### 1.4 实现现状

| 位置 | 文件 | 状态 |
| --- | --- | --- |
| 最近解绑面板 | `src/components/recently-unbound-sheet.css.ts` (`meta`) | 已实现 |
| 设备卡片 | `src/components/device-card.css.ts` (`metaText`) | **不符合**：`white-space: normal` + `word-break: break-word`，长名称会换行而非截断 |
| 设备查询/绑定页 | `src/pages/scan-device-input-page.css.ts` (`deviceCampus`) | **不符合**：无任何截断处理 |
| 消息详情页 | `src/pages/message-detail-page.tsx` | **不符合**：无任何截断处理 |
| 院区筛选下拉 | `src/pages/device-list-page.tsx` | 已实现（Filament 组件自带处理） |

**待实现：** 上表中三处「不符合」需按 1.2 规则补齐。

建议做法是把这条规则抽成一个共享样式，而不是在每个 `.css.ts` 里各写一遍 —— 目前四处各写各的，正是不一致的来源。

参考实现：

```ts
// recently-unbound-sheet.css.ts
meta: style({
  fontSize: 12,
  lineHeight: '17px',
  color: '#8a94a6',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}),
info: style({
  flex: 1,
  minWidth: 0,   // 缺这行截断不生效
}),
```

### 1.5 验证方式

用最长的真实医院名称（不少于 20 个汉字）测试所有展示位置，确认：

- 文本被省略号截断，不换行
- 元素高度与短名称时一致（列表行高不跳变）
- 同行的其他元素（倒计时、按钮、箭头）位置不受影响

---

## 2. 设备名称

同样规则：单行 + 省略号截断。已在设备卡片（`deviceName`）与最近解绑面板中实现。

用户自定义备注（`customName`）同样截断处理。

---

## 3. 插画尺寸

Filament Pictogram 在 375px 宽的小程序容器内统一使用 `size="medium"`（96×96）。

不要用 `large`（144×144）—— 在手机宽度下过于抢眼，会把插画变成页面主角，而空态的主角应该是"用户接下来该做什么"的操作按钮。

已统一的位置：「我的设备」空态、迁移中空态、筛选无结果空态、设备列表页空态。

---

## 4. 详情页小节标题

来源：Figma `nxACmwYuBP6ahDyk5hk6Lx` / node `4652:12919`（CardContent）。

小节标题采用设计系统的 tab-item 样式，**指示条的尺寸与配色一律取自 `tabsTokens`，不要写死数值**：

```ts
import { tabsTokens } from '@filament/react/themes/components/tabs';

const tabIndicator = {
  content: '""',
  flexShrink: 0,
  width: tabsTokens.indicator.width,
  height: 24,
  borderRadius: `0 ${tabsTokens.indicator.border.radius} ${tabsTokens.indicator.border.radius} 0`,
  background: tabsTokens.indicator.color,
} as const;
```

曾经写死过 `width: 6 / height: 32 / radius 3px`，比 Filament 的 tab indicator 粗一倍，视觉上很突兀。Filament 的 token 是 `indicator.width`（细条）+ `border.radius: 0.125rem`。竖条只把 token 的「厚度」用在 `width` 上，圆角只给右侧（左侧贴着小节边缘）。

| 元素 | 规格 |
| --- | --- |
| 指示条 | `tabsTokens.indicator.width` × 24，右侧圆角 `tabsTokens.indicator.border.radius`，色 `tabsTokens.indicator.color` |
| 标题 | 16px / 24px 行高 / 700，色 `tabsTokens.text.color.selected` |
| 行高 | `min-height: 40`，与指示条 gap 8 |
| 小节容器 | `padding: 8px 16px 16px` |

实现于 `src/pages/repair-detail-page.css.ts` 的 `sectionTitle` 与 `sectionEntryTitle`（共用同一个 `tabIndicator` 常量），以及 `work-order-info-section.css.ts` 的 `indicator` / `headerTitle` —— 区别只在于 `sectionEntryTitle` 整行可点（右侧带 chevron）。报修详情页的服务对话、工单信息、维修进度、报修描述四个小节标题全部走这套样式。

---

## 5. 工单信息模块

来源同上（Figma node `4652:12919`）。实现：`src/components/work-order-info-section.tsx` + `.css.ts`。

模块自带小节标题，对外只接收 `workOrders` / `onWorkOrderPress` / `isStatic` / `notice`。

| 部件 | 规格 |
| --- | --- |
| 行容器 | 无卡片底色、无边框、无分隔线；`padding: 4`，行间 gap 8，垂直居中 |
| 第一行 | 工单类型 pill（`typePill`）+ `Text variant="body-m" weight="bold"`（工单号），gap 8 |
| 第二行起 | `Text variant="body-s" color="secondary"` 标签固定宽 56 + `Text variant="body-s"` 值，行间 gap 2 |
| 右侧 | 视状态而定（见下表） |

**工单类型 pill 不要用 Filament `Tag`。** 设计稿里那个 pill 只是一种外观（浅蓝底 + 蓝字 + 小字号），不是 Tag 的选中态 —— 用 `Tag` 会带来两个问题：字号偏大（Tag 走 body 尺寸，设计稿是 11px/18px 的 56×18 小 pill），以及一旦想拿到浅蓝底就得开 `selectionMode`，那会把 Tag 渲染成 `<button>`，嵌在整行的 `<button>` 里属于非法嵌套。因此直接用 `work-order-info-section.css.ts` 里的 `typePill`（`min-width: 56 / height: 18 / radius 4 / 11px / #e8f0fe 底 / #0072db 字`）。

### 5.1 维修工单的两种服务方式

`LinkedWorkOrder.serviceMode`（`src/types/work-order.ts` 的 `WorkOrderServiceMode`）只有两个值，pill 上写的就是它：

| serviceMode | pill 文案 |
| --- | --- |
| `onsite` | 现场维修 |
| `remote` | 远程维修 |

**远程维修工单永远不可点开** —— 远程处理没有需要客户签字的服务报告，点进去是空的。

### 5.2 四种工单状态的行为

| 工单状态 | 右侧 | 额外行 | 可点 |
| --- | --- | --- | --- |
| 进行中 | 无 | 无 | 否（工单还没出报告，没有可看的内容） |
| 待签字 | `Button variant="primary"`「去签字」 | 请求时间 | 行本身不可点，只有按钮可点 |
| 已部分签字 / 已签字 | `ChevronRight` 24×24 | 无 | 是 |
| 已完成 | 现场维修可点（chevron）；远程维修不可点 | 无 | 视 serviceMode |

「待签字」那行**不要**把整行也做成可点 —— 行里已经有一个 `Button`，外层再套 `<button>` 就是嵌套可交互元素。实现上这一行的容器是 `div`，只有「去签字」按钮可点。

请求时间只在 `requestTime` 有值时渲染，数据里只给「待签字」的工单填这个字段 —— 其他状态下客户不关心工单是什么时候派出来的。

### 5.3 Mock 数据

这四种状态在 **D-12126601（Elition 磁共振，服务中）** 上全部铺开，见 `src/utils/repair-data.ts` 的 `apr26-1`：W0128923813 进行中 / W0128923812 待签字 / W0128923811 已部分签字 / W0128923810 远程维修·已完成。可点的两条在 `src/utils/work-order-data.ts` 里有对应的 `wo-014` / `wo-015`，不是死链。

**4/18 之前的报修（`isPreCutoffRepair(record)`）的差异**见 `data-migration.md` §4.2：行变为静态（`isStatic`）、不显示工单状态行、不显示 chevron。说明条不放在本小节，而是页面顶部只放一条。

---

## 6. 列表页的空态与底部求助入口

### 6.1 空态分两种，不要混为一谈

**「筛不出来」和「本来就没有」是两件事，出口也不同。**

| 情况 | 判据 | 插画 | 标题 | 出口 |
| --- | --- | --- | --- | --- |
| 筛选/搜索无匹配 | `hasActiveFilters` | `NoResult` | 报修：无匹配报修记录<br>工单：无匹配工单 | `Button variant="secondary" shape="round"`「清除筛选条件」/「清除搜索」 |
| 本来就没有记录 | 无任何筛选条件 | `FolderEmpty` | 报修：暂无报修记录<br>工单：暂无工单记录 | 一句 hint + `QuietInquiry` |

**筛选无匹配时不要放客服入口。** 0 条是用户自己的筛选条件造成的，正确的出口是把条件清掉，而不是引导他去问人。

**「电话报修可能未同步到小程序」只能出现在真·空态。** 用户筛了「服务号 + 近6月 + 已取消」筛不出东西，跟电话报修没同步毫无关系 —— 这时候说这句话是答非所问。只有一条记录都没有时，"可能是走了电话渠道"才是对现象的真实解释。

版式与 `user-device-page.tsx` 的空态保持一致：竖向居中、`gap: 20`、`padding: 24px 16px 40px`，标题 15px/600/`#15305c`，hint 13px/`#5b6779`。「清除筛选条件」的按钮必须同时清掉搜索词和所有筛选项，否则用户点完还是空的。

### 6.2 列表非空时的底部求助入口

降级成底部一行安静文字 `QuietInquiry`（报修：「报修进度有疑问？联系客户响应中心」/ 工单：「对工单内容有疑问？联系客户响应中心」）。

列表里已经有内容了，底部再压一张带插图和蓝色主按钮的卡片，会比它上面的真实业务卡片还抢眼。同样的降级在报修详情页底部已经做过一次（`repair-detail-page.css.ts` 的 `quietInquiry`），理由一致：低频兜底入口不配占据视觉重心。

> `ServiceEntryCard` 现已无人使用 —— 它在报修详情页、报修列表、工单列表三处先后被降级掉了。

### 6.3 页面底色

报修列表与设备主页一样用浅蓝底 `#F0F9FF`（`suServiceStyles.page`），列表卡片是白色，靠底色分层。搜索/筛选行必须 `background: transparent` 且不带 `border-bottom` —— 一条白底横条压在浅蓝底上会切出一道多余的接缝，设备主页的 `searchFilterRow` 就是透明的。

滚动区自身需要 `padding-bottom`（报修列表为 16），保证最后一个元素不贴着底部 tab bar。
