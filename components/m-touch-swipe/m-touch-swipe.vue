<template>
	<view class="m-touch-swipe--root" :style="[cmpRootStyle]">
		<view
			class="content"
			@mousedown="onTouchstart"
			@mousemove.stop="onTouchmove"
			@mouseup="onTouchend"
			@touchstart="onTouchstart"
			@touchmove.stop="onTouchmove"
			@touchend="onTouchend"
			@touchcancel="onTouchend"
		>
			<view class="content-view" :style="[cmpBoxStyle, cmpTransform]">
				<slot />
			</view>
		</view>
	</view>
</template>

<script>
import { rpx2px, querySelector, childrenProps } from '../../utils/index.js';
import TouchEvent from './TouchEvent.js';

/**
 * m-touch-swipe 手势切屏
 * @description 手势切屏组件
 * @property {Number} 	index  当前展示的面板索引，支持sync双向绑定
 * @property {String} 	direction  滑动方向
 * @value horizontal 	（默认）水平方向：必须固定宽度
 * @value vertical 		垂直方向：必须固定高度
 * @property {String | Number} 	width 					宽度，默认值100%
 * @property {String | Number} 	height 					高度，默认值100%
 * @property {Number}						duration				动画时长，单位s
 * @property {Number} 					swipeThreshold	灵敏度（0-1之间的数值，数值越小越灵敏）
 * @property {Boolean} 					disabled				是否禁用
 * @property {Number} 					childrenLength	面板数量（使用m-touch-swipe-item作为子元素时不需要传递，不使用m-touch-swipe-item作为子元素盒子时必传）
 * @property {Array} 						disabledIndexs	禁用的面板索引（使用m-touch-swipe-item作为子元素时直接在m-touch-swipe-item上定义某个标签禁用即可，不使用m-touch-swipe-item作为子元素盒子时可传）
 * */
export default {
	name: 'm-touch-swipe',
	provide() {
		return {
			_touchSwipe: { getParent: () => this },
		};
	},
	props: {
		// 当前展示的面板索引
		index: {
			type: Number,
			default: () => 0,
		},
		// 滑动方向  "horizontal" | "vertical"(水平方向时宽度必须固定，垂直方向时高度必须固定)
		direction: {
			type: String,
			default: () => 'horizontal',
		},
		width: {
			type: [String, Number],
			default: () => '100%',
		},
		height: {
			type: [String, Number],
			default: () => '100%',
		},
		// 动画时长
		duration: {
			type: Number,
			default: () => 0.3,
		},
		// 灵敏度（0-1之间的数值，数值越小越灵敏）
		swipeThreshold: {
			type: Number,
			default: () => 0.35,
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: () => false,
		},
		// 面板数量（使用m-touch-swipe-item作为子元素时不需要传递，不使用m-touch-swipe-item作为子元素盒子时必传）
		childrenLength: {
			type: Number,
			default: () => 0,
		},
		// 禁用的面板索引（使用m-touch-swipe-item作为子元素时直接在m-touch-swipe-item上定义某个标签禁用即可，不使用m-touch-swipe-item作为子元素盒子时可传）
		disabledIndexs: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			show: false,
			boxEl: null,
			touch: null,
			moveing: false,
			translateX: 0,
			translateY: 0,
			dataIndex: 0,
			dataChildrenLength: 0,
			dataDisabledIndexs: [],
			_timeout: null,
		};
	},
	async mounted() {
		this.touch = new TouchEvent();
		this.updateChildren();
	},
	computed: {
		cmpRootStyle() {
			return {
				'--touch-swipe-width': isNaN(this.width) ? this.width : rpx2px(this.width),
				'--touch-swipe-height': isNaN(this.height) ? this.height : rpx2px(this.height),
				opacity: this.show ? '1' : '0',
			};
		},
		cmpChildrenLength() {
			return this.childrenLength ? this.childrenLength : this.dataChildrenLength;
		},
		cmpDisabledIndexs() {
			return this.disabledIndexs.length ? this.disabledIndexs : this.dataDisabledIndexs;
		},
		cmpBoxStyle() {
			let style = {};
			if (this.direction === 'horizontal') {
				style.gridTemplateColumns = `repeat(${this.cmpChildrenLength || 'auto-fill'}, 100%)`;
			} else if (this.direction === 'vertical') {
				style.gridTemplateRows = `repeat(${this.cmpChildrenLength || 'auto-fill'}, 100%)`;
			}
			return style;
		},
		cmpTransform() {
			let transform = '';
			if (this.direction === 'horizontal') {
				transform = `translateX(${this.translateX}px)`;
			} else if (this.direction === 'vertical') {
				transform = `translateY(${this.translateY}px)`;
			}
			return {
				transform,
				transitionDuration: this.moveing ? 'inherit' : `${this.duration}s`,
			};
		},
		cmpItemLefts() {
			const list = [];
			if (!this.boxEl?.width) return list;
			for (let i = 0; i < this.cmpChildrenLength; i++) {
				list.push(this.boxEl.width * i);
			}
			return list;
		},
		cmpItemTops() {
			const list = [];
			if (!this.boxEl?.height) return list;
			for (let i = 0; i < this.cmpChildrenLength; i++) {
				list.push(this.boxEl.height * i);
			}
			return list;
		},
	},
	watch: {
		index: {
			handler(v) {
				if (v < 0 || v > this.cmpChildrenLength - 1) return;
				this.dataIndex = v;
			},
			immediate: true,
		},
		dataIndex: {
			handler(v) {
				if (this.direction === 'horizontal') {
					this.translateX = -this.cmpItemLefts[this.dataIndex];
				} else if (this.direction === 'vertical') {
					this.translateY = -this.cmpItemTops[this.dataIndex];
				}
			},
			immediate: true,
		},
	},
	methods: {
		updateChildren() {
			clearTimeout(this._timeout);
			this.show = false;
			this._timeout = setTimeout(() => {
				const children = childrenProps(this, 'm-touch-swipe-item');
				this.dataChildrenLength = children.length;
				let disabledIndexs = [];
				children.forEach((m, i) => {
					if (m.disabled) disabledIndexs.push(i);
				});
				this.dataDisabledIndexs = disabledIndexs;
				this.$nextTick(async () => {
					if (!this.boxEl) {
						this.boxEl = await querySelector('.m-touch-swipe--root', this);
					}
					this.show = true;
				});
			});
		},
		nextItem(moveX, moveY) {
			let index = this.dataIndex;
			if (this.direction === 'horizontal' && moveX !== 0) {
				index = moveX > 0 ? index - 1 : index + 1;
			} else if (this.direction === 'vertical' && moveY !== 0) {
				index = moveY > 0 ? index - 1 : index + 1;
			}
			const disabled = this.cmpDisabledIndexs.indexOf(index) !== -1;
			return [index, disabled];
		},
		swipeNext(moveX, moveY) {
			if (this.direction === 'horizontal') {
				return Math.abs(moveX) > this.boxEl.width * this.swipeThreshold;
			} else if (this.direction === 'vertical') {
				return Math.abs(moveY) > this.boxEl.height * this.swipeThreshold;
			}
		},
		onTouchstart(e) {
			if (this.disabled || !this.touch) return;
			this.moveing = true;
			this.touch.touchStart(e);
		},
		onTouchmove(e) {
			if (this.disabled || this.duration === 0 || !this.touch || !this.moveing) return;
			const res = this.touch.touchMove(e);
			if (!res) return;
			let { moveX, moveY } = res;
			const [nextIndex, nextDisabled] = this.nextItem(moveX, moveY);
			if (nextDisabled || nextIndex < 0 || nextIndex > this.cmpChildrenLength - 1) {
				if (this.direction === 'horizontal') {
					moveX = moveX / 4;
				} else if (this.direction === 'vertical') {
					moveY = moveY / 4;
				}
			}
			if (this.direction === 'horizontal') {
				this.translateX = Math.floor(-this.cmpItemLefts[this.dataIndex] + moveX);
			} else if (this.direction === 'vertical') {
				this.translateY = Math.floor(-this.cmpItemTops[this.dataIndex] + moveY);
			}
		},
		onTouchend(e) {
			if (this.disabled || !this.touch) return;
			this.moveing = false;
			const { moveX, moveY } = this.touch.touchEnd(e);
			if (this.direction === 'horizontal' && !moveX) return;
			else if (this.direction === 'vertical' && !moveY) return;
			const [nextIndex, nextDisabled] = this.nextItem(moveX, moveY);
			const isSwipeNext = this.swipeNext(moveX, moveY);
			if (nextDisabled || !isSwipeNext || nextIndex < 0 || nextIndex > this.cmpChildrenLength - 1) {
				if (this.direction === 'horizontal') {
					this.$nextTick(() => {
						this.translateX = -this.cmpItemLefts[this.dataIndex];
					});
				} else if (this.direction === 'vertical') {
					this.$nextTick(() => {
						this.translateY = -this.cmpItemTops[this.dataIndex];
					});
				}
				return;
			}
			this.dataIndex = nextIndex;
			if (this.direction === 'horizontal') {
				this.translateX = -this.cmpItemLefts[this.dataIndex];
			} else if (this.direction === 'vertical') {
				this.translateY = -this.cmpItemTops[this.dataIndex];
			}
			this.$emit('update:index', nextIndex);
			this.$emit('change', nextIndex);
		},
	},
};
</script>

<style lang="scss" scoped>
.m-touch-swipe--root {
	width: var(--touch-swipe-width);
	height: var(--touch-swipe-height);
	.content {
		width: 100%;
		height: 100%;
		overflow: hidden;
		.content-view {
			width: 100%;
			height: 100%;
			display: grid;
		}
	}
}
</style>
