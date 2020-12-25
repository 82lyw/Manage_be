var Popup = new Popup()
var nowPage = 1
var findWorkId = 0
var findWorkName = null
var findProcessId = 0
var findProcessName = null

const workProcessField = [
    'workId', 'workName',
    'processId', 'processName',
    'sequenceNumber'
]

window.onload = loadWorkProcess(1)

function loadWorkProcess(pageNumber) {
    nowPage = pageNumber
    const url = '/api/workProcess/find'
    let data = {
        work: {},
        process: {},
        'pageNumber': pageNumber - 1
    }
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    console.log(findProcessName)

    if (findWorkId !== 0) {
        data.work.id = findWorkId
    }

    if (findWorkName !== null) {
        data.work.name = findWorkName
    }

    if (findProcessId !== 0) {
        data.process.id = findProcessId
    }

    if (findProcessName !== null) {
        data.process.name = findProcessName
    }

    fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.toast(json.message)
            if (json.status === 1) {
                // dealWithPageSelect(json.data.total)
                loadWorkProcesses(json.data.workProcesses)
            }
        })
}

function dealWithPageSelect(totalNumber) {
    let pageSelectBox = document.getElementsByClassName('pageSelectBox')[0]
    pageSelectBox.innerHTML = ''

    if (totalNumber == 1) {
        return;
    } else if (totalNumber < 6) {
        for (let i = 1; i <= totalNumber; ++i) {
            let b = document.createElement('button')
            b.textContent = i

            b.onclick = function () {
                loadWorkProcess(i)
            }
            pageSelectBox.appendChild(b);
        }
    } else {
        if (nowPage != 1) {
            let previous = document.createElement('button')
            pageSelectBox.appendChild(previous)

            previous.textContent = '上一页'
            previous.onclick = function () {
                loadWorkProcess(nowPage - 1)
            }
        }

        let inputNumber = document.createElement('input')
        pageSelectBox.appendChild(inputNumber)
        inputNumber.type = 'number'
        inputNumber.style = '-webkit-appearance: none; -moz-appearance:textfield; width: 1em'


        let totalLabel = document.createElement('label')
        pageSelectBox.appendChild(totalLabel)
        totalLabel.textContent = ' / ' + totalNumber

        if (nowPage != totalNumber) {
            let next = document.createElement('button')
            pageSelectBox.appendChild(next)

            next.textContent = '下一页'
            next.onclick = function () {
                loadWorkProcess(nowPage + 1)
            }
        }
    }
}

function createAction() {
    const title = '创建流程工序'
    const text = '<div class="confirm-box">' +
        '<label for="workId">生产流程Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="workId" id="workId" onchange="javascript:loadWorkName()">' +
        '</div><br>' +
        '<label for="workName">生产流程名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="workName" id="workName" disabled="true">' +
        '<img id="work-img-load" src="images/load.png" title="加载中" style="display: none;">' +
        '<img id="work-img-tick" src="images/tick.png" title="id正确" style="display: none;">' +
        '<img id="work-img-cross" src="images/cross.png" title="id错误" style="display: none;">' +
        '</div><br>' +
        '<label for="processId">工序Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="processId" id="processId" onchange="javascript:loadProcessName()">' +
        '</div><br>' +
        '<label for="workName">工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="processName" id="processName" disabled="true">' +
        '<img id="process-img-load" src="images/load.png" title="加载中" style="display: none;">' +
        '<img id="process-img-tick" src="images/tick.png" title="id正确" style="display: none;">' +
        '<img id="process-img-cross" src="images/cross.png" title="id错误" style="display: none;">' +
        '</div><br>' +
        '<label for="sequenceNumber">流程工序顺序：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="sequenceNumber" id="sequenceNumber">' +
        '</div><br>' +
        '</div>'

    Popup.confirm(title, text, createWorkProcess);
}

function createWorkProcess() {
    let workId = document.getElementById('workId').value
    let processId = document.getElementById('processId').value
    let sequenceNumber = document.getElementById('sequenceNumber').value

    if (workId.length === 0) {
        Popup.alert('流程工序创建', '生产流程Id不能为空')
        return
    } else if (processId.length === 0) {
        Popup.alert('流程工序创建', '工序Id不能为空')
        return
    } else if (sequenceNumber.length === 0) {
        Popup.alert('流程工序创建', '流程工序顺序不能为空')
        return
    }

    const url = '/api/workProcess/create'

    const data = {
        workId: workId,
        processId: processId,
        sequenceNumber: sequenceNumber
    }

    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.alert('流程工序创建', json.message)
            if (json.status === 1) {
                loadWorkProcess();
            }
        })
}

function updateWorkProcessAction(data) {
    const title = '修改流程工序'
    const text = '<div class="confirm-box">' +
        '<label for="workId">生产流程Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="workId" id="workId" disabled="true" value="' + data.workId + '">' +
        '</div><br>' +
        '<label for="workName">生产流程名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="workName" id="workName" disabled="true" value="' + data.workName + '">' +
        '</div><br>' +
        '<label for="processId">工序Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="processId" id="processId" disabled="true" value="' + data.processId + '">' +
        '</div><br>' +
        '<label for="workName">工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="processName" id="processName" disabled="true" value="' + data.workName + '">' +
        '</div><br>' +
        '<label for="sequenceNumber">流程工序顺序：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="sequenceNumber" id="sequenceNumber" value="' + data.sequenceNumber + '">' +
        '</div><br>' +
        '</div>'

    Popup.confirm(title, text, function () {
        updateWorkProcess(data.workId, data.processId)
    });
}

function updateWorkProcess(workId, processId) {
    let sequenceNumber = document.getElementById('sequenceNumber').value

    if (sequenceNumber.length === 0) {
        Popup.alert('流程工序创建', '流程工序顺序不能为空')
        return
    }

    const url = '/api/workProcess/update'

    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    const data = {
        workId: workId,
        processId: processId,
        sequenceNumber: sequenceNumber
    }

    fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.alert('流程工序更新', json.message)
            if (json.status === 1) {
                loadWorkProcess();
            }
        })
}

function deleteWorkProcessAction(data) {
    const title = '删除流程工序'
    const content = '<p>确定删除这个流程工序？</p>' +
        '<p>生产流程Id：' + data.workId + '</p>' +
        '<p>生产流程名称：' + data.workName + '</p>' +
        '<p>工序Id：' + data.processId + '</p>' +
        '<p>工序名称：' + data.processName + '</p>' +
        '<p>工序顺序：' + data.sequenceNumber + '</p>'

    Popup.confirm(title, content, function () {
        deleteWorkProcess({
            workId: data.workId,
            processId: data.processId,
            sequenceNumber: data.sequenceNumber
        })
    })
}

function deleteWorkProcess(data) {
    const url = '/api/workProcess/delete'

    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    fetch(url, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.alert('流程工序删除', json.message)
            if (json.status === 1) {
                loadWorkProcess()
            }
        })
}


function loadWorkName() {
    let load = document.getElementById('work-img-load')
    let tick = document.getElementById('work-img-tick')
    let cross = document.getElementById('work-img-cross')
    workName.value = ''
    load.style.display = 'none'
    tick.style.display = 'none'
    cross.style.display = 'none'

    if (workId.value.length === 0) return
    const url = '/api/work/find?id=' + workId.value
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token')
    }

    load.style.display = 'inline'
    fetch(url, {
            method: 'GET',
            headers: headers
        })
        .then(response => {
            load.style.display = 'none'
            return response.json()
        })
        .then(function (json) {
            if (json.status === 1 && json.data.works.length !== 0) {
                workName.value = json.data.works[0].name;
                tick.style.display = 'inline'
            } else {
                cross.style.display = 'inline'
            }
        })
        .catch(() => {
            cross.style.display = 'inline'
        })
}

function loadProcessName() {
    let load = document.getElementById('process-img-load')
    let tick = document.getElementById('process-img-tick')
    let cross = document.getElementById('process-img-cross')
    processName.value = ''
    load.style.display = 'none'
    tick.style.display = 'none'
    cross.style.display = 'none'

    if (processId.value.length === 0) return
    const url = '/api/process/find?id=' + processId.value
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token')
    }

    load.style.display = 'inline'
    fetch(url, {
            method: 'GET',
            headers: headers
        })
        .then(response => {
            load.style.display = 'none'
            return response.json()
        })
        .then(function (json) {
            if (json.status === 1 && json.data.processes.length !== 0) {
                processName.value = json.data.processes[0].name;
                tick.style.display = 'inline'
            } else {
                cross.style.display = 'inline'
            }
        })
        .catch(e => {
            cross.style.display = 'inline'
        })
}

function loadWorkProcesses(data) {
    let workProcessTbody = document.getElementById('workProcessTbody')
    workProcessTbody.innerHTML = ''
    data.forEach(element => {
        let tr = document.createElement('tr')
        tr.id = 'work-' + element.workId + '-process-' + element.processId
        workProcessTbody.appendChild(tr)

        for (const key of workProcessField) {
            let td = document.createElement('td')
            tr.appendChild(td)
            td.textContent = element[key]
        }

        let td = document.createElement('td')
        tr.appendChild(td)
        td.textContent = new Date(element.updateTime).toLocaleDateString()

        td = document.createElement('td')
        tr.appendChild(td)
        td.textContent = new Date(element.createTime).toLocaleDateString()

        td = document.createElement('td')
        tr.appendChild(td)

        let button = document.createElement('button')
        td.append(button)
        button.textContent = '修改'
        button.onclick = function () {
            updateWorkProcessAction(element)
        }

        button = document.createElement('button')
        td.append(button)
        button.textContent = '删除'
        button.onclick = function () {
            deleteWorkProcessAction(element)
        }
    });

    new tableSort('workProcessTable', 1, 2, 999, 'up', 'down', 'hov');
}

function query() {
    let workId = document.getElementById('findWorkId').value
    let workName = document.getElementById('findWorkName').value
    let processId = document.getElementById('findProcessId').value
    let processName = document.getElementById('findProcessName').value


    if (workId.length !== 0) {
        findWorkId = workId
    } else {
        findWorkId = 0
    }

    if (workName !== null && workName !== undefined && workName.length !== 0) {
        findWorkName = workName
    } else {
        findWorkName = null
    }

    if (processId.length !== 0) {
        findProcessId = processId
    } else {
        findProcessId = 0
    }

    if (processName !== null && processName !== undefined && processName.length !== 0) {
        findProcessName = processName
    } else {
        findProcessName = null
    }

    loadWorkProcess(1)
}