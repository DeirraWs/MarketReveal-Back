//Search filters

search-filters-message-header = Your filters

minPrice = Min price
    .inputDesc = Write the minimum price of the product you want to find in uah...
    .values = {$value} uah

maxPrice = Max price
    .inputDesc = Write the maximum price of the product you want to find in uah...
    .values = {$value} uah

state = State
    .inputDesc = Choose the state of the product you want to find...
    .values = { $value ->
        [new] New
        [used] Used
        *[other] All
    }

Category = 🗂️Category
    .inputDesc = Choose the category of the product you want to find...
    .values = { $value ->
        [smartphones-and-accessories] Smartphones and accessories
        [parts-for-smartphones] Phone parts
        [accessories-for-smartphones] Phone accessories
        *[other] All
    }

SubCategory = 🗂️SubCategory
    .inputDesc = Choose the subcategory of the product you want to find...
    .values = { $value ->
        [smartphones] Smartphones
        [parts-for-smartphones] Phone parts
        [accessories-for-smartphones] Phone accessories
        *[other] All
    }
