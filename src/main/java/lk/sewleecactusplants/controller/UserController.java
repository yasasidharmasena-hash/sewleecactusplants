package lk.sewleecactusplants.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController //to get return UI
@RequestMapping (value = "/user_details") //can't implmnt other services ther than user_details
public class UserController {

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    //request mapping to load user UI [URL --->/user]
    @RequestMapping()
    public ModelAndView loadUserUI(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView userUI = new ModelAndView();
        userUI.setViewName("user.html");
        userUI.addObject("title", "User Management");
        userUI.addObject("loggedusername", auth.getName()); //logged person

        return userUI;
    }

    //request mapping to load user all data [URL --->/user_details/alldata]
    @GetMapping(value = "/alldata" , produces = "application/json")
    public List<User> findAllData() {

         // check logged user's autorization -----> is this user has permission?
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivilege_select()) {
            return userDao.findAll(auth.getName()); //need to sort and filter
        } else {
            return new ArrayList<>();
        }
    }

    //request DELETE mapping for Delete data[URL -->/user_details/delete]
    @DeleteMapping(value = "/delete")
    public String deleteUserData(@RequestBody User user) {

        // check logged user's autorization -----> is this user has permission?
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivilege_delete()) {

            //check duplicates
            User extUser = userDao.getReferenceById(user.getId());
            if (extUser == null) {
                return "Delete Not Completed : User does not exist! ";
            }

            try {
                extUser.setStatus(false);
                extUser.setDeleted_datetime(LocalDateTime.now());

                userDao.save(extUser);
                return "OK";
                
            } catch (Exception e) {
                return "Delete not Completed : " + e.getMessage();
            }

        }else{
            return "Delete not Completed : You do not have permissions..!";
        }
    }  

    //request POST mapping for insert data[URL -->/user_details/insert]
    @PostMapping(value = "/insert")
    public String insertUserData(@RequestBody User user) {

        // check logged user's autorization -----> is this user has permission?
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivilege_insert()) {

            try {
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));;
                user.setAdded_datetime(LocalDateTime.now());

                userDao.save(user);
                return "OK";
                
            } catch (Exception e) {
                return "Insert not Completed : " + e.getMessage();
            }

        }else{
            return "Insert not Completed : You do not have permissions..!";
        }
    } 

    //request PUT mapping for update data[URL -->/user_details/update]
    @PutMapping(value = "/update")
    public String updateUserData(@RequestBody User user) {

        // check logged user's autorization -----> is this user has permission?
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "User");

        if (userPrivilege.getPrivilege_update()) {

            // check exist
            User extUser = userDao.getReferenceById(user.getId());
            if (extUser == null) {
                return "Update Not Completed : User does not exist! ";
            }

            //check duplicates

            try {
                //user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));;
                user.setModify_datetime(LocalDateTime.now());

                userDao.save(user);
                return "OK";
                
            } catch (Exception e) {
                return "Insert not Completed : " + e.getMessage();
            }

        }else{
            return "Insert not Completed : You do not have permissions..!";
        }
    }

}
