package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.SupplierPayment;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer>{

     @Query(value = "SELECT coalesce(concat('SSB' , lpad(substring(max(sp.bill_number),4)+1,5,0)),'SSB00001') FROM sewleecactusplants.payment_details as sp;", nativeQuery = true)
    String NxtBillNo();

}
