import BetterLink from "../../components/BetterLink";
import Cx from "classnames";
import FixedAspect from "../../components/FixedAspect";
import Head from "next/head";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { renderMetaTags } from "react-datocms";
import styles from "./styles.css";
import { useRouter } from "next/router";

const PRESS_QUERY = gql`
  query pressQuery {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    press {
      title
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
    allArticles(first: 50) {
      tag
      link
      title
      snippet
      slug
      link2
      title2
      snippet2
      logo {
        width
        title
        height
        url
      }
      thumbnail {
        width
        title
        height
        url
      }
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;






const OutsideLink = ({ href, as, children, ...rest }) => {
  return (
    <a href={href} target="_blank" {...rest}>
      {children}
    </a>
  );
};

class Preview extends React.Component {
  render() {

    const isOutsideLink = !!this.props.link;
    const isOutsideLink2 = !!this.props.link2;
    let href = isOutsideLink ? this.props.link : `/press/[id]`;
    let href2 = isOutsideLink2 ? this.props.link2 : `/press/[id]`;
    let as = `/press/${this.props.slug}`;
    let LinkComponent = isOutsideLink ? OutsideLink : BetterLink;
    return (
      <div
        className={styles.preview}
        style={{ animationDelay: 0.5 + this.props.index * 0.1 + "s" }}
        ref={(c) => {
          this._el = c;
        }}
      >
        <FixedAspect ratio={0.75}>
          <div className={styles.card}>
            <div className={Cx("ff-product-1", styles.logo)}>
              {!!this.props.logo && <img src={this.props.logo.url} />}
            </div>
            <LinkComponent href={href} as={as}>
              <div className={Cx("ff-about-1", styles.title)}>
                {this.props.title}
              </div>
            </LinkComponent>
            <div className={Cx("ff-product-1", styles.snippet)}>
              {this.props.snippet}
            </div>
            {this.props.title2 && (
              <><LinkComponent href={href2} as={as}>
                <div className={Cx("ff-about-1", styles.title)}>
                  {this.props.title2}
                </div>
              </LinkComponent><div className={Cx("ff-product-1", styles.snippet)}>
                  {this.props.snippet2}
                </div></>
            )}
          </div>
        </FixedAspect>
      </div>
    );
  }
}
class PressLayout extends React.Component {
  render() {
    const { articles } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          {articles
            .map((article, i) => (
              <Preview {...article} key={i} />
            ))}
        </div>
      </div>
    );
  }
}

const Press = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Query query={PRESS_QUERY}>
      {({ loading, error, data }) => {
        if (loading)
          return <div className="loading ff-product-1">Loading...</div>;
        if (data && data.allArticles)
          return (
            <>
              <Head>{renderMetaTags([...data.press.seo, ...data.site.favicon])}</Head>

              <PressLayout articles={data.allArticles} />
            </>
          );
        if (error) console.log(error);
        return <div className="loading ff-product-1">Error :(</div>;
      }}
    </Query>
  );
};

export default Press;
