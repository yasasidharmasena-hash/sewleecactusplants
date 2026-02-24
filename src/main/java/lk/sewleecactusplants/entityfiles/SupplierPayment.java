package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table (name = "payment_details") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors
public class SupplierPayment {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    private Integer id;

    @Column(name = "bill_number" , unique = true) //unique
    @Length(max = 8) //standard length
    @NotNull // cannot be empty
    private String bill_number;

    @NotNull // cannot be empty
    private BigDecimal total_amount;

    @NotNull // cannot be empty
    private BigDecimal paid_amount;

    @NotNull // cannot be empty
    private BigDecimal balance_amount;

    private String note;

    @Length(max = 12) //standard length
    private String cheque_no;

    private LocalDate cheque_date;

    private Integer transfer_id;
    private LocalDateTime transfer_datetime;

    @NotNull // cannot be empty
    private String payment_method;
   
    @NotNull // cannot be empty
    private LocalDateTime added_datetime;

    @NotNull // cannot be empty
    private Integer added_user_id; 

    @ManyToOne // payment (many) -------grn (one)
    @JoinColumn(name = "grn_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Grn grn_details_id;

    @ManyToOne // payment (many) -------supplier (one)
    @JoinColumn(name = "supplier_details_id" , referencedColumnName = "id") //FK (Foreign key)
    private Supplier supplier_details_id;

}
