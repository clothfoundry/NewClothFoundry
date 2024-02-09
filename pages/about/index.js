import {
  getBreakPoint,
  getRuleByBreakpoint,
  parallaxSpeed,
  parseParallaxValue
} from "../../helpers";

import Cx from "classnames";
import Head from "next/head";
import ImageParallaxItem from "../../components/ImageParallaxItem";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import lax from "lax.js";
import marked from "marked";
import { renderMetaTags } from "react-datocms";
import styles from "./styles.css";

const ABOUTPAGE_QUERY = gql`
  {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    aboutPage {
      content {
        ... on HeadlineBlockRecord {
          id
          headline
          width
          parallaxSpeed
          customRule
          marginTop
          left
          textAlignment
        }
        ... on ImageBlockRecord {
          id
          width
          parallaxSpeed
          customRule
          marginTop
          left
          image {
            id
            url
            width
            height
          }
        }
        ... on TextBlockRecord {
          id
          width
          parallaxSpeed
          customRule
          marginTop
          left
          text(markdown: false)
        }
      }
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

const HeadlineParallaxItem = ({ className, headline, ...rest }) => {
  return (
    <div
      className={Cx(styles.block, styles.headlineContainer, className)}
      {...rest}
    >
      <h2 className={Cx(styles.headline, "ff-about-2")}>{headline}</h2>
    </div>
  );
};

function formatTextWithPlugins(text) {
  // Look for columns
  const regex = /\(columns-start\)([\s\S]*)\(columns-end\)/gim;
  const match = regex.exec(text);
  if (match) {
    let columns = match[1];
    columns = columns.split(/^[ \t]*\++\s*$/gim);
    columns = columns.reduce((a, v) => {
      return a + `<div class="${styles.column}">${marked(v)}</div>`;
    }, "");
    return `<div class="${styles.columns}">${columns}</div>`;
  }
  return marked(text);
}

const TextParallaxItem = ({ className, text, ...rest }) => {
  return (
    <div
      className={Cx(styles.block, styles.text, className, "ff-about-1")}
      dangerouslySetInnerHTML={{ __html: formatTextWithPlugins(text) }}
      {...rest}
    />
  );
};

class AboutLayout extends React.Component {
  state = {
    bp: "d"
  };

  componentDidMount() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
    let elements = this._el.querySelectorAll("[data-laxy]");
    for (let i = 0; i < elements.length; i++) {
      lax.addElement(elements[i]);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    let elements = this._el.querySelectorAll("[data-laxy]");
    for (let i = 0; i < elements.length; i++) {
      lax.removeElement(elements[i]);
    }
  }

  onResize = () => {
    let bp = getBreakPoint(window.innerWidth);
    if (this.state.bp !== bp) {
      this.setState(
        {
          bp
        },
        () => lax.updateElements()
      );
    }
  };

  render() {
    const data = this.props.data;
    const bp = this.state.bp;
    return (
      <div
        ref={c => {
          this._el = c;
        }}
      >
        {data.aboutPage.content.map((o, i) => {
          const id = "id" + o.id;
          const style = {};
          if (o.width) style.width = parseParallaxValue(o.width, bp) + "%";
          if (o.left) style.left = parseParallaxValue(o.left, bp) + "%";
          if (o.marginTop)
            style.marginTop = parseParallaxValue(o.marginTop, bp);
          if (o.textAlignment) style.textAlign = o.textAlignment;
          const customRule = o.customRule;
          const attrs = {
            className: styles[id],
            id: id,
            "data-laxy": !!o.parallaxSpeed || null,
            "data-lax-translate-y":
              getRuleByBreakpoint(customRule, bp) ||
              parallaxSpeed(
                parseFloat(parseParallaxValue(o.parallaxSpeed, bp))
              ),
            "data-lax-anchor": customRule ? null : "self",
            style
          };
          if (o.image) {
            return (
              <ImageParallaxItem
                {...attrs}
                src={o.image.url}
                width={o.image.width}
                height={o.image.height}
                parentWidth={parseParallaxValue(o.width, bp)}
                key={i}
              />
            );
          } else if (o.headline) {
            return (
              <HeadlineParallaxItem {...attrs} headline={o.headline} key={i} />
            );
          } else {
            return <TextParallaxItem {...attrs} text={o.text} key={i} />;
          }
        })}
      </div>
    );
  }
}

class About extends React.Component {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.spaced}>
          <Query query={ABOUTPAGE_QUERY}>
            {({ loading, error, data }) => {
              if (loading)
                return <div className="loading ff-product-1">Loading</div>;
              if (!data) return <div>No data</div>;
              return (
                <>
                  <Head>{renderMetaTags([...data.aboutPage.seo, ...data.site.favicon])}</Head>
                  <AboutLayout data={data} />
                </>
              )
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default About;
