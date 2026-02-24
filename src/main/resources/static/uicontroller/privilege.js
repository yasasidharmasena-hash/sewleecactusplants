// 2-a. browser load event handler
window.addEventListener("load", () => {

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call privilege refresh table function
    refreshPrivilegeTable();

    //call refresh form function
    refreshPrivilegeForm();

});

// 2-b. Create table refresh function
const refreshPrivilegeTable = () => {

    // 2-b-i. create array 
    let privileges = getServiceRequest("/privilege_details/alldata");

    // 2-b-ii. column list 
    //function ---> object / array / boolean
    //role & module ---object
    //select, insert, update, delete --- boolean
    let columns = [
        { propertyName: getRole, dataType: "function" },
        { propertyName: getModule, dataType: "function" },
        { propertyName: getSelect, dataType: "function" },
        { propertyName: getInsert, dataType: "function" },
        { propertyName: getUpdate, dataType: "function" },
        { propertyName: getDelete, dataType: "function" },
    ];


    // 2-b-iii. fill data into table function
    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tablePrivilegeBody, privileges, columns, privilegeFormRefill, privilegeDelete, privilegeView, buttonVisibility = true);

    $('#tablePrivilege').DataTable();

}

//define functions (column list)
const getRole = (ob) => { return ob.role_id.name; }
const getModule = (ob) => { return ob.modules_id.name; }

const getSelect = (ob) => {
    if (ob.privilege_select) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
}

const getInsert = (ob) => {
    if (ob.privilege_insert) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
}

const getUpdate = (ob) => {
    if (ob.privilege_update) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
}

const getDelete = (ob) => {
    if (ob.privilege_delete) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
}

//function define for refill employee form (update)
const privilegeFormRefill = (ob, rowIndex) => {
    
    privilege = JSON.parse(JSON.stringify(ob));
    oldprivilege = JSON.parse(JSON.stringify(ob));

    selectRole.value = JSON.stringify(ob.role_id);
    selectModule.value = JSON.stringify(ob.modules_id);


    if (ob.privilege_select) {
        chkBoxSelect.checked = true;
        labelSelect.innerText = "Select privilege Granted";
    } else {
        chkBoxSelect.checked = false;
        labelSelect.innerText = "Select privilege Not Granted";
    }

    if (ob.privilege_insert) {
        chkBoxInsert.checked = true;
        labelInsert.innerText = "Insert privilege Granted";
    } else {
        chkBoxInsert.checked = false;
        labelInsert.innerText = "Insert privilege Not Granted";
    }

    if (ob.privilege_update) {
        chkBoxUpdate.checked = true;
        labelUpdate.innerText = "Update privilege Granted";
    } else {
        chkBoxUpdate.checked = false;
        labelUpdate.innerText = "Update privilege Not Granted";
    }

    if (ob.privilege_delete) {
        chkBoxDelete.checked = true;
        labelDelete.innerText = "Delete privilege Granted";
    } else {
        chkBoxDelete.checked = false;
        labelDelete.innerText = "Delete privilege Not Granted";
    }

    $("#modalPrivilegeForm").modal("show");

    buttonSubmit.style.display="none";
    buttonUpdate.removeAttribute("style");

}

//function define for delete privilege record
const privilegeDelete = (ob, rowIndex) => {

    let userConfirm = window.confirm(
        "Are you sure you want to delete following privilege? \n" +
        "Role : " + ob.role_id.name + "\n" +
        "Module : " + ob.modules_id.name
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/privilege_details/delete", "DELETE", ob) ;
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshPrivilegeTable();
             refreshPrivilegeForm(); //refresh form
             $("#modalPrivilegeForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for view / print privilege form
const privilegeView = (ob, index) => {
    console.log("View", ob, index);

    tdRolename.innerText = ob.role_id.name ;
    tdModulename.innerText = ob.modules_id.name ;
    tdSelectprivilege.innerText = getSelect(ob);
    tdInserttprivilege.innerText = getInsert(ob) ;
    tdUpdateprivilege.innerText = getUpdate(ob) ;
    tdDeleteprivilege.innerText = getDelete(ob) ;

    $("#modalPrivilegeView").modal("show");
}

// Print button on printmodal
const buttonPrivilegePrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>Sewlee Cactus Plants</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tablePrivilegeView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalPrivilegeView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshPrivilegeForm = () => {

    privilege = new Object();

    roles = getServiceRequest("/role/alldata");;
    modules = getServiceRequest("/modules/alldata");;

    fillDataIntoSelect(selectRole, "Please select a role", roles, "name");

    fillDataIntoSelect(selectModule, "Please select a module", modules, "name");

    chkBoxSelect.checked = false;
    privilege.privilege_select = false;
    labelSelect.innerText = "Select privilege Not Granted";

    chkBoxInsert.checked = false;
    privilege.privilege_insert = false;
    labelInsert.innerText = "Insert privilege Not Granted";

    chkBoxUpdate.checked = false;
    privilege.privilege_update = false;
    labelUpdate.innerText = "Update privilege Not Granted";

    chkBoxDelete.checked = false;
    privilege.privilege_delete = false;
    labelDelete.innerText = "Delete privilege Not Granted";


    selectRole.style.border = "1px solid #ced4da";
    selectModule.style.border = "1px solid #ced4da";

    //selectRole.classList.remove("is-valid");
    //selectRole.classList.remove("is-invalid");

    buttonSubmit.removeAttribute ("style");
    buttonUpdate.style.display = "none";

    
}

const checkPrivilegeFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (privilege.role_id == null) {
        errors = errors + "Please select a role\n";
    }
    if (privilege.modules_id == null) {
        errors = errors + "Please select a module\n";
    }

    return errors;
}

//function define for submit Button
const buttonPrivilegeSubmit = () => {
    console.log(privilege);

    let errors = checkPrivilegeFormError();
    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following privilege? \n" +
            "Role is : " + privilege.role_id.name + "\n" +
            "Module is : " + privilege.modules_id.name + "\n" +
            "Select is : " + getSelect(privilege) + "\n" +
            "Insert is : " + getInsert(privilege) + "\n" +
            "Update is : " + getUpdate(privilege) + "\n" +
            "Delete is : " + getDelete(privilege)
        );
        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/privilege_details/insert", "POST", privilege) ;
            if (postResponce == "OK") {
                window.alert("Saved successfully");
                refreshPrivilegeForm();
                refreshPrivilegeTable();
                $("#modalPrivilegeForm").modal("hide");
            } else {
                window.alert("Failed to submit, following errors occurred:\n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors:\n" + errors);
    }

    
}

// user form reset event function
const buttonPrivilegeReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshPrivilegeForm();
    }
}

const checkPrivilegeFormUpdate= ()=> {
    let updates = "";

    if (privilege != null && oldprivilege !=null) {

        if (privilege.role_id.name != oldprivilege.role_id.name) {
            updates = updates + "Role has changed \n";
        }

        if (privilege.modules_id.name != oldprivilege.modules_id.name) {
            updates = updates + "Module has changed\n";
        }

        if (privilege.privilege_select != oldprivilege.privilege_select) {
            updates = updates + "Select privilege has changed \n";
        }

        if (privilege.privilege_insert != oldprivilege.privilege_insert) {
            updates = updates + "Insert privilege has changed\n";
        }

        if (privilege.privilege_update != oldprivilege.privilege_update) {
            updates = updates + "Update privilege has changed \n";
        }

        if (privilege.privilege_delete != oldprivilege.privilege_delete) {
            updates = updates + "Delete privilege has changed \n";
        }
   
    }
    return updates;
}

//function define for update privilege record
const buttonPrivilegeUpdate = () => {

    let errors = checkPrivilegeFormError();

    if (errors == "") {
        let updates = checkPrivilegeFormUpdate();
        if (updates == "") {
            window.alert("Form has nothing to update\n");
        } else {
           let userConfirm = window.confirm("Are you sure you want to update following privilege? \n" + updates); 
           if (userConfirm) {
            let putResponce = getHTTPServiceRequest("/privilege_details/update", "PUT", privilege);
            if (putResponce =="OK") {
                alert("Updated successfully");
                refreshPrivilegeForm();
                refreshPrivilegeTable();
                $("#modalPrivilegeForm").modal("hide");
            } else {
                window.alert("Failed to update, following errors occurred:\n" + putResponce);
            }
           }
        }
    } else {
        window.alert("Form has following errors:\n" + errors);
    }
}