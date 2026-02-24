package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.CascadeType;
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
@Table (name = "grn_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class Grn {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Length(max = 12) //standard length
    @NotNull // cannot be empty
    private String supplier_billnumber;
    
    @NotNull // cannot be empty
    private LocalDate received_date;
    
    @NotNull // cannot be empty
    private BigDecimal total_amount; 

    @NotNull // cannot be empty
    private BigDecimal discount;

    @NotNull // cannot be empty
    private BigDecimal net_amount;
    
    private String note;
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;
    
    @NotNull // cannot be empty
    private Integer added_user_id; 

    @NotNull // cannot be empty
    private BigDecimal paid_amount;
    
    @ManyToOne //  Grn (many) -------purchase order (one)
    @JoinColumn(name = "purchaseorder_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private PurchaseOrder purchaseorder_details_id;

    @ManyToOne //  Grn (many) -------status (one)
    @JoinColumn(name = "grn_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private GrnStatus grn_status_id;

    @OneToMany(mappedBy = "grn_details_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List <GrnHasItem> grnHasItemList;

    

}
