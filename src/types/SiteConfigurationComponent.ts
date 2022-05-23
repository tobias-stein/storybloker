import { StoryBlokComponent } from ".";

export interface SiteConfigurationComponent extends StoryBlokComponent<""> 
{
    root:                            string;
    shop_import:                     boolean;
    country:                         string;
    region:                          string;
    language:                        string;
    parent:                          string;
    fallback_to_global:              boolean;
    fallback_to_english:             boolean;
    is_alias:                        boolean;
    shop_domain:                     string;
    shop_locale:                     string;
    promaster_locale:                string;
    shop_folder:                     string;
    price_display:                   string;
    checkout_enabled:                boolean;
    email:                           string;
    email_sales:                     string;
    phone:                           string;
    fax:                             string;
    address_compact:                 string;
    brand:                           string;
    has_locales:                     boolean;
    project_planner_enabled:         boolean;
    force_import:                    boolean;
}
