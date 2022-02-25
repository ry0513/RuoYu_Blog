import Sort from "../modles/Sort";
import Article from "../modles/Article";
import User from "../modles/User";

/**
 * @description 获取全部分类
 */
export const getSorts = () => {
    return Sort.findAll({ attributes: ["sortId", "content"] });
};

/**
 * @description 获取分类列表（包含对应关系+分页）
 */
export const getSortList = (where: { userId?: number }, offset: number, limit: number) => {
    return Sort.findAll({
        attributes: ["sortId", "content", "createdAt"],
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
 * @description 获取指定分类
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
 * @description 获取分类数量
 */
export const getSortCount = (where: { userId?: number }) => {
    return Sort.count({
        where,
    });
};

/**
 * @description 新增分类
 */
export const addSort = ({ content, userId }: Pick<Sort, "content" | "userId">) => {
    return Sort.findOrCreate({ where: { content }, defaults: { content, userId } });
};

/**
 * @description 修改指定分类
 */
export const setSort = (content: string, sortId: number) => {
    return Sort.update(
        { content },
        {
            where: {
                sortId,
            },
        }
    );
};

/**
 * @description 删除指定分类
 */
export const delSort = (sortId: number) => {
    return Sort.destroy({
        where: {
            sortId,
        },
    });
};
