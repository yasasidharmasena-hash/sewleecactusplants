package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;
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
@Table (name = "customer_invoice") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class CustomerInvoice {
    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Column(name = "invoice_number" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String invoice_number;
    
    @NotNull // cannot be empty
    private BigDecimal total_amount;

    @NotNull // cannot be empty
    private BigDecimal discount_amount;

    @NotNull // cannot be empty
    private BigDecimal net_amount;

    private String note;

     @NotNull // cannot be empty
    private LocalDateTime added_datetime; 

    @NotNull // cannot be empty
    private Integer added_user_id;

    @NotNull // cannot be empty
    private BigDecimal paid_amount;

    @NotNull // cannot be empty
    private BigDecimal balance_amount;

    @NotNull // cannot be empty
    private String payment_method;

    @NotNull // cannot be empty
    private Boolean delivery_required;
    
    private String contact_person;

    @Length(max = 10) //standard length
    private String contact_number;

    private String delivery_address;
    
    @ManyToOne // customer invoice (many) -------customer (one)
    @JoinColumn(name = "customer_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Customer customer_details_id;

   /*@ManyToMany (cascade = CascadeType.MERGE) //supplier(many) -----items(many)
    @JoinTable(name = "customer_invoice_has_item_details", joinColumns = @JoinColumn(name="customer_invoice_id"),
    inverseJoinColumns = @JoinColumn(name = "item_details_id")) //connect supplier and items tables using their ids
    private Set<Item> customerInvoiceHasItem;*/

    @OneToMany(mappedBy = "customer_invoice_id" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List <CustomerInvoiceHasItem> customerInvoiceHasItemList;

}
