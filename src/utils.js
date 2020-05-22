/**
 * @param {*} val
 * @return {boolean}
 */
export function isNull(val) {
    return (
        (val === undefined) ||
        (val === null) ||
        (typeof val === 'number' && isNaN(val))
    );
}

/**
 * @param {*} val
 * @return {boolean}
 */
export function isObject(val) {
    return (
        !isNull(val) &&
        val.toString() === '[object Object]'
    );
}

/**
 * @param {*} val
 * @return {boolean}
 */
export function issetObject(val) {
    return (
        isObject(val) &&
        Object.keys( val ).length > 0
    );
}