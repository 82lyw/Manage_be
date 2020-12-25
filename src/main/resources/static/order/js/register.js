var Popup = new Popup()

function register() {
    let url = '/api/user/registry'
    let username = document.getElementById('username');
    let realname = document.getElementById('realname');
    let password = document.getElementById('password');

    if (username.value.length === 0) {
        Popup.toast('用户名不能为空！')
        return
    } else if (realname.value.length === 0) {
        Popup.toast('姓名不能为空！')
        return
    } else if (password.value.length === 0) {
        Popup.toast('密码不能为空！')
        return
    }

    var data = {
        username: username.value,
        name: realname.value,
        password: password.value
    };

    fetch(url, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
            method: 'POST'
        })
        .then(res => res.json())
        .then(function (json) {
            if (json.status === 1) {
                window.location.href = './login.html'
            } else {
                console.log(json)
            }
        })
}