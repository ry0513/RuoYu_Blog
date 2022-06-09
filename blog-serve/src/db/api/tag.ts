import Article from "../modles/Article";
import Tag from "../modles/Tag";
import User from "../modles/User";
import { Op } from "sequelize";

/**
 * @description 新增标签
 */
export const createTag = ({
    content,
    userId,
    reason,
    status,
}: Pick<Tag, "content" | "userId" | "reason" | "status">) => {
    return Tag.findOrCreate({
        where: { content },
        defaults: { content, userId, reason, status },
    });
};

/**
 * @description 获取标签列表（包含对应关系+分页）
 */
export const getTagList = ({
    where: { status = [], content = [] } = {},
    current,
    pageSize,
    attributes = [],
}: {
    where?: Partial<PickArr<Tag, "content" | "status">>;
    current: number;
    pageSize: number;
    attributes?: Array<"reason" | "status" | "remark" | "createdAt">;
}) => {
    return Tag.findAndCountAll({
        attributes: ["tagId", "content", ...attributes],
        order: [["tagId", "DESC"]],
        where: {
            status: { [Op.or]: status },
            content: { [Op.like]: content },
        },
        offset: current,
        limit: pageSize,
        include: [
            {
                attributes: ["nickName"],
                model: User,
                // where: { userId: 1 },
            },
            {
                attributes: ["articleId"],
                model: Article,
                // where: { articleId: 1 },
            },
        ],
    });
};
