package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.GrnStatusDao;
import lk.sewleecactusplants.entityfiles.GrnStatus;

@RestController //to get return UI
public class GrnStatusController {

    @Autowired  //to generate EmployeeStatusDao instance
    private GrnStatusDao grnStatusDao ;

    //request mapping to get employeeStatus all data [URL --->/employee_status/alldata]
    @GetMapping(value = "/grn_status/alldata" , produces = "application/json")
    public List<GrnStatus> findAllData() {
        return grnStatusDao.findAll();
    }

    

}
