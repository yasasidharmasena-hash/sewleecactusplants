//define function for fill data into table (tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName, viewFunctionName)
const fillDataIntoTable = (tableBodyId, dataList, propertyList, editFunction, deleteFunction, viewFunction, buttonVisibility = true) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            }

            if (property.dataType == "image-array") {
                let img = document.createElement("img");
                img.className = "w-50 h-50 rounded-circle"
                if (dataOb[property.propertyName] != null) {
                    img.src = atob(dataOb[property.propertyName]);
                } else {
                    img.src = "/images/g1.png";
                }
                td.appendChild(img);
            }

            tr.appendChild(td);
        }


        let tdbuttons = document.createElement("td");

        let buttonView = document.createElement("button");
        buttonView.className = "btn btn-primary me-1";
        buttonView.innerHTML = "<i class='fa-solid fa-eye fa-2xs'></i> View ";
        buttonView.onclick = () => {
            console.log("View", dataOb);
            viewFunction(dataOb, index);
        }
        tdbuttons.appendChild(buttonView);

        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btn-warning me-1";
        buttonEdit.innerHTML = "<i class='fa-regular fa-pen-to-square fa-2xs'></i> Edit";
        tdbuttons.appendChild(buttonEdit);
        buttonEdit.onclick = () => {
            console.log("Edit", dataOb);
            editFunction(dataOb, index);
        }



        let buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btn-danger me-1";
        buttonDelete.innerHTML = "<i class='fa-solid fa-trash-can fa-2xs'></i> Delete";
        tdbuttons.appendChild(buttonDelete);
        buttonDelete.onclick = () => {
            console.log("Delete", dataOb);
            deleteFunction(dataOb, index);
        }


        if (buttonVisibility) {
             tr.appendChild(tdbuttons);
        }

        tableBodyId.appendChild(tr);

    });
}

//define function for fill data into select (elementId, display message, dataListname, displaypropertyname) ------for common component
const fillDataIntoSelect = (parentId, message, dataList, displayProperty) => {

    parentId.innerHTML = "";

    if (message != "") {

        let optionMsgES = document.createElement("option");
        optionMsgES.value = "";
        optionMsgES.selected = "selected";
        optionMsgES.disabled = "disabled";
        optionMsgES.innerText = message;

        parentId.appendChild(optionMsgES);

    }

    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        option.value = JSON.stringify(dataOb);
        option.innerText = dataOb[displayProperty];
        parentId.appendChild(option);
    });
}

//define function for fill data into select (elementId, display message, dataListname, displaypropertyname) ------for common 2 components
const fillDataIntoSelectTwo = (parentId, message, dataList, displayPropertyOne, displayPropertyTwo, selectedValue) => {

    parentId.innerHTML = "";

    if (message != "") {

        let optionMsgES = document.createElement("option");
        optionMsgES.value = "";
        optionMsgES.selected = "selected";
        optionMsgES.disabled = "disabled";
        optionMsgES.innerText = message;

        parentId.appendChild(optionMsgES);
    }

    dataList.forEach(dataOb => {
        let option = document.createElement("option");
        if (selectedValue == dataOb[displayPropertyOne]) {
            option.selected = "selected";
        }
        option.value = JSON.stringify(dataOb);
        option.innerText = dataOb[displayPropertyOne] + " "+ dataOb[displayPropertyTwo] ;
        parentId.appendChild(option);
    });
}

//define function for fill data into inner table (tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName)
const fillDataIntoInnerTable = (tableBodyId, dataList, propertyList, editFunction, deleteFunction, buttonVisibility = true) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            }
            tr.appendChild(td);
        }


        let tdbuttons = document.createElement("td");

        let buttonEdit = document.createElement("button");
        buttonEdit.className = "btn btn-outline-warning me-1";
        buttonEdit.innerHTML = "<i class='fa-regular fa-pen-to-square fa-2xs'></i>";
        tdbuttons.appendChild(buttonEdit);
        buttonEdit.onclick = () => {
            console.log("Edit", dataOb);
            editFunction(dataOb, index);
        }

        let buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btn-outline-danger me-1";
        buttonDelete.innerHTML = "<i class='fa-solid fa-trash-can fa-2xs'></i>";
        tdbuttons.appendChild(buttonDelete);
        buttonDelete.onclick = () => {
            console.log("Delete", dataOb);
            deleteFunction(dataOb, index);
        }

        if (buttonVisibility) {
             tr.appendChild(tdbuttons);
        }

        tableBodyId.appendChild(tr);

    });
}

//define function for fill data into report table (tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName, viewFunctionName)
const fillDataIntoReportTable = (tableBodyId, dataList, propertyList) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            }

            if (property.dataType == "image-array") {
                let img = document.createElement("img");
                img.className = "w-50 h-50 rounded-circle"
                if (dataOb[property.propertyName] != null) {
                    img.src = atob(dataOb[property.propertyName]);
                } else {
                    img.src = "/images/g1.png";
                }
                td.appendChild(img);
            }

            tr.appendChild(td);
        }

        tableBodyId.appendChild(tr);
    });
}

//define function for fill data into table (tableBodyId, dataList, propertyList, viewFunctionName)---GRN
const fillDataIntoTableTwo = (tableBodyId, dataList, propertyList, viewFunction, buttonVisibility = true) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            }

            if (property.dataType == "image-array") {
                let img = document.createElement("img");
                img.className = "w-50 h-50 rounded-circle"
                if (dataOb[property.propertyName] != null) {
                    img.src = atob(dataOb[property.propertyName]);
                } else {
                    img.src = "/images/g1.png";
                }
                td.appendChild(img);
            }

            tr.appendChild(td);
        }


        let tdbuttons = document.createElement("td");

        let buttonView = document.createElement("button");
        buttonView.className = "btn btn-primary me-1";
        buttonView.innerHTML = "<i class='fa-solid fa-eye fa-2xs'></i> View ";
        buttonView.onclick = () => {
            console.log("View", dataOb);
            viewFunction(dataOb, index);
        }
        tdbuttons.appendChild(buttonView);


        if (buttonVisibility) {
             tr.appendChild(tdbuttons);
        }

        tableBodyId.appendChild(tr);

    });
}

//define function for fill data into inner table (tableBodyId, dataList, propertyList)--GRN
const fillDataIntoInnerTableTwo = (tableBodyId, dataList, propertyList) => {

    tableBodyId.innerHTML = "";

    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index) + 1;
        tr.appendChild(tdIndex);

        for (const property of propertyList) {
            let td = document.createElement("td");

            if (property.dataType == "string") {
                td.innerText = dataOb[property.propertyName];
            }

            if (property.dataType == "decimal") {
                td.innerText = parseFloat(dataOb[property.propertyName]).toFixed(2);
            }

            if (property.dataType == "function") {
                td.innerHTML = property.propertyName(dataOb);
            }
            tr.appendChild(td);
        }


        tableBodyId.appendChild(tr);

    });
}

