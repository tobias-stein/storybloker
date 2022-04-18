import { APIClient } from "./APIClient";
import { PathToSlug, Slugify, BeautifyFilename } from "./utility";

import FormData from "form-data";

// types
import { Component, ComponentGroup, FieldMeta } from "./types";
import { Story } from "./types/Story";
import { Asset, AssetFolder } from "./types/Assets";
import { SiteConfigurationComponent } from "./types/SiteConfigurationComponent";
import { Space, Collaborator, User, SpaceRole } from "./types/Space";
import { WorkflowStage, WorkflowStateChange } from "./types/Workflow";

/** api client for StoryBlok management api. */
export class StoryBlokAPIClient extends APIClient 
{
    private IsInitialised : boolean;

    private SpaceComponentGroups : Array<ComponentGroup>;
    private SpaceComponents : Array<Component>;

    constructor(accessToken: string, space: string, maxRetry: number = 3)
    {        
        if(!space) { throw new Error("STORYBLOK_SPACE not set."); }
        if(!accessToken) { throw new Error("STORYBLOK_ACCESSTOKEN not set."); }
        
        const BaseUrl = `https://mapi.storyblok.com/v1/spaces/${space}/`!;
        const AuthToken = accessToken;
        
        super(BaseUrl, AuthToken, 5, maxRetry);

        this.IsInitialised = false;
        this.SpaceComponentGroups = new Array<ComponentGroup>();
        this.SpaceComponents = new Array<Component>();

        this.Initialize();
    }

    private async Initialize()
    {
        await Promise.all(
        [
            // get available space components details
            this.GET("components")
                .then((response) => 
                {
                    this.SpaceComponentGroups = response.component_groups;
                    this.SpaceComponents = response.components;
                })
        ])
        .then(() => { this.IsInitialised = true; });
    }

    private WaitUntilInitialize() : Promise<void> 
    {
        return new Promise((resolve, _) => 
        { 
            const Check = () => { setTimeout(() => { if(this.IsInitialised) { resolve(); } else { Check(); } }, 500) }; 
            Check(); 
        });
    }

    /**
     * Returns all the component group definitions in the current SB space.
     * @returns 
     */
    public async GetComponentGroups() : Promise<Array<ComponentGroup>> { return this.WaitUntilInitialize().then(() => this.SpaceComponentGroups); }

    /**
     * Retrusn all the component definitions in the current SB space.
     * @param InGroup Optional group name (as single value or single value array) or multiple groups (as array). If provided only returns components of a certain group.
     * @returns 
     */
    public async GetComponents(InGroups?: string | string[] | undefined) : Promise<Array<Component>> 
    { 
        return this.WaitUntilInitialize().then(() => 
        {
            if(InGroups) 
            {
                const GroupNames = Array.isArray(InGroups) ? InGroups : [InGroups];
                // group names to uuids
                const GroupUUIDs = this.SpaceComponentGroups.filter(G => GroupNames.includes(G.name)).map(G => G.uuid);
                // filter components by uuids
                return this.SpaceComponents.filter(C => GroupUUIDs.includes(C.component_group_uuid));
            }
            // no filter provided, return all components
            else
            {
                return this.SpaceComponents;
            }
        }); 
    }

    /**
     * Returns all workflow stages defined in the space.
     */
    public async GetWorkflowStages() : Promise<Array<WorkflowStage>>
    {
        return this.GET("workflow_stages")
            .then((workflowStages : any & { workflow_stages: Array<WorkflowStage> }) => 
            {
                return workflowStages.workflow_stages || [];
            })
            .catch(() => []);
    }

    /**
     * Returns a list of all workflow state changes of an story.
     * @param storyId 
     * @returns 
     */
    public async GetStoryWorkflowChanges(storyId: number) : Promise<Array<WorkflowStateChange>>
    {
        return this.GET("workflow_stage_changes", new URLSearchParams({ with_story: `${storyId}`}))
            .then((storyWorkflowChanges : any & { workflow_stage_changes : Array<WorkflowStateChange> }) =>
            {
                return storyWorkflowChanges.workflow_stage_changes || [];
            })
            .catch(() => [])
    }

    /**
     * Returns all users for the current space
     * @returns 
     */
    public async GetAllUsers() : Promise<Array<User>> 
    {
        return this.GET("")
            .then((response) => 
            {
                const space = response.space as Space;
                return space ? space.collaborators.map(c => c.user) : [];
            })
            .catch(() => []);
    }

    /**
     * Retruns a list of all component fields under the 'General' tab.
     * @param ComponentName 
     * @returns 
     */
    public async GetComponentGeneralFields(ComponentName: string) : Promise<Array<FieldMeta & {name: string}>>
    {
        const ProductComp = this.SpaceComponents.find(C => C.name === ComponentName);
        const Schema = ProductComp?.schema;
        if(Schema)
        {
            let TabFields: any[] = [];
            for(const Key of Object.keys(Schema)) { if(Key.startsWith("tab-")) { TabFields = TabFields.concat(Schema[Key].keys); } }

            const GeneralTabFields = [];
            for(const Key of Object.keys(Schema))
            {
                const Meta = Schema[Key];
                if(!TabFields.includes(Key) && Meta.type != 'tab') { GeneralTabFields.push({ name: Key, ...Meta }); }
            }

            return GeneralTabFields;
        }

        return [];
    }

    /**
     * Get a story with a certain slug.
     * @param StorySlug Stories full slug.
     * @returns Retruns the story resource if exists.
     */
    public async GetStoryBySlug(StorySlug: string) : Promise<Story>
    {
        return this.GET(`stories?with_slug=${PathToSlug(StorySlug)}`)
            .then(data => { return data.stories.length > 0 ? data.stories[0] : null; })
    }

    /**
     * Retruns story object of that given content folder. If folder does not exist one
     * is created.
     * @param Path 
     */
    public async GetCreateContentFolder(Path: string) : Promise<Story>
    {
        // remove trailing slash if any
        Path = Path.endsWith("/") ? Path.substring(0, Path.length - 1): Path;

        // get folder by its path slug
        let Folder = await this.GET(`stories?folder_only=true&with_slug=${PathToSlug(Path)}`).then(data => { return data.stories.length > 0 ? data.stories[0] : null; });
        // if it exists return it
        if(Folder) { return Folder; }
        // Otherwise create the entire path

        let Parent: any = null;
        let AccPath: string[] = [];

        for(const PathElement of Path.split("/").map(f => { return f.trim(); }))
        {
            AccPath.push(PathElement);

            // get folder for current accumulate path
            Folder = await this.GET(`stories?folder_only=true&with_slug=${PathToSlug(AccPath.join("/"))}`)
                .then(data => 
                { 
                    return data.stories.length > 0 
                        // return folder if it already exists
                        ? data.stories[0] 
                        // else create a new folder
                        : this.CreateStory({ parent_id: Parent ? Parent.id : null, name: PathElement, slug: Slugify(PathElement), is_folder: true, is_startpage: false } as Story); 
                });

            Parent = Folder;
        }

        // returns the final asset folder from the entire path.
        return Folder;
    }

    /** Return one story by its resource id.
     * @param StoryId unique resource id
     */
    public async GetStoryById(StoryId : Number) : Promise<Story> { return this.GET(`stories/${StoryId}`).then(data => { return data.story as Story; }); }

    /** Return one story by its resource uuid.
     * @param StoryId unique resource id
     */
    public async GetStoryByUuid(StoryUuid : string) : Promise<Story> { return this.GET(`stories?by_uuids=${StoryUuid}`).then(data => { return data.stories[0] as Story; }); }

    /** Return all the stories
     * @param RootContentFolder can be set to only get stories from a specific Content folder.
     */
    public async GetAllStories(params?: URLSearchParams | undefined) : Promise<Array<Story>>
    {
        let Stories = new Array<Story>();
        let Page = 1;
        const PageSize = 100;

        let NoMoreStories = false;
        do
        {
            const Params = new URLSearchParams(params);
            Params.append("page", `${Page}`);
            Params.append("per_page", `${PageSize}`);
            
            // fetch all stories for this page
            const ThisPage = await this.GET(`stories`, Params).then(page => { return page.stories as Array<Story>; })
                
            // accumulate result
            Stories = Stories.concat(ThisPage);
            // next page
            Page = Page + 1;

            // check if, we still found some stories on this page
            NoMoreStories = ThisPage.length == 0;

        } while(!NoMoreStories)

        return Stories;
    }

    public async SearchStories(Search: string) : Promise<Array<Story>>
    {
        const Params = new URLSearchParams({
            with_summary: '1',
            page: '1',
            text_search: Search
        });

        return this.GET("stories", Params).then(response => response.stories);
    }

    /** Return all child stories of a parent
     * @param RootContentFolder can be set to only get stories from a specific Content folder.
     */
     public async GetAllStoriesOfParent(ParentId: number) : Promise<Array<Story>>
     {
         let Stories = new Array<Story>();
 
         let Page = 1;
         const StoriesPerPage = 100;
 
         let NoMoreStories = false;
         do
         {
            const params = new URLSearchParams();
            params.append("page", `${Page}`);
            params.append("per_page", "100");
            params.append("with_parent", `${ParentId}`);

            // fetch all stories for this page
            const ThisPage = await this.GET(`stories`, params)
                .then(page => { return page.stories as Array<Story>; })

            // accumulate result
            Stories = Stories.concat(ThisPage);

            // next page
            Page = Page + 1;

            // check if, we still found some stories on this page
            NoMoreStories = ThisPage.length == 0;
 
         } while(!NoMoreStories)
 
         return Stories;
     }


    /**
     * Creates a new story resource.
     * @param InStory request payload for the new story.
     * @return Returns new created story resource.
     */
    public async CreateStory(InStory: Story, publish: boolean = true) : Promise<Story>
    {
        return await this.POST(`stories/${publish ? '?publish=1' : ''}`, { story: { ...InStory }, })
            .then(data => { return data.story as Story; })
    }

    /**
     * Updates an existing story.
     * @param InStory Partial data to update existing story resource with.
     * @return Returns the updated story resource.
     */
    public async UpdateStory(StoryId : Number, InStory: Story, publish: boolean = true) : Promise<Story>
    {
        return await this.PUT(`stories/${StoryId}${publish ? '?publish=1' : ''}`, { story: { ...InStory } })
            .then(data => { return data.story as Story; })
    }


    /**
     * Deletes a story resource.
     * @param StoryId Story resource id
     * @returns Returns true if delete operation was successful.
     */
    public async DeleteStory(StoryId : Number) : Promise<boolean>
    {
        return await this.DELETE(`stories/${StoryId}/`)
            .then(data => { return true; })
    }
    
    /**
     * Publish a story.
     * @param StoryId 
     * @returns 
     */
    public async PublishStory(StoryId : Number) : Promise<void> { return this.GET(`stories/${StoryId}/publish`); }

    /**
     * Unpublish a story.
     * @param StoryId 
     * @returns 
     */
    public async UnpublishStory(StoryId : Number) : Promise<void> { return this.GET(`stories/${StoryId}/unpublish`); }

    /**
     * Move story to new parent folder.
     * @param storyId 
     * @param parentId 
     * @returns 
     */
    public async MoveStory(storyId: number, parentId: number) : Promise<Story | null>
    {
        return this
            .PUT(`stories/${storyId}/move`, { to_folder: parentId })
            .then(result => this.GetStoryById(storyId))
            .catch(err => 
            {
                console.error(err);
                return null;
            });
    }

    /**
     * Returns a list of all available asset folders.
     * @returns 
     */
    public async GetAllAssetFolders() : Promise<Array<AssetFolder>> { return this.GET("asset_folders").then(data => { return data.asset_folders; }); }


    /**
     * Returns a single asset  object by its id.
     * @param AssetId 
     * @returns 
     */
    public async GetAssetById(AssetId : Number) : Promise<Asset> { return await this.GET(`assets/${AssetId}`); }
    
    /**
     * Traverses up the hierarchy of the given story location and looks for stories with a specified component.
     * When such components are found the traversal is stopped and the found components are returned.
     * @param Child 
     * @param Component 
     * @returns 
     */
    public async GetAllAncestorStoriesByComponent(Child: Story, Component: string) : Promise<Array<Story>>
    {
        const PathElements = Child.full_slug.split('/');
        while (PathElements.pop() != undefined) 
        {
            const Params = new URLSearchParams({
                contain_component: Component,
                story_only: 'true',
                starts_with: PathElements.join('/')
            });

            // check for ancestors
            const Ancestors = await this.GetAllStories(Params);
            // if we found ancestors, stop right here.
            if(Ancestors && Ancestors.length)
            {
                return Ancestors;
            }
        }

        // no ancestors found!
        return [];
    }

    /**
     * Returns a list of all asset objects.
     * @returns 
     */
    public async GetAllAssets() : Promise<Array<Asset>>
    {
        let Assets = new Array<Asset>();
        let Page = 1;
        const StoriesPerPage = 100;

        let NoMoreStories = false;
        do
        {
            const params = new URLSearchParams();
            params.append("page", `${Page}`);
            params.append("per_page", "100");

            // fetch all stories for this page
            const ThisPage = await this.GET(`assets`, params)
                .then(page => { return page.assets as Array<Asset>; }) || [];
                
            // accumulate result
            Assets = Assets.concat(ThisPage);
            // next page
            Page = Page + 1;

            // check if, we still found some stories on this page
            NoMoreStories = ThisPage.length == 0;

        } while(!NoMoreStories)

        return Assets;
    }

    /**
     * Create a new asset folder.
     * @param FolderName 
     * @param ParentId 
     * @returns 
     */
    public async CreateAssetFolder(FolderName: string, ParentId?: number | undefined) : Promise<AssetFolder>
    {
        return this.POST("asset_folders", { name: FolderName, parent_id: ParentId }).then(data => { return data.asset_folder; });
    }

    /**
     * Moves an asset to another folder.
     * @param AssetId 
     * @param AssetFolderId 
     * @returns 
     */
    public async MoveAsset(AssetId: number, AssetFolderId: number) : Promise<Asset>
    {
        const asset = await this.GET(`assets/${AssetId}`) as Asset;
        asset.asset_folder_id = AssetFolderId;
        return this.PUT(`assets/${AssetId}`, asset);
    }

    /**
     * Update assets meta data.
     * @param Updated 
     * @returns 
     */
    public async UpdateAsset(Updated: Asset) : Promise<Asset> { return this.PUT(`assets/${Updated.id}`, { asset: Updated }); }

    /**
     * Delete an asset.
     * @param AssetId 
     */
    public async DeleteAsset(AssetId: number) : Promise<void> { await this.DELETE(`assets/${AssetId}`); }

    /**
     * Uploads new content for an existing asset or creates a new asset
     * @param AssetFolderId 
     * @param AssetName 
     * @param AssetContent 
     */
    public async UploadAssetContent(
        AssetFolderId: number, 
        AssetName: string, 
        AssetCaption: string, 
        AssetDescription: string, 
        AssetCopyright: string, 
        AssetContent: Buffer, 
        AssetDimensions: string,
        AssetContentLength: string, 
        AssetContentType: string,
        AssetId?: number | undefined) : Promise<Asset>
    {
        // first request signed request to upload content
        return await this.POST("assets", 
            { 
                id: AssetId, 
                filename: AssetName, 
                title: BeautifyFilename(AssetCaption),
                size: AssetDimensions,
                name: AssetName,
                copyright: AssetCopyright, 
                alt: AssetDescription, 
                asset_folder_id: AssetFolderId,
                content_type: AssetContentType,
                content_length: AssetContentLength
            })
            // upload content
            .then(SingedRequest =>
            {
                return new Promise<Asset>((resolve, reject) => 
                {
                    var UploadForm = new FormData();

                    // all fields from signed request must be present in upload request!
                    for (const Key in SingedRequest.fields) { UploadForm.append(Key, SingedRequest.fields[Key]); }
    
                    // add upload content
                    UploadForm.append('file', AssetContent);

                    // send upload request
                    UploadForm.submit(SingedRequest.post_url, async (err, res) => 
                    { 
                        if(err) 
                        { 
                            reject(err); 
                        } 
                        else 
                        { 
                            // 3. finalize the upload
                            await this.GET(`assets/${SingedRequest.id}/finish_upload`)
                                .then(async () => { resolve(await this.GetAssetById(SingedRequest.id)); })
                                .catch(error => { reject(error); });
                        } 
                    });
                });
            })
            .catch(error => { throw error; });
    }

    /**
     * Returns a list of all published stories with a 'site-configuration' component.
     * @returns 
     */
    public async GetAllSiteConfigurations(): Promise<Array<Story<SiteConfigurationComponent>>>
    {
        let SiteConfigs = new Array<Story<SiteConfigurationComponent>>();
        let Page = 1;
        const StoriesPerPage = 100;

        let NoMoreStories = false;
        do
        {
            const params = new URLSearchParams();
            params.append("page", `${Page}`);
            params.append("per_page", `${StoriesPerPage}`);
            params.append("story_only", "true");
            params.append("is_published", "true");
            params.append("contain_component", "site-configuration");

            // fetch all stories for this page
            const ThisPage = await this.GET(`stories`, params)
                .then(page => { return page.stories as Array<Story<SiteConfigurationComponent>>; })
                
            // accumulate result
            SiteConfigs = SiteConfigs.concat(ThisPage);
            // next page
            
            Page = Page + 1;

            // check if, we still found some stories on this page
            NoMoreStories = ThisPage.length == 0;

        } while(!NoMoreStories)

        return SiteConfigs;
    }

    /**
     * Returns a list of all stories referencing this asset.
     * @param AssetFilepath 
     * @returns 
     */
    public async GetAllAssetReferences(AssetFilepath: string): Promise<Array<Story>>
    {
        let References = new Array<Story>();

        let Page = 1;
        const StoriesPerPage = 100;

        // make sure to remove the host domain
        const AwsS3Prefix = "https://s3.amazonaws.com/a.storyblok.com";
        AssetFilepath = AssetFilepath.startsWith(AwsS3Prefix) ? AssetFilepath.slice(AwsS3Prefix.length) : AssetFilepath;

        let NoMoreStories = false;
        do
        {
            const params = new URLSearchParams();
            params.append("page", `${Page}`);
            params.append("per_page", `${StoriesPerPage}`);
            params.append("story_only", "true");
            params.append("reference_search", AssetFilepath);

            // fetch all stories for this page
            const ThisPage = await this.GET(`stories`, params)
                .then(page => { return page.stories as Array<Story<SiteConfigurationComponent>>; })
                
            // accumulate result
            References = References.concat(ThisPage);
            // next page
            
            Page = Page + 1;

            // check if, we still found some stories on this page
            NoMoreStories = ThisPage.length == 0;

        } while(!NoMoreStories)

        return References;
    }

    public async GetAllSpaceRoles() : Promise<Array<SpaceRole>> { return this.GET('space_roles').then(data => data.space_roles); }
    public async CreateSpaceRole(role: SpaceRole) : Promise<void> { return this.POST('space_roles', { space_role: role }).then(data => data.space_role); }
    public async UpdateSpaceRole(role: SpaceRole) : Promise<SpaceRole> { return this.PUT(`space_roles/${role.id}`, { space_role: role }).then(data => data.space_role); }
    public async DeleteSpaceRole(role: SpaceRole) : Promise<void> { return this.DELETE(`space_roles/${role.id}`); }
}