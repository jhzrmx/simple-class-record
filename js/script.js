var actions = '<a href="#" onclick="editRow(this)">Edit</a> <a href="#" onclick="deleteRow(this)">Delete</a>';
var isUpdate = false;
const students = [];
const scores = [];

function $(args) {
	return document.querySelector(args);
}

function clearFields() {
	$("#l-name").value = "";
	$("#f-name").value = "";
	$("#m-name").value = "";
	$("#score").value = "";
}

function addStudent() {
	let row = $("#my-table").insertRow();
	if ($("#l-name").value === "" || $("#f-name").value === "" || $("#score").value === "" || $("#total").value === "") {
		alert("Required fields are empty.");
		return;
	}
	let scorePercent = Number(eval($("#score").value*100/$("#total").value).toFixed(2));
	if (scorePercent > 100) {
		alert("Ooops, score must be less than or equal to total");
		return;
	}
	let fullName = $("#l-name").value + ", " + $("#f-name").value + " " + $("#m-name").value + ".";
	let score = $("#score").value + "/" + $("#total").value;
	row.insertCell(0).innerHTML = fullName;
	row.insertCell(1).innerHTML = score;
	row.insertCell(2).innerHTML = scorePercent + "% (" + (scorePercent >= 75 ? "Passed" : "Failed") + ")";
	row.cells[2].style.color = scorePercent >= 75 ? "green" : "red";
	row.insertCell(3).innerHTML = actions;
	students.push(fullName);
	scores.push(score);
	clearFields();
}

function deleteRow(link) {
	if(confirm("Delete this item?")) {
		let row = link.parentNode.parentNode;
		let table = row.parentNode;
		table.deleteRow(row.rowIndex);
		students.splice(row.rowIndex-1, 1);
		scores.splice(row.rowIndex-1, 1);
	}
}

function editRow(link) {
	isUpdate = true;
	let row = link.parentNode.parentNode;
	row.cells[0].innerHTML = `<input id="edit-name" class="u-full-width" style="margin-bottom: 0" type="text" value="${row.cells[0].textContent.trim()}">`;
	let score = row.cells[1].textContent.trim().split("/");
	row.cells[1].innerHTML = `<input id="edit-score" type="text" style="margin-bottom: 0; width: 4em;" value="${score[0]}"> / <input id="edit-total" type="text" style="margin-bottom: 0; width: 4em;" value="${score[1]}">`;
	row.cells[2].innerHTML = '--% (------)';
	row.cells[2].style.color = "black";
	row.cells[3].innerHTML = `<a href="#" onclick="updateRow(this)">Update</a>`;
}

function updateRow(link) {
	isUpdate = false;
	let row = link.parentNode.parentNode;
	let name = document.getElementById("edit-name").value
	let score = document.getElementById("edit-score").value;
	let total = document.getElementById("edit-total").value;
	let scorePercent = Number((eval(score/total)*100).toFixed(2));
	if (name === "" || score === "" || total === "") {
		alert("Required fields are empty.");
		return;
	}
	if (scorePercent > 100) {
		alert("Ooops, score must be less than or equal to total");
		return;
	}
	row.cells[0].innerHTML = name;
	row.cells[1].innerHTML = score + "/" + total;
	row.cells[2].innerHTML = scorePercent + "% (" + (scorePercent >= 75 ? "Passed" : "Failed") + ")";
	row.cells[2].style.color = scorePercent >= 75 ? "green" : "red";
	students[row.rowIndex-1] = name;
	scores[row.rowIndex-1] = score + "/" + total;
	row.cells[3].innerHTML = actions;
}

function deleteTableData() {
	if(confirm("THIS WILL WIPE OUT ALL DATA FROM THE TABLE!\n\nDelete entire table?")) {
		for (var i = $("#my-table").rows.length-1; i > 0; i--) {
			$("#my-table").deleteRow(i);
		}
		students.length = 0;
		scores.length = 0;
	}
}

function downloadHtmlContent() {
	if (isUpdate) {
		alert("Finish editing first.");
		return;
	}
	var htmlContent = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>* { font-family: Segoe UI; } table { width: 90%; margin-inline: auto; table-layout: fixed; } th, td { border: 1px solid black; padding: 12px; } table, th, td {text-align: center; border-collapse: collapse;</style><title>Grades</title></head><body><h1 align="center">Class Record</h1>' + $("#grade-content").innerHTML + '<script>var table = document.getElementById("my-table"); for (var i = 0; i < table.rows.length; i++) { table.rows[i].deleteCell(3); }</script></body></html>';
	var blob = new Blob([htmlContent], { type: 'text/plain' });
	var url = window.URL.createObjectURL(blob);
	var link = document.createElement('a');
	link.href = url;
	link.download = 'GradeContent - ' + new Date() + '.html';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
