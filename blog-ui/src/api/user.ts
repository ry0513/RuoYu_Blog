import instance from "@/utils/request";

// 获取个人信息

export function getUserInfo() {
    return instance({
        url: "/user/userInfo",
        method: "get",
    });
}

export function getappPackage() {
    return instance({
        url: "/user/resister",
        method: "get",
        params: { nickName: 111, password: "555" },
    });
}
