import {
  getBreakPoint,
  getRuleByBreakpoint,
  parallaxSpeed,
  parseParallaxValue,
} from "../../helpers";

import Slider from "react-slick";
import BetterLink from "../../components/BetterLink";
import Cx from "classnames";
import Head from "next/head";
import ImageParallaxItem from "../../components/ImageParallaxItem";
import Intro from "../../components/Intro";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import lax from "lax.js";
import { renderMetaTags } from "react-datocms";
import styles from "./styles.css";
import config from "../../config";
import ProductsPage from "../../components/ProductsPage";

export const HOMEPAGE_QUERY = gql`
  {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    homepage {
      hero {
        title
        link
        image {
          id
          url
          width
          height
        }
        color {
          hex
        }
      }
      content {
        ... on FeatureTextRecord {
          id
          left
          link
          linkText
          marginTop
          parallaxSpeed
          customRule
          body(markdown: true)
          width
          textAlignment
        }
        ... on ImageRecord {
          id
          link
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
      }
      customer {
        id
        link
        title
        image {
          width
          height
          url
        }
      }
      logos {
        id
        link
        title
        image {
          width
          height
          url
        }
      }
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }
    social: allSocials {
      link
    }
  }
`;


const FeatureText = ({ className, text, link, linkText, ...rest }) => {
  return (
    <div
      className={Cx(styles.textContainer, className, {
        [styles.motto]: !!linkText && !link,
      })}
      {...rest}
    >
      <div
        className={Cx(styles.featureText, "ff-home-1")}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      {!!linkText && !link && <div className="ff-home-1">{linkText}</div>}
    </div>
  );
};

class HomeLayout extends React.Component {
  state = {
    bp: "d",
  };

  componentDidMount() {
    this.onResize();
    document.documentElement.classList.add("ready");
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
          bp,
        },
        () => lax.updateElements()
      );
    }
  };

  render() {
    const data = this.props.data;
    const bp = this.state.bp;
    return (
      <>
        <div
          ref={(c) => {
            this._el = c;
          }}
        >
          {data.homepage.content.map((o, i) => {
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
              style,
            };
            // Render Text
            if (o.body || o.linkText) {
              return (
                <FeatureText
                  {...attrs}
                  text={o.body}
                  link={o.link}
                  linkText={o.linkText}
                  key={i}
                />
              );
            }
            // Render Image
            //if (o.image) {
              //return (
                //<ImageParallaxItem
                  //{...attrs}
                  //link={o.link}
                  //src={o.image.url}
                  //width={o.image.width}
                  //height={o.image.height}
                  //parentWidth={parseParallaxValue(o.width, bp)}
                  //key={i}
                ///>
              //);
            //}
            return null;
          })}
        </div>
      </>
    );
  }
}

class Home extends React.Component {
  state = {};

  componentDidMount() {}

  render() {
    const settingsHero = {
      dots: false,
      infinite: true,
      speed: 5000,
      adaptiveHeight: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      speed: 4000,
      autoplaySpeed: 2000,
      cssEase: "linear", 
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            arrows: true,
            slidesToShow: 2,
          },
        },
      ]
     
    };
    const settingsCarousel = {
      arrows: true,
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 0,
      speed: 5000,
      cssEase: "linear",
      infinite: true,
      focusOnSelect: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            arrows: true,
            slidesToShow: 2,
          },
        },
      ],

    };
    return (
      <div className={styles.container}>
        <Intro
          speed={
            (typeof window !== "undefined" && window.innerWidth) < 569
              ? -0.07
              : -0.15
          }
        />

        <Query query={HOMEPAGE_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <div className="loading" />;
            if (!data) return <div>No data</div>;
            return (
              <>
                <Head>
                  {renderMetaTags([...data.homepage.seo, ...data.site.favicon])}
                  <script type="application/ld+json">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      name: config.title,
                      email: config.email,
                      url: config.siteUrl,
                      logo: `${config.siteUrl}/static/images/favicon.png`,
                      sameAs: data.social.map((social) => social.link),
                    })}
                  </script>
                </Head>
                
                {/* Banner starts here*/}
                <div className={styles.spaced}>
                  <Slider {...settingsHero}>
                  {data.homepage.hero.map((o, i) => {
                      return (
                        <div className={Cx(styles.spaced)} id={"id" + o.id} key={i}>
                  {o.link ? (
                    <BetterLink href={o.link}>
                    <img src={o.image.url} alt={o.title}/>
                  </BetterLink>
                    ) : (
                    <img src={o.image.url} alt={o.title} />
                    )}
                  </div>
                      );
                    })}
                  </Slider>
                </div>
                {/*<div className={styles.spaced}>
                  {console.log(data)}
                  <HomeLayout data={data} />
                </div>*/}
                
                <div>
                  <ProductsPage
                    collectionId="Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzg4ODY0MTI5MDgz"
                    hrefPrefix="apparel"
                    loadingMessage="Loading..."
                    className={styles.prod}
                    text="Products"
                  />
                </div>
                <div>
                  <Slider {...settingsCarousel}>
                    {data.homepage.logos.map((o, i) => {
                      return (
                        <div
                          className={Cx(styles.customers)}
                          id={"id" + o.id}
                          key={i}
                        >
                          {o.link ? (
                            <BetterLink href={o.link}>
                              <img
                                src={o.image.url}
                                alt={o.title}
                                className="img-carrucel"
                              />
                            </BetterLink>
                          ) : (
                            <img
                              src={o.image.url}
                              alt={o.title}
                              className="img-carrucel"
                            />
                          )}
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Home;


//* <div className={styles.spaced}>
//*  <Slider {...settingsHero}>
//*    {data.homepage.hero.map((o, i) => {
//*      return (
//*         <div className={Cx(styles.spaced)} id={"id" + o.id} key={i}>
//*   {o.link ? (
//*     <BetterLink href={o.link}>
//*     <img src={o.image.url} alt={o.title} />
//*   </BetterLink>
//* ) : (
//*     <img src={o.image.url} alt={o.title} />
//*    )}
//*   </div>
//* );
//*    })}
//*  </Slider>
//*      </div>

