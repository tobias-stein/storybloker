// types
import { StoryBlokComponent, Component } from "../types";

// utility
import { RichtextToPlain } from "./richtext2plaintext";

function GetProcessableFields(Target: StoryBlokComponent, KnownComponents: Array<Component>): Map<string, string>
{
    const ProcessableFields = new Map<string, string>();

    if(!Target) { return ProcessableFields; }

    const Component = KnownComponents.find(c => c.name === Target.component);
    if(Component)
    {
        for(const FieldName of Object.keys(Component.schema))
        {
            const FieldMeta = Component.schema[FieldName];

            switch(FieldMeta.type)
            {
                case "bloks": 
                case "text": 
                case "textarea": 
                case "richtext": 
                {
                    ProcessableFields.set(FieldName, FieldMeta.type);
                    break;
                }
            }
        }
    }
    return ProcessableFields;
}


export function ContentToPlainText(Target: Array<StoryBlokComponent>, KnownComponents: Array<Component>, MaxDepth: number = 2): string
{
    let Output = "";

    // if we reached max recursion depth, stop
    if(!MaxDepth || !Target) { return Output; }

    for(const t of Target) 
    {
        const Fields = GetProcessableFields(t, KnownComponents);

        // get all processable fields for this target
        for(const [FieldName, Type] of Fields)
        {
            const Field = (t as any)[FieldName];
            switch(Type)
            {
                case "bloks":
                {
                    Output += ContentToPlainText(Field, KnownComponents, MaxDepth - 1) + "\n";
                    break;
                } 
                case "text": 
                case "textarea":
                {
                    Output += Field + "\n";
                    break;
                } 
                case "richtext": 
                {
                    Output += RichtextToPlain(Field) + "\n";;
                    break;
                }
            }
        }
    }
    
    return Output;
}