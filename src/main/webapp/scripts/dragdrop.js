let taskToDeleteId;
let needed;
let dragColumnId;

function onDragDropClick(columnId) {
    needed = true;
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDragDropTasksReceived);
    xhr.open('GET', 'protected/column/' + columnId + '/availableTasks');
    xhr.send();
}

function onDragDropTasksReceived() {
    if (this.status === OK) {
        clearMainContent();
        const mainDiv = document.getElementById('main-content');

        const tasks = JSON.parse(this.responseText);

        const sideBar = document.createElement('div');
        sideBar.className = 'side-bar';
        sideBar.id = 'side-bar';
        sideBar.setAttribute('ondragover', 'scheduledTaskAllowDrop(event)');
        sideBar.setAttribute('ondragleave', 'scheduledTaskDenyDrop(event)');
        sideBar.setAttribute('ondrop', 'onScheduledTaskDrop(event)');

        const hEl = document.createElement('h1');
        hEl.style.color = 'white';
        hEl.setAttribute('class', 'hv-centered-text')
        hEl.textContent = 'Available tasks';
        hEl.style.paddingTop = '10%';
        sideBar.appendChild(hEl);

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            const divEl = document.createElement('div');
            divEl.className = 'dragdrop-task';
            const colors = new Array();
            for (let i = 0; i < 3; i++) {
                const num = Math.floor((Math.random() * 120) + 60);
                colors.push(num);
            }
            divEl.setAttribute('task-id', task.id);
            divEl.setAttribute('ondragstart', 'drag(event)');
            divEl.setAttribute('draggable', 'true');
            divEl.style.backgroundColor = 'rgb('+colors[0]+', '+colors[1]+', '+colors[2]+')';
            divEl.innerHTML = '<b>'+task.name+'</b>';

            sideBar.appendChild(divEl);
        }

        const dragDropMainEl = createDragDropMain();
        dragDropMainEl.appendChild(createDragDropTableHeader());
        mainDiv.appendChild(dragDropMainEl);
        mainDiv.appendChild(sideBar);
        createTimeslotRows();
        tableFix();
    } else {
        onOtherResponse(this);
    }
}

function tableFix() {
    const tableEl = document.getElementsByClassName('schedule-div-table');

    const tdEls = tableEl[0].getElementsByTagName('td');

    for (let i = 0; i < tdEls.length; i++) {
        tdEls[i].classList.add('dragdrop-target');
        tdEls[i].setAttribute('ondragover', 'allowDrop(event)');
        tdEls[i].setAttribute('ondragleave', 'denyDrop(event)');
        tdEls[i].setAttribute('ondrop', 'drop(event)');
    }
}

function createDragDropMain() {
    const dragDropMainEl = document.createElement('div');
    dragDropMainEl.id = 'drag-drop-main';

    const buttonDivEl = document.createElement('div');
    buttonDivEl.className = 'h-centered-div';

    const saveButton = document.createElement('button');
    saveButton.className = 'schedule-button';
    saveButton.addEventListener('click', onDragDropSaveChangesClicked);
    saveButton.textContent = 'Save changes';

    const undoButton = document.createElement('button');
    undoButton.className = 'schedule-button';
    undoButton.addEventListener('click', onDragDropUndoClicked);
    undoButton.textContent = 'Undo last change';

    const backButton = document.createElement('button');
    backButton.className = 'schedule-button';
    backButton.addEventListener('click', requestCurrentSchedule);
    backButton.textContent = 'Back';

    dragDropMainEl.appendChild(saveButton);
    dragDropMainEl.appendChild(undoButton);
    dragDropMainEl.appendChild(backButton);

    return dragDropMainEl;
}

function setDragColumnId(id) {
    dragColumnId = id;
}

function createDragDropTableHeader() {
    const tableDivEl = document.createElement('div');
    tableDivEl.setAttribute('class', 'schedule-div-table');

    for (let i = 0; i < currentSchedule.columns.length; i++) {
        const column = currentSchedule.columns[i];

        const tableEl = document.createElement('table');
        tableEl.setAttribute('class', 'dragdrop-schedule-table');
        tableEl.setAttribute('id', column.id);
        tableEl.addEventListener('mouseover', function() {setDragColumnId(column.id);});

        const trEl = document.createElement('tr');
        trEl.setAttribute('id', 'header-row-' + column.id);

        const thEl = document.createElement('th');
        thEl.textContent = column.name;
        thEl.setAttribute('columnId', column.id);
        thEl.setAttribute('colspan', '2');

        trEl.appendChild(thEl);
        tableEl.appendChild(trEl);
        tableDivEl.appendChild(tableEl);
    }

    return tableDivEl;
}

function onDragDropSaveChangesClicked() {

}

function onDragDropUndoClicked() {

}

function allowDrop(ev) {
    ev.preventDefault();
    ev.target.setAttribute('drop-active', 'true');
}

function denyDrop(ev) {
    ev.preventDefault();
    ev.target.setAttribute('drop-active', 'false');
}

function drag(ev) {
    if (document.getElementById('data-to-drop') != null) {
        document.getElementById('data-to-drop').removeAttribute('data-to-drop');
    }
    ev.target.id = 'data-to-drop';
}

function drop(ev) {
    removeTdAttrs();

    ev.preventDefault();
    const task = document.getElementById('data-to-drop');
    const taskId = task.getAttribute('task-id');
    const startTime = ev.target.getAttribute('starttime');
    onDragAddTaskToColumn(taskId, startTime);
}

function onDragAddTaskToColumn(taskId, startTime) {
    const params = new URLSearchParams();
    params.append('taskId', taskId);
    params.append('start', startTime);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', doRequestScheduleForDrag);
    xhr.open('POST', 'protected/column/' + dragColumnId);
    xhr.send(params);
}

function removeTdAttrs() {
    const tableEl = document.getElementsByClassName('schedule-div-table');

    const tdEls = tableEl[0].getElementsByTagName('td');
    for (let i = 0; i < tdEls.length; i++) {
        tdEls[i].setAttribute('drop-active', 'false');
    }
}

function onScheduleReceivedAfterDrag() {
    currentSchedule = JSON.parse(this.responseText);
    onDragDropClick(dragColumnId);
}

function doRequestScheduleForDrag() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceivedAfterDrag);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/' + currentSchedule.id);
    xhr.send();
}

function onScheduledTaskDragStart(ev) {
    taskToDeleteId = ev.target.getAttribute('data-task-id');
}

function scheduledTaskAllowDrop(ev) {
    ev.preventDefault();
    document.getElementById('side-bar').setAttribute('drop-active', 'true');
}

function scheduledTaskDenyDrop(ev) {
    ev.preventDefault();
    document.getElementById('side-bar').setAttribute('drop-active', 'false');
}

function onScheduledTaskDrop(ev) {
    ev.preventDefault();
    document.getElementById('side-bar').setAttribute('drop-active', 'false');
    dragScheduleDeleteTask();
}

function dragScheduleDeleteTask() {
    const params = new URLSearchParams();
    params.append('scheduleId', currentSchedule.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteScheduleTaskResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('DELETE', 'protected/schedule/task/' + taskToDeleteId + '?' + params.toString());
    xhr.send();
}