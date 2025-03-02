window.addEventListener('DOMContentLoaded', event => {
    getIndexCardsData(); // Obtiene los datos de las tarjetas de info.
    buildAdminTable(); // Construye la tabla de administradores.
});


const getIndexCardsData = () => {
    const userCounter = document.querySelector("#user-counter");
    const pendingUserCounter = document.querySelector("#pendingUser-counter");
    const publicationsCounter = document.querySelector("#publications-counter");
    const blockedPublicationsCounter = document.querySelector("#blockedPublications-counter");

    userCounter.textContent = appData.users.length;
    pendingUserCounter.textContent = appData.users.filter(({ blocked }) => blocked).length;

    publicationsCounter.textContent = appData.publications.length;
    blockedPublicationsCounter.textContent = appData.publications.filter(({ blocked }) => blocked).length;
};

const buildAdminTable = () => {
    const adminListTable = document.getElementById('adminListTable');
    if (!adminListTable) return;
    
    const admins = appData.users
        .filter(({ admin }) => admin)
        .map(({ name, position, office, age, start_date, salary }) => [
            name,
            position,
            office,
            age ? age : "Desconocida",
            start_date,
            salary
        ]);

    new simpleDatatables.DataTable(adminListTable, {
        data: {
            headings: ["Nombre", "Puesto", "Oficina", "Edad", "Fecha Inicio", "Salario"],
            data: admins
        },
        labels: {
            placeholder: "Buscar",
            perPage: "Entradas por página",
            noRows: "No se encontraron entradas.",
            info: "Listando entradas entre la {start} y la {end}.",
            noResults: "No se encontraron resultados.",
        },
    });
};