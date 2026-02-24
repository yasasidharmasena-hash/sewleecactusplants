 package lk.sewleecactusplants.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration //configuration class
@EnableWebSecurity //Enables Spring Security
public class Config {

    @Bean
     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        //access authorizations
         http.authorizeHttpRequests(auth ->{
            auth
            .requestMatchers("/bootstrap-5.2.3/**").permitAll()
            .requestMatchers("/css/**").permitAll()
            .requestMatchers("/images/**").permitAll()
            .requestMatchers("/index/**").permitAll()
            .requestMatchers("/login").permitAll()
            .requestMatchers("/createadmin").permitAll()
            .requestMatchers("/dashboard").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager", "Cashier")
            .requestMatchers("/employee_details/**").hasAnyAuthority("Admin" , "Manager" ,"Asst_Manager")
            .requestMatchers("/user_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/privilege_details/**").hasAnyAuthority("Admin" , "Manager" ,"Asst_Manager")
            .requestMatchers("/item_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager" ,"Cashier")
            .requestMatchers("/customer_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager","Cashier")
            .requestMatchers("/supplier_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/pricerequest/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/pricelist/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/purchaseorder_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/grn_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/customer_invoice/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager","Cashier")
            .requestMatchers("/inventory_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager","Cashier")
            .requestMatchers("/damaged_items/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/payment_details/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .requestMatchers("/reportpayment/**").hasAnyAuthority("Admin" , "Manager" , "Asst_Manager")
            .anyRequest().authenticated();    
         })

         // login configuration details
         .formLogin(login -> {
            login
            .loginPage("/login")
            .defaultSuccessUrl("/dashboard", true)
            .failureUrl("/login?error=usernamepassworderror")
            .usernameParameter("username")
            .passwordParameter("password");
         })

         // logout configuration details
         .logout(logout -> {
            logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login");
         })

         // security ----- access denied
         .exceptionHandling(exph -> {
            exph.accessDeniedPage("/errorpage");
         })

         //access third party files ---ex: js files
         .csrf(csrf -> {
            csrf.disable();
         });
         
         return http.build();
     }

     @Bean //create objects
     //BCryptPasswordEncoder---- one way encryption----cannot decryption
     public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
     }

}
