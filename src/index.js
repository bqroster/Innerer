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
let dataInners = null;

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
const QUERY_ATTR = 'data-innerer';

/**
 * @type {string}
 */
const ERROR_TAG = '[Innerer]';

/**
 * @type {string}
 */
export const DIRECTION_UP = 'up';

/**
 * @type {string}
 */
export const DIRECTION_DW = 'down';

/**
 * @type {string}
 */
export const DIRECTION_ST = 'stop';

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
export const BOTTOM_OUTER = 'bottom-outer';

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
export const EMMIT_FN_TEST = '__test_FN__';

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
 * @param {number} offHeight
 * @param {boolean} inverse
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
    return processElement(
        domRect,
        browserHeight
    );
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
 * @return {string}
 */
const getElementStatus = function(
    outerBelowView,
    outerAboveView,
    belowOutTransition,
    aboveOutTransition
) {
    let inStatus;
    if (outerBelowView >= 0 && outerBelowView < 1) {
        inStatus = BOTTOM_OUTER;
    }
    else if (outerAboveView >= 0 && outerAboveView < 1) {
        inStatus = TOP_OUTER;
    }
    else if (
        (belowOutTransition > 0 && belowOutTransition <= 1) ||
        (aboveOutTransition > 0 && aboveOutTransition <= 1)
    ) {
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
const processElPosition = function(domRect, browserHeight, direction) {
    const [
        belowOutTransition,
        aboveOutTransition,
        inTransition
    ] = processTransition(domRect, browserHeight);

    const inPosition = 1 - ((browserHeight - domRect.top) / (browserHeight || 1));

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
const processElCentered = function(domRect, browserHeight) {
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

    return (yDif > 0) ? DIRECTION_DW : ((yDif === 0) ? DIRECTION_ST : DIRECTION_UP);
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

const viewportUpdatedHandler = function() {
    // get height viewport
    const browserHeight = getBrowserHeight();
    // handle scroll direction
    const direction = handleDirection();

    dataInners.forEach( inner => {
        const innerRect = inner.getBoundingClientRect();
        try {
            emmitData({
                tag: inner.getAttribute(QUERY_ATTR),
                top: innerRect.top,
                right: innerRect.right,
                bottom: innerRect.bottom,
                left: innerRect.left,
                width: innerRect.width,
                height: innerRect.height,
                direction: direction, // [up, down, stop]
                position: processElPosition(innerRect, browserHeight, direction),
                centered: processElCentered(innerRect, browserHeight),
            });
        }
        catch(err) {
            destroyInners();
            throw Error(`${err.message}\n\n${ERROR_TAG}: Invalid function while executed, check you are using a valid function or your function content.`);
        }
    });
};

const resetValues = function() {
    DOMRef = null;
    isMounted = 'none';
    dataInners = null;
};

/**
 * @return {object}
 */
const getEmptyEmmitDataObj = function() {
    return {
        tag: EMMIT_FN_TEST,
        top: 9999,
        right: 0,
        bottom: 9999,
        left: 0,
        width: 0,
        height: 0,
        direction: DIRECTION_ST,
        position: {
            status: BOTTOM_OUTER,
            percentageInTransition: 9999,
            percentageInPosition: 9999,
            percentageOutside: 9999
        },
        centered: {
            status: BELOW_CENTER,
            percentage: 9999
        },
    };
};

/**
 * @param {any} fn
 * @return {boolean}
 */
export const isFunction = function(fn) {
    return (
        (typeof fn === 'function')
    );
};

/**
 * @param {Function} fn
 * @return {throw} Error
 */
const processDataHandler = function(fn) {
    if (!isFunction(fn))
        throw Error(`${ERROR_TAG}: Data set invalid format, expected function, got ${typeof fn}`);

    // test emmit
    try {
        fn( getEmptyEmmitDataObj() );
    }catch(err) {
        throw Error(`${err.message}\n\n${ERROR_TAG}: Invalid function while executed, check you are using a valid function or your function content.`);
    }
};

/**
 * @param {string|null} ref
 * @return {throw} Error
 */
const processRefHandler = function(ref = null) {
    if ((ref !== null && typeof ref !== 'string'))
        throw Error(`${ERROR_TAG}: Reference set invalid format, expected string, got ${typeof ref}`);
};

const DOMLoaded = function() {

    if (!((document.readyState === 'complete' || document.readyState !== 'loading'))) return;

    isMounted = 'progress';

    /**
     * give some time to
     * JS-Frameworks to load page component
     * on the router-view
     * Mostly if user installed the createrInners
     * in a lifecycle method before mounting the
     * template on the DOM (or virtual-dom)
     *
     * @param {number} counter
     */
    const processDOMQuerySelector = function(counter = 0) {

        if (counter > 25) throw Error(`${ERROR_TAG}: Reference ${DOMRef} not found on DOM.`);

        const ref = DOMRef ? document.querySelector(DOMRef) : document;

        if (ref === null) {
            setTimeout(
                processDOMQuerySelector.bind(this, counter+1),
                50
            );
        }
        else {
            DOMProcess(ref);
        }
    };

    processDOMQuerySelector();
};

/**
 *
 * @param {HTMLElement} ref
 */
const DOMProcess = function(ref) {
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
 * check DOM is loaded and execute fn()
 * @param {function} fn
 */
const DOMReady = function(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", fn);
        }
        else {
            window.onload = fn;
        }
    }
};

/**
 * @param {function} data
 * @param {string|null} ref
 */
export const createInners = function(data, ref = null) {

    processDataHandler(data);

    processRefHandler(ref);

    DOMRef = ref;
    emmitData = data;

    DOMReady( DOMLoaded );
};

export const destroyInners = function() {
    if (dataInners === undefined || dataInners === null || dataInners.length === 0) return;
    resetValues();
    window.removeEventListener('scroll', viewportUpdatedHandler);
    window.removeEventListener('resize', viewportUpdatedHandler);
};

export default {
    create: createInners,
    destroy: destroyInners
};