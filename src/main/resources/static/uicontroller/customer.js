//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call customer table refresh function
    refreshCustomerTable();

    //call refresh form function
    refreshCustomerForm();

});

//refersh customer table area
const refreshCustomerTable = () => {

    //create array
    const customers = getServiceRequest("/customer_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "cust_regno", dataType: "string" },
        { propertyName: "cust_fullname", dataType: "string" },
        { propertyName: "cust_mobileno", dataType: "string" },
        { propertyName: "cust_nic", dataType: "string" },
        { propertyName: "cust_email", dataType: "string" },
        { propertyName: getCustomerStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tableCustomerBody, customers, propertyList, customerFormRefill, customerDelete, customerView, buttonVisibility = true);

    $('#tableCustomer').DataTable();
}

//define getCustomerStatus function (propertyList)
const getCustomerStatus = (ob) => {
    if (ob.customer_status_id.name == "Active") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.customer_status_id.name;
    }

    if (ob.customer_status_id.name == "Inactive") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.customer_status_id.name;
    }

    if (ob.customer_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.customer_status_id.name;
    }
}

//function define for refill customer form (update(form)/ edit(table))
const customerFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    customer = JSON.parse(JSON.stringify(ob));
    oldCustomer = JSON.parse(JSON.stringify(ob));

    textCustName.value = ob.cust_fullname;
    textCustNic.value = ob.cust_nic;
    textCustEmail.value = ob.cust_email;
    textCustMobile.value = ob.cust_mobileno;

    //customer status is a dynamic component
    selectCustomerStatus.value = JSON.stringify(ob.customer_status_id);

    textCustAddress.value = ob.cust_address;

    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textCustNote.value = "";
    } else {
        textCustNote.value = ob.note;
    }

    $("#modalCustomerForm").modal("show");

    buttonSubmit.style.display = "none";
    buttonUpdate.removeAttribute("style");

}

//function define for delete customer record
const customerDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following customer? \n"
        + "Registration number : " + dataOb.cust_regno + "\n"
        + "Customer Name : " + dataOb.cust_fullname
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/customer_details/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshCustomerTable();
            refreshCustomerForm(); //refresh form
            $("#modalCustomerForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print customer record 
const customerView = (ob, index) => {
    console.log("View", ob, index);

    tdCustomerRegNo.innerText = ob.cust_regno;
    tdCustomername.innerText = ob.cust_fullname;
    tdCustomerNic.innerText = ob.cust_nic;
    tdCustomerEmail.innerText = ob.cust_email;
    tdCustomerMobile.innerText = ob.cust_mobileno;
    
    tdCustomerStatus.innerText = ob.customer_status_id.name;

    $("#modalCustomerView").modal("show");
}

// Print button on printmodal
const buttonCustomerPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + 
    tableCustomerView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalCustomerView').addEventListener('shown.bs.modal', setCurrentDateTime);

/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshCustomerForm = () => {

    formCustomer.reset();

    //create new object
    customer = new Object();

    let customerStatuses = getServiceRequest("/customer_status/alldata");

    fillDataIntoSelect(selectCustomerStatus, "Select Customer Status", customerStatuses, "name");

    //set default colors
    setDefault([textCustName, textCustNic, textCustEmail, textCustMobile, selectCustomerStatus, textCustAddress, textCustNote]);

    buttonSubmit.removeAttribute("style");
    buttonUpdate.style.display = "none";
}

//define NIC validation
const nicValidator = (nicElement) => {
    const nicValue = nicElement.value;

    if (nicValue != "") {
        if (new RegExp("^([98765][0-9]{8}[VvXx])|([1][9][98765][0-9]{9})|([2][0][0][543210][0-9]{8})$").test(nicValue)) {
            //valid NIC
            nicElement.style.border = "2px solid green";
            customer.cust_nic = nicValue;

        } else {
            //invalid NIC
            nicElement.style.border = "2px solid red";
            customer.cust_nic = null;
        }
    } else {
        //invalid NIC
        nicElement.style.border = "2px solid red";
        customer.nic = null;
    }
}


const checkCustomerFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (customer.cust_fullname == null) {
        errors = errors + "Please enter a full name \n";
    }

   if (customer.cust_nic == null) {
        errors = errors + "Please enter a NIC \n";
    }

    if (customer.cust_email == null) {
        errors = errors + "Please enter an email \n";
    }

    if (customer.cust_mobileno == null) {
        errors = errors + "Please enter a mobile number \n";
    }

    if (customer.customer_status_id == null) {
        errors = errors + "Please select a customer status \n";
    }

    if (customer.cust_address == null) {
        errors = errors + "Please enter an address \n";
    }

    return errors;
}

// customer form submit event function
const buttonCustomerSubmit = () => {
    console.log(customer);

    let errors = checkCustomerFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following customer? \n" +
            "Customer Name :" + customer.cust_fullname + "\n"+
            "Customer NIC : " + customer.cust_nic
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/customer_details/insert", "POST", customer);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshCustomerTable();
                refreshCustomerForm();
                 $("#modalCustomerForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// customer form reset event function
const buttonCustomerReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshCustomerForm();
    }
}

const checkCustomerFormUpdate = () => {
    let updates = "";
    if (customer != null && oldCustomer != null) {

        if (customer.cust_fullname != oldCustomer.cust_fullname) {
            updates = updates + "Full name has changed \n";
        }
        if (customer.cust_nic != oldCustomer.cust_nic) {
            updates = updates + "NIC has changed \n";
        }
        if (customer.cust_email != oldCustomer.cust_email) {
            updates = updates + "Email has changed \n";
        }
        if (customer.cust_mobileno != oldCustomer.cust_mobileno) {
            updates = updates + "Mobile number has changed \n";
        }
        if (customer.customer_status_id.name != oldCustomer.customer_status_id.name) {
            updates = updates + "Customer status has changed \n";
        }
        if (customer.cust_address != oldCustomer.cust_address) {
            updates = updates + "Address has changed \n";
        }    
    }
    return updates;
}

//customer form update event function
const buttonCustomerUpdate = () => {
    console.log(customer);

    let errors = checkCustomerFormError();

    if (errors == "") {

        let updates = checkCustomerFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following customer changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/customer_details/update", "PUT", customer);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshCustomerTable();
                    refreshCustomerForm();
                    $("#modalCustomerForm").modal("hide");

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























