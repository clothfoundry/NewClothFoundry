import React from "react";
import Cx from "classnames";
import styles from "./styles.css";
import BetterLink from "../BetterLink";
import FabricMask from "../FabricMask";
import { fetchCheckout, updateCheckout, cartEvents } from "../Shopify";

const NavLink = ({ className, children, ...rest }) => {
  return (
    <BetterLink
      className={Cx(styles.navLink, className)}
      activeClassName={styles.active}
      {...rest}
    >
      <span>{children}</span>
    </BetterLink>
  );
};

// TODO — Use the swatches endpoint to get the names
const FABRIC_NAMES = {
  "bio white": "Bio White",
  charcoal: "Charcoal",
  coral: "Coral",
  heather: "Heather",
  natural: "Natural",
  stripe: "Stripe",
  knits: "Knits",
  wovens: "Wovens",
};

class CartView extends React.Component {
  componentDidMount() {
    document
      .getElementById("__next")
      .addEventListener("click", this.onDocumentClick);
    document
      .getElementById("__next")
      .addEventListener("touchstart", this.onDocumentClick);
  }

  componentWillUnmount() {
    document
      .getElementById("__next")
      .removeEventListener("click", this.onDocumentClick);
    document
      .getElementById("__next")
      .removeEventListener("touchstart", this.onDocumentClick);
  }

  onDocumentClick = (e) => {
    if (!this.props.open || this._el.contains(e.target)) {
      return;
    }
    if (this.props.onClickOutside) this.props.onClickOutside();
  };

  onRemoveClick = (e, lineItemId) => {
    e.preventDefault();
    updateCheckout(lineItemId, 0);
  };

  render() {
    let lineItems = this.props.checkout ? this.props.checkout.lineItems : [];
    lineItems = lineItems.filter((item) => !!item.variant);
    lineItems.reverse();

    if (lineItems.length === 0) {
      return (
        <div
          className={Cx(styles.cartView, "ff-product-1", {
            [styles.open]: this.props.open,
          })}
          ref={(c) => {
            this._el = c;
          }}
        >
          <div className={Cx(styles.cartViewTitle)}>Your bag is empty</div>
        </div>
      );
    }
    return (
      <div
        className={Cx(styles.cartView, "ff-product-1", {
          [styles.open]: this.props.open,
        })}
        ref={(c) => {
          this._el = c;
        }}
      >
        <div className={Cx(styles.cartViewTitle)}>
          <b>Your Bag</b>
        </div>
        <ul className={styles.lineItems}>
          {lineItems.map((o) => {
            const options = o.variant.title.split(" / ");
            const handle = o.variant.product.handle;
            const isTowels = handle.indexOf("towels") > -1;
            const isSwatchKit = handle.indexOf("swatch-kit") > -1;
            return (
              <li key={o.id}>
                <div className={Cx(styles.image)}>
                  <BetterLink
                    href="/products/[id]"
                    as={`/products/${o.variant.product.handle}`}
                  >
                    <img src={o.variant.image.src} />
                  </BetterLink>
                </div>
                <div className={Cx(styles.details)}>
                  <div className={Cx(styles.titlePrice)}>
                    <div className={Cx("ff-nav", styles.tilte)}>
                      <BetterLink
                        href="/products/[id]"
                        as={`/products/${o.variant.product.handle}`}
                      >
                        {o.title}
                      </BetterLink>
                    </div>
                    <div className={Cx(styles.price, "ff-nav")}>
                      ${parseFloat(o.variant.price.amount)}
                    </div>
                  </div>
                  <div>
                    {!isTowels && (
                      <div>
                        {isSwatchKit ? "Material" : "Color"}:{" "}
                        {FABRIC_NAMES[options[0].toLowerCase()]}
                      </div>
                    )}
                    {isTowels && <div>Size: {options[0]}</div>}
                    {!!options[1] && <div>Size: {options[1]}</div>}
                    <div className={Cx(styles.qtyRemove)}>
                      <span>
                        {!!options[1]
                          ? "Qty"
                          : isSwatchKit || isTowels
                          ? "Qty"
                          : "Yards"}
                        : {o.quantity}
                      </span>
                      <button
                        className={Cx(styles.remove)}
                        onClick={(e) => this.onRemoveClick(e, o.id)}
                      >
                        <svg width="12px" height="12px" viewBox="0 0 12 12">
                          <path d="M0,0 L12,12" />
                          <path d="M12,0 L0,12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className={styles.checkoutArea}>
          <a
            href={this.props.checkout.webUrl}
            className={Cx("ff-nav", "h-op", styles.checkout)}
          >
            Checkout
          </a>
        </div>
      </div>
    );
  }
}

class MobileNav extends React.Component {
  componentDidMount() {
    document
      .getElementById("__next")
      .addEventListener("click", this.onDocumentClick);
    document
      .getElementById("__next")
      .addEventListener("touchstart", this.onDocumentClick);
  }

  componentWillUnmount() {
    document
      .getElementById("__next")
      .removeEventListener("click", this.onDocumentClick);
    document
      .getElementById("__next")
      .removeEventListener("touchstart", this.onDocumentClick);
  }

  onDocumentClick = (e) => {
    if (!this.props.open || this._el.contains(e.target)) {
      return;
    }
    if (this.props.onClickOutside) this.props.onClickOutside();
  };

  onMenuClick = (e) => {
    if (this.props.onClickOutside) this.props.onClickOutside();
  };

  render() {
    return (
      <div
        className={Cx(styles.mobileNav, "ff-product-1", {
          [styles.open]: this.props.open,
        })}
        ref={(c) => {
          this._el = c;
        }}
      >
        <ul className="ff-nav" onClick={this.onMenuClick}>
          <li>
            <NavLink className="h-op" href="/about">
              About
            </NavLink>
          </li>
          <li>
            <NavLink className="h-op" href="/regenerative">
              Regenerative
            </NavLink>
          </li>
          <li>
            <NavLink className="h-op" href="/shop">
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink className="h-op" href="/textiles">
              Textiles
            </NavLink>
          </li>
          <li>
            <NavLink className="h-op" href="/press">
              Press
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

class Navigation extends React.Component {
  state = {
    checkout: false,
    cartOpen: false,
    menuOpen: false,
  };

  componentDidMount() {
    this.mounted = true;
    this.updateCheckout();
    cartEvents.on("checkout.update", this.updateCheckout);
    this._cartLink.addEventListener("click", this.onCartLinkClick);
    this._menuLink.addEventListener("click", this.onMenuLinkClick);
  }

  componentWillUnmount() {
    clearTimeout(this.closeCartTimer);
    this.mounted = false;
    cartEvents.removeListener("checkout.update", this.updateCheckout);
    this._cartLink.removeEventListener("click", this.onCartLinkClick);
    this._menuLink.removeEventListener("click", this.onMenuLinkClick);
  }

  updateCheckout = () => {
    const checkoutHasLoaded = this.state.checkout !== false;
    fetchCheckout().then((checkout) => {
      if (!this.mounted) return;
      this.setState({ checkout, cartOpen: checkoutHasLoaded });
      if (checkoutHasLoaded) {
        clearTimeout(this.closeCartTimer);
        this.closeCartTimer = setTimeout(this.closeCart, 2000);
      }
    });
  };

  totalItems = (lineItems) => {
    let total = lineItems.reduce((a, c) => {
      a += c.quantity;
      return a;
    }, 0);
    return total;
  };

  onCartLinkClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!this.state.cartOpen) {
      e.stopPropagation();
      clearTimeout(this.closeCartTimer);
      this.setState({ cartOpen: true, menuOpen: false });
    }
  };

  onMenuLinkClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!this.state.menuOpen) {
      e.stopPropagation();
      clearTimeout(this.closeCartTimer);
      this.setState({ menuOpen: true, cartOpen: false });
    }
  };

  closeCart = () => {
    this.setState({ cartOpen: false });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    const total = this.totalItems(
      this.state.checkout ? this.state.checkout.lineItems : []
    );
    return (
      <div className={Cx(styles.container, "ff-nav")} role="nav">
        <div className={styles.leftSide}>
          <BetterLink className={styles.logoLink} href="/">
            California Cloth Foundry
          </BetterLink>
        </div>
        <div className={styles.rightSide}>
          <NavLink className="h-op" href="/about">
            About
          </NavLink>
          <NavLink className="h-op" href="/regenerative">
            Regenerative
          </NavLink>
          <NavLink className="h-op" href="/shop">
            Shop
          </NavLink>
          <NavLink className="h-op" href="/textiles">
            Textiles
          </NavLink>
          <NavLink className="h-op" href="/press">
            Press
          </NavLink>
          <div className={styles.cartLink}>
            <a
              href="/bag"
              ref={(c) => {
                this._cartLink = c;
              }}
            >
              <svg
                className={styles.shoppingBag}
                x="0px"
                y="0px"
                viewBox="0 0 36 50"
              >
                <path
                  d="M33.4,49.7H1.8c-1,0-1.8-0.8-1.8-1.8V13.1c0-1,0.8-1.8,1.8-1.8h7.1V8.8c0-4.8,3.9-8.8,8.8-8.8c4.8,0,8.7,3.9,8.7,8.7v2.6
                h7.1c1,0,1.8,0.8,1.8,1.8V48C35.1,48.9,34.3,49.7,33.4,49.7z M1.8,12.9c-0.1,0-0.2,0.1-0.2,0.2V48c0,0.1,0.1,0.2,0.2,0.2h31.6
                c0.1,0,0.2-0.1,0.2-0.2V13.1c0-0.1-0.1-0.2-0.2-0.2h-7.1v6.2h-1.5v-6.2H10.4v6.2H8.9v-6.2H1.8z M10.4,11.4h14.4V8.7
                c0-4-3.2-7.2-7.2-7.2c-4,0-7.2,3.3-7.2,7.2V11.4z"
                />
              </svg>
              {!!total && <span className={styles.lineCount}>{total}</span>}
            </a>
            <CartView
              open={this.state.cartOpen}
              checkout={this.state.checkout}
              onClickOutside={this.closeCart}
            />
          </div>
          <div className={Cx(styles.mobileNavToggle)}>
            <a
              href="#"
              ref={(c) => {
                this._menuLink = c;
              }}
            >
              <svg
                className={styles.burger}
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <line x1="2" y1="4" x2="18" y2="4" />
                <line x1="2" y1="10" x2="18" y2="10" />
                <line x1="2" y1="16" x2="18" y2="16" />
              </svg>
            </a>
            <MobileNav
              open={this.state.menuOpen}
              onClickOutside={this.closeMenu}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
