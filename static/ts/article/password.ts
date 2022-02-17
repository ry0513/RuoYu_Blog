$ry(".submit").click(() => {
    const articleId = $ry(".articleId").html();
    const password = $ry(".password").val();
    if (!password) {
        $ryTools.notify({
            description: "密码为空",
            type: "error",
        });
        return;
    }

    axios({
        method: "post",
        url: "/api/article/password?sss=/ss",
        data: qs.stringify({
            articleId,
            password,
        }),
    }).then(({ data: res }) => {
        if (res.code === 0) {
            window.location.reload();
        } else {
            $ryTools.notify({
                description: res.msg,
                type: "error",
            });
        }
    });
});
