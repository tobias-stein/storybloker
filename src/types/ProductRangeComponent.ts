import { StoryBlokComponent, ImageLink } from ".";

export interface ProductRangeComponent extends StoryBlokComponent<"product-range"> {
    name:               string;
    image:              ImageLink;
    tagline:            string;
    highlights:         string;
    benefits:           any[];
    description:        string;
    content:            any[];
    products:           string[];
    id:                 string;
    legacy_ids:         string;
    legacy_description: string;
    images_pim:         any[];
    category:           string;
    position:           string;
    position_pim:       number;
    importance:         number;
    last_update:        string;
    deleted:            boolean;
}

