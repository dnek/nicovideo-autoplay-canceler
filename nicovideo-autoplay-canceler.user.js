// ==UserScript==
// @name        nicovideo-autoplay-canceler
// @namespace   https://github.com/dnek
// @version     2.0
// @author      dnek
// @description ニコニコ動画で動画の自動再生が開始された直後に自動的に一時停止します。停止に少しラグがあるため、停止時の再生時間が3秒未満の場合は0秒まで戻します。「nicovideo-next-video-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @description:ja    ニコニコ動画で動画の自動再生が開始された直後に自動的に一時停止します。停止に少しラグがあるため、停止時の再生時間が3秒未満の場合は0秒まで戻します。「nicovideo-next-video-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @homepageURL https://github.com/dnek/nicovideo-autoplay-canceler
// @updateURL   https://github.com/dnek/nicovideo-autoplay-canceler/raw/main/nicovideo-autoplay-canceler.user.js
// @downloadURL https://github.com/dnek/nicovideo-autoplay-canceler/raw/main/nicovideo-autoplay-canceler.user.js
// @match       https://www.nicovideo.jp/watch/*
// @grant       none
// @license     MIT license
// ==/UserScript==

(function () {
    'use strict';

    let lastHref = '';
    let isCanceled = false;

    setInterval(() => {
        const href = location.href;
        if (lastHref !== href) {
            lastHref = href;
            console.log(`href changed to ${href}`);
            isCanceled = false;
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
