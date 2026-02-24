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
@Table(name = "pricelist_has_item_details") // mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor // all argument constructor
@NoArgsConstructor // default constructors

public class PriceListHasItem {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @ManyToOne // PriceListHasItem(many)------item(one)
    @JoinColumn(name = "pricelist_id", referencedColumnName = "id") // FK
    @JsonIgnore // block reading property or data
    private PriceList pricelist_id;

    @ManyToOne // PriceListHasItem(many)------item(one)
    @JoinColumn(name = "item_details_id", referencedColumnName = "id") // FK
    private Item item_details_id;

    @NotNull // cannot be empty
    private BigDecimal purchase_price;
}
