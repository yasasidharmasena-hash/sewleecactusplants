package lk.sewleecactusplants.entityfiles;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table (name = "user_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class User {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @NotNull // cannot be empty
    @Column(name = "username" , unique = true) //unique
    private String username; 
    
    @NotNull // cannot be empty
    private String password;
    
    @NotNull // cannot be empty
    @Column(name = "email", unique = true) //unique
    private String email;
    
    @NotNull // cannot be empty
    private Boolean status;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime; 
    
    private LocalDateTime modify_datetime;
    
    private LocalDateTime deleted_datetime;
    
    private String note; 
    
    private byte[] user_photo;
    
    @ManyToOne(optional = true)  //user(many)------employee(one)
    @JoinColumn(name = "employee_details_id", referencedColumnName = "id") //FK
    private Employee employee_details_id;

    @ManyToMany (cascade = CascadeType.MERGE) //user(many) -----roles(many)
    @JoinTable(name = "user_details_has_role", joinColumns = @JoinColumn(name="user_details_id"), inverseJoinColumns = @JoinColumn(name = "role_id")) //connect user and roles tables using their ids
    private Set<Role> roles;

}
