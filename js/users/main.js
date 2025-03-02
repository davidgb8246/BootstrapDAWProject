window.addEventListener('DOMContentLoaded', event => {
    buildUsersTable(); // Construye la tabla de usuarios.
    createConfirmationModal(); // Create the confirmation modal
    createEditUserModal(); // Create the edit user modal
    createAddUserModal(); // Create the add user modal
});

const buildUsersTable = () => {
    const usersListTable = document.getElementById('usersListTable');
    if (!usersListTable) return;
    
    const users = appData.users
        .map(({ firstName, lastName, email, admin, blocked }) => [
            `${firstName} ${lastName}`.trim(),
            email,
            admin ? "Sí" : "No",
            `<div class="d-grid gap-2 d-md-block">
                <div class="row">
                    <div class="col-12 col-md-6 mb-1">
                        <button class="btn btn-primary btn-sm w-100" onclick="viewUser('${email}')">Ver publicaciones</button>
                    </div>
                    <div class="col-12 col-md-6 mb-1">
                        <button class="btn btn-secondary btn-sm w-100" onclick="editUser('${email}')">Editar</button>
                    </div>
                    ${
                        blocked ? 
                        `<div class="col-12 col-md-6 mb-1">
                            <button class="btn btn-success btn-sm w-100" onclick="confirmAction('unblockUser', '${email}')">Desbloquear</button>
                        </div>` :
                        `<div class="col-12 col-md-6 mb-1">
                            <button class="btn btn-warning btn-sm w-100" onclick="confirmAction('blockUser', '${email}')">Bloquear</button>
                        </div>`
                    }
                    <div class="col-12 col-md-6">
                        <button class="btn btn-danger btn-sm w-100" onclick="confirmAction('deleteUser', '${email}')">Eliminar</button>
                    </div>
                </div>
             </div>`
        ]);

    const dataTable = new simpleDatatables.DataTable(usersListTable, {
        data: {
            headings: ["Nombre Completo", "Email", "Admin", "Acciones"],
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
        document.querySelectorAll("#usersListTable tbody tr").forEach(row => {
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

const createEditUserModal = () => {
    const modalHtml = `
        <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editUserModalLabel">Editar usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm">
                            <div class="mb-3">
                                <label for="editUserFirstName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="editUserFirstName" required>
                            </div>
                            <div class="mb-3">
                                <label for="editUserLastName" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="editUserLastName" required>
                            </div>
                            <div class="mb-3">
                                <label for="editUserEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="editUserEmail" autocomplete="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="editUserBirthDate" class="form-label">Fecha de nacimiento</label>
                                <input type="date" class="form-control" id="editUserBirthDate">
                            </div>
                            <div class="mb-3">
                                <label for="editUserCountry" class="form-label">País de residencia</label>
                                <input type="text" class="form-control" id="editUserCountry">
                            </div>
                            <div class="mb-3">
                                <label for="editUserCity" class="form-label">Ciudad de residencia</label>
                                <input type="text" class="form-control" id="editUserCity">
                            </div>
                            <div class="mb-3">
                                <label for="editUserPassword" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="editUserPassword" autocomplete="new-password">
                            </div>
                            <div class="mb-3">
                                <label for="editUserConfirmPassword" class="form-label">Confirmar contraseña</label>
                                <input type="password" class="form-control" id="editUserConfirmPassword" autocomplete="new-password">
                            </div>
                            <div class="mb-3">
                                <label for="editUserAdmin" class="form-label">Admin</label>
                                <input type="checkbox" class="form-check-input" id="editUserAdmin">
                            </div>
                            <div class="mb-3">
                                <label for="editUserBlocked" class="form-label">Bloqueado</label>
                                <input type="checkbox" class="form-check-input" id="editUserBlocked">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveUserButton">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('editUserForm').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('saveUserButton').click();
        }
    });
};

const createAddUserModal = () => {
    const modalHtml = `
        <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addUserModalLabel">Añadir usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addUserForm">
                            <div class="mb-3">
                                <label for="addUserFirstName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="addUserFirstName" required>
                            </div>
                            <div class="mb-3">
                                <label for="addUserLastName" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="addUserLastName" required>
                            </div>
                            <div class="mb-3">
                                <label for="addUserEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="addUserEmail" autocomplete="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="addUserBirthDate" class="form-label">Fecha de nacimiento</label>
                                <input type="date" class="form-control" id="addUserBirthDate">
                            </div>
                            <div class="mb-3">
                                <label for="addUserCountry" class="form-label">País de residencia</label>
                                <input type="text" class="form-control" id="addUserCountry">
                            </div>
                            <div class="mb-3">
                                <label for="addUserCity" class="form-label">Ciudad de residencia</label>
                                <input type="text" class="form-control" id="addUserCity">
                            </div>
                            <div class="mb-3">
                                <label for="addUserPassword" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="addUserPassword" autocomplete="new-password">
                            </div>
                            <div class="mb-3">
                                <label for="addUserConfirmPassword" class="form-label">Confirmar contraseña</label>
                                <input type="password" class="form-control" id="addUserConfirmPassword" autocomplete="new-password">
                            </div>
                            <div class="mb-3">
                                <label for="addUserAdmin" class="form-label">Admin</label>
                                <input type="checkbox" class="form-check-input" id="addUserAdmin">
                            </div>
                            <div class="mb-3">
                                <label for="addUserBlocked" class="form-label">Bloqueado</label>
                                <input type="checkbox" class="form-check-input" id="addUserBlocked">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveNewUserButton">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('addUserForm').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('saveNewUserButton').click();
        }
    });

    document.getElementById('saveNewUserButton').onclick = async () => {
        const newUser = {
            firstName: document.getElementById('addUserFirstName').value,
            lastName: document.getElementById('addUserLastName').value,
            email: document.getElementById('addUserEmail').value,
            birthDate: document.getElementById('addUserBirthDate').value,
            country: document.getElementById('addUserCountry').value,
            city: document.getElementById('addUserCity').value,
            password: await hashSHA256(document.getElementById('addUserPassword').value),
            admin: document.getElementById('addUserAdmin').checked,
            blocked: document.getElementById('addUserBlocked').checked,
        };

        appData.users.push(newUser);
        updateAppDataInStorage();
        window.location.reload();
    };
};

const showAddUserModal = () => {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
};

window.editUser = (email) => {
    const user = appData.users.find(user => user.email === email);
    if (!user) return;

    document.getElementById('editUserFirstName').value = user.firstName;
    document.getElementById('editUserLastName').value = user.lastName;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserBirthDate').value = user.birthDate;
    document.getElementById('editUserCountry').value = user.country ? user.country : "";
    document.getElementById('editUserCity').value = user.city ? user.city : "";
    document.getElementById('editUserPassword').value = "";
    document.getElementById('editUserConfirmPassword').value = "";
    document.getElementById('editUserAdmin').checked = user.admin;
    document.getElementById('editUserBlocked').checked = user.blocked;

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();

    document.getElementById('saveUserButton').onclick = async () => {
        user.firstName = document.getElementById('editUserFirstName').value;
        user.lastName = document.getElementById('editUserLastName').value;
        user.email = document.getElementById('editUserEmail').value;
        user.birthDate = document.getElementById('editUserBirthDate').value;
        user.country = document.getElementById('editUserCountry').value ? document.getElementById('editUserCountry').value : null;
        user.city = document.getElementById('editUserCity').value ? document.getElementById('editUserCity').value : null;

        const pass = document.getElementById('editUserPassword').value;
        const confirmPass = document.getElementById('editUserConfirmPassword').value;

        if (pass !== confirmPass) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        if (pass) {
            user.password = await hashSHA256(pass);
        }

        user.admin = document.getElementById('editUserAdmin').checked;
        user.blocked = document.getElementById('editUserBlocked').checked;

        updateAppDataInStorage();
        modal.hide();

        setTimeout(() => {
            window.location.reload();
        }, 500);
    };
};

window.viewUser = (email) => {
    // Custom code for viewing user
    console.log(`Viewing user with email: ${email}`);
};

window.deleteUser = (email) => {
    appData.users = appData.users.filter(user => user.email !== email);
    updateAppDataInStorage();
    window.location.reload();
};

window.blockUser = (email) => {
    const user = appData.users.find(user => user.email === email);
    if (!user) return;

    user.blocked = true;
    updateAppDataInStorage();

    window.location.reload();
};

window.unblockUser = (email) => {
    const user = appData.users.find(user => user.email === email);
    if (!user) return;

    user.blocked = false;
    updateAppDataInStorage();
    
    window.location.reload();
};