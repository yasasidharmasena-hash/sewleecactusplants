package lk.sewleecactusplants.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.DamagedItemDao;
import lk.sewleecactusplants.dao.InventoryDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.DamagedItem;
import lk.sewleecactusplants.entityfiles.Inventory;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/damaged_items") // can't implmnt other services ther than damaged_items

public class DamagedItemController {

    @Autowired // generate damagedItemDao instance, link dao
    private DamagedItemDao damagedItemDao;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate UserDao instance, link dao
    private InventoryDao inventoryDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load UI [URL --->/damaged_items]
    @RequestMapping()
    public ModelAndView loadDamagedUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView damagedUI = new ModelAndView();
        damagedUI.setViewName("damageditem.html");
        damagedUI.addObject("title", "Damage Item Management");
        damagedUI.addObject("loggedusername", auth.getName()); // logged person

        return damagedUI;
    }

    // request mapping to load all data [URL --->/damaged_items/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<DamagedItem> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Damaged_Items");

        if (userPrivilege.getPrivilege_select()) {
            return damagedItemDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/damaged_items/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertDamagedItemData(@RequestBody DamagedItem damagedItem) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Damaged_Items");

        if (userPrivilege.getPrivilege_insert()) {

            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, item code)
                damagedItem.setAdded_datetime(LocalDateTime.now());
                damagedItem.setAdded_user_id(loggedUser.getId());

                // save operator
                damagedItemDao.save(damagedItem);

                // Get inventory record matching the item ID and quantity
                List<Inventory> inventory = inventoryDao
                        .getByItemIdAndQuantity(damagedItem.getItem_details_id().getId(), damagedItem.getQuantity());

                // Select the first matching inventory record
                Inventory newInventory = inventory.get(0);

                // Reduce available quantity and increase damaged quantity
                newInventory.setAvailable_qty(newInventory.getAvailable_qty() - damagedItem.getQuantity());
                newInventory.setDamaged_qty(newInventory.getDamaged_qty() + damagedItem.getQuantity());

                // Save the updated inventory record
                inventoryDao.save(newInventory);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }
}
