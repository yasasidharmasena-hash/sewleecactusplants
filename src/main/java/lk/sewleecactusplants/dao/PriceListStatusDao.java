package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.PriceListStatus;

public interface PriceListStatusDao extends JpaRepository <PriceListStatus, Integer> {

}
