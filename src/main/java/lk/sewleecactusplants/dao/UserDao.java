package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.User;

public interface UserDao extends JpaRepository<User , Integer> {

    // Find a user using their username (username = 1)
    @Query(value = "select u from User u where u.username=?1")
    User getByUsername(String username);

    // Get all users except 'Admin' and sort descending by ID 
    @Query(value = "select u from User u where u.username<> ?1 and u.username<>'Admin' order by u.id desc ")
    List<User> findAll (String username);

}
