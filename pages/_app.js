import "ress/ress.css";
import "../styles/global.css";

import App, { Container } from "next/app";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";

import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import Fabric from "../components/Fabric";
import Footer from "../components/Footer";
import Head from "next/head";
import Navigation from "../components/Navigation";
import React from "react";
import Router from "next/router";
import { createHttpLink } from "apollo-link-http";
import fetch from "node-fetch";
import { isTouch } from "../helpers";
import lax from "lax.js";
import { setContext } from "apollo-link-context";

if (typeof window !== "undefined") {
  if (isTouch()) {
    document.documentElement.classList.add("touch");
  } else {
    document.documentElement.classList.add("no-touch");
  }
}

const GQL_TOKEN = "20cfbdaf95792df657eda25c64c306";

const httpLink = createHttpLink({
  uri: "https://graphql.datocms.com",
  fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: Object.assign(headers || {}, {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${GQL_TOKEN}`
    })
  };
});

// HACK — Apollo seems to be working OK as long as types array exists but can be empty
// This way we don't have to manually keep track of the unions
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: []
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ fragmentMatcher })
});

// Enable Parallax Animation
if (process.browser) {
  lax.setup();
  document.addEventListener(
    "scroll",
    function(x) {
      lax.update(window.pageYOffset);
    },
    false
  );
  lax.update(window.pageYOffset);
}

function trackPageView(url) {
  try {
    window.gtag("config", "UA-125792972-1", {
      page_path: url
    });
  } catch (error) {
    console.log(error);
  }
}

class MyApp extends App {
  componentDidMount() {
    Router.onRouteChangeComplete = url => {
      trackPageView(url);
    };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ApolloProvider client={apolloClient}>
        <Container>
          <Fabric
            speed={
              (typeof window !== "undefined" && window.innerWidth) < 569
                ? -0.07
                : -0.15
            }
          />
          <Navigation />
          <Component {...pageProps} />
          <Footer />
        </Container>
      </ApolloProvider>
    );
  }
}

export default MyApp;

// A fix for Flickity bug on IOS 13.1
if (typeof window !== "undefined") {
  (function() {
    var touchingCarousel = false,
      touchStartCoords;

    document.body.addEventListener("touchstart", function(e) {
      if (e.target.closest(".flickity-slider")) {
        touchingCarousel = true;
      } else {
        touchingCarousel = false;
        return;
      }

      touchStartCoords = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    });

    document.body.addEventListener(
      "touchmove",
      function(e) {
        if (!(touchingCarousel && e.cancelable)) {
          return;
        }

        var moveVector = {
          x: e.touches[0].pageX - touchStartCoords.x,
          y: e.touches[0].pageY - touchStartCoords.y
        };

        if (Math.abs(moveVector.x) > 5) e.preventDefault();
      },
      { passive: false }
    );
  })();
}
