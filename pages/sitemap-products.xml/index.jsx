import { getServerSideSitemap } from 'next-sitemap'
import { apolloClient} from "../_app"
import gql from "graphql-tag";

const SITEMAP_QUERY = gql`
  query sitemapQuery {
    products: allProducts(first: "100") {
      title
      slug
    }
  }
`;


export const getServerSideProps = async (ctx) => {
  const { data } = await apolloClient.query({query: SITEMAP_QUERY});

  const products = data.products.map((product) => {
    return {
      loc: `${process.env.NEXT_SITE_URL}/products/${product.slug}`,
      lastmod: new Date().toISOString(),
    }
  });

  return getServerSideSitemap(ctx, products)
}

// Default export to prevent next.js errors
export default function Sitemap() {}