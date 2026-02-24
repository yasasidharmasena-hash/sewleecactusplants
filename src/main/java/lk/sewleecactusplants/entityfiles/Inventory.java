package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;
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
@Table (name = "inventory_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class Inventory {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;

    @NotNull // cannot be empty
    private Integer available_qty;

    @NotNull // cannot be empty
    private Integer total_qty;

    @NotNull // cannot be empty
    private Integer damaged_qty;

    @NotNull // cannot be empty
    private BigDecimal retailprice; 
    
    @NotNull // cannot be empty
    private BigDecimal costprice;
     
    @ManyToOne // inventory (many) -------item (one)
    @JoinColumn(name = "item_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Item item_details_id;

}
