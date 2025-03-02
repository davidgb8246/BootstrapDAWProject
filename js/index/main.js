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
    
    const users = appData.users
        .filter(({ admin }) => admin)
        .map(({ firstName, lastName, email, birthDate, country, city }) => {
            const birthDateFormatted = birthDate ? new Date(birthDate).toLocaleDateString() : "Desconocida";
            const countryFormatted = country ? country : "Desconocido";
            const cityFormatted = city ? city : "Desconocida";

            return [
                `${firstName} ${lastName}`.trim(),
                email,
                birthDateFormatted,
                countryFormatted,
                cityFormatted
            ];
        });

    const dataTable = new simpleDatatables.DataTable(adminListTable, {
        data: {
            headings: ["Nombre Completo", "Email", "Fecha nacimiento", "Pais", "Ciudad"],
            data: users
        },
        perPage: 2,
        perPageSelect: [2, 4, 10, 15, 25, 50],
        labels: {
            placeholder: "Buscar",
            perPage: "Entradas por página",
            noRows: "No se encontraron entradas.",
            info: "Listando entradas entre la {start} y la {end}.",
            noResults: "No se encontraron resultados.",
        },
    });

    const applyBlockedClass = () => {
        document.querySelectorAll("#adminListTable tbody tr").forEach(row => {
            const email = row.children[1]?.textContent.trim();
            const user = appData.users.find(user => user.email === email);
            
            if (user?.blocked) {
                row.classList.add("blocked-user");
            } else {
                row.classList.remove("blocked-user");
            }
        });
    };

    applyBlockedClass();

    dataTable.on('datatable.page', applyBlockedClass);
    dataTable.on('datatable.update', applyBlockedClass);
};