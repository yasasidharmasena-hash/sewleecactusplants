package lk.sewleecactusplants.dao;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Role;

public interface RoleDao extends JpaRepository<Role, Integer> {

    //get roll list without admin role
    @Query(value = "select r from Role r where r.name<>'Admin'")
    List<Role> withoutAdmin();

    

}
