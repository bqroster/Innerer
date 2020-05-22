import { isObject } from "../../src/utils";

describe('Utils isObject method,', () => {

    test('isObject valid', () => {
        expect(isObject({})).toBe(true);
        expect(isObject({ i: 1 })).toBe(true);
        expect(isObject(Object.create({}))).toBe(true);
        expect(isObject(Object.assign({}))).toBe(true);
        expect(isObject(Object.freeze({ j: 1 }))).toBe(true);
        expect(isObject(Object.assign({}, { i: [] } ))).toBe(true);
        expect(isObject(Object.seal({ name: 'myname' }))).toBe(true);
        expect(isObject(Object.create({ obj: 'hello', fm: 320 }))).toBe(true);
        expect(isObject(Object.create({}, { obj: { value: 'hello' } }))).toBe(true);
        expect(isObject(Object.create({}, { obj: { value: 3, enumerable: true } }))).toBe(true);
    });

    test('isObject failed', () => {
        expect(isObject(null)).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(NaN)).toBe(false);
        expect(isObject(0)).toBe(false);
        expect(isObject(25)).toBe(false);
        expect(isObject(-15)).toBe(false);
        expect(isObject(Math)).toBe(false);
        expect(isObject(new Boolean(true))).toBe(false);
        expect(isObject(new Boolean({}))).toBe(false);
        expect(isObject(new Number(3))).toBe(false);
        expect(isObject(new String('hello'))).toBe(false);
        expect(isObject(new Date())).toBe(false);
        expect(isObject(new RegExp('/.*/'))).toBe(false);
        expect(isObject(new Function())).toBe(false);
        expect(isObject(Symbol('foo'))).toBe(false);
        expect(isObject(Object( Symbol('foo') ))).toBe(false);
        expect(isObject(function() {})).toBe(false);
        expect(isObject(function fnName() {})).toBe(false);
        expect(isObject([])).toBe(false);
        expect(isObject([1, 2])).toBe(false);
        expect(isObject(Object.assign([]))).toBe(false);
        expect(isObject(Object.assign([], {}))).toBe(false);
        expect(isObject(Object.assign([], { length: 1 }))).toBe(false);
        expect(isObject(Object.assign([2], { length: 1 }))).toBe(false);
        expect(isObject('')).toBe(false);
    });
});