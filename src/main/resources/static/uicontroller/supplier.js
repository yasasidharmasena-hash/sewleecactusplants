//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call supplier table refresh function
    refreshSupplierTable();

    //call refresh form function
    refreshSupplierForm();

});

//refersh supplier table area
const refreshSupplierTable = () => {

    //create array
    const suppliers = getServiceRequest("/supplier_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "sup_no", dataType: "string" },
        { propertyName: "sup_name", dataType: "string" },
        { propertyName: "sup_email", dataType: "string" },
        { propertyName: getSItemNames, dataType: "function" },
        { propertyName: getSupplierStatus, dataType: "function" },

    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tableSupplierBody, suppliers, propertyList, supplierFormRefill, supplierDelete, supplierView, buttonVisibility = true);

    $('#tableSupplier').DataTable();

}

//function define for generate items (propertyList)
const getSItemNames = (ob) => {
    let items = "";
    for (const index in ob.supplierItems) {
        if (index == ob.supplierItems.length - 1) {
           items = items + ob.supplierItems[index].itemname;
            
        }else 
            items = items + ob.supplierItems[index].itemname + ", ";
    }

    return items;

}

//define getSupplierStatus function (propertyList)
const getSupplierStatus = (ob) => {
    if (ob.supplier_status_id.name == "Active") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.supplier_status_id.name;
    }

    if (ob.supplier_status_id.name == "Inactive") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.supplier_status_id.name;
    }

    if (ob.supplier_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.supplier_status_id.name;
    }
}

const transferSelectedItem=()=>{

    if (selectAllItem.value != "") {
        let selectedItem = JSON.parse(selectAllItem.value);
    supplier.supplierItems.push(selectedItem);
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplierItems, "itemname");

    let extIndex =allItem.map(item=>item.id).indexOf(selectedItem.id);
    if (extIndex != -1) {
       allItem.splice(extIndex,1) 
    }
    fillDataIntoSelect(selectAllItem, "", allItem, "itemname");
    }    
}

const transferSelectedAllItems=()=>{
    for (const item of allItem) {
        supplier.supplierItems.push(item);
    }
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplierItems, "itemname");

    allItem = [];
    fillDataIntoSelect(selectAllItem, "", allItem, "itemname");
}

const removeSelectedItem=()=>{

    if (selectSelectedItem.value !="") {
        let selectedItem = JSON.parse(selectSelectedItem.value);
    allItem.push(selectedItem);
    fillDataIntoSelect(selectAllItem, "", allItem, "itemname");

    let extIndex =supplier.supplierItems.map(item=>item.id).indexOf(selectedItem.id);
    if (extIndex != -1) {
       supplier.supplierItems.splice(extIndex,1) 
    }
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplierItems, "itemname");
    }    
}

const removeSelectedAllItems=()=>{
    for (const item of supplier.supplierItems) {
        allItem.push(item);
    }
    fillDataIntoSelect(selectAllItem, "", allItem, "itemname");

    supplier.supplierItems = [];
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplierItems, "itemname");
}

//function define for refill supplier form (update(form)/ edit(table))
const supplierFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    supplier = JSON.parse(JSON.stringify(ob));
    oldSupplier = JSON.parse(JSON.stringify(ob));

    textSupName.value = ob.sup_name;

    //supplier status is a dynamic component
    selectSupStatus.value = JSON.stringify(ob.supplier_status_id);

    textSupEmail.value = ob.sup_email;
    textContactno.value = ob.sup_contactno;

    //Business Reg No is an optional component----can use undefined
    if (ob.business_regno == undefined) {
        textBusinessRegno.value = "";
    }else {
        textBusinessRegno.value = ob.business_regno;
    }

    //select item list is a dynamic component
    selectAllItem.value = JSON.stringify(ob.item_subcategory_id);

    textBankname.value = ob.bank_name;
    textBranchname.value = ob.bank_branchname;
    textAccountno.value = ob.account_no;
    textAccHoldername.value = ob.acct_holdername;
    textSupAddress.value = ob.sup_address;

    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textSupNote.value = "";
    } else {
        textSupNote.value = ob.note;
    }

    // Load unsupplied items for the selected supplier 
    allItem = getServiceRequest("/item_details/unsupplieditems?supplierid=" + supplier.id);
    fillDataIntoSelect(selectAllItem, "",allItem, "itemname");
    
    fillDataIntoSelect(selectSelectedItem, "",supplier.supplierItems, "itemname");

    $("#modalSupplierForm").modal("show");

    buttonSubmit.style.display = "none";
    buttonUpdate.removeAttribute("style");

}

//function define for delete supplier record
const supplierDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following item? \n"
        + "Supplier Code : " + dataOb.sup_no + "\n"
        + "Supplier Name : " + dataOb.sup_name
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/supplier_details/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshSupplierTable();
            refreshSupplierForm(); //refresh form
            $("#modalSupplierForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print supplier record 
const supplierView = (ob, index) => {
    console.log("View", ob, index);

    tdSupNo.innerText = ob.sup_no;
    tdSupName.innerText = ob.sup_name;
    tdSupEmail.innerText = ob.sup_email;
    tdSupContactno.innerText = ob.sup_contactno;
    tdSupStatus.innerText = ob.supplier_status_id.name;
    tdSupItemmaster.innerText = getSItemNames(ob);

    tdSupBankName.innerText = ob.bank_name;
    tdSupBranchName.innerText = ob.bank_branchname;
    tdSupAccountNo.innerText = ob.account_no;
    tdSupAccHolder.innerText = ob.acct_holdername;

    $("#modalSupplierView").modal("show");
}

// Print button on printmodal
const buttonSupplierPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>"
        + tableSupplierView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalSupplierView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshSupplierForm = () => {

    formSupplier.reset();

    //create new object
    supplier = new Object();
    supplier.supplierItems = new Array();

    let supplierStatuses = getServiceRequest("/supplier_status/alldata");
    allItem = getServiceRequest("/item_details/alldata");

    fillDataIntoSelect(selectSupStatus, "Select Supplier Status", supplierStatuses, "name");
    fillDataIntoSelect(selectAllItem, "", allItem, "itemname");
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplierItems, "itemname");

    //set default colors
    setDefault([textSupName, selectSupStatus, textSupEmail, textContactno, textBusinessRegno, selectAllItem,selectSelectedItem, 
        textBankname, textBranchname, textAccountno, textAccHoldername, textSupAddress, textSupNote]);  

    //Set the first supplier status as default (Active)
    selectSupStatus.value = JSON.stringify(supplierStatuses[0]);
    supplier.supplier_status_id = supplierStatuses[0];
    selectSupStatus.style.border = "2px solid green";    

    buttonSubmit.removeAttribute("style");
    buttonUpdate.style.display = "none";
}

const checkSupplierFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (supplier.sup_name == null) {
        errors = errors + "Please enter a supplier name \n";
    }

    if (supplier.supplier_status_id == null) {
        errors = errors + "Please select a supplier status \n";
    }

    if (supplier.sup_email == null) {
        errors = errors + "Please select an email \n";
    }

    if (supplier.sup_contactno == null) {
        errors = errors + "Please enter a contact number \n";
    }

    if (supplier.supplierItems.length == 0) {
         errors = errors + "Please select items \n";
    }

    if (supplier.bank_name == null) {
        errors = errors + "Please enter a bank name \n";
    }

    if (supplier.bank_branchname == null) {
        errors = errors + "Please enter a branch name \n";
    }

    if (supplier.account_no == null) {
        errors = errors + "Please enter an account number \n";
    }

    if (supplier.acct_holdername == null) {
        errors = errors + "Please enter an account holder name \n";
    }

    if (supplier.sup_address == null) {
        errors = errors + "Please enter an address \n";
    }

    return errors;
}

// supplier form submit event function
const buttonSupplierSubmit = () => {
    console.log(supplier);

    let errors = checkSupplierFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following supplier? \n" +
            "Supplier Name :" + supplier.sup_name + "\n" +
            "Supplier Email : " + supplier.sup_email + "\n" +
            "Supplier Contact number :" + supplier.sup_contactno
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/supplier_details/insert", "POST", supplier);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshSupplierTable();
                refreshSupplierForm();
                $("#modalSupplierForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// supplier form reset event function
const buttonSupplierReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshSupplierForm();
    }
}

//function for check form updates
const checkSupplierFormUpdate = () => {
    let updates = "";
    if (supplier != null && oldSupplier != null) {

        if (supplier.sup_name != oldSupplier.sup_name) {
            updates = updates + "Supplier name has changed \n";
        }
        if (supplier.supplier_status_id.name != oldSupplier.supplier_status_id.name) {
            updates = updates + "Supplier status has changed \n";
        }
        if (supplier.sup_email != oldSupplier.sup_email) {
            updates = updates + "Supplier email has changed \n";
        }
        if (supplier.sup_contactno != oldSupplier.sup_contactno) {
            updates = updates + "Supplier contact number has changed \n";
        }
        if (supplier.business_regno != oldSupplier.business_regno) {
            updates = updates + "Business registration number has changed \n";
        }
        if (supplier.sup_address != oldSupplier.sup_address) {
            updates = updates + "Address has changed \n";
        }

        if (supplier.supplierItems.length != oldSupplier.supplierItems.length) {
            updates = updates + "Item has changed \n";
        }

        if (supplier.bank_name != oldSupplier.bank_name) {
            updates = updates + "Bank name has changed \n";
        }
        if (supplier.bank_branchname != oldSupplier.bank_branchname) {
            updates = updates + "Bank branch name has changed \n";
        }
        if (supplier.account_no != oldSupplier.account_no) {
            updates = updates + "Account number has changed \n";
        }
        if (supplier.acct_holdername != oldSupplier.acct_holdername) {
            updates = updates + "Account holder name has changed \n";
        }
    }
    return updates;
}

//supplier form update event function
const buttonSupplierUpdate = () => {
    console.log(supplier);

    let errors = checkSupplierFormError();

    if (errors == "") {

        let updates = checkSupplierFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following supplier changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/supplier_details/update", "PUT", supplier);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshSupplierTable();
                    refreshSupplierForm();
                    $("#modalSupplierForm").modal("hide");

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