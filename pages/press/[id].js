import ArticleLayout from "../../components/ArticleLayout";
import Head from "next/head";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { renderMetaTags } from "react-datocms";
import { useRouter } from "next/router";

const ARTICLE_QUERY = gql`
  query Article($slug: String!) {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }

    article(filter: { slug: { eq: $slug } }) {
      body(markdown: true)
      title
      publishDate
      longTitle
      thumbnail {
        url
        width
        height
      }
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

const Article = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Query query={ARTICLE_QUERY} variables={{ slug: id }}>
      {({ loading, error, data }) => {
        if (loading)
          return <div className="loading ff-product-1">Loading...</div>;
        if (data && data.article)
          return (
            <>
              <Head>
                {renderMetaTags([...data.article.seo, ...data.site.favicon])}
              </Head>
              <ArticleLayout {...data.article} />;
            </>
          );
        if (error) console.log(error);
        return <div className="loading ff-product-1">Error :(</div>;
      }}
    </Query>
  );
};

export default Article;
