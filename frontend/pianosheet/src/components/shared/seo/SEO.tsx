import { defaultSEO, SiteDomain } from 'domain/SiteInfo';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

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
    const location = useLocation();

    const title = meta?.title || defaultSEO.title;
    const description = meta?.description || defaultSEO.description;
    const keywords = meta?.keywords || defaultSEO.keywords;
    const image = meta?.image || defaultSEO.image;
    let url = meta?.url || location.pathname;

    if (!url.includes(SiteDomain)) url = `https://${SiteDomain}${url}`;

    const metaArr = [];

    metaArr.push({ name: 'title', content: title });
    metaArr.push({ name: 'description', content: description });
    metaArr.push({ name: 'keywords', content: keywords });

    metaArr.push({ property: 'og:type', content: 'website' });
    metaArr.push({ property: 'og:title', content: title });
    metaArr.push({ property: 'og:description', content: description });
    metaArr.push({ property: 'og:image', content: image });
    metaArr.push({ property: 'og:url', content: url });

    metaArr.push({ property: 'twitter:title', content: title });
    metaArr.push({ property: 'twitter:description', content: description });
    metaArr.push({ property: 'twitter:domain', content: SiteDomain });
    metaArr.push({ property: 'twitter:url', content: url });
    metaArr.push({ property: 'twitter:image', content: image });
    metaArr.push({ name: 'twitter:card"', content: 'summary_large_image' });
    metaArr.push({ name: 'twitter:image"', content: image });

    return <Helmet meta={metaArr} />;
};
