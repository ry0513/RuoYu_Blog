import Sort from "../modles/Sort";
import User from "../modles/User";
import Article from "../modles/Article";

/**
 * @description 新增分类
 */
export const createSort = (data: Pick<Sort, "content" | "userId">) => {
    return Sort.findOrCreate({
        where: { content: data.content },
        defaults: data,
    });
};

/**
 * @description 获取分类列表（全部）
 */
export const getSortListAll = () => {
    return Sort.findAll({
        attributes: ["sortId", "content", "createdAt"],
        include: [
            {
                attributes: ["nickName"],
                model: User,
            },
            {
                attributes: ["articleId"],
                model: Article,
            },
        ],
    });
};
