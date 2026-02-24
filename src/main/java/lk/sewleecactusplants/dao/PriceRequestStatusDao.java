package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.PriceRequestStatus;

public interface PriceRequestStatusDao extends JpaRepository <PriceRequestStatus, Integer> {

}
