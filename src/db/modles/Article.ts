import {
    Table,
    Model,
    PrimaryKey,
    Column,
    DataType,
    AutoIncrement,
    ForeignKey,
    BelongsToMany,
    Default,
    BelongsTo,
} from "sequelize-typescript";
import User from "./User";
import TagArticle from "./TagArticle";
import Tag from "./Tag";
import Sort from "./Sort";

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

    @Column({ type: DataType.TEXT, comment: "内容" })
    set content(val: Array<object>) {
        this.setDataValue("content", JSON.stringify(val));
    }
    get content(): Array<object> {
        return JSON.parse(this.getDataValue("content") || "[{}]");
    }

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

    @Default(0)
    @Column({ type: DataType.INTEGER, comment: "状态[0草稿1审核中2发布3回收站]" })
    status!: number;

    @Column({ type: DataType.STRING, comment: "密码" })
    password!: string;

    @BelongsToMany(() => Tag, () => TagArticle)
    tags!: Array<Tag>;
}
