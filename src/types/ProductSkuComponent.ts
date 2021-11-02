import { StoryBlokComponent } from ".";

export interface ProductSkuComponent extends StoryBlokComponent {

    name:            string;
    item:            string;
    property:        ProductSkuPropertyComponent[];
    sellable:        boolean;
    price:           number;
    full_price:      number;
    images:          string[];
    expired:         boolean;
    replacement_sku: string;
    id:              string;
    legacy_ids:      string;
    last_update:     string;
}

export interface ProductSkuPropertyComponent extends StoryBlokComponent {
    name:            string;
    property:        string;
    value:           string;
}