package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import lk.sewleecactusplants.entityfiles.Employee;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    //get the next employee_no by incrementing the max current employee_no
    @Query(value = "SELECT coalesce(concat('EMP' , lpad(substring(max(i.employee_no),4)+1,5,0)),'EMP00001') FROM sewleecactusplants.employee_details as i;", nativeQuery=true)
    String getNxtEmpNo();

    //get employee by nic
    @Query (value = "select e from Employee e where e.nic=?1")
    Employee getByNic(String nic);

    //get employee by email
    @Query (value = "select e from Employee e where e.email = :email")
    Employee getByEmail(@Param("email") String email);

   // @Query(value = "select t From Test t order by t.id desc")public List <Test> findAll();

    @Query(value = "SELECT e FROM Employee e where e.id not in(select u.employee_details_id.id from User u where u.employee_details_id is not null)")
    List<Employee> withoutUserAccount();

}
