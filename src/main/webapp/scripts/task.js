
let currentTask;

function onDeleteResponse() {
    if (this.status = NO_CONTENT) {
        showDashboard();
    }
}

function createTaskAvailableScheduleTable(task) {
    const tableEl = document.createElement('table');
    tableEl.className = 'dash-table';
    tableEl.align = 'center';
    tableEl.style.marginTop = '20px';
    tableEl.style.width = '45%';

    const thEl = document.createElement('th');
    thEl.textContent = 'Available schedules for this task';

    const headTrEl = document.createElement('tr');
    headTrEl.appendChild(thEl);

    tableEl.appendChild(headTrEl);

    if (Object.keys(task.schedules).length == 0) {
        const tdEl = document.createElement('td');
        tdEl.className = 'entry';
        tdEl.textContent = 'There are no schedules available.';

        const trEl = document.createElement('tr');
        trEl.appendChild(tdEl);

        tableEl.appendChild(trEl);
    } else {
        for (let scheduleId in task.schedules) {
            const scheduleName = task.schedules[scheduleId];

            const tdEl = document.createElement('td');
            tdEl.className = 'entry';
            tdEl.textContent = scheduleName;

            const trEl = document.createElement('tr');
            trEl.id = scheduleId;
            trEl.addEventListener('click', onScheduleClick);
            trEl.appendChild(tdEl);
            
            tableEl.appendChild(trEl);
        }
    }
    return tableEl;
}

function onAvailableSchedulesReceived() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        const mainContentEl = document.getElementById('main-content');
        mainContentEl.appendChild(createTaskAvailableScheduleTable(task));
    } else {
        console.log(this.responseText);
    }
}

function onScheduleButtonClicked() {
    const user = JSON.parse(localStorage.getItem('user'));

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAvailableSchedulesReceived);
    xhr.open('GET', 'protected/tasks/user/' + user.id + '?taskId=' + currentTask.id);
    xhr.send();
}

function onDeleteButtonClicked() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteResponse);
    xhr.open('DELETE', 'protected/tasks/' + currentTask.id);
    xhr.send();
}

function onEditResponse() {
    if (this.status == OK) {
        getTask();
    } else {
        const message = JSON.parse(this.responseText);
        const container = document.getElementById('task-edit-input-container');
        newMessage(container, 'message', message.message);
    }
}

function onEditTaskSubmitButtonClicked() {
    const name = document.getElementById('task-edit-name-input').value;
    const content = document.getElementById('task-edit-content-input').value;

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('content', content);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onEditResponse);
    xhr.open('PUT', 'protected/tasks/' + currentTask.id + '?' + params.toString());
    xhr.send();
}

function onEditButtonClicked() {
    const oldPEl = document.getElementById('task-edit-input-container');
    if (oldPEl != null) {
        oldPEl.remove();
    }
    const nameInputEl = document.createElement('input');
    nameInputEl.value = currentTask.name;
    nameInputEl.placeholder = 'Title';
    nameInputEl.className = 'task-edit-input';
    nameInputEl.id = 'task-edit-name-input';

    const contentInputEl = document.createElement('input');
    contentInputEl.value = currentTask.content;
    contentInputEl.placeholder = 'Description';
    contentInputEl.className = 'task-edit-input';
    contentInputEl.id = 'task-edit-content-input';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Save';
    submitButton.className = 'task-edit-button';
    submitButton.addEventListener('click', onEditTaskSubmitButtonClicked);

    const pEl = document.createElement('p');
    pEl.id = 'task-edit-input-container';
    pEl.appendChild(nameInputEl);
    pEl.appendChild(contentInputEl);
    pEl.appendChild(document.createElement('br'));
    pEl.appendChild(submitButton);

    const mainContentEl = document.getElementById('main-content');
    mainContentEl.insertBefore(pEl, mainContentEl.children[2]);
}

function createTaskScheduleTable(task) {
    const tableEl = document.createElement('table');
    tableEl.align = 'center';
    tableEl.style.marginTop = '20px';
    tableEl.style.width = '45%';
    tableEl.className = 'dash-table';

    const thEl = document.createElement('th');
    thEl.textContent = 'Schedules containing this task';

    const headTrEl = document.createElement('tr');
    headTrEl.appendChild(thEl);

    tableEl.appendChild(headTrEl);

    if (Object.keys(task.schedules).length == 0) {
        const tdEl = document.createElement('td');
        tdEl.className = 'entry';
        tdEl.textContent = 'This task is not scheduled anywhere.';

        const trEl = document.createElement('tr');
        trEl.appendChild(tdEl);

        tableEl.appendChild(trEl);
    } else {
        for (let scheduleId in task.schedules) {
            const scheduleName = task.schedules[scheduleId];

            const tdEl = document.createElement('td');
            tdEl.className = 'entry';
            tdEl.textContent = scheduleName;

            const trEl = document.createElement('tr');
            trEl.id = scheduleId;
            trEl.addEventListener('click', onScheduleClick);
            trEl.appendChild(tdEl);
            
            tableEl.appendChild(trEl);
        }
    }
    return tableEl;
}

function displayTask(task) {
    currentTask = task;

    const taskNameEl = document.createElement('h1');
    taskNameEl.className = 'task-title';
    taskNameEl.textContent = task.name;

    const taskContentEl = document.createElement('h3');
    taskContentEl.className = 'task-description';
    if (task.content === '') {
        taskContentEl.textContent = 'No description';
    } else {
        taskContentEl.textContent = 'Description: ' + task.content;
    }

    const scheduleButton = document.createElement('button');
    scheduleButton.className = 'task-button';
    scheduleButton.textContent = 'Schedule task';
    scheduleButton.addEventListener('click', onScheduleButtonClicked);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'task-button';
    editButton.addEventListener('click', onEditButtonClicked);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'task-button';
    deleteButton.addEventListener('click', onDeleteButtonClicked);

    clearMainContent();

    const mainContentEl = document.getElementById('main-content');
    mainContentEl.style.textAlign = 'center';
    mainContentEl.appendChild(taskNameEl);
    mainContentEl.appendChild(taskContentEl);
    mainContentEl.appendChild(scheduleButton);
    mainContentEl.appendChild(editButton);
    mainContentEl.appendChild(deleteButton);

    mainContentEl.appendChild(createTaskScheduleTable(task));
}

function onTaskReceived() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        displayTask(task);
    } else {
        console.log(this.responseText);
    }
}

function getTask() {
    let taskId;
    if (typeof this.getAttribute != 'undefined') {
        taskId = this.getAttribute('data-task-id');
    } else {
        taskId = currentTask.id;
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTaskReceived);
    xhr.open('GET', "protected/tasks/" + taskId);
    xhr.send();
}
