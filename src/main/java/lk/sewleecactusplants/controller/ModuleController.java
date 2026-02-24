package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.ModuleDao;
import lk.sewleecactusplants.entityfiles.Module;

@RestController //to get return UI
public class ModuleController {

    @Autowired //generate ModuleDao instance
    private ModuleDao moduleDao;
    

    //request mapping to load module all data [URL --->/modules/alldata]
    @GetMapping(value = "/modules/alldata" , produces = "application/json")
    public List<Module> findAllData(){
        return moduleDao.findAll();
    }

}
