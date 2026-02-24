//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function
    refreshGrnTable();

    //call refresh form function
    refreshGrnForm();

});

//refersh table area
const refreshGrnTable = () => {

    //create array
    const grns = getServiceRequest("/grn_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: getSupplierName, dataType: "function" },
        { propertyName: getPoNumber, dataType: "function" },
        { propertyName: "supplier_billnumber", dataType: "string" },
        { propertyName: "received_date", dataType: "string" },
        { propertyName: "total_amount", dataType: "decimal" },
        { propertyName: "discount", dataType: "decimal" },
        { propertyName: "net_amount", dataType: "decimal" },
        { propertyName: getGrnStatus, dataType: "function" }
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTableTwo(tableGrnBody, grns, propertyList, grnView, buttonVisibility = true);

    $('#tableGrn').DataTable();
}

//define getSupplierName function (propertyList)
const getSupplierName = (ob) => {
       if (ob.purchaseorder_details_id.supplier_details_id != null) {
        return ob.purchaseorder_details_id.supplier_details_id.sup_name;
    } else {
        return "-";
    }
}

//define getPoNumber function (propertyList)
const getPoNumber = (ob) => {
    return ob.purchaseorder_details_id.po_number;
}

//define getGrnStatus function (propertyList)
const getGrnStatus = (ob) => {
    if (ob.grn_status_id.name == "Received") {
        return "<button type='button' class='btn btn-info'></button><br>" + ob.grn_status_id.name;
    }

    if (ob.grn_status_id.name == "Completed") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.grn_status_id.name;
    }
}

//function define for print record 
const grnView = (ob, index) => {
    console.log("View", ob, index);

    tdSupplierName.innerText = getSupplierName(ob);
    tdPoNumber.innerText = getPoNumber(ob);
    tdSupBillNo.innerText = ob.supplier_billnumber;
    tdReceivedDate.innerText = ob.received_date;
    tdTotalAmount.innerText = ob.total_amount;
    tdDiscount.innerText = ob.discount;
    tdNetAmount.innerText = ob.net_amount;
    tdStatus.innerText = ob.grn_status_id.name;
     
    let propertyList = [
        { propertyName: getItemNames, dataType: "function" },
        { propertyName: "unit_price", dataType: "decimal" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "line_amount", dataType: "decimal" } 
    ];
    
    //call fillDataIntoTable function(tableBodyId, dataList, propertyList)
    fillDataIntoInnerTable(tablePrintInnerGrnBody,ob.grnHasItemList, propertyList, grnHasItemFormRefill, grnHasItemDelete,false);

    $("#modalGrnView").modal("show");
}

// Print button on printmodal
const buttonGrnPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableGrnView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalGrnView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */


//define function for refresh form (submit)
const refreshGrnForm = () => {

    formGrn.reset();

    //create new object
    grn = new Object();
    grn.grnHasItemList = new Array();

    let suppliers = getServiceRequest("/supplier_details/alldata");
    let poNumbers = getServiceRequest("/purchaseorder_details/alldata");
    let grnStatuses = getServiceRequest("/grn_status/alldata");

    fillDataIntoSelect(selectSupplier, "Select Supplier Code", suppliers, "sup_name" );
    fillDataIntoSelect(selectPoNumber, "Select PO Number", poNumbers, "po_number");
    fillDataIntoSelect(selectGrnStatus, "Select GRN Status", grnStatuses, "name");

    selectGrnStatus.value =JSON.stringify(grnStatuses[0]);
    grn.grn_status_id = grnStatuses[0];
    selectGrnStatus.style.border = "2px solid green";

    //set default colors
    setDefault([selectSupplier, selectPoNumber, textSupBillNo, dteReceivedDate, textTotalAmount, textDiscount, textNetAmount, selectGrnStatus, textNote]);

    selectSupplier.disabled = "";

    buttonSubmit.removeAttribute("style");
    

    refreshGrnInnerForm();
}

//supplier name validate and get po number by selected supplier
let selectSupplierElement = document.querySelector("#selectSupplier");
selectSupplierElement.addEventListener("change", ()=>{
    let supplier = JSON.parse(selectSupplierElement.value);
    grn.supplier_details_id = supplier;
    selectSupplierElement.style.border = "2px solid green";

     let poNumberBySup = getServiceRequest("/purchaseorder_details/byposupplierid?supplierid="+ supplier.id);
     fillDataIntoSelect(selectPoNumber, "Select PO Number", poNumberBySup, "po_number");

});

//get items that include selected po number
const filterItemsByPoNumber =()=>{
    let items = getServiceRequest("/item_details/byponumber?poid="+ JSON.parse(selectPoNumber.value).id);
    fillDataIntoSelectTwo(selectItem, "Select Items", items, "itemcode", "itemname" );
}

//define function for calculate line price
const calculateLinePrice = ()=>{
    if (textQuantity.value > 0) {
        let lineAmount =(parseFloat(textQuantity.value) * parseFloat(textUnitPrice.value)).toFixed(2);
        grnHasItem.line_amount = lineAmount;
        textLinePrice.value = lineAmount;
        textLinePrice.style.border = "2px solid green"; 
    } else {
       grnHasItem.quantity = null;
       grnHasItem.line_amount = null;
       textQuantity.style.border = "2px solid red"; 
       textLinePrice.style.border = "1px solid #ced4da"; 
       textLinePrice.value = "";
    }    
}

//define function for calculate net price
const calculateNetPrice = ()=>{
   let total_amount = textTotalAmount.value;
    let discount = textDiscount.value;
    let net_amount =parseFloat(total_amount) - (parseFloat(total_amount)*parseFloat(discount)/100);

    textNetAmount.value = parseFloat(net_amount).toFixed(2);
    grn.net_amount = textNetAmount.value;
    textNetAmount.style.border = "2px solid green";

}

//define function for check exist (added) items to the inner table
const checkExistItems =()=>{

    let selectedItem = JSON.parse(selectItem.value);
    let extIndex = grn.grnHasItemList.map(grnitem=>grnitem.item_details_id.id).indexOf(selectedItem.id);

    if (extIndex > -1) {
        window.alert("Selected item is already exist!");
        refreshGrnInnerForm();
    } else {
         let purchasrorderItems = getServiceRequest("/purchaseorder_details_has_item_details/byitempurchaseorder?itemid=" + selectedItem.id + "&podid=" + grn.purchaseorder_details_id.id);

        textUnitPrice.value = parseFloat(purchasrorderItems.unit_price).toFixed(2);
        grnHasItem.unit_price = parseFloat(textUnitPrice.value).toFixed(2);
        textUnitPrice.style.border = "2px solid green";
    }
    
}

//define function for refresh inner form
const refreshGrnInnerForm = ()=> {

    grnHasItem = new Object();

    let items = [];
    if (selectPoNumber.value != "") {
        items =  getServiceRequest("/item_details/byponumber?poid="+ JSON.parse(selectPoNumber.value).id);
    } else {
        items = getServiceRequest("/item_details/alldata");
    }

    fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode", "itemname");

    selectItem.disabled = "";
    textUnitPrice.value = "";
    //textUnitPrice.disabled = "disabled";
    textQuantity.value = "";
    textLinePrice.value = "";
    //textLinePrice.disabled = "disabled";

    //set default colors
    setDefault([selectItem, textUnitPrice, textQuantity, textLinePrice]);

    buttonInnerAdd.removeAttribute("style");
    


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
    fillDataIntoInnerTable(tableInnerGrnBody,grn.grnHasItemList, propertyList, grnHasItemFormRefill, grnHasItemDelete,buttonVisibility = true);

    //get fuction for Total amount
    let totalAmount = 0.00;
    for (const grnitem of grn.grnHasItemList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(grnitem.line_amount);
    }
    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        grn.total_amount = textTotalAmount.value;
        textTotalAmount.style.border = "2px solid green";
    }

}

//define getItemNames function (propertyList)
const getItemNames = (ob) => {
    return ob.item_details_id.itemname;
}

//function define for refill innerform (update(innerform)/ edit(innertable))
const grnHasItemFormRefill = (ob, index)=> {

    innerFormIndex = index;
    grnHasHasItem = JSON.parse(JSON.stringify(ob)); // Make a full copy so changes don’t affect the original
    oldGrnHasItem = JSON.parse(JSON.stringify(ob));

     items = getServiceRequest("/item_details/alldata");
     fillDataIntoSelect(selectItem, "Select Item", items, "itemcode", "itemname");

    selectItem.disabled = "disabled";
    selectItem.disabled = "";
    
    textUnitPrice.disabled ="";
    textUnitPrice.value = parseFloat(grnHasHasItem.unit_price);
    textQuantity.value = grnHasHasItem.quantity;
    textLinePrice.value = parseFloat(grnHasHasItem.line_amount);


    buttonInnerAdd.style.display = "none";
    buttonInnerUpdate.removeAttribute("style");
}

//function define for delete record-- innertable
const grnHasItemDelete = (ob, index)=> {

    let userConfirm = window.confirm("Are you sure you want to remove following item?");
    if(userConfirm){
        window.alert("Removed successfully");

        let extIndex = grn.grnHasItemList.map(grnitem =>grnitem.item_details_id.id).indexOf(ob.item_details_id.id);
        if (extIndex != -1) {
            grn.grnHasItemList.splice(extIndex, 1);
        }
        refreshGrnInnerForm();
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerGrnAdd = ()=> {
    console.log(grnHasItem);

    let userConfirm = window.confirm("Are you sure you want to add following item?");
    if(userConfirm){
        window.alert("Added successfully");
        grn.grnHasItemList.push(grnHasItem);
        refreshGrnInnerForm();
    }
    
}

//function define for update record--- innerform
const buttonInnerGrnUpdate = () => {
    console.log(grnHasItem);

    if (grnHasItem.quantity != oldGrnHasItem.quantity) {
        let userConfirm = window.confirm("Are you sure you want to update following item?");
        if (userConfirm) {
            window.alert("Updated successfully");
            grn.grnHasItemList[innerFormIndex] = grnHasItem;
            refreshGrnInnerForm();
        }
    }else{
        window.alert("Form has nothing to update"); 
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerGrnCancel = ()=> {
      let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshGrnInnerForm();
    }
}

/*const generateNetAmount = ()=>{
    let discount = textDiscount.value;
    let total_amount = textTotalAmount.value;
    let net_amount = 0;

    net_amount = parseFloat(total_amount)-parseFloat(total_amount)*parseFloat(discount)/100

    textNetAmount.value = parseFloat(net_amount).toFixed(2);
    textNetAmount.style.border="2px solid green";
    grn.net_amount = textNetAmount.value;
    grn.discount =textDiscount.value;
}*/

const checkGrnFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (grn.supplier_details_id == "") {
        errors = errors + "Please select a supplier name \n";
    }

    if (grn.purchaseorder_details_id == null) {
        errors = errors + "Please select a po number \n";
    }

    if (grn.supplier_billnumber == null) {
        errors = errors + "Please enter a supplier bill number \n";
    }

    if (grn.received_date == null) {
        errors = errors + "Please enter a received date \n";
    }

     if (grn.discount == null) {
        errors = errors + "Please enter a discount \n";
    }

    if (grn.grn_status_id == null) {
        errors = errors + "Please select a grn status \n";
    }

    if (grn.grnHasItemList.length == 0) {
        errors = errors + "Please select an item \n";
    }

    return errors;
}

//form submit event function
const buttonGrnSubmit = () => {
    console.log(grn);

    let errors = checkGrnFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following purchase order? \n" +
            "Supplier name :" + grn.supplier_details_id.sup_name + "\n"+
            "PO number : " + grn.purchaseorder_details_id.po_number + "\n" +
            "Required date : " + grn.received_date
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/grn_details/insert", "POST", grn);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshGrnTable();
                refreshGrnForm();
                $("#modalGrnForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

//form reset event function
const buttonGrnReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshGrnForm();
    }
}



