import Article from "../modles/Article";
import Tag from "../modles/Tag";
import Sort from "../modles/Sort";
import TagArticle from "../modles/TagArticle";

/**
 * @description 获取文章
 */
export const getArticle = (where: Pick<Article, "articleId" | "userId">) => {
    return Article.findOne({
        where,
        include: Tag,
    });
};

/**
 * @description 获取文章列表
 */
export const getArticleList = (where: { userId?: number; status?: number }, offset: number, limit: number) => {
    return Article.findAll({
        order: [["articleId", "DESC"]],
        where,
        include: Tag,
        offset,
        limit,
    });
};

/**
 * @description 获取文章数量
 */
export const getArticleCount = (where: { userId?: number; status?: number }) => {
    return Article.count({
        where,
    });
};

/**
 * @description 获取文章标签
 */
export const getArticleTags = () => {
    return Tag.findAll();
};

/**
 * @description 获取文章分类
 */
export const getArticleSorts = () => {
    return Sort.findAll();
};

/**
 * @description 新增文章
 */
export const addArticle = (data: { userId: number; title: string; html: string; content: string; sortId?: number; images?: string[]; password?: string; status?: number }) => {
    return Article.create(data);
};

/**
 * @description 编辑文章
 */
export const setArticle = ({ articleId, ...data }: { articleId: number; title: string; html: string; content: string; sortId?: number; images?: string[]; password?: string; status?: number }) => {
    return Article.update(data, {
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
 * @description 删除del文章对应关系
 */

export const delTagArticle = (articleId: number) => {
    return TagArticle.destroy({
        where: {
            articleId,
        },
    });
};

// /**
//  * @description 创建用户信息
//  */
// export const createUserData = ({ userId, nickName, avatar, registerIp }: Pick<User, "userId" | "nickName" | "avatar" | "registerIp" | "registerPlace">) => {
//     return User.create({
//         userId,
//         nickName,
//         avatar,
//         registerIp,
//     });
// };
