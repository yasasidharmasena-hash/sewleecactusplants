//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call item table refresh function
    refreshPaymentTable();

    //call refresh form function
    refreshPaymentForm();

});

//refersh table area
const refreshPaymentTable = () => {

    //create array
    const payments = getServiceRequest("/payment_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "bill_number", dataType: "string" },
        { propertyName: getSupName, dataType: "function" },
        { propertyName: getSupBill, dataType: "function" },
        { propertyName: "total_amount", dataType: "decimal" },
        { propertyName: "paid_amount", dataType: "decimal" },
        { propertyName: "balance_amount", dataType: "decimal" },
        { propertyName: "payment_method", dataType: "string" },   
    ];

    //define function for fill data into table (tableBodyId, dataList, propertyList, viewFunctionName)
    fillDataIntoTable(tablePaymentBody, payments, propertyList, paymentView, buttonVisibility = true);

    $('#tablePayment').DataTable();

}

//define getSupName function (propertyList)
const getSupName = (ob) => {
     return ob.supplier_details_id.sup_name;
}

//define getSupBill function (propertyList)
const getSupBill = (ob) => {
     return ob.grn_details_id.supplier_billnumber;
}

//function define for generate balance price
/*const generateBalancePrice = ()=> {
    let profitratio = textProfitratio.value;
    let costPrice = textCostPrice.value;
    let retailPrice =parseFloat(costPrice) + (parseFloat(costPrice)*parseFloat(profitratio)/100);

    textRetailPrice.value = parseFloat(retailPrice).toFixed(2);
    item.retailprice = textRetailPrice.value;
    textRetailPrice.style.border = "2px solid green";
}*/

//
const generateTotalAmount = ()=>{
    let grn = JSON.parse(selectSupplierBill.value);
    textTotalAmount.value =(parseFloat(grn.net_amount)-parseFloat(grn.paid_amount)).toFixed(2) ;
    payment.total_amount = textTotalAmount.value;
     textTotalAmount.style.border = "2px solid green";

}

//function define for print record 
const paymentView = (ob, index) => {
    console.log("View", ob, index);

    tdPayBillNo.innerText = ob.bill_number;
    tdSupName.innerText = getSupName(ob);
    tdSupBillNo.innerText = getSupBill(ob);
    tdTotalAmount.innerText = ob.total_amount;
    tdPaidAmount.innerText = ob.paid_amount;
    tdBalanceAmount.innerText = ob.balance_amount;
    tdPaymentMethod.innerText = ob.payment_method;

    $("#modalPaymentView").modal("show");
}

// Print button on printmodal
const buttonItemPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tablePaymentView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalPaymentView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshPaymentForm = () => {

    formPayment.reset();

    let suppliers = getServiceRequest("/supplier_details/alldata");
    let supbillnumbers = getServiceRequest("/grn_details/alldata");

    fillDataIntoSelect(selectSupplier, "Select Supplier Code", suppliers, "sup_name" );
    fillDataIntoSelect(selectSupplierBill, "Select Supplier Bill No.", supbillnumbers, "grn_details_id");

    //create new object
    payment = new Object();

    //set default colors
    setDefault([selectSupplier,selectSupplierBill,textTotalAmount, texPaidAmount, textBalanceAmount, selectPaymentMethod, textChequeNo, dteCheque, textTransferId, dteTransfer, textNote]);

    buttonSubmit.removeAttribute("style");

}

//supplier name validate and get pricelist code by selected supplier
let selectSupplierElement = document.querySelector("#selectSupplier");
selectSupplierElement.addEventListener("change", ()=>{
    let supplier = JSON.parse(selectSupplierElement.value);
    payment.supplier_details_id = supplier;
    selectSupplierElement.style.border = "2px solid green";

     let billNumberBySup = getServiceRequest("/grn_details/getbysupplierid?supplierid="+ supplier.id);
     fillDataIntoSelect(selectSupplierBill, "Select Bill Number", billNumberBySup, "supplier_billnumber");

});


const checkPaymentFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (payment.supplier_details_id == null) {
        errors = errors + "Please select supplier name \n";
    }

    if (payment.grn_details_id == "") {
        errors = errors + "Please select a supplier bill \n";
    }

     if (payment.total_amount == null) {
        errors = errors + "Please enter a total amount \n";
    }

    if (payment.paid_amount == null) {
        errors = errors + "Please enter a paid amount \n";
    }

    if (payment.balance_amount == null) {
        errors = errors + "Please select a balance amount \n";
    }

    if (payment.payment_method == null) {
        errors = errors + "Please select a payment method \n";
    }

    return errors;
}

// form submit event function
const buttonPaymentSubmit = () => {
    console.log(payment);

    let errors = checkPaymentFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following payment? \n" +
            "Supplier Name :" + payment.supplier_details_id + "\n"+
            "Balance Amount : " + payment.balance_amount + "\n"+
            "Payment Method : " + payment.payment_method
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/payment_details/insert", "POST", payment);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshPaymentTable();
                refreshPaymentForm();
                 $("#modalPaymentForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// form reset event function
const buttonPaymentReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshPaymentForm();
    }
}

let selectPaymentMethodElement = document.querySelector("#selectPaymentMethod");
selectPaymentMethodElement.addEventListener("change",()=>{
    let paymentmethod = selectPaymentMethodElement.value;
    selectPaymentMethodElement.style.border = "2px solid green";

    if(paymentmethod.name == "Cheque"){
        textTransferid.disabled = "disabled";
        dteTransfer.disabled = "disabled";
    }

    if(paymentmethod.name == "Online"){
        textTransferid.disabled = "disabled";
        dteTransfer.disabled = "disabled";
        textChequeNo.disabled = "";
        dteCheque.disabled = "";
    }

});

