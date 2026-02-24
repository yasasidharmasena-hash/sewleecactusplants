package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import lk.sewleecactusplants.entityfiles.Item;

public interface ItemDao extends JpaRepository<Item, Integer> {

    // get item by itemname
    @Query(value = "select i from Item i where i.itemname=?1")
    Item getByItemname(String itemname);

    // get the next itemcode by incrementing the max current itemcode
    @Query(value = "SELECT coalesce(concat('ICS' , lpad(substring(max(i.itemcode),4)+1,5,0)),'ICS00001') FROM sewleecactusplants.item_details as i;", nativeQuery = true)
    String getNxtItemcode();

    // get all items that the selcted supplier doesn't supply
    @Query("select i from Item i where i.id not in (select shi.item_details_id.id from SupplierHasItem shi where shi.supplier_details_id.id=?1)")
    List<Item> getUnsuppliedItems(Integer supplierid);

    //get all items that the selected supplier supply
    @Query(value = "SELECT * FROM sewleecactusplants.item_details as i where i.id in (SELECT shi.item_details_id FROM sewleecactusplants.supplier_details_has_item_details as shi where shi.supplier_details_id=?1);" , nativeQuery = true)
    List<Item> getItemBySupplier(Integer supplierid);

    //get all items that the selected supplier supply
    @Query(value = "SELECT * FROM sewleecactusplants.item_details as i where i.id in (SELECT shi.item_details_id FROM sewleecactusplants.supplier_details_has_item_details as shi where shi.supplier_details_id=?1) and i.id not in(SELECT pri.item_details_id FROM sewleecactusplants.pricerequest_has_item_details as pri where pri.pricerequest_id=?2);" , nativeQuery = true)
    List<Item> getItemBySupplierNotInRequest(Integer supplierid, Integer requestid);

    //get items that belong to price request code
    @Query(value = "SELECT * FROM sewleecactusplants.item_details as i where i.id in (SELECT prhi.item_details_id FROM sewleecactusplants.pricerequest_has_item_details as prhi where prhi.pricerequest_id= ?1);" , nativeQuery = true)
    List<Item> getItemByRequestCode (Integer pricerequestid);

    //get items list
    @Query(value = "SELECT * FROM sewleecactusplants.item_details as i where i.item_status_id=1" , nativeQuery = true)
    List<Item> getItemList();

    //get items that belong to the selected pricelist
    @Query(value = "SELECT * FROM sewleecactusplants.item_details as i where i.id in (SELECT plhi.item_details_id FROM sewleecactusplants.pricelist_has_item_details as plhi where plhi.pricelist_id= ?1);" , nativeQuery = true)
    List<Item> getItemByPriceListNumber(Integer pricelistid);

    
    //get items that belong to the selected po
    @Query(value = "SELECT * FROM sewleecactusplants.item_details as i where i.id in (SELECT pohi.item_details_id FROM sewleecactusplants.purchaseorder_details_has_item_details as pohi where pohi.purchaseorder_details_id= ?1);" , nativeQuery = true)
    List<Item> getItemByPoNumber(Integer poid);

    
    
    
}
