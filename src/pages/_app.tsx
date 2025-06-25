import Layout from "@/components/Layout";
import React from "react";
import "@/styles/globals.css";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TitleProvider } from "@/context/TitleContext";
import { SimulationProvider } from "@/context/SimulationContext";
import { ToastAlertProvider } from '@/context/ToastAlertContext';
import AlertBanner from "@/components/AlertBanner";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <ToastAlertProvider>
          <TitleProvider>
            <SimulationProvider>
              <Layout>
                <Component {...pageProps} />
                <AlertBanner />
              </Layout>
            </SimulationProvider>
          </TitleProvider>
        </ToastAlertProvider>
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
