import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";

// Variants animasi
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};

// WebGL Shape
function CompanyShape() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <icosahedronGeometry args={[1.8, 2]} />
      <meshStandardMaterial color="#111" roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

export default function About() {
  const aboutRef = useRef(null);

  return (
    <>
      {/* ABOUT SECTION */}
      <motion.section
        ref={aboutRef}
        className="relative min-h-screen py-20 lg:py-32 px-6 lg:px-16 bg-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* WebGL */}
          <div className="w-full h-[400px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 5, 3]} intensity={1} />
              <CompanyShape />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          </div>

          {/* Text About */}
          <motion.div variants={fadeUp}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">About Us</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              <span className="font-semibold text-black">Ravaka Visual</span> adalah perusahaan kreatif yang berfokus pada desain, teknologi, dan pengalaman digital. 
              Kami percaya bahwa setiap karya harus membawa nilai fungsional sekaligus emosional, 
              sehingga mampu menciptakan hubungan yang kuat antara brand dan audiens.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dengan tim multidisiplin yang berpengalaman, kami menggabungkan{" "}
              <span className="font-medium text-black">kreativitas</span>,{" "}
              <span className="font-medium text-black">strategi</span>, dan{" "}
              <span className="font-medium text-black">teknologi</span> untuk menghadirkan solusi digital yang relevan,
              berkelanjutan, dan berdampak positif.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* VISI & MISI */}
      <motion.section
        className="py-20 lg:py-32 px-6 lg:px-16 bg-gray-50"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Visi */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            variants={fadeUp}
          >
            <h3 className="text-3xl font-bold mb-4 text-black">Visi</h3>
            <p className="text-gray-600 leading-relaxed">
              Menjadi perusahaan kreatif terdepan yang menghadirkan{" "}
              <span className="font-semibold text-black">solusi digital inovatif</span> dan berkelanjutan, 
              menciptakan pengalaman yang bermakna serta mendunia.
            </p>
          </motion.div>

          {/* Misi */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            variants={fadeUp}
          >
            <h3 className="text-3xl font-bold mb-6 text-black">Misi</h3>
            <ul className="space-y-4 text-gray-600">
              {[
                "Menghadirkan desain dan pengalaman digital yang fungsional sekaligus estetik.",
                "Menggabungkan strategi, kreativitas, dan teknologi untuk solusi terbaik.",
                "Membangun hubungan jangka panjang dengan klien berbasis kepercayaan.",
                "Mendorong inovasi berkelanjutan dalam setiap karya.",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                >
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white text-sm mt-1">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        className="container mx-auto px-6 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left side */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Have a project in mind or just want to say hello? 
              Fill out the form or reach us directly — we’d love to hear from you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <i className="fas fa-envelope text-lg" />
                </div>
                <span className="text-gray-700">hello@ravakavisual.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <i className="fas fa-phone-alt text-lg" />
                </div>
                <span className="text-gray-700">+62 812 3456 789</span>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition resize-none"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-transparent border border-black text-black py-3 rounded-xl font-medium hover:bg-gray-300 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-300 pt-16 pb-8 px-6 lg:px-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-white text-2xl font-bold mb-4">Ravaka Visual</h3>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              We build digital experiences with simplicity and creativity.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-white text-lg font-semibold mb-2">Quick Links</h4>
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="/services" className="hover:text-white transition">Services</a>
            <a href="/work" className="hover:text-white transition">Work</a>
            <a href="/about" className="hover:text-white transition">About</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {["facebook-f", "twitter", "instagram", "linkedin-in"].map((icon) => (
                <motion.a
                  key={icon}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-white hover:text-black transition"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <i className={`fab fa-${icon}`} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ravaka. All rights reserved.
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-gray-700/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-gray-700/20 to-transparent rounded-full blur-3xl -z-10" />
      </footer>
    </>
  );
}
