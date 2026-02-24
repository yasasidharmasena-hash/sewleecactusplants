package lk.sewleecactusplants.controller;

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

import lk.sewleecactusplants.dao.PrivilegeDao;
import lk.sewleecactusplants.entityfiles.Privilege;

@RestController // to get return UI
@RequestMapping(value = "/privilege_details" )
public class PrivilegeController {

    @Autowired // generate PrivilegeDao instance, link dao
    private PrivilegeDao privilegeDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to get privilege UI [URL --->/privilege_details]
    @GetMapping()
    public ModelAndView loadPrivilegeUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView privilegeUI = new ModelAndView();
        privilegeUI.setViewName("privilege.html");
        privilegeUI.addObject("title", "Privilege Management");
        privilegeUI.addObject("loggedusername", auth.getName());

        return privilegeUI;
    }

    // request mapping to get privilege all data [URL-->/privilege_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Privilege> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (userPrivilege.getPrivilege_select()) {
            // sort -- first record will be the record added lastly
            return privilegeDao.findAll(Sort.by(Direction.DESC, "id"));
        } else {
            return new ArrayList<>();
        }

    }

    // request POST mapping to insert[URL-->/privilege_details/insert]
    @PostMapping(value = "/insert") // for submit button
    // @RequestBody ---> access the object that sent from the fontend
    public String insertPrivilegeData(@RequestBody Privilege privilege) {
        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (userPrivilege.getPrivilege_insert()) {

            // check duplicates (ex: role & module)
            Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModules(privilege.getRole_id().getId(),
                    privilege.getModules_id().getId());
            if (extPrivilege != null) {
                return "Insert not Completed : Privilege already exists!";
            }

            try {
                // save operator
                privilegeDao.save(privilege);
                return "OK";
            } catch (Exception e) {
                return "Insert not Completed : " + e.getMessage();
            }
        } else {
            return "Insert not Completed : You do not have permissions..!";
        }
    }

    // request PUT mapping to update[URL-->/privilege_details/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updatePrivilegeData(@RequestBody Privilege privilege) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (userPrivilege.getPrivilege_update()) {

            // check exist primaryid (privilege)

            // check duplicates (ex: role & module)

            Privilege extPrivilege = privilegeDao.getPrivilegeByRoleModules(privilege.getRole_id().getId(),
                    privilege.getModules_id().getId());

            if (extPrivilege != null && extPrivilege.getId() != privilege.getId()) {
                return "Update not Completed : Privilege already exists!";
            }
            try {
                // save /update operator
                privilegeDao.save(privilege);
                return "OK";
            } catch (Exception e) {
                return "Update not Completed : " + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }
    }

    // request DELETE mapping to delete[URL-->/privilege_details/delete]
    @DeleteMapping(value = "/delete") // for delete button
    public String deletePrivilegeData(@RequestBody Privilege privilege) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Privilege");

        if (userPrivilege.getPrivilege_delete()) {
            // check exist primaryid (employee record)

            try {
                // delete operator
                privilege.setPrivilege_select(false);
                privilege.setPrivilege_insert(false);
                privilege.setPrivilege_update(false);
                privilege.setPrivilege_delete(false);
                privilegeDao.save(privilege);

                return "OK";

            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }
        } else {
            return "Delete not Completed : You do not have permissions..!";
        }
    }
}
