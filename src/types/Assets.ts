
export interface Asset 
{
    id:                  number;
    filename:            string;
    space_id:            number;
    created_at:          string;
    updated_at:          string;
    file:                string | null;
    asset_folder_id:     number | null;
    deleted_at:          string | null;
    short_filename:      string;
    content_length:      number;
    content_type:        string;
    permanently_deleted: boolean;
    alt:                 string;
    copyright:           string;
    title:               string;
    focus:               null;
    ext_id:              string | null;
    expire_at:           string | null;
    source:              null;
    internal_tags_list:  any[];
}

export interface AssetFolder 
{
    id:          number;
    name:        string;
    parent_id:   number | null;
    uuid:        string;
    parent_uuid: string | null;

    // client side meta data only
    children:   AssetFolder[];
    assets:     Asset[];
}
