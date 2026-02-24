package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.EmployeeStatus;

public interface EmployeeStatusDao extends JpaRepository<EmployeeStatus , Integer> {

}
