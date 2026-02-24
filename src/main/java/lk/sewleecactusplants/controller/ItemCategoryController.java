package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.ItemCategoryDao;
import lk.sewleecactusplants.entityfiles.ItemCategory;

@RestController //to get return UI
public class ItemCategoryController {

    @Autowired //generate ItemCategoryDao instance
    private ItemCategoryDao itemCategoryDao ;
    

    //request mapping to load item category all data [URL --->/item_category/alldata]
    @GetMapping(value = "/item_category/alldata" , produces = "application/json")
    public List<ItemCategory> findAllData(){
        return itemCategoryDao.findAll();
    }

}
