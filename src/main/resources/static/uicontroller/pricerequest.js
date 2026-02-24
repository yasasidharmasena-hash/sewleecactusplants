//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call item table refresh function
    refreshPriceRequestTable();

    //call refresh form function
    refreshPriceRequestForm();

});

//refersh  table area
const refreshPriceRequestTable = () => {

    //create array
    const pricerequests = getServiceRequest("/pricerequest/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "request_code", dataType: "string" },
        { propertyName: getSupName, dataType: "function" },
        { propertyName: getItemList, dataType: "function" },
        { propertyName: "required_date", dataType: "string" },
        { propertyName: getPriceRequestStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tablePriceRequestBody, pricerequests, propertyList, priceRequestFormRefill, priceRequestDelete, priceRequestView, buttonVisibility = true);

    $('#tablePriceRequest').DataTable();

}

//define getSupName function (propertyList)
const getSupName = (ob) => {
       if (ob.supplier_details_id != null) {
        return ob.supplier_details_id.sup_name;
    } else {
        return "-";
    }
}

//function define for generate getItemList (propertyList)
const getItemList = (ob) => {
     let items = "";
    for (const index in ob.priceRequestItems) {
        if (index == ob.priceRequestItems.length - 1) {
           items = items + ob.priceRequestItems[index].itemname;
            
        }else 
            items = items + ob.priceRequestItems[index].itemname + ", ";
    }

    return items;
}

//define getPriceRequestStatus function (propertyList)
const getPriceRequestStatus = (ob) => {
    if (ob.pricerequest_status_id.name == "Pending") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.pricerequest_status_id.name;
    }

    if (ob.pricerequest_status_id.name == "Received") {
        return "<button type='button' class='btn btn-info'></button><br>" + ob.pricerequest_status_id.name;
    }

    if (ob.pricerequest_status_id.name == "Completed") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.pricerequest_status_id.name;
    }

    if (ob.pricerequest_status_id.name == "Cancelled") {
        return "<button type='button' class='btn btn-dark'></button><br>" + ob.pricerequest_status_id.name;
    }

    if (ob.pricerequest_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.pricerequest_status_id.name;
    }
}

const transferRequestedItem = () => {
    let requestedItems = JSON.parse(selectAvailableItem.value);
    pricerequest.priceRequestItems.push(requestedItems);
    fillDataIntoSelect(selectRequestedItem, "", pricerequest.priceRequestItems, "itemname");

    let extIndex = allItems.map(item => item.id).indexOf(requestedItems.id);
    if (extIndex != -1) {
        allItems.splice(extIndex, 1)
    }
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");
}

const transferRequestedAllItems = () => {
    for (const item of allItems) {
        pricerequest.priceRequestItems.push(item);
    }
    fillDataIntoSelect(selectRequestedItem, "",  pricerequest.priceRequestItems, "itemname");

    allItems = [];
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");
}

const removeRequestedItem = () => {
    let requestedItems = JSON.parse(selectRequestedItem.value);
    allItems.push(requestedItems);
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");

    let extIndex =  pricerequest.priceRequestItems.map(item => item.id).indexOf(requestedItems.id);
    if (extIndex != -1) {
         pricerequest.priceRequestItems.splice(extIndex, 1)
    }
    fillDataIntoSelect(selectRequestedItem, "", pricerequest.priceRequestItems, "itemname");
}

const removeRequestedAllItems = () => {
    for (const item of pricerequest.priceRequestItems) {
        allItems.push(item);
    }
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");

    pricerequest.priceRequestItems = [];
    fillDataIntoSelect(selectRequestedItem, "",  pricerequest.priceRequestItems, "itemname");
}

//function define for refill form (update(form)/ edit(table))
const priceRequestFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    pricerequest = JSON.parse(JSON.stringify(ob));
    oldPricerequest = JSON.parse(JSON.stringify(ob));

    let suppliers = getServiceRequest("/supplier_details/alldata");
    fillDataIntoSelect(selectSupplier, "Select supplier", suppliers, "sup_name");
    selectSupplier.disabled = true;

    selectSupplier.value = JSON.stringify(pricerequest.supplier_details_id);

    dteRequiredDate.value = ob.required_date;

    //price request status is a dynamic component
    selectPriceRequestStatus.value = JSON.stringify(ob.pricerequest_status_id);

    //select item list is a dynamic component
    //selectAvailableItem.value = JSON.stringify(ob.item_subcategory_id);


    // Load unsupplied items for the selected supplier 
    allItems = getServiceRequest("/item_details/bysuppliernotinrequest?supplierid=" + pricerequest.supplier_details_id.id + "&requestid=" + pricerequest.id);
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");

    fillDataIntoSelect(selectRequestedItem, "", pricerequest.priceRequestItems, "itemname");



    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textPriceRequestNote.value = "";
    } else {
        textPriceRequestNote.value = ob.note;
    }

    $("#modalPriceRequestForm").modal("show");

    buttonSubmit.style.display = "none";
    buttonUpdate.removeAttribute("style");

}

//function define for delete record
const priceRequestDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following price request? \n"
        + "Request Code : " + dataOb.request_code + "\n"
        + "Supplier Name : " + dataOb.supplier_details_id.sup_name
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/pricerequest/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshPriceRequestTable();
            refreshItemForm(); //refresh form
            $("#modalItemForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print record 
const priceRequestView = (ob, index) => {
    console.log("View", ob, index);

    tdRequestCode.innerText = ob.request_code;
    tdSuppName.innerText = getSupName(ob);
    tdItemList.innerText = getItemList(ob);
    tdRequiredDate.innerText = ob.required_date;
    tdPriceReqStatus.innerText = ob.pricerequest_status_id.name;
    

    $("#modalPriceRequestView").modal("show");
}

// Print button on printmodal
const buttonPriceRequestPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tablePriceRequestView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalPriceRequestView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshPriceRequestForm = () => {

    formPriceRequest.reset();

    //create new object
    pricerequest = new Object();
    pricerequest.priceRequestItems = new Array();


    let suppliers = getServiceRequest("/supplier_details/alldata");
    let priceRequestStatuses = getServiceRequest("/pricerequest_status/alldata");


    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "sup_name");
    fillDataIntoSelect(selectPriceRequestStatus, "Select Price Request Status", priceRequestStatuses, "name");
    selectSupplier.disabled = false;

    selectPriceRequestStatus.value =JSON.stringify(priceRequestStatuses[0]);
    pricerequest.purchaseorder_status_id = priceRequestStatuses[0];
    selectPriceRequestStatus.style.border = "2px solid green";

   // selectPriceRequestStatus.style.display ="none";

    allItems = [];
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");
    fillDataIntoSelect(selectRequestedItem, "", pricerequest.priceRequestItems, "itemname");

    //set default colors
    setDefault([selectSupplier, dteRequiredDate, selectPriceRequestStatus, selectAvailableItem,
        selectRequestedItem, textPriceRequestNote]);

    buttonSubmit.removeAttribute("style");
    buttonUpdate.style.display = "none";
}

const checkPriceRequestFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (pricerequest.supplier_details_id == null) {
        errors = errors + "Please select a supplier name \n";
    }

    if (pricerequest.required_date == null) {
        errors = errors + "Please enter a required date \n";
    }

    if (pricerequest.pricerequest_status_id == null) {
        errors = errors + "Please select an price request status \n";
    }

    if (pricerequest.priceRequestItems.length == 0) {
        errors = errors + "Please select items \n";
    }

    return errors;
}

// form submit event function
const buttonPriceRequestSubmit = () => {
    console.log(pricerequest);

    let errors = checkPriceRequestFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following price request? \n" +
            "Supplier Name :" + pricerequest.supplier_details_id.sup_name + "\n" +
            "Required Date : " + pricerequest.required_date
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/pricerequest/insert", "POST", pricerequest);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshPriceRequestTable();
                refreshPriceRequestForm();
                 $("#modalPriceRequestForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// form reset event function
const buttonPriceRequestReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshPriceRequestForm();
    }
}

const checkPriceRequestFormUpdate = () => {
    let updates = "";
    if (pricerequest != null && oldPricerequest != null) {

        if (pricerequest.supplier_details_id.sup_name != oldPricerequest.supplier_details_id.sup_name) {
            updates = updates + "Supplier has changed \n";
        }
        if (pricerequest.required_date != oldPricerequest.required_date) {
            updates = updates + "Required date has changed \n";
        }
        if (pricerequest.pricerequest_status_id.name != oldPricerequest.pricerequest_status_id.name) {
            updates = updates + "Price Request status has changed \n";
        }
        
        if (pricerequest.priceRequestItems.length != oldPricerequest.priceRequestItems.length) {
            updates =updates + "Pricelist item has changed \n";
        }
        
    }
    return updates;
}

// form update event function
const buttonPriceRequestUpdate = () => {
    console.log(pricerequest);

    let errors = checkPriceRequestFormError();

    if (errors == "") {

        let updates = checkPriceRequestFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following price request changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/pricerequest/update", "PUT", pricerequest);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshPriceRequestTable();
                    refreshPriceRequestForm();
                    $("#modalPriceRequestForm").modal("hide");

                } else {
                    window.alert("Failed to update, following errors occurred: \n" + putResponce);
                }
            }

        } else {
            window.alert("Form has nothing to update \n");
        }

    } else {
        window.alert("Form has following errors: \n" + errors);
    }
}

const getItemBySupplier = () => {
    allItems = getServiceRequest("/item_details/bysupplier?supplierid=" + JSON.parse(selectSupplier.value).id);
    fillDataIntoSelect(selectAvailableItem, "", allItems, "itemname");
}