
function onLogoutClick() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'logout');
    xhr.addEventListener('load', onLogoutResponse);
    xhr.send();
}

function onLogoutResponse() {
    if (isGoogle) {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
    }
    localStorage.removeItem('user');

    showContents(['message-content', 'login-content']);
}
