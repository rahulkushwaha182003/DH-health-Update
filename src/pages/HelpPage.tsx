import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  FileText, 
  Calendar,
  Home,
  FileSearch,
  Send,
  Instagram
} from "lucide-react";

const WHATSAPP_NUMBER = "917649885936";
const INSTAGRAM_URL = "https://www.instagram.com/diagnostics_hub?igsh=MzNzanJpN2tlODhs";
const TELEGRAM_BOT = "https://t.me/DiagnosticHub_bot";

const faqGroups = [
  {
    title: "Test Booking",
    faqs: [
      {
        question: "How do I book a blood test or health package?",
        answer: "You can book an appointment through our website by visiting the Tests or Health Packages page, calling us at +91 7649885936, or messaging us on WhatsApp. You can also use our Telegram bot @DiagnosticHub_bot for 24/7 booking assistance."
      },
      {
        question: "Is fasting required for diagnostic tests?",
        answer: "Certain tests like Fasting Blood Sugar, Lipid Profile, and metabolic panels require 10-12 hours of overnight fasting. For routine tests like CBC, fasting is generally not needed. Specific preparation instructions are displayed on each test's detail page."
      },
      {
        question: "Do you offer corporate or bulk testing?",
        answer: "Yes, Diagnostics Hub provides tailored corporate health checkups and bulk diagnostic screenings for organizations across Madhya Pradesh. Contact us through our Quote Request page for custom arrangements."
      }
    ]
  },
  {
    title: "Lab Selection",
    faqs: [
      {
        question: "How does lab comparison work on Diagnostics Hub?",
        answer: "Diagnostics Hub is an aggregator platform that lets you compare blood test prices, packages, and credentials from top trusted partner labs such as Dr. Lal PathLabs, Metropolis, Pathkind, and Bharat Lab all in one place."
      },
      {
        question: "Are your partner tests and laboratories accurate and accredited?",
        answer: "Diagnostics Hub partners exclusively with NABL-accredited and certified pathology laboratories. Our partner labs maintain the highest standards of quality, utilize advanced automated analyzers, and all test reports are verified by qualified pathologists."
      }
    ]
  },
  {
    title: "Home Sample Collection",
    faqs: [
      {
        question: "How does home sample collection work?",
        answer: "Trained and certified phlebotomists from our partner network visit your home at your selected time slot to collect samples following strict hygiene, cold-chain, and safety protocols."
      },
      {
        question: "What are your operating hours for home collection?",
        answer: "Our home collection slots are open Monday to Saturday from 7:00 AM to 7:00 PM. Early morning appointments are recommended for tests requiring overnight fasting."
      }
    ]
  },
  {
    title: "Payments and Cancellation",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept Cash on Collection, all major UPI apps (Google Pay, PhonePe, Paytm), credit/debit cards, and net banking."
      },
      {
        question: "Can I cancel or reschedule my appointment?",
        answer: "Yes, you can cancel or reschedule your booking by calling us at +91 7649885936 or messaging on WhatsApp at least 4 hours before your scheduled time slot."
      }
    ]
  },
  {
    title: "Test Reports",
    faqs: [
      {
        question: "How and when do I get my test results?",
        answer: "Most routine test reports are completed within 12-24 hours. Verified digital PDF reports are delivered directly to your patient dashboard, email, and WhatsApp. Printed copies can also be requested."
      },
      {
        question: "How do I check the status of my sample?",
        answer: "You can track the real-time status of your test by entering your Booking Reference Number on our Results Inquiry page or checking your User Dashboard."
      }
    ]
  }
];

const quickLinks = [
  {
    icon: Calendar,
    title: "Book Test",
    description: "Schedule your lab visit or home collection",
    link: "/book-appointment"
  },
  {
    icon: FileSearch,
    title: "Results Inquiry",
    description: "Check the status of your test results",
    link: "/results-inquiry"
  },
  {
    icon: FileText,
    title: "View Tests",
    description: "Browse our complete test catalog",
    link: "/tests"
  },
  {
    icon: Home,
    title: "Home Collection",
    description: "Get samples collected at your doorstep",
    link: "/book-appointment"
  }
];

const HelpPage = () => {
  return (
    <Layout>
      <SEOHead
        title="Help & FAQs for Test Booking"
        description="Find answers about test booking, lab selection, home sample collection, payments and reports, or contact the Diagnostics Hub support team."
        canonical="/help"
        keywords="diagnostics hub help, test booking FAQ, lab selection Madhya Pradesh, home sample collection FAQ, test reports help"
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12 md:py-16">
        <div className="container text-center px-4">
          <HelpCircle className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Diagnostics Hub Help & FAQs</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about test booking, partner labs, and home collection or get in touch with our support team.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Contact Support</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <a href={`tel:+${WHATSAPP_NUMBER}`} className="block">
                  <Phone className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                  <p className="text-primary font-medium">+91 7649885936</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon-Sat: 7AM - 7PM</p>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-success/50">
              <CardContent className="p-4 md:p-6">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="block">
                  <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-success mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                  <p className="text-success font-medium">+91 7649885936</p>
                  <p className="text-xs text-muted-foreground mt-1">Quick Response!</p>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <a href={TELEGRAM_BOT} target="_blank" rel="noopener noreferrer" className="block">
                  <Send className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Telegram Bot</h3>
                  <p className="text-primary font-medium">@DiagnosticHub_bot</p>
                  <p className="text-xs text-muted-foreground mt-1">24/7 Automated Help</p>
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block">
                  <Instagram className="h-8 w-8 md:h-10 md:w-10 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Instagram</h3>
                  <p className="text-secondary font-medium">@diagnostics_hub</p>
                  <p className="text-xs text-muted-foreground mt-1">Follow for Updates</p>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 md:py-12 bg-muted/50">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Quick Links</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickLinks.map((item) => (
              <Card key={item.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <Link to={item.link} className="block">
                    <item.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl px-4 space-y-10">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          {faqGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#003B73] border-b pb-2">
                {group.title}
              </h2>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {group.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`group-${groupIdx}-item-${index}`}>
                        <AccordionTrigger className="text-left text-sm md:text-base font-semibold">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container max-w-3xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Privacy Policy</h2>
          <Card>
            <CardContent className="p-6 md:p-8 space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-foreground mb-2">1. Introduction</h3>
                <p>
                  Welcome to Diagnostics Hub. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your personal and medical information when you visit our website, book appointments, or use our diagnostic services.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-foreground mb-2">2. Information We Collect</h3>
                <p className="mb-2">We collect personal information that you provide to us, including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Personal details:</strong> Name, age, gender, date of birth, phone number, email address, and home address.</li>
                  <li><strong>Health & Medical data:</strong> Doctor's prescriptions, list of selected tests/packages, sample details, and generated diagnostic test reports.</li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-foreground mb-2">3. How We Use Your Information</h3>
                <p className="mb-2">Your information is used solely for medical and support operations, such as:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Scheduling appointments and home sample collection visits.</li>
                  <li>Processing laboratory test samples and compiling accurate diagnostic reports.</li>
                  <li>Delivering your reports securely via our Dashboard, WhatsApp, or Email.</li>
                  <li>Communicating changes, offers, or billing invoices.</li>
                </ul>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-bold text-foreground mb-2">4. Data Security & Storage</h3>
                <p>
                  We implement robust technical and organizational security measures to protect your medical records. Your personal information and reports are stored securely in cloud-hosted databases with strict Row Level Security (RLS). No unauthorized third parties have access to your health details.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">5. Your Rights & Contacts</h3>
                <p>
                  You have the right to access your stored data, request deletions, or opt-out of notifications. For any questions or concerns regarding our privacy practices, please contact us at <strong>+91 7649885936</strong> or visit our center.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our support team is always ready to assist you. Reach out through any channel below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Us
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">
                Contact Form
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HelpPage;
