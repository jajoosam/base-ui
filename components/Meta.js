import Head from "next/head";

const description = "A neat interface for your Deta Base";
const image = "https://base-ui.jajoo.fun/meta.png";
const name = "Base UI";
const link = "https://base-ui.jajoo.fun";
const Meta = ({ title, path }) => (
  <Head>
    <title key="title">{title || name}</title>

    {/* Vanilla */}
    <meta name="theme-color" content="#fed2ae" key="theme-color" />
    <meta name="description" content={description} key="description" />
    <meta itemProp="name" content={name} key="name" />
    <meta
      itemProp="description"
      content={description}
      key="description-itemprop"
    />
    <meta itemProp="image" content={image} key="image" />

    {/* Open Graph */}
    <meta
      property="og:url"
      content={path ? link.replace("{path}", path) : link.replace("{path}", "")}
      key="og:url"
    />
    <meta property="og:type" content="website" key="og:type" />
    <meta property="og:title" content={title || name} key="og:title" />
    <meta
      property="og:description"
      content={description}
      key="og:description"
    />
    <meta property="og:image" content={image} key="og:image" />

    {/* Twitter */}
    <meta
      name="twitter:card"
      content="summary_large_image"
      key="twitter:card"
    />
    <meta name="twitter:title" content={title || name} key="twitter:title" />
    <meta
      name="twitter:description"
      content={description}
      key="twitter:description"
    />
    <meta name="twitter:image" content={image} key="twitter:image" />
  </Head>
);

export default Meta;
