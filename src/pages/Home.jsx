// src/pages/Home.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const glRefHero = useRef(null);
  const glRefService = useRef(null);
  const glRefAbout = useRef(null);

  // Refs untuk framer-scroll parallax
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const worksRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // ====== Scroll-driven transforms (parallax halus) ======
  // HERO
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const heroY = useSpring(useTransform(heroProg, [0, 1], [0, -60]), { stiffness: 120, damping: 20, mass: 0.15 });

  // SERVICES teks parallax tipis
  const { scrollYProgress: svcProg } = useScroll({ target: servicesRef, offset: ["start 80%", "end start"] });
  const svcY = useSpring(useTransform(svcProg, [0, 1], [30, -30]), { stiffness: 120, damping: 18, mass: 0.2 });

  // WORKS – image slide dari samping
  const { scrollYProgress: worksProg } = useScroll({ target: worksRef, offset: ["start 90%", "end 10%"] });
  const imgLeftX = useSpring(useTransform(worksProg, [0, 1], ["-16%", "0%"]), { stiffness: 140, damping: 18 });
  const imgRightX = useSpring(useTransform(worksProg, [0, 1], ["16%", "0%"]), { stiffness: 140, damping: 18 });

  // ABOUT – teks & kanvas muncul halus
  const { scrollYProgress: aboutProg } = useScroll({ target: aboutRef, offset: ["start 85%", "end 30%"] });
  const aboutOpacity = useSpring(useTransform(aboutProg, [0, 1], [0, 1]), { stiffness: 120, damping: 20 });
  const aboutY = useSpring(useTransform(aboutProg, [0, 1], [24, 0]), { stiffness: 120, damping: 20 });

  // CONTACT – kartu form naik halus
  const { scrollYProgress: contactProg } = useScroll({ target: contactRef, offset: ["start 85%", "end 30%"] });
  const contactOpacity = useSpring(useTransform(contactProg, [0, 1], [0, 1]), { stiffness: 120, damping: 20 });
  const contactY = useSpring(useTransform(contactProg, [0, 1], [20, 0]), { stiffness: 120, damping: 18 });

  // ----- Helper WebGL Scene (tetap sama strukturmu) -----
  const initScene = (container, geoType = "sphere") => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0 },
      u_amp: { value: geoType === "sphere" ? 0.28 : 0.22 },
      u_lightDir: { value: new THREE.Vector3(0.6, 0.7, 0.4).normalize() },
      u_base: { value: new THREE.Color(0.92, 0.92, 0.92) },
      u_dark: { value: new THREE.Color(0.08, 0.08, 0.08) },
      u_rim: { value: 0.6 },
    };

    const vertexShader = /* glsl */ `
      uniform float u_time;
      uniform float u_amp;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      float n3(vec3 p) {
        return
          0.5 * sin(p.x*2.10 + u_time*0.8) +
          0.5 * sin(p.y*1.73 - u_time*1.1) +
          0.5 * sin(p.z*2.37 + u_time*0.6) +
          0.25* sin((p.x+p.y)*3.1 - u_time*0.5) +
          0.20* sin((p.y+p.z)*4.0 + u_time*0.4);
      }

      void main() {
        vec3 pos = position;
        float disp = n3(normalize(position)*1.8);
        float d = pow(0.5 + 0.5*disp, 1.4);
        pos += normal * (u_amp * (d - 0.35));

        vec4 world = modelMatrix * vec4(pos, 1.0);
        vWorldPos = world.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;
      uniform vec3 u_lightDir;
      uniform vec3 u_base;
      uniform vec3 u_dark;
      uniform float u_rim;

      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 L = normalize(u_lightDir);
        vec3 V = normalize(-vWorldPos);

        float lambert = clamp(dot(N, L), 0.0, 1.0);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 1.5) * u_rim;

        float shade = clamp(lambert * 0.9 + rim * 0.7, 0.0, 1.0);
        vec3 col = mix(u_dark, u_base, shade);
        col = col / (col + vec3(1.0));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const shaderMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.FrontSide,
    });

    let mesh = null;
    let wire = null;
    let group = null;
    let disposables = [];

    if (geoType === "aboutBoxes") {
      group = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const size = 0.6 + Math.random() * 0.5;
        const geo = new THREE.BoxGeometry(size, size, size, 20, 20, 20);
        const box = new THREE.Mesh(geo, shaderMat);

        box.position.set(
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0
        );
        box.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

        const wireBox = new THREE.Mesh(
          geo.clone(),
          new THREE.MeshBasicMaterial({
            color: 0x111111,
            wireframe: true,
            transparent: true,
            opacity: 0.12,
          })
        );
        wireBox.position.copy(box.position);
        wireBox.rotation.copy(box.rotation);

        group.add(box, wireBox);
        disposables.push(geo, wireBox.geometry, wireBox.material);
      }
      scene.add(group);
    } else {
      const geo =
        geoType === "sphere"
          ? new THREE.SphereGeometry(1.0, 220, 220)
          : new THREE.TorusKnotGeometry(0.8, 0.3, 200, 32, 2, 3);

      mesh = new THREE.Mesh(geo, shaderMat);
      scene.add(mesh);

      wire = new THREE.Mesh(
        geo.clone(),
        new THREE.MeshBasicMaterial({
          color: 0x111111,
          wireframe: true,
          transparent: true,
          opacity: 0.12,
        })
      );
      scene.add(wire);

      disposables.push(geo, wire.geometry, wire.material);
    }

    let mouseX = 0,
      mouseY = 0,
      rotX = 0,
      rotY = 0,
      targetRotX = 0,
      targetRotY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX = x * 2 - 1;
      mouseY = y * 2 - 1;
      targetRotY = mouseX * 0.6;
      targetRotX = -mouseY * 0.4;
    };
    container.addEventListener("pointermove", onPointerMove);

    const onScroll = () => {
      const s = window.scrollY;
      const base = geoType === "sphere" ? 0.24 : 0.18;
      uniforms.u_amp.value = base + Math.min(0.16, s * 0.00015);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      uniforms.u_time.value = t;

      rotX += (targetRotX - rotX) * 0.07;
      rotY += (targetRotY - rotY) * 0.07;

      if (group) {
        group.rotation.y = t * 0.25 + rotY;
        group.rotation.x = t * 0.12 + rotX;
      } else if (mesh && wire) {
        mesh.rotation.y = t * 0.15 + rotY;
        mesh.rotation.x = t * 0.08 + rotX;
        wire.rotation.copy(mesh.rotation);
      }

      renderer.render(scene, camera);
    };
    render();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointermove", onPointerMove);
      disposables.forEach((d) => d?.dispose?.());
      shaderMat.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  };

  useEffect(() => {
    const cleanHero = initScene(glRefHero.current, "sphere");
    const cleanService = initScene(glRefService.current, "torus");
    const cleanAbout = initScene(glRefAbout.current, "aboutBoxes");
    return () => {
      cleanHero?.();
      cleanService?.();
      cleanAbout?.();
    };
  }, []);

  // ===== Variants untuk fade-in/slide-in umum =====
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };
  const slideLeft = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };
  const slideRight = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <>
    <Helmet>
        <title>Ravaka Visual | Creative Digital Agency</title>
        <meta
          name="description"
          content="Ravaka Visual adalah creative digital agency yang fokus pada layanan desain, branding, UI/UX, dan pengalaman digital."
        />
        <meta property="og:title" content="Ravaka Visual | Creative Digital Agency" />
        <meta property="og:description" content="Menciptakan solusi desain inovatif untuk brand Anda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ravakavisual.com/" />
      </Helmet>
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* HERO */}
      <motion.section
        ref={heroRef}
        className="relative h-[100svh] flex items-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div
          className="relative z-10 w-full lg:w-1/2 px-6 lg:px-12"
          variants={fadeUp}
          style={{ y: heroY }}
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Digital<br />Designer<br />Creative<br />Developer
          </h1>
          <p className="mt-6 text-gray-600 max-w-md">
            Clean, modern, and elegant experiences for brands and products.
          </p>
        </motion.div>
        <motion.div
          ref={glRefHero}
          className="absolute right-0 top-0 h-full w-full lg:w-[50%]"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
          viewport={{ once: true, amount: 0.3 }}
        />
      </motion.section>

      {/* SERVICES */}
      <motion.section
        id="services"
        ref={servicesRef}
        className="relative min-h-screen flex flex-col lg:flex-row items-center lg:items-start py-20 lg:py-32 px-6 lg:px-16 gap-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          className="relative w-full lg:w-1/2 h-[60vh] lg:h-[80vh]"
          variants={slideRight}
        >
          <div ref={glRefService} className="absolute inset-0" />
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-12"
          style={{ y: svcY }}
          variants={fadeUp}
        >
          <div>
            <h3 className="text-lg font-semibold mb-3">User Experience</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>User Insights</li>
              <li>UX Audit</li>
              <li>Focus Groups</li>
              <li>Usability Testing</li>
              <li>Affinity Diagramming</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">UX Strategy</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>User Journeys</li>
              <li>Brand Strategy</li>
              <li>Information Architecture</li>
              <li>Brand Principles</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Interactive Design</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>UI Design</li>
              <li>UX Design</li>
              <li>Motion Design</li>
              <li>Prototyping</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Production</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Design Systems</li>
              <li>Design Libraries</li>
              <li>Dev Documentations</li>
              <li>Lottie animations</li>
            </ul>
          </div>
        </motion.div>
      </motion.section>

      {/* SELECTED WORKS */}
      <motion.section
        ref={worksRef}
        className="relative min-h-screen py-20 lg:py-32 px-6 lg:px-16 bg-white"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.h2 className="text-3xl lg:text-3xl font-normal mb-16" variants={fadeUp}>
          Selected Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Work 1 – slide dari kiri */}
          <motion.div variants={slideLeft}>
            <a href="#">
              <div className="overflow-hidden rounded-xl">
                <motion.img
                  src="https://images.unsplash.com/photo-1504198070170-4ca53bb1c1fa?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80"
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

          {/* Work 2 – slide dari kanan */}
          <motion.div className="mt-20" variants={slideRight}>
            <a href="#">
              <div className="overflow-hidden rounded-xl">
                <motion.img
                  src="https://images.unsplash.com/photo-1661006670127-b560e732ce28?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&auto=format&fit=crop&w=800&q=80"
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
        </div>
      </motion.section>

      {/* ABOUT US */}
      <motion.section
        id="about"
        ref={aboutRef}
        className="relative bg-white px-6 lg:px-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid lg:grid-cols-2 items-start gap-10 lg:gap-16 py-16">
          <motion.div
            className="relative z-10"
            style={{ opacity: aboutOpacity, y: aboutY }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">About Us</h2>
            <p className="text-gray-600 max-w-lg leading-relaxed">
              We are a team of passionate creators, designers, and developers.
              Our mission is to build digital experiences that connect people
              and spark meaningful collaboration.
            </p>
          </motion.div>

          <motion.div
            className="relative h-full min-h-[420px] lg:min-h-[520px] rounded-2xl overflow-hidden"
            variants={slideLeft}
          >
            <div ref={glRefAbout} className="absolute inset-0" />
          </motion.div>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        id="contact"
        ref={contactRef}
        className="relative bg-white py-20 px-6 lg:px-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Text */}
          <motion.div variants={fadeUp}>
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
                <span className="text-gray-700">ravakavisual@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                  <i className="fas fa-phone-alt text-lg" />
                </div>
                <span className="text-gray-700">+62 881 0364 86772</span>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            className="bg-gray-50 rounded-2xl shadow-lg p-8 lg:p-10"
            style={{ opacity: contactOpacity, y: contactY }}
          >
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
  className="w-full bg-transparent border border-black text-black py-3 rounded-xl font-medium hover:bg-gray-200 transition"

>
  Send Message
</motion.button>

            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className="bg-black text-gray-300 pt-16 pb-8 px-6 lg:px-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h3 className="text-white text-2xl font-bold mb-4">Ravaka Visual</h3>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              We build digital experiences with simplicity and creativity.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-col space-y-3"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-2">Quick Links</h4>
            <a href="#about" className="hover:text-white transition">About Us</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
            <a href="#blog" className="hover:text-white transition">Blog</a>
          </motion.div>

          {/* Social */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
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
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ravaka. All rights reserved.
        </div>

        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-gray-700/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-gray-700/20 to-transparent rounded-full blur-3xl -z-10" />
      </motion.footer>
      
    </div>
    </>
  );
}
