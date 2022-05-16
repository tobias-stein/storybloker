interface RichtextElement 
{
    type: string;
    text: string | undefined;
    content: Array<string | RichtextElement> | undefined;
};

function StripRichtextFormat(rte: RichtextElement) : string 
{
    // If richtext element is invalid return empty string
    if(!rte) { return ""; }
    // return text, if this is a text element
    if(rte.text) { return rte.text; }
    if(!rte.content || !Array.isArray(rte.content)) { return ""; }

    // If richtext element does not have any values apply format to empty string
    if(!rte.content.length) { return ""; }

    let Output = "";
    for(const child of rte.content) { Output += StripRichtextFormat(child as RichtextElement); };

    return Output;
}

export function RichtextToPlain(richtextJson: string | Object) : string
{
    try 
    {
        if(!richtextJson) { return ""; }
        
        const asJson = typeof richtextJson !== 'object' ? JSON.parse(richtextJson) : richtextJson;
        return StripRichtextFormat(asJson as unknown as RichtextElement);
    }
    catch(err)
    {
        console.error(err);
        return typeof richtextJson === 'object' ? JSON.stringify(richtextJson) : richtextJson;
    }
}
