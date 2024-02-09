import styles from "./styles.css";

class UiKit extends React.Component {
  state = {};

  componentDidMount() {
    document.querySelector('[role="nav"]').style.display = "none";
    document.querySelector('[role="footer"]').style.display = "none";
  }

  componentWillUnmount() {
    document.querySelector('[role="nav"]').style.display = "flex";
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>Typography</h1>

        <h2>Navigation / Product Grid</h2>
        <div className="ff-nav">
          <span>About</span> <span>Apparel</span> <span>Textiles</span>{" "}
          <span>Inquiries</span>
        </div>

        <h2>Home Text</h2>
        <div>
          <div className="ff-home-1">
            <p>
              We make the healthiest fabrics and fashion on the planet. The
              purity of our ingredients, natural fibers and botanical dyes, is
              our alchemy.
            </p>
          </div>
        </div>

        <h2>About Heading</h2>
        <div className="ff-about-2">Process</div>

        <h2>About Text</h2>
        <div>
          <div className="ff-about-1">
            <p>
              <b>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore.
              </b>
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </div>
        </div>

        <h2>Product Title</h2>
        <div className="ff-product-3">
          Umi Pant
          <br />
          $180
        </div>

        <h2>Product Body</h2>
        <div className="ff-product-1">
          Perfectly sized quilted pockets
          <br />
          Ankle length
          <br />
          Pull the legs up to scrunch around the calf
          <br />
          Tailored fit
          <br />
          <br />
          <em>Ingregients</em>
          <br />
          75% Cleaner Cotton, 25% Lenzig Modal
        </div>

        <h2>Product Links</h2>
        <div className="ff-product-2">
          Size Chart
          <br />
          Care Instructions
        </div>
      </div>
    );
  }
}

export default UiKit;
