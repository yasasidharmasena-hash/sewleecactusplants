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
@Table (name = "damaged_items") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class DamagedItem {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
   
    private Integer quantity;
    
    private String reason;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime; 
    
    @NotNull // cannot be empty
    private Integer added_user_id; 
    
    @ManyToOne // damaged (many) -------item (one)
    @JoinColumn(name = "item_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Item item_details_id;

}
