
function onLoad() {
    

    loginDivEl = document.getElementById("login-content");
    loginFormEl = document.forms['login-form'];

    if (!loginFirstLoad) {
        document.getElementById('message-content').textContent = '';
        loginDivEl.style.display = 'block';
        registerDivEl.style.display = 'none';
    } else {
        loginFirstLoad = false;
        loginFormEl.appendChild(setupLoginTable());
        loginDivEl.appendChild(loginFormEl);
    }
}

document.addEventListener('DOMContentLoaded', onLoad);
