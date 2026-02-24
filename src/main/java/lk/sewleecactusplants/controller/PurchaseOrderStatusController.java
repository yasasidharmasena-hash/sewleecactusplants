package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.PurchaseOrderStatusDao;
import lk.sewleecactusplants.entityfiles.PurchaseOrderStatus;

@RestController //to get return UI
public class PurchaseOrderStatusController {

    @Autowired //generate ItemStatusDao instance
    private PurchaseOrderStatusDao purchaseOrderStatusDao;
    

    //request mapping to load status all data [URL --->/purchaseorder_status/alldata]
    @GetMapping(value = "/purchaseorder_status/alldata" , produces = "application/json")
    public List<PurchaseOrderStatus> findAllData(){
        return purchaseOrderStatusDao.findAll();
    }

}
