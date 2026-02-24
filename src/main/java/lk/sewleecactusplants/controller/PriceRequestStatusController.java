package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.PriceRequestStatusDao;
import lk.sewleecactusplants.entityfiles.PriceRequestStatus;

@RestController //to get return UI
public class PriceRequestStatusController {

    @Autowired //generate priceRequestStatusDao instance
    private PriceRequestStatusDao priceRequestStatusDao ;
    

    //request mapping to load price request status all data [URL --->/price_request_status/alldata]
    @GetMapping(value = "/pricerequest_status/alldata" , produces = "application/json")
    public List<PriceRequestStatus> findAllData(){
        return priceRequestStatusDao.findAll();
    }

}
