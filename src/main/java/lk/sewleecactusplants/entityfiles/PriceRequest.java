package lk.sewleecactusplants.entityfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table (name = "pricerequest") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class PriceRequest {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Column(name = "request_code" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String request_code;
    
    @NotNull // cannot be empty
    private LocalDate required_date;
    
    private String note;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;
    
    private LocalDateTime modify_datetime; 
    
    private LocalDateTime deleted_datetime;
    
    @NotNull // cannot be empty
    private Integer added_user_id; 
    
    private Integer modify_user_id; 
    
    private Integer delete_user_id;  

    @ManyToOne // pricerequest (many) -------supplier (one)
    @JoinColumn(name = "supplier_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Supplier supplier_details_id;

    @ManyToOne // pricerequest (many) -------status (one)
    @JoinColumn(name = "pricerequest_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private PriceRequestStatus pricerequest_status_id;

    @ManyToMany (cascade = CascadeType.REMOVE) //pricerequest(many) -----items(many)
    @JoinTable(name = "pricerequest_has_item_details", joinColumns = @JoinColumn(name="pricerequest_id"),
    inverseJoinColumns = @JoinColumn(name = "item_details_id")) //connect pricerequest and items tables using their ids
    private Set<Item> priceRequestItems;

}
