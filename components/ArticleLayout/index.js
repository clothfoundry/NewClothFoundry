import React from "react";
import Cx from "classnames";
import styles from "./styles.css";
import format from "date-fns/format";
import parse from "date-fns/parse";

const formatDate = date => {
  return format(parse(date), "MMMM D, YYYY");
};

class TextPage extends React.Component {
  render() {
    return (
      <div className={Cx(styles.container)}>
        <header>
          <h1 className="ff-body-header">
            {this.props.longTitle || this.props.title}
          </h1>
          <div className={Cx("ff-product-1", styles.date)}>
            {formatDate(this.props.publishDate)}
          </div>
        </header>
        <div
          className="ff-about-1"
          dangerouslySetInnerHTML={{ __html: this.props.body }}
        />
      </div>
    );
  }
}

export default TextPage;
