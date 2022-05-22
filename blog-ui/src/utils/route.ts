import { RouteRecordRaw } from "vue-router";

const routeAllPathToCompMap = import.meta.glob(`../**/*.vue`);
const formatRoute = (list: Array<RouteRecordRaw>): Array<RouteRecordRaw> => {
    const newList: Array<RouteRecordRaw> = [];
    list.filter((item) => {
        const route: RouteRecordRaw = {
            path: item.path,
            name: item.name,
            component: routeAllPathToCompMap[`../${item.component}.vue`],
            meta: item.meta,
        };
        if (item.redirect) {
            route.redirect = item.redirect;
        }
        if (item.children) {
            route.children = formatRoute(item.children);
        }
        newList.push(route);
    });
    return newList;
};

export default formatRoute;

export const getPath = (path: string, maxLevel: number) => {
    return path
        .split("/")
        .filter(
            (_item: string, index: number) => index <= maxLevel && index > 0
        )
        .map((item: string) => `/${item}`)
        .join("");
};
