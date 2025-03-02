window.addEventListener('DOMContentLoaded', event => {
    buildPublicationsTable(); // Construye la tabla de publicaciones.
    createConfirmationModal(); // Create the confirmation modal
});

const buildPublicationsTable = () => {
    const publicationsListTable = document.getElementById('publicationsListTable');
    if (!publicationsListTable) return;

    const { authorId, profile } = getQueryParams();
    const filteredPublications = authorId ? appData.publications.filter(publication => publication.authorId == authorId) : appData.publications;
    const sortedPublications = filteredPublications
        .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
        .sort((a, b) => new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate));

    console.log(authorId);
    console.log(profile);

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