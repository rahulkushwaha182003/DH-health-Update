import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import HealthPackages from "@/components/home/HealthPackages";

const HealthPackagesPage = () => {
  return (
    <>
      <SEOHead
        title="Health Checkup Packages in MP"
        description="Explore affordable health checkup packages from trusted diagnostic lab partners and book convenient home sample collection across Madhya Pradesh."
        canonical="/health-packages"
        keywords="health checkup packages MP, full body checkup Madhya Pradesh, preventive health packages, blood test packages Rewa, partner labs health checkup"
      />
      <Layout hideFooter={true}>
        <HealthPackages isPage={true} />
      </Layout>
    </>
  );
};

export default HealthPackagesPage;
