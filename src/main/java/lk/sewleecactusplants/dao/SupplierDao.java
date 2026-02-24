package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Supplier;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    // get supplier by email
    @Query(value = "select s from Supplier s where s.sup_email =?1")
    Supplier getBySupEmail(String sup_email);

    // get supplier by Account number
    @Query(value = "select s from Supplier s where s.account_no =?1")
    Supplier getBySupAcctno(String account_no);

    // get the next supplier code by incrementing the max current supplier code
    @Query(value = "SELECT coalesce(concat('SCS' , lpad(substring(max(s.sup_no),4)+1,5,0)),'SCS00001') FROM sewleecactusplants.supplier_details as s;", nativeQuery = true)
    String getNxtSupNo();

}
