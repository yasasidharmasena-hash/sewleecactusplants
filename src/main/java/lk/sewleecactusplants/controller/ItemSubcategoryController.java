package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.ItemSubcategoryDao;
import lk.sewleecactusplants.entityfiles.ItemSubcategory;

@RestController //to get return UI
public class ItemSubcategoryController {

    @Autowired //generate ItemSubcategoryDao instance
    private ItemSubcategoryDao itemSubcategoryDao  ;
    

    //request mapping to load item sub category all data [URL --->/item_subcategory/alldata]
    @GetMapping(value = "/item_subcategory/alldata" , produces = "application/json")
    public List<ItemSubcategory> findAllData(){
        return itemSubcategoryDao.findAll();
    }

    //request mapping to load all item sub category data that belong to the item category id [URL --->/item_subcategory/byitemcategory/categoryid=1]
    @GetMapping(value = "/item_subcategory/byitemcategory", params = {"categoryid"} , produces = "application/json")
    public List<ItemSubcategory> byItemCategory(@RequestParam("categoryid") Integer categoryid){
        return itemSubcategoryDao.byItemCategory(categoryid);
    }

}
