import Tag from "../modles/Tag";
import Article from "../modles/Article";
import User from "../modles/User";
import TagArticle from "../modles/TagArticle";

/**
 * @description 获取标签
 */
export const getTags = () => {
    return Tag.findAll({ attributes: ["tagId", "content"], where: { status: 2 } });
};

/**
 * @description 获取标签列表（包含对应关系+分页）
 */
export const getTagList = (where: { userId?: number }, offset: number, limit: number, attributes: Array<string> = []) => {
    return Tag.findAll({
        attributes: ["tagId", "content", "createdAt", ...attributes],
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
export const getTag = (where: { tagId?: number; content?: string }) => {
    return Tag.findOne({
        where,
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
 * @description 编辑指定标签
 */
export const setTag = ({ tagId, content, reason, reply, status }: { tagId: number; content?: string; reason?: string; reply?: string; status?: 0 | 1 | 2 }) => {
    return Tag.update(
        { content, reason, reply, status },
        {
            where: {
                tagId,
            },
        }
    );
};

/**
 * @description 新增标签
 */
export const addTag = ({ content, userId, reason }: { content: string; userId: number; reason?: string; status: 0 | 1 | 2 }) => {
    return Tag.findOrCreate({ where: { content }, defaults: { content, userId, reason } });
};

/**
 * @description 删除标签文章对应关系
 */
export const delTagArticleByTagId = (tagId?: number) => {
    return TagArticle.destroy({
        where: {
            tagId,
        },
    });
};
