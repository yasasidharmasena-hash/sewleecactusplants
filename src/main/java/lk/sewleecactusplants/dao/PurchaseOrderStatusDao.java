package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.sewleecactusplants.entityfiles.PurchaseOrderStatus;

public interface PurchaseOrderStatusDao extends JpaRepository <PurchaseOrderStatus, Integer>{

}
