package lk.sewleecactusplants.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.Employee;


public interface ReportDao extends JpaRepository<Employee, Integer> {

    //report for previous six months from current date
    @Query (value = "SELECT monthname(po.added_datetime), sum(po.total_amount) FROM sewleecactusplants.purchaseorder_details as po where date(po.added_datetime) between current_date() - interval 6 month and current_date() group by monthname(po.added_datetime);", nativeQuery = true)
    String [][] getPaymentByPreviousSixMonth();

    //report for the given month range
    @Query (value = "SELECT monthname(po.added_datetime), sum(po.total_amount) FROM sewleecactusplants.purchaseorder_details as po where date(po.added_datetime) between ?1 and ?2 group by monthname(po.added_datetime);", nativeQuery = true)
    String [][] getPaymentForGivenMonthRange(String startDate, String endDate);

    //report for the given week range
    @Query (value = "SELECT week(po.added_datetime), sum(po.total_amount) FROM sewleecactusplants.purchaseorder_details as po where date(po.added_datetime) between ?1 and ?2 group by week(po.added_datetime);", nativeQuery = true)
    String [][] getPaymentForGivenWeekRange(String startDate, String endDate);

    
}
