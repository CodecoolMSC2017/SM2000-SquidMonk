/***UsersMenu***/


function onUsersMenuClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');

    mainContentEl.textContent = '';
    const user = JSON.parse(localStorage.getItem('user'));

    const divEl = document.createElement('div');
    divEl.id = 'welcome-text';
    divEl.textContent = "Welcome, " + user.name + " on the admin interface!";

    mainContentEl.appendChild(divEl);

    requestUsers();
}

function requestUsers() {
    const user = JSON.parse(localStorage.getItem('user'));

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/users');
    xhr.send();
}

function createTableDivHead() {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '4';
    tableHeadTh.textContent = 'Users';
    tableHeadTh.className = 'table-head';
    tableHeadTr.appendChild(tableHeadTh);
    return tableHeadTr;
}

function createUsersTableHead() {
    const usersTableHeaderTr = document.createElement('tr');

    const usersTableIdTh = document.createElement('th');
    usersTableIdTh.textContent = 'Id';
    usersTableIdTh.className = 'id';

    const usersTableNameTh = document.createElement('th');
    usersTableNameTh.textContent = 'Name';

    const usersTableEmailTh = document.createElement('th');
    usersTableEmailTh.textContent = 'Email';

    /*const usersTablePasswordTh = document.createElement('th');
    usersTablePasswordTh.textContent = 'Password';*/

    const usersTableRoleTh = document.createElement('th');
    usersTableRoleTh.textContent = 'Role (click change)';;
    usersTableRoleTh.className = 'role';

    usersTableHeaderTr.appendChild(usersTableIdTh);
    usersTableHeaderTr.appendChild(usersTableNameTh);
    usersTableHeaderTr.appendChild(usersTableEmailTh);
    /*usersTableHeaderTr.appendChild(usersTablePasswordTh);*/
    usersTableHeaderTr.appendChild(usersTableRoleTh);

    return usersTableHeaderTr;
}

function createUserRow(user) {
    const admin = JSON.parse(localStorage.getItem('user'));

    const userTr = document.createElement('tr');
    userTr.id = user.id;

    const userIdTd = document.createElement('td');
    userIdTd.textContent = user.id;
    userIdTd.className = 'entry';
    userIdTd.id = user.id;
    userIdTd.addEventListener('click', onUserClick);

    const userNameTd = document.createElement('td');
    userNameTd.textContent = user.name;
    userNameTd.className = 'entry';
    userNameTd.id = user.id;
    userNameTd.addEventListener('click', onUserClick);

    const userEmailTd = document.createElement('td');
    userEmailTd.textContent = user.email;
    userEmailTd.className = 'entry';
    userEmailTd.id = user.id;
    userEmailTd.addEventListener('click', onUserClick);

    /*const userPasswordTd = document.createElement('td');
    userPasswordTd.textContent = user.password;
    userPasswordTd.className = 'entry';*/

    const userRoleTd = document.createElement('td');
    userRoleTd.id = user.id;
    if (user.admin) {
        userRoleTd.textContent = 'Admin';
    } else {
        userRoleTd.textContent = 'User';
    }
    userRoleTd.className = 'entry';
    userRoleTd.addEventListener('mouseover', onRoleTdMouseHover);
    userRoleTd.addEventListener('mouseout', onRoleTdMouseOut);
    if (admin.id != user.id) {
        userRoleTd.addEventListener('click', onRoleClick);
    }

    userTr.appendChild(userIdTd);
    userTr.appendChild(userNameTd);
    userTr.appendChild(userEmailTd);
    /*userTr.appendChild(userPasswordTd);*/
    userTr.appendChild(userRoleTd);

    return userTr;
}

function onRoleTdMouseHover() {
    this.style.color = 'white';
    this.style.backgroundColor = 'black';
}

function onRoleTdMouseOut() {
    this.removeAttribute('style');
}

function onRoleClick() {

    const user = JSON.parse(localStorage.getItem('user'));
    admin = user;

    const userId = this.getAttribute('id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', roleResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/role/user/' + userId);
    xhr.send();
}

function roleResponse() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (this.status === OK) {
        onUsersMenuClick();
    } else {
        showContents(['login-content']);
    }
}

function onUsersReceived() {
    const users = JSON.parse(this.responseText);

    const mainDivEl = document.getElementById('main-content');

    const usersDiv = document.createElement('div');
    usersDiv.id = 'users-table';
    usersDiv.className = 'users-table';
    usersDiv.style.float = 'center';

    const usersTable = document.createElement('table');
    usersTable.appendChild(createTableDivHead());
    usersTable.appendChild(createUsersTableHead());
    usersTable.className = 'style-users-table';

    if (users.length == 0) {
        const messageTdEl = document.createElement('td');
        messageTdEl.colSpan = '4';
        messageTdEl.textContent = 'Users not exist!';
        messageTdEl.className = 'entry';

        const messageTrEl = document.createElement('tr');
        messageTrEl.appendChild(messageTdEl);
        usersTable.appendChild(messageTrEl);
    } else {
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            usersTable.appendChild(createUserRow(user));
        }
    }
    usersDiv.appendChild(usersTable);

    const oldTable = document.getElementById('users-table');
    if (oldTable != null) {
        oldTable.remove();
    }

    mainDivEl.appendChild(usersDiv);
}

/***user click***/

function onUserClick() {

    const userId = this.getAttribute('id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', usersResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/profile/user/' + userId);
    xhr.send();
}

function usersResponse() {
    const user = JSON.parse(this.responseText);

    const admin = JSON.parse(localStorage.getItem('user'));
    if (this.status === OK) {
        showContents(['topnav-content', 'main-content', 'sound-content']);
        mainContentEl = document.getElementById('main-content');
        mainContentEl.textContent = '';
        const divEl = document.createElement('div');
        divEl.id = 'welcome-text';
        divEl.textContent = "Welcome, "+ admin.name + " in " + user.name + " interface!";
        mainContentEl.appendChild(divEl);
        showUserDashboard(user);

        const usersButtonEl = document.getElementById('menu-users');
        if (admin.admin) {
            usersButtonEl.style.display = 'block';
            usersButtonEl.addEventListener('click', onUsersMenuClick);
        } else {
            usersButtonEl.style.display = 'none';
        }
    } else {
        showContents(['login-content']);
    }
}

function showUserDashboard(user) {

    requestUserSchedules(user);
    requestUserTasks(user);

    showContents(['topnav-content', 'main-content', 'sound-content']);
}

function requestUserSchedules(user) {

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onSchedulesReceivedByUser);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedules/user/' + user.id);
    xhr.send(params);
}

function requestUserTasks(user) {

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTasksReceivedByUser);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/tasks/user/' + user.id);
    xhr.send(params);
}

function onSchedulesReceivedByUser() {

    const schedules = JSON.parse(this.responseText);

    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'dash-table';
    scheduleDiv.style.float = 'left';
    scheduleDiv.id = 'dashboard-schedule-table';

    const scheduleTable = document.createElement('table');
    scheduleTable.className = 'dashboard-table';
    scheduleTable.appendChild(createTableHead('Schedules'));
    scheduleTable.appendChild(createScheduleTableHead());

    if (schedules.length == 0) {
        const messageTdEl = document.createElement('td');
        messageTdEl.colSpan = '3';
        messageTdEl.className = 'entry';
        messageTdEl.textContent = "He/She doesn't have any schedules.";

        const messageTrEl = document.createElement('tr');
        messageTrEl.appendChild(messageTdEl);
        scheduleTable.appendChild(messageTrEl);
    } else {
        for (let i = 0; i < schedules.length; i++) {
            const schedule = schedules[i];
            scheduleTable.appendChild(createScheduleRowByUser(schedule));
        }
    }
    scheduleDiv.appendChild(scheduleTable);

    const oldTable = document.getElementById('dashboard-schedule-table');
    if (oldTable != null) {
        oldTable.remove();
    }

    mainContentEl.appendChild(scheduleDiv);
}

function createScheduleRowByUser(schedule) {
    const entryTr = document.createElement('tr');
    entryTr.id = schedule.scheduleId;

    const entryNameTd = document.createElement('td');
    entryNameTd.textContent = schedule.scheduleName;
    entryNameTd.className = 'entry';
    entryNameTd.id = schedule.scheduleId;
    entryNameTd.addEventListener('click', onScheduleClickByUser);

    const entryNumTd = document.createElement('td');
    entryNumTd.textContent = schedule.numOfTasks;
    entryNumTd.className = 'entry';
    entryNumTd.id = schedule.scheduleId;
    entryNumTd.addEventListener('click', onScheduleClickByUser);

    const entryPublicTd = document.createElement('td');
    entryPublicTd.className = 'entry';
    entryPublicTd.id = schedule.scheduleId;
    entryPublicTd.setAttribute('isPublic', schedule.public);
    entryPublicTd.addEventListener('mouseover', onPublicTdMouseHover);
    entryPublicTd.addEventListener('mouseout', onPublicTdMouseOut);
    if (schedule.public === true) {
        entryPublicTd.innerHTML = '<i class="fa fa-check"></i>';
    } else {
        entryPublicTd.innerHTML = '<i class="fa fa-remove"></i>';
    }

    entryTr.appendChild(entryNameTd);
    entryTr.appendChild(entryNumTd);
    entryTr.appendChild(entryPublicTd);

    //entryTr.addEventListener('click', onScheduleClick);

    return entryTr;
}

function requestCurrentScheduleByUser() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceivedByUser);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule/' + currentScheduleId);
    xhr.send();
}

function onScheduleClickByUser() {
    currentScheduleId = this.getAttribute('id');
    requestCurrentScheduleByUser();
}

function onScheduleReceivedByUser() {
    const mainDiv = document.getElementById('main-content');

    if (this.status === 200) {
        removeAllChildren(mainDiv);
        const schedule = JSON.parse(this.responseText);
        if (schedule.columns.length == 0) {
            /* If no columns show this */
            noColumnMessageByUser(mainDiv, schedule.id);

        } else {

            /* Create first header row */
            createHeaderRowByUser(mainDiv, schedule);

            /* Create timeslot rows with tasks */
            createTimeslotRowsByUser(mainDiv, schedule);
        }
    } else if (this.status === 409) {
        document.getElementById('schedule-add-column').remove();
        let errorMessage;
        const error = JSON.parse(this.responseText);
        if (error.message.startsWith('ERROR: Task start')) {
            errorMessage = 'Task start time intersects another task';
        } else if (error.message.startsWith('ERROR: Task end')) {
            errorMessage = 'Task end time intersects another task';
        } else if (error.message.startsWith('ERROR: new row')) {
            errorMessage = 'End time of task can\'t be before start time';
        } else {
            errorMessage = 'Something went wrong. Try again.';
        }
        const darkBackgroundDiv = document.createElement('div');
        darkBackgroundDiv.setAttribute('class', 'schedule-above-div-dark');
        darkBackgroundDiv.setAttribute('id', currentScheduleId);
        darkBackgroundDiv.addEventListener('click', onScheduleClickByUser);

        const aboveDivEl = document.createElement('div');
        aboveDivEl.style.height = '80px';
        aboveDivEl.setAttribute('class', 'schedule-above-div');
        aboveDivEl.setAttribute('id', 'schedule-add-column');
        aboveDivEl.setAttribute('schedule-id', currentScheduleId);

        const hEl = document.createElement('h1');
        hEl.textContent = errorMessage;
        aboveDivEl.appendChild(hEl);

        mainDiv.appendChild(darkBackgroundDiv);
        mainDiv.appendChild(aboveDivEl);
        aboveDivEl.setAttribute('class', 'schedule-above-div');
    }
}

function noColumnMessageByUser(mainDiv, scheduleId){
    const messageDiv = document.createElement('div');
    messageDiv.setAttribute('class', 'hv-centered-div');
    messageDiv.setAttribute('id', 'schedule-add-column');
    messageDiv.setAttribute('schedule-id', scheduleId);

    const hEl = document.createElement('h1');
    hEl.setAttribute('class', 'hv-centered-text');
    hEl.textContent = "He/She doesn't have any routines defined!";

    messageDiv.appendChild(hEl);
    mainDiv.appendChild(messageDiv);
}

function createHeaderRowByUser(mainDiv, schedule, isGuest) {
    const tableDivEl = document.createElement('div');
    tableDivEl.setAttribute('class', 'schedule-div-table');

    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];

        const tableEl = document.createElement('table');
        tableEl.setAttribute('class', 'schedule-table');
        tableEl.setAttribute('id', column.id);

        const trEl = document.createElement('tr');
        trEl.setAttribute('id', 'header-row-' + column.id);

        const thEl = document.createElement('th');
        //thEl.addEventListener('click', editSingleRoutineName);
        thEl.textContent = column.name;
        thEl.setAttribute('columnId', column.id);
        thEl.setAttribute('colspan', '2');

        trEl.appendChild(thEl);
        tableEl.appendChild(trEl);
        tableDivEl.appendChild(tableEl);
        mainDiv.appendChild(tableDivEl);
    }
}

function onTasksReceivedByUser() {
    const tasks = JSON.parse(this.responseText);

    const taskDiv = document.createElement('div');
    taskDiv.className = 'dash-table';
    taskDiv.style.float = 'right';
    taskDiv.id = 'dashboard-task-table';

    const taskTable = document.createElement('table');
    taskTable.className = 'dashboard-table';
    taskTable.appendChild(createTableHead('Tasks'));
    taskTable.appendChild(createTaskTableHead());

    if (tasks.length == 0) {
        const messageTdEl = document.createElement('td');
        messageTdEl.colSpan = '2';
        messageTdEl.className = 'entry';
        messageTdEl.textContent = "He/She doesn't have any tasks.";

        const messageTrEl = document.createElement('tr');
        messageTrEl.appendChild(messageTdEl);
        taskTable.appendChild(messageTrEl);
    } else {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            taskTable.appendChild(createTaskRowByUser(task));
        }
    }
    taskDiv.appendChild(taskTable);

    const oldTable = document.getElementById('dashboard-task-table');
    if (oldTable != null) {
        oldTable.remove();
    }

    mainContentEl.appendChild(taskDiv);
}

function createTaskRowByUser(task) {
    const entryTr = document.createElement('tr');

    entryTr.setAttribute('data-task-id', task.id);
    entryTr.addEventListener('click', getTaskByUser);

    const entryNameTd = document.createElement('td');
    entryNameTd.textContent = task.name;
    entryNameTd.style.width = '80%';
    entryNameTd.className = 'entry';

    const entryUsagesTd = document.createElement('td');
    entryUsagesTd.textContent = task.usages;
    entryUsagesTd.style.width = '20%';
    entryNameTd.className = 'entry';

    entryTr.appendChild(entryNameTd);
    entryTr.appendChild(entryUsagesTd);

    return entryTr;
}

function onTaskReceivedByUser() {
    if (this.status == OK) {
        const task = JSON.parse(this.responseText);
        displayTaskByUser(task);
    } else {
        console.log(this.responseText);
    }
}

function getTaskByUser() {
    let taskId;
    if (typeof this.getAttribute != 'undefined') {
        taskId = this.getAttribute('data-task-id');
    } else {
        taskId = currentTask.id;
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTaskReceivedByUser);
    xhr.open('GET', "protected/tasks/" + taskId);
    xhr.send();
}

function displayTaskByUser(task) {
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

    clearMainContent();

    const mainContentEl = document.getElementById('main-content');
    mainContentEl.style.textAlign = 'center';
    mainContentEl.appendChild(taskNameEl);
    mainContentEl.appendChild(taskContentEl);

    mainContentEl.appendChild(createTaskScheduleTableByUser(task));
}

function createTaskScheduleTableByUser(task) {
    const otherTable = document.getElementById('task-available-schedule-table');
    if (otherTable != null) {
        otherTable.remove();
    }
    const tableEl = document.createElement('table');
    tableEl.align = 'center';
    tableEl.style.marginTop = '20px';
    tableEl.style.width = '45%';
    tableEl.className = 'dash-table';
    tableEl.id = 'task-schedule-table';

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
            trEl.addEventListener('click', onScheduleClickByUser);
            trEl.appendChild(tdEl);

            tableEl.appendChild(trEl);
        }
    }
    return tableEl;
}

function createTimeslotRowsByUser(mainDiv, schedule) {
    let taskSpaceCounter = 0;
    let tdHeight = 0;

    /* As many columns are needed as the column list's size */
    for (let i = 0; i < schedule.columns.length; i++) {
        const column = schedule.columns[i];
        const tableEl = document.getElementById(column.id)

        /* 24 slots (rows) are needed */
        for (let n = 0; n < 24; n++) {
            const task = column.tasks[n];
            const trEl = document.createElement('tr');
            const tdEl = document.createElement('td');
            tdEl.setAttribute('colspan', '2');
            taskSpaceCounter--;

            if (typeof task != 'undefined') {
                const slotsTaken = task.end - task.start;
                tdHeight = 39 * slotsTaken;

                tdEl.innerHTML = "<b>" + task.name + "</b><br>" + task.start + ":00 to " + task.end +":00";
                tdEl.setAttribute('rowspan', slotsTaken);
                tdEl.setAttribute('style', 'height: ' + tdHeight + 'px');
                tdEl.setAttribute('class', 'ok-task');
                const colors = new Array();
                for (let i = 0; i < 3; i++) {
                    const num = Math.floor((Math.random() * 120) + 60);
                    colors.push(num);
                }

                tdEl.style.backgroundColor = 'rgb('+colors[0]+', '+colors[1]+', '+colors[2]+')';
                tdEl.setAttribute('data-task-id', task.id);

                taskSpaceCounter = slotsTaken;

                if (tdHeight >= 120) {
                    tdEl.innerHTML = "<b>" + task.name + "</b><br><i>" + task.content + "</i><br><br>" + task.start + ":00 to " + task.end +":00";
                }

                trEl.appendChild(tdEl);
            }

            if (typeof task == 'undefined' && taskSpaceCounter <= 0) {
                tdEl.setAttribute('class', 'no-task');
                tdEl.setAttribute('startTime', n);
                tdEl.textContent = n + ":00 - " + (n+1) + ":00";

                trEl.appendChild(tdEl);
            }

            tableEl.appendChild(trEl);
        }
    }
}