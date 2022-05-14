import { StoryBlokComponent } from ".";

export interface ProductAttributeComoponent extends StoryBlokComponent<"product-attribute"> {
    max:       string;
    min:       string;
    name:      string;
    unit:      string;
    values:    ProductAttributeValueComponent[];
}

export interface ProductAttributeValueComponent extends StoryBlokComponent<"product-attribute-value"> {
    value:     string;
    value_max: string;
}