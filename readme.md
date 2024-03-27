# monster-uni 组件

-   自用 uniapp 组件，只做了 H5、微信小程序和支付宝小程序的支持

## 微信小程序预览

![avatar](https://qn.bauble.vip/static/monster-uni.jpg)

## 安装

```
npm i monster-uni --save
```
## 使用
```json
// pages.json
{
	"easycom": {
		"autoscan": true,
		"custom": {
			"m-(.*)": "monster-uni/components/m-$1/m-$1.vue"
		}
	}
}
```

## 手势切换

### touch-swipe Props

| 参数             | 说明                                                                                                                                                   | 类型              | 默认值       | 可选值                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ------------ | --------------------------------------------------------------------------- |
| `index`          | 当前展示的面板索引，支持 sync 双向绑定                                                                                                                 | `Number`          | `0`          | -                                                                           |
| `direction`      | 滑动方向                                                                                                                                               | `String`          | `horizontal` | `horizontal`:水平方向(必须固定宽度) <br />`vertical`:垂直方向(必须固定高度) |
| `width`          | 宽度（单位 rpx）                                                                                                                                       | `String`/`Number` | `100%`       | -                                                                           |
| `height`         | 高度（单位 rpx）                                                                                                                                       | `String`/`Number` | `100%`       | -                                                                           |
| `duration`       | 动画时长（单位 s）                                                                                                                                     | `Number`          | `0.3`        | -                                                                           |
| `swipeThreshold` | 灵敏度（0-1 之间的数值，数值越小越灵敏）                                                                                                               | `Number`          | `0.35`       | -                                                                           |
| `disabled`       | 是否禁用                                                                                                                                               | `Boolean`         | `false`      | -                                                                           |
| `childrenLength` | 子元素数量（使用 `touch-swipe-item` 作为子元素时不需要传递，不使用 `touch-swipe-item` 作为子元素盒子时必传）                                           | `Number`          | `0`          | -                                                                           |
| `disabledIndexs` | 禁用的面板索引（使用 `touch-swipe-item` 作为子元素时直接在 `touch-swipe-item` 上定义某个标签禁用即可，不使用 `touch-swipe-item` 作为子元素盒子时可传） | `Array`           | `[]`         | -                                                                           |

### touch-swipe Event

| 事件名   | 说明         | 事件参数      |
| -------- | ------------ | ------------- |
| `change` | 滑动切换触发 | 最新的`index` |

### touch-swipe-item Props

| 参数       | 说明                                             | 类型      | 默认值  | 可选值 |
| ---------- | ------------------------------------------------ | --------- | ------- | ------ |
| `disabled` | 是否禁用当前子元素（禁用后无法滑动到当前子元素） | `Boolean` | `false` | ---    |

### 示例

```
<touch-swipe width="600">
	<touch-swipe-item v-for="(src, i) in images" :key="i">
		<image :src="src" style="width: 100%" mode="widthFix" />
	</touch-swipe-item>
</touch-swipe>
```
