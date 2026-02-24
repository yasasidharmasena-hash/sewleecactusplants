package lk.sewleecactusplants.entityfiles;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table (name = "customer_details") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class Customer {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @NotNull  // cannot be empty
    private String cust_fullname;
    
    @NotNull // cannot be empty
    @Length(max = 10) //standard length
    private String cust_mobileno;
    
    @Column(name = "cust_nic" , unique = true) //unique
    @NotNull // cannot be empty
    @Length(max = 12, min = 10) //standard length
    private String cust_nic;
    
     @Column(name = "cust_email" , unique = true) //unique
    @NotNull // cannot be empty
    private String cust_email; 
    
    @Column(name = "cust_regno" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String cust_regno; 
    
    @NotNull // cannot be empty
    private String cust_address;
    
    private String note;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime; 
    
    private LocalDateTime modify_datetime;
    
    private LocalDateTime deleted_datetime;
    
    @NotNull // cannot be empty
    private Integer added_user_id;
    
    private Integer modify_user_id; 
    
    private Integer delete_user_id; 
    
    @ManyToOne // customer (many) -------customer_status (one)
    @JoinColumn(name = "customer_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private CustomerStatus customer_status_id;

}
