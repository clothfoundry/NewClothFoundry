import React from "react";
import styles from "./styles.css";

class Intro extends React.Component {
  static defaultProps = {
    speed: -0.3
  };

  state = {
    offset: 0
  };

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  onScroll = () => {
    this.setState({
      offset: window.pageYOffset * this.props.speed,
      opacity: 1 - Math.min(1, Math.max(0, (window.pageYOffset - 150) / 150))
    });
  };

  render() {
    return (
      <div
        className={styles.container}
        style={{
          transform: `translateY(${this.state.offset}px)`,
          opacity: this.state.opacity
        }}
      >
        <div>
          <img src="/static/images/cloth-foundry-logo.svg" className={styles.logo} />
        </div>
      </div>
    );
  }
}

export default Intro;
