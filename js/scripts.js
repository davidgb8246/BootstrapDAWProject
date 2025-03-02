window.addEventListener('DOMContentLoaded', event => {
    checkSideBarToggle(); // Comprueba el estado del menu lateral.
    setYearCopyright(); // Establece el año del copyright.
    setUserLoggedIn(); // Establece el usuario logueado.
});


const checkSideBarToggle = () => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (!sidebarToggle) return;

    if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.toggle('sb-sidenav-toggled');
    }

    sidebarToggle.addEventListener('click', event => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
};


const setYearCopyright = () => {
    const copyright = document.body.querySelector('#copyright');
    if (!copyright) return;

    copyright.textContent = `${copyright.textContent} ${new Date().getFullYear()}`;
};


const setUserLoggedIn = () => {
    const userLogged = document.body.querySelector('#userLogged');
    if (!userLogged) return;

    const userLoggedIn = appData.users.find(user => user.id === appData.userLoggedIn.id);
    userLogged.textContent = userLoggedIn?.username || 'Desconocido'; 
};