class Dom {
    elements: Array<HTMLElement>;
    element: HTMLElement;
    constructor(selector: string) {
        this.elements = Dom.getSelector(selector);
        this.element = this.get();
        return this;
    }

    /**
     * @description 获取元素
     * @static
     * @param {string} selector
     * @return {*}  {Array<HTMLElement>}
     * @memberof Dom
     */
    static getSelector(selector: string): Array<HTMLElement> {
        const idRegex = /^#(?:[\w-]|\\.|[^\x20-\xa0])*$/;
        if (idRegex.test(selector)) {
            const el = document.getElementById(selector.substring(1));
            return el ? [el] : [];
        }
        return [].slice.call(document.querySelectorAll(selector) || []);
    }

    /**
     * @description 获取元素
     * @param {number} [index=0]
     * @return {*}  {Element}
     * @memberof Dom
     */
    get(index = 0): HTMLElement {
        return this.elements[index];
    }

    /**
     * @description 遍历元素
     * @param {() => void} func
     * @return {*}  {Dom}
     * @memberof Dom
     */
    each(func: (el: HTMLElement) => void): Dom {
        this.elements.forEach((el) => {
            func(el);
        });
        return this;
    }

    /**
     * @description 添加class
     * @param {string} [classNames=""]
     * @return {*}  {Dom}
     * @memberof Dom
     */
    addClass(classNames = ""): Dom {
        this.each((el) => {
            classNames.split(" ").forEach((className) => {
                className && el.classList.add(className);
            });
        });
        return this;
    }

    /**
     * @description 获取/设置 innerHTML
     * @param {string} html
     * @return {*}  {(string | undefined | Dom)}
     * @memberof Dom
     */
    html(html?: string): string | undefined | Dom {
        if (html === undefined) {
            if (!this.element) {
                return undefined;
            }
            return this.element.innerHTML;
        }
        this.each((el) => {
            el.innerHTML = html;
        });
        return this;
    }

    /**
     * @description  获取/设置 value
     * @param {string} value
     * @return {*}  {(string | undefined | Dom)}
     * @memberof Dom
     */
    val(value?: string): string | undefined | Dom {
        if (value === undefined) {
            if (!this.element) {
                return undefined;
            }
            return (this.element as HTMLInputElement).value;
        }
        this.each((el) => {
            (el as HTMLInputElement).value = value;
        });
        return this;
    }

    /**
     * @description 添加点击事件
     * @param {() => void} func
     * @return {*}
     * @memberof Dom
     */
    click(func: (e?: Event) => void) {
        this.each((el) => {
            el.addEventListener("click", func, false);
        });
        return this;
    }

    /**
     * @description 设置/获取属性
     * @param {string} attr
     * @param {string} val
     * @return {*}
     * @memberof Dom
     */
    attr(attr: string, val?: string) {
        if (val === undefined) {
            if (!this.element) {
                return undefined;
            }
            return this.element.getAttribute(attr) || undefined;
        }
        this.each((el) => {
            el.setAttribute(attr, val);
        });
        return this;
    }

    /**
     * @description 添加子元素
     * @param {HTMLElement} ele
     * @return {*}
     * @memberof Dom
     */
    append(ele: HTMLElement) {
        this.each((el) => {
            el.appendChild(ele);
        });
        return this;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $ry = (selector: string) => {
    return new Dom(selector);
};
