package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.RoleDao;
import lk.sewleecactusplants.entityfiles.Role;

@RestController //to get return UI
public class RoleController {

    @Autowired //generate RoleDao instance
    private RoleDao roleDao;
    

    //request mapping to load role all data [URL --->/role/alldata]
    @GetMapping(value = "/role/alldata" , produces = "application/json")
    public List<Role> findAllData(){
        return roleDao.findAll();
    }

    //request mapping to load role list without admin [URL --->/role/withoutadmin]
    @GetMapping(value = "/role/withoutadmin" , produces = "application/json")
    public List<Role> withoutAdmin(){
        return roleDao.withoutAdmin();
    }

    

}
