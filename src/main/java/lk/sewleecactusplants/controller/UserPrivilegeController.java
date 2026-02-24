package lk.sewleecactusplants.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import lk.sewleecactusplants.dao.PrivilegeDao;
import lk.sewleecactusplants.entityfiles.Privilege;

@Controller
public class UserPrivilegeController {

    @Autowired // get privilegeDao instance
    private PrivilegeDao privilegeDao;
   

    // define function for get privilege by given username and modulename
    public Privilege getPrivilegeByUserModule(String username, String modulename) {

        Privilege userPrivilege = new Privilege();
        if (username.equals("Admin")) {

            userPrivilege.setPrivilege_select(true);
            userPrivilege.setPrivilege_insert(true);
            userPrivilege.setPrivilege_update(true);
            userPrivilege.setPrivilege_delete(true);

        } else {

            String userPrivilegeString = privilegeDao.getUserPrivilegeByUserModule(username, modulename);
            String[] userPrivilegeArray = userPrivilegeString.split(",");
            System.out.println(userPrivilegeArray);

            userPrivilege.setPrivilege_select(userPrivilegeArray[0].equals("1"));
            userPrivilege.setPrivilege_insert(userPrivilegeArray[1].equals("1"));
            userPrivilege.setPrivilege_update(userPrivilegeArray[2].equals("1"));
            userPrivilege.setPrivilege_delete(userPrivilegeArray[3].equals("1"));

        }

        return userPrivilege;
    }

}
