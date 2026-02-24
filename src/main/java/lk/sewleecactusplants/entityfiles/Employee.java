package lk.sewleecactusplants.entityfiles;

import java.time.LocalDate;
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
@Table (name = "employee_details") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors
public class Employee {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;

    @Column(name = "employee_no" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String employee_no;

    @Column(name = "fullname" , unique = true) //unique
    @NotNull  // cannot be empty
    private String fullname;

    @Column(name = "callingname" , unique = true) //unique
    @NotNull // cannot be empty
    private String callingname;

    @Column(name = "nic" , unique = true) //unique
    @NotNull // cannot be empty
    @Length(max = 12, min = 10) //standard length
    private String nic;
    
    @NotNull // cannot be empty
    private LocalDate dob;

    @NotNull // cannot be empty
    private String gender; 

    @NotNull // cannot be empty
    private String address;

    @Column(name = "email" , unique = true) //unique
    @NotNull // cannot be empty
    private String email;
    
    @NotNull // cannot be empty
    @Length(max = 10) //standard length
    private String mobile_no;

    @Length(max = 10) //standard length
    private String land_no; 

    @NotNull // cannot be empty
    private String civil_status; 

    private String note;

    private byte[] employee_photo;

    @NotNull // cannot be empty
    private LocalDateTime added_datetime;

    private LocalDateTime modify_datetime;

    private LocalDateTime deleted_datetime;

    @NotNull // cannot be empty
    private Integer added_user_id; 

    private Integer modify_user_id;

    private Integer delete_user_id;

    @ManyToOne // employee (many) -------designation (one)
    @JoinColumn(name = "designation_id" , referencedColumnName = "id") //FK (Foreign key)
    private Designation designation_id;

    @ManyToOne // employee (many) -------employee_status (one)
    @JoinColumn(name = "employee_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private EmployeeStatus employee_status_id;

}
