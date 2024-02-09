import Cx from "classnames";
import React from "react";
import styles from "./styles.css";

class FixedAspect extends React.Component {
  render() {
    let {
      className,
      style,
      children,
      width,
      height,
      ratio,
      ...rest
    } = this.props;
    let newStyle = Object.assign({}, style);
    ratio = ratio || width / height;
    newStyle.paddingTop = 100 / ratio + "%";
    return (
      <div
        className={Cx(styles.container, className)}
        style={newStyle}
        {...rest}
      >
        {children}
      </div>
    );
  }
}

export default FixedAspect;
