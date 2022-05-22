import {
    Table,
    Model,
    PrimaryKey,
    Column,
    DataType,
    AutoIncrement,
    ForeignKey,
    HasMany,
    BelongsTo,
} from "sequelize-typescript";
import User from "./User";
import Article from "./Article";

@Table({
    tableName: "sort",
    paranoid: true,
})
export default class Sort extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER, comment: "标签id" })
    sortId!: number;

    @Column({ type: DataType.STRING, comment: "标签名称" })
    content!: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, comment: "创建者" })
    userId!: number;

    @BelongsTo(() => User)
    user!: User;

    @HasMany(() => Article)
    articles!: Array<Article>;
}
