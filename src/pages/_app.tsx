import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";

import { theme } from "@/utils";

interface PageProps {
  session: Session;
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<PageProps>) => (
  <SessionProvider session={session}>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  </SessionProvider>
);

export default App;
