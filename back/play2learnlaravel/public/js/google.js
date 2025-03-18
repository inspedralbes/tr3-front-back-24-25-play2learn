let btnChange;

function init() {
    console.log('init')
    btnChange = document.querySelector('#btnChange');
}

function changePassword() {
    btnChange.addEventListener('click', function () {
        console.log("Boton click")
    });
}

document.addEventListener('DOMContentLoaded', function () {

    init();
    changePassword()

});
