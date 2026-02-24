package lk.sewleecactusplants.entityfiles;

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
@Table (name = "supplier_details") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class Supplier {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;
    
    @Column(name = "sup_no" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String sup_no;
    
    @NotNull // cannot be empty
    private String sup_name;
    
    private String business_regno;
    
    @Column(name = "sup_email" , unique = true) //unique
    @NotNull // cannot be empty
    private String sup_email; 
    
    @NotNull // cannot be empty
    @Length(max = 10) //standard length
    private String sup_contactno; 
    
    @NotNull // cannot be empty
    private String sup_address;
    
    @NotNull // cannot be empty
    private String bank_name;
    
    @NotNull // cannot be empty
    private String bank_branchname; 
    
    @NotNull // cannot be empty
    private String account_no;
    
    @NotNull // cannot be empty
    private String acct_holdername;
    
    private String note; 
    
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;
    
    private LocalDateTime modify_datetime; 
    
    private LocalDateTime deleted_datetime; 

    @NotNull // cannot be empty
    private Integer added_user_id; 
    
    private Integer modify_user_id;
    
    private Integer delete_user_id; 
    
    @ManyToOne // supplier (many) -------supplier_status (one)
    @JoinColumn(name = "supplier_status_id" , referencedColumnName = "id") //FK (Foreign key)
    private SupplierStatus supplier_status_id;

    @ManyToMany (cascade = CascadeType.MERGE) //supplier(many) -----items(many)
    @JoinTable(name = "supplier_details_has_item_details", joinColumns = @JoinColumn(name="supplier_details_id"),
    inverseJoinColumns = @JoinColumn(name = "item_details_id")) //connect supplier and items tables using their ids
    private Set<Item> supplierItems;

}
