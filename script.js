const entryForm = document.getElementById("entryForm");
const entryTable = document.querySelector("#entryTable tbody");
const totalAmountEl = document.getElementById("totalAmount");
const reportModal = document.getElementById("reportModal");
const reportTable = document.querySelector("#reportTable tbody");
const reportTotalAmountEl = document.getElementById("reportTotalAmount");
const closeReportModal = document.getElementById("closeReportModal");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let currentDocNo = entries.length > 0 ? entries[entries.length - 1].docNo + 1 : 1;

function updateDocNo() {
    document.getElementById("docNo").value = currentDocNo;
}

function renderTable() {
    entryTable.innerHTML = "";
    let totalAmount = 0;

    entries.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.docNo}</td>
            <td>${entry.date}</td>
            <td>${entry.itemName}</td>
            <td>${entry.amount}</td>
            <td>${entry.notes}</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        totalAmount += parseFloat(entry.amount);
        entryTable.appendChild(row);
    });

    totalAmountEl.textContent = `Total Amount: ${totalAmount}`;
    localStorage.setItem("entries", JSON.stringify(entries));
}

entryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newEntry = {
        docNo: currentDocNo,
        date: document.getElementById("entryDate").value,
        itemName: document.getElementById("itemName").value,
        amount: document.getElementById("amount").value,
        notes: document.getElementById("notes").value,
    };

    entries.push(newEntry);
    currentDocNo++;
    updateDocNo();
    renderTable();
    entryForm.reset();
});

function editEntry(index) {
    const entry = entries[index];
    document.getElementById("entryDate").value = entry.date;
    document.getElementById("itemName").value = entry.itemName;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("notes").value = entry.notes;

    deleteEntry(index);
}

function deleteEntry(index) {
    entries.splice(index, 1);
    renderTable();
}

updateDocNo();
renderTable();

closeReportModal.addEventListener("click", () => {
    reportModal.style.display = "none";
});