import instance from "@/utils/request";

// 获取个人信息

export function addTag(data: { content: string; reason?: string }) {
    return instance({
        url: "/tag",
        method: "post",
        data,
    });
}
