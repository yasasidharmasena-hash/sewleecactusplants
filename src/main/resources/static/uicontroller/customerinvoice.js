//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function
    refreshInvoiceTable();

    //call refresh form function
    refreshInvoiceForm();

});

//refersh table area
const refreshInvoiceTable = () => {

    //create array
    const invoices = getServiceRequest("/customer_invoice/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "invoice_number", dataType: "string" },
        { propertyName: getCustomerName, dataType: "function" },
        { propertyName: "total_amount", dataType: "decimal" },
        { propertyName: "discount_amount", dataType: "decimal" },
        { propertyName: "net_amount", dataType: "decimal" },
        { propertyName: "paid_amount", dataType: "decimal" },
        { propertyName: "balance_amount", dataType: "decimal" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, printFunction, buttonVisibility)
    fillDataIntoTableTwo(tableInvoiceBody, invoices, propertyList, invoiceView, buttonVisibility = true);

    $('#tableInvoice').DataTable();

}

//define getCustomerName function (propertyList)
const getCustomerName = (ob) => {
    return ob.customer_details_id.cust_fullname;
}

//function define for print record 
const invoiceView = (ob, index) => {
    console.log("View", ob, index);

    tdInNumber.innerText = ob.invoice_number;
    tdCustName.innerText = getCustomerName(ob);
    let propertyList = [
        { propertyName: getItemNames, dataType: "function" },
        { propertyName: "unit_price", dataType: "decimal" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "line_price", dataType: "decimal" } 
    ];

    //call fillDataIntoTable function(tableBodyId, ,dataList, propertyList, editFunctionName, deleteFunctionName)
    fillDataIntoInnerTable(tablePrintInnerInvoiceBody,ob.customerInvoiceHasItemList, propertyList, customerInvoiceHasItemFormRefill, customerInvoiceHasItemDelete,false);
    
    tdTAmount.innerText = ob.total_amount;
    tdDisAmount.innerText = ob.discount_amount;
    tdNetAmount.innerText = ob.net_amount;
    tdPaidAmount.innerText = ob.paid_amount;
    tdBalAmount.innerText = ob.balance_amount;

    $("#modalInvoiceView").modal("show");
}

// Print button on printmodal
const buttonInvoicePrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableInvoiceView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalInvoiceView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */


//define function for refresh form (submit)
const refreshInvoiceForm = () => {

    formInvoice.reset();

    //create new object
    invoice = new Object();
    invoice.customerInvoiceHasItemList = new Array();

    let customers = getServiceRequest("/customer_details/alldata");

    fillDataIntoSelect(selectCustomer, "Select Customer Name", customers, "cust_fullname" );

    //set default colors
    setDefault([selectCustomer, selectPaymentMethod, textTotalAmount, textDiscount, textNetAmount, textPaidAmount, textBalanceAmount, textNote]);

    buttonSubmit.removeAttribute("style");
   
    refreshInvoiceInnerForm();
}

//define function for calculate line price
const calculateLinePrice = ()=>{
    if (textQuantity.value > 0) {
        let lineAmount =(parseFloat(textQuantity.value) * parseFloat(customerInvoiceHasItem.unit_price)).toFixed(2);
        customerInvoiceHasItem.line_price = lineAmount;
        textLinePrice.value = lineAmount;
        textLinePrice.style.border = "2px solid green"; 
    } else {
       customerInvoiceHasItem.quantity = null;
       customerInvoiceHasItem.line_price = null;
       textQuantity.style.border = "2px solid red"; 
       textLinePrice.style.border = "1px solid #ced4da"; 
       textLinePrice.value = "";
    }    
}

//define function for check exist (added) items to the inner table
const checkExistItems =()=>{

    let selectedItem = JSON.parse(selectItem.value);
    let extIndex = invoice.customerInvoiceHasItemList.map(invoiceitem=>invoiceitem.item_details_id.id).indexOf(selectedItem.id);

    if (extIndex > -1) {
        window.alert("Selected item is already exist!");
        refreshInvoiceInnerForm();
    }else {
        filterItemInventory();
    }

    
}

//define function for refresh inner form
const refreshInvoiceInnerForm = ()=> {

    customerInvoiceHasItem = new Object();

    let items = getServiceRequest("/item_details/alldata");

    fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode", "itemname");

    fillDataIntoSelect(selectInventory, "Select Unit Price", [], "retailprice");

    selectItem.disabled = "";
    textQuantity.value = "";
    textLinePrice.value = "";
    textLinePrice.disabled = "disabled";

    //set default colors
    setDefault([selectItem, selectInventory, textQuantity, textLinePrice]);

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
        { propertyName: "line_price", dataType: "decimal" } 
    ];

    //call fillDataIntoTable function(tableBodyId, dataList, propertyList, editFunctionName, deleteFunctionName)
    fillDataIntoInnerTable(tableInnerInvoiceBody,invoice.customerInvoiceHasItemList, propertyList, customerInvoiceHasItemFormRefill, customerInvoiceHasItemDelete,buttonVisibility = true);

    //get fuction for Total amount
    let totalAmount = 0.00;
    for (const orderitem of invoice.customerInvoiceHasItemList) {
        totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.line_price);
    }
    if (totalAmount != 0.00) {
        textTotalAmount.value = totalAmount.toFixed(2);
        invoice.total_amount = textTotalAmount.value;
        textTotalAmount.style.border = "2px solid green";
    }
}

//define function for calculate net amount
const calculateNetAmount = ()=>{
   let total_amount = textTotalAmount.value;
    let discount_amount = textDiscount.value;
    let net_amount =parseFloat(total_amount) - (parseFloat(total_amount)*parseFloat(discount_amount)/100);

    textNetAmount.value = parseFloat(net_amount).toFixed(2);
    invoice.net_amount = textNetAmount.value;
    textNetAmount.style.border = "2px solid green";
}

//define function for calculate balance amount
const calculateBalanceAmount = ()=>{
    if (textPaidAmount.value >= textNetAmount.value) {
        let net_amount = textNetAmount.value;
    let paid_amount = textPaidAmount.value;
    let balance_amount =parseFloat(paid_amount) -parseFloat(net_amount);

    textBalanceAmount.value = parseFloat(balance_amount).toFixed(2);
    invoice.balance_amount = textBalanceAmount.value;
    textBalanceAmount.style.border = "2px solid green";
    } else {
        textBalanceAmount.value = "";
        invoice.balance_amount = null;
    textBalanceAmount.style.border = "2px solid red";
    textPaidAmount.style.border = "2px solid red";
    }
   

}

const filterItemInventory =()=> {
    let inventorybyitem = getServiceRequest("/inventory_details/byitem/" + JSON.parse(selectItem.value).id)
     fillDataIntoSelect(selectInventory, "Select Unit Price", inventorybyitem, "retailprice");
}

//define getItemNames function (propertyList)
const getItemNames = (ob) => {
     return ob.item_details_id.itemname;
}


//function define for refill innerform (update(innerform)/ edit(innertable))
const customerInvoiceHasItemFormRefill = (ob, index)=> {

    innerFormIndex = index;
    customerInvoiceHasItem = JSON.parse(JSON.stringify(ob)); // Make a full copy so changes don’t affect the original
    oldCustomerInvoiceHasItem = JSON.parse(JSON.stringify(ob));

     items = getServiceRequest("/item_details/all");
     fillDataIntoSelect(selectItem, "Select Item", items, "itemcode", "itemname");

    selectItem.disabled = "disabled";
    selectItem.disabled = "";
    
    textUnitPrice.disabled ="";
    textUnitPrice.value = parseFloat(customerInvoiceHasItem.unit_price);
    textQuantity.value = customerInvoiceHasItem.quantity;
    textLinePrice.value = parseFloat(customerInvoiceHasItem.line_price);


    buttonInnerAdd.style.display = "none";
    buttonInnerUpdate.removeAttribute("style");
}

//function define for delete record-- innertable
const customerInvoiceHasItemDelete = (ob, index)=> {

    let userConfirm = window.confirm("Are you sure you want to remove following item?");
    if(userConfirm){
        window.alert("Removed successfully");

        let extIndex = invoice.customerInvoiceHasItemList.map(invoiceitem =>invoiceitem.item_details_id.id).indexOf(ob.item_details_id.id);
        if (extIndex != -1) {
            invoice.customerInvoiceHasItemList.splice(extIndex, 1);
        }
        refreshInvoiceInnerForm();
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerInvoiceAdd = ()=> {
    console.log(customerInvoiceHasItem);

    let userConfirm = window.confirm("Are you sure you want to add following item?");
    if(userConfirm){
        window.alert("Added successfully");
        invoice.customerInvoiceHasItemList.push(customerInvoiceHasItem);
        refreshInvoiceInnerForm();
    }
    
}

//function define for update record--- innerform
const buttonInnerInvoiceUpdate = () => {
    console.log(customerInvoiceHasItem);

    if (customerInvoiceHasItem.quantity != oldCustomerInvoiceHasItem.quantity) {
        let userConfirm = window.confirm("Are you sure you want to update following item?");
        if (userConfirm) {
            window.alert("Updated successfully");
            invoice.customerInvoiceHasItemList[innerFormIndex] = customerInvoiceHasItem;
            refreshInvoiceInnerForm();
        }
    }else{
        window.alert("Form has nothing to update"); 
    }
}

//function define for Add/ submit/insert record-- innerform
const buttonInnerInvoiceCancel = ()=> {
       let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshInvoiceInnerForm();
    }
}

const checkInvoiceFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (invoice.payment_method == "") {
        errors = errors + "Please select a payment method \n";
    }

    if (invoice.total_amount == null) {
        errors = errors + "Please enter total amount \n";
    }

    if (invoice.discount_amount == null) {
        errors = errors + "Please enter a discount \n";
    }

    if (invoice.net_amount == null) {
        errors = errors + "Please enter a net amount \n";
    }

    if (invoice.paid_amount == null) {
        errors = errors + "Please enter paid amount \n";
    }

      if (invoice.balance_amount == null) {
        errors = errors + "Please enter balance amount \n";
    }

    if (invoice.customerInvoiceHasItemList.length == 0) {
        errors = errors + "Please select an item \n";
    }

    return errors;
}

//form submit event function
const buttonInvoiceSubmit = () => {
    console.log(invoice);

    let errors = checkInvoiceFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following invoice? \n" +
            "Customer name :" + invoice.customer_details_id.cust_fullname + "\n"+
            "Balance amount : " + invoice.balance_amount
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/customer_invoice/insert", "POST", invoice);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshInvoiceTable();
                refreshInvoiceForm();
                $("#modalInvoiceForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

//form reset event function
const buttonInvoiceReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshInvoiceForm();
    }
}

