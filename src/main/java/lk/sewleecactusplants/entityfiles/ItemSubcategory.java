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
@Table(name = "item_subcategory") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors
public class ItemSubcategory {

    @Id  //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI--Auto generate
    private Integer id;

    @NotNull //cannot be empty
    private String name;

    @ManyToOne // item sub category (many) -------item category (one)
    @JoinColumn(name = "item_category_id", referencedColumnName = "id") //FK
    private ItemCategory item_category_id;
    

}
