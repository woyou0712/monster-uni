export default class TouchEvent {
	startX = null;
	startY = null;
	moveX = null;
	moveY = null;
	// 滑动的最小距离
	minDis = 50;
	timeout = null;

	constructor(minDis = 50) {
		this.minDis = minDis
	}

	_getInfo(e) {
		return e.changedTouches?.length ? e.changedTouches[0] : e
	}

	// 滑动开始
	touchStart(e) {
		const {
			pageX,
			pageY
		} = this._getInfo(e);
		this.startX = pageX;
		this.startY = pageY;
	}
	touchMove(e) {
		if (this.startX === null || this.startY === null) return null
		const {
			pageX,
			pageY
		} = this._getInfo(e);
		const moveX = pageX - this.startX;
		const moveY = pageY - this.startY;
		if (Math.abs(moveX - this.moveX) < 1 && Math.abs(moveY - this.moveY) < 1) {
			return null
		}
		this.moveX = moveX;
		this.moveY = moveY;

		return {
			moveX,
			moveY
		}
	}
	// 滑动结束
	touchEnd(e) {
		if (this.startX === null || this.startY === null) {
			return {
				direction: null,
				moveX: 0,
				moveY: 0
			}
		}
		const {
			pageX,
			pageY
		} = this._getInfo(e);
		const moveX = pageX - this.startX;
		const moveY = pageY - this.startY;
		this.startX = null;
		this.startY = null;
		this.moveX = null;
		this.moveY = null;
		let direction = null

		if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > this.minDis) {
			if (moveX > 0) {
				direction = "right"
			} else {
				direction = "left"
			}
		}
		if (Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > this.minDis) {
			if (moveY > 0) {
				direction = "down"
			} else {
				direction = "up"
			}
		}

		return {
			direction,
			moveX,
			moveY
		}
	}
}