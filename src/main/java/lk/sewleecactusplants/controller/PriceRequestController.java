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

import lk.sewleecactusplants.dao.PriceRequestDao;
import lk.sewleecactusplants.dao.PriceRequestStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.PriceRequest;
import lk.sewleecactusplants.entityfiles.PriceRequestStatus;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/pricerequest") // can't implmnt other services ther than item_details
public class PriceRequestController {

    @Autowired // generate pricerequestDao instance
    private PriceRequestDao priceRequestDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate PriceRequestStatusDao instance, link dao
    private PriceRequestStatusDao priceRequestStatusDao;

    // request mapping to load price request UI [URL --->/price_request]
    @RequestMapping()
    public ModelAndView loadPriceRequestUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView priceRequestUI = new ModelAndView();
        priceRequestUI.setViewName("pricerequest.html");
        priceRequestUI.addObject("title", "Price Request Management");
        priceRequestUI.addObject("loggedusername", auth.getName()); // logged person

        return priceRequestUI;
    }

    // request mapping to load all data [URL --->/pricerequest/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<PriceRequest> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_Request");

        if (userPrivilege.getPrivilege_select()) {
            return priceRequestDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/pricerequest/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertPriceRequestData(@RequestBody PriceRequest priceRequest) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_Request");

        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex:)


            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, supplier code)
                priceRequest.setAdded_datetime(LocalDateTime.now());
                priceRequest.setAdded_user_id(loggedUser.getId());
                priceRequest.setRequest_code(priceRequestDao.getNxtRequesteCode());
               // priceRequest.setPricerequest_status_id(priceRequestStatusDao.getReferenceById(0));

                // save operator
                priceRequestDao.save(priceRequest);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

    // request PUT mapping to update data [URL->/pricerequest/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updatePriceRequestData(@RequestBody PriceRequest priceRequest ) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_Request");

        if (userPrivilege.getPrivilege_update()) {

            // check existings
           /* if (priceRequest.getId() == null) {
                return "Update Not Completed : Price Request does not exist! ";
            }
            PriceRequest extById = priceRequestDao.getReferenceById(priceRequest.getId());
            if (extById == null) {
                return "Update Not Completed : priceRequest does not exist!";
            }*/

            // check duplicates (ex:)
            // used && to check whether the changed record and existing record is same
            

            // need to write try catch because this is access with database
            try {

                // set auto added date (AI ---added datetime, added_user)
                priceRequest.setModify_datetime(LocalDateTime.now());
                priceRequest.setModify_user_id(loggedUser.getId());

                // save operator
                priceRequestDao.save(priceRequest);

                return "OK";
            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }

    }

    // request DELETE mapping for Delete data[URL -->/pricerequest/delete]
    @DeleteMapping(value = "/delete")
    public String deletePriceRequestData(@RequestBody PriceRequest priceRequest ) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Price_Request");

        if (userPrivilege.getPrivilege_delete()) {

            // check existings
            if (priceRequest.getId() == null) {
                return "Delete Not Completed : Price Request does not exist! ";
            }
            PriceRequest extPriceRequestById = priceRequestDao.getReferenceById(priceRequest.getId());
            if (extPriceRequestById == null) {
                return "Delete Not Completed : Price Request does not exist!";
            }

            // need to write try catch because this access with database
            try {
                // set auto added date (AI)
                extPriceRequestById.setDeleted_datetime(LocalDateTime.now());
                extPriceRequestById.setDelete_user_id(userDao.getByUsername(auth.getName()).getId());
                extPriceRequestById.setPricerequest_status_id(priceRequestStatusDao.getReferenceById(5));
                ;

                // delete operator (Convert delete ----> removed)
                priceRequestDao.save(extPriceRequestById);

                // dependancies
                return "OK";
            } catch (Exception e) {
                return "Delete not Completed :" + e.getMessage();
            }
        } else {
            return "Delete not Completed : You do not have permissions..!";
        }
    }

    // request mapping to load all data [URL --->/pricerequest/bysupplierrcodes?supplierid=1]
    @GetMapping(value = "/bysupplierrcodes", params = {"supplierid"}, produces = "application/json")
    public List<PriceRequest> bySupplierrCodes(@RequestParam("supplierid") Integer supplierid) {
            return priceRequestDao.bySupplierrCodes(supplierid);
        
    }

}
