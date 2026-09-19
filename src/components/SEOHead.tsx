import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
  robots?: string;
}

const SITE_NAME = "Diagnostics Hub";
const BASE_URL = "https://www.diagnosticshub.in";
const DEFAULT_OG_IMAGE = "https://www.diagnosticshub.in/og-image.png";

export const getCleanCanonicalUrl = (rawCanonical?: string): string => {
  let path = rawCanonical;
  if (!path && typeof window !== "undefined") {
    path = window.location.pathname;
  }
  if (!path) return `${BASE_URL}/`;

  // Remove existing domain if absolute URL was provided
  let cleanPath = path
    .replace(/^https?:\/\/(www\.)?diagnosticshub\.(in|com)/i, "")
    .split("?")[0]
    .split("#")[0];

  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  if (cleanPath === "/" || cleanPath === "") {
    return `${BASE_URL}/`;
  }

  // Strip trailing slashes for all non-homepage routes
  return `${BASE_URL}${cleanPath.replace(/\/+$/, "")}`;
};

const SEOHead = ({ title, description, canonical, keywords, jsonLd, robots }: SEOHeadProps) => {
  // Ensure site name is appended only once
  const cleanTitle = title.trim();
  const fullTitle = cleanTitle.includes(SITE_NAME) ? cleanTitle : `${cleanTitle} | ${SITE_NAME}`;
  const canonicalUrl = getCleanCanonicalUrl(canonical);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots || "index, follow, max-image-preview:large"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
