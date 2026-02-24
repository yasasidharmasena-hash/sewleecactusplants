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
import lk.sewleecactusplants.dao.PurchaseOrderDao;
import lk.sewleecactusplants.dao.PurchaseOrderStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.PurchaseOrder;
import lk.sewleecactusplants.entityfiles.PurchaseOrderHasItem;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/purchaseorder_details") // can't implmnt other services ther than purchaseorder_details
public class PurchaseOrderController {

    @Autowired // generate purchaseOrderDao instance, link dao
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate purchaseOrderStatusDao instance, link dao
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load UI [URL --->/purchaseorder_details]
    @RequestMapping()
    public ModelAndView loadPurchaseOrderUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView purchaseOrderUI = new ModelAndView();
        purchaseOrderUI.setViewName("purchaseorder.html");
        purchaseOrderUI.addObject("title", "Purchase Order Management");
        purchaseOrderUI.addObject("loggedusername", auth.getName()); // logged person

        return purchaseOrderUI;
    }

    // request mapping to load  all data [URL --->/purchaseorder_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<PurchaseOrder> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivilege_select()) {
            return purchaseOrderDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

     // request POST mapping to insert[URL-->/purchaseorder_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertPurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder ) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivilege_insert()) {

            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, item code)
                purchaseOrder.setAdded_datetime(LocalDateTime.now());
                purchaseOrder.setAdded_user_id(loggedUser.getId());
                purchaseOrder.setPo_number(purchaseOrderDao.getNxtPoNumber());

                // save operator ---blocked association's main side, therfore cannot save--active to save
                for (PurchaseOrderHasItem pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    pohi.setPurchaseorder_details_id(purchaseOrder);
                }
                purchaseOrderDao.save(purchaseOrder);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

       // request POST mapping to insert[URL-->/purchaseorder_details/update]
    @PutMapping(value = "/update") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String updatePurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder ) {
        
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivilege_update()) {

            // check duplicates (nothing)

            // need to write try catch because this access with database
            try {

                // set auto added data
                purchaseOrder.setModify_datetime(LocalDateTime.now());
                purchaseOrder.setModify_user_id(loggedUser.getId());

                // save operator ---blocked association's main side, therfore cannot save--active to save
                for (PurchaseOrderHasItem pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    pohi.setPurchaseorder_details_id(purchaseOrder);
                }
                purchaseOrderDao.save(purchaseOrder);

                return "OK";

            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }
    }

       // request POST mapping to insert[URL-->/purchaseorder_details/delete]
    @DeleteMapping(value = "/delete") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String deletePurchaseOrderData(@RequestBody PurchaseOrder purchaseOrder ) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivilege_delete()) {

            // check duplicates (nothing)
             if (purchaseOrder.getId() == null) {
                return "Delete Not Completed : Purchase order does not exist! ";
            }
            PurchaseOrder extPurchaseOrderById = purchaseOrderDao.getReferenceById(purchaseOrder.getId());
            if (extPurchaseOrderById == null) {
                return "Delete Not Completed : Purchase order does not exist!";
            }

            // need to write try catch because this access with database
            try {

                // set auto added data (AI)
                purchaseOrder.setDeleted_datetime(LocalDateTime.now());
                purchaseOrder.setDelete_user_id(loggedUser.getId());
                extPurchaseOrderById.setPurchaseorder_status_id(purchaseOrderStatusDao.getReferenceById(5));

                // save operator ---blocked association's main side, therfore cannot save--active to save
                for (PurchaseOrderHasItem pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    pohi.setPurchaseorder_details_id(purchaseOrder);
                }

                // delete operator (Convert delete ----> removed)
                purchaseOrderDao.save(extPurchaseOrderById);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed :" + e.getMessage();
            }
        } else {
            return "Delete not Completed : You do not have permissions..!";
        }
    }

    
    //request mapping to load po by supplier id[URL --->/purchaseorder_details/byposupplierid?supplierid=1]
    @GetMapping(value = "/byposupplierid", params = { "supplierid" }, produces = "application/json")
    public List<PurchaseOrder> getPoBySupplier(@RequestParam("supplierid") Integer supplierid) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase_Order");

        if (userPrivilege.getPrivilege_select()) {
            return purchaseOrderDao.getPoBySupplierid(supplierid);
        } else {
            return new ArrayList<>();
        }
    }

   


}
