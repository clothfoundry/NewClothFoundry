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
    setTimeout(() => this.resize(), 50);
    this.load(FABRIC_IMG);
    // console.log("FabricCanvas", this.scale, pos);
  }

  resize(newPos) {
    let rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    if (newPos !== undefined) this.moveTo(newPos);
    // console.log(
    //   "FabricCanvas.resize",
    //   "width",
    //   this.width,
    //   "height",
    //   this.height
    // );
    this.render();
  }

  moveTo(pos) {
    this.pos = pos;
    this.render();
  }

  load(src) {
    const img = document.createElement("img");
    img.onload = () => {
      // console.log("Fabric image loaded:", img.width, img.height);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      this.image = canvas;
      // console.log(
      //   "Fabric canvas generated:",
      //   this.image,
      //   canvas.width,
      //   canvas.height
      // );
      this.render();
      this.onLoad();
    };
    img.src = src;
  }

  render() {
    if (!this.image) return;
    const scaledH = this.image.height * (this.width / this.image.width);
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(0, Math.max(this.pos, this.height - scaledH));
    this.ctx.drawImage(this.image, 0, 0, this.width, scaledH);
    this.ctx.restore();
  }
}

class Fabric extends React.Component {
  static defaultProps = {
    speed: -0.15
  };

  state = {
    ready: false,
    offset: 0
  };

  componentDidMount() {
    this.fabric = new FabricCanvas(this._el, this._canvas, window.pageYOffset);
    this.fabric.onLoad = () =>
      this.setState({
        ready: true
      });
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
        className={styles.container}
        ref={c => {
          this._el = c;
        }}
      >
        <canvas
          className={styles.canvas}
          style={{
            opacity: this.state.ready ? 1 : 0
          }}
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
