package lk.sewleecactusplants.entityfiles;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //generate as an entity
@Table(name = "supplier_status") //mapping table

@Data // generate setters & getters--- because attributes are private
@AllArgsConstructor //all argument constructor
@NoArgsConstructor // default constructors
public class SupplierStatus {

    @Id  //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI--Auto generate
    private Integer id;

    @NotNull //cannot be empty
    private String name;

}
