import { StoryBlokComponent, ImageLink } from ".";
import { ProductSkuComponent } from "./ProductSkuComponent";
export interface ProductComponent extends StoryBlokComponent {
    name:               string;
    image:              ImageLink;
    highlights:         string;
    description:        string;
    benefits:           any;
    content:            any;
    priority:           number;
    related:            any;
    data:               string;
    id:                 string;
    legacy_ids:         string;
    tagline:            string;
    legacy_description: string;
    images_pim:         string;
    category:           string;
    position:           number;
    importance:         number;
    product_range:      string;
    attributes:         any;
    certificates:       string;
    last_update:        string;
    items:              ProductSkuComponent[] | undefined;
    inserts:            any;
    sku_options:        any;
}