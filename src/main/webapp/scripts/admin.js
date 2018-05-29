/***UsersMenu***/
//let admin;

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
    usersTableRoleTh.textContent = 'Role';
    usersTableRoleTh.className = 'role';

    usersTableHeaderTr.appendChild(usersTableIdTh);
    usersTableHeaderTr.appendChild(usersTableNameTh);
    usersTableHeaderTr.appendChild(usersTableEmailTh);
    /*usersTableHeaderTr.appendChild(usersTablePasswordTh);*/
    usersTableHeaderTr.appendChild(usersTableRoleTh);

    return usersTableHeaderTr;
}

function createUserRow(user) {
    const userTr = document.createElement('tr');
    userTr.id = user.id;
    userTr.addEventListener('click', onUserClick);

    const userIdTd = document.createElement('td');
    userIdTd.textContent = user.id;
    userIdTd.className = 'entry';

    const userNameTd = document.createElement('td');
    userNameTd.textContent = user.name;
    userNameTd.className = 'entry';

    const userEmailTd = document.createElement('td');
    userEmailTd.textContent = user.email;
    userEmailTd.className = 'entry';

    /*const userPasswordTd = document.createElement('td');
    userPasswordTd.textContent = user.password;
    userPasswordTd.className = 'entry';*/

    const userRoleTd = document.createElement('td');
    if (user.admin) {
        userRoleTd.textContent = 'Admin';
    } else {
        userRoleTd.textContent = 'User';
    }
    userRoleTd.className = 'entry';

    userTr.appendChild(userIdTd);
    userTr.appendChild(userNameTd);
    userTr.appendChild(userEmailTd);
    /*userTr.appendChild(userPasswordTd);*/
    userTr.appendChild(userRoleTd);

    return userTr;
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

    const user = JSON.parse(localStorage.getItem('user'));
    admin = user;

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
        const messageEl = document.getElementById('message-content');
        messageEl.innerHTML = json.message;
        showContents(['login-content', 'message-content']);
    }
}

function showUserDashboard(user) {
    clearMainContent();

    requestUserSchedules(user);
    requestUserTasks(user);

    showContents(['topnav-content', 'main-content', 'sound-content']);
}

function requestUserSchedules(user) {

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onSchedulesReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedules/user/' + user.id);
    xhr.send(params);
}

function requestUserTasks(user) {

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onTasksReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/tasks/user/' + user.id);
    xhr.send(params);
}