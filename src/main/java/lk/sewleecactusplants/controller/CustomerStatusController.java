package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.CustomerStatusDao;
import lk.sewleecactusplants.entityfiles.CustomerStatus;

@RestController //to get return UI
public class CustomerStatusController {

    @Autowired //generate DesignationDao instance
    private CustomerStatusDao customerStatusDao ;
    

    //request mapping to load designation all data [URL --->/customer_status/alldata]
    @GetMapping(value = "/customer_status/alldata" , produces = "application/json")
    public List<CustomerStatus> findAllData(){
        return customerStatusDao.findAll();
    }

}
