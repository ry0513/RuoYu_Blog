layui.use(["table", "util"], () => {
    const { table, util } = layui;
    table.render({
        elem: "#tag",
        url: "/api/tag/list",
        page: true,
        cols: [
            [
                {
                    field: "tagId",
                    title: "ID",
                    width: 100,
                },

                {
                    field: "content",
                    title: "标签",
                },
                {
                    title: "使用次数",
                    templet: ({ articles }) => {
                        return articles.length;
                    },
                },
                {
                    title: "创建者",
                    templet: ({ user }) => {
                        return user.nickName;
                    },
                },
                {
                    title: "创建时间",
                    templet: ({ createdAt }) => {
                        return util.toDateString(createdAt, "yyyy-MM-dd HH:mm:ss");
                    },
                },
            ],
        ],
    });
});
