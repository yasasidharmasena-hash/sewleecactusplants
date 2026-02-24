package lk.sewleecactusplants.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.sewleecactusplants.dao.UserDao;
import lk.sewleecactusplants.entityfiles.Role;
import lk.sewleecactusplants.entityfiles.User;

@Service
public class MyUserServiceDetails implements UserDetailsService {

    @Autowired //generate userDao instance
    private UserDao userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println(username);

        User extUser = userDao.getByUsername(username);

        Set<GrantedAuthority>authority = new HashSet();
        for(Role userRole : extUser.getRoles()){
            authority.add(new SimpleGrantedAuthority(userRole.getName()));
        }

        return new org.springframework.security.core.userdetails.User(extUser.getUsername(),extUser.getPassword(),extUser.getStatus(),true,true,true, authority);
        
    }

}
