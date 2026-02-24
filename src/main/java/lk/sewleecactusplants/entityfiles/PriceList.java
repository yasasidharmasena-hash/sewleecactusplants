package lk.sewleecactusplants.entityfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table (name = "pricelist") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class PriceList {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Column(name = "pricelist_number" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String pricelist_number;
    
    @NotNull // cannot be empty
    private LocalDate received_date;
    
    @NotNull // cannot be empty
    private LocalDate valid_date; 
    
    private String note; 
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;
    
    private LocalDateTime modify_datetime; 
    
    private LocalDateTime deleted_datetime; 
    
    @NotNull // cannot be empty
    private Integer added_user_id; 
    
    private Integer modify_user_id; 
    
    private Integer delete_user_id; 
    
    @ManyToOne // pricelist (many) -------price request (one)
    @JoinColumn(name = "pricerequest_id" , referencedColumnName = "id") //FK (Foreign key)
    private PriceRequest pricerequest_id; 
    
    @ManyToOne // pricelist (many) -------status (one)
    @JoinColumn(name = "pricelist_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private PriceListStatus pricelist_status_id;

    /*@ManyToMany (cascade = CascadeType.MERGE) //pricelist(many) -----items(many)
    @JoinTable(name = "pricelist_has_item_details", joinColumns = @JoinColumn(name="pricelist_id"),
    inverseJoinColumns = @JoinColumn(name = "item_details_id")) //connect pricerequest and items tables using their ids
    private Set<Item> pricelistItems;*/

    @OneToMany(mappedBy = "pricelist_id" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List <PriceListHasItem> priceListHasItemList;
 

}
