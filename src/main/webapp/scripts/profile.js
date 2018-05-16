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
    userDiv.className = 'prof-table';
    userDiv.style.float = 'center';

    const profileTable = document.createElement('table');
    profileTable.className = 'profboard-table';

    profileTable.appendChild(firstTableRow('My Data'));

    profileTable.appendChild(nameProfileRow(user));

    profileTable.appendChild(emailProfileRow(user));

    profileTable.appendChild(roleProfileRow(user));

    userDiv.appendChild(profileTable)
    mainContentEl.appendChild(userDiv);
}

function firstTableRow(text) {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '3';
    tableHeadTh.textContent = text;
    tableHeadTr.appendChild(tableHeadTh);
    tableHeadTh.className = 'table-head';
    return tableHeadTr;
}

function nameProfileRow(user) {
    const profTableNameTr = document.createElement('tr');
    const profTableNameTd = document.createElement('td');
    profTableNameTd.textContent = 'Name';

    const profEntryNameTd = document.createElement('td');
    profEntryNameTd.id = user.id;
    profEntryNameTd.textContent = user.name;

    const profUpdateNameTd = document.createElement('td');
    profUpdateNameTd.textContent = 'Change';

    profTableNameTr.appendChild(profTableNameTd);
    profTableNameTr.appendChild(profEntryNameTd);
    profTableNameTr.appendChild(profUpdateNameTd);

    return profTableNameTr;
}

function emailProfileRow(user) {
    const profTableEmailTr = document.createElement('tr');
    const profTableEmailTd = document.createElement('td');
    profTableEmailTd.textContent = 'Email';

    const profEntryEmailTd = document.createElement('td');
    profEntryEmailTd.id = user.id;
    profEntryEmailTd.textContent = user.email;

    const profUpdateEmailTd = document.createElement('td');
    profUpdateEmailTd.textContent = 'Change';

    profTableEmailTr.appendChild(profTableEmailTd);
    profTableEmailTr.appendChild(profEntryEmailTd);
    profTableEmailTr.appendChild(profUpdateEmailTd);

    return profTableEmailTr;
}

function roleProfileRow(user) {
    const profTableRoleTr = document.createElement('tr');
    const profTableRoleTd = document.createElement('td');
    profTableRoleTd.textContent = 'Role';

    const profEntryRoleTd = document.createElement('td');
    profEntryRoleTd.id = user.id;
    if (user.admin === true) {
        profEntryRoleTd.innerHTML = 'Admin';
    } else {
        profEntryRoleTd.innerHTML = 'User';
    }

    const profUpdateRoleTd = document.createElement('td');
    profUpdateRoleTd.textContent = 'Change';

    profTableRoleTr.appendChild(profTableRoleTd);
    profTableRoleTr.appendChild(profEntryRoleTd);
    profTableRoleTr.appendChild(profUpdateRoleTd);

    return profTableRoleTr;
}

/*function secondProfileRow() {
      const profTableHeaderTr = document.createElement('tr');
      const profTableNameTh = document.createElement('td');
      profTableNameTh.textContent = 'Name';
      const profTableEmailTh = document.createElement('td');
      profTableEmailTh.textContent = 'Email.';
      profTableEmailTh.className = 'email';
      const profTableAdminTh = document.createElement('td');
      profTableAdminTh.textContent = 'Role';
      profTableAdminTh.className = 'role';

      profTableHeaderTr.appendChild(profTableNameTh);
      profTableHeaderTr.appendChild(profTableEmailTh);
      profTableHeaderTr.appendChild(profTableAdminTh);

      return profTableHeaderTr;
  }*/

/*function createProfileRow(user) {
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
  }*/