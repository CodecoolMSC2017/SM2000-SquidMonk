
function onCreateScheduleResponse() {
    if (this.status == OK) {
        requestSchedules();
    } else if (this.status == BAD_REQUEST) {
        const createButtonRow = document.getElementById('schedule-create-button-row');
        createButtonRow.innerHTML = '';
        const newTdEl = document.createElement('td');
        newTdEl.colSpan = '3';
        newTdEl.textContent = 'Schedule name can not be empty!';
        createButtonRow.appendChild(newTdEl);
        createButtonRow.addEventListener('click', onBadRequestClick);
    }
}

function onCreateTaskResponse() {
    if (this.status == OK) {
        requestTasks();
    } else if (this.status == BAD_REQUEST) {
        console.log('bad request');
    }
}

function onBadRequestClick() {
    const createButtonRow = document.getElementById('schedule-create-button-row');
    createButtonRow.innerHTML = '';
    const createButton = document.createElement('td');

    createButton.colSpan = '3';
    createButton.textContent = 'Create new schedule';
    createButtonRow.addEventListener('click', onCreateScheduleButtonClicked);

    createButtonRow.appendChild(createButton);
}

function onCreateScheduleSubmitButtonClicked() {
    const inputEl = document.getElementById('create-schedule-name-input');

    const params = new URLSearchParams();
    params.append('name', inputEl.value);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCreateScheduleResponse);
    xhr.open('POST', 'protected/schedules/user');
    xhr.send(params);
}

function onCreateTaskSubmitButtonClicked() {
    const inputEl = document.getElementById('create-task-name-input');

    const params = new URLSearchParams();
    params.append('name', inputEl.value);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCreateTaskResponse);
    xhr.open('POST', 'protected/tasks/user');
    xhr.send(params);
}

function onCreateScheduleButtonClicked() {
    this.removeEventListener('click', onCreateScheduleButtonClicked);

    const td1El = this.children[0];
    td1El.textContent = '';
    td1El.colSpan = '2';
    
    const inputEl = document.createElement('input');
    inputEl.id = 'create-schedule-name-input';
    inputEl.setAttribute('placeholder', 'Name');
    td1El.appendChild(inputEl);

    const buttonEl = document.createElement('button');
    buttonEl.textContent = 'Create';
    buttonEl.addEventListener('click', onCreateScheduleSubmitButtonClicked);

    const td2El = document.createElement('td');
    td2El.appendChild(buttonEl);
    this.appendChild(td2El);
}

function onCreateTaskButtonClicked() {
    this.removeEventListener('click', onCreateTaskButtonClicked);

    const td1El = this.children[0];
    td1El.textContent = '';
    td1El.colSpan = '2';
    
    const inputEl = document.createElement('input');
    inputEl.id = 'create-task-name-input';
    inputEl.setAttribute('placeholder', 'Name');
    td1El.appendChild(inputEl);

    const buttonEl = document.createElement('button');
    buttonEl.textContent = 'Create';
    buttonEl.addEventListener('click', onCreateTaskSubmitButtonClicked);

    const td2El = document.createElement('td');
    td2El.appendChild(buttonEl);
    this.appendChild(td2El);
}

function createTableHead(title) {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '3';
    tableHeadTh.textContent = title;
    tableHeadTr.appendChild(tableHeadTh);
    return tableHeadTr;
}

function createScheduleTableHead() {
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

function createTaskTableHead() {
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

function onSchedulesReceived() {
    const schedules = JSON.parse(this.responseText);

    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'dash-table';
    scheduleDiv.style.float = 'left';
    scheduleDiv.id = 'dashboard-schedule-table';

    const createButton = document.createElement('td');
    createButton.colSpan = '3';
    createButton.textContent = 'Create new schedule';

    const createButtonRow = document.createElement('tr');
    createButtonRow.addEventListener('click', onCreateScheduleButtonClicked);
    createButtonRow.id = 'schedule-create-button-row';
    createButtonRow.appendChild(createButton);

    const scheduleTable = document.createElement('table');
    scheduleTable.className = 'dashboard-table';
    scheduleTable.appendChild(createTableHead('My Schedules'));
    scheduleTable.appendChild(createButtonRow);
    scheduleTable.appendChild(createScheduleTableHead());

    for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        scheduleTable.appendChild(createScheduleRow(schedule));
    }
    scheduleDiv.appendChild(scheduleTable);

    const oldTable = document.getElementById('dashboard-schedule-table');
    if (oldTable != null) {
        oldTable.remove();
    }

    mainContentEl.appendChild(scheduleDiv);
}

function onTasksReceived() {
    const tasks = JSON.parse(this.responseText);

    const taskDiv = document.createElement('div');
    taskDiv.className = 'dash-table';
    taskDiv.style.float = 'right';
    taskDiv.id = 'dashboard-task-table';

    const createButton = document.createElement('td');
    createButton.colSpan = '3';
    createButton.textContent = 'Create new task';

    const createButtonRow = document.createElement('tr');
    createButtonRow.addEventListener('click', onCreateTaskButtonClicked);
    createButtonRow.id = 'task-create-button-row';
    createButtonRow.appendChild(createButton);

    const taskTable = document.createElement('table');
    taskTable.className = 'dashboard-table';
    taskTable.appendChild(createTableHead('My Tasks'));
    taskTable.appendChild(createButtonRow);
    taskTable.appendChild(createTaskTableHead());

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        taskTable.appendChild(createTaskRow(task));
    }
    taskDiv.appendChild(taskTable);

    const oldTable = document.getElementById('dashboard-task-table');
    if (oldTable != null) {
        oldTable.remove();
    }

    mainContentEl.appendChild(taskDiv);
}

function requestSchedules() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onSchedulesReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedules/user/' + user.id);
    xhr.send(params);
}

function requestTasks() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTasksReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/tasks/user/' + user.id);
    xhr.send(params);
}

function setupWelcomeDiv() {
    const user = JSON.parse(localStorage.getItem('user'));

    const welcomeDiv = document.createElement('div');
    welcomeDiv.id = 'welcome-text';
    welcomeDiv.textContent = "Welcome, " + user.name + "!";

    const mainDivEl = document.getElementById('main-content');
    mainDivEl.appendChild(welcomeDiv);
}

function showDashboard() {
    removeAllChildren(document.getElementById('main-content'));

    setupWelcomeDiv();

    requestSchedules();
    requestTasks();

    showContents(['topnav-content', 'main-content']);
}
