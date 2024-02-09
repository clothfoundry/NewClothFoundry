import React from "react";
import Cx from "classnames";
import styles from "./styles.css";
import MailchimpSubscribe from "react-mailchimp-subscribe";

const url =
  "https://clothfoundry.us18.list-manage.com/subscribe/post?u=6f874aa4fd047d091838747fd&id=d9d4a97239";

class Form extends React.Component {
  state = {
    stale: false,
    isReadyToSubmit: false
  };

  componentDidUpdate(prevProps) {
    if (this.props.status === "success" && prevProps.status !== "success") {
      this.setClearTimer();
    } else if (
      this.props.status === "error" &&
      prevProps.status !== "error" &&
      this.props.message.indexOf("is already subscribed") > -1
    ) {
      this.setClearTimer();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  setClearTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ stale: true });
      this._email.value = "";
    }, 3000);
  }

  onSubmit = e => {
    e.preventDefault();
    const email = this._email.value;
    email &&
      this.props.onValidated({
        EMAIL: email
      });
    this.setState({ stale: false });
  };

  onChange = e => {
    if (e.target.value && !this.state.isReadyToSubmit) {
      this.setState({
        isReadyToSubmit: true
      });
    } else if (!e.target.value && this.state.isReadyToSubmit) {
      this.setState({
        isReadyToSubmit: false
      });
    }
  };

  render() {
    const { status, message } = this.props;
    return (
      <div className={Cx(styles.form)}>
        <form onSubmit={this.onSubmit}>
          <input
            ref={c => (this._email = c)}
            type="email"
            placeholder="Join Our Newsletter"
            required
            onKeyDown={this.onChange}
            onKeyUp={this.onChange}
            onChange={this.onChange}
          />
          {this.state.isReadyToSubmit && status !== "sending" && (
            <button className={Cx("ff-nav h-op")}>
              <svg width="20" height="16" viewBox="0 0 20 16">
                <line x1="0" y1="8" x2="19" y2="8" />
                <polyline points="12,1 19,8 12,15" />
              </svg>
            </button>
          )}
        </form>
        {status === "sending" && !this.state.stale && (
          <div className={Cx(styles.result)}>Submitting...</div>
        )}
        {status === "error" &&
          message.indexOf("is already subscribed") === -1 &&
          !this.state.stale && (
            <div
              className={Cx(styles.result)}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
        {(status === "success" ||
          (status === "error" &&
            message.indexOf("is already subscribed") > -1)) &&
          !this.state.stale && (
            <div
              className={Cx(styles.result)}
              dangerouslySetInnerHTML={{ __html: "Thank you for signing up!" }}
            />
          )}
      </div>
    );
  }
}

class NewsletterForm extends React.Component {
  render() {
    return (
      <div className={Cx("ff-product-1", styles.newsletter)}>
        <MailchimpSubscribe
          url={url}
          render={({ subscribe, status, message }) => (
            <Form
              status={status}
              message={message}
              onValidated={formData => subscribe(formData)}
            />
          )}
        />
      </div>
    );
  }
}

export default NewsletterForm;
