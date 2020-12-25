var token = window.localStorage.token;
var Popup = new Popup();

function createWork() {
    const url = "/api/work/create";
    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;
    if (name === null || name === undefined || name.length === 0) {
        Popup.toast('生产流程名字不能为空！', 10);
        return;
    }

    const data = {
        "name": name,
        "comment": comment
    };
    fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'Authorization': 'manage ' + token,
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST"
    })
        .then(response => response.json())
        .then(function (data) {
            Popup.alert('创建生产流程', data.message);

            if (data.status === 1) {
                query();
            }
        });
}

function create() {
    var title = '新建生产流程管理',
        text = '<div class="confirm-box"><form id="updateForm">' +
        '<label>生产流程名称</label>' +
        '<div class="show-box">' +
        '<input type="text" id="name"><br>' +
        '</div>' +
        '<label>生产流程备注</label>' +
        '<div class="show-box">' +
        '<input type="text" id="comment"></form></div>' +
        '</div>';
    Popup.confirm(title, text, createWork);
}

function updateWork(work_id) {
    function editWork() {
        const url = "/api/work/update";
        const name = updateForm.name.value;
        var comment = updateForm.comment.value;
        if (name === null || name === undefined || name.length === 0) {
            Popup.toast('生产流程名字不能为空！', 10);
            return;
        }

        var data = {
            "id": work_id,
            "name": name,
            "comment": comment
        };
        fetch(url, {
                body: JSON.stringify(data),
                headers: {
                    'Authorization': 'manage ' + token,
                    'content-type': 'application/json;charset=UTF-8'
                },
                method: "POST"
            })
            .then(response => response.json())
            .then(function (data) {
                Popup.alert('编辑生产流程', data.message);
                if (data.status == 1) {
                    query();
                }
            });
    }

    var title = '编辑生产流程管理',
        text = '<div class="confirm-box"><form id="updateForm">' +
        '<label>生产流程名称</label>' +
        '<div class="show-box">' +
        '<input type="text" id="name"><br>' +
        '</div>' +
        '<label>生产流程备注</label>' +
        '<div class="show-box">' +
        '<input type="text" id="comment"></form></div>' +
        '</div>';
    Popup.confirm(title, text, editWork);
}

function deleteWork(work_id) {
    const url = "/api/work/delete";
    const data = {
        "id": work_id
    };
    var headers;
    if (token != null && token != '') {
        headers = {
            'Authorization': 'manage ' + token,
            'content-type': 'application/json'
        };
    }
    fetch(url, {
            body: JSON.stringify(data),
            headers: headers,
            method: "DELETE"
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.alert('删除生产流程', json.message)

            if (json.status == 1) {
                query();
            }
        });
}
function showAction(data) {
    const title = '查看生产流程'
    const  text = '<div class="confirm-box"><form id="updateForm">' +
        '<label>生产流程名称</label>' +
        '<div class="show-box">' +
        '<input type="text" id="name" disabled="true" value="' + data.name + '"><br>' +
        '</div>' +
        '<label>生产流程备注</label>' +
        '<div class="show-box">' +
        '<input type="text" id="comment" disabled="true" value="' + data.comment + '"></form></div>' +
        '</div>';

    Popup.alert(title, text);
}

window.onload = function () {
    query()
}

function query() {
    var id = queryBox.id.value;
    var name = queryBox.name.value;
    var comment = queryBox.comment.value;

    let url = new URL('/api/work/find', 'http://' + location.host);
    if (id !== '') url.searchParams.append('id', id);
    if (name !== '') url.searchParams.append('name', name);
    if (comment !== '') url.searchParams.append('comment', comment);

    var headers;
    if (token != null && token != '') {
        headers = {
            'Authorization': 'manage ' + token,
            'content-type': 'application/json'
        };
    }
    var queryResult = document.getElementById('query-result');
    // console.log(url);
    fetch(url, {
            headers: headers,
            method: "GET"
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.toast(json.message)
            if (json.status == 1) {
                queryResult.innerHTML = '';
                json.data.works.forEach(element => {
                    let tr = document.createElement('tr');
                    tr.id = 'work-' + element.id;

                    let td;

                    td = document.createElement('td');
                    td.textContent = element.id;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = element.name;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = element.comment;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = new Date(element.createTime).toLocaleDateString();
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.textContent = new Date(element.updateTime).toLocaleDateString();
                    tr.appendChild(td);

                    let show = document.createElement('td');
                    var showButton = document.createElement('button');
                    /*showButton.innerHTML = "查看";
                    showButton.addEventListener("click", function () {
                        // window.location.href = '/process.html?id=' + element.id;
                        showAction(element)
                    });*/
                    showButton.innerHTML='查看';
                    showButton.onclick=function(){
                        showAction(element);
                    }
                    show.appendChild(showButton);
                    tr.appendChild(show);

                    td = document.createElement('td');
                    let button = document.createElement('button');
                    button.textContent = '编辑';
                    button.onclick = function () {
                        updateWork(element.id)
                    };
                    td.appendChild(button);
                    tr.appendChild(td);

                    td = document.createElement('td');
                    button = document.createElement('button');
                    button.innerHTML = '删除';
                    button.onclick = function () {
                        deleteWork(element.id)
                    };
                    td.appendChild(button);
                    tr.appendChild(td);

                    queryResult.appendChild(tr);
                })
                new tableSort('table', 1, 2, 999, 'up', 'down', 'hov')
            }
        });
}