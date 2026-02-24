package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Privilege;

public interface PrivilegeDao extends JpaRepository<Privilege,Integer> {

    // query to get privilege by role id and module id --- to check duplicates
    @Query(value = "select p  from Privilege p where p.role_id.id = ?1 and p.modules_id.id = ?2")
    Privilege getPrivilegeByRoleModules(Integer roleid, Integer modulesid);
    
    @Query (value = "SELECT bit_or(p.privilege_select) as selct , bit_or(p.privilege_insert) as insrt , bit_or(p.privilege_update) as updt , bit_or(p.privilege_delete) as delt FROM sewleecactusplants.privilege_details as p where p.modules_id in (select m.id from sewleecactusplants.modules as m where m.name= ?2) and p.role_id in (select uhr.role_id from sewleecactusplants.user_details_has_role as uhr where uhr.user_details_id in(select u.id from sewleecactusplants.user_details as u where u.username= ?1));" , nativeQuery = true) 
    String getUserPrivilegeByUserModule (String username , String modulename) ;

    
    

}
