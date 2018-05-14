function onScheduleReceived() {
    
}

function onScheduleClick() {
    const user = JSON.parse(localStorage.getItem('user'));
    const params = new URLSearchParams();
    params.append('poemId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onScheduleReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/poems?' + params.toString());
    xhr.send();
}