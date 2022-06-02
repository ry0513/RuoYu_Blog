import { RouteRecordRaw } from "vue-router";

const routeAllPathToCompMap = import.meta.glob(`../**/*.vue`);

const formatRoute = (list: Array<RouteRecordRaw>): Array<RouteRecordRaw> => {
    const newList = formatRouteList(list);

    newList.push({
        path: "/:w+",
        name: "404",
        component: () => import(`@/pages/error/404.vue`),
    });

    console.log(newList);
    return newList;
};

const formatRouteList = (
    list: Array<RouteRecordRaw>
): Array<RouteRecordRaw> => {
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
            route.children = formatRouteList(item.children);
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
