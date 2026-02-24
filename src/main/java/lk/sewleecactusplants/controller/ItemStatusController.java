package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.ItemStatusDao;
import lk.sewleecactusplants.entityfiles.ItemStatus;

@RestController //to get return UI
public class ItemStatusController {

    @Autowired //generate ItemStatusDao instance
    private ItemStatusDao itemStatusDao  ;
    

    //request mapping to load item status all data [URL --->/item_status/alldata]
    @GetMapping(value = "/item_status/alldata" , produces = "application/json")
    public List<ItemStatus> findAllData(){
        return itemStatusDao.findAll();
    }

}
