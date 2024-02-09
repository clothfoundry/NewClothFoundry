import React from "react";
import Cx from "classnames";
import styles from "./styles.css";

const FABRIC_IMG = "/static/images/fabric_full.jpg";

class FabricCanvas {
  constructor(containerEl, canvasEl, pos = 0) {
    this.container = containerEl;
    this.canvas = canvasEl;
    this.ctx = this.canvas.getContext("2d");
    this.pos = pos;
    this.scale = window.devicePixelRatio || 1;
    this.resize();
    this.load(FABRIC_IMG);
  }

  resize(newPos) {
    let rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    if (newPos !== undefined) this.moveTo(newPos);
  }

  moveTo(pos) {
    this.pos = pos;
    this.render();
  }

  load(src) {
    const img = document.createElement("img");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      this.image = canvas;
      this.render();
    };
    img.src = src;
  }

  render() {
    if (!this.image) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(0, this.pos);
    this.ctx.globalCompositeOperation = "source-over";
    const gradient = this.ctx.createLinearGradient(
      0,
      -this.pos,
      0,
      -this.pos + 90
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.85)");
    gradient.addColorStop(0.1, "rgba(0, 0, 0, 0.85)");
    gradient.addColorStop(0.95, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, -this.pos, this.width, this.height);
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.image.height * (this.width / this.image.width)
    );
    this.ctx.restore();
  }
}

class Fabric extends React.Component {
  static defaultProps = {
    speed: -0.15
  };

  state = {
    offset: 0
  };

  componentDidMount() {
    this.fabric = new FabricCanvas(this._el, this._canvas, window.pageYOffset);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
  }

  onScroll = () => {
    if (this.fabric) this.fabric.moveTo(window.pageYOffset * this.props.speed);
    // this.setState({
    //   offset: window.pageYOffset * this.props.speed
    // });
  };

  onResize = () => {
    if (this.fabric) this.fabric.resize(window.pageYOffset * this.props.speed);
  };

  render() {
    return (
      <div
        className={Cx(this.props.className, styles.container)}
        ref={c => {
          this._el = c;
        }}
      >
        <canvas
          className={styles.canvas}
          ref={c => {
            this._canvas = c;
          }}
        />
      </div>
    );
  }
}

export default Fabric;

/*<img
  className={styles.fabric}
  style={{ transform: `translateY(${this.state.offset}px)` }}
  src={fabric_img}
/>*/
