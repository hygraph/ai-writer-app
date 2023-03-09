import type { AppProps } from "next/app";
import { BaukastenProvider } from "@hygraph/baukasten";

import "@fontsource/inter/variable-full.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <BaukastenProvider>
            <Component {...pageProps} />
        </BaukastenProvider>
    );
}
