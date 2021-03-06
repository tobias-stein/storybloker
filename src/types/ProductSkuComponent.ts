import { StoryBlokComponent, ImageLink } from ".";
export interface ProductSkuComponent extends StoryBlokComponent<"product-sku"> {

    name:            string;
    item:            string;
    property:        ProductSkuPropertyComponent[];
    sellable:        boolean;
    price:           number;
    full_price:      number;
    images:          ImageLink[];
    expired:         boolean;
    replacement_sku: string;
    id:              string;
    legacy_ids:      string;
    last_update:     string;
}

export interface ProductSkuPropertyComponent extends StoryBlokComponent<"product-sku-property"> {
    name:            string;
    property:        string;
    value:           string;
}