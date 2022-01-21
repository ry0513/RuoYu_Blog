import { Table, Model, Column, ForeignKey, PrimaryKey, AutoIncrement } from "sequelize-typescript";
import Tag from "./Tag";
import Article from "./Article";

@Table({
    tableName: "tagArticle",
})
export default class tagArticle extends Model {
    @ForeignKey(() => Tag)
    @Column
    tagId!: number;

    @ForeignKey(() => Article)
    @Column
    articleId!: number;
}
