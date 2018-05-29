function onLogoutClick() {
    const user = JSON.parse(localStorage.getItem('user'));
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