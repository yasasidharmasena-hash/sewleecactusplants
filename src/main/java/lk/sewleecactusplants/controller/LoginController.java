package lk.sewleecactusplants.controller;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.sewleecactusplants.dao.RoleDao;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Role;
import lk.sewleecactusplants.entityfiles.User;

@RestController //to get return UI
public class LoginController {

    @Autowired //generate userDao instance
    private UserDao userDao;

    @Autowired //generate roleDao instance
    private RoleDao roleDao;

    @Autowired //generate bCryptPasswordEncoder instance
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    //request mapping to load login UI [URL --->/login]
    @RequestMapping(value = "/login") 
    public ModelAndView loadLoginUI(){
        ModelAndView loginUI = new ModelAndView();
        loginUI.setViewName("login.html");
        return loginUI;
    }

    //request mapping to load dashboard UI [URL --->/dashboard]
    @RequestMapping(value = "/dashboard")
    public ModelAndView loadDashboardUI(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getByUsername(auth.getName());
        ModelAndView dashboardUI = new ModelAndView();
        dashboardUI.setViewName("dashboard.html");
        dashboardUI.addObject("loggedusername", auth.getName());
        
        dashboardUI.addObject("loggeduserphoto", loggedUser.getUser_photo());
        return dashboardUI;
    }

    //request mapping to load errorpage UI [URL --->/errorpage]
    @RequestMapping(value = "/errorpage")
    public ModelAndView loadErrorPageUI(){
        ModelAndView errorPageUI = new ModelAndView();
        errorPageUI.setViewName("errorpage.html");
        return errorPageUI;
    }

    //request mapping to load admin UI [URL --->/createadmin]
    @RequestMapping(value = "/createadmin")
    public ModelAndView loadAdminAccountUI(){

        User extAdminUser = userDao.getByUsername("Admin");
        if (extAdminUser == null) {

            User adminUser = new User();
            adminUser.setUsername("Admin");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setStatus(true);
            adminUser.setAdded_datetime(LocalDateTime.now());
            adminUser.setPassword(bCryptPasswordEncoder.encode("12345"));

            Set<Role> roles = new HashSet<>();
            Role adminRole = roleDao.getReferenceById(1);
            roles.add(adminRole);
            adminUser.setRoles(roles);

            userDao.save(adminUser);
        }


        ModelAndView loginUI = new ModelAndView();
        loginUI.setViewName("login.html");
        return loginUI;
    }

    

}
