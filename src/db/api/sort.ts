import Sort from "../modles/Sort";
import Article from "../modles/Article";
import User from "../modles/User";

/**
 * @description 获取标签列表
 */
export const getSortList = (where: { userId?: number }, offset: number, limit: number) => {
    return Sort.findAll({
        order: [["sortId", "DESC"]],
        where,
        offset,
        limit,
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

/**
 * @description 获取指定标签
 */
export const getSort = (sortId: number) => {
    return Sort.findOne({
        where: {
            sortId,
        },
        include: [
            {
                attributes: ["articleId"],
                model: Article,
            },
        ],
    });
};

/**
 * @description 获取标签数量
 */
export const getSortCount = (where: { userId?: number }) => {
    return Sort.count({
        where,
    });
};

/**
 * @description 删除指定标签
 */
export const delSort = (sortId: number) => {
    return Sort.destroy({
        where: {
            sortId,
        },
    });
};

/**
 * @description 新增标签
 */
export const addSort = ({ content, userId }: Pick<Sort, "content" | "userId">) => {
    return Sort.findOrCreate({ where: { content }, defaults: { content, userId } });
};
