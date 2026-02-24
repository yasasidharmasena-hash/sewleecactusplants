package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.DesignationDao;
import lk.sewleecactusplants.entityfiles.Designation;

@RestController //to get return UI
public class DesignationController {

    @Autowired //generate DesignationDao instance
    private DesignationDao designationDao;
    

    //request mapping to load designation all data [URL --->/designation/alldata]
    @GetMapping(value = "/designation/alldata" , produces = "application/json")
    public List<Designation> findAllData(){
        return designationDao.findAll();
    }

}
