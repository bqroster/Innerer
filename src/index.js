/**
 * @type {string}
 */
let isMounted = 'none'; // [none|progress|completed]

/**
 * @type {number}
 */
let bodyScrollY;

/**
 * @type {NodeList}
 */
let dataInners;

/**
 * @type {string}
 */
let DOMRef = null;

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
 * @type {string}
 */
const DIRECTION_ST = 'stop';

/**
 * @type {string}
 */
const QUERY_ATTR = 'data-innerer';

/**
 * @type {string}
 */
const ERROR_TAG = '[Innerer]';

/**
 * @type {string}
 */
export const ENTERED = 'entered';

/**
 * @type {string}
 */
export const TOP_OUTER = 'top-outer';

/**
 * @type {string}
 */
export const TOP_LEAVING = 'top-leaving';

/**
 * @type {string}
 */
export const BOTTOM_OUTER = 'bottom-outer';

/**
 * @type {string}
 */
export const TOP_ENTERING = 'top-entering';

/**
 * @type {string}
 */
export const BELOW_CENTER = 'below_center';

/**
 * @type {string}
 */
export const ABOVE_CENTER = 'above_center';

/**
 * @type {string}
 */
export const BOTTOM_LEAVING = 'bottom-leaving';

/**
 * @type {string}
 */
export const BOTTOM_ENTERING = 'bottom-entering';

/**
 * @type {string}
 */
export const TOP_OUTER_PROCESS = 'top-outer-process';

/**
 * @type {string}
 */
export const BOTTOM_OUTER_PROCESS = 'bottom-outer-process';

/**
 * check DOM is loaded and execute fn()
 * @param {function} fn
 */
const DOMReady = function(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('readystatechange', fn);
    }
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
    return ((offset > 1 || offset < 0) ? 1 : offset);
};

/**
 * @param {DOMRect} domRect
 * @param {number} browserHeight
 * @return {number[]}
 */
const processElement = function(
    domRect,
    browserHeight,
    offHeight = 0,
    inverse = false
) {
    const belowEl = getPercentage(
        (browserHeight + offHeight) - domRect.top,
        domRect.height
    );

    const aboveEl = getPercentage(
        domRect.bottom + offHeight,
        domRect.height
    );

    return [
        belowEl,
        aboveEl,
        (inverse && 1 || 0) - ((!inverse && -1 || 1) * belowEl * aboveEl)
    ];
};

/**
 * @param {DOMRect} domRect
 * @param {number} browserHeight
 * @return {number[]}
 */
const processTransition = function(domRect, browserHeight) {
    return processElement(domRect, browserHeight);
};

/**
 * @param {DOMRect} domRect
 * @param {number} browserHeight
 * @return {number[]}
 */
const processOutside = function(domRect, browserHeight) {
    return processElement(
        domRect,
        browserHeight,
        domRect.height,
        true
    );
};

/**
 * @param {number} outerBelowView
 * @param {number} outerAboveView
 * @param {number} belowOutTransition
 * @param {number} aboveOutTransition
 * @param {string} direction
 * @return {string}
 */
const getElementStatus = function(
    outerBelowView,
    outerAboveView,
    belowOutTransition,
    aboveOutTransition,
    direction
) {
    let inStatus;
    if (outerBelowView === 0) {
        inStatus = BOTTOM_OUTER;
    }
    else if (outerAboveView === 0) {
        inStatus = TOP_OUTER;
    }
    else if (outerBelowView > 0 && outerBelowView < 1) {
        inStatus = BOTTOM_OUTER_PROCESS;
    }
    else if (outerAboveView > 0 && outerAboveView < 1) {
        inStatus = TOP_OUTER_PROCESS;
    }
    else if (belowOutTransition > 0 && belowOutTransition < 1) {
        inStatus = direction === DIRECTION_DW ? BOTTOM_LEAVING : BOTTOM_ENTERING;
    }
    else if (aboveOutTransition > 0 && aboveOutTransition < 1) {
        inStatus = direction === DIRECTION_DW ? TOP_ENTERING : TOP_LEAVING;
    }
    else if (belowOutTransition === 1 && aboveOutTransition === 1) {
        inStatus = ENTERED;
    }

    return inStatus;
};

/**
 * @param {DOMRect} domRect
 * @param {number} browserHeight
 * @param {string} direction
 * @return {object}
 */
const processViewport = function(domRect, browserHeight, direction) {
    const [
        belowOutTransition,
        aboveOutTransition,
        inTransition
    ] = processTransition(domRect, browserHeight);

    const inPosition = Math.ceil(inTransition) * (1 - getPercentage(browserHeight - domRect.top, browserHeight));

    const [
        outerBelowView,
        outerAboveView,
        inOuter
    ] = processOutside(domRect, browserHeight);

    return {
        status: getElementStatus(
            outerBelowView,
            outerAboveView,
            belowOutTransition,
            aboveOutTransition,
            direction
        ),
        percentageInTransition: Number(inTransition.toFixed(4)),
        percentageInPosition: Number(inPosition.toFixed(4)),
        percentageOutside: Number(inOuter.toFixed(4))
    };
};

/**
 * @param {DOMRect} domRect
 * @param {number} browserHeight
 * @return {object}
 */
const processCentered = function(domRect, browserHeight) {
    const yCenter = (browserHeight / 2);
    const belowCenter = getPercentage(
        browserHeight - (domRect.top + (domRect.height/2)),
        yCenter
    );
    const aboveCenter = getPercentage(
        domRect.top + (domRect.height/2),
        yCenter
    );
    return {
        status: belowCenter < 1 ? BELOW_CENTER : ABOVE_CENTER,
        percentage: Number((belowCenter * aboveCenter).toFixed(4))
    };
};

/**
 * @param {number} _bodyScrollY
 * @return {string}
 */
const getDirection = function(_bodyScrollY) {
    const yDif = _bodyScrollY - bodyScrollY;

    return (yDif > 0) ? DIRECTION_UP : ((yDif === 0) ? DIRECTION_ST : DIRECTION_DW);
};

/**
 * @return {string}
 */
const handleDirection = function() {
    // ac set direction
    const _bodyScrollY = getBodyScrollY();
    const direction = getDirection(_bodyScrollY);
    bodyScrollY = _bodyScrollY;

    return direction;
};

const viewportUpdatedHandler = function(ev) {
    if (typeof emmitData === 'function') {

        // get height viewport
        const browserHeight = getBrowserHeight();
        // handle scroll direction
        const direction = handleDirection();

        dataInners.forEach( inner => {
            const innerRect = inner.getBoundingClientRect();
            emmitData({
                tag: inner.getAttribute(QUERY_ATTR),
                top: innerRect.top,
                right: innerRect.right,
                bottom: innerRect.bottom,
                left: innerRect.left,
                width: innerRect.width,
                height: innerRect.height,
                direction: direction, // [up, down, stop]
                viewport: processViewport(innerRect, browserHeight, direction),
                centered: processCentered(innerRect, browserHeight),
            });
        });
    }
};

const mounted = function(ev) {

    if (!(ev.target.readyState === 'complete' && isMounted === 'none')) return;

    isMounted = 'progress';
    document.removeEventListener('readystatechange', mounted);

    const ref = DOMRef ? document.querySelector(DOMRef) : document;
    if (ref === null) throw Error(`${ERROR_TAG}: Reference ${DOMRef} not found on DOM.`);

    // ac read all the attributes `innerer`
    dataInners = ref.querySelectorAll(`[${QUERY_ATTR}]`);

    if (dataInners.length === 0) {
        console.warn(`${ERROR_TAG}: There is no elements to track in current document.`);
        return;
    }

    // ac get current scroll Y
    bodyScrollY = getBodyScrollY();

    // ac set listeners for scroll and resize
    window.addEventListener('scroll', viewportUpdatedHandler);
    window.addEventListener('resize', viewportUpdatedHandler);

    isMounted = 'completed';
};

/**
 * @param {string} ref
 * @param {function|object} data
 */
export const createInners = function(data, ref = null) {

    const _dataPrototype = Object.getPrototypeOf(data);
    if (
        false &&
        ! (
            typeof _dataPrototype === 'function' ||
            (
                'hasOwnProperty' in _dataPrototype &&
                Object.keys( _dataPrototype.valueOf() ).length > 1
            )
        )
    ) throw Error(`${ERROR_TAG}: Data set invalid format, expected function or object, got ${typeof _dataPrototype.valueOf()}`);

    DOMRef = ref;
    emmitData = typeof data === 'function' ? data : Object.create( data );

    DOMReady( mounted );
};

export const destroyInners = function() {
    if (dataInners.length === 0) return;
    window.removeEventListener('scroll', viewportUpdatedHandler);
    window.removeEventListener('resize', viewportUpdatedHandler);
};

export default {
    create: createInners,
    destroy: destroyInners
};