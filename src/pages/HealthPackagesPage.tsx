import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import HealthPackages from "@/components/home/HealthPackages";

const HealthPackagesPage = () => {
  return (
    <>
      <SEOHead
        title="DH Health Packages - Comprehensive Health Checkups"
        description="Diagnostics Hub Rewa - Affordable health packages including Full Body Checkup, Diabetes Care, Heart Health, Women's Health, and Senior Citizen packages."
        canonical="/health-packages"
        keywords="health packages rewa, full body checkup rewa, diabetes package rewa, heart health package rewa, women health checkup rewa, senior citizen health package, affordable health tests"
      />
      <Layout>
        <HealthPackages />
      </Layout>
    </>
  );
};

export default HealthPackagesPage;
