package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.SupplierStatusDao;
import lk.sewleecactusplants.entityfiles.SupplierStatus;

@RestController //to get return UI
public class SupplierStatusController {

    @Autowired //generate supplierStatusDao instance
    private SupplierStatusDao supplierStatusDao   ;
    

    //request mapping to load item status all data [URL --->/supplier_status/alldata]
    @GetMapping(value = "/supplier_status/alldata" , produces = "application/json")
    public List<SupplierStatus> findAllData(){
        return supplierStatusDao.findAll();
    }

}
