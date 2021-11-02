import crypto from 'crypto';

/**
 * Converts any string to a slug. A slug is a string with only small letters,
 * redundant white spaces are trimed and then replaced this dashes.
 * @param InName 
 */
export function Slugify(InName: string): string 
{
    return InName
        // remove any leading and trailing spaces
        .trim()
        // convert string to lowercase
        .toLowerCase()
        // split at any space of dash
        .split(/[ -]/g)
            // remove any none ASCII character, except '-'
            .map(x => x.replace(/[^A-Za-z0-9]/g, ''))
            // remove empty strings
            .filter(x => x.length)
        // join strings to form a slug
        .join("-")
}

/**
 * Converts a regular file path to a URL slug.
 * @param InPath 
 * @returns 
 */
export function PathToSlug(InPath: string): string 
{ 
    return InPath ? InPath.split("/").map(x => Slugify(x)).join("/") : ""; 
}

/**
 * @param a Compare to string and returns true if they are equal. Leading and trailing spaces are ignored.
 * @param b 
 * @param ignoreCase 
 * @returns 
 */
export function StringEquals(a: string, b: string, ignoreCase: boolean): boolean
{
    if(!a && b) { return false; }
    if(a && !b) { return false; }
    if(!a && !b) { return true; }
    
    const _a = ignoreCase ? a.trim().toLowerCase() : a.trim(); 
    const _b = ignoreCase ? b.trim().toLowerCase() : b.trim();
    
    return _a == _b;
}

/**
 * Generates a random ID
 * @param digits number of ID digits.
 * @returns 
 */
export function RandomId(digits: number) : string
{
    return crypto.randomBytes(digits).toString("hex");
}

/**
 * Deep merges two objects
 * Credits: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param target 
 * @param source 
 * @returns 
 */
export function DeepMerge(target: any, source: any) : any
{
    function IsObject(Obj: any) : boolean { return (Obj && typeof Obj === 'object' && !Array.isArray(Obj)); }

    let Output = Object.assign({}, target);

    if(IsObject(target) && IsObject(source)) 
    {
        Object.keys(source).forEach(key => 
        {
            if(IsObject(source[key])) 
            {
                if(!(key in target))
                {
                    Object.assign(Output, { [key]: source[key] });
                }
                else
                {
                    Output[key] = DeepMerge(target[key], source[key]);
                }
            } 
            else 
            {
                Object.assign(Output, { [key]: source[key] });
            }
        });
    }
    
    return Output;
}


/**
 * Converts any filename to a capitalized sentence
 * @param Filename 
 * @returns 
 */
export function BeautifyFilename(Filename: string) : string 
{
    if(!Filename || !Filename.length) { return ""; }
    
    const Terms = Filename.split('.');
    // remove extension, if any
    if(Terms.length > 1) { Terms.pop(); }

    return Terms
        // rejoin terms without extension, if any
        .join('.')
        // remove leading and trailing spaces
        .trim()
        // remove any special characters
        .replace(/[!@#$%^&*()_+=\-<>`'"§~;:|,.?\[\]\{\}\/\\]/g, ' ')
        // split words
        .split(' ')
        // remove empty
        .filter(t => t.length)
        // capitalize words
        .map(t => t[0].toUpperCase() + t.slice(1).toLowerCase())
        // rejoin to one string
        .join(' ');
}