import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import CssBaseline from "@mui/material/CssBaseline";

const App = (props: AppProps) => {
    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <title>MAL Staking Lounge</title>
                <meta name="og:description" content="Staking the NFT" />
                <meta property="og:image" content="/thumbnail.jpeg" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CssBaseline />
            <Component {...pageProps} />
        </>
    );
};

export default App;
