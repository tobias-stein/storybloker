import { StoryBlokComponent } from ".";

export interface CountryComponent extends StoryBlokComponent<""> {
    name:         string;
    name_native:  string;
    iso_alpha2:   string;
    iso_alpha3:   string;
    languages:    string;
    region:       string;
    calling_code: string;
    tld:          string;
}
