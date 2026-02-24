package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.PriceRequest;

public interface PriceRequestDao extends JpaRepository <PriceRequest, Integer>{

    // get the next request code by incrementing the max current supplier code
    @Query(value = "SELECT coalesce(concat('PRC' , lpad(substring(max(pr.request_code),4)+1,5,0)),'PRC00001') FROM sewleecactusplants.pricerequest as pr;", nativeQuery = true)
    String getNxtRequesteCode();

    //get request code by supplier
    @Query(value = "SELECT pr FROM PriceRequest pr where pr.supplier_details_id.id=?1")
    public List <PriceRequest>bySupplierrCodes(Integer supplierid);

}
