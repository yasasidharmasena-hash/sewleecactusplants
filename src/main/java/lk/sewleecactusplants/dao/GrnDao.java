package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Grn;
public interface GrnDao extends JpaRepository<Grn, Integer>{

     @Query(value = "select g from Grn g where g.purchaseorder_details_id.supplier_details_id.id=?1 and g.grn_status_id.id=1 and g.net_amount<>g.paid_amount")
    public List<Grn> getBySupplierId(Integer supplierid);



}
