import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  setGoogleTags() {
    return {
      __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-125792972-1', { 'anonymize_ip': true });
      `
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
          <link rel="shortcut icon" href="/static/images/favicon.png" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/flickity@2/dist/flickity.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-125792972-1"
          />
          {/* We call the function above to inject the contents of the script tag */}
          <script dangerouslySetInnerHTML={this.setGoogleTags()} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
