// Generated by https://quicktype.io

// Generated by https://quicktype.io

export interface Space {
    name:                        string;
    domain:                      string;
    uniq_domain:                 null;
    uniq_subdomain:              string;
    plan:                        string;
    plan_level:                  number;
    limits:                      AssetSignature;
    created_at:                  string;
    id:                          number;
    role:                        string;
    owner_id:                    number;
    story_published_hook:        string;
    environments:                Environment[];
    stories_count:               number;
    parent_id:                   null;
    assets_count:                number;
    searchblok_id:               null;
    duplicatable:                null;
    request_count_today:         number;
    api_requests:                number;
    exceeded_requests:           number;
    billing_address:             AssetSignature;
    routes:                      any[];
    euid:                        null;
    trial:                       boolean;
    default_root:                string;
    has_slack_webhook:           boolean;
    first_token:                 string;
    traffic_limit:               number;
    has_pending_tasks:           boolean;
    options:                     Options;
    assistance_mode:             boolean;
    crawl_config:                AssetSignature;
    owner:                       Owner;
    org:                         Org;
    is_demo:                     null;
    asset_aws_role:              null;
    asset_region:                null;
    asset_signature:             AssetSignature;
    required_assest_fields:      any[];
    rev_share_enabled:           null;
    use_translated_stories:      boolean;
    backup_time:                 null;
    strong_auth:                 null;
    stage_changed_hook:          string;
    release_merged_hook:         string;
    branch_deployed_hook:        null;
    datasource_entry_saved_hook: null;
    story_saved_hook:            null;
    custom_s3_asset_bucket:      null;
    personal_s3_asset_bucket:    null;
    asset_cdn:                   null;
    s3_bucket:                   null;
    aws_arn:                     null;
    backup_frequency:            null;
    languages:                   any[];
    maintenance:                 null;
    hosted_backup:               boolean;
    published_is_links_default:  null;
    webhook_token:               null;
    private_assets:              null;
    private_assets_token:        null;
    onboarding_step:             null;
    cloudinary_cloud_name:       null;
    cloudinary_api_key:          null;
    tablet_size:                 null;
    mobile_size:                 null;
    visual_mode_disable:         null;
    default_lang_name:           string;
    collaborators:               Collaborator[];
    space_roles:                 SpaceRole[];
    settings:                    any[];
}

export interface AssetSignature {
}

export interface Environment {
    name:     string;
    location: string;
}

export interface Options {
    languages:              any[];
    hosted_backup:          boolean;
    default_lang_name:      string;
    stage_changed_hook:     string;
    release_merged_hook:    string;
    required_assest_fields: any[];
    use_translated_stories: boolean;
}

export interface Org {
    name: string;
}

export interface Owner {
    id:            number;
    userid:        string;
    real_email:    string;
    friendly_name: string;
    avatar:        string;
}

export interface SpaceRole {
    id:                     number;
    resolved_allowed_paths: any[];
    allowed_paths:          any[];
    field_permissions:      string[];
    permissions:            any[];
    role:                   string;
    datasource_ids:         any[];
    component_ids:          any[];
    branch_ids:             any[];
    allowed_languages:      any[];
    asset_folder_ids:       any[];
    ext_id:                 null;
}



export interface Collaborator {
    user:              User;
    role:              string;
    user_id:           number;
    permissions:       any[];
    allowed_path:      string;
    field_permissions: string;
    id:                number;
    space_role_id:     null;
    invitation:        null;
    space_role_ids:    any[];
    space_id:          number;
}

export interface User {
    id:            number;
    firstname:     string;
    lastname:      string;
    alt_email:     string | null;
    avatar:        string;
    userid:        string;
    friendly_name: string;
}
