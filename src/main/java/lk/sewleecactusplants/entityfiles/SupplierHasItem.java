package lk.sewleecactusplants.entityfiles;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table (name = "supplier_details_has_item_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class SupplierHasItem {

    @Id
    @ManyToOne  //supplierHasItem(many)------item(one)
    @JoinColumn(name = "item_details_id", referencedColumnName = "id") //FK
    private Item item_details_id;

    @Id
    @ManyToOne //supplierHasItem(many)------supplier(one)
    @JoinColumn(name = "supplier_details_id", referencedColumnName = "id") //FK
    private Supplier supplier_details_id;

}
