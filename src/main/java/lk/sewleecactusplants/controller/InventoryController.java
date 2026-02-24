package lk.sewleecactusplants.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.InventoryDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Inventory;
import lk.sewleecactusplants.entityfiles.Privilege;


@RestController // to get return UI
@RequestMapping(value = "/inventory_details") // can't implmnt other services ther than inventory_details
public class InventoryController {

    @Autowired // generate grnDao instance, link dao
    private InventoryDao inventoryDao  ;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load UI [URL --->/inventory_details]
    @RequestMapping()
    public ModelAndView loadInventoryUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView inventoryUI = new ModelAndView();
        inventoryUI.setViewName("inventory.html");
        inventoryUI.addObject("title", "Inventory Management");
        inventoryUI.addObject("loggedusername", auth.getName()); // logged person

        return inventoryUI;
    }

    // request mapping to load  all data [URL --->/inventory_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Inventory> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Inventory");

        if (userPrivilege.getPrivilege_select()) {
            return inventoryDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    //request mapping for get inventory by item
    @GetMapping("/byitem/{itemid}")
    public List<Inventory> getInventoryByItem(@PathVariable("itemid") Integer itemid) {
        return inventoryDao.getByItemAvailableQty(itemid);
    }
    

}
