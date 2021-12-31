import { defaultSEO } from 'domain/SiteInfo';
import * as React from 'react';
import { Helmet } from 'react-helmet';

export type SiteMetaType = {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
};

interface Props {
    meta: Nullable<SiteMetaType>;
}

export const SEO: React.FC<Props> = ({ meta }) => {
    const title = meta?.title || defaultSEO.title;
    const description = meta?.description || defaultSEO.description;
    const keywords = meta?.keywords || defaultSEO.keywords;
    const image = meta?.image || defaultSEO.image;
    const url = meta?.url || defaultSEO.url;

    const metaArr = [];

    metaArr.push({ name: 'title', content: title });
    metaArr.push({ name: 'description', content: description });
    metaArr.push({ name: 'keywords', content: keywords });
    metaArr.push({ name: 'twitter:card"', content: 'summary_large_image' });
    metaArr.push({ name: 'twitter:image"', content: image });
    metaArr.push({ property: 'og:type', content: 'website' });
    metaArr.push({ property: 'og:image', content: image });
    metaArr.push({ property: 'og:url', content: url });

    return <Helmet meta={metaArr} />;
};
