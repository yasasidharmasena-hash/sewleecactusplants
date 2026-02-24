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

import lk.sewleecactusplants.dao.GrnDao;
import lk.sewleecactusplants.dao.GrnStatusDao;
import lk.sewleecactusplants.dao.SupplierPaymentDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Grn;
import lk.sewleecactusplants.entityfiles.GrnHasItem;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.SupplierPayment;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/payment_details") // can't implmnt other services ther than payment_details
public class SupplierPaymentController {

    @Autowired // generate grnDao instance, link dao
    private SupplierPaymentDao supplierPaymentDao  ;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

     @Autowired // generate UserDao instance, link dao
    private GrnDao grnDao ;

     @Autowired // generate UserDao instance, link dao
    private GrnStatusDao grnStatusDao ;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load UI [URL --->/payment_details]
    @RequestMapping()
    public ModelAndView loadSupplierPaymentUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView supplierpaymentUI = new ModelAndView();
        supplierpaymentUI.setViewName("supplierpayment.html");
        supplierpaymentUI.addObject("title", "Supplier Payment Management");
        supplierpaymentUI.addObject("loggedusername", auth.getName()); // logged person

        return supplierpaymentUI;
    }

    // request mapping to load  all data [URL --->/payment_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<SupplierPayment> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Payment");

        if (userPrivilege.getPrivilege_select()) {
            return supplierPaymentDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/payment_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertSupplierPaymentData(@RequestBody SupplierPayment supplierPayment   ) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Payment");
        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: no)

            // need to write try catch because this access with database
            try {

                // set auto added data (AI)
                supplierPayment.setAdded_datetime(LocalDateTime.now());
                supplierPayment.setAdded_user_id(loggedUser.getId());
                supplierPayment.setBill_number(supplierPaymentDao.NxtBillNo());

                // save operator
                supplierPaymentDao.save(supplierPayment);
                // Get the related GRN by ID
                Grn grn =  grnDao.getReferenceById(supplierPayment.getGrn_details_id().getId());
                // Update the paid amount
               grn.setPaid_amount(grn.getPaid_amount().add(supplierPayment.getPaid_amount()));

                // If the total paid amount equals the net amount, update GRN status to '2' 
               if (grn.getNet_amount().compareTo(grn.getPaid_amount())==0) {
                    grn.setGrn_status_id(grnStatusDao.getReferenceById(2));
                }

                // Update the GRN reference in each GRN item
                for (GrnHasItem ghi : grn.getGrnHasItemList()) {
                    ghi.setGrn_details_id(grn);
                }
                grnDao.save(grn);

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }
}
