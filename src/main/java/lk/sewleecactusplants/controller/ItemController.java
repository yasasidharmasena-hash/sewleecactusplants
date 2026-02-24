package lk.sewleecactusplants.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import lk.sewleecactusplants.dao.ItemDao;
import lk.sewleecactusplants.dao.ItemStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Item;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/item_details") // can't implmnt other services ther than item_details
public class ItemController {

    @Autowired // generate ItemDao instance, link dao
    private ItemDao itemDao;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate ItemStatusDao instance, link dao
    private ItemStatusDao itemStatusDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load item UI [URL --->/item_details]
    @RequestMapping()
    public ModelAndView loadItemUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView itemUI = new ModelAndView();
        itemUI.setViewName("item.html");
        itemUI.addObject("title", "Item Management");
        itemUI.addObject("loggedusername", auth.getName()); // logged person

        return itemUI;
    }

    // request mapping to load item all data [URL --->/item_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Item> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_select()) {
            return itemDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/item_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertItemData(@RequestBody Item item) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: item name)
            Item extItemByItemname = itemDao.getByItemname(item.getItemname());
            if (extItemByItemname != null) {
                return "Insert Not Completed : Item name already exists! ";
            }

            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, item code)
                item.setAdded_datetime(LocalDateTime.now());
                item.setAdded_user_id(loggedUser.getId());
                item.setItemcode(itemDao.getNxtItemcode());

                // save operator
                itemDao.save(item);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

    // request PUT mapping to update data [URL->/item_details/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updateItemData(@RequestBody Item item) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_update()) {

            // check existings
            if (item.getId() == null) {
                return "Update Not Completed : Item does not exist! ";
            }
            Item extById = itemDao.getReferenceById(item.getId());
            if (extById == null) {
                return "Update Not Completed : Item does not exist!";
            }

            // check duplicates (ex: item name)
            // used && to check whether the changed record and existing record is same
            Item extItemByItemname = itemDao.getByItemname(item.getItemname());
            if (extItemByItemname != null && extItemByItemname.getId() != item.getId()) {
                return "Update Not Completed : Item name already exists! ";
            }

            // need to write try catch because this is access with database
            try {

                // set auto added date (AI ---added datetime, added_user)
                item.setModify_datetime(LocalDateTime.now());
                item.setModify_user_id(loggedUser.getId());

                // save operator
                itemDao.save(item);

                return "OK";
            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }

    }

    // request DELETE mapping for Delete data[URL -->/item_details/delete]
    @DeleteMapping(value = "/delete")
    public String deleteItemData(@RequestBody Item item) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_delete()) {

            // check existings
            if (item.getId() == null) {
                return "Delete Not Completed : Item does not exist! ";
            }
            Item extItemById = itemDao.getReferenceById(item.getId());
            if (extItemById == null) {
                return "Delete Not Completed : Item does not exist!";
            }

            // need to write try catch because this access with database
            try {
                // set auto added date (AI)
                extItemById.setDeleted_datetime(LocalDateTime.now());
                extItemById.setDelete_user_id(userDao.getByUsername(auth.getName()).getId());
                extItemById.setItem_status_id(itemStatusDao.getReferenceById(3));
                ;

                // delete operator (Convert delete ----> removed)
                itemDao.save(extItemById);

                // dependancies
                return "OK";
            } catch (Exception e) {
                return "Delete not Completed :" + e.getMessage();
            }
        } else {
            return "Delete not Completed : You do not have permissions..!";
        }
    }

    // request mapping for get unsupplied items
    // [URL-->/item_details/unsupplieditems]
    @GetMapping(value = "/unsupplieditems", params = { "supplierid" }, produces = "application/json")
    public List<Item> getItemUnsuppliedItemsById(@RequestParam("supplierid") Integer supplierid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_update()) {
            return itemDao.getUnsuppliedItems(supplierid);
        } else {
            return new ArrayList<>();
        }
    }

    // request mapping for get supplied items
    // [URL-->/item_details/bysupplier?supplierid=]
    @GetMapping(value = "/bysupplier", params = { "supplierid" }, produces = "application/json")
    public List<Item> getItemBysupplied(@RequestParam("supplierid") Integer supplierid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_update()) {
            return itemDao.getItemBySupplier(supplierid);
        } else {
            return new ArrayList<>();
        }
    }

    // request mapping for get supplied items
    // [URL-->/item_details/bysuppliernotinrequest?supplierid=]
    @GetMapping(value = "/bysuppliernotinrequest", params = { "supplierid",
            "requestid" }, produces = "application/json")
    public List<Item> getItemBysupplierAndNotInRequest(@RequestParam("supplierid") Integer supplierid,
            @RequestParam("requestid") Integer requestid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_update()) {
            return itemDao.getItemBySupplierNotInRequest(supplierid, requestid);
        } else {
            return new ArrayList<>();
        }
    }

    //request mapping for get itemByPricerequestCode[URL-->/item_details/bypricerequestcode?pricerequestid=]
    @GetMapping(value = "/bypricerequestcode", params = { "pricerequestid" }, produces = "application/json")
    public List<Item> getItemByPriceRequestCode(@RequestParam("pricerequestid") Integer pricerequestid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_select()) {
            return itemDao.getItemByRequestCode(pricerequestid);
        } else {
            return new ArrayList<>();
        }
    }

    //request mapping for get item list[URL-->/item_details/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<Item> getItemList() {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_select()) {
            return itemDao.getItemList();
        } else {
            return new ArrayList<>();
        }
    }

    
    //request mapping for get itemByPriceListNumber[URL-->/item_details/bypricelistnumber?pricelistid=]
    @GetMapping(value = "/bypricelistnumber", params = { "pricelistid" }, produces = "application/json")
    public List<Item> getItemByPriceList(@RequestParam("pricelistid") Integer pricelistid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_select()) {
            return itemDao.getItemByPriceListNumber(pricelistid);
        } else {
            return new ArrayList<>();
        }
    }

      
    //request mapping for get itemByPriceListNumber[URL-->/item_details/byponumber?poid=]
    @GetMapping(value = "/byponumber", params = { "poid" }, produces = "application/json")
    public List<Item> getItemByPo(@RequestParam("poid") Integer poid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Items");

        if (userPrivilege.getPrivilege_select()) {
            return itemDao.getItemByPoNumber(poid);
        } else {
            return new ArrayList<>();
        }
    }

}
