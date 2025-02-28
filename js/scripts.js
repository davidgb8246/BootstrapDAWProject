window.addEventListener('DOMContentLoaded', event => {
    checkSideBarToggle(); // Comprueba el estado del menu lateral.
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