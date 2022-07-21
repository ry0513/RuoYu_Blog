import { Table, Model, PrimaryKey, Column, DataType, AutoIncrement, ForeignKey, BelongsToMany, Default, BelongsTo } from "sequelize-typescript";
import User from "./User";
// import TagArticle from "./TagArticle";
import Tag from "./Tag";
import Sort from "./Sort";
import TagArticle from "./TagArticle";

@Table({
    tableName: "article",
    paranoid: true,
})
export default class Article extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, comment: "文章id" })
    articleId!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, comment: "作者id" })
    userId!: number;

    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => Sort)
    @Column({ type: DataType.INTEGER, comment: "分类id" })
    sortId!: number;

    @BelongsTo(() => Sort)
    sort!: Sort;

    @Column({ type: DataType.STRING, comment: "标题" })
    title!: string;

    @Column({ type: DataType.TEXT, comment: "HTML" })
    html!: string;

    @Default("")
    @Column({ type: DataType.TEXT, comment: "前言" })
    foreword!: string;

    @Column({ type: DataType.TEXT, comment: "内容" })
    content!: string;

    @Column({
        type: DataType.INTEGER,
        comment: "类型[0无图，1一图，2二图，3三图]",
    })
    type!: string;

    @Column({ type: DataType.STRING, comment: "封面图片" })
    set images(val: Array<object>) {
        this.setDataValue("images", JSON.stringify(val));
    }
    get images(): Array<object> {
        if (this.getDataValue("images")) {
            return JSON.parse(this.getDataValue("images"));
        }
        return [];
    }

    @Column({ type: DataType.DATE, comment: "发布时间" })
    releaseAt!: Date;

    @Column({
        type: DataType.INTEGER,
        comment: "状态[0草稿，1审核，2发布，3驳回，9回收站]",
    })
    status!: number;

    @Default("")
    @Column({ type: DataType.STRING, comment: "密码" })
    password!: string;

    @BelongsToMany(() => Tag, () => TagArticle)
    tags!: Array<Tag>;
}
