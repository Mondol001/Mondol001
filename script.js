document.addEventListener("DOMContentLoaded", function () {
    const entryForm = document.getElementById("entryForm");
    const entryTable = document.getElementById("entryTable").querySelector("tbody");
    const totalAmountBox = document.getElementById("totalAmount");
    const modal = document.getElementById("actionModal");
    const printReportBtn = document.getElementById("printReportBtn");

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    let totalAmount = 0;
    let currentIndex = null;

    function renderTable() {
        entryTable.innerHTML = "";
        totalAmount = 0;

        entries.forEach((entry, index) => {
            totalAmount += parseFloat(entry.amount);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.docNo}</td>
                <td>${entry.date}</td>
                <td>${entry.itemName}</td>
                <td>৳ ${entry.amount}</td>
                <td>${entry.notes}</td>
                <td>
                    <button class="action-btn" data-index="${index}">...</button>
                </td>
            `;
            entryTable.appendChild(row);
        });

        totalAmountBox.textContent = `৳ ${totalAmount}`;
    }

    entryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newEntry = {
            docNo: new Date().getTime(),
            date: document.getElementById("date").value,
            itemName: document.getElementById("itemName").value,
            amount: document.getElementById("amount").value,
            notes: document.getElementById("notes").value
        };

        entries.push(newEntry);
        localStorage.setItem("entries", JSON.stringify(entries));
        renderTable();
        entryForm.reset();
    });

    entryTable.addEventListener("click", function (e) {
        if (e.target.classList.contains("action-btn")) {
            currentIndex = e.target.dataset.index;
            modal.style.display = "flex";
        }
    });

    document.getElementById("editBtn").addEventListener("click", function () {
        const entry = entries[currentIndex];
        document.getElementById("date").value = entry.date;
        document.getElementById("itemName").value = entry.itemName;
        document.getElementById("amount").value = entry.amount;
        document.getElementById("notes").value = entry.notes;
        modal.style.display = "none";
    });

    document.getElementById("deleteBtn").addEventListener("click", function () {
        entries.splice(currentIndex, 1);
        localStorage.setItem("entries", JSON.stringify(entries));
        renderTable();
        modal.style.display = "none";
    });

    printReportBtn.addEventListener("click", function () {
        const printContent = document.querySelector(".container").innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
    });

    renderTable();
});