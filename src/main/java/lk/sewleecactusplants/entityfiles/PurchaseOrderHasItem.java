package lk.sewleecactusplants.entityfiles;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

@Entity // generate as an entity
@Table(name = "purchaseorder_details_has_item_details") // mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // default constructors

public class PurchaseOrderHasItem {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @ManyToOne // PurchaseOrderHasItem(many)------purchaseorder(one)
    @JoinColumn(name = "purchaseorder_details_id", referencedColumnName = "id") // FK
    @JsonIgnore //block reading data or property--stop recursing--save also blocked-- need to write for option on controller to save
    private PurchaseOrder purchaseorder_details_id;

    @ManyToOne // PurchaseOrderHasItem(many)------item(one)
    @JoinColumn(name = "item_details_id", referencedColumnName = "id") // FK
    private Item item_details_id;

    @NotNull // cannot be empty
    private BigDecimal unit_price;

    @NotNull // cannot be empty
    private Integer quantity;

    @NotNull // cannot be empty
    private BigDecimal line_amount;

}
