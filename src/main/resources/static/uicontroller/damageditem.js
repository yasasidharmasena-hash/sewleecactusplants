//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call item table refresh function
    refreshDamagedTable();

    //call refresh form function
    refreshDamagedForm();

});

//refersh table area
const refreshDamagedTable = () => {

    //create array
    const damageitems = getServiceRequest("/damaged_items/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: getItemNames, dataType: "function" },
        { propertyName: "quantity", dataType: "string" },
        { propertyName: "reason", dataType: "string" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, printFunction, buttonVisibility)
    fillDataIntoTableTwo(tableDamagedBody, damageitems, propertyList, damagedView, buttonVisibility = true);

    $('#tableDamaged').DataTable();

}

//define getItemNames function (propertyList)
const getItemNames = (ob) => {
     return ob.item_details_id.itemname;
}


//function define for print record 
const damagedView = (ob, index) => {
    console.log("View", ob, index);

    tdItemName.innerText = getItemNames(ob);
    tdQuantity.innerText = ob.quantity;
    tdReason.innerText = ob.reason;

    $("#modalDamagedView").modal("show");
}

// Print button on printmodal
const buttonDamagedPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableDamagedView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalDamagedView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshDamagedForm = () => {
    console.log("damage");

    formDamaged.reset();

    //create new object
    damage = new Object();

    let items = getServiceRequest("/item_details/alldata");

    fillDataIntoSelect(selectItem, "Select Item", items, "itemname");
   

    //set default colors
    setDefault([selectItem, textQuantity, textReason]);

    buttonSubmit.removeAttribute("style");
    
}

const checkDamagedFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (damage.item_details_id == null) {
        errors = errors + "Please select an item name \n";
    }

     if (damage.quantity == null) {
        errors = errors + "Please enter a quantity\n";
    }

    return errors;
}

//form submit event function
const buttonDamagedSubmit = () => {
    console.log(damage);

    let errors = checkDamagedFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following item? \n" +
            "Item Name :" + damage.item_details_id.itemname + "\n"+
            "Item Quantity : " + damage.quantity
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/damaged_items/insert", "POST", damage);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshDamagedTable();
                refreshDamagedForm();
                 $("#modalDamagedForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// form reset event function
const buttonDamagedReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshDamagedForm();
    }
}
