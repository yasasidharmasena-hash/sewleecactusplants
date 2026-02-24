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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.CustomerDao;
import lk.sewleecactusplants.dao.CustomerStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Customer;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/customer_details") // can't implmnt other services ther than customer_details

public class CustomerController {

    @Autowired // generate customerDao instance, link dao
    private CustomerDao customerDao ;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate customerStatusDao instance, link dao
    private CustomerStatusDao customerStatusDao ;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    //request mapping to load customer UI [URL --->/customer_details]
    @RequestMapping()
    public ModelAndView loadCustomerUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView customerUI = new ModelAndView();
        customerUI.setViewName("customer.html");
        customerUI.addObject("title", "Customer Management");
        customerUI.addObject("loggedusername", auth.getName()); // logged person

        return customerUI;
    }

    //request mapping to load customer all data [URL --->/customer_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Customer> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (userPrivilege.getPrivilege_select()) {
            return customerDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }


    // request POST mapping to insert[URL-->/customer_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertCustomerData(@RequestBody Customer customer ) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: nic, email)
        Customer extCustomerByNic = customerDao.getByCustNic(customer.getCust_nic());
        if (extCustomerByNic != null) {
            return "Insert Not Completed : NIC already exists! ";
        }

        Customer extCustomerByEmail = customerDao.getByCustEmail(customer.getCust_email());
        if (extCustomerByEmail != null) {
            return "Insert Not Completed : Email already exists!";
        }

            // need to write try catch because this access with database
            try {

                // set auto added data (AI --- ex: added datetime, added_user, item code)
                customer.setAdded_datetime(LocalDateTime.now());
                customer.setAdded_user_id(loggedUser.getId());
                customer.setCust_regno(customerDao.getNxtCustregno());

                // save operator
                customerDao.save(customer);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

    // request PUT mapping to update data [URL->/customer_details/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updateCustomerData(@RequestBody Customer customer ) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (userPrivilege.getPrivilege_update()) {

            // check existings
            if (customer.getId() == null) {
                return "Update Not Completed : Customer does not exist! ";
            }
            Customer extById = customerDao.getReferenceById(customer.getId());
            if (extById == null) {
                return "Update Not Completed : Customer does not exist!";
            }

            // check duplicates (ex: nic & email)
            // used && to check whether the changed record and existing record is same

            Customer extCustomerByNic = customerDao.getByCustNic(customer.getCust_nic());
            if (extCustomerByNic != null && extCustomerByNic.getId() != customer.getId()) {
                return "Update Not Completed : NIC already exists! ";
            }

            Customer extCustomerByEmail = customerDao.getByCustEmail(customer.getCust_email());
            if (extCustomerByEmail != null && extCustomerByEmail.getId() != customer.getId()) {
                return "Update Not Completed : Email already exists!";
            }

            // need to write try catch because this is access with database
            try {

                // set auto added date (AI ---added datetime, added_user)
                customer.setModify_datetime(LocalDateTime.now());
                customer.setModify_user_id(loggedUser.getId());

                // save operator
                customerDao.save(customer);

                return "OK";
            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }

    }

    // request DELETE mapping for Delete data[URL -->/customer_details/delete]
    @DeleteMapping(value = "/delete")
    public String deleteCustomerData(@RequestBody Customer customer ) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

        if (userPrivilege.getPrivilege_delete()) {

            // check existings
            if (customer.getId() == null) {
                return "Delete Not Completed : Customer does not exist! ";
            }
            Customer extCustomerById = customerDao.getReferenceById(customer.getId());
            if (extCustomerById == null) {
                return "Delete Not Completed : Customer does not exist!";
            }

            // need to write try catch because this access with database
            try {
                // set auto added date (AI)
                extCustomerById.setDeleted_datetime(LocalDateTime.now());
                extCustomerById.setDelete_user_id(userDao.getByUsername(auth.getName()).getId());
                extCustomerById.setCustomer_status_id(customerStatusDao.getReferenceById(3));
                ;

                // delete operator (Convert delete ----> removed)
                customerDao.save(extCustomerById);

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
