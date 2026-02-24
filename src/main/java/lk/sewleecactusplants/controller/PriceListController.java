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

import lk.sewleecactusplants.dao.PriceListDao;
import lk.sewleecactusplants.dao.PriceListStatusDao;
import lk.sewleecactusplants.dao.PriceRequestDao;
import lk.sewleecactusplants.dao.PriceRequestStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.PriceList;
import lk.sewleecactusplants.entityfiles.PriceListHasItem;
import lk.sewleecactusplants.entityfiles.PriceRequest;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/pricelist") // can't implmnt other services ther than price_list
public class PriceListController {

    @Autowired // generate priceListDao instance, link dao
    private PriceListDao priceListDao;

     @Autowired // generate priceRequestDao instance, link dao
    private PriceRequestDao priceRequestDao ;

     @Autowired // generate priceListDao instance, link dao
    private PriceRequestStatusDao priceRequestStatusDao;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate priceListStatusDao instance, link dao
    private PriceListStatusDao priceListStatusDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load price list UI [URL --->/pricelist]
    @RequestMapping()
    public ModelAndView loadPriceListUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView priceListUI = new ModelAndView();
        priceListUI.setViewName("pricelist.html");
        priceListUI.addObject("title", "Price List Management");
        priceListUI.addObject("loggedusername", auth.getName()); // logged person

        return priceListUI;
    }

     // request mapping to load  all data [URL --->/pricelist/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<PriceList> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_List");

        if (userPrivilege.getPrivilege_select()) {
            return priceListDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/pricelist/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertPriceListData(@RequestBody PriceList priceList) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_List");

        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: price request code)
            PriceList extPricelistByPriceRequestCode = priceListDao.getByPriceRequestCode(priceList.getPricerequest_id());
            if (extPricelistByPriceRequestCode !=null) {
                return  "Insert Not Completed : Price Request Code already exists! ";
            }
            
            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, pricelist number)
                priceList.setAdded_datetime(LocalDateTime.now());
                priceList.setAdded_user_id(loggedUser.getId());
                priceList.setPricelist_number(priceListDao.getNxtPriceListNumber());

                // save operator
                //blocked association's main side, therfore cannot submit---required , to activa again write this
                for (PriceListHasItem plhi : priceList.getPriceListHasItemList()) {
                    plhi.setPricelist_id(priceList);
                }
                priceListDao.save(priceList);
                //need to update price request status
                PriceRequest priceRequest = priceRequestDao.getReferenceById(priceList.getPricerequest_id().getId());
                priceRequest.setPricerequest_status_id(priceRequestStatusDao.getReferenceById(2));
                priceRequestDao.save(priceRequest);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

    // request PUT mapping to update data [URL->/pricelist/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updatePriceListData(@RequestBody PriceList priceList) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_List");

        if (userPrivilege.getPrivilege_update()) {

            // check existings
            if (priceList.getId() == null) {
                return "Update Not Completed : Price List does not exist! ";
            }
            PriceList extById = priceListDao.getReferenceById(priceList.getId());
            if (extById == null) {
                return "Update Not Completed : Price List does not exist!";
            }

            // check duplicates (ex: pricerequest code )
            // used && to check whether the changed record and existing record is same
            PriceList extPricelistByPriceRequestCode = priceListDao.getByPriceRequestCode(priceList.getPricerequest_id());
            if (extPricelistByPriceRequestCode != null && extPricelistByPriceRequestCode.getId() != priceList.getId()) {
               return  "Update Not Completed : Item name already exists! ";
            }
            

            // need to write try catch because this is access with database
            try {

                // set auto added date (AI ---added datetime, added_user)
                priceList.setModify_datetime(LocalDateTime.now());
                priceList.setModify_user_id(loggedUser.getId());

                // save operator
                 //blocked association's main side, therfore cannot submit---required , to activa again write this
                for (PriceListHasItem plhi : priceList.getPriceListHasItemList()) {
                    plhi.setPricelist_id(priceList);
                }
                priceListDao.save(priceList);

                return "OK";
            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }

    }

    // request DELETE mapping for Delete data[URL -->/pricelist/delete]
    @DeleteMapping(value = "/delete")
    public String deletePriceListData(@RequestBody PriceList priceList) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_List");

        if (userPrivilege.getPrivilege_delete()) {

            // check existings
            if (priceList.getId() == null) {
                return "Delete Not Completed : Price List does not exist! ";
            }
            PriceList extPriceListById = priceListDao.getReferenceById(priceList.getId());
            if (extPriceListById == null) {
                return "Delete Not Completed : Price List does not exist!";
            }

            // need to write try catch because this access with database
            try {
                // set auto added date (AI)
                extPriceListById.setDeleted_datetime(LocalDateTime.now());
                extPriceListById.setDelete_user_id(userDao.getByUsername(auth.getName()).getId());
                extPriceListById.setPricelist_status_id(priceListStatusDao.getReferenceById(3));
                ;

                // delete operator (Convert delete ----> removed)
                 //blocked association's main side, therfore cannot submit---required , to activa again write this
                for (PriceListHasItem plhi : extPriceListById.getPriceListHasItemList()) {
                    plhi.setPricelist_id(extPriceListById);
                }

                // delete operator (Convert delete ----> removed)
                priceListDao.save(extPriceListById);

                // dependancies
                return "OK";
            } catch (Exception e) {
                return "Delete not Completed :" + e.getMessage();
            }
        } else {
            return "Delete not Completed : You do not have permissions..!";
        }
    }


    //request mapping to load pricelist by supplier id[URL --->/pricelist/getbysupplierid?suppilierd=1]
    @GetMapping(value = "/getbysupplierid", params = {"supplierid"} , produces = "application/json")
    public List<PriceList> getBySupplierId(@RequestParam("supplierid") Integer supplierid){
        return priceListDao.getBySupplierId(supplierid);}


}
