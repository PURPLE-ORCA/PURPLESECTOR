import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Code, Layers, Zap, Palette, Layout, Component } from "lucide-react"; // Example Lucide icons

const techStack = [
  { name: 'React', icon: 'react', category: 'Frontend' },
  { name: 'Vite', icon: 'zap', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: 'palette', category: 'Styling' },
  { name: 'Node.js', icon: 'code', category: 'Backend' },
  { name: 'Express.js', icon: 'layers', category: 'Backend' },
  { name: 'Framer Motion', icon: 'layout', category: 'Animation' },
  { name: 'ShadCN UI', icon: 'component', category: 'UI Components' },
  { name: 'Iconify', icon: 'code', category: 'Icons' },
  // Add any other key APIs like f1api.dev or Ergast if you want to highlight them
];

const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'react': return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400"><title>React</title><path d="M12 2.28c-1.1 0-2.1.4-2.9.9L3.6 7.4c-.8.5-1.3 1.4-1.3 2.4v4.4c0 1 .5 1.9 1.3 2.4l5.5 4.2c.8.5 1.8.9 2.9.9s2.1-.4 2.9-.9l5.5-4.2c.8-.5 1.3-1.4 1.3-2.4v-4.4c0-1-.5-1.9-1.3-2.4l-5.5-4.2c-.8-.5-1.8-.9-2.9-.9zM12 4.5c.4 0 .8.1 1.1.3l4.4 3.4c.3.2.5.6.5 1v3.6c0 .4-.2.8-.5 1l-4.4 3.4c-.3.2-.7.3-1.1.3s-.8-.1-1.1-.3l-4.4-3.4c-.3-.2-.5-.6-.5-1v-3.6c0-.4.2-.8.5-1l4.4-3.4c.3-.2.7-.3 1.1-.3zM12 6.7c-.4 0-.8.1-1.1.3L6.5 10.4c-.3.2-.5.6-.5 1v1.2c0 .4.2.8.5 1l4.4 3.4c.3.2.7.3 1.1.3s.8-.1 1.1-.3l4.4-3.4c.3-.2.5-.6.5-1v-1.2c0-.4-.2-.8-.5-1l-4.4-3.4c-.3-.2-.7-.3-1.1-.3zM12 8.9c-.4 0-.8.1-1.1.3L8.7 11.4c-.3.2-.5.6-.5 1v.4c0 .4.2.8.5 1l2.2 1.7c.3.2.7.3 1.1.3s.8-.1 1.1-.3l2.2-1.7c.3-.2.5-.6.5-1v-.4c0-.4-.2-.8-.5-1l-2.2-1.7c-.3-.2-.7-.3-1.1-.3z"/></svg>;
    case 'zap': return <Zap className="w-6 h-6 text-green-400" />;
    case 'palette': return <Palette className="w-6 h-6 text-cyan-400" />;
    case 'code': return <Code className="w-6 h-6 text-gray-400" />;
    case 'layers': return <Layers className="w-6 h-6 text-purple-400" />;
    case 'layout': return <Layout className="w-6 h-6 text-pink-400" />;
    case 'component': return <Component className="w-6 h-6 text-orange-400" />;
    default: return <Code className="w-6 h-6 text-gray-400" />;
  }
};

function DevAndTechSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            BEHIND THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#950505] to-[#37045F]">
              SCENES
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Meet the Developer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-6 text-center md:text-left">
              Meet the <span className="text-[#950505]">Developer</span>
            </h3>
            <div className="bg-white/5 backdrop-blur-md border-white/10 p-8 rounded-lg h-full flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-2xl font-semibold text-white mb-2">
                Purple Orca
              </h4>
              <p className="text-gray-400 leading-relaxed mb-6">
                A passionate Formula 1 enthusiast, I crafted this project to
                bring the thrill of F1 data closer to me. My goal is to create
                intuitive and engaging experiences for the F1 fans.
                <br />
                The main focus was to build a user-friendly interface that
                allows fans to explore F1 data seamlessly, and addressing the
                problem I myself faced: races time in GMT while also showcasing
                my skills in modern web development.
                <br />I hope you enjoy using this project as much as I enjoyed
                building it!
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/PURPLE-ORCA/PURPLESECTOR.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#950505] transition-colors"
                >
                  <Github className="w-8 h-8" />
                </a>
                <a
                  href="https://www.linkedin.com/in/mohammed-el-moussaoui-173396348"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#950505] transition-colors"
                >
                  <Linkedin className="w-8 h-8" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-white mb-6 text-center md:text-left">
              Built <span className="text-[#37045F]">With</span>
            </h3>
            <div className="bg-white/5 backdrop-blur-md border-white/10 p-8 rounded-lg h-full">
              {[
                "Frontend",
                "Backend",
                "Styling",
                "Animation",
                "UI Components",
                "Icons",
              ].map((category) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="text-xl font-semibold text-white mb-3 border-b border-white/10 pb-2">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {techStack
                      .filter((tech) => tech.category === category)
                      .map((tech) => (
                        <div
                          key={tech.name}
                          className="flex items-center gap-2 text-gray-300 text-lg"
                        >
                          {getIconComponent(tech.icon)}
                          <span>{tech.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default DevAndTechSection;
