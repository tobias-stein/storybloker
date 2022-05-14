import { StoryblokComponent } from 'storyblok-js-client';
export {
    StoryblokComponent as StoryBlokComponent
}

export interface MultiLink {
    fieldtype:  string;
    linktype:   string;
    id:         string;
    url:        string;
    cached_url: string;
}

export interface StoryblokAsset {
    fieldtype: string;
    id:        number;
    filename:  string;
    title:     string;
    copyright: string;
    focus:     string;
    alt:       string;
    name:      string;
}

export interface ImageLink {
    id:        number;
    alt:       string;
    name:      string;
    focus:     string;
    title:     string;
    filename:  string;
    copyright: string;
}


// Generated by https://quicktype.io

export interface Component {
    name:                 string;
    display_name:         string;
    created_at:           string;
    updated_at:           string;
    id:                   number;
    schema:               Schema;
    is_root:              boolean;
    is_nestable:          boolean;
    all_presets:          any[];
    real_name:            string;
    component_group_uuid: string;
}

export interface ComponentGroup {
    id:   number;
    name: string;
    uuid: string;
}


export interface Schema {
    [value: string]:        FieldMeta;
}

export interface FieldMeta {
    type:                   string;
    keys:                   string[] | undefined;
    pos:                    number;
    default_value:          any | undefined;
}