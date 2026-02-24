package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.CustomerStatus;

public interface CustomerStatusDao extends JpaRepository<CustomerStatus, Integer> {

}
