package lk.sewleecactusplants.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.sewleecactusplants.dao.ReportDao;
import lk.sewleecactusplants.dao.UserDao;

@RestController
public class ReportDataController {

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // generate reportDao instance, link dao
    private ReportDao reportDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping for get payment
    // report[URL-->/reportpayment/bysdedtype?startdate=&enddate=&type=]
    @GetMapping(value = "/reportpayment/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getPaymentReportByDate(@RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate, @RequestParam("type") String type) {

        if (type.equals("Weekly")) {
            return reportDao.getPaymentForGivenWeekRange(startdate, enddate);
        }
        if (type.equals("Monthly")) {
            return reportDao.getPaymentForGivenMonthRange(startdate, enddate);
        }
        return null;
    }

    // request mapping for get payment report 6month[URL->/reportpayment/bysixmonth]
    @GetMapping(value = "/reportpayment/bysixmonth", produces = "application/json")
    public String[][] getPaymentReportBySixMonth() {

        return reportDao.getPaymentByPreviousSixMonth();

    }


}
