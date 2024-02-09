import Cx from "classnames";
import FixedAspect from "../../components/FixedAspect";
import Head from "next/head";
import Img from "../../components/Img";
import { Query } from "react-apollo";
import React from "react";
import gql from "graphql-tag";
import { renderMetaTags } from "react-datocms";
import styles from "./styles.css";

const PAGE_QUERY = gql`
  {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    composting {
      title
      body(markdown: true)
      image {
        id
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

class Compost extends React.Component {
  render() {
    return (
      <Query query={PAGE_QUERY}>
        {({ loading, error, data }) => {
          if (loading || !data) return <div className="loading" />;
          const page = data.composting;
          return (
            <>
              <Head>{renderMetaTags([...data.composting.seo, ...data.site.favicon])}</Head>
              <div className={Cx(styles.container)}>
                <div className={Cx(styles.textContainer)}>
                  <h1 className="ff-about-2">{page.title}</h1>
                  <div
                    className={Cx("ff-about-1")}
                    dangerouslySetInnerHTML={{ __html: page.body }}
                  />
                </div>
                <div className={Cx(styles.imageContainer)}>
                  <FixedAspect
                    width={page.image.width}
                    height={page.image.height}
                  >
                    <Img
                      className={Cx(styles.image)}
                      readyClassName={styles.ready}
                      src={page.image.url + "?w=800&q=85"}
                    />
                  </FixedAspect>
                </div>
              </div>
            </>
          );
        }}
      </Query>
    );
  }
}

export default Compost;
