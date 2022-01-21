import { Table, Model, PrimaryKey, Column, DataType, Default, HasMany } from "sequelize-typescript";
import Article from "./Article";
import Tag from "./Tag";
import Sort from "./Sort";
@Table({
    tableName: "user",
    paranoid: true,
})
export default class User extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, comment: "用户id" })
    userId!: number;

    @Column({ type: DataType.STRING, comment: "用户昵称" })
    nickName!: string;

    @Column({ type: DataType.STRING, comment: "头像地址" })
    avatar!: string;

    @Column({ type: DataType.STRING, comment: "注册ip" })
    registerIp!: string;

    @Column({ type: DataType.STRING, comment: "注册地点" })
    registerPlace!: string;

    @Default(50)
    @Column({ type: DataType.INTEGER, comment: "用户积分" })
    userIntegral!: number;

    @Default(10)
    @Column({ type: DataType.INTEGER, comment: "用户状态" })
    userStatus!: number;

    @HasMany(() => Article)
    articles!: Article[];

    @HasMany(() => Tag)
    tags!: Tag[];

    @HasMany(() => Sort)
    sorts!: Sort[];
}
