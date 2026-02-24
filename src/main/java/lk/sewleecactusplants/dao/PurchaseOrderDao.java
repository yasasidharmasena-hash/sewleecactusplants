package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Item;
import lk.sewleecactusplants.entityfiles.PurchaseOrder;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer> {

    // get the next po number by incrementing the max current po number
    @Query(value = "SELECT coalesce(concat('POS' , lpad(substring(max(pod.po_number),4)+1,5,0)),'POS00001') FROM sewleecactusplants.purchaseorder_details as pod;", nativeQuery = true)
    String getNxtPoNumber();

    // get po numbers by supplier id and po is pending
    @Query(value = "SELECT * FROM sewleecactusplants.purchaseorder_details as pod WHERE pod.supplier_details_id=?1 AND pod.purchaseorder_status_id=1", nativeQuery = true)
    List<PurchaseOrder> getPoBySupplierid(Integer supplierid);




}
