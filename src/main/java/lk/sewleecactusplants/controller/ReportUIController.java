package lk.sewleecactusplants.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.User;

@RestController
public class ReportUIController {

    @Autowired // generate UserDao instance, link dao
    private UserDao userDao;

    @Autowired // create constructor
    private UserPrivilegeController userPrivilegeController;

    // request mapping to load reportone UI [URL --->/reportOne]
    @GetMapping(value = "/reportone")
    public ModelAndView loadReportOneUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        ModelAndView reportOneUI = new ModelAndView();
        reportOneUI.setViewName("reportone.html");
        reportOneUI.addObject("title", "Report One");
        reportOneUI.addObject("loggedusername", auth.getName()); // logged person

        reportOneUI.addObject("loggeduserPhoto", loggedUser.getUser_photo());

        return reportOneUI;
    }

    // request mapping to load reportPaymentUI [URL --->/reportpayment]
    @GetMapping(value = "/reportpayment")
    public ModelAndView loadReportPaymentUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        ModelAndView reportPaymentUI = new ModelAndView();
        reportPaymentUI.setViewName("reportpayment.html");
        reportPaymentUI.addObject("title", "Payment Report");
        reportPaymentUI.addObject("loggedusername", auth.getName()); // logged person

        reportPaymentUI.addObject("loggeduserPhoto", loggedUser.getUser_photo());

        return reportPaymentUI;
    }

     // request mapping to load reportEmployeeUI [URL --->/reportemployee]
    @GetMapping(value = "/reportemployee")
    public ModelAndView loadReportEmployeeUI() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());

        ModelAndView reportEmployeeUI = new ModelAndView();
        reportEmployeeUI.setViewName("reportemployee.html");
        reportEmployeeUI.addObject("title", "Employee Report");
        reportEmployeeUI.addObject("loggedusername", auth.getName()); // logged person

        reportEmployeeUI.addObject("loggeduserPhoto", loggedUser.getUser_photo());

        return reportEmployeeUI;
    }

}
