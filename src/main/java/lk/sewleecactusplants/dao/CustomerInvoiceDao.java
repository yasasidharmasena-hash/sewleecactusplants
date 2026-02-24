package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.sewleecactusplants.entityfiles.CustomerInvoice;

public interface CustomerInvoiceDao extends JpaRepository<CustomerInvoice, Integer> {

    //get the next invoice_number by incrementing the max current invoice_number
    @Query(value = "SELECT coalesce(concat('CIN' , lpad(substring(max(c.invoice_number),4)+1,5,0)),'CIN00001') FROM sewleecactusplants.customer_invoice as c;", nativeQuery=true)
    String getNxtInvoiceNo();

}
