function onMenuDashboardClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');

    mainContentEl.textContent = '';
    const user = JSON.parse(localStorage.getItem('user'));

    const divEl = document.createElement('div');
    divEl.id = 'welcome-text';
    divEl.textContent = "Welcome, " + user.name + "!";

    mainContentEl.appendChild(divEl);

    receiveSchedules();
    receiveTasks();
}

function receiveSchedules() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', setupMainContentEl);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedules/user/' + user.id);
    xhr.send(params);
}

function receiveTasks() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', setupTaskContentEl);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/tasks/user/' + user.id);
    xhr.send(params);
}

function setupTaskContentEl() {
    const tasks = JSON.parse(this.responseText);
    const taskDiv = document.createElement('div');
    taskDiv.className = 'dash-table';
    taskDiv.style.float = 'right';

    const taskTable = document.createElement('table');
    taskTable.className = 'dashboard-table';

    taskTable.appendChild(firstTableRow('My Tasks'));

    taskTable.appendChild(secondTaskRow());

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        taskTable.appendChild(createTaskRow(task));
    }

    taskDiv.appendChild(taskTable);
    mainContentEl.appendChild(taskDiv);
}

function setupMainContentEl() {
    const schedules = JSON.parse(this.responseText);
    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'dash-table';
    scheduleDiv.style.float = 'left';

    const scheduleTable = document.createElement('table');
    scheduleTable.className = 'dashboard-table';

    scheduleTable.appendChild(firstTableRow('My Schedules'));

    scheduleTable.appendChild(secondScheduleRow());

    for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];

        scheduleTable.appendChild(createScheduleRow(schedule));
    }

    scheduleDiv.appendChild(scheduleTable)
    mainContentEl.appendChild(scheduleDiv);
}

function firstTableRow(text) {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '3';
    tableHeadTh.textContent = text;
    tableHeadTr.appendChild(tableHeadTh);
    return tableHeadTr;
}

function secondScheduleRow() {
    const schedTableHeaderTr = document.createElement('tr');
    const schedTableNameTh = document.createElement('th');
    schedTableNameTh.textContent = 'Name';
    const schedTableNumTh = document.createElement('th');
    schedTableNumTh.textContent = 'Task No.';
    schedTableNumTh.className = 'taskno';
    const schedTablePublicTh = document.createElement('th');
    schedTablePublicTh.textContent = 'Public';
    schedTablePublicTh.className = 'public';

    schedTableHeaderTr.appendChild(schedTableNameTh);
    schedTableHeaderTr.appendChild(schedTableNumTh);
    schedTableHeaderTr.appendChild(schedTablePublicTh);

    return schedTableHeaderTr;
}

function secondTaskRow() {
    const taskTableHeaderTr = document.createElement('tr');
    const taskTableNameTh = document.createElement('th');
    taskTableNameTh.textContent = 'Name';
    const taskTableContentTh = document.createElement('th');
    taskTableContentTh.textContent = 'Content';
    taskTableContentTh.className = 'content';
    const taskTableScheduleTh = document.createElement('th');
    taskTableScheduleTh.textContent = 'Schedule';
    taskTableScheduleTh.className = 'schedule';

    taskTableHeaderTr.appendChild(taskTableNameTh);
    taskTableHeaderTr.appendChild(taskTableContentTh);
    taskTableHeaderTr.appendChild(taskTableScheduleTh);

    return taskTableHeaderTr;
}

function createScheduleRow(schedule) {
    const entryTr = document.createElement('tr');
    entryTr.id = schedule.scheduleId;

    const entryNameTd = document.createElement('td');
    entryNameTd.textContent = schedule.scheduleName;

    const entryNumTd = document.createElement('td');
    entryNumTd.textContent = schedule.numOfTasks;

    const entryPublicTd = document.createElement('td');
    if (schedule.public === true) {
        entryPublicTd.innerHTML = '<i class="fa fa-check"></i>';
    } else {
        entryPublicTd.innerHTML = '<i class="fa fa-remove"></i>';
    }

    entryTr.appendChild(entryNameTd);
    entryTr.appendChild(entryNumTd);
    entryTr.appendChild(entryPublicTd);

    entryTr.addEventListener('click', onScheduleClick);

    return entryTr;
}

function createTaskRow(task) {
    const entryTr = document.createElement('tr');

    entryTr.setAttribute('data-task-id', task.id);
    entryTr.addEventListener('click', getTask);

    const entryNameTd = document.createElement('td');
    entryNameTd.textContent = task.name;

    const entryContentTd = document.createElement('td');
    entryContentTd.textContent = task.content;

    const entryScheduleTd = document.createElement('td');
    if (task.scheduleId === null) {
        entryScheduleTd.textContent = 'null';
    } else {
        entryScheduleTd.textContent = task.scheduleId;
    }

    entryTr.appendChild(entryNameTd);
    entryTr.appendChild(entryContentTd);
    entryTr.appendChild(entryScheduleTd);

    //entryTr.addEventListener('click', onSchedMouseClick);

    return entryTr;
}