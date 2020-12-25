var Popup = new Popup()

window.onload = find

function find() {
    const url = new URL('/api/process/find', 'http://' + location.host);

    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    const token = window.localStorage.token;
    let headers;

    if (token !== null && token !== undefined && token.length !== 0) {
        headers = {
            'Authorization': 'manage ' + localStorage.getItem('token'),
            'content-type': 'application/json;charset=UTF-8'
        };
    }

    if (id !== '') url.searchParams.append('id', id);
    if (name !== '') url.searchParams.append('name', name);
    if (comment !== '') url.searchParams.append('comment', comment);

    let queryResult = document.getElementById('query-result');

    fetch(url, {
            headers: headers,
            method: 'GET'
        })
        .then(response => response.json())
        .then(function (json) {
            if (json.status === 1) {
                queryResult.innerHTML = '';
                json.data.processes.forEach(element => {
                    let tr = document.createElement('tr');
                    tr.id = 'process-' + element.id

                    let id = document.createElement('td');
                    id.textContent = element.id;
                    tr.appendChild(id);

                    let name = document.createElement('td');
                    name.innerHTML = element.name;
                    tr.appendChild(name);

                    let comment = document.createElement('td');
                    comment.innerHTML = element.comment;
                    tr.appendChild(comment);

                    let createTime = document.createElement('td');
                    createTime.innerHTML = new Date(element.createTime).toLocaleDateString();
                    tr.appendChild(createTime);

                    let updateTime = document.createElement('td');
                    updateTime.innerHTML = new Date(element.updateTime).toLocaleDateString();
                    tr.appendChild(updateTime);

                    let show = document.createElement('td');
                    var showButton = document.createElement('button');
                    showButton.innerHTML = "查看";
                    showButton.addEventListener("click", function () {
                        // window.location.href = '/process.html?id=' + element.id;
                        showAction(element)
                    });
                    show.appendChild(showButton);
                    tr.appendChild(show);

                    let update = document.createElement('td');
                    var updateButton = document.createElement('button');
                    updateButton.innerHTML = "修改";
                    updateButton.addEventListener("click", function () {
                        // window.location.href = '/updateProcess.html?id=' + element.id; 
                        updateAction(element)
                    });
                    update.appendChild(updateButton);
                    tr.appendChild(update);

                    let del = document.createElement('td');
                    var deleteButton = document.createElement('button');
                    deleteButton.innerHTML = "删除";
                    deleteButton.addEventListener("click", function () {
                        deleteProcess(element.id)
                    });
                    del.appendChild(deleteButton);
                    tr.appendChild(del);

                    queryResult.appendChild(tr);
                })
                new tableSort('processTable', 1, 2, 999, 'up', 'down', 'hov')
            }
        })
}

//弹窗式创建工序
function createAction() {
    const title = '创建工序'
    const text = '<div class="confirm-box">' +
        '<label>工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processName">' +
        '</div><br>' +
        '<label>工序内容：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processComment">' +
        '</div><br>' +
        '</div>'

    Popup.confirm(title, text, function () {
        createProcess()
    });
}

function createProcess() {
    const url = "/api/process/create";
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    const name = document.getElementById('processName').value;
    const comment = document.getElementById('processComment').value;

    if (name.length === 0) {
        Popup.alert('创建工序', '工序名称不能为空！');
        return;
    } else if (comment.length === 0) {
        Popup.alert('创建工序', '工序内容不能为空！');
        return;
    }

    let data = JSON.stringify({
        "name": name,
        "comment": comment
    });

    fetch(url, {
            body: data,
            headers: headers,
            method: "POST"
        })
        .then(response => response.json())
        .then(function (json) {
            if (json.status === 1) {
                Popup.toast(json.message);
                find();
            } else {
                Popup.alert('创建工序失败', json.message);
            }
        })
}

//查看工序
function showAction(data) {
    const title = '查看工序'
    const text = '<div class="confirm-box">' +
        '<label>工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processName" disabled="true" value="' + data.name + '">' +
        '</div><br>' +
        '<label>工序内容：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processComment" disabled="true" value="' + data.comment + '">' +
        '</div><br>' +
        '</div>'

    Popup.alert(title, text);
}

//弹窗式修改工序
function updateAction(data) {
    const title = '修改工序'
    const text = '<div class="confirm-box">' +
        '<label>工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processName" value="' + data.name + '">' +
        '</div><br>' +
        '<label>工序内容：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processComment" value="' + data.comment + '">' +
        '</div><br>' +
        '</div>'

    Popup.confirm(title, text, function () {
        updateProcess(data.id)
    });
}

function updateProcess(ProcessId) {
    const url = "/api/process/update";
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    const name = document.getElementById('processName').value;
    const comment = document.getElementById('processComment').value;

    if (name.length === 0) {
        Popup.alert('修改工序', '工序名不能为空！');
        return;
    } else if (comment.length === 0) {
        Popup.alert('修改工序', '工序内容不能为空！');
        return;
    }
    console.log(ProcessId);

    const data = JSON.stringify({
        "id": ProcessId,
        "name": name,
        "comment": comment
    });

    fetch(url, {
            body: data,
            headers: headers,
            method: "POST"
        })
        .then(response => response.json())
        .then(function (json) {
            if (json.status === 1) {
                Popup.toast(json.message);
                find();
            } else {
                Popup.alert('修改工序失败', json.message);
            }
        });
}

function deleteProcess(id) {
    const url = "/api/process/delete";
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }
    const data = JSON.stringify({
        "id": id
    });

    fetch(url, {
            body: data,
            headers: headers,
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(function (json) {
            if (json.status === 1) {
                Popup.toast(json.message);
                find();
            } else {
                Popup.alert('删除失败', json.message);
            }
        })
}