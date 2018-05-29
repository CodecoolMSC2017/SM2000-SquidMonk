function onUsersMenuClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');

    mainContentEl.textContent = '';
    const user = JSON.parse(localStorage.getItem('user'));

    const divEl = document.createElement('div');
    divEl.id = 'welcome-text';
    divEl.textContent = "Welcome, " + user.name + " (admin) " + "!";

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

function createTableHead() {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '5';
    tableHeadTh.textContent = 'Users';
    tableHeadTr.appendChild(tableHeadTh);
    return tableHeadTr;
}

function createUsersTableHead() {
    const usersTableHeaderTr = document.createElement('tr');

    const usersTableIdTh = document.createElement('th');
    usersTableIdTh.textContent = 'Id';

    const usersTableNameTh = document.createElement('th');
    usersTableNameTh.textContent = 'Name';

    const usersTableEmailTh = document.createElement('th');
    usersTableEmailTh.textContent = 'Email';

    const usersTablePasswordTh = document.createElement('th');
    usersTablePasswordTh.textContent = 'Password';

    const usersTableRoleTh = document.createElement('th');
    usersTableRoleTh.textContent = 'Role';

    usersTableHeaderTr.appendChild(usersTableIdTh);
    usersTableHeaderTr.appendChild(usersTableNameTh);
    usersTableHeaderTr.appendChild(usersTableEmailTh);
    usersTableHeaderTr.appendChild(usersTablePasswordTh);
    usersTableHeaderTr.appendChild(usersTableRoleTh);

    return usersTableHeaderTr;
}

function createUserRow(user) {
    const userTr = document.createElement('tr');
    userTr.id = user.id;
    //userTr.addEventListener('click', ...);

    const userIdTd = document.createElement('td');
    userIdTd.textContent = user.id;

    const userNameTd = document.createElement('td');
    userNameTd.textContent = user.name;

    const userEmailTd = document.createElement('td');
    userEmailTd.textContent = user.email;

    const userPasswordTd = document.createElement('td');
    userPasswordTd.textContent = user.password;

    const userRoleTd = document.createElement('td');
    if (user.admin) {
        userRoleTd.textContent = 'Admin';
    } else {
        userRoleTd.textContent = 'User';
    }

    userTr.appendChild(userIdTd);
    userTr.appendChild(userNameTd);
    userTr.appendChild(userEmailTd);
    userTr.appendChild(userPasswordTd);
    userTr.appendChild(userRoleTd);

    return userTr;
}

function onUsersReceived() {
    const users = JSON.parse(this.responseText);

    const mainDivEl = document.getElementById('main-content');

    const usersDiv = document.createElement('div');
    usersDiv.id = 'users-table';

    const usersTable = document.createElement('table');
    usersTable.appendChild(createTableHead());
    usersTable.appendChild(createUsersTableHead());
    usersTable.className = 'style-users-table';

    if (users.length == 0) {
        const messageTdEl = document.createElement('td');
        messageTdEl.colSpan = '5';
        messageTdEl.textContent = 'Users not exist!';

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