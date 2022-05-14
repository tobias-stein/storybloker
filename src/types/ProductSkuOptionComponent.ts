import { StoryBlokComponent } from ".";

export interface ProductSkuOptionComponent extends StoryBlokComponent<"product-sku-option"> {
    name:        string;
    attribute:   string;
}