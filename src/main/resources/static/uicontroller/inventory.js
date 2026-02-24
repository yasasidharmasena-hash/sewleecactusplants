//create browser load event
window.addEventListener("load", () => {
    console.log("browser load event");

    //enable tooltip
    $('[data-bs-toggle="tooltip"]').tooltip();

    //call table refresh function
    refreshInventoryTable();

});

//refersh table area
const refreshInventoryTable = () => {

    //create array
    const inventories = getServiceRequest("/inventory_details/alldata");

    //column List
    //data types
    //string ---> string / date / number
    //function ---> object / array / boolean
    //decimal =>

    let propertyList = [
        { propertyName: getItemName, dataType: "function" },
        { propertyName: "retailprice", dataType: "decimal" },
        { propertyName: "costprice", dataType: "decimal" },
        { propertyName: "total_qty", dataType: "string" },
        { propertyName: "damaged_qty", dataType: "string" },
        { propertyName: "available_qty", dataType: "string" },
    ];

    //call fillDataIntoTable function (tableBodyId, dataList, columnsList,printFunction, buttonVisibility)
    fillDataIntoTableTwo(tableInventoryBody, inventories, propertyList, inventoryView, buttonVisibility = true);

    $('#tableInventory').DataTable();

}

//define getItemName function (propertyList)
const getItemName = (ob) => {
    return ob.item_details_id.itemname;
}

//function define for print record 
const inventoryView = (ob, index) => {
    console.log("View", ob, index);

    tdItemName.innerText = getItemName(ob);
    tdRetail.innerText = ob.retailprice;
    tdCost.innerText = ob.costprice;
    tdTotalQty.innerText = ob.total_qty;
    tdDamageQty.innerText = ob.damaged_qty;
    tdAvailableQty.innerText = ob.available_qty;

    $("#modalInventoryView").modal("show");
}

// Print button on printmodal
const buttonInventoryPrint = () => {
    let newWindow = window.open();
    let printView = "<head><title>SEWLEE CACTUS PLANTS</title><link rel='stylesheet' href='bootstrap-5.2.3/css/bootstrap.min.css'></head>" + "<body>" + tableInventoryView.outerHTML + "</body>";
    newWindow.document.write(printView);

    setTimeout(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 500)
}

// Call when modal is shown
document.getElementById('modalInventoryView').addEventListener('shown.bs.modal', setCurrentDateTime);

