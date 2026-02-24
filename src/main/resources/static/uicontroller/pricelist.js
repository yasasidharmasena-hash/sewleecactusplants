//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function
    refreshPriceListTable();

    //call refresh form function
    refreshPriceListForm();

});

//refersh table area
const refreshPriceListTable = () => {

    //create array
    const priceLists = getServiceRequest("/pricelist/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "pricelist_number", dataType: "string" },
        { propertyName: getSupplierName, dataType: "function" },
        { propertyName: getPriceRequestCode, dataType: "function" },
        { propertyName: "received_date", dataType: "string" },
        { propertyName: "valid_date", dataType: "string" },
        { propertyName: getPricelistStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tablePriceListBody, priceLists, propertyList, priceListFormRefill, priceListDelete, priceListView, buttonVisibility = true);

    $('#tablePriceList').DataTable();

}

//define getSupplierName function (propertyList)
const getSupplierName = (ob) => {
       if (ob.pricerequest_id.supplier_details_id != null) {
        return ob.pricerequest_id.supplier_details_id.sup_name;
    } else {
        return "-";
    }
}

//define getPriceRequestCode function (propertyList)
const getPriceRequestCode = (ob) => {
       if (ob.pricerequest_id != null) {
        return ob.pricerequest_id.request_code;
    } else {
        return "-";
    }
}

//define getPricelistStatus function (propertyList)
const getPricelistStatus = (ob) => {
    if (ob.pricelist_status_id.name == "Valid") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.pricelist_status_id.name;
    }

    if (ob.pricelist_status_id.name == "Invalid") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.pricelist_status_id.name;
    }

    if (ob.pricelist_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.pricelist_status_id.name;
    }
}

//function define for refill form (update(form)/ edit(table))
const priceListFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    priceList = JSON.parse(JSON.stringify(ob));
    oldPriceList = JSON.parse(JSON.stringify(ob));


    //select supplier
    selectSupplier.value = JSON.stringify(ob.pricerequest_id.supplier_details_id);
    selectSupplier.disabled = "disabled";
    selectSupplier.disabled = "";
    let supplier = JSON.parse(selectSupplierElement.value);
    let priceRequestCodesBySupplier = getServiceRequest("/pricerequest/bysupplierrcodes?supplierid="+ supplier.id);
    fillDataIntoSelect(selectPriceRequestCode, "Select Price Request Code", priceRequestCodesBySupplier, "request_code");

    //price request code is a dynamic component
    selectPriceRequestCode.value = JSON.stringify(ob.pricerequest_id);

    dteReceivedDate.value = ob.received_date;
    dteValidDate.value = ob.valid_date;

    //pricelist status is a dynamic component
    selectPriceListStatus.value = JSON.stringify(ob.pricelist_status_id);

    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    $("#modalPriceListForm").modal("show");

    buttonSubmit.style.display = "none";
    buttonUpdate.removeAttribute("style");

    refreshPriceListInnerForm();

}

//function define for delete record
const priceListDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following price list? \n"
        + "Price list number : " + dataOb.pricelist_number + "\n"
        + "Price request code : " + dataOb.pricerequest_id.request_code
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/pricelist/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshPriceListTable();
            refreshPriceListForm(); //refresh form
            $("#modalPriceListForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print record 
const priceListView = (ob, index) => {
    console.log("View", ob, index);

    tdPricelistNumber.innerText = ob.pricelist_number;
    tdSupplierName.innerText = getSupplierName(ob);
    tdPriceRequestCode.innerText = getPriceRequestCode(ob);
    tdReceivedDate.innerText = ob.received_date;
    tdValidDate.innerText = ob.valid_date;
    tdStatus.innerText = ob.pricelist_status_id.name;

    let propertyList = [
        { propertyName: getItemNames, dataType: "function" },
        { propertyName: "purchase_price", dataType: "decimal" } 
    ];

    //call fillDataIntoTable function(tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName)
    fillDataIntoInnerTable(tablePrintInnerPriceListBody,ob.priceListHasItemList, propertyList, pricelistHasItemFormRefill, pricelistHasItemDelete,false);


    $("#modalPriceListView").modal("show");
}

// Print button on printmodal
const buttonPriceListPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tablePriceListView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalPriceListView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshPriceListForm = () => {

    formPriceList.reset();

    //create new object
    priceList = new Object();
    priceList.priceListHasItemList = new Array();

    let suppliers = getServiceRequest("/supplier_details/alldata");
    let priceRequestCodes = getServiceRequest("/pricerequest/alldata");
    let priceListStatuses = getServiceRequest("/pricelist_status/alldata");

    fillDataIntoSelect(selectSupplier, "Select Supplier Code", suppliers, "sup_name" );
    fillDataIntoSelect(selectPriceRequestCode, "Select Price Request Code", priceRequestCodes, "request_code");
    fillDataIntoSelect(selectPriceListStatus, "Select Item Status", priceListStatuses, "name");

    //set default colors
    setDefault([selectSupplier, selectPriceRequestCode, dteReceivedDate, dteValidDate, selectPriceListStatus, textNote]);

    buttonSubmit.removeAttribute("style");
    buttonUpdate.style.display = "none";

    //set min max value [YYYY-MM-DD]
    let currentDate = new Date();

    let currentMonth = currentDate.getMonth() +1; //[0-11]
    if (currentMonth <10) {
        currentMonth = "0" +currentMonth;
    }

    let currentDay = currentDate.getDate(); //[1-31]
    if (currentDay <10) {
        currentDay = "0" +currentDay;
    }

    dteValidDate.min = currentDate.getFullYear()+"-"+ currentMonth +"-"+ currentDay;

    currentDate.setDate(currentDate.getDate() + 15);

    let maxCurrentMonth = currentDate.getMonth() +1; //[0-11]
    if (maxCurrentMonth <10) {
        maxCurrentMonth = "0" +maxCurrentMonth;
    }

    let maxCurrentDay = currentDate.getDate(); //[1-31]
    if (maxCurrentDay <10) {
        maxCurrentDay = "0" +maxCurrentDay;
    }

    dteValidDate.max = currentDate.getFullYear()+"-"+ maxCurrentMonth +"-"+ maxCurrentDay ;

    /*dteReceivedDate.addEventListener("change", () => {
    let receivedDate = new Date(dteReceivedDate.value);

    if (!isNaN(receivedDate)) {
        // Set min to received date
        dteValidDate.min = dteReceivedDate.value;

        // Calculate max date: receivedDate + 10 days
        let maxDate = new Date(receivedDate);
        maxDate.setDate(receivedDate.getDate() + 10);

        let yyyy = maxDate.getFullYear();
        let mm = String(maxDate.getMonth() + 1).padStart(2, '0');
        let dd = String(maxDate.getDate()).padStart(2, '0');

        dteValidDate.max = `${yyyy}-${mm}-${dd}`;

        // Optional: reset the current value if it's outside the new range
        if (new Date(dteValidDate.value) < new Date(dteValidDate.min) || new Date(dteValidDate.value) > new Date(dteValidDate.max)) {
            dteValidDate.value = "";
        }
    } else {
        // Clear constraints if date is invalid or empty
        dteValidDate.min = "";
        dteValidDate.max = "";
        dteValidDate.value = "";
    }
});*/

    refreshPriceListInnerForm();
}

//supplier name validate and get price request codes by selected supplier
let selectSupplierElement = document.querySelector("#selectSupplier");
selectSupplierElement.addEventListener("change", ()=>{
    let supplier = JSON.parse(selectSupplierElement.value);
    selectSupplierElement.style.border = "2px solid green";

     let priceRequestCodesBySupplier = getServiceRequest("/pricerequest/bysupplierrcodes?supplierid="+ supplier.id);
     fillDataIntoSelect(selectPriceRequestCode, "Select Price Request Code", priceRequestCodesBySupplier, "request_code");

});

//define function for check exist (added) items to the inner table
//const checkExistItems =()=>{}

//get items that include selected price request code
const filterItemsByPriceRequestCode =()=>{
    let items = getServiceRequest("/item_details/bypricerequestcode?pricerequestid="+ JSON.parse(selectPriceRequestCode.value).id);
    fillDataIntoSelectTwo(selectItem, "Select Items", items, "itemcode", "itemname" );
}

//define function for refresh inner form
const refreshPriceListInnerForm = ()=> {

    priceListHasItem = new Object();

    let items = [];
    if (selectPriceRequestCode.value !="") {
        items = getServiceRequest("/item_details/bypricerequestcode?pricerequestid="+ JSON.parse(selectPriceRequestCode.value).id);
    } else {
        items = getServiceRequest("/item_details/list");
    }

    fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode", "itemname");

    //selectItem.disabled = "";
    textPurchasePrice.value = "";

    //set default colors
    setDefault([selectItem, textPurchasePrice]);

    buttonInnerAdd.removeAttribute("style");
    buttonInnerUpdate.style.display = "none";


    //define function for refresh inner table

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: getItemNames, dataType: "function" },
        { propertyName: "purchase_price", dataType: "decimal" } 
    ];

    //call fillDataIntoTable function(tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName)
    fillDataIntoInnerTable(tableInnerPriceListBody,priceList.priceListHasItemList, propertyList, pricelistHasItemFormRefill, pricelistHasItemDelete,buttonVisibility = true);

}

//define getItemNames function (propertyList)
const getItemNames = (ob) => {
    return ob.item_details_id.itemname;
}

//function define for refill innerform (update(innerform)/ edit(innertable))
const pricelistHasItemFormRefill = (ob, index)=> {

    innerFormIndex = index;
    priceListHasItem = JSON.parse(JSON.stringify(ob));
    oldPriceListHasItem = JSON.parse(JSON.stringify(ob));

     items = getServiceRequest("/item_details/list");
     fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode", "itemname", priceListHasItem.item_details_id.itemcode);

     selectItem.disabled = "disabled";
     textPurchasePrice.value = parseFloat(priceListHasItem.purchase_price);

    buttonInnerAdd.style.display = "none";
    buttonInnerUpdate.removeAttribute("style");
}

//function define for delete record-- innertable
const pricelistHasItemDelete = (ob, index)=> {

    let userConfirm = window.confirm("Are you sure you want to remove following item?");
    if(userConfirm){
        window.alert("Removed successfully");

        let extIndex = priceList.priceListHasItemList.map(pricelistitem =>pricelistitem.item_details_id.id).indexOf(ob.item_details_id.id);
        if (extIndex != -1) {
            priceList.priceListHasItemList.splice(extIndex, 1);
        }
        refreshPriceListInnerForm();
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerPriceListAdd = ()=> {
    console.log(priceListHasItem);

    let userConfirm = window.confirm("Are you sure you want to add following item?");
    if(userConfirm){
        window.alert("Added successfully");
        priceList.priceListHasItemList.push(priceListHasItem);
        refreshPriceListInnerForm();
    }
    
}

//function define for update record--- innerform
const buttonInnerPriceListUpdate = () => {
    console.log(priceListHasItem);

    if (priceListHasItem.purchase_price != oldPriceListHasItem.purchase_price) {
        let userConfirm = window.confirm("Are you sure you want to update following item?");
        if (userConfirm) {
            window.alert("Updated successfully");
            priceList.priceListHasItemList[innerFormIndex] = priceListHasItem;
            refreshPriceListInnerForm();
        }
    }else{
        window.alert("Form has nothing to update"); 
    }
}

const checkPriceListFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (priceList.pricerequest_id.supplier_details_id == "") {
        errors = errors + "Please select a supplier name \n";
    }

    if (priceList.pricerequest_id == null) {
        errors = errors + "Please select a price request code \n";
    }

    if (priceList.received_date == null) {
        errors = errors + "Please enter a received date \n";
    }

    if (priceList.valid_date == null) {
        errors = errors + "Please enter a valid date \n";
    }

    if (priceList.pricelist_status_id == null) {
        errors = errors + "Please select a pricelist status \n";
    }

    if (priceList.priceListHasItemList.length == 0) {
        errors = errors + "Please select an item \n";
    }

    return errors;
}

//form submit event function
const buttonPriceListSubmit = () => {
    console.log(priceList);

    let errors = checkPriceListFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following price list? \n" +
            "Price request code :" + priceList.pricerequest_id.request_code + "\n"+
            "Received date : " + priceList.received_date + "\n" +
            "Valid date : " + priceList.valid_date
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/pricelist/insert", "POST", priceList);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshPriceListTable();
                refreshPriceListForm();
                $("#modalPriceListForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

//form reset event function
const buttonPriceListReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshPriceListForm();
    }
}

const checkPriceListFormUpdate = () => {
    let updates = "";
    if (priceList != null && oldPriceList != null) {

        if (priceList.pricerequest_id.supplier_details_id.sup_name != oldPriceList.pricerequest_id.supplier_details_id.sup_name) {
            updates = updates + "Supplier Name has changed \n";
        }
        if (priceList.pricerequest_id.request_code != oldPriceList.pricerequest_id.request_code) {
            updates = updates + "Price Request Code has changed \n";
        }
        if (priceList.received_date != oldPriceList.received_date) {
            updates = updates + "Received Date has changed \n";
        }
        if (priceList.valid_date != oldPriceList.valid_date) {
            updates = updates + "Valid Date has changed \n";
        }
        if (priceList.pricelist_status_id.name != oldPriceList.pricelist_status_id.name) {
            updates = updates + "Pricelist status has changed \n";
        }

        if (priceList.priceListHasItemList.length != oldPriceList.priceListHasItemList.length) {
            updates =updates + "Pricelist item has changed \n";
        }else{
            let equalcount = 0;
            for (const oldPriceListHasItem of oldPriceList.priceListHasItemList) {
                for (const priceListHasItem of priceList.priceListHasItemList) {
                    if (oldPriceListHasItem.item_details_id.id == priceListHasItem.item_details_id.id) {
                        equalcount = equalcount +1;
                    }
                }
            }
            if (equalcount != priceList.priceListHasItemList.length) {
                updates =updates + "Pricelist item has changed \n";
            } else{
                for (const oldPriceListHasItem of oldPriceList.priceListHasItemList) {
                for (const priceListHasItem of priceList.priceListHasItemList) {
                    if (oldPriceListHasItem.item_details_id.id == priceListHasItem.item_details_id.id && oldPriceListHasItem.purchase_price != priceListHasItem.purchase_price ) {
                         updates =updates + "Pricelist item purchase price has changed \n";
                         break;
                    }
                }
            } 
            }
        }
        
    }
    return updates;
}

//form update event function
const buttonPriceListUpdate = () => {
    console.log(priceList);

    let errors = checkPriceListFormError();

    if (errors == "") {

        let updates = checkPriceListFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following pricelist changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/pricelist/update", "PUT", priceList);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshPriceListTable();
                    refreshPriceListForm();
                    $("#modalPriceListForm").modal("hide");

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

