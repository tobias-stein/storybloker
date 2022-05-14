// https://www.storyblok.com/docs/api/management#core-resources/stories/the-story-object

import { StoryData, StoryblokComponent } from 'storyblok-js-client';
export interface StoryEx
{
    is_folder?: boolean;
    default_root?: string;
}

export type Story<T = any> = StoryData<T> & StoryEx;