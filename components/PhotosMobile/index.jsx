import React from "react";
import Cx from "classnames";
import styles from "./styles.css";
import FixedAspect from "../FixedAspect";
import Img from "../Img";
import { shopifyImg } from "../../helpers";

let Flickity;

class PhotosMobile extends React.Component {
  state = {
    zoom: false
  };

  componentDidMount() {
    Flickity = require("flickity");
    this.flckt = new Flickity(this._gallery, {
      arrowShape: {
        x0: 10,
        x1: 60,
        y1: 50,
        x2: 65,
        y2: 45,
        x3: 20
      },
      pageDots: false,
      wrapAround: true,
      dragThreshold: 2
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.color !== prevProps.color) {
      this.scrollToColor(this.props.color);
    }
  }

  getIndexOfOptionByName(name) {
    let shopify = this.props.product.shopifyData;
    let index = shopify.options.findIndex(o => o.name.toLowerCase() === name);
    return "option" + (index + 1);
  }

  getImageFromColor(color) {
    let index = this.getIndexOfOptionByName("color");
    let shopify = this.props.product.shopifyData;
    let variant = shopify.variants.find(o => o[index] === color);
    if (variant.image_id) return variant.image_id;
    return false;
  }

  scrollToColor(color) {
    // Get image id
    const imageId = this.getImageFromColor(color);
    if (!imageId) return;
    const index = this.props.images.findIndex(o => o.id === imageId);
    if (index > -1 && this.flckt) {
      this.flckt.select(index, true);
    }
  }

  onZoomInClick = e => {
    let target = e.target;
    let zoom = [...target.parentNode.children].indexOf(target);
    this.setState({ zoom });
  };

  onZoomOutClick = e => {
    this.setState({ zoom: false });
  };

  render() {
    return (
      <div
        className={Cx(styles.container)}
        ref={c => {
          this._gallery = c;
        }}
      >
        {this.props.images.map((o, i) => {
          return (
            <FixedAspect
              data-id={o.id}
              width={o.width}
              height={o.height}
              key={i}
            >
              <Img
                className={Cx(styles.image)}
                readyClassName={styles.ready}
                src={shopifyImg(o.src, { width: 700 })}
                alt={o.altText}
              />
            </FixedAspect>
          );
        })}
      </div>
    );
  }
}

export default PhotosMobile;
