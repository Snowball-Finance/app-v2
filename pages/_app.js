import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ApolloProvider } from '@apollo/client'

import Layout from 'Layout'
import { useApollo } from 'libs/apollo'
import { WalletProvider } from 'contexts/wallet-context'
import { PopupProvider } from 'contexts/popup-context'
import { PriceProvider } from 'contexts/price-context'
import { ContractProvider } from 'contexts/contract-context'
import SnowWeb3Provider from 'utils/hocs/SnowWeb3Provider'
import ThemeProvider from 'utils/hocs/ThemeProvider'
import * as COMMON_CONSTANTS from 'utils/constants/common'
import { BANNER_IMAGE_PATH } from 'utils/constants/image-paths'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIProvider } from 'contexts/api-context'
import { CompoundAndEarnProvider } from 'contexts/compound-and-earn-context'
import { StakingContractProvider } from 'contexts/staking-context'
import { ProviderProvider } from 'contexts/provider-context'
import { NotficationProvider } from 'contexts/notification-context'
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { analytics } from "utils/analytics"
import IframeProvider from 'contexts/IFrameContext'


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const initialized = useRef(false);
  const apolloClient = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    if (typeof window === undefined) return;
    if (!(initialized.current)) {
      initialized.current = true;
      analytics.trackPageView({
        href: router.pathname,
      });
    }
    const handleRouteChange = (url) => {
      analytics.trackPageView({
        href: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      if (typeof window === undefined) return;
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>{COMMON_CONSTANTS.TITLE}</title>
        <meta charSet='utf-8' />
        <meta name='keywords' content='Keywords' />
        <meta name='description' content='Description' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='theme-color' content='#FFFFFF' />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />

        {/* Open Graph / Facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={COMMON_CONSTANTS.SITE_URL} />
        <meta property='og:title' content={COMMON_CONSTANTS.TITLE} />
        <meta property='og:description' content={COMMON_CONSTANTS.DESCRIPTION} />
        <meta property='og:image' content={BANNER_IMAGE_PATH} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='628' />

        {/* Twitter */}
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={COMMON_CONSTANTS.SITE_URL} />
        <meta property='twitter:title' content={COMMON_CONSTANTS.TITLE} />
        <meta property='twitter:description' content={COMMON_CONSTANTS.DESCRIPTION} />
        <meta property='twitter:image' content={BANNER_IMAGE_PATH} />

        <meta name='msapplication-config' content='/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='msapplication-TileImage' content='/mstile-144x144.png' />
      </Head>
      <IframeProvider>
        <SnowWeb3Provider>
          <ApolloProvider client={apolloClient}>
            <ThemeProvider>
              <ProviderProvider>
                <WalletProvider>
                  <PopupProvider>
                    <NotficationProvider>
                      <APIProvider>
                        <PriceProvider>
                          <StakingContractProvider>
                            <ContractProvider>
                              <CompoundAndEarnProvider>
                                <CssBaseline />
                                <Layout>
                                  <Component {...pageProps} />
                                </Layout>
                              </CompoundAndEarnProvider>
                              <ToastContainer position={'bottom-right'} />
                            </ContractProvider>
                          </StakingContractProvider>
                        </PriceProvider>
                      </APIProvider>
                    </NotficationProvider>
                  </PopupProvider>
                </WalletProvider>
              </ProviderProvider>
            </ThemeProvider>
          </ApolloProvider>
        </SnowWeb3Provider>
      </IframeProvider>
    </>
  )
}

export default MyApp