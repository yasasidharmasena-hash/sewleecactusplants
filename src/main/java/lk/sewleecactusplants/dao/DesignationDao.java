package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.Designation;

public interface DesignationDao extends JpaRepository<Designation, Integer> {

}
