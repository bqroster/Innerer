export default (function() {

    /**
     * @type {number}
     */
    let bodyScrollX;

    /**
     * @type {number}
     */
    let bodyScrollY;

    /**
     * @type {NodeList}
     */
    let dataInners;

    /**
     * @type {function|object}
     */
    let emmitData;

    /**
     * @type {string}
     */
    const DIRECTION_UP = 'up';

    /**
     * @type {string}
     */
    const DIRECTION_DW = 'down';

    /**
     * check DOM is loaded and execute fn()
     * @param {function} fn
     */
    const DOMReady = function(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    /**
     * @return {number}
     */
    const getBodyScrollX = function() {
        return (
            window.pageXOffset ||
            document.documentElement.scrollLeft ||
            document.body.scrollLeft
        );
    };

    /**
     * @return {number}
     */
    const getBodyScrollY = function() {
        return (
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop
        );
    };

    /**
     * @return {number}
     */
    const getBrowserWidth = function() {
        return (window.innerWidth || document.documentElement.clientWidth);
    };

    /**
     * @return {number}
     */
    const getBrowserHeight = function() {
        return (window.innerHeight || document.documentElement.clientHeight);
    };

    /**
     * @param {number} val
     * @param {number} total
     * @return {number}
     */
    const getPercentage = function(val, total) {
        const offset = (val > 0) ? (val / (total || 1)) : 0;
        return (offset > 1 ? 1 : offset);
    };

    /**
     * @param {number} browserHeight
     * @param {DOMRect} domRect
     * @return {number}
     */
    const getPercentageViewport = function(browserHeight, domRect) {
        return (
            getPercentage(
                browserHeight - domRect.top,
                domRect.height
            ) *
            getPercentage(
                domRect.bottom,
                domRect.height
            )
        ).toFixed(4);
    };

    /**
     * @param {DOMRect} domRect
     * @param {number} yRef
     * @param {string} direction
     * @return {number}
     */
    const getPercentageCentered = function(browserHeight, domRect) {
        const inTop = browserHeight - domRect.top;
        const per = (inTop > 0) ? (inTop / (domRect.height || 1)).toFixed(4) : 0;
        return (per > 1 ? 1 : per);
    };

    /**
     * @param {number} _bodyScrollX
     * @param {number} _bodyScrollY
     * @return {string}
     */
    const getDirection = function(_bodyScrollX, _bodyScrollY) {
        const yDif = _bodyScrollY - bodyScrollY;

        return (yDif > 0) ? DIRECTION_UP : DIRECTION_DW;
    };

    const viewportUpdatedHandler = function(ev) {
        if (typeof emmitData === 'function') {

            // get height viewport
            const browserHeight = getBrowserHeight();

            // ac set direction
            const _bodyScrollY = getBodyScrollY();
            const _bodyScrollX = getBodyScrollX();
            const direction = getDirection(_bodyScrollX, _bodyScrollY);
            bodyScrollY = _bodyScrollY;
            bodyScrollX = _bodyScrollX;

            dataInners.forEach( inner => {
                const innerRect = inner.getBoundingClientRect();
                emmitData({
                    top: innerRect.top,
                    right: innerRect.right,
                    bottom: innerRect.bottom,
                    left: innerRect.left,
                    status: 'exit', // [exit, top-out, top-in, bottom-in, bottom-out, enter],
                    direction: direction, // [up, down, left, right]
                    percentageViewport: getPercentageViewport(browserHeight, innerRect),
                    percentageCentered: getPercentageCentered(browserHeight/2, innerRect),
                });
            });
        }
    };

    const mounted = function() {
        // ac read all the attributes `innerer`
        dataInners = document.querySelectorAll('[innerer]');

        if (dataInners.length === 0) {
            console.warn('[Innerer]: There is no elements to track in current document.');
            return;
        }

        // ac get current scroll X-Y
        bodyScrollX = getBodyScrollX();
        bodyScrollY = getBodyScrollY();

        // ac set listeners for scroll and resize
        window.addEventListener('scroll', viewportUpdatedHandler);
        window.addEventListener('resize', viewportUpdatedHandler);
    };

    /**
     * @param {function|object} data
     */
    const create = function(data = null) {
        emmitData = typeof data === 'function' ? data : Object.create(data);
        DOMReady( mounted );
    };

    const destroy = function() {
        if (dataInners.length === 0) return;
        window.removeEventListener('scroll', viewportUpdatedHandler);
        window.removeEventListener('resize', viewportUpdatedHandler);
    };

    return {
        create,
        destroy
    }
})();