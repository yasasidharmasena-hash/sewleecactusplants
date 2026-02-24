package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.DamagedItem;

public interface DamagedItemDao extends JpaRepository<DamagedItem, Integer>{

}
