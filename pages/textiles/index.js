import Head from "next/head";
import ProductsPage from "../../components/ProductsPage";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { renderMetaTags } from "react-datocms";

const TEXTILES_QUERY = gql`
  query textilesQuery {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    textilesPage {
      title
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

const Textiles = () => (
  <Query query={TEXTILES_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return <div className="loading" />;
      if (!data) return <div>No data</div>;
      return (
        <>
          <Head>{renderMetaTags([...data.textilesPage.seo, ...data.site.favicon])}</Head>
          <ProductsPage
            collectionId="Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzg4ODY0MTYxODUx"
            hrefPrefix="textiles"
            loadingMessage="Loading..."
            logos
          />
        </>
      )
    }}
  </Query>
)

export default Textiles;
