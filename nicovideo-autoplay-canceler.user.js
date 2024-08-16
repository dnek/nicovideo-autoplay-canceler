// ==UserScript==
// @name        nicovideo-autoplay-canceler
// @namespace   https://github.com/dnek
// @version     1.2
// @author      dnek
// @description Immediately after video autoplay starts in nicovideo, automatically click the play button to pause the video.
// @description:ja    ニコニコ動画で動画の自動再生が開始された直後に、自動的に再生ボタンをクリックして動画を一時停止します。「nicovideo-next-video-canceler」「nicovideo-player-expander」は別のスクリプトです。
// @homepageURL https://github.com/dnek/nicovideo-autoplay-canceler
// @updateURL   https://github.com/dnek/nicovideo-autoplay-canceler/raw/main/nicovideo-autoplay-canceler.user.js
// @downloadURL https://github.com/dnek/nicovideo-autoplay-canceler/raw/main/nicovideo-autoplay-canceler.user.js
// @match       https://www.nicovideo.jp/watch/*
// @grant       none
// @license     MIT license
// ==/UserScript==

(function () {
    'use strict';

    let currentHref = '';
    let isCanceled = false;

    const observePlayButton = (parentNode) => {
        const buttonEl = parentNode.querySelector('button[aria-label="再生する"]');
        if (buttonEl !== null) {
            const playButtonObserver = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (isCanceled) {
                        break;
                    }
                    if (mutation.type !== 'attributes') {
                        continue;
                    }
                    const attrName = mutation.attributeName;
                    if (attrName === 'aria-label') {
                        const attr = buttonEl.getAttribute(attrName);
                        console.log(`${attrName} changed to ${attr}`);
                        if (attr === '一時停止する') {
                            buttonEl.click();
                            isCanceled = true;
                            console.log('autoplay canceled.');
                            break;
                        }
                    }
                }
            });

            playButtonObserver.observe(buttonEl, {
                attributes: true,
                attributeFilter: ['aria-label'],
            });
        } else {
            console.log("no play button.");
        }
    };

    const observer = new MutationObserver((mutationList, observer) => {
        const href = location.href;
        if (currentHref !== href) {
            currentHref = href;
            console.log(`href changed to ${currentHref}`);
            isCanceled = false;
        }
        mutationList.filter(mutation => mutation.type === 'childList').forEach(mutation => {
            for (const node of mutation.addedNodes) {
                if (
                    node.nodeType === 1 &&
                    node.innerHTML.includes('aria-label="再生する"')
                ) {
                    observePlayButton(node);
                }
            }
        });
    });
    const options = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, options);
})();
