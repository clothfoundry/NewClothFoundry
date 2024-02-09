import Cx from "classnames";
import { Query } from "react-apollo";
import React from "react";
import _ from "lodash";
import gql from "graphql-tag";
import styles from "./styles.css";

export const SIZE_CHART_QUERY = gql`
  {
    sizeChart {
      title
      content(markdown: true)
    }
  }
`;

const styleHTML = html => {
  return html.replace(/<h([12])>/, '<h$1 class="ff-nav">');
};

export default () => {
  return (
    <Query query={SIZE_CHART_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div className="loading" />;
        if (!data) return <div>No data</div>;
        return (
          <div className={Cx(styles.sizeChart)}>
            <h1 className="ff-nav">{data.sizeChart.title}</h1>
            <div
              className="ff-product-1"
              dangerouslySetInnerHTML={{
                __html: styleHTML(data.sizeChart.content)
              }}
            />
          </div>
        );
      }}
    </Query>
  );
};
