package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table (name = "purchaseorder_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class PurchaseOrder {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Column(name = "po_number" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String po_number;
    
    @NotNull // cannot be empty
    private LocalDate required_date;
    
    @NotNull // cannot be empty
    private BigDecimal total_amount; 
    
    private String note;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;
    
    private LocalDateTime modify_datetime;
    
    private LocalDateTime deleted_datetime; 
    
    @NotNull // cannot be empty
    private Integer added_user_id; 
    
    private Integer modify_user_id;
    
    private Integer delete_user_id;
    
    @ManyToOne // purchase order (many) -------status (one)
    @JoinColumn(name = "purchaseorder_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private PurchaseOrderStatus purchaseorder_status_id;

    @ManyToOne // purchase order (many) -------supplier (one)
    @JoinColumn(name = "supplier_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Supplier supplier_details_id;

    @ManyToOne // purchase order (many) -------price list (one)
    @JoinColumn(name = "pricelist_id" , referencedColumnName = "id") //FK (Foreign key)
    private PriceList pricelist_id;

    @OneToMany(mappedBy = "purchaseorder_details_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <PurchaseOrderHasItem> purchaseOrderHasItemList;

}
