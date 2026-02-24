//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call employee table refresh function
    refreshEmployeeTable();

    //call refresh form function
    refreshEmployeeForm();
});

//refresh table area
const refreshEmployeeTable = () => {

    /*let employees = [
        { id: 1, callingname: "Yasasi", fullname: "Yasasi Dharmasena", mobileno: "0719278086", nic: "976191595V", gender: "Female", dob: "1997-04-28", civilstatus: "Single", designation_id: { id: 1, name: "Manager" }, employeestatus_id: { id: 1, name: "Working" } },

        { id: 2, callingname: "Naveen", fullname: "Naveen Perera", mobileno: "0719485686", nic: "956174585V", gender: "Male", dob: "1995-06-20", civilstatus: "Single", designation_id: { id: 2, name: "Asst-Manager" }, employeestatus_id: { id: 1, name: "Working" } },

        { id: 3, callingname: "Nishara", fullname: "Nishara Silva", mobileno: "0752274516", nic: "926132655V", gender: "Female", dob: "1992-03-25", civilstatus: "Married", designation_id: { id: 3, name: "Cashier" }, employeestatus_id: { id: 2, name: "Resign" } }
    ];
    */

    // ajax call
  let employees = [] ;

    $.ajax ({
       url: '/employee_details/alldata', // the URL to which the request is sent
       type: 'GET', //the HTTP method to use for the request (GET, POST, etc.)
       contentType: 'json',
       async: false,
       success: function (response) {
           //code to execute if the request succeeds
           console.log('Success:', response);
           employees = response;
       },
       error: function (xhr, status, error){
           //code to execute if the request fails
           console.log('Error:', error);
          
       }
    });


    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean

    let propertyList = [
        { propertyName: "fullname", dataType: "string" },
        { propertyName: "nic", dataType: "string" },
        { propertyName: "mobile_no", dataType: "string" },
        { propertyName: "dob", dataType: "string" },
        { propertyName: "gender", dataType: "string" },
        { propertyName: "employee_photo", dataType: "image-array"},
        { propertyName: getDesignation, dataType: "function" },
        { propertyName: getEmployeeStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tableEmployeeBody, employees, propertyList, employeeFormRefill, employeeDelete, employeeView, buttonVisibility = true);

    $('#tableEmployee').DataTable();

}

/*const generateBirthYear = (dataOb) => {
    return new Date(dataOb.dob).getFullYear();
}*/

const getDesignation = (dataOb) => {
    return dataOb.designation_id.name;
}

const getEmployeeStatus = (dataOb) => {
    if (dataOb.employee_status_id.name == "Working") {
        return "<button type='button' class='btn btn-success'></button><br>" + dataOb.employee_status_id.name ;
    }

    if (dataOb.employee_status_id.name == "Resign") {
        return "<button type='button' class='btn btn-warning'></button><br>" + dataOb.employee_status_id.name;
    }

    if (dataOb.employee_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + dataOb.employee_status_id.name ;
    }

}

//function define for refill employee form
const employeeFormRefill = (ob, index) => {
    console.log("Edit", ob, index);
    //tableEmployeeBody.children[index].style.backgroundColor = "orange";

    textFullName.value = ob.fullname;

    textCallingName.value = ob.callingname;
    let fullNameParts = textFullName.value.split(" ");
    fullNameParts.forEach(element => {
        let option = document.createElement("option");
        option.value = element;
        //only display name part length which is  > 2 letters
        if (element.length > 2) {
            dlCallingName.appendChild(option);
        }
    });

    textNic.value = ob.nic;
    textEmail.value = ob.email;
    textAddress.value = ob.address;
    dteDOB.value = ob.dob;
    // textEmail.value = ob.email;
    selectCivilStatus.value = ob.civil_status;
    textMobile.value = ob.mobile_no;

    //gender is as radio button
    if (ob.gender == "Male") {
        radioMale.checked = true;
    } else {
        radioFemale.checked = true;
    }

    //land_no is an optional component----can use undefined
    if (ob.land_no == undefined) {
        textLandNo.value = "";
    } else {
        textLandNo.value = ob.land_no;
    }

    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    // Photo is an optional componant --- reset photo
    if (ob.employee_photo != null) {
        imgEmpPhotoPreview.src = atob(ob.employee_photo);
    } else {
        imgEmpPhotoPreview.src = "/images/g1.png";
    }

    //designation is a dynamic component
    selectDesignation.value = JSON.stringify(ob.designation_id);

    //employee status is a dynamic component
    selectEmployeeStatus.value = JSON.stringify(ob.employee_status_id);

    //to get 2 diffrence values (previous value and new value)
    employee = JSON.parse(JSON.stringify(ob));
    oldEmployee = JSON.parse(JSON.stringify(ob));

    $("#modalEmployeeForm").modal("show");

    buttonSubmit.style.display="none";
    buttonUpdate.removeAttribute("style");

}

//function define for delete employee form record
const employeeDelete = (dataOb, index) => {

    
    console.log("Delete", dataOb, index);
 
     //need to get user confirmation
     let userConfirm = window.confirm("Are you sure you want to delete following employee? \n" +
         "Employee Full Name : " + dataOb.fullname + "\n" +
         "Employee NIC : " + dataOb.nic + "\n" +
         "Employee Designation : " + dataOb.designation_id.name);
     if (userConfirm) {
         //call post service
         let deleteResponce = getHTTPServiceRequest("/employee_details/delete", "DELETE", dataOb);
         if (deleteResponce == "OK") {
             window.alert("Deleted successfully");
             refreshEmployeeTable();
             // window.location.reload(); -----reload full browser, it will change UI too
             refreshEmployeeForm(); //refresh form
             $("#modalEmployeeForm").modal("hide");
         } else {
             window.alert("Failed to delete, following errors occurred: \n" + postResponce);
         }
     }
}

//function define for view / print employee form
const employeeView = (ob, index) => {
    console.log("View", ob, index);

    
    tdEmployeeFullname.innerText = ob.fullname;
    tdEmployeeNumber.innerText = ob.employee_no;
    tdEmployeeCallingname.innerText = ob.callingname;
    tdEmployeeNic.innerText = ob.nic;
    tdEmployeeDob.innerText = ob.dob;
    tdEmployeeGender.innerText = ob.gender;
    tdEmployeeMobileno.innerText = ob.mobile_no;
    tdEmployeeDesignation.innerText = ob.designation_id.name;
    tdEmployeeStatus.innerText = ob.employee_status_id.name;

    $("#modalEmployeeView").modal("show");
}

// Print button on printmodal
const buttonEmployeePrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>Sewlee Cactus Plants</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableEmployeeView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalEmployeeView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//refresh form
const refreshEmployeeForm = () => {

    employee = new Object();

    //static element only
    formEmployee.reset();
    fileEmployeePhoto.value = "";
    imgEmpPhotoPreview.src = "/images/g1.png";

    /*dteDOB.value = "";
    textEmail.value = "";
    selectCivilStatus.value = ""*/

    //need to write all static elements
    setDefault([textFullName, textCallingName, textNic, dteDOB, textEmail, selectCivilStatus])

    /* dteDOB.style.border ="1px solid #ced4da";
     textEmail.style.border = "1px solid #ced4da";
     selectCivilStatus.style.border = "1px solid #ced4da";*/



    // ajax call using getServiceRequest ---common function
     let designations = getServiceRequest('/designation/alldata') ;

     /*$.ajax ({
        url: '/designation/alldata', // the URL to which the request is sent
        type: 'GET', //the HTTP method to use for the request (GET, POST, etc.)
        contentType: 'json',
        async: false,
        success: function (response) {
            //code to execute if the request succeeds
            console.log('Success:', response);
            designations = response;
        },
        error: function (xhr, status, error){
            //code to execute if the request fails
            console.log('Error:', error);
           
        }
     });*/

    /*let designations = [{ id: 1, name: "Manager" }, { id: 2, name: "Asst-Manager" }, { id: 3, name: "Cashier" }];*/

    let employeeStatuses = getServiceRequest('/employee_status/alldata') ;

    /*let employeeStatuses = [{ id: 1, status: "Working" }, { id: 2, status: "Resign" }, { id: 3, status: "Removed" }];*/

    fillDataIntoSelect(selectDesignation, "Please select Designation..!", designations, "name");

    fillDataIntoSelect(selectEmployeeStatus, "Please select Status..!", employeeStatuses, "name");

    buttonSubmit.removeAttribute ("style");
    buttonUpdate.style.display = "none";
}

//define fullname validation
textFullName.addEventListener("keyup", () => {
    const fullNameValue = textFullName.value;
    if (fullNameValue != "") {
        if (new RegExp("^([A-Z][a-z]{1,20}[\\s])+([A-Z][a-z]{2,20})$").test(fullNameValue)) {
            //valid fullname
            employee.fullname = fullNameValue;

            textFullName.style.border = "2px solid green";

            let fullNameParts = fullNameValue.split(" ");
            dlCallingName.innerHTML = "";

            textCallingName.value = fullNameParts[0];
            textCallingName.style.border = "2px solid green";
            employee.callingname = textCallingName.value;

            fullNameParts.forEach(element => {
                let option = document.createElement("option");
                option.value = element;
                //only display name part length which is  > 2 letters
                if (element.length > 2) {
                    dlCallingName.appendChild(option);
                }
            });
        } else {
            //invalid fullname
            textFullName.style.border = "2px solid red";
            employee.fullname = null;
        }
    } else {
        //invalid fullname
        textFullName.style.border = "2px solid red";
        employee.fullname = null;
    }
})

//define calling name validation
const callingNameValidator = (callingNameElement) => {
    const callingNameValue = callingNameElement.value;
    const fullNameValue = textFullName.value;
    let fullNameParts = fullNameValue.split(" ");

    //checking calling name value
    if (callingNameValue != "") {
        let extIndex = fullNameParts.map(fullNamepart => fullNamepart).indexOf(callingNameValue);

        if (extIndex != -1) {
            //valid callingname
            callingNameElement.style.border = "2px solid green";
            employee.callingname = textCallingName.value;

        } else {
            //invalid callingname
            callingNameElement.style.border = "2px solid red";
            employee.callingname = null;
        }
    } else {
        //invalid callingname (if the calling name is empty border will be red)
        callingNameElement.style.border = "2px solid red";
        employee.callingname = null;
    }
}

//define NIC validation
const nicValidator = (nicElement) => {
    const nicValue = nicElement.value;

    if (nicValue != "") {
        if (new RegExp("^([98765][0-9]{8}[VvXx])|([1][9][98765][0-9]{9})|([2][0][0][543210][0-9]{8})$").test(nicValue)) {
            //valid NIC
            nicElement.style.border = "2px solid green";
            employee.nic = nicValue;

        } else {
            //invalid NIC
            nicElement.style.border = "2px solid red";
            employee.nic = null;
        }
    } else {
        //invalid NIC
        nicElement.style.border = "2px solid red";
        employee.nic = null;
    }
}

const checkEmployeeFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (employee.fullname == null) {
        errors = errors + "Please enter a valid Full Name\n";
    }
    if (employee.callingname == null) {
        errors = errors + "Please enter a valid calling name\n";
    }
    if (employee.nic == null) {
        errors = errors + "Please enter a valid NIC \n";
    }
    if (employee.gender == null) {
        errors = errors + "Please select a Gender\n";
    }
    if (employee.dob == null) {
        errors = errors + "Please select DOB \n";
    }
    if (employee.email == null) {
        errors = errors + "Please enter a valid email \n";
    }
    if (employee.civil_status == null) {
        errors = errors + "Please select civil status \n";
    }
    if (employee.mobile_no == null) {
        errors = errors + "Please enter a valid mobile no \n";
    }
    if (employee.designation_id == null) {
        errors = errors + "Please select designation \n";
    }
    if (employee.employee_status_id == null) {
        errors = errors + "Please select employee status \n";
    }


    return errors;
}

// Employee form submit event function
const buttonEmployeeSubmit = () => {
    console.log(employee);

    //check form error for required elements 
    let errors = checkEmployeeFormError();
    if (errors == "") {
        //errors not exsite
        //need to get user confirmation
        let userConfirm = window.confirm("Are you sure you want to submit following employee? \n" +
            "Employee Full Name : " + employee.fullname + "\n" +
            "Employee NIC : " + employee.nic + "\n" +
            "Employee Designation : " + employee.designation_id.name);
        if (userConfirm) {
            //call post service
            let postResponce = getHTTPServiceRequest("/employee_details/insert", "POST", employee);
            if (postResponce == "OK") {
                window.alert("Saved successfully");
                refreshEmployeeTable();
                // window.location.reload(); -----reload full browser, it will change UI too
                refreshEmployeeForm(); //refresh form
                $("#modalEmployeeForm").modal("hide");
            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }

    } else {
        window.alert("Form has following errors:\n" + errors);
    }

    console.log(employee);

    refreshEmployeeTable();
}

// employee form reset event function
const buttonEmployeeReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshEmployeeForm();
    }
}

const checkEmployeeFormUpdate = () => {
    let updates = "";

    if (employee != null && oldEmployee != null) {

        if (employee.fullname != oldEmployee.fullname) {
            updates = updates + "Full Name has changed \n";
        }

        if (employee.callingname != oldEmployee.callingname) {
            updates = updates + "Calling Name has changed \n";
        }

        if (employee.nic != oldEmployee.nic) {
            updates = updates + "NIC has changed \n";
        }

        if (employee.dob != oldEmployee.dob) {
            updates = updates + "Date of Birth has changed \n";
        }

        if (employee.mobile_no != oldEmployee.mobile_no) {
            updates = updates + "Mobile no has changed" + oldEmployee.mobile_no + "into" + employee.mobile_no + "\n";
        }

        if (employee.civil_status != oldEmployee.civil_status) {
            updates = updates + "Civil Status has changed \n";
        }

        if (employee.email != oldEmployee.email) {
            updates = updates + "Email has changed \n";
        }

        if (employee.land_no != oldEmployee.land_no) {
            updates = updates + "Land Number has changed \n";
        }

        if (employee.designation_id.name != oldEmployee.designation_id.name) {
            updates = updates + "Designation has changed \n";
        }

        if (employee.employee_status_id.name != oldEmployee.employee_status_id.name) {
            updates = updates + "Employee Status has changed \n";
        }

        if (employee.employee_photo != oldEmployee.employee_photo) {
            updates = updates + "Employee photo has changed \n";
        }
    }

    return updates;
}

//form update event function
const buttonEmployeeUpdate = () => {
    //refreshEmployeeTable();

    //need to check errors firstly
    let errors = checkEmployeeFormError();
    if (errors == "") {
        //need to check form updates
        let updates = checkEmployeeFormUpdate();
        if (updates == "") {
            window.alert("Nothing to update \n");
        } else {
            //if there are updates -- need to get user confirmation
            let userConfirm = window.confirm("Are you sure you want to update following changes?\n" + updates);
            if (userConfirm) {
                //call put service
                let putResponce = getHTTPServiceRequest("/employee_details/update", "PUT", employee);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");
                    refreshEmployeeTable();
                    refreshEmployeeForm();
                    $("#modalEmployeeForm").modal("hide");
                } else {
                    window.alert("Failed to update, following errors occurred:\n" + putResponce);
                }
            }
        }
    } else {
        window.alert("Form has following errors:\n" + errors);
    }
}

