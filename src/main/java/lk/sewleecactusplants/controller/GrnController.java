package lk.sewleecactusplants.controller;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.GrnDao;
import lk.sewleecactusplants.dao.InventoryDao;
import lk.sewleecactusplants.dao.PurchaseOrderDao;
import lk.sewleecactusplants.dao.PurchaseOrderStatusDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Grn;
import lk.sewleecactusplants.entityfiles.GrnHasItem;
import lk.sewleecactusplants.entityfiles.Inventory;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.PurchaseOrder;
import lk.sewleecactusplants.entityfiles.PurchaseOrderHasItem;
import lk.sewleecactusplants.entityfiles.User;

@RestController // to get return UI
@RequestMapping(value = "/grn_details") // can't implmnt other services ther than grn_details
public class GrnController {

    @Autowired // generate grnDao instance, link dao
    private GrnDao grnDao ;

     @Autowired // generate grnDao instance, link dao
    private PurchaseOrderDao purchaseOrderDao  ;

     @Autowired // generate grnDao instance, link dao
    private PurchaseOrderStatusDao purchaseOrderStatusDao  ;
    
      @Autowired // generate grnDao instance, link dao
    private InventoryDao inventoryDao   ;

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load UI [URL --->/grn_details]
    @RequestMapping()
    public ModelAndView loadGrnUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView grnUI = new ModelAndView();
        grnUI.setViewName("grn.html");
        grnUI.addObject("title", "GRN Management");
        grnUI.addObject("loggedusername", auth.getName()); // logged person

        return grnUI;
    }

    // request mapping to load  all data [URL --->/grn_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Grn> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Grn");

        if (userPrivilege.getPrivilege_select()) {
            return grnDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }
    }

    // request POST mapping to insert[URL-->/grn_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertGrnData(@RequestBody Grn grn  ) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Goods_Received_Note");
        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: no)

            // need to write try catch because this access with database
            try {

                // set auto added data (AI)
                grn.setAdded_datetime(LocalDateTime.now());
                grn.setAdded_user_id(loggedUser.getId());
                grn.setPaid_amount(BigDecimal.ZERO);

                // save operator ---blocked association's main side, therfore cannot save--active to save
                for (GrnHasItem ghi : grn.getGrnHasItemList()) {
                    ghi.setGrn_details_id(grn);
                }
                grnDao.save(grn);


                // Get the  po by ID
                PurchaseOrder purchaseOrder=purchaseOrderDao.getReferenceById(grn.getPurchaseorder_details_id().getId());
                // Set po status to 2 - complete
                purchaseOrder.setPurchaseorder_status_id(purchaseOrderStatusDao.getReferenceById(2));
                // Update the reference in each po item
                for (PurchaseOrderHasItem pohi : purchaseOrder.getPurchaseOrderHasItemList()) {
                    pohi.setPurchaseorder_details_id(purchaseOrder);
                }
                purchaseOrderDao.save(purchaseOrder);

                for (GrnHasItem ghi : grn.getGrnHasItemList()) {
                    // Check if inventory record exists for the item with the same unit price
                   Inventory inventory=inventoryDao.getByItemId(ghi.getItem_details_id().getId(), ghi.getUnit_price());
                   if (inventory != null) {
                    // If inventory exists, increase available and total quantities
                    inventory.setAvailable_qty(inventory.getAvailable_qty()+ ghi.getQuantity());
                    inventory.setTotal_qty(inventory.getTotal_qty()+ghi.getQuantity());
                    inventoryDao.save(inventory);
                   } else {
                    // If inventory doesn't exist, create a new inventory record
                    Inventory newInventory = new Inventory();
                    newInventory.setAvailable_qty(ghi.getQuantity());
                    newInventory.setTotal_qty(ghi.getQuantity());
                    newInventory.setDamaged_qty(0);
                    newInventory.setCostprice(ghi.getUnit_price());
                    newInventory.setItem_details_id(ghi.getItem_details_id());
                    // Calculate and set retail price: cost + profitratio
                    newInventory.setRetailprice(ghi.getUnit_price().multiply(ghi.getItem_details_id().getProfitratio().divide(new BigDecimal(100))).add(ghi.getUnit_price()));
                    inventoryDao.save(newInventory);
                   }
                }

                return "OK";

            } catch (Exception e) {
                return "Insert not Completed :" + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

  //request mapping to load pricelist by supplier id[URL --->/grn_details/getbysupplierid?suppilierd=1]
   @GetMapping(value = "/getbysupplierid", params = {"supplierid"} , produces = "application/json")
    public List<Grn> getBySupplierId(@RequestParam("supplierid") Integer supplierid){
        return grnDao.getBySupplierId(supplierid);}
}
