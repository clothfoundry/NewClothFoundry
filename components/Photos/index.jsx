import React from "react";
import Cx from "classnames";
import styles from "./styles.css";
import { shopifyImg, scrollTo } from "../../helpers";

class Photos extends React.Component {
  state = {
    zoom: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.zoom === false && this.state.zoom !== false) {
      let node = [...this._fullEl.children][this.state.zoom];
      let top = node.offsetTop;
      this._fullEl.scrollTop = Math.max(top, 0);
    }
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
    const imageEl = this._previewsEl.querySelector(`[data-id="${imageId}"]`);
    if (!imageEl) return;
    const offset = document
      .getElementById("product-details")
      .getBoundingClientRect().top;
    scrollTo(imageEl, -1 * offset, 0.65);
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
      <>
        <div
          className={Cx(styles.container)}
          onClick={this.onZoomInClick}
          ref={c => {
            this._previewsEl = c;
          }}
        >
          {this.props.images.map((o, i) => {
            return (
              <img
                data-id={o.id}
                src={shopifyImg(o.src, { width: 700 })}
                alt={o.altText}
                key={i}
              />
            );
          })}
        </div>
        {this.state.zoom !== false && (
          <div
            className={Cx(styles.full)}
            onClick={this.onZoomOutClick}
            ref={c => {
              this._fullEl = c;
            }}
          >
            {this.props.images.map((o, i) => {
              return (
                <img
                  src={shopifyImg(o.src, { width: 1600 })}
                  alt={o.altText}
                  key={i}
                />
              );
            })}
          </div>
        )}
      </>
    );
  }
}

export default Photos;
