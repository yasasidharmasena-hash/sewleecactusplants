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

import lk.sewleecactusplants.dao.SupplierDao;
import lk.sewleecactusplants.dao.SupplierStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.Supplier;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "supplier_details") // can't implmnt other services other than supplier_details

public class SupplierController {

    @Autowired // generate supplierDao instance
    private SupplierDao supplierDao;

    @Autowired // generate supplierStatusDao instance
    private SupplierStatusDao supplierStatusDao;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load item UI [URL --->/supplier_details]
    @RequestMapping()
    public ModelAndView loadSupplierUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView supplierUI = new ModelAndView();
        supplierUI.setViewName("supplier.html");
        supplierUI.addObject("title", "Supplier Management");
        supplierUI.addObject("loggedusername", auth.getName()); // logged person

        return supplierUI;
    }

    // request mapping to load supplier all data [URL --->/supplier_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Supplier> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivilege_select()) {
            return supplierDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/supplier_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertSupplierData(@RequestBody Supplier supplier) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: supplier email & supplier account number)
           
            Supplier extSupplierByEmail = supplierDao.getBySupEmail(supplier.getSup_email());
            if (extSupplierByEmail != null) {
                return "Insert Not Completed : Email already exists!";
            }

             Supplier extSupplierByAcctno = supplierDao.getBySupAcctno(supplier.getAccount_no());
            if (extSupplierByAcctno != null) {
                return "Insert Not Completed : Account number already exists! ";
            }

            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, supplier code)
                supplier.setAdded_datetime(LocalDateTime.now());
                supplier.setAdded_user_id(loggedUser.getId());
                supplier.setSup_no(supplierDao.getNxtSupNo());

                // save operator
                supplierDao.save(supplier);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

    // request PUT mapping to update data [URL->/supplier_details/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updateSupplierData(@RequestBody Supplier supplier) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivilege_update()) {

            // check existings
            if (supplier.getId() == null) {
                return "Update Not Completed : Supplier does not exist! ";
            }
            Supplier extById = supplierDao.getReferenceById(supplier.getId());
            if (extById == null) {
                return "Update Not Completed : Supplier does not exist!";
            }

            // check duplicates (ex: email, account number, business reg no)
            // used && to check whether the changed record and existing record is same
            Supplier extSupplierByEmail = supplierDao.getBySupEmail(supplier.getSup_email());
            if (extSupplierByEmail != null && extSupplierByEmail.getId() != supplier.getId()) {
                return "Update Not Completed : Email already exists!";
            }

            Supplier extSupplierByAcctno = supplierDao.getBySupAcctno(supplier.getAccount_no());
            if (extSupplierByAcctno != null && extSupplierByAcctno.getId() != supplier.getId()) {
                return "Update Not Completed : Email already exists!";
            }

            // need to write try catch because this is access with database
            try {

                // set auto added date (AI ---added datetime, added_user)
                supplier.setModify_datetime(LocalDateTime.now());
                supplier.setModify_user_id(loggedUser.getId());

                // save operator
                supplierDao.save(supplier);

                return "OK";
            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }

    }

    // request DELETE mapping for Delete data[URL -->/supplier_details/delete]
    @DeleteMapping(value = "/delete")
    public String deleteSupplierData(@RequestBody Supplier supplier) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

        if (userPrivilege.getPrivilege_delete()) {

            // check existings
            if (supplier.getId() == null) {
                return "Delete Not Completed : Supplier does not exist! ";
            }
            Supplier extSupplierById = supplierDao.getReferenceById(supplier.getId());
            if (extSupplierById == null) {
                return "Delete Not Completed : supplier does not exist!";
            }

            // need to write try catch because this access with database
            try {
                // set auto added date (AI)
                extSupplierById.setDeleted_datetime(LocalDateTime.now());
                extSupplierById.setDelete_user_id(userDao.getByUsername(auth.getName()).getId());
                extSupplierById.setSupplier_status_id(supplierStatusDao.getReferenceById(3));
                ;

                // delete operator (Convert delete ----> removed)
                supplierDao.save(extSupplierById);

                // dependancies
                return "OK";
            } catch (Exception e) {
                return "Delete not Completed :" + e.getMessage();
            }
        } else {
            return "Delete not Completed : You do not have permissions..!";
        }
    }
}
