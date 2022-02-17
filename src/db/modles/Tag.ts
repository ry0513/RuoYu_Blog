import {
    Table,
    Model,
    PrimaryKey,
    Column,
    DataType,
    AutoIncrement,
    ForeignKey,
    BelongsToMany,
    HasMany,
    BelongsTo,
} from "sequelize-typescript";
import User from "./User";
import TagArticle from "./TagArticle";
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

    @BelongsTo(() => User)
    user!: User;

    @BelongsToMany(() => Article, () => TagArticle)
    articles!: Array<Article>;
}
