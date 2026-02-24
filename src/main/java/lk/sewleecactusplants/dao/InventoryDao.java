package lk.sewleecactusplants.dao;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Inventory;

public interface InventoryDao extends JpaRepository<Inventory, Integer>{

    @Query(value ="SELECT * FROM sewleecactusplants.inventory_details as iv where iv.item_details_id=?1 AND iv.costprice=?2;", nativeQuery = true)
    Inventory getByItemId(Integer id, BigDecimal costprice);

    @Query(value ="SELECT * FROM sewleecactusplants.inventory_details as iv where iv.item_details_id=?1 AND iv.available_qty>?2;", nativeQuery = true)
    List <Inventory> getByItemIdAndQuantity(Integer id, Integer quantity);

    //
    @Query(value ="SELECT * FROM sewleecactusplants.inventory_details as iv where iv.item_details_id=?1 AND iv.available_qty>0;", nativeQuery = true)
    List<Inventory> getByItemAvailableQty(Integer itemid);

}
