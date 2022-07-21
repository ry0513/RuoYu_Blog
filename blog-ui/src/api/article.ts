import instance from "@/utils/request";

// 文章相关

// 创建
// export function createArticle(data: { status: number; title: string; html: string; content: string; sortId?: number; tags?: number[]; passwd?: string }) {
//     return instance({
//         url: "/article",
//         method: "post",
//         data,
//     });
// }

export function createArticle(data: Article) {
    return instance({
        url: "/article",
        method: "post",
        data,
    });
}
// 编辑
export function updateArticle(data: Article) {
    return instance({
        url: "/article",
        method: "put",
        data,
    });
}

// 编辑时回显
export function getArticleByEdit(articleId: number) {
    return instance({
        url: "/article/control/" + articleId,
        method: "get",
    });
}

// 列表（分页）
export function getArticleList(params?: { status: Status; content: string; sortId: number | null; current: number; pageSize: number }) {
    return instance({
        url: "/article/control/list",
        params,
    });
}

// // 列表（全部，简略属性）
// export function getSortListAll() {
//     return instance({
//         url: "/sort/list/all",
//     });
// }
