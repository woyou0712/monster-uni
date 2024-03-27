<template>
	<view class="m-touch-swipe-item--root">
		<slot />
	</view>
</template>

<script>
/**
 * m-touch-swipe-item 手势切屏项
 * @description 手势切屏项组件
 * @property {Boolean} 	disabled  当前项是否禁用（禁用后无法滑动到该项）
 */
export default {
	name: 'm-touch-swipe-item',
	inject: ['_touchSwipe'],
	props: {
		disabled: {
			type: Boolean,
			default: () => false,
		},
	},
	mounted() {
		const parent = this._touchSwipe?.getParent();
		parent?.updateChildren();
	},
};
</script>

<style lang="scss" scoped>
.m-touch-swipe-item--root {
	width: 100%;
	height: 100%;
	display: inline-block;
}
</style>
