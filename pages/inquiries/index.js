import Cx from "classnames";
import FixedAspect from "../../components/FixedAspect";
import Head from "next/head";
import Img from "../../components/Img";
import { Query } from "react-apollo";
import React from "react";
import gql from "graphql-tag";
import { renderMetaTags } from "react-datocms";
import styles from "./styles.css";

const STATUS_EMPTY = "empty";
const STATUS_ERROR = "error";
const STATUS_FETCHING = "fetching";
const STATUS_SUCCESS = "success";

const PAGE_QUERY = gql`
  {
    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
    inquiry {
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

class Inquiries extends React.Component {
  state = {
    status: STATUS_EMPTY
  };

  onSubmit = e => {
    e.preventDefault();
    const name = this._name.value;
    const email = this._email.value;
    const message = this._message.value;

    if (!email) {
      this._email.focus();
      return;
    }

    this.setState({
      status: STATUS_FETCHING
    });

    fetch("https://clothfoundrycom-lambdas.caclothfoundry.now.sh/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        message
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => resp.json())
      .then(json => {
        this.setState({
          status: json.success ? STATUS_SUCCESS : STATUS_ERROR
        });
      });
  };

  render() {
    return (
      <Query query={PAGE_QUERY}>
        {({ loading, error, data }) => {
          if (loading || !data) return <div className="loading" />;
          const page = data.inquiry;
          return (
            <>
              <Head>{renderMetaTags([...data.inquiry.seo, ...data.site.favicon])}</Head>
              <div className={Cx(styles.container)}>
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
                <div className={Cx(styles.textContainer)}>
                  <h1 className="ff-about-2">{page.title}</h1>
                  <div
                    className={Cx("ff-about-1")}
                    dangerouslySetInnerHTML={{ __html: page.body }}
                  />
                  {this.state.status === STATUS_SUCCESS && (
                    <div className="ff-about-1">
                      Successfully submitted. Thank you for your interest!
                    </div>
                  )}
                  {this.state.status !== STATUS_SUCCESS && (
                    <form
                      className="ff-about-1"
                      onSubmit={this.onSubmit}
                      disabled={this.state.status === STATUS_FETCHING}
                    >
                      <div>
                        <label htmlFor="inquiries_input_name">Name</label>
                        <input
                          id="inquiries_input_name"
                          type="text"
                          name="name"
                          ref={c => {
                            this._name = c;
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiries_input_name">Email</label>
                        <input
                          id="inquiries_input_name"
                          type="email"
                          name="email"
                          required
                          ref={c => {
                            this._email = c;
                          }}
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiries_input_name">Message</label>
                        <textarea
                          id="inquiries_input_name"
                          type="text"
                          name="message"
                          required
                          ref={c => {
                            this._message = c;
                          }}
                        />
                      </div>
                      <div>
                        <button className="ff-nav h-op" type="submit">
                          {this.state.status === STATUS_FETCHING
                            ? "Submitting..."
                            : "Submit"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Query>
    );
  }
}

export default Inquiries;
