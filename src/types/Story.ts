// https://www.storyblok.com/docs/api/management#core-resources/stories/the-story-object

import { StoryBlokComponent } from ".";

export interface Story<TContent = any & StoryBlokComponent> {
    name:                string;
    parent_id:           number;
    group_id:            string;
    alternates:          any[];
    created_at:          string;
    sort_by_date:        null;
    tag_list:            any[];
    updated_at:          string;
    published_at:        null;
    id:                  number;
    uuid:                string;
    is_folder:           boolean;
    content:             TContent;
    published:           boolean;
    slug:                string;
    path:                null;
    full_slug:           string;
    default_root:        string;
    disble_fe_editor:    boolean;
    parent:              Parent;
    is_startpage:        boolean;
    unpublished_changes: boolean;
    meta_data:           null;
    imported_at:         null;
    preview_token:       PreviewToken;
    pinned:              boolean;
    breadcrumbs:         Breadcrumb[];
    publish_at:          null;
    expire_at:           null;
    first_published_at:  null;
    last_author:         LastAuthor;
    user_ids:            any[];
    space_role_ids:      any[];
    translated_slugs:    any[];
    localized_paths:     any[];
    position:            number;
    translated_stories:  any[];
    can_not_view:        boolean;
    is_scheduled:        null;
    content_type:        string;
    content_summary:     any | undefined;
}

export interface Breadcrumb {
    id:               number;
    name:             string;
    parent_id:        number;
    disble_fe_editor: boolean;
    path:             null;
    slug:             string;
    translated_slugs: any[];
}

export interface LastAuthor {
    id:            number;
    userid:        string;
    friendly_name: string;
}

export interface Parent {
    id:               number;
    slug:             string;
    name:             string;
    disble_fe_editor: boolean;
    uuid:             string;
}

export interface PreviewToken {
    token:     string;
    timestamp: string;
}
