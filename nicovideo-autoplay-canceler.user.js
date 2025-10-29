// ==UserScript==
// @name        nicovideo-autoplay-canceler
// @namespace   https://github.com/dnek
// @version     2.6
// @author      dnek
// @description ニコニコ動画で動画の自動再生が開始された直後に自動的に一時停止します。停止に少しラグがあるため、停止時の再生時間が3秒未満の場合は0秒まで戻します。「nicovideo-next-video-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @description:ja    ニコニコ動画で動画の自動再生が開始された直後に自動的に一時停止します。停止に少しラグがあるため、停止時の再生時間が3秒未満の場合は0秒まで戻します。「nicovideo-next-video-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @homepageURL https://github.com/dnek/nicovideo-autoplay-canceler
// @updateURL   https://github.com/dnek/nicovideo-autoplay-canceler/raw/main/nicovideo-autoplay-canceler.user.js
// @downloadURL https://github.com/dnek/nicovideo-autoplay-canceler/raw/main/nicovideo-autoplay-canceler.user.js
// @match       https://www.nicovideo.jp/*
// @grant       none
// @license     MIT license
// ==/UserScript==

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
        addClickListener('video[data-name="video-content"]', 'video');
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
