package lk.sewleecactusplants.entityfiles;

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
@Table(name = "privilege_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class Privilege {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id; 
    
    @NotNull // cannot be empty
    private Boolean privilege_select;
    
    @NotNull // cannot be empty
    private Boolean privilege_insert; 
    
    @NotNull // cannot be empty
    private Boolean privilege_update;
    
    @NotNull // cannot be empty
    private Boolean privilege_delete;
    
    @ManyToOne  //privilege (many) -------role (one)
    @JoinColumn(name = "role_id", referencedColumnName = "id") //FK (Foreign key)
    private Role role_id;
    
    @ManyToOne //privilege (many) -------modules (one)
    @JoinColumn(name = "modules_id", referencedColumnName = "id") //FK (Foreign key)
    private Module modules_id;

}
