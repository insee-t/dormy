import Feature from "../components/Feature";
import Pricing from "../components/Pricing";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await getCurrentUser({
    redirectIfNotFound: false
  })
  if (currentUser !== null) redirect("/dashboard")

  return (
    <>
      <SeoHead title='LinkCo' />
      <Layout>
        <Hero />
        <Banner/>
        {/* <Feature /> */}
        <Pricing />
      </Layout>
    </>
  );
}
