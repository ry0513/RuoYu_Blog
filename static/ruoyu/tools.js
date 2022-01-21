/**
 * @description 工具类
 * @author RuoYu
 * @date 2021/12/31 09:40:31
 * @class Tools
 */
class Tools {
    /**
     * @description 获取url中键值对中的值
     * @param {String} key
     * @return {String|undefined}
     * @memberof Tools
     */
    getUrlValue(key) {
        const query = window.location.search.substring(1);
        const arr = query.split("&");
        for (const item of arr) {
            const pair = item.split("=");
            if (pair[0] === key) {
                return pair[1];
            }
        }
        return undefined;
    }

    /**
     * @description 格式化数据
     * @param {Object} [obj={}]
     * @return {String}
     * @memberof Tools
     */
    stringify(obj = {}) {
        const arr = [];
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                arr.push(`${key}=${obj[key]}`);
            }
        }
        return arr.join("&");
    }

    /**
     * @description 弹出层
     * @param {*} { description, closeTimeout = 2000, type = "success" }
     * @memberof Tools
     */
    notify({ description, closeTimeout = 2000, type = "success" }) {
        GrowlNotification.notify({
            description: description,
            closeTimeout,
            type,
            image: { visible: true },
        });
    }

    dayjs(date) {
        date = new Date(date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // toJSON 的时区补偿
        return date.toJSON().substr(0, 19).replace(/[T]/, " ");
    }
}

const $ryTools = new Tools();
