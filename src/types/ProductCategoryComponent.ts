import { StoryBlokComponent } from ".";

export interface ProductCategoryComponent extends StoryBlokComponent<""> 
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
}

export interface ProductCategoryFilterComponent extends StoryBlokComponent<""> 
{
    name: string;
    property: string;
    type: string;
}