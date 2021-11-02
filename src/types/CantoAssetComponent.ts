import { MultiLink, StoryblokAsset } from ".";
import { StoryBlokComponent } from "."

export interface CantoAssetComponent extends StoryBlokComponent {
  canto_id:                 string;
  storyblok_asset:          StoryblokAsset;
  type:                     string;
  product:                  MultiLink;
  product_category:         MultiLink;
  application:              MultiLink;
  properties:               CantoAssetPropertyComponent[];
  last_asset_modified:      string;
  last_assetmeta_modified:  string;

}

export interface CantoAssetPropertyComponent extends StoryBlokComponent {
  name:                   string;
  value:                  string;
}