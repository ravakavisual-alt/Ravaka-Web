import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Animasi text
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};
const slideRight = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export default function Work() {
  const worksRef = useRef(null);

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: worksRef,
    offset: ["start end", "end start"],
  });

  // Parallax transform kiri / kanan
  const imgLeftX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imgRightX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <div className="bg-white">
      {/* Selected Works */}
      <motion.section
        ref={worksRef}
        className="relative min-h-screen py-20 lg:py-32 px-6 lg:px-16 bg-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.h2
          className="text-3xl lg:text-3xl font-normal mb-16"
          variants={fadeUp}
        >
          Selected Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Work 1 */}
          <motion.div variants={slideLeft}>
            <a href="#">
              <div className="overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1504198070170-4ca53bb1c1fa?auto=format&fit=crop&w=800&q=80"
                  alt="Syla App"
                  className="w-full object-cover"
                  style={{ x: imgLeftX }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </a>
            <h3 className="mt-4 text-base font-semibold">Syla</h3>
          </motion.div>

          {/* Work 2 */}
          <motion.div className="mt-20" variants={slideRight}>
            <a href="#">
              <div className="overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1661006670127-b560e732ce28?auto=format&fit=crop&w=800&q=80"
                  alt="Pleo Card"
                  className="w-full object-cover"
                  style={{ x: imgRightX }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </a>
            <h3 className="mt-4 text-base font-semibold">Pleo</h3>
          </motion.div>

          {/* Work 3 */}
          <motion.div variants={slideLeft}>
            <a href="#">
              <div className="overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="Aurora"
                  className="w-full object-cover"
                  style={{ x: imgLeftX }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </a>
            <h3 className="mt-4 text-base font-semibold">Aurora</h3>
          </motion.div>

          {/* Work 4 */}
          <motion.div className="mt-20" variants={slideRight}>
            <a href="#">
              <div className="overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Nexa"
                  className="w-full object-cover"
                  style={{ x: imgRightX }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </a>
            <h3 className="mt-4 text-base font-semibold">Nexa</h3>
          </motion.div>

          {/* Work 5 */}
          <motion.div variants={slideLeft}>
            <a href="#">
              <div className="overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80"
                  alt="Lume"
                  className="w-full object-cover"
                  style={{ x: imgLeftX }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </a>
            <h3 className="mt-4 text-base font-semibold">Lume</h3>
          </motion.div>

          {/* Work 6 */}
          <motion.div className="mt-20" variants={slideRight}>
            <a href="#">
              <div className="overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                  alt="Orbit"
                  className="w-full object-cover"
                  style={{ x: imgRightX }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </a>
            <h3 className="mt-4 text-base font-semibold">Orbit</h3>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact */}
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
              Have a project in mind or just want to say hello? We’d love to hear from you.
              Fill out the form or reach us directly via email and we’ll get back to you soon.
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
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows="5" placeholder="Write your message..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-black outline-none transition resize-none"/>
              </div>
              <motion.button type="submit" className="w-full bg-transparent border border-black text-black py-3 rounded-xl font-medium hover:bg-gray-300 transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Send Message
              </motion.button>
            </form>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
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
    </div>
  );
}
