import Cx from "classnames";
import styles from "./styles.css";
import Img from "../../components/Img";
import FixedAspect from "../../components/FixedAspect";
import BetterLink from "../../components/BetterLink";

function getWidth(width) {
  if (width > 50 && window.innerWidth > 1200) return 1400;
  return 800;
}

const ImageParallaxItem = ({
  className,
  width,
  height,
  src,
  link,
  parentWidth,
  ...rest
}) => {
  let Component = link ? BetterLink : "div";
  return (
    <Component
      className={Cx(styles.imageContainer, className)}
      href={link ? link : undefined}
      {...rest}
    >
      <FixedAspect width={width} height={height}>
        <Img
          className={Cx(styles.image)}
          readyClassName={styles.ready}
          src={src + "?w=" + getWidth(parentWidth) + "&q=85"}
        />
      </FixedAspect>
    </Component>
  );
};

export default ImageParallaxItem;
