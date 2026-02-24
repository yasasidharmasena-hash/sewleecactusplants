//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function
    refreshPurchaseOrderTable();

    //call refresh form function
    refreshPurchaseOrderForm();

});

//refersh table area
const refreshPurchaseOrderTable = () => {

    //create array
    const purchaseOrders = getServiceRequest("/purchaseorder_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "po_number", dataType: "string" },
        { propertyName: getSupplierName, dataType: "function" },
        { propertyName: "required_date", dataType: "string" },
        { propertyName: "total_amount", dataType: "decimal" },
        { propertyName: getPurchaseOrderStatus, dataType: "function" }
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tablePurchaseOrderBody, purchaseOrders, propertyList, purchaseOrderFormRefill, purchaseOrderDelete, purchaseOrderView, buttonVisibility = true);

    $('#tablePurchaseOrder').DataTable();

}

//define getSupplierName function (propertyList)
const getSupplierName = (ob) => {
    return ob.supplier_details_id.sup_name;
}

//define getPurchaseOrderStatus function (propertyList)
const getPurchaseOrderStatus = (ob) => {
    if (ob.purchaseorder_status_id.name == "Pending") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.purchaseorder_status_id.name;
    }

    if (ob.purchaseorder_status_id.name == "Received") {
        return "<button type='button' class='btn btn-info'></button><br>" + ob.purchaseorder_status_id.name;
    }

    if (ob.purchaseorder_status_id.name == "Completed") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.purchaseorder_status_id.name;
    }

    if (ob.purchaseorder_status_id.name == "Cancelled") {
        return "<button type='button' class='btn btn-dark'></button><br>" + ob.purchaseorder_status_id.name;
    }

    if (ob.purchaseorder_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.purchaseorder_status_id.name;
    }
}

//function define for refill form (update(form)/ edit(table))
const purchaseOrderFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    purchaseOrder = JSON.parse(JSON.stringify(ob));
    oldPurchaseOrder = JSON.parse(JSON.stringify(ob));

    selectSupplier.value = JSON.stringify(ob.supplier_details_id);
    selectSupplier.disabled = "disabled";

    selectPriceListNumber.value = JSON.stringify(ob.pricelist_id);
    selectPriceListNumber.disabled = "disabled";
    dteRequiredDate.value = ob.required_date;
    //textTotalAmount.value = ob.total_amount;

    //purchase order status is a dynamic component
    selectPurchaseOrderStatus.value = JSON.stringify(ob.purchaseorder_status_id);

    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    $("#modalPurchaseOrderForm").modal("show");

    buttonSubmit.style.display = "none";
    buttonUpdate.removeAttribute("style");

    refreshPurchaseOrderInnerForm();

}

//function define for delete record
const purchaseOrderDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following purchase order? \n"
        + "Purchase order number : " + dataOb.po_number + "\n"
        + "Supplier name : " + dataOb.supplier_details_id.sup_name
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/purchaseorder_details/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshPurchaseOrderTable();
            refreshPurchaseOrderForm(); //refresh form
            $("#modalPurchaseOrderForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print record 
const purchaseOrderView = (ob, index) => {
    console.log("View", ob, index);

    tdPoNumber.innerText = ob.po_number;
    tdSupplierName.innerText = getSupplierName(ob);
    tdRequiredDate.innerText = ob.required_date;
    tdTotalAmount.innerText = ob.total_amount;
    tdPoStatus.innerText = ob.purchaseorder_status_id.name;

     let propertyList = [
        { propertyName: getItemNames, dataType: "function" },
        { propertyName: "unit_price", dataType: "decimal" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "line_amount", dataType: "decimal" } 
    ];

    //call fillDataIntoTable function(tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName)
    fillDataIntoInnerTable(tablePrintInnerPurchaseOrderBody,ob.purchaseOrderHasItemList, propertyList, purchaseOrderHasItemFormRefill, purchaseOrderHasItemDelete,false);

    $("#modalPurchaseOrderView").modal("show");
}

// Print button on printmodal
const buttonPurchaseOrderPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tablePurchaseOrdertView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalPurchaseOrderView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */


//define function for refresh form (submit)
const refreshPurchaseOrderForm = () => {

    formPurchaseOrder.reset();

    //create new object
    purchaseOrder = new Object();
    purchaseOrder.purchaseOrderHasItemList = new Array();

    let suppliers = getServiceRequest("/supplier_details/alldata");
    let priceListNumbers = getServiceRequest("/pricelist/alldata");
    let purchaseOrderStatuses = getServiceRequest("/purchaseorder_status/alldata");

    fillDataIntoSelect(selectSupplier, "Select Supplier Code", suppliers, "sup_name" );
    fillDataIntoSelect(selectPriceListNumber, "Select PriceList Number", priceListNumbers, "pricelist_number");
    fillDataIntoSelect(selectPurchaseOrderStatus, "Select Purchase order Status", purchaseOrderStatuses, "name");

    selectPurchaseOrderStatus.value =JSON.stringify(purchaseOrderStatuses[0]);
    purchaseOrder.purchaseorder_status_id = purchaseOrderStatuses[0];
    selectPurchaseOrderStatus.style.border = "2px solid green";

    //set default colors
    setDefault([selectSupplier, selectPriceListNumber, dteRequiredDate, textTotalAmount, selectPurchaseOrderStatus, textNote]);

    selectPriceListNumber.disabled = "";

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

    dteRequiredDate.min = currentDate.getFullYear()+"-"+ currentMonth +"-"+ currentDay;

    currentDate.setDate(currentDate.getDate() + 15);

    let maxCurrentMonth = currentDate.getMonth() +1; //[0-11]
    if (maxCurrentMonth <10) {
        maxCurrentMonth = "0" +maxCurrentMonth;
    }

    let maxCurrentDay = currentDate.getDate(); //[1-31]
    if (maxCurrentDay <10) {
        maxCurrentDay = "0" +maxCurrentDay;
    }

    dteRequiredDate.max = currentDate.getFullYear()+"-"+ maxCurrentMonth +"-"+ maxCurrentDay ;

    refreshPurchaseOrderInnerForm();
}

//supplier name validate and get pricelist code by selected supplier
let selectSupplierElement = document.querySelector("#selectSupplier");
selectSupplierElement.addEventListener("change", ()=>{
    let supplier = JSON.parse(selectSupplierElement.value);
    purchaseOrder.supplier_details_id = supplier;
    selectSupplierElement.style.border = "2px solid green";

     let priceListNumberBySup = getServiceRequest("/pricelist/getbysupplierid?supplierid="+ supplier.id);
     fillDataIntoSelect(selectPriceListNumber, "Select Price List Number", priceListNumberBySup, "pricelist_number");

});

//get items that include selected price list number
const filterItemsByPriceListNumber =()=>{
    let items = getServiceRequest("/item_details/bypricelistnumber?pricelistid="+ JSON.parse(selectPriceListNumber.value).id);
    fillDataIntoSelectTwo(selectItem, "Select Items", items, "itemcode", "itemname" );
}

//define function for calculate line price
const calculateLinePrice = ()=>{
    if (textQuantity.value > 0) {
        let lineAmount =(parseFloat(textQuantity.value) * parseFloat(textUnitPrice.value)).toFixed(2);
        purchaseOrderHasItem.line_amount = lineAmount;
        textLinePrice.value = lineAmount;
        textLinePrice.style.border = "2px solid green"; 
    } else {
       purchaseOrderHasItem.quantity = null;
       purchaseOrderHasItem.line_amount = null;
       textQuantity.style.border = "2px solid red"; 
       textLinePrice.style.border = "1px solid #ced4da"; 
       textLinePrice.value = "";
    }    
}

//define function for check exist (added) items to the inner table
const checkExistItems =()=>{

    let selectedItem = JSON.parse(selectItem.value);
    let extIndex = purchaseOrder.purchaseOrderHasItemList.map(poitem=>poitem.item_details_id.id).indexOf(selectedItem.id);

    if (extIndex > -1) {
        window.alert("Selected item is already exist!");
        refreshPurchaseOrderInnerForm();
    } else {

        let pricelistItems = getServiceRequest("/pricelist_has_item_details/byitempricelist?itemid=" + selectedItem.id + "&priceid=" + purchaseOrder.pricelist_id.id);

        textUnitPrice.value = parseFloat(pricelistItems.purchase_price).toFixed(2);
        purchaseOrderHasItem.unit_price = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.style.border = "2px solid green";
    }    
}

//define function for refresh inner form
const refreshPurchaseOrderInnerForm = ()=> {

    purchaseOrderHasItem = new Object();

    let items = [];
    if (selectPriceListNumber.value != "") {
        items = getServiceRequest("/item_details/bypricelistnumber?pricelistid="+ JSON.parse(selectPriceListNumber.value).id);
    } else {
        items = getServiceRequest("/item_details/alldata");
    }

    fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode", "itemname");

    selectItem.disabled = "";
    textUnitPrice.value = "";
    textUnitPrice.disabled = "disabled";
    textQuantity.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";

    //set default colors
    setDefault([selectItem, textUnitPrice, textQuantity, textLinePrice]);

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
        { propertyName: "unit_price", dataType: "decimal" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "line_amount", dataType: "decimal" } 
    ];

    //call fillDataIntoTable function(tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName)
    fillDataIntoInnerTable(tableInnerPurchaseOrderBody,purchaseOrder.purchaseOrderHasItemList, propertyList, purchaseOrderHasItemFormRefill, purchaseOrderHasItemDelete,buttonVisibility = true);

    //get fuction for Total amount
    let totalAmount = 0.00;
    for (const orderitem of purchaseOrder.purchaseOrderHasItemList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.line_amount);
    }
    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        purchaseOrder.total_amount = textTotalAmount.value;
        textTotalAmount.style.border = "2px solid green";
    }

}

//define getItemNames function (propertyList)
const getItemNames = (ob) => {
    return ob.item_details_id.itemname;
}

//function define for refill innerform (update(innerform)/ edit(innertable))
const purchaseOrderHasItemFormRefill = (ob, index)=> {

    innerFormIndex = index;
    purchaseOrderHasItem = JSON.parse(JSON.stringify(ob)); // Make a full copy so changes don’t affect the original
    oldPurchaseOrderHasItem = JSON.parse(JSON.stringify(ob));

     items = getServiceRequest("/item_details/list");
     fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode", "itemname", purchaseOrderHasItem.item_details_id.itemcode);

    selectItem.disabled = "disabled";
    
    textUnitPrice.disabled ="";
    textUnitPrice.value = parseFloat(purchaseOrderHasItem.unit_price);
    textQuantity.value = purchaseOrderHasItem.quantity;
    textLinePrice.value = parseFloat(purchaseOrderHasItem.line_amount);


    buttonInnerAdd.style.display = "none";
    buttonInnerUpdate.removeAttribute("style");
}

//function define for delete record-- innertable
const purchaseOrderHasItemDelete = (ob, index)=> {

    let userConfirm = window.confirm("Are you sure you want to remove following item?");
    if(userConfirm){
        window.alert("Removed successfully");

        let extIndex = purchaseOrder.purchaseOrderHasItemList.map(purchaseorderitem =>purchaseorderitem.item_details_id.id).indexOf(ob.item_details_id.id);
        if (extIndex != -1) {
            purchaseOrder.purchaseOrderHasItemList.splice(extIndex, 1);
        }
        refreshPurchaseOrderInnerForm();
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerPurchaseOrderAdd = ()=> {
    console.log(purchaseOrderHasItem);

    let userConfirm = window.confirm("Are you sure you want to add following item?");
    if(userConfirm){
        window.alert("Added successfully");
        purchaseOrder.purchaseOrderHasItemList.push(purchaseOrderHasItem);
        refreshPurchaseOrderInnerForm();
    }
    
}

//function define for update record--- innerform
const buttonInnerPurchaseOrderUpdate = () => {
    console.log(purchaseOrderHasItem);

    if (purchaseOrderHasItem.quantity != oldPurchaseOrderHasItem.quantity) {
        let userConfirm = window.confirm("Are you sure you want to update following item?");
        if (userConfirm) {
            window.alert("Updated successfully");
            purchaseOrder.purchaseOrderHasItemList[innerFormIndex] = purchaseOrderHasItem;
            refreshPurchaseOrderInnerForm();
        }
    }else{
        window.alert("Form has nothing to update"); 
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerPurchaseOrderCancel = ()=> {
       let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshPurchaseOrderInnerForm();
    }
}

const checkPurchaseOrderFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (purchaseOrder.supplier_details_id == "") {
        errors = errors + "Please select a supplier name \n";
    }

    if (purchaseOrder.pricelist_id == null) {
        errors = errors + "Please select a pricelist number \n";
    }

    if (purchaseOrder.required_date == null) {
        errors = errors + "Please enter a required date \n";
    }

    if (purchaseOrder.total_amount == null) {
        errors = errors + "Please enter a total amount \n";
    }

    if (purchaseOrder.purchaseorder_status_id == null) {
        errors = errors + "Please select a purchase order status \n";
    }

    if (purchaseOrder.purchaseOrderHasItemList.length == 0) {
        errors = errors + "Please select an item \n";
    }

    return errors;
}

//form submit event function
const buttonPurchaseOrderSubmit = () => {
    console.log(purchaseOrder);

    let errors = checkPurchaseOrderFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following purchase order? \n" +
            "Supplier name :" + purchaseOrder.supplier_details_id.sup_name + "\n"+
            "Pricelist number : " + purchaseOrder.pricelist_id.pricelist_number + "\n" +
            "Required date : " + purchaseOrder.required_date
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/purchaseorder_details/insert", "POST", purchaseOrder);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshPurchaseOrderTable();
                refreshPurchaseOrderForm();
                $("#modalPurchaseOrderForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

//form reset event function
const buttonPurchaseOrderReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshPurchaseOrderForm();
    }
}

const checkPurchaseOrderFormUpdate = () => {
    let updates = "";
    if (purchaseOrder != null && oldPurchaseOrder != null) {

        if (purchaseOrder.supplier_details_id.sup_name != oldPurchaseOrder.supplier_details_id.sup_name) {
            updates = updates + "Supplier Name has changed \n";
        }
        if (purchaseOrder.pricelist_id.pricelist_number != oldPurchaseOrder.pricelist_id.pricelist_number) {
            updates = updates + "Pricelist number has changed \n";
        }
        if (purchaseOrder.required_date != oldPurchaseOrder.required_date) {
            updates = updates + "Required Date has changed \n";
        }
        if (purchaseOrder.total_amount != oldPurchaseOrder.total_amount) {
            updates = updates + "Total amount has changed \n";
        }
        if (purchaseOrder.purchaseorder_status_id.name != oldPurchaseOrder.purchaseorder_status_id.name) {
            updates = updates + "Purchase order status has changed \n";
        }

         if (purchaseOrder.purchaseOrderHasItemList.length != oldPurchaseOrder.purchaseOrderHasItemList.length) {
            updates =updates + "Purchas Order item has changed \n";
        }else{
            let equalcount = 0;
            for (const oldPurchaseOrderHasItem of oldPurchaseOrder.purchaseOrderHasItemList) {
                for (const purchaseOrderHasItem of purchaseOrder.purchaseOrderHasItemList) {
                    if (oldPurchaseOrderHasItem.item_details_id.id == purchaseOrderHasItem.item_details_id.id) {
                        equalcount = equalcount +1;
                    }
                }
            }
            if (equalcount != purchaseOrder.purchaseOrderHasItemList.length) {
                updates =updates + "Purchase Order item has changed \n";
            } else{
                for (const oldPurchaseOrderHasItem of oldPurchaseOrder.purchaseOrderHasItemList) {
                for (const purchaseOrderHasItem of purchaseOrder.purchaseOrderHasItemList) {
                    if (oldPurchaseOrderHasItem.item_details_id.id == purchaseOrderHasItem.item_details_id.id && oldPurchaseOrderHasItem.quantity != purchaseOrderHasItem.quantity ) {
                         updates =updates + "Pricelist item quantity has changed \n";
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
const buttonPurchaseOrderUpdate = () => {
    console.log(purchaseOrder);

    let errors = checkPurchaseOrderFormError();

    if (errors == "") {

        let updates = checkPurchaseOrderFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following purchase order changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/purchaseorder_details/update", "PUT", purchaseOrder);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshPurchaseOrderTable();
                    refreshPurchaseOrderForm();
                    $("#modalPurchaseOrderForm").modal("hide");

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

