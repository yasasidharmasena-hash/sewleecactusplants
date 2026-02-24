package lk.sewleecactusplants.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.EmployeeStatusDao;
import lk.sewleecactusplants.entityfiles.EmployeeStatus;

@RestController //to get return UI
public class EmployeeStatusController {

    @Autowired  //to generate EmployeeStatusDao instance
    private EmployeeStatusDao employeeStatusDao;

    //request mapping to get employeeStatus all data [URL --->/employee_status/alldata]
    @GetMapping(value = "/employee_status/alldata" , produces = "application/json")
    public List<EmployeeStatus> findAllData() {
        return employeeStatusDao.findAll();
    }

    

}
