<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Entry Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-section {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        .form-section input, .form-section button, .form-section textarea {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #45a049;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
        }
        .popup {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            align-items: center;
            justify-content: center;
        }
        .popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
        }
        .popup button {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ডেটা এন্ট্রি ফর্ম</h1>
        <div class="form-section">
            <input type="text" id="orderNo" placeholder="অর্ডার নং" required />
            <input type="text" id="partyName" placeholder="পার্টি নাম" required />
            <input type="text" id="shadeNo" placeholder="শেড নং" required />
            <input type="number" id="orderQty" placeholder="অর্ডার কিউটি" required />
            <input type="number" id="balQty" placeholder="ব্যাল কিউটি" required />
            <textarea id="remarks" placeholder="রিমার্কস"></textarea>
            <button onclick="submitData()">এন্ট্রি সাবমিট</button>
        </div>

        <h2>অর্ডার রিপোর্ট</h2>
        <button onclick="showReportPopup()">রিপোর্ট দেখুন</button>

        <!-- Report Search Popup -->
        <div class="popup" id="reportPopup">
            <div class="popup-content">
                <h3>অর্ডার সার্চ করুন</h3>
                <input type="text" id="searchOrderNo" placeholder="অর্ডার নং" />
                <button onclick="searchOrder()">সার্চ</button>
                <button onclick="showAllOrders()">সব দেখুন</button>
                <button onclick="closeReportPopup()">বন্ধ করুন</button>
            </div>
        </div>

        <!-- Report Section -->
        <div id="reportSection" style="display:none;">
            <table id="reportTable">
                <thead>
                    <tr>
                        <th>অর্ডার নং</th>
                        <th>পার্টি নাম</th>
                        <th>শেড নং</th>
                        <th>অর্ডার কিউটি</th>
                        <th>ব্যাল কিউটি</th>
                        <th>রিমার্কস</th>
                        <th>একশন</th>
                    </tr>
                </thead>
                <tbody id="reportBody"></tbody>
            </table>
            <button onclick="printReport()">প্রিন্ট প্রিভিউ</button>
            <button onclick="closeReportPopup()">বন্ধ করুন</button>
        </div>

    </div>

    <script>
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        let filteredEntries = [];

        function submitData() {
            let orderNo = document.getElementById('orderNo').value;
            let partyName = document.getElementById('partyName').value;
            let shadeNo = document.getElementById('shadeNo').value;
            let orderQty = document.getElementById('orderQty').value;
            let balQty = document.getElementById('balQty').value;
            let remarks = document.getElementById('remarks').value;

            if (!orderNo || !partyName || !shadeNo || !orderQty || !balQty) {
                alert('সব ক্ষেত্র পূর্ণ করতে হবে!');
                return;
            }

            let entry = {
                orderNo,
                partyName,
                shadeNo,
                orderQty,
                balQty,
                remarks
            };

            entries.push(entry);
            localStorage.setItem('entries', JSON.stringify(entries));
            alert('এন্ট্রি সফলভাবে সংরক্ষিত হয়েছে!');
            document.getElementById('orderNo').value = '';
            document.getElementById('partyName').value = '';
            document.getElementById('shadeNo').value = '';
            document.getElementById('orderQty').value = '';
            document.getElementById('balQty').value = '';
            document.getElementById('remarks').value = '';
        }

        function showReportPopup() {
            document.getElementById('reportPopup').style.display = 'flex';
        }

        function closeReportPopup() {
            document.getElementById('reportPopup').style.display = 'none';
        }

        function searchOrder() {
            let searchOrderNo = document.getElementById('searchOrderNo').value;
            filteredEntries = entries.filter(entry => entry.orderNo === searchOrderNo);
            if (filteredEntries.length > 0) {
                displayReport(filteredEntries);
            } else {
                alert('অর্ডার না পাওয়া গেছে!');
            }
        }

        function showAllOrders() {
            filteredEntries = entries;
            displayReport(filteredEntries);
        }

        function displayReport(filteredEntries) {
            let reportBody = document.getElementById('reportBody');
            reportBody.innerHTML = '';
            filteredEntries.forEach((entry, index) => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.orderNo}</td>
                    <td>${entry.partyName}</td>
                    <td>${entry.shadeNo}</td>
                    <td>${entry.orderQty}</td>
                    <td>${entry.balQty}</td>
                    <td>${entry.remarks}</td>
                    <td>
                        <button onclick="editEntry(${index})">সম্পাদন করুন</button>
                        <button onclick="deleteEntry(${index})">মুছুন</button>
                    </td>
                `;
                reportBody.appendChild(row);
            });
            document.getElementById('reportSection').style.display = 'block';
            closeReportPopup();
        }

        function editEntry(index) {
            let entry = filteredEntries[index];
            let updatedOrderNo = prompt('নতুন অর্ডার নং দিন:', entry.orderNo);
            let updatedPartyName = prompt('নতুন পার্টি নাম দিন:', entry.partyName);
            let updatedShadeNo = prompt('নতুন শেড নং দিন:', entry.shadeNo);
            let updatedOrderQty = prompt('নতুন অর্ডার কিউটি দিন:', entry.orderQty);
            let updatedBalQty = prompt('নতুন ব্যাল কিউটি দিন:', entry.balQty);
            let updatedRemarks = prompt('নতুন রিমার্কস দিন:', entry.remarks);

            if (updatedOrderNo && updatedPartyName && updatedShadeNo && updatedOrderQty && updatedBalQty) {
                entries[index] = {
                    orderNo: updatedOrderNo,
                    partyName: updatedPartyName,
                    shadeNo: updatedShadeNo,
                    orderQty: updatedOrderQty,
                    balQty: updatedBalQty,
                    remarks: updatedRemarks
                };
                localStorage.setItem('entries', JSON.stringify(entries));
                alert('এন্ট্রি আপডেট হয়েছে!');
                displayReport(filteredEntries);
            } else {
                alert('সব তথ্য দিন!');
            }
        }

        function deleteEntry(index) {
            if (confirm('আপনি কি নিশ্চিতভাবে মুছতে চান?')) {
                entries.splice(index, 1);
                localStorage.setItem('entries', JSON.stringify(entries));
                alert('এন্ট্রি মুছে ফেলা হয়েছে!');
                displayReport(entries);
            }
        }

        function printReport() {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>প্রিন্ট প্রিভিউ</title>');
            printWindow.document.write('<style>table {width: 100%; border-collapse: collapse;} th, td {padding: 10px; border: 1px solid #ddd; text-align: center;} th {background-color: #f2f2f2;} </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h2>অর্ডার রিপোর্ট</h2>');
            printWindow.document.write('<table>');
            printWindow.document.write('<thead><tr><th>অর্ডার নং</th><th>পার্টি নাম</th><th>শেড নং</th><th>অর্ডার কিউটি</th><th>ব্যাল কিউটি</th><th>রিমার্কস</th></tr></thead><tbody>');

            filteredEntries.forEach(entry => {
                printWindow.document.write(`
                    <tr>
                        <td>${entry.orderNo}</td>
                        <td>${entry.partyName}</td>
                        <td>${entry.shadeNo}</td>
                        <td>${entry.orderQty}</td>
                        <td>${entry.balQty}</td>
                        <td>${entry.remarks}</td>
                    </tr>
                `);
            });

            printWindow.document.write('</tbody></table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    </script>
</body>
</html>
