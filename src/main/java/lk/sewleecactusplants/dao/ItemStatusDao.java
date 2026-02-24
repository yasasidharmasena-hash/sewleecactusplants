package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.ItemStatus;

public interface ItemStatusDao extends JpaRepository<ItemStatus, Integer> {

}
