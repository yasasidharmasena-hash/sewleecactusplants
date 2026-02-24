package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.PriceListHasItem;

public interface PriceListHasItemDao extends JpaRepository <PriceListHasItem, Integer> {

    //query to get PriceListHasItem record by item ID and price list ID
    @Query(value = "SELECT * FROM sewleecactusplants.pricelist_has_item_details as plhi where plhi.item_details_id=?1 and plhi.pricelist_id=?2;", nativeQuery = true)
    PriceListHasItem getByPriceListItem (Integer itemid, Integer priceid);


}
