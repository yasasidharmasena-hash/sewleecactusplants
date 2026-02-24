//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call item table refresh function
    refreshItemTable();

    //call refresh form function
    refreshItemForm();

});

//refersh item table area
const refreshItemTable = () => {

    //create array
    const items = getServiceRequest("/item_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "itemcode", dataType: "string" },
        { propertyName: "itemname", dataType: "string" },
        { propertyName: "retailprice", dataType: "decimal" },
        { propertyName: "costprice", dataType: "decimal" },
        //{ propertyName: "itemphoto", dataType: "string" },
        { propertyName: getItemStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tableItemBody, items, propertyList, itemFormRefill, itemDelete, itemView, buttonVisibility = true);

    $('#tableItem').DataTable();

}

//define getItemStatus function (propertyList)
const getItemStatus = (ob) => {
    if (ob.item_status_id.name == "Available") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.item_status_id.name;
    }

    if (ob.item_status_id.name == "Unavailable") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.item_status_id.name;
    }

    if (ob.item_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.item_status_id.name;
    }
}

//function define for generate retail price
const generateRetailPrice = ()=> {
    let profitratio = textProfitratio.value;
    let costPrice = textCostPrice.value;
    let retailPrice =parseFloat(costPrice) + (parseFloat(costPrice)*parseFloat(profitratio)/100);

    textRetailPrice.value = parseFloat(retailPrice).toFixed(2);
    item.retailprice = textRetailPrice.value;
    textRetailPrice.style.border = "2px solid green";
}

//function define for refill item form (update(form)/ edit(table))
const itemFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    item = JSON.parse(JSON.stringify(ob));
    oldItem = JSON.parse(JSON.stringify(ob));

    textItemName.value = ob.itemname;

    //item category
    selectItemCategory.value = JSON.stringify(ob.item_subcategory_id.item_category_id);
    let category = JSON.parse(selectItemCategoryElement.value);
    let subcategoriesByCategories = getServiceRequest("/item_subcategory/byitemcategory?categoryid=" + category.id);
    fillDataIntoSelect(selectItemSubcategory, "Select Subcategory", subcategoriesByCategories, "name");

    //item subcategory is a dynamic component
    selectItemSubcategory.value = JSON.stringify(ob.item_subcategory_id);

    textUnitize.value = ob.unitize;

    //item status is a dynamic component
    selectItemStatus.value = JSON.stringify(ob.item_status_id);

    textRop.value = ob.reorderpoint;
    textRoq.value = ob.reorderqty;
    textProfitratio.value = ob.profitratio;
    textDiscountratio.value = ob.discountratio;
    textCostPrice.value = ob.costprice;
    textRetailPrice.value = ob.retailprice;

    //textItemImage.value = ob.itemphoto;

    //Note is an optional component----can use undefined
    if (ob.note == undefined) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    $("#modalItemForm").modal("show");

    buttonSubmit.style.display = "none";
    buttonUpdate.removeAttribute("style");

}

//function define for delete item record
const itemDelete = (dataOb) => {
    let userConfirm = window.confirm("Are you sure you want to delete following item? \n"
        + "Item Code : " + dataOb.itemcode + "\n"
        + "Item Name : " + dataOb.itemname
    );

    if (userConfirm) {
        let deleteResponce = getHTTPServiceRequest("/item_details/delete", "DELETE", dataOb);
        if (deleteResponce == "OK") {
            window.alert("Deleted successfully");
            refreshItemTable();
            refreshItemForm(); //refresh form
            $("#modalItemForm").modal("hide");
        } else {
            window.alert("Failed to delete, following errors occurred: \n" + deleteResponce);
        }
    }
}

//function define for print item record 
const itemView = (ob, index) => {
    console.log("View", ob, index);

    tdItemCode.innerText = ob.itemcode;
    tdItemName.innerText = ob.itemname;
    tdItemCategory.innerText = ob.item_subcategory_id.item_category_id.name;
    tdItemSubcategory.innerText = ob.item_subcategory_id.name;
    tdRetailPrice.innerText = ob.retailprice;
    tdCostPrice.innerText = ob.costprice;
    tdProfitRatio.innerText = ob.profitratio;
    tdDiscountRatio.innerText = ob.discountratio;
    tdReorderpoint.innerText = ob.reorderpoint;
    tdReorderqty.innerText = ob.reorderqty;
    //tdItemImage.innerHTML = ob.itemphoto;
    tdItemStatus.innerText = ob.item_status_id.name;

    $("#modalItemView").modal("show");
}

// Print button on printmodal
const buttonItemPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableItemView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalItemView').addEventListener('shown.bs.modal', setCurrentDateTime);


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshItemForm = () => {

    formItem.reset();

    //create new object
    item = new Object();

    let categories = getServiceRequest("/item_category/alldata");
    let subcategories = getServiceRequest("/item_subcategory/alldata");
    let itemStatuses = getServiceRequest("/item_status/alldata");

    fillDataIntoSelect(selectItemCategory, "Select Category", categories, "name");
    fillDataIntoSelect(selectItemSubcategory, "Select Subcategory", subcategories, "name");
    fillDataIntoSelect(selectItemStatus, "Select Item Status", itemStatuses, "name");

    //set default colors
    setDefault([textItemName, selectItemCategory, selectItemSubcategory, textUnitize, selectItemStatus, 
        textRop, textRoq, textProfitratio, textDiscountratio, textCostPrice, textRetailPrice, textNote]);

    buttonSubmit.removeAttribute("style");
    buttonUpdate.style.display = "none";
}

//item category validation
let selectItemCategoryElement = document.querySelector("#selectItemCategory");
selectItemCategoryElement.addEventListener("change", () => {
    let category = JSON.parse(selectItemCategoryElement.value);
    selectItemCategoryElement.style.border = "2px solid green";

    //auto-fill item name based on category
    //textItemName.value = category.name;

    //filter subcategories for the selected category
    let subcategoriesByCategories = getServiceRequest("/item_subcategory/byitemcategory?categoryid=" + category.id);
    fillDataIntoSelect(selectItemSubcategory, "Select Subcategory", subcategoriesByCategories, "name");

});

const checkItemFormError = () => {

    //Need to check all required properties
    let errors = "";

    if (item.itemname == null) {
        errors = errors + "Please enter an item name \n";
    }

    if (selectItemCategory.value == "") {
        errors = errors + "Please select an item category \n";
    }

     if (item.item_subcategory_id == null) {
        errors = errors + "Please select an item subcategory \n";
    }

    if (item.unitize == null) {
        errors = errors + "Please enter an unitize \n";
    }

    if (item.item_status_id == null) {
        errors = errors + "Please select an item status \n";
    }

    if (item.costprice == null) {
        errors = errors + "Please enter a cost price \n";
    }

    if (item.retailprice == null) {
        errors = errors + "Please enter a retail price \n";
    }

    if (item.reorderpoint == null) {
        errors = errors + "Please enter a re-order point \n";
    }

    if (item.reorderqty == null) {
        errors = errors + "Please enter a re-order qty \n";
    }

    if (item.profitratio == null) {
        errors = errors + "Please enter a profit ratio \n";
    }

    if (item.discountratio == null) {
        errors = errors + "Please enter a discount ratio \n";
    }

    return errors;
}

// item form submit event function
const buttonItemSubmit = () => {
    console.log(item);

    let errors = checkItemFormError();

    if (errors == "") {
        let userConfirm = window.confirm("Are you sure you want to submit following item? \n" +
            "Item Name :" + item.itemname + "\n"+
            "Item Category : " + item.item_subcategory_id.item_category_id.name
        );

        if (userConfirm) {
            let postResponce = getHTTPServiceRequest("/item_details/insert", "POST", item);
            if (postResponce == "OK") {
                window.alert("Submitted successfully");

                refreshItemTable();
                refreshItemForm();
                 $("#modalItemForm").modal("hide");

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// item form reset event function
const buttonItemReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshItemForm();
    }
}

const checkItemFormUpdate = () => {
    let updates = "";
    if (item != null && oldItem != null) {

        if (item.itemname != oldItem.itemname) {
            updates = updates + "Item name has changed \n";
        }
        if (item.item_subcategory_id.item_category_id.name != oldItem.item_subcategory_id.item_category_id.name) {
            updates = updates + "Item category has changed \n";
        }
        if (item.item_subcategory_id.name != oldItem.item_subcategory_id.name) {
            updates = updates + "Item subcategory has changed \n";
        }
        if (item.unitize != oldItem.unitize) {
            updates = updates + "Unitize has changed \n";
        }
        if (item.item_status_id.name != oldItem.item_status_id.name) {
            updates = updates + "Item status has changed \n";
        }
        if (item.costprice != oldItem.costprice) {
            updates = updates + "Cost price has changed \n";
        }
        if (item.retailprice != oldItem.retailprice) {
            updates = updates + "Retail price has changed \n";
        }
        if (item.reorderpoint != oldItem.reorderpoint) {
            updates = updates + "Re-order point has changed \n";
        }
        if (item.reorderqty != oldItem.reorderqty) {
            updates = updates + "Re-order qty has changed \n";
        }
        if (item.profitratio != oldItem.profitratio) {
            updates = updates + "Profit ratio has changed \n";
        }
        if (item.discountratio != oldItem.discountratio) {
            updates = updates + "Discount ratio has changed \n";
        }
        
    }
    return updates;
}

//item form update event function
const buttonItemUpdate = () => {
    console.log(item);

    let errors = checkItemFormError();

    if (errors == "") {

        let updates = checkItemFormUpdate();

        if (updates != "") {
            let userConfirm = window.confirm("Are you sure you want to update following item changes? \n " + updates
            );
            if (userConfirm) {
                let putResponce = getHTTPServiceRequest("/item_details/update", "PUT", item);
                if (putResponce == "OK") {
                    window.alert("Updated successfully");

                    refreshItemTable();
                    refreshItemForm();
                    $("#modalItemForm").modal("hide");

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