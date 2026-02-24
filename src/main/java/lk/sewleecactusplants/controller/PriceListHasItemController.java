package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.PriceListHasItemDao;
import lk.sewleecactusplants.entityfiles.PriceListHasItem;

@RestController //to get return UI
public class PriceListHasItemController {

    @Autowired //generate DesignationDao instance
    private PriceListHasItemDao priceListHasItemDao  ;
    

    //request mapping to load designation all data [URL --->/pricelist_has_item_details/alldata]
    @GetMapping(value = "/pricelist_has_item_details/alldata" , produces = "application/json")
    public List<PriceListHasItem> findAllData(){
        return priceListHasItemDao.findAll();
    }

    //get a PriceListHasItem by item ID and pricelist ID[URL --->/pricelist_has_item_details/byitempricelist?itemid=1&priceid=2]
    @GetMapping(value = "/pricelist_has_item_details/byitempricelist", params = {"itemid" , "priceid"} , produces = "application/json")
    public PriceListHasItem getBySupplierId(@RequestParam("itemid") Integer itemid , @RequestParam("priceid") Integer priceid){
        return priceListHasItemDao.getByPriceListItem(itemid, priceid);
    }



}
