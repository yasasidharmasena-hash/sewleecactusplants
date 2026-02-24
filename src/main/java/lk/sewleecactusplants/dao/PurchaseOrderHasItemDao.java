package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.PurchaseOrderHasItem;

public interface PurchaseOrderHasItemDao extends JpaRepository <PurchaseOrderHasItem, Integer> {

    // //query to get PurchaseOrderHasItem record by item ID and purchaseorder ID
    @Query(value = "SELECT * FROM sewleecactusplants.purchaseorder_details_has_item_details as pohi where pohi.item_details_id=?1 and pohi.purchaseorder_details_id=?2;", nativeQuery = true)
    PurchaseOrderHasItem getByPurchaseOrderItem (Integer itemid, Integer podid);


}
