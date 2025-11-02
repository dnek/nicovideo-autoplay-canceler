(function () {
	'use strict';

	let lastHref = '';
	let isCanceled = false;

	document.addEventListener('keydown', (e) => {
		if (isCanceled) {
			return;
		}

		if (e.target && ['input', 'textarea'].includes(e.target.tagName.toLowerCase())) {
			return;
		}
		if (e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) {
			return;
		}

		if (e.code === 'Space' || e.code === 'KeyK') {
			isCanceled = true;
			console.log(`pause canceled because ${e.code} was pressed.`);
		}
	});

	setInterval(() => {
		const href = location.href;
		if (lastHref !== href) {
			lastHref = href;
			console.log(`href changed to ${href}`);
			isCanceled = false;
		}

		if (!lastHref.startsWith('https://www.nicovideo.jp/watch/')) {
			return;
		}

		const addClickListener = (selector, target) => {
			const el = document.querySelector(selector);
			if (el === null || el.dataset.napcClickListener) {
				return;
			}

			el.addEventListener('click', () => {
				if (isCanceled) {
					return;
				}

				isCanceled = true;
				console.log(`pause canceled because ${target} was clicked.`);
			});
			el.dataset.napcClickListener = true;
			console.log(`nicovideo-autoplay-canceler click listener added to ${target}`);
		};
		addClickListener('div[data-part="context-trigger"]:has(>div[data-name="stage"])', 'video');
		addClickListener('button[aria-label="再生する"]', 'play button');

		if (isCanceled) {
			return;
		}

		const videoEl = document.querySelector('video[data-name="video-content"]');
		if (videoEl === null || videoEl.paused || videoEl.ended) {
			return;
		}

		videoEl.pause();
		console.log('pause executed.');

		if (videoEl.currentTime < 3) {
			const rewindButton = document.querySelector('button[aria-label$=" 秒戻る"]');
			if (rewindButton !== null) {
				rewindButton.click();
				console.log('rewind button clicked.');
			}
		}
	});
})();
