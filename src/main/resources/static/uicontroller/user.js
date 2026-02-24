//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call user table refresh function
    refreshUserTable();

    //call refresh form function
    refreshUserForm();

});

//refersh user table area
const refreshUserTable = () => {

    //create array
    const users = getServiceRequest("/user_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean

    let propertyList = [
        { propertyName: getEmployee, dataType: "function" },
        { propertyName: "username", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: getUserRole, dataType: "function" },
        { propertyName: getUserStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tableUserBody, users, propertyList, userFormRefill, userDelete, userView, buttonVisibility = true);

    $('#tableUser').DataTable();


}

//define getEmployee function (propertyList)
const getEmployee = (ob) => {
    if (ob.employee_details_id != null) {
        return ob.employee_details_id.fullname;
    } else {
        //return ob.supplier_details_id.fullname;
        return "-";
    }
}

//define getUserRole function (propertyList)
const getUserRole = (ob) => {
    let roles = "";
    ob.roles.forEach((role, index) => {
        if (ob.roles.length - 1 == index) {
            roles = roles + role.name;
        } else {
            roles = roles + role.name + ",";
        }
    });

    return roles;
}

//define getUserStatus function (propertyList)
const getUserStatus = (ob) => {
    if (ob.status) {
        return "Active";
    } else {
        return "Inactive";
    }
}

//function define for refill user form (update)
const userFormRefill = (ob) => {

    user = JSON.parse(JSON.stringify(ob));
    oldUser = JSON.parse(JSON.stringify(ob));

    let employees = getServiceRequest("/employee_details/alldata");
    fillDataIntoSelect(selectEmployee, "Select Employee", employees, "fullname");
    selectEmployee.disabled = true;

    selectEmployee.value = JSON.stringify(user.employee_details_id);

    if (user.status) {
        chkBoxUserStatus.checked = "checked";
        lableUserStatus.innerText = "User Account is Active";
    } else {
        chkBoxUserStatus.checked = "";
        lableUserStatus.innerText = "User Account is Inactive";
    }

    textUserName.value = user.username;
    textEmail.value = user.email;

    if (user.note = null || user.note != undefined) {
        textNote.value = user.note;
    } else {
        textNote.value = "";
    }

    textPassword.disabled = true;
    textConfirmPassword.disabled = true;


    let roles = getServiceRequest("/role/withoutadmin");

    let divRole = document.querySelector("#divRoles");
    divRole.innerHTML = "";

    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";


        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.id = role.id;
        inputCheck.className = "form-check-input";


        inputCheck.onclick = () => {
            console.log(inputCheck);

            if (inputCheck.checked) {
                console.log("cccc");
                user.roles.push(role);
            } else {
                console.log("bbbb");
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
        if (extIndex != -1) {
            inputCheck.checked = true;
        }

        div.appendChild(inputCheck);

        let label = document.createElement("label");
        label.className = "form-check-lable fw-bold";
        label.innerText = role.name;
        div.appendChild(label);

        divRole.appendChild(div);

    });

    $("#modalUserForm").modal("show");

    buttonSubmit.style.display="none";
    buttonUpdate.removeAttribute("style");
}

//function define for delete user record
const userDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following user? \n"
        + "User Name : " + dataOb.username + "\n"
        + "User Email : " + dataOb.email
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/user_details/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshUserTable();
            refreshUserForm(); //refresh form
            $("#modalUserForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print user record 
const userView = (ob, index) => {
     console.log("View", ob, index);

    tdEmployeename.innerText = ob.employee_details_id.fullname;
    tdUsername.innerText = ob.username;
    tdUserEmail.innerText = ob.email;
    tdUserRoles.innerText = getUserRole(ob);
    tdUserStatus.innerText = ob.status;

    $("#modalUserView").modal("show");
}

// Print button on printmodal
const buttonUserPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>Sewlee Cactus Plants</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableUserView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalUserView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshUserForm = () => {

    formUser.reset();

    user = new Object();
    user.roles = new Array();
    oldUser = null;

    let employees = getServiceRequest("/employee_details/withoutuseraccount");
    fillDataIntoSelect(selectEmployee, "Select Employee", employees, "fullname");

    chkBoxUserStatus.checked = "checked";
    lableUserStatus.innerText = "User Account is Active";
    user.status = true;

    let roles = getServiceRequest("/role/withoutadmin");

    let divRole = document.querySelector("#divRoles");
    divRole.innerHTML = "";

    roles.forEach((role, index) => {
        let div = document.createElement("div");
        div.className = "form-check form-check-inline";


        let inputCheck = document.createElement("input");
        inputCheck.type = "checkbox";
        inputCheck.id = role.id;
        inputCheck.className = "form-check-input";


        inputCheck.onclick = () => {
            console.log(inputCheck);

            if (inputCheck.checked) {
                console.log("cccc");
                user.roles.push(role);
            } else {
                console.log("bbbb");
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
        }

        div.appendChild(inputCheck);

        let label = document.createElement("label");
        label.className = "form-check-lable fw-bold";
        label.innerText = role.name;
        div.appendChild(label);

        divRole.appendChild(div);

    });

    selectEmployee.disabled = false;
    textPassword.disabled = false;
    textConfirmPassword.disabled = false;

    setDefault([selectEmployee, textUserName, textEmail, textPassword, textConfirmPassword, textNote]);

    buttonSubmit.removeAttribute ("style");
    buttonUpdate.style.display = "none";

}

//define passwordValidator()-----Confirm password record
const passwordValidator = () => {

    if (textPassword.value === textConfirmPassword.value) {
        user.password = textPassword.value;
        textConfirmPassword.style.border = "2px solid green";
    } else {
        user.password = null;
        textConfirmPassword.style.border = "2px solid red";
    }
}

const checkUserFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (user.username == null) {
        errors = error + "Please enter a username \n";
    }

    if (user.roles.length == 0) {
        errors = errors + "Please select a role \n";
    }

    if (user.email == null) {
        errors = errors + "Please enter an email \n";
    }

    if (user.password == null) {
        errors = errors + "Please enter a passwaord \n";
    }

    if (oldUser == null) {
        if (textConfirmPassword.value == "") {
            errors = errors + "Please re enter a password \n";
        }
    }

    return errors;
}

// user form submit event function
const buttonUserSubmit = () => {
    console.log(user);

    let errors = checkUserFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following user? \n " +
            "Username :" + user.username + "\n" +
            "Email : " + user.email
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/user_details/insert", "POST", user);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshUserTable();
                refreshUserForm();
                $("#modalUserForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// user form reset event function
const buttonUserReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshUserForm();
    }
}

const checkUserFormUpdate = () => {
    let updates = "";
    if (user != null && oldUser != null) {

        if (user.username != oldUser.username) {
            updates = updates + "Username has changed \n";
        }
        if (user.email != oldUser.email) {
            updates = updates + "Email has changed \n";
        }
        if (user.note != oldUser.note) {
            updates = updates + "Note has changed \n";
        }
        if (user.roles.length != oldUser.roles.length) {
            updates = updates + "Role has changed \n";
        }
        if (user.status != oldUser.status) {
            updates = updates + "Status has changed \n";
        }
    }
    return updates;
}

//user form update event function
const buttonUserUpdate = () => {
    console.log(user);

    let errors = checkUserFormError();

    if (errors == "") {

        let updates = checkUserFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following user changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/user_details/update", "PUT", user);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshUserTable();
                    refreshUserForm();
                    $("#modalUserForm").modal("hide");

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