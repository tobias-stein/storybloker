import { StoryBlokComponent } from ".";

export interface ProductAttributeComoponent extends StoryBlokComponent<""> {
    max:       string;
    min:       string;
    name:      string;
    unit:      string;
    values:    ProductAttributeValueComponent[];
}

export interface ProductAttributeValueComponent extends StoryBlokComponent<""> {
    value:     string;
    value_max: string;
}