import Tag from "../modles/Tag";
import Sort from "../modles/Sort";
import Article from "../modles/Article";
import TagArticle from "../modles/TagArticle";
import { Op } from "sequelize";

/**
 * @description 获取文章列表
 */

export const getArticleList = ({
    where: { status = [], content = [], sortId = [] } = {},
    attributes = [],
    current,
    pageSize,
    maxTime = "2099-12-31 23:59:59",
    minTime = "2000-01-01 00:00:00",
    isMe = false,
}: {
    where?: Partial<PickArr<Article, "content" | "status" | "sortId">>;
    attributes?: Array<"reason" | "status" | "remark" | "createdAt">;
    current: number;
    pageSize: number;
    maxTime?: Date | string;
    minTime?: Date | string;
    isMe?: boolean;
}) => {
    const releaseAt = isMe ? { [Op.or]: { [Op.is]: null, [Op.between]: [new Date(minTime), new Date(maxTime)] } } : { [Op.between]: [new Date(minTime), new Date(maxTime)] };

    return Article.findAndCountAll({
        order: [["articleId", "DESC"]],
        attributes: ["articleId", "title", "status", "releaseAt", ...attributes],
        where: {
            sortId: { [Op.or]: sortId },
            status: { [Op.or]: status },
            content: { [Op.like]: content },
        },
        include: [
            {
                model: Tag,
                attributes: ["tagId", "content"],
            },
            {
                model: Sort,
                attributes: ["sortId", "content"],
            },
        ],
        offset: current,
        limit: pageSize,
    });
};

/**
 * @description 新增文章
 */
export const createArticle = (data: {
    userId: number;
    title: string;
    html: string;
    content: Array<object>;
    sortId?: number;
    images?: Array<string>;
    passwd?: string;
    status?: number;
    releaseAt?: Date;
    type?: number;
}) => {
    return Article.create(data);
};

/**
 * @description 获取文章
 */
export const getArticle = (where: { articleId: number; userId?: number; status?: number }) => {
    return Article.findOne({
        where,
        include: [
            {
                model: Tag,
                attributes: ["tagId", "content"],
            },
            {
                model: Sort,
                attributes: ["sortId", "content"],
            },
        ],
    });
};

/**
 * @description 新增标签文章对应关系
 */
export const addTagArticle = (data: { tagId: number; articleId: number }) => {
    return TagArticle.create(data);
};
