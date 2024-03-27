export function querySelector(selectors, component, all = false) {
	const selectFn = all ? 'selectAll' : 'select';
	return new Promise((resolve, reject) => {
		try {
			uni.createSelectorQuery()
				.in(component)[selectFn](selectors)
				.boundingClientRect((data) => {
					resolve(data);
				})
				.exec();
		} catch (e) {
			reject(e);
		}
	});
}
