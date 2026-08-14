import { PortableText } from 'next-sanity';
import { imageUrl } from '../sanity/lib/image';

const components = {
  block: {
    lead: ({ children }) => <p className="rich-text-lead">{children}</p>,
    small: ({ children }) => <p className="rich-text-small">{children}</p>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    underline: ({ children }) => <u>{children}</u>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ children, value }) => {
      const external = value?.openInNewTab || /^https?:\/\//.test(value?.href || '');
      return <a href={value?.href || '#'} target={external ? '_blank' : undefined} rel={external ? 'noreferrer noopener' : undefined}>{children}</a>;
    },
  },
  types: { image: ({ value }) => <figure className={`custom-page-image rich-image-${value.display || 'standard'}`}><img src={imageUrl(value)} alt={value.alt || ''} />{value.caption && <figcaption>{value.caption}</figcaption>}</figure> },
};

export function RichText({ value }) {
  if (!value?.length) return null;
  return <div className="custom-page-body"><PortableText value={value} components={components} /></div>;
}
