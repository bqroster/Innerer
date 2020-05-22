import { issetObject } from "../../src/utils";

describe('Utils issetObject method,', () => {

    test('issetObject returns true', () => {
        expect(issetObject({ i: 1 })).toBe(true);
        expect(issetObject(Object.freeze({ j: 1 }))).toBe(true);
        expect(issetObject(Object.assign({}, { i: [] } ))).toBe(true);
        expect(issetObject(Object.seal({ name: 'myname' }))).toBe(true);

        expect(issetObject(
            Object.create({}, { items: {
                    value: 42,
                    writable: true,
                    enumerable: true,
                    configurable: true }
            })
        )).toBe(true);
    });

    test('issetObject returns false', () => {
        expect(issetObject({})).toBe(false);
        expect(issetObject(Object.create({}))).toBe(false);
        expect(issetObject(Object.assign({}))).toBe(false);
        expect(issetObject(Object.assign({}, {}))).toBe(false);
        expect(issetObject(Object.create({ p: true }))).toBe(false);
        expect(issetObject(null)).toBe(false);
        expect(issetObject(undefined)).toBe(false);
        expect(issetObject(NaN)).toBe(false);
        expect(issetObject(0)).toBe(false);
        expect(issetObject(25)).toBe(false);
        expect(issetObject(-15)).toBe(false);
        expect(issetObject(Math)).toBe(false);
        expect(issetObject(new Boolean(true))).toBe(false);
        expect(issetObject(new Boolean({}))).toBe(false);
        expect(issetObject(new Number(3))).toBe(false);
        expect(issetObject(new String('hello'))).toBe(false);
        expect(issetObject(new Date())).toBe(false);
        expect(issetObject(new RegExp('/.*/'))).toBe(false);
        expect(issetObject(new Function())).toBe(false);
        expect(issetObject(Symbol('foo'))).toBe(false);
        expect(issetObject(Object( Symbol('foo') ))).toBe(false);
        expect(issetObject(function() {})).toBe(false);
        expect(issetObject(function fnName() {})).toBe(false);
        expect(issetObject([])).toBe(false);
        expect(issetObject([1, 2])).toBe(false);
        expect(issetObject(Object.assign([]))).toBe(false);
        expect(issetObject(Object.assign([], {}))).toBe(false);
        expect(issetObject(Object.assign([], { length: 1 }))).toBe(false);
        expect(issetObject(Object.assign([2], { length: 1 }))).toBe(false);
        expect(issetObject('')).toBe(false);
    });
});