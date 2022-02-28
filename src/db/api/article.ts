import Article from "../modles/Article";
import Tag from "../modles/Tag";
import Sort from "../modles/Sort";
import TagArticle from "../modles/TagArticle";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

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
 * @description 获取文章列表
 */

export const getArticleList = ({
    param,
    attributes = [],
    offset,
    limit,
    maxTime = "2099-12-31 23:59:59",
    minTime = "2000-01-01 00:00:00",
    isMe = false,
}: {
    param: { userId?: number; status?: Array<number> };
    attributes?: Array<string>;
    offset: number;
    limit: number;
    maxTime?: Date | string;
    minTime?: Date | string;
    isMe?: boolean;
}) => {
    const releaseAt = isMe ? { [Op.or]: { [Op.is]: null, [Op.between]: [new Date(minTime), new Date(maxTime)] } } : { [Op.between]: [new Date(minTime), new Date(maxTime)] };

    return Article.findAll({
        order: [["articleId", "DESC"]],
        attributes: ["articleId", "title", "status", "releaseAt", ...attributes],
        where: { ...param, releaseAt },
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
        offset,
        limit,
    });
};

/**
 * @description 获取文章分类数量
 */
export const getArticleSortCount = (userId: number) => {
    return Article.findAll({
        where: { userId },
        group: "status",
        attributes: ["status", [Sequelize.fn("COUNT", Sequelize.col("status")), "count"]],
    }).then((data) => {
        const count: Array<number> = [0, 0, 0, 0];
        data.forEach((item) => {
            count[item.status] = item.getDataValue("count");
        });
        return {
            draft: count[0],
            audit: count[1],
            release: count[2],
            recycle: count[3],
            all: count[0] + count[1] + count[2],
        };
    });
};

/**
 * @description 获取总文章数量
 */
export const getArticleCount = ({
    param,
    maxTime = "2099-12-31 23:59:59",
    minTime = "2000-01-01 00:00:00",
    isMe = false,
}: {
    param: { userId?: number; status?: Array<number> };
    maxTime?: Date | string;
    minTime?: Date | string;
    isMe?: boolean;
}) => {
    const releaseAt = isMe ? { [Op.or]: { [Op.is]: null, [Op.between]: [new Date(minTime), new Date(maxTime)] } } : { [Op.between]: [new Date(minTime), new Date(maxTime)] };
    return Article.count({
        where: { ...param, releaseAt },
    });
};

/**
 * @description 新增文章
 */
export const addArticle = (data: {
    userId: number;
    title: string;
    html: string;
    content: Array<object>;
    sortId?: number;
    images?: Array<string>;
    password?: string;
    status?: number;
    releaseAt?: Date;
}) => {
    return Article.create(data);
};

/**
 * @description 编辑文章
 */
export const setArticle = ({
    articleId,
    ...data
}: {
    articleId: number;
    title: string;
    html: string;
    content: Array<object>;
    sortId?: number;
    images?: Array<string>;
    password?: string;
    status?: number;
    releaseAt?: Date | string;
}) => {
    return Article.update(data, {
        where: {
            articleId,
        },
    });
};

/**
 * @description 改变状态
 */
export const changeArticleStatus = (articleId: number, userId: number, status: number) => {
    return Article.update(
        { status },
        {
            where: {
                articleId,
                userId,
            },
        }
    );
};

/**
 * @description 删除指定文章
 */
export const delArticle = (articleId: number) => {
    return Article.destroy({
        where: {
            articleId,
        },
    });
};

/**
 * @description 新增标签文章对应关系
 */
export const addTagArticle = (data: { tagId: number; articleId: number }) => {
    return TagArticle.create(data);
};

/**
 * @description 删除标签文章对应关系
 */
export const delTagArticleByArticleId = (articleId?: number) => {
    return TagArticle.destroy({
        where: {
            articleId,
        },
    });
};
