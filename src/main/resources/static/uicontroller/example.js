//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call item table refresh function
    refreshPriceListTable();

    //call refresh form function
    refreshPriceListForm();

});

//refersh table area
const refreshPriceListTable = () => {

    //create array
    const pricelists = getServiceRequest("pricelist/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: "pricelist_number", dataType: "string" },
        { propertyName: "getSuppName", dataType: "string" },
        { propertyName: "received_date", dataType: "string" },
        { propertyName: "valid_date", dataType: "string" },
        { propertyName: getItemsList, dataType: "function" },
        { propertyName: "purchase_price", dataType: "decimal" },
        { propertyName: getPriceListStatus, dataType: "function" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, printFunction, buttonVisibility)
    fillDataIntoTable(tablePriceListBody, pricelists, propertyList, priceListFormRefill, priceListDelete, priceListView, buttonVisibility = true);

    $('#tablePriceList').DataTable();

}

//define getSuppName function (propertyList)
const getSuppName = (ob) => {
     if (ob.supplier_details_id != null) {
        return ob.supplier_details_id.sup_name;
    } else {
        return "-";
    }
}

//define getItemsList function (propertyList)
const getItemsList = (ob) => {
      let items = "";
    for (const index in ob.priceReceivedItems) {
        if (index == ob.priceReceivedItems.length - 1) {
           items = items + ob.priceReceivedItems[index].itemname;
            
        }else 
            items = items + ob.priceReceivedItems[index].itemname + ", ";
    }

    return items;
}

//define getPriceListStatus function (propertyList)
const getPriceListStatus = (ob) => {
    if (ob.pricelist_status_id.name == "Valid") {
        return "<button type='button' class='btn btn-success'></button><br>" + ob.pricelist_status_id.name;
    }

    if (ob.pricelist_status_id.name == "Invalid") {
        return "<button type='button' class='btn btn-warning'></button><br>" + ob.pricelist_status_id.name;
    }

    if (ob.pricelist_status_id.name == "Removed") {
        return "<button type='button' class='btn btn-danger'></button><br>" + ob.pricelist_status_id.name;
    }
}

//function define for refill form (update(form)/ edit(table))
const priceListFormRefill = (ob) => {

    //to get 2 diffrence values (previous value and new value)
    pricelist = JSON.parse(JSON.stringify(ob));
    oldPricelist = JSON.parse(JSON.stringify(ob));

    textItemName.value = ob.itemname;

    
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

//function define for delete record
const priceListDelete = (dataOb) => {
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

//function define for print record 
const priceListView = (ob, index) => {
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
const buttonPriceListPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableItemView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}


/*  --------Form Functions--------  */

//define function for refresh form (submit)
const refreshPriceListForm = () => {

    formPriceList.reset();

    //create new object
    pricelist = new Object();

    let suppliers = getServiceRequest("/supplier_details/alldata");
    let priceRequestCodes = getServiceRequest("/pricerequest/alldata");
   
    let priceListStatuses = getServiceRequest("/pricelist_status/alldata");

    fillDataIntoSelect(selectSupplier, "Select Price Request Code", suppliers, "sup_name");
   fillDataIntoSelect(selectPriceRequestCode, "Select Price Request Code", priceRequestCodes, "request_code");
    fillDataIntoSelect(selectPriceListStatus, "Select Price List Status", priceListStatuses, "name");

    //set default colors
    setDefault([selectSupplier, selectPriceRequestCode, dteReceivedDate, dteValidDate, selectPriceListStatus,textNote]);

    buttonSubmit.removeAttribute("style");
    buttonUpdate.style.display = "none";

    refreshPriceListInnerForm();
}



//function define for refresh inner form
const refreshPriceListInnerForm =()=> {

    priceListHasItem = new Object();

    let items = getServiceRequest("/item_details/alldata");
    fillDataIntoSelectTwo(selectItem, "Select Item", items, "itemcode","itemname");

    textPurchasePrice.value = "";

    //set default colors
    setDefault([selectItem, textPurchasePrice]);

    buttonInnerPriceListAdd.removeAttribute("style");
    buttonInnerPriceListUpdate.style.display = "none";


    //function define for refresh inner table

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: getItemNames, dataType: "function"},
        { propertyName: "purchase_price", dataType: "string"}  
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList, refillFunction, deleteFunction, buttonVisibility)
    fillDataIntoInnerTable(tableInnerPriceListBody, pricelist.priceListHasItemList, propertyList, priceListHasItemFormRefill, priceListHasItemDelete, buttonVisibility = true);

    $('#tableInnerPriceList').DataTable();

} 

//define getItemNames function (propertyList --- inner)
const getItemNames = (ob) => {
    return ob.item_details_id.itemname;
}

const priceListHasItemFormRefill = (ob) => {}
const priceListHasItemDelete = (ob) => {}

const buttonInnerPriceListAdd = (ob) => {
    console.log(priceListHasItem);

    pricelist.priceListHasItemList.push(priceListHasItem);
    refreshPriceListInnerForm();
}

const buttonInnerPriceListUpdate = (ob) => {}

const checkPriceListFormError = () => {

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

// form submit event function
const buttonPriceListSubmit = () => {
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

            } else {
                window.alert("Failed to submit, following errors occurred: \n" + postResponce);
            }
        }
    } else {
        window.alert("Form has following errors: \n" + errors);
    }

}

// form reset event function
const buttonPriceListReset = () => {

    let userConfirm = window.confirm("Are you sure you want to reset following form? ");

    if (userConfirm) {
        refreshItemForm();
    }
}

const checkPriceListFormUpdate = () => {
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

// form update event function
const buttonPriceListUpdate = () => {
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