window.addEventListener('DOMContentLoaded', event => {
    buildProfilePage(); // Construye la página de perfil.
    buildPublicationsTable(); // Construye la tabla de publicaciones.
    createConfirmationModal(); // Create the confirmation modal
    hideResetSortButton(); // Oculta el botón de resetear el orden de la tabla.
});

const buildProfilePage = () => {
    const { authorId, profile } = getQueryParams();
    const profileContainer = document.getElementById('profileContainer');
    
    if (!authorId || !profile) {
        profileContainer.style.display = 'none';
        return;
    };

    const author = appData.users.find(user => user.id == authorId);
    if (!author) return;

    const pageTitle = document.getElementById('pageTitle');
    pageTitle.textContent = `Perfil de ${author.firstName} ${author.lastName}`;

    const breadcrumbs = document.getElementById('breadcrumb');
    breadcrumbs.innerHTML = `
        <li class="breadcrumb-item"><a href="../index.html">Admin</a></li>
        <li class="breadcrumb-item"><a href="users.html">Usuarios</a></li>
        <li class="breadcrumb-item active">Perfil</li>
    `;

    const tableTitle = document.querySelector('#tableTitle');
    tableTitle.textContent = "Publicaciones del usuario";

    const userDataHtml = `
        <hr class="mb-4">
        <div class="row">
            <div class="col-md-4">
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Nombre</h5>
                        <hr>
                        <p class="card-text">${author.firstName}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Apellidos</h5>
                        <hr>
                        <p class="card-text">${author.lastName}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Email</h5>
                        <hr>
                        <p class="card-text">${author.email}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Fecha de Nacimiento</h5>
                        <hr>
                        <p class="card-text">${new Date(author.birthDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">País</h5>
                        <hr>
                        <p class="card-text">${author.country ? author.country : "Desconocido"}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Ciudad</h5>
                        <hr>
                        <p class="card-text">${author.city ? author.city : "Desconocida"}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    profileContainer.innerHTML = userDataHtml + profileContainer.innerHTML + "<hr>";
};

const buildPublicationsTable = () => {
    const publicationsListTable = document.getElementById('publicationsListTable');
    if (!publicationsListTable) return;

    const { authorId } = getQueryParams();
    const filteredPublications = authorId ? appData.publications.filter(publication => publication.authorId == authorId) : appData.publications;
    const sortedPublications = filteredPublications
        .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
        .sort((a, b) => new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate));

    const publications = sortedPublications
        .map(({ id, authorId, blocked, title, publicationDate, lastUpdateDate }) => {
            const author = appData.users.find(user => user.id === authorId);
            if (!author) return;

            const authorFullName = `${author.firstName} ${author.lastName}`;
            const formattedPublicationDate = new Date(publicationDate).toLocaleDateString();
            const formattedLastUpdateDate = new Date(lastUpdateDate).toLocaleDateString();

            return [
                id,
                title,
                `<a href="${window.location.pathname}?authorId=${authorId}">${authorFullName}</a>`,
                formattedPublicationDate,
                formattedLastUpdateDate,
                `<div class="d-grid gap-2">
                    <button class="btn btn-primary btn-sm w-100 mb-1" onclick="viewPublication('${id}')">Leer</button>
                    
                    ${
                        blocked ? 
                        `<button class="btn btn-success btn-sm w-100" onclick="confirmAction('unblockPublication', '${id}')">Desbloquear</button>` :
                        `<button class="btn btn-warning btn-sm w-100" onclick="confirmAction('blockPublication', '${id}')">Bloquear</button>`
                    }
                 </div>`,
            ];
        });

    const dataTable = new simpleDatatables.DataTable(publicationsListTable, {
        data: {
            headings: ["Id", "Titulo", "Autor", "Fecha de publicación", "Fecha de modificación", "Acciones"],
            data: publications
        },
        perPage: 5,
        perPageSelect: [5, 10, 15, 25, 50],
        labels: {
            placeholder: "Buscar",
            perPage: "Entradas por página",
            noRows: "No se encontraron entradas.",
            info: "Listando entradas entre la {start} y la {end}.",
            noResults: "No se encontraron resultados.",
        },
    });

    const applyBlockedClass = () => {
        document.querySelectorAll("#publicationsListTable tbody tr").forEach(row => {
            const id = row.children[0]?.textContent.trim();
            const publication = appData.publications.find(publication => publication.id == id);
            
            if (publication?.blocked) {
                row.classList.add("blocked-publication");
            } else {
                row.classList.remove("blocked-publication");
            }
        });
    };

    applyBlockedClass();

    dataTable.on('datatable.page', applyBlockedClass);
    dataTable.on('datatable.update', applyBlockedClass);
};

const resetPublicationsSort = () => {
    window.location.href = window.location.pathname;
};

const hideResetSortButton = () => {
    const resetSortButton = document.getElementById('resetPublicationsSort');
    if (!resetSortButton) return;

    const { authorId, profile } = getQueryParams();
    if (!authorId && !profile || authorId && profile || profile) {
        resetSortButton.style.display = 'none';
    }
}

const confirmAction = (action, email) => {
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = () => {
        window[action](email);
        modal.hide();
    };
    modal.show();
};

const createConfirmationModal = () => {
    const modalHtml = `
        <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmar acción</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ¿Estás seguro de que deseas realizar esta acción?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="confirmButton">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.viewPublication = (id) => {
    const publication = appData.publications.find(publication => publication.id == id);
    if (!publication) return;

    window.location.href = publication.contentFile;
};

window.blockPublication = (id) => {
    const publication = appData.publications.find(publication => publication.id == id);
    if (!publication) return;

    publication.blocked = true;
    updateAppDataInStorage();

    window.location.reload();
}

window.unblockPublication = (id) => {
    const publication = appData.publications.find(publication => publication.id == id);
    if (!publication) return;

    publication.blocked = false;
    updateAppDataInStorage();

    window.location.reload();
};