/* eslint-disable @typescript-eslint/no-explicit-any */
declare type Descendant = Element | Text;
interface IDomEditor {
    children: Descendant[];
    getHtml: () => string;
    blur: () => void;
    focus: () => void;
    isEmpty: () => boolean;
}

declare const localforage: {
    getItem: (
        key: string,
        successCallback?: () => void
    ) => Promise<string | number | object | Array<any>>;
    setItem: (
        key: string,
        value: string | number | object | Array<any>,
        successCallback?: () => void
    ) => void;
    removeItem: (key: string, successCallback?: () => void) => void;
};
