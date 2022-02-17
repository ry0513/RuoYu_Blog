$ry(".submit").click(() => {
    const nickName = $ry(".nickName").val();
    if (!nickName) {
        $ryTools.notify({
            description: "不可为空",
            type: "error",
        });
        return;
    }
    axios({
        method: "post",
        url: "/api/user/resister",
        data: qs.stringify({
            nickName,
        }),
    }).then(({ data: res }) => {
        if (res.code === 0) {
            $ryTools.notify({
                description: "登录成功，跳转中···",
            });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            $ryTools.notify({
                description: res.msg,
                type: "error",
            });
        }
    });
});
