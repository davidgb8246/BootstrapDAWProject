window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

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

    // Initialize DataTable with dynamic data
    new simpleDatatables.DataTable(adminListTable, {
        data: {
            headings: ["Name", "Position", "Office", "Age", "Start Date", "Salary"],
            data: admins
        }
    });
});