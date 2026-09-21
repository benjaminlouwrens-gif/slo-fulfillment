import React from 'react';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Hero } from '@/src/components/Hero';
import { FulfillmentStory } from '@/src/components/FulfillmentStory';

export default function Home() {
  return (
    <>
      <Head>
        <title>Southern LoCal Fulfillment | Free Fulfillment Matchmaking for SoCal Ecommerce</title>
        <meta
          name="description"
          content="We connect growing ecommerce brands with vetted fulfillment partners across Los Angeles, Orange County, San Diego, the Inland Empire, Riverside, and Ontario. Free to brands, matched in days, no contracts."
        />
        <meta
          name="keywords"
          content="fulfillment matchmaking, 3PL matching, Southern California fulfillment, ecommerce fulfillment, warehousing, pick and pack"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3a5f" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Southern LoCal Fulfillment | Free Fulfillment Matchmaking for SoCal Ecommerce"
        />
        <meta
          property="og:description"
          content="Scale your brand without leasing a warehouse. We match growing ecommerce brands with vetted SoCal fulfillment partners — free, fast, no contracts."
        />
        <meta property="og:url" content="https://slocalfulfillment.com" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Southern LoCal Fulfillment | Free Fulfillment Matchmaking for SoCal Ecommerce"
        />
        <meta
          name="twitter:description"
          content="Scale your brand without leasing a warehouse. We match growing ecommerce brands with vetted SoCal fulfillment partners — free, fast, no contracts."
        />

        {/* Canonical */}
        <link rel="canonical" href="https://slocalfulfillment.com" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <Hero />
        <FulfillmentStory />
      </main>
    </>
  );
}
