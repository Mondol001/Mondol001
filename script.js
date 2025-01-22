document.addEventListener("DOMContentLoaded", () => {
    const entryForm = document.getElementById("entryForm");
    const entryTable = document.getElementById("entryTable").querySelector("tbody");
    const totalAmountBox = document.getElementById("totalAmount");
    const reportModal = document.getElementById("reportModal");
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");
    const closeReportBtn = document.getElementById("closeReportBtn");
    const getReportBtn = document.getElementById("getReportBtn");

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    let totalAmount = 0;

    function formatDate(date) {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    }

    function renderTable() {
        entryTable.innerHTML = "";
        totalAmount = 0;
        entries.forEach((entry, index) => {
            totalAmount += parseFloat(entry.amount);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.docNo}</td>
                <td>${formatDate(entry.date)}</td>
                <td>${entry.itemName}</td>
                <td>৳ ${entry.amount}</td>
                <td>${entry.notes}</td>
                <td>
                    <div class="three-dots" data-index="${index}">
                        •••
                    </div>
                </td>
            `;
            entryTable.appendChild(row);
        });

        totalAmountBox.textContent = `Total: ৳ ${totalAmount}`;
    }

    entryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("date").value;
        const itemName = document.getElementById("itemName").value;
        const amount = document.getElementById("amount").value;
        const notes = document.getElementById("notes").value;

        const docNo = new Date().getTime();
        entries.push({ docNo, date, itemName, amount, notes });
        localStorage.setItem("entries", JSON.stringify(entries));

        renderTable();
        entryForm.reset();
    });

    getReportBtn.addEventListener("click", () => {
        // Report logic here...
        alert("Report generated!");
    });

    closeReportBtn.addEventListener("click", () => {
        reportModal.style.display = "none";
    });

    renderTable();
});