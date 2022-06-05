import Tag from "../modles/Tag";

/**
 * @description 新增标签
 */
export const addTag = ({
    content,
    userId,
    reason,
    status,
}: {
    content: string;
    userId: number;
    reason?: string;
    status: 0 | 1 | 2;
}) => {
    return Tag.findOrCreate({
        where: { content },
        defaults: { content, userId, reason, status },
    });
};
