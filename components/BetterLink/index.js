import * as React from "react";
import Cx from "classnames";
import Link from "next/link";
import { withRouter } from "next/router";

const BetterLink = ({
  router,
  as,
  href,
  exact,
  className,
  activeClassName,
  children,
  innerRef = () => {},
  ...rest
}) => {
  activeClassName = activeClassName || "is-active";
  let pathname = router.pathname;
  let isActive = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link as={as} href={href}>
      <a
        className={Cx(className, { [activeClassName]: isActive })}
        {...rest}
        ref={c => innerRef(c)}
      >
        {children}
      </a>
    </Link>
  );
};

export default withRouter(BetterLink);
