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

import lk.sewleecactusplants.dao.CustomerInvoiceDao;
import lk.sewleecactusplants.dao.InventoryDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.CustomerInvoice;
import lk.sewleecactusplants.entityfiles.CustomerInvoiceHasItem;
import lk.sewleecactusplants.entityfiles.Inventory;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/customer_invoice") // can't implmnt other services ther than customer_invoice
public class CustomerInvoiceController {

    @Autowired // generate purchaseOrderDao instance, link dao
    private CustomerInvoiceDao customerInvoiceDao;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    @Autowired // generate UserDao instance, link dao
    private InventoryDao inventoryDao ;

    // request mapping to load UI [URL --->/customer_invoice]
    @RequestMapping()
    public ModelAndView loadInvoiceUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView invoiceUI = new ModelAndView();
        invoiceUI.setViewName("customerinvoice.html");
        invoiceUI.addObject("title", "Customer Invoice Management");
        invoiceUI.addObject("loggedusername", auth.getName()); // logged person

        return invoiceUI;
    }

    // request mapping to load  all data [URL --->/customer_invoice/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<CustomerInvoice> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

        if (userPrivilege.getPrivilege_select()) {
            return customerInvoiceDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

        // request POST mapping to insert[URL-->/customer_invoice/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertInvoiceData(@RequestBody CustomerInvoice customerInvoice  ) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Invoice");

        if (userPrivilege.getPrivilege_insert()) {

            // need to write try catch because this access with database
            try {

                
                for (CustomerInvoiceHasItem cihi : customerInvoice.getCustomerInvoiceHasItemList()) {
                   Inventory inventory=inventoryDao.getReferenceById(cihi.getInventory_details_id().getId());
                   if (inventory.getAvailable_qty()<cihi.getQuantity()) {
                    return cihi.getItem_details_id().getItemname()+" item inventory not enough!";
                   }
                }

                // set auto added data (AI)
                customerInvoice.setAdded_datetime(LocalDateTime.now());
                customerInvoice.setAdded_user_id(loggedUser.getId());
                customerInvoice.setInvoice_number(customerInvoiceDao.getNxtInvoiceNo());
                customerInvoice.setDelivery_required(false);

                // save operator ---blocked association's main side, therfore cannot save--active to save
                for (CustomerInvoiceHasItem cihi : customerInvoice.getCustomerInvoiceHasItemList()) {
                    cihi.setCustomer_invoice_id(customerInvoice);
                }
                customerInvoiceDao.save(customerInvoice);

                for (CustomerInvoiceHasItem cihi : customerInvoice.getCustomerInvoiceHasItemList()) {
                   Inventory inventory=inventoryDao.getReferenceById(cihi.getInventory_details_id().getId());
                   
                    inventory.setAvailable_qty(inventory.getAvailable_qty()- cihi.getQuantity());
                    
                    inventoryDao.save(inventory);
                }

                

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

  
}
