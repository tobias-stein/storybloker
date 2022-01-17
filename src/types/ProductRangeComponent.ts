import { StoryBlokComponent, ImageLink } from ".";

export interface ProductRangeComponent extends StoryBlokComponent {
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
    position:           number;
    importance:         number;
    last_update:        string;
}

