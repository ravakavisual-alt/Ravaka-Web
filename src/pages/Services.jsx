import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async";

// --- WebGL Scene ---
const initScene = (container) => {
  const width = container.clientWidth
  const height = container.clientHeight
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 3.8)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  const uniforms = {
    u_time: { value: 0 },
    u_amp: { value: 0.25 },
    u_lightDir: { value: new THREE.Vector3(0.6, 0.7, 0.4).normalize() },
    u_base: { value: new THREE.Color(0.92, 0.92, 0.92) },
    u_dark: { value: new THREE.Color(0.08, 0.08, 0.08) },
    u_rim: { value: 0.6 },
  }

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
  `

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
  `

  const shaderMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.FrontSide,
  })

  const geo = new THREE.BoxGeometry(1.4, 1.4, 1.4, 100, 100, 100)
  const mesh = new THREE.Mesh(geo, shaderMat)
  scene.add(mesh)

  const wire = new THREE.Mesh(
    geo.clone(),
    new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
  )
  scene.add(wire)

  let mouseX = 0, mouseY = 0, rotX = 0, rotY = 0, targetRotX = 0, targetRotY = 0

  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX = x * 2 - 1
    mouseY = y * 2 - 1
    targetRotY = mouseX * 0.6
    targetRotX = -mouseY * 0.4
  }
  container.addEventListener("pointermove", onPointerMove)

  const clock = new THREE.Clock()
  let raf = 0
  const render = () => {
    raf = requestAnimationFrame(render)
    const t = clock.getElapsedTime()
    uniforms.u_time.value = t

    rotX += (targetRotX - rotX) * 0.07
    rotY += (targetRotY - rotY) * 0.07

    mesh.rotation.y = t * 0.15 + rotY
    mesh.rotation.x = t * 0.08 + rotX
    wire.rotation.copy(mesh.rotation)

    renderer.render(scene, camera)
  }
  render()

  const onResize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener("resize", onResize)

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener("resize", onResize)
    container.removeEventListener("pointermove", onPointerMove)
    geo.dispose()
    wire.geometry.dispose()
    wire.material.dispose()
    shaderMat.dispose()
    renderer.dispose()
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement)
    }
  }
}

// --- Accordion Item ---
function AccordionItem({ title, content, isOpen, onClick }) {
  return (
    <div className="border-t border-b border-gray-200 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-medium">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-gray-600 text-sm"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Services() {
  const glRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const clean = initScene(glRef.current)
    return () => clean?.()
  }, [])

  const services = [
    { title: "Brand Identity", content: "Kami membantu membangun identitas visual yang kuat melalui logo, warna, dan guideline brand." },
    { title: "UI/UX Design", content: "Desain aplikasi dan website yang user-friendly serta estetis untuk pengalaman maksimal." },
    { title: "Motion Graphics", content: "Animasi visual untuk memperkuat storytelling brand Anda." },
  ]

  return (
    <><Helmet>
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
    <div className="pt-24">
      {/* Our Services Section */}
      <motion.section
        className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">We craft digital experiences</h2>
          <p className="text-gray-600 leading-relaxed">
            Kami memberikan layanan desain kreatif yang fokus pada brand, visual, dan pengalaman digital yang konsisten.
          </p>
        </div>
        <div ref={glRef} className="w-full h-[400px] md:h-[500px]" />
      </motion.section>

      {/* Service Categories */}
      <motion.section
        className="container mx-auto px-6 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid md:grid-cols-4 gap-12">
          {[
            { title: "User Research", items: ["User Insights", "UX Audit", "Focus Groups", "Usability Testing", "Affinity Diagramming"] },
            { title: "UX Strategy", items: ["User Journeys", "Brand Strategy", "Information Architecture", "Brand Principles"] },
            { title: "Interactive Design", items: ["UI Design", "UX Design", "Motion Design", "Prototyping"] },
            { title: "Production", items: ["Design Systems", "Design Libraries", "Dev Documentations", "Lottie animations"] },
          ].map((cat, i) => (
            <div key={i}>
              <h3 className="text-lg font-semibold mb-3">{cat.title}</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {cat.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Accordion */}
      <motion.section
        className="container mx-auto px-6 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {services.map((s, i) => (
          <AccordionItem
            key={i}
            title={s.title}
            content={s.content}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </motion.section>

      {/* Contact Section */}
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
    </>
  )
}
