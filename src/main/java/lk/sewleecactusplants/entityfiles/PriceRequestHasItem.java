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
@Table (name = "pricerequest_has_item_details") //mapping table
@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors

public class PriceRequestHasItem {

    @Id
    @ManyToOne  //PriceRequestHasItem(many)------pricerequest(one)
    @JoinColumn(name = "pricerequest_id", referencedColumnName = "id") //FK
    private PriceRequest pricerequest_id;

    @Id
    @ManyToOne //PriceRequestHasItem(many)------supplier(one)
    @JoinColumn(name = "item_details_id", referencedColumnName = "id") //FK
    private Item item_details_id;
    
}
