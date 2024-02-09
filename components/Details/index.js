import _ from "lodash";
import React from "react";
import Cx from "classnames";
import ReactModal from "react-modal";
import BetterLink from "../BetterLink";
import styles from "./styles.css";
import Swatches from "../Swatches";
import { addToCheckout } from "../Shopify";
import SizeChart from "./SizeChart";

const isServer = typeof window === "undefined";
if (!isServer) {
  ReactModal.setAppElement(window.document.getElementById("__next"));
}

class Details extends React.Component {
  state = {
    careOpen: false,
    isAdding: false,
    sizeError: false,
    sizeChartOpen: false,
  };

  componentDidMount() {
    const isSwatchKit =
      this.props.product.shopifyData.tags.indexOf("swatchkit") > -1;
    if (isSwatchKit) this.props.onSizePick(1);
  }

  componentWillUnmount() {
    clearTimeout(this.sizeErrorTimer);
  }

  onColorPick = (e, index) => {
    e.preventDefault();
    this.props.onColorPick(index);
  };

  onSizePick = (e, index) => {
    e.preventDefault();
    this.props.onSizePick(index);
  };

  getPriceFromColor(color) {
    let index = this.getIndexOfOptionByName("color");
    let shopify = this.props.product.shopifyData;
    let variant = shopify.variants.find((o) => o[index] === color);
    if (variant) return variant.price;
    return shopify.variants[0].price;
  }

  getPriceFromSize(size) {
    let index = this.getIndexOfOptionByName("size");
    let shopify = this.props.product.shopifyData;
    let variant = shopify.variants.find((o) => o[index] === size);
    if (variant) return variant.price;
    return shopify.variants[0].price;
  }

  getIngredientsFromColor(color) {
    const id = ("" + color).toLowerCase();
    const product = this.props.product;
    const settings = product.variantSettings.find(
      (o) => o.color.toLowerCase() === id
    );
    return (
      settings && {
        color: settings.ingredientsColor,
        material: settings.ingredientsMaterial,
      }
    );
  }

  getContentFromColor(color) {
    const id = ("" + color).toLowerCase();
    const product = this.props.product;
    const settings = product.variantSettings.find(
      (o) => o.color.toLowerCase() === id
    );
    return (settings && settings.content) || "";
  }

  getYardStringFromColor(color) {
    const id = ("" + color).toLowerCase();
    const product = this.props.product;
    const settings = product.variantSettings.find(
      (o) => o.color.toLowerCase() === id
    );
    return (settings && settings.yardOverwrite) || "yard";
  }

  getIndexOfOptionByName(name) {
    let shopify = this.props.product.shopifyData;
    let index = shopify.options.findIndex((o) => o.name.toLowerCase() === name);
    return "option" + (index + 1);
  }

  getTextileVariantFromOptions(color) {
    const colorIndex = this.getIndexOfOptionByName("color");
    let shopify = this.props.product.shopifyData;
    return shopify.variants.find((o) => o[colorIndex] === color);
  }

  getVariantFromOptions(color, size) {
    const colorIndex = this.getIndexOfOptionByName("color");
    const sizeIndex = this.getIndexOfOptionByName("size");
    let shopify = this.props.product.shopifyData;
    return shopify.variants.find(
      (o) => o[colorIndex] === color && o[sizeIndex] === size
    );
  }

  getVariantFromSize(size) {
    const sizeIndex = this.getIndexOfOptionByName("size");
    let shopify = this.props.product.shopifyData;
    return shopify.variants.find((o) => o[sizeIndex] === size);
  }

  isVariantAvailable(options) {
    let variant = this.getVariantFromOptions(options.color, options.size);
    return variant && variant.inventory_quantity > 0;
  }

  onAddClick = (e) => {
    e.preventDefault();
    if (this.state.isAdding) return;
    if (this.props.size === false) {
      return this.triggerSizeError();
    }
    if (this.props.textile) {
      const variant = this.getTextileVariantFromOptions(this.props.color);
      if (!variant) return;
      this.setState({
        isAdding: true,
      });
      // TODO — HACK USES SIZES PROP TO STORE QUANTITY
      addToCheckout(variant, this.props.size).finally(() => {
        this.setState({ isAdding: false });
      });
      return;
    }
    // Add item to cart
    let variant = this.getVariantFromOptions(this.props.color, this.props.size);
    if (!variant) return;
    this.setState({
      isAdding: true,
    });
    addToCheckout(variant, 1).finally(() => {
      this.setState({ isAdding: false });
    });
  };

  onAddTowelsClick = (e) => {
    e.preventDefault();
    if (this.state.isAdding) return;
    if (this.props.size === false) {
      return this.triggerSizeError();
    }
    // Add item to cart
    let variant = this.getVariantFromSize(this.props.size);
    if (!variant) return;
    this.setState({
      isAdding: true,
    });
    addToCheckout(variant, 1).finally(() => {
      this.setState({ isAdding: false });
    });
  };

  onTowelsSizeChange = (e) => {
    this.props.onSizePick(e.target.value);
  };

  onQtyChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    this.props.onSizePick(qty);
  };

  triggerSizeError() {
    clearTimeout(this.sizeErrorTimer);
    this.setState({ sizeError: true });
    this.sizeErrorTimer = setTimeout(() => {
      this.setState({ sizeError: false });
    }, 800);
  }

  renderSizes(sizes, isTextile, isSwatchKit, isTowels) {
    if (isTextile) {
      return (
        <select
          className={styles.qtySelect}
          name="qty"
          onChange={this.onQtyChange}
          defaultValue={isSwatchKit ? "1" : "qty"}
        >
          <option value="qty" disabled>
            Quantity
          </option>
          {_.range(1, 31).map((o) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }

    if (isTowels) {
      return (
        <select
          className={styles.qtySelect}
          name="size"
          onChange={this.onTowelsSizeChange}
          defaultValue={"qty"}
        >
          <option value="qty" disabled>
            Pick a Size
          </option>
          {sizes.values.map((v) => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
        </select>
      );
    }

    // Regular Product
    return sizes.values.map((v) => {
      // Is size available?
      const isAvailable = this.isVariantAvailable({
        size: v,
        color: this.props.color,
      });
      return (
        <button
          className={Cx({
            [styles.active]: this.props.size === v,
            [styles.unavailable]: !isAvailable,
          })}
          onClick={(e) => {
            this.onSizePick(e, v);
          }}
          key={v}
        >
          <span>{v}</span>
        </button>
      );
    });
  }

  noOp = (e) => e.preventDefault();

  render() {
    let shopify = this.props.product.shopifyData;

    // HACKY RULES
    const isSwatchKit = shopify.tags.indexOf("swatchkit") > -1;
    const isTowels = shopify.tags.indexOf("towels") > -1;
    const isTextile = !!this.props.textile && !isTowels;
    const textileYardString = this.getYardStringFromColor(this.props.color);

    let colors = shopify.options.find((o) => o.name.toLowerCase() === "color");
    let sizes = shopify.options.find((o) => o.name.toLowerCase() === "size");
    let ingredients = this.getIngredientsFromColor(this.props.color);
    let price = isTowels
      ? this.getPriceFromSize(this.props.size)
      : this.getPriceFromColor(this.props.color);
    let availableForPurchase = shopify.variants.reduce((a, v) => {
      if (v.inventory_quantity > 0) a = true;
      return a;
    }, false);
    let presale = this.props.product.presaleNote;
    let logos = this.props.product.logos;
    let variantSettings = this.props.product.variantSettings;
    console.log(this.props.product.variantSettings);
    const isVariantAvailable = this.isVariantAvailable({
      size: this.props.size,
      color: this.props.color,
    });
    return (
      <article id="product-details" className={Cx(styles.container)}>
        <header className={Cx("ff-product-3", styles.header)}>
          <h1 className={Cx("ff-product-3")}>{shopify.title}</h1>
          {availableForPurchase ? (
            <div className={Cx("ff-product-3", styles.price)}>
              ${Math.round(price)}
              {isTextile && !isSwatchKit && <span>/yard </span>}
              {isTextile && !isSwatchKit && (
                <div className={Cx(styles.yardinfo)}>{textileYardString}</div>
              )}
              {!!presale && <div className={Cx(styles.presale)}>{presale}</div>}
            </div>
          ) : (
            <div className={Cx("ff-nav", styles.comingSoon)}>Coming Soon</div>
          )}
        </header>
        <div
          className={Cx("ff-product-1", styles.description, {
            [styles.swatchkit]: isSwatchKit,
          })}
        >
          
          <div dangerouslySetInnerHTML={{ __html: shopify.body_html }} />

          {!!ingredients && (
            <>
              <br />

              <div>
                <strong>Ingredients</strong>
                <br />
                {logos && (
                  <div
                    className="div-logo"
                    style={({ minWidth: "100%" }, { display: "flex" })}
                  >
                    <div style={{ width: "50%" }}>
                      {variantSettings
                        ?.find(
                          (logo) =>
                            logo.color.toLowerCase() ==
                            this.props.color.toLowerCase()
                        )
                        ?.logo?.map((logo) => (
                          <img
                            className={styles.logo}
                            src={logo.url}
                            alt={logo.alt}
                            key={logo.url}
                          />
                        ))}
                    </div>

                    {variantSettings
                      ?.find(
                        (logo) =>
                          logo.color.toLowerCase() ==
                          this.props.color.toLowerCase()
                      )
                      ?.logoscolor?.map((logo) => (
                        <div>
                          <img
                            className={styles.logo}
                            src={logo.url}
                            alt={logo.alt}
                            key={logo.url}
                          />
                        </div>
                      ))}
                  </div>
                )}
                <div className={Cx(styles.ingredients)}>
                  {!!ingredients.material && (
                    <div
                      dangerouslySetInnerHTML={{ __html: ingredients.material }}
                    />
                  )}{" "}
                  {!!ingredients.color && (
                    <div
                      dangerouslySetInnerHTML={{ __html: ingredients.color }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {!isTowels && (
          <div
            className={Cx("ff-product-1", styles.picker, styles.colorPicker)}
          >
            <h2 className={Cx(styles.colorLabel, "ff-product-1")}>
              {isSwatchKit ? "Material" : "Color"}
            </h2>
            <Swatches
              color={this.props.color}
              options={colors.values}
              onColorPick={this.onColorPick}
            />
          </div>
        )}
        {availableForPurchase && (
          <div
            className={Cx("ff-product-1", styles.picker, styles.sizeAdd, {
              [styles.swatchkit]: isSwatchKit,
              [styles.towels]: isTowels,
            })}
          >
            {!isSwatchKit && (
              <h2 className={"ff-product-1"}>{isTextile ? "Yards" : "Size"}</h2>
            )}
            <div className={Cx(styles.sizePicker)}>
              <div className={Cx(styles.sizesAdd)}>
                <div
                  className={Cx(styles.secondaryPicker, {
                    [styles.error]: this.state.sizeError,
                  })}
                >
                  {this.renderSizes(sizes, isTextile, isSwatchKit, isTowels)}
                </div>
                <a
                  href="#"
                  className={Cx("ff-nav", "h-op", styles.add, {
                    [styles.unavailable]: isVariantAvailable === false,
                  })}
                  onClick={
                    isTowels
                      ? this.onAddTowelsClick
                      : isVariantAvailable === false
                      ? this.noOp
                      : this.onAddClick
                  }
                >
                  {this.state.isAdding
                    ? "Adding"
                    : isVariantAvailable === false
                    ? "Out of Stock"
                    : "Add to Bag"}
                </a>
              </div>
            </div>
          </div>
        )}
        {!isTextile && (
          <div className={Cx("ff-product-1", styles.links)}>
            {!isTowels && (
              <div>
                <a
                  className={Cx("h-op")}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ sizeChartOpen: !this.state.sizeChartOpen });
                  }}
                >
                  Size Chart
                </a>
              </div>
            )}
            <div>
              <a
                className={Cx("h-op")}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({ careOpen: !this.state.careOpen });
                }}
              >
                Care and Content
              </a>
            </div>
            {!!this.props.product.textileLink && (
              <div className={Cx(styles.fabricLink)}>
                <BetterLink
                  className={Cx("h-op")}
                  href={this.props.product.textileLink}
                >
                  Shop the fabric
                </BetterLink>
              </div>
            )}
          </div>
        )}
        <ReactModal
          className={styles.modalContent}
          overlayClassName={Cx(styles.modalOverlay)}
          isOpen={this.state.sizeChartOpen}
          htmlOpenClassName={"ReactModal__Html--open"}
          closeTimeoutMS={250}
          onRequestClose={() => this.setState({ sizeChartOpen: false })}
        >
          <SizeChart />
          <button
            className={Cx(styles.modalClose)}
            onClick={() => this.setState({ sizeChartOpen: false })}
          >
            <svg width="12px" height="12px" viewBox="0 0 12 12">
              <path d="M0,0 L12,12" />
              <path d="M12,0 L0,12" />
            </svg>
          </button>
        </ReactModal>
        <ReactModal
          className={styles.modalContent}
          overlayClassName={Cx(styles.modalOverlay)}
          isOpen={this.state.careOpen}
          htmlOpenClassName={"ReactModal__Html--open"}
          closeTimeoutMS={250}
          onRequestClose={() => this.setState({ careOpen: false })}
        >
          <div className={Cx(styles.careAndContent)}>
            <h1 className="ff-nav">Care and Content</h1>
            <div
              className="ff-product-1"
              dangerouslySetInnerHTML={{
                __html:
                  this.getContentFromColor(this.props.color) +
                  this.props.product.careInstructions,
              }}
            />
          </div>
          <button
            className={Cx(styles.modalClose)}
            onClick={() => this.setState({ careOpen: false })}
          >
            <svg width="12px" height="12px" viewBox="0 0 12 12">
              <path d="M0,0 L12,12" />
              <path d="M12,0 L0,12" />
            </svg>
          </button>
        </ReactModal>
      </article>
    );
  }
}

export default Details;
