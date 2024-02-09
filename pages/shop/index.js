import Head from "next/head";
import ProductsPage from "../../components/ProductsPage";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { renderMetaTags } from "react-datocms";

const SHOP_QUERY = gql`
  query shopQuery {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    shop {
      title
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

const Shop = () => (
  <Query query={SHOP_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return <div className="loading" />;
      if (!data) return <div>No data</div>;
      return (
        <>
          <Head>{renderMetaTags([...data.shop.seo, ...data.site.favicon])}</Head>
          <ProductsPage
            collectionId="Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzg4ODY0MTI5MDgz"
            hrefPrefix="apparel"
            loadingMessage="Loading..."
          />
        </>
      )
    }}
  </Query>
)

export default Shop;
