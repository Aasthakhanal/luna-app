import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import logo from "../assets/lunaa.png";
import heroImg from "../assets/hero.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-foreground scroll-smooth">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-16 md:pt-32 md:pb-24 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Track Your Cycle with{" "}
              <span className="text-destructive">Confidence</span>
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Luna helps you understand your body better with period
              predictions, flow tracking, and detecting irregularities.
            </motion.p>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/signup"
                className="px-8 py-3 rounded-lg bg-sidebar text-white font-medium text-lg hover:bg-border transition-all duration-200"
              >
                Start Tracking Today
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <img
              src={heroImg}
              alt="Cycle Tracking"
              className="w-full max-h-[500px] object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#fbcece]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              What Luna Offers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform for your menstrual health and support.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 text-center bg-secondary-dark p-4 rounded-xl">
            {[
              {
                title: "Cycle Tracking",
                desc: "Accurately predict your next period and ovulation.",
              },
              {
                title: "Blood Flow Monitoring",
                desc: "Log and analyze your flow intensity and symptoms.",
              },
              {
                title: "Irregularity Detection",
                desc: "Helps detect unusual patterns on the basis of your data.",
              },
              {
                title: "Find Gynecologists",
                desc: "Locate nearby women’s health specialists instantly.",
              },
            ].map(({ title, desc }, i) => (
              <div
                key={i}
                className="p-4 bg-card rounded-xl shadow-sm hover:shadow-orange-600  transition-shadow"
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted-neutral">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-ring">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            About Luna
          </h2>
          <p className="text-muted-foreground text-lg">
            Luna is more than a tracker—it's a companion for your health
            journey. Built for women by women, we aim to help you feel
            confident, informed, and cared for every cycle.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-card">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Questions or feedback? We’d love to hear from you.
          </p>
          <a
            href="mailto:support@luna.com"
            className="text-neutral font-medium underline hover:text-accent-dark"
          >
            support@luna.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white text-center text-sm text-muted-foreground">
        <img src={logo} alt="Luna Logo" className="mx-auto h-20 mb-4" />
        &copy; {new Date().getFullYear()} Luna Period Tracker. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Landing;
