// Initialize variables
let entries = [];
let docNumber = 1; // Initial document number
const totalAmountElement = document.getElementById("totalAmount");

// DOM Elements
const addEntryButton = document.getElementById("addEntryButton");
const entryDocNoField = document.getElementById("entryDocNo");
const dateField = document.getElementById("date");
const itemNameField = document.getElementById("itemName");
const amountField = document.getElementById("amount");
const notesField = document.getElementById("notes");
const entriesTableBody = document.getElementById("entriesTableBody");
const reportButton = document.getElementById("reportButton");
const reportModal = document.getElementById("reportModal");
const closeReportModal = document.getElementById("closeReportModal");
const getReportButton = document.getElementById("getReportButton");
const startDateField = document.getElementById("startDate");
const endDateField = document.getElementById("endDate");

let isEditing = false;
let editingIndex = null;

// Utility to refresh document number
function refreshDocNumber() {
    entryDocNoField.value = `DOC-${docNumber}`;
}

// Utility to update total amount
function updateTotalAmount() {
    const total = entries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    totalAmountElement.value = `৳ ${total.toFixed(2)}`;
}

// Add Entry
addEntryButton.addEventListener("click", function () {
    const docNo = entryDocNoField.value;
    const date = dateField.value;
    const itemName = itemNameField.value;
    const amount = parseFloat(amountField.value);
    const notes = notesField.value;

    if (!date || !itemName || isNaN(amount) || amount <= 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (isEditing) {
        // Save edited entry
        entries[editingIndex] = { docNo, date, itemName, amount, notes };
        isEditing = false;
        addEntryButton.textContent = "Add Entry";
    } else {
        // Add new entry
        entries.push({ docNo, date, itemName, amount, notes });
        docNumber++;
    }

    // Clear fields and refresh UI
    refreshDocNumber();
    dateField.value = "";
    itemNameField.value = "";
    amountField.value = "";
    notesField.value = "";
    renderEntries();
    updateTotalAmount();
});

// Render Entries in Table
function renderEntries() {
    entriesTableBody.innerHTML = "";
    entries.forEach((entry, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${entry.docNo}</td>
            <td>${entry.date}</td>
            <td>${entry.itemName}</td>
            <td>৳ ${entry.amount.toFixed(2)}</td>
            <td>${entry.notes}</td>
            <td>
                <button class="action-button" onclick="editEntry(${index})">Edit</button>
                <button class="action-button" onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;

        entriesTableBody.appendChild(row);
    });
}

// Edit Entry
function editEntry(index) {
    const entry = entries[index];
    entryDocNoField.value = entry.docNo;
    dateField.value = entry.date;
    itemNameField.value = entry.itemName;
    amountField.value = entry.amount;
    notesField.value = entry.notes;

    // Mark as editing
    isEditing = true;
    editingIndex = index;
    addEntryButton.textContent = "Save Changes"; // Change button text to "Save Changes"
}

// Delete Entry
function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        entries.splice(index, 1); // Remove the entry from the array
        renderEntries(); // Re-render the entries table
        updateTotalAmount(); // Update the total amount
    }
}

// Report Modal Toggle
reportButton.addEventListener("click", function() {
    reportModal.style.display = "flex";
});

closeReportModal.addEventListener("click", function() {
    reportModal.style.display = "none";
});

getReportButton.addEventListener("click", function() {
    const startDate = new Date(startDateField.value);
    const endDate = new Date(endDateField.value);

    if (!startDate || !endDate || startDate > endDate) {
        alert("Please provide valid start and end dates.");
        return;
    }

    const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
    });

    alert(`Filtered Entries: ${filteredEntries.length}\nTotal Amount: ৳ ${filteredEntries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}`);
    reportModal.style.display = "none"; // Close the report modal after generating the report
});

// Initial Document Number
refreshDocNumber();