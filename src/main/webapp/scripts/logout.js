function onLogoutClick() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.admin) {
        const topDiv = document.getElementById('topnav-content');
        const showUserMenu = document.getElementById('show-users-menu');
        topDiv.removeChild(showUserMenu);
    }
    localStorage.removeItem('user');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'logout');
    xhr.addEventListener('load', onLogoutResponse);
    xhr.send();
}

function onLogoutResponse() {
    showContents(['message-content', 'login-content']);
    const message = JSON.parse(this.responseText);
    document.getElementById('message-content').textContent = message.message;
}