window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const adminListTable = document.getElementById('adminListTable');
    if (!adminListTable) return
    
    new simpleDatatables.DataTable(adminListTable);

    const tableBody = adminListTable.querySelector("tbody");
    const admins = appData.users.filter(({ admin }) => admin);
    
    admins.forEach(({ name, position, office, age, start_date, salary }) => {
        const filaTabla = document.createElement("tr");

        filaTabla.append(
            Object.assign(document.createElement("td"), { textContent: name }),
            Object.assign(document.createElement("td"), { textContent: position }),
            Object.assign(document.createElement("td"), { textContent: office }),
            Object.assign(document.createElement("td"), { textContent: age ? age : "Desconocida" }),
            Object.assign(document.createElement("td"), { textContent: start_date }),
            Object.assign(document.createElement("td"), { textContent: salary }),
        );

        tableBody.appendChild(filaTabla);
    });
});
