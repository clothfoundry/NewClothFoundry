import client from "../../components/Shopify";
import { useEffect } from "react";

function Cart({ variant, qty }) {
  useEffect(() => {
    client.checkout.create().then((checkout) => {
      let lineItems = [
        {
          variantId: window.btoa(`gid://shopify/ProductVariant/${variant}`),
          quantity: parseInt(qty),
        },
      ];
      client.checkout.addLineItems(checkout.id, lineItems).then((checkout) => {
        if (checkout.lineItems[0]) {
          window.location =
            "/products/" + checkout.lineItems[0].variant.product.handle;
        } else {
          window.location = "/shop";
        }
      });
    });
  });
  return <div className="loading ff-product-1">Loading...</div>;
}

Cart.getInitialProps = async function (context) {
  const { id } = context.query;
  const [variant, qty] = id.split(":");

  return {
    variant,
    qty,
  };
};

export default Cart;
