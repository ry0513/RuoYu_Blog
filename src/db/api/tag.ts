import Tag from "../modles/Tag";
import Article from "../modles/Article";
import User from "../modles/User";

/**
 * @description 获取标签
 */
export const getTags = () => {
    return Tag.findAll({ attributes: ["tagId", "content"] });
};

/**
 * @description 获取标签列表（包含对应关系+分页）
 */
export const getTagList = (where: { userId?: number }, offset: number, limit: number) => {
    return Tag.findAll({
        attributes: ["tagId", "content", "createdAt"],
        order: [["tagId", "DESC"]],
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
export const getTag = (tagId: number) => {
    return Tag.findOne({
        where: {
            tagId,
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
export const getTagCount = (where: { userId?: number }) => {
    return Tag.count({
        where,
    });
};

/**
 * @description 删除指定标签
 */
export const delTag = (tagId: number) => {
    return Tag.destroy({
        where: {
            tagId,
        },
    });
};

/**
 * @description 新增标签
 */
export const addTag = ({ content, userId }: Pick<Tag, "content" | "userId">) => {
    return Tag.findOrCreate({ where: { content }, defaults: { content, userId } });
};
