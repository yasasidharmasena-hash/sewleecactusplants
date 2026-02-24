package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.PurchaseOrderHasItemDao;
import lk.sewleecactusplants.entityfiles.PurchaseOrderHasItem;

@RestController //to get return UI
public class PurchaseOrderHasItemController {

    @Autowired //generate DesignationDao instance
    private PurchaseOrderHasItemDao purchaseOrderHasItemDao   ;
    

    //request mapping to load designation all data [URL --->/pricelist_has_item_details/alldata]
    @GetMapping(value = "/purchaseorder_details_has_item_details/alldata" , produces = "application/json")
    public List<PurchaseOrderHasItem> findAllData(){
        return purchaseOrderHasItemDao.findAll();
    }

    //get a PurchaseOrderHasItem by item ID and purchase order ID[URL --->/purchaseorder_details_has_item_details/byitempurchaseorder?itemid=1&podid=2]
    @GetMapping(value = "/purchaseorder_details_has_item_details/byitempurchaseorder", params = {"itemid" , "podid"} , produces = "application/json")
    public PurchaseOrderHasItem getByPoId(@RequestParam("itemid") Integer itemid , @RequestParam("podid") Integer podid){
        return purchaseOrderHasItemDao.getByPurchaseOrderItem(itemid, podid);
    }



}
