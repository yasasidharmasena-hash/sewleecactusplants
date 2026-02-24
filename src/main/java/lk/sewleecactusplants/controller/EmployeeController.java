package lk.sewleecactusplants.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.EmployeeDao;
import lk.sewleecactusplants.dao.EmployeeStatusDao;
import lk.sewleecactusplants.dao.RoleDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Employee;
import lk.sewleecactusplants.entityfiles.Privilege;
import lk.sewleecactusplants.entityfiles.Role;
import lk.sewleecactusplants.entityfiles.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController // to get return UI
@RequestMapping(value = "employee_details") // can't implmnt other services other than employee_details
public class EmployeeController {

    @Autowired // generate EmployeeDao instance
    private EmployeeDao employeeDao;

    @Autowired // generate userDao instance
    private UserDao userDao;

    @Autowired // generate roleDao instance
    private RoleDao roleDao;

    @Autowired // generate EmployeeStatusDao instance
    private EmployeeStatusDao employeeStatusDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load employee UI [URL --->/employee_details]
    @RequestMapping()
    public ModelAndView loadEmployeeUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         //User loggedUser = userDao.getByUsername(auth.getName());

        ModelAndView employeeUI = new ModelAndView();
        employeeUI.setViewName("employee.html");
        employeeUI.addObject("title", "Employee Management");
        employeeUI.addObject("loggedusername", auth.getName()); // logged person

        
        //employeeUI.addObject("loggeduserphoto", loggedUser.getUser_photo());

        return employeeUI;
    }

    // request mapping to get all data [URL --->/employee_details/alldata]
    @GetMapping(value = "/alldata", produces = "application/json")
    public List<Employee> findAllData() {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (userPrivilege.getPrivilege_select()) {
            // sort -- first record will be the record added lastly
            return employeeDao.findAll(Sort.by(Direction.DESC, "id")); //sort-first record will be record added lastly
        } else {
            return new ArrayList<>();
        }

    }

    // request mapping to get employee who does not have user account 
    //[URL--->/employee_details/withoutuseraccount]
    @GetMapping(value = "/withoutuseraccount", produces = "application/json")
    public List<Employee> withoutUserAccount() {

        return employeeDao.withoutUserAccount();
    }

    // request POST mapping to insert data [URL->/employee_details/insert]
    @PostMapping(value = "/insert") // for submit button
    public String insertEmployeeData(@RequestBody Employee employee)//@RequestBody->access the object that send from fontend

    {
        // check loged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        // check duplicates (ex: nic, email, mobile)
        Employee extEmployeeByNic = employeeDao.getByNic(employee.getNic());
        if (extEmployeeByNic != null) {
            return "Insert Not Completed : NIC already exists! ";
        }

        Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
        if (extEmployeeByEmail != null) {
            return "Insert Not Completed : Email already exists!";
        }

        // need to write try catch because this access with database
        try {

            // set auto added date (AI --- ex: emp_no, added datetime, added_user)
            employee.setAdded_datetime(LocalDateTime.now());
            employee.setAdded_user_id(loggedUser.getId());
            employee.setEmployee_no(employeeDao.getNxtEmpNo());

            // save operator
            employeeDao.save(employee);

            // dependancies
            if (employee.getDesignation_id().getUseraccount()) {

                User user = new User();
                user.setUsername(employee.getEmployee_no());
                if (employee.getEmployee_photo() != null) {
                    user.setUser_photo(employee.getEmployee_photo());
                }
                user.setEmail(employee.getEmail());
                user.setStatus(true);
                user.setAdded_datetime(LocalDateTime.now());
                user.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));
                user.setEmployee_details_id(employeeDao.getByNic(employee.getNic()));

                Set<Role> roles = new HashSet<>();
                Role role = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
                roles.add(role);

                user.setRoles(roles);

                userDao.save(user);
            }
            return "OK";
        } catch (Exception e) {
            return "Insert not Completed :" + e.getMessage();
        }
    }

    //request PUT mapping to update data [URL->/employee_details/update]
    @PutMapping(value = "/update") // for update button --- modify
    public String updateEmployeeData(@RequestBody Employee employee) {

        // check logged user's autorization -----> is this user has permission?
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege userPrivilege = userPrivilegeController.getPrivilegeByUserModule(auth.getName(), "Employee");

        if (userPrivilege.getPrivilege_update()) {

            // check exist primaryid (employee record)
            if (employee.getId() == null) {
                return "Update Not Completed : Employee does not exist! ";
            }

            Employee extById = employeeDao.getReferenceById(employee.getId());
            if (extById == null) {
                return "Update Not Completed : Employee does not exist! ";
            }

            // check duplicates (ex: nic, email, mobile)
            // used && to check whether the changed record and existing record is same
            Employee extEmployeeByNic = employeeDao.getByNic(employee.getNic());
            if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {
                return "Update Not Completed : NIC already exists! ";
            }

            Employee extEmployeeByEmail = employeeDao.getByEmail(employee.getEmail());
            if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
                return "Update Not Completed : Email already exists!";
            }

            // need to write try catch because this is access with database
            try {

                // set auto added date (AI --- ex: emp_no, added datetime, added_user)
                employee.setModify_datetime(LocalDateTime.now());
                employee.setModify_user_id(1);

                // save operator
                employeeDao.save(employee);

                // dependancies
                return "OK";
            } catch (Exception e) {
                return "Update not Completed :" + e.getMessage();
            }
        } else {
            return "Update not Completed : You do not have permissions..!";
        }

    }

    //request DELETE mapping to delete data [URL->/employee_details/delete]
    @DeleteMapping(value = "/delete") // for delete button
    public String deleteEmployeeData(@RequestBody Employee employee) {

        // check loged user's autorization -----> is this user has permission?

        // check exist primaryid (employee record)
        if (employee.getId() == null) {
            return "Delete Not Completed : Employee does not exist! ";
        }

        Employee extEmployeeById = employeeDao.getReferenceById(employee.getId());
        if (extEmployeeById == null) {
            return "Delete Not Completed : Employee does not exist! ";
        }

        // need to write try catch because this access with database
        try {

            // set auto added date (AI --- ex: emp_no, added datetime, added_user)
            extEmployeeById.setDeleted_datetime(LocalDateTime.now());
            extEmployeeById.setDelete_user_id(1);
            extEmployeeById.setEmployee_status_id(employeeStatusDao.getReferenceById(3));

            // update operator (Convert delete ----> removed)
            employeeDao.save(extEmployeeById);

            // dependancies
            return "OK";
        } catch (Exception e) {
            return "Delete not Completed :" + e.getMessage();
        }
    }

}
