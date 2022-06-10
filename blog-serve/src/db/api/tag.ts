import Article from "../modles/Article";
import Tag from "../modles/Tag";
import User from "../modles/User";
import { Op } from "sequelize";

/**
 * @description 新增标签
 */
export const createTag = (
    data: Pick<Tag, "content" | "userId" | "reason" | "status" | "remark">
) => {
    return Tag.findOrCreate({
        where: { content: data.content },
        defaults: data,
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
            },
            {
                attributes: ["articleId"],
                model: Article,
            },
        ],
    });
};

/**
 * @description 获取标签列表（全部）
 */
export const getTagListAll = () => {
    return Tag.findAll({
        attributes: ["tagId", "content", "status"],
        where: { status: { [Op.or]: [0, 1] } },
    });
};
