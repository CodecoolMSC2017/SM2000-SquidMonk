function onMenuProfileClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');

    mainContentEl.textContent = '';
    const user = JSON.parse(localStorage.getItem('user'));

    const divEl = document.createElement('div');
    divEl.id = 'welcome-text';
    divEl.textContent = "Welcome, " + user.name + "!";

    mainContentEl.appendChild(divEl);

    receiveProfile();
}

function receiveProfile() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', setupProfileContentEl);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/profile/user/' + user.id);
    xhr.send(params);
}

function setupProfileContentEl() {
    const user = JSON.parse(this.responseText);
    const userDiv = document.createElement('div');
    userDiv.className = 'dash-table';
    userDiv.style.float = 'center';

    const profileTable = document.createElement('table');
    profileTable.className = 'dashboard-table';

    profileTable.appendChild(firstTableRow('My Data'));

    profileTable.appendChild(secondProfileRow());

    profileTable.appendChild(createProfileRow(user));

    userDiv.appendChild(profileTable)
    mainContentEl.appendChild(userDiv);
}

function firstTableRow(text) {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '3';
    tableHeadTh.textContent = text;
    tableHeadTr.appendChild(tableHeadTh);
    return tableHeadTr;
}

function secondProfileRow() {
    const profTableHeaderTr = document.createElement('tr');
    const profTableNameTh = document.createElement('th');
    profTableNameTh.textContent = 'Name';
    const profTableEmailTh = document.createElement('th');
    profTableEmailTh.textContent = 'Email.';
    profTableEmailTh.className = 'email';
    const profTableAdminTh = document.createElement('th');
    profTableAdminTh.textContent = 'Role';
    profTableAdminTh.className = 'role';

    profTableHeaderTr.appendChild(profTableNameTh);
    profTableHeaderTr.appendChild(profTableEmailTh);
    profTableHeaderTr.appendChild(profTableAdminTh);

    return profTableHeaderTr;
}

function createProfileRow(user) {
    const entryTr = document.createElement('tr');
    entryTr.id = user.id;

    const entryNameTd = document.createElement('td');
    entryNameTd.textContent = user.name;

    const entryEmailTd = document.createElement('td');
    entryEmailTd.textContent = user.email;

    const entryAdminTd = document.createElement('td');
    if (user.admin === true) {
        entryAdminTd.innerHTML = 'Admin';
    } else {
        entryAdminTd.innerHTML = 'User';
    }

    entryTr.appendChild(entryNameTd);
    entryTr.appendChild(entryEmailTd);
    entryTr.appendChild(entryAdminTd);

    entryTr.addEventListener('click', onMenuProfileClick);

    return entryTr;
}