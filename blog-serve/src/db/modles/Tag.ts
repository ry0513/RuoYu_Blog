import {
    Table,
    Model,
    PrimaryKey,
    Column,
    DataType,
    AutoIncrement,
    ForeignKey,
    BelongsToMany,
    BelongsTo,
    Default,
} from "sequelize-typescript";
import User from "./User";
// import TagArticle from "./TagArticle";
import Article from "./Article";

@Table({
    tableName: "tag",
    paranoid: true,
})
export default class Tag extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, comment: "标签id" })
    tagId!: number;

    @Column({ type: DataType.STRING, comment: "标签名称" })
    content!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, comment: "创建者" })
    userId!: number;

    @Default(0)
    @Column({ type: DataType.INTEGER, comment: "状态[0审核中1驳回2正常]" })
    status!: number;

    @Column({ type: DataType.STRING, comment: "理由" })
    reason!: string;

    @Column({ type: DataType.STRING, comment: "回复" })
    reply!: string;

    @BelongsTo(() => User)
    user!: User;

    // @BelongsToMany(() => Article, () => TagArticle)
    // articles!: Array<Article>;
}
