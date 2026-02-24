package lk.sewleecactusplants.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.sewleecactusplants.entityfiles.ItemSubcategory;

public interface ItemSubcategoryDao extends JpaRepository<ItemSubcategory, Integer> {

    // to get all item subcategories that belong to the item category id
    @Query (value = "SELECT isc FROM ItemSubcategory isc where isc.item_category_id.id = ?1")

    public List <ItemSubcategory> byItemCategory(Integer categoryid);

}
