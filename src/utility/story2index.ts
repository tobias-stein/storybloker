// types
import { StoryBlokComponent, Component } from "../types";
import { Story } from "../types/Story";

// utility
import { RichtextToPlain } from "./richtext2plaintext";
import { ContentToPlainText } from "./content2plaintext";

export function StoryToIndex(Target: Story<any & StoryBlokComponent>, KnownComponents: Array<Component>, IncludeFields?: Array<string> | undefined) : Record<any, any>
{
    let IndexDocument = { 
        objectID: Target.uuid,
        story_id: Target.id,
        story_name: Target.name,
        slug: Target.slug,
        full_slug: Target.full_slug,
        content_type: Target.content.component
    };

    const Component = KnownComponents.find(c => c.name === Target.content.component);
    if(Component)
    {
        for(const FieldName of Object.keys(Component.schema))
        {
            // If filter provided, check if we should include field.
            if(IncludeFields && !IncludeFields.includes(FieldName)) { continue; }

            const FieldMeta = Component.schema[FieldName];
            const FieldValue = Target.content[FieldName];
            
            if(FieldValue === undefined || FieldValue === null)
            {
                IndexDocument = Object.assign(IndexDocument, { [FieldName]: null });
                continue;
            }

            switch(FieldMeta.type)
            {
                case "bloks": 
                {
                    IndexDocument = Object.assign(IndexDocument, { [FieldName]: ContentToPlainText(Target.content[FieldName], KnownComponents, 2) });
                    break;
                }

                case "richtext": 
                {
                    IndexDocument = Object.assign(IndexDocument, { [FieldName]: RichtextToPlain(Target.content[FieldName]) });
                    break;
                }

                case "asset": 
                {
                    IndexDocument = Object.assign(IndexDocument, { [FieldName]: Target.content[FieldName].filename });
                    break;
                }
                
                case "boolean": 
                case "number": 
                case "text": 
                case "textarea": 
                {
                    IndexDocument = Object.assign(IndexDocument, { [FieldName]: Target.content[FieldName] });
                    break;
                }
            }
        }
    }

    return IndexDocument;
}