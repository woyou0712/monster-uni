let windowWidth = null;

export function rpx2px(rpx) {
	if (!rpx) return '0';
	let str = rpx;
	if (isNaN(str)) {
		if (/^\d+px$/i.test(str)) {
			return str
		} else if (/^\d+rpx/i.test(str)) {
			str = str.slice(0, -3)
		} else {
			return str
		}
	}
	if (windowWidth == null) {
		windowWidth = uni.getSystemInfoSync().windowWidth;
	}
	let px = (str * windowWidth) / 750;
	return `${px}px`;
}