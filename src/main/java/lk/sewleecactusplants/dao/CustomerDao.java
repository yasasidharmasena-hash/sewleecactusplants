package lk.sewleecactusplants.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    //get customer by nic
    @Query (value = "select cst from Customer cst where cst.cust_nic=?1")
    Customer getByCustNic(String cust_nic);

     //get customer by email
    @Query (value = "select cst from Customer cst where cst.cust_email=?1")
    Customer getByCustEmail(String cust_email);

    //get the next cust regno by incrementing the max current cust regno
    @Query(value = "SELECT coalesce(concat('CRN' , lpad(substring(max(cst.cust_regno),4)+1,5,0)),'CRN00001') FROM sewleecactusplants.customer_details as cst;", 
    nativeQuery=true)
    String getNxtCustregno();

}
