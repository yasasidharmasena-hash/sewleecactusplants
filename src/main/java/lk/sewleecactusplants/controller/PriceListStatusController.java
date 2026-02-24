package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.PriceListStatusDao;
import lk.sewleecactusplants.entityfiles.PriceListStatus;

@RestController //to get return UI
public class PriceListStatusController {

    @Autowired //generate priceListDao instance
    private PriceListStatusDao priceListStatusDao    ;
    

    //request mapping to load price request status all data [URL --->/pricelist_status/alldata]
    @GetMapping(value = "/pricelist_status/alldata" , produces = "application/json")
    public List<PriceListStatus> findAllData(){
        return priceListStatusDao.findAll();
    }

}
