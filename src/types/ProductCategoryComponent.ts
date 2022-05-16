import { StoryBlokComponent } from ".";

export interface ProductCategoryComponent extends StoryBlokComponent<"product-category"> 
{
    id:             string;
    legacy_ids:     string;
    position:       string;
    position_pim:   number;
    name:           string;
    lead:           string;
    filters:        ProductCategoryFilterComponent[];
    content:        any;
    icon_url:       string;
    deleted:        boolean;
    category:       string;
}

export interface ProductCategoryFilterComponent extends StoryBlokComponent<"product-category-filter"> 
{
    name: string;
    property: string;
    type: string;
}