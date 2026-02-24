package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.PriceList;
import lk.sewleecactusplants.entityfiles.PriceRequest;

public interface PriceListDao extends JpaRepository <PriceList, Integer> {

    //get the next pricelist number by incrementing the max current pricelist number
   @Query(value = "SELECT coalesce(concat('PLN' , lpad(substring(max(pl.pricelist_number),4)+1,5,0)),'PLN00001') FROM sewleecactusplants.pricelist as pl;",
   nativeQuery = true)
    String getNxtPriceListNumber();

    //get price list by price request code
    @Query(value = "select pl from PriceList pl where pl.pricerequest_id=?1")
    PriceList getByPriceRequestCode(PriceRequest pricerequest_id);

    //get price list by supplier id and price list is valid
    @Query(value = "select pl from PriceList pl where pl.pricerequest_id.supplier_details_id.id=?1 and pl.pricelist_status_id.id=1")
    public List<PriceList> getBySupplierId(Integer supplierid);

}
