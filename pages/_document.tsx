
import { Fragment } from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext
} from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'

import globalStyles from 'styles/global'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        <Fragment key='styles'>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </Fragment>
      ]
    };
  }

  render(): JSX.Element {
    return (
      <Html lang='en'>
        <Head>
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='preload' href='/assets/fonts/Montserrat.woff' as='font' crossOrigin='anonymous' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='apple-touch-icon' sizes='120x120' href='/apple-touch-icon.png' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
          <link href='https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap' rel='stylesheet' />
          <style jsx global>
            {globalStyles}
          </style>
        </Head>
        <body id='body'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
