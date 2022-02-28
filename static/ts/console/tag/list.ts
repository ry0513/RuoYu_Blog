layui.use(["table", "util"], () => {
    const { table, util } = layui;
    table.render({
        elem: "#tag",
        url: "/api/tag/list",
        page: {
            limits: [10, 20, 30],
            layout: ["count", "limit", "prev", "page", "next"],
            first: false,
            last: false,
        },
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
                    field: "reason",
                    title: "备注",
                },
                {
                    title: "状态",
                    width: 100,
                    templet: ({ status }) => {
                        switch (status) {
                            case 0:
                                return "审核中";
                            case 1:
                                return "<span class='layui-font-red'>驳回</span>";
                            case 2:
                                return "<span class='layui-font-green'>正常</span>";
                            default:
                                return "未知";
                        }
                    },
                },

                {
                    field: "reply",
                    title: "回复",
                },
                {
                    title: "创建者",
                    templet: ({ user }) => {
                        return user.nickName;
                    },
                },

                {
                    title: "创建时间",
                    width: 200,
                    templet: ({ createdAt }) => {
                        return util.toDateString(createdAt, "yyyy-MM-dd HH:mm");
                    },
                },
                {
                    title: "使用次数",
                    templet: ({ articles }) => {
                        return articles.length;
                    },
                },
            ],
        ],
    });
});
