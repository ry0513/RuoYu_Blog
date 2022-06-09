import {
    Table,
    Model,
    PrimaryKey,
    Column,
    DataType,
    Default,
    HasMany,
} from "sequelize-typescript";
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
    ip!: string;

    // @Column({ type: DataType.STRING, comment: "注册地点" })
    // place!: string;

    @Default(0)
    @Column({ type: DataType.INTEGER, comment: "用户积分" })
    integral!: number;

    @Default(0)
    @Column({ type: DataType.INTEGER, comment: "用户状态" }) // 0普通，1需审核，2无需审核，3可审核，4待定，5超级管理员
    status!: number;

    // @Column({ type: DataType.STRING, comment: "用户权限" })
    // permission!: string;

    @Column({ type: DataType.STRING, comment: "用户权限" })
    set permission(val: string[] | "*") {
        this.setDataValue("permission", JSON.stringify(val));
    }
    get permission(): string[] | "*" {
        return JSON.parse(this.getDataValue("permission"));
    }

    @HasMany(() => Article)
    articles!: Array<Article>;

    @HasMany(() => Tag)
    tags!: Array<Tag>;

    @HasMany(() => Sort)
    sorts!: Array<Sort>;
}
