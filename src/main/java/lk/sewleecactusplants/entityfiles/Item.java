package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;
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
@Table (name = "item_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class Item {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Column(name = "itemcode" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String itemcode;
    
    @NotNull // cannot be empty
    private String itemname;
    
    @NotNull // cannot be empty
    private BigDecimal retailprice; 
    
    @NotNull // cannot be empty
    private BigDecimal costprice; 
    
    @NotNull // cannot be empty
    private BigDecimal profitratio;
    
    @NotNull // cannot be empty
    private BigDecimal discountratio;
    
    @NotNull // cannot be empty
    private BigDecimal reorderpoint;
    
    @NotNull // cannot be empty
    private BigDecimal reorderqty;
    
    @NotNull // cannot be empty
    private BigDecimal unitize;
    
    private Integer itemphoto; 
    
    private String note;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;
    
    private LocalDateTime modify_datetime;
    
    private LocalDateTime deleted_datetime; 
    
    @NotNull // cannot be empty
    private Integer added_user_id; 
    
    private Integer modify_user_id;
    
    private Integer delete_user_id;
    
    @ManyToOne // item (many) -------status (one)
    @JoinColumn(name = "item_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private ItemStatus item_status_id;

    @ManyToOne // item (many) -------sub category (one)
    @JoinColumn(name = "item_subcategory_id" , referencedColumnName = "id") //FK (Foreign key)
    private ItemSubcategory item_subcategory_id;

    /*public Item(Integer id, String itemcode, String itemname, BigDecimal retailprice, BigDecimal costprice, ItemStatus item_status_id){
        this.id = id;
        this.itemcode = itemcode;
        this.itemname =itemname;
        this.retailprice = retailprice;
        this.costprice = costprice;
        this.item_status_id = item_status_id;
    }*/

}
