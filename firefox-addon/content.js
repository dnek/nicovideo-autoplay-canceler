(function () {
    'use strict';

    let lastHref = '';
    let isCanceled = false;

    const observer = new MutationObserver((mutationList, observer) => {
        mutationList.filter(mutation => mutation.type === 'childList').forEach(mutation => {
            for (const node of mutation.addedNodes) {
                if (
                    node.nodeType === 1 &&
                    node.innerHTML.includes('aria-label="再生する"')
                ) {
                    const buttonEl = node.querySelector('button[aria-label="再生する"]');
                    buttonEl.addEventListener('click', () => {
                        if (isCanceled) {
                            return;
                        }

                        isCanceled = true;
                        console.log(`Autoplay cancel won't be executed because play button was clicked.`);
                    });
                    console.log('nicovideo-autoplay-canceler listener added to button.');
                }
            }
        });
    });
    const options = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, options);

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
            console.log(`Autoplay cancel won't be executed because ${e.code} was pressed.`);
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

        const ctxEl = document.getElementById('menu::r5::ctx-trigger');
        if (ctxEl !== null && !ctxEl.dataset.napcTriggered) {
            ctxEl.addEventListener('click', () => {
                if (isCanceled) {
                    return;
                }

                isCanceled = true;
                console.log(`Autoplay cancel won't be executed because player was clicked.`);
            });
            ctxEl.dataset.napcTriggered = true;
            console.log('nicovideo-autoplay-canceler listener added to ctx.');
        }

        if (isCanceled) {
            return;
        }

        const videoEl = document.querySelector('video[data-name="video-content"]');
        if (videoEl === null || videoEl.paused || videoEl.ended) {
            return;
        }

        isCanceled = true;
        videoEl.pause();
        console.log('video paused.');

        if (videoEl.currentTime < 3) {
            const rewindButton = document.querySelector('button[aria-label$=" 秒戻る"]');
            if (rewindButton !== null) {
                rewindButton.click();
                console.log('rewind button clicked.');
            }
        }
    }, 0);
})();
