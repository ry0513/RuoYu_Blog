class Dom {
    constructor(selector) {
        this.elements = Dom.getSelector(selector);
        this.element = this.get(0);
        return this;
    }

    /**
     * @description 获取元素
     * @static
     * @param {string} selector 选择器
     * @param {*} context
     * @return {*}
     * @memberof Dom
     */
    static getSelector(selector, context) {
        if (selector && typeof selector !== "string") {
            if (selector.length !== undefined) {
                return selector;
            }
            return [selector];
        }
        context = context || document;
        const idRegex = /^#(?:[\w-]|\\.|[^\x00-\xa0])*$/;
        if (idRegex.test(selector)) {
            const el = document.getElementById(selector.substring(1));
            return el ? [el] : [];
        }
        return [].slice.call(context.querySelectorAll(selector) || []);
    }

    /**
     * @description 获取指定元素(核心)
     * @param {number} index
     * @return {*}
     * @memberof Dom
     */
    get(index) {
        if (index !== undefined) {
            return this.elements[index];
        }
        return this.elements;
    }

    /**
     * @description 遍历元素(核心)
     * @param {function} func 方法
     * @return {*}
     * @memberof Dom
     */
    each(func) {
        if (!this.elements.length) {
            return this;
        }
        this.elements.forEach((el, index) => {
            func.call(el, el, index);
        });
        return this;
    }

    /**
     * @description 添加类名
     * @param {string} [classNames=""]
     * @return {*}
     * @memberof Dom
     */
    addClass(classNames = "") {
        this.each((el) => {
            classNames.split(" ").forEach((className) => {
                className && el.classList.add(className);
            });
        });
        return this;
    }

    /**
     * @description 设置/获取innerHTML
     * @param {string} [html]
     * @return {*}
     * @memberof Dom
     */
    html(html) {
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
     * @description 设置/获取value
     * @param {string} [value]
     * @return {*}
     * @memberof Dom
     */
    val(value) {
        if (value === undefined) {
            if (!this.element) {
                return undefined;
            }
            return this.element.value;
        }
        this.each((el) => {
            el.value = value;
        });
        return this;
    }

    /**
     * @description 设置/获取属性
     * @param {string} attr
     * @param {string} [val]
     * @return {*}
     * @memberof Dom
     */
    attr(attr, val) {
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
     * @description 添加click事件
     * @param {function} func
     * @return {*}
     * @memberof Dom
     */
    click(func) {
        this.each((el) => {
            el.addEventListener("click", func, false);
        });
        return this;
    }

    /**
     * @description 添加on事件
     * @param {function} func
     * @return {*}
     * @memberof Dom
     */
    on(eventName, ele, func) {
        document.addEventListener(
            eventName,
            function (e) {
                // loop parent nodes from the target to the delegation node
                for (var target = e.target; target && target != this; target = target.parentNode) {
                    if (target.matches(ele)) {
                        func.call(target, e);
                        break;
                    }
                }
            },
            false
        );
        return this;
    }

    /**
     * @description 添加子元素
     * @param {*} ele
     * @return {*}
     * @memberof Dom
     */
    append(ele) {
        this.each((el) => {
            el.appendChild(ele);
        });
        return this;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function $ry(selector) {
    return new Dom(selector);
}
