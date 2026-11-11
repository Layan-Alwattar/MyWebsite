import {


  Mail,
  MapPin,
  Terminal,
  Cpu,
  Award,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">LAYAN MOHAMMAD ALWATTAR</h1>
            <p className="text-blue-400 font-medium text-sm">Machine Learning & Software Engineer</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400 items-center justify-center">
            <span className="flex items-center gap-1"><MapPin size={16} /> Doha, Qatar</span>
            <a href="mailto:alwattarlayan@gmail.com" className="flex items-center gap-1 hover:text-blue-400 transition"><Mail size={16} /> Email</a>
            <a href="https://github.com/layan-la2203559" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition"><GithubIcon size={16} /> GitHub</a>
            <a href="https://www.linkedin.com/in/layanalwattar" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition"><LinkedinIcon size={16} /> LinkedIn</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium">
            <Terminal size={14} /> Available for AI/ML & Software Engineering Roles
          </div>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            Computer Science graduate from Qatar University specializing in building end-to-end machine learning pipelines, predictive analytics models, and geospatially enabled full-stack software architectures.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Machine Learning', 'Deep Learning', 'Data Science', 'Python', 'Geospatial Analytics', 'Full-Stack Dev'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold flex items-center gap-2">
            <Cpu size={16} /> Technical Expertise Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800/60">
              <h3 className="text-white font-semibold mb-2 text-sm">Languages & Frameworks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Python, Java, SQL, Dart, JavaScript, PyTorch, TensorFlow, Flutter, Next.js, React</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800/60">
              <h3 className="text-white font-semibold mb-2 text-sm">AI & Data Science</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Supervised Learning, Neural Networks, CNNs, Transfer Learning, EDA, Predictive Analytics</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800/60">
              <h3 className="text-white font-semibold mb-2 text-sm">Cloud & Infrastructure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Supabase, PostgreSQL, Oracle SQL, REST APIs, Cloudflare CDN, Realtime Subscriptions</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold">Featured Production Projects</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 group relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Senior Capstone</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">Eventura — Smart Event Management</h3>
                </div>
                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">Sep 2025 – May 2026</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                A full-stack, real-time management and analytics platform. Designed GPS-aware geofencing, custom row-level security logic, and real-time database automation supporting 500+ concurrent live user interactions with check-in response speeds under 3 seconds.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                <span>Flutter</span> • <span>Next.js</span> • <span>Supabase</span> • <span>PostgreSQL</span> • <span>Geofencing</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Production App</span>
                  <h3 className="text-xl font-bold text-white flex items-center gap-1">
                    Tafheem — Qur’anic Reflection Platform
                    <a href="https://tafheem.io" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400"><ExternalLink size={16} /></a>
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 font-mono">Ongoing</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Serving as Lead Developer directing the technical cloud architecture, backend scaling, and release schedules. Deployed securely using Cloudflare CDN systems for optimized production speed and global caching optimization.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                <span>System Architecture</span> • <span>Cloudflare CDN</span> • <span>API Design</span> • <span>Hostinger</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <h4 className="text-md font-bold text-white mb-2">Video Game Sales Predictor</h4>
                <p className="text-xs text-slate-400 mb-4">Built end-to-end ML pipelines for 16,000+ data records using Random Forest & Neural Networks with advanced hyperparameter tuning via GridSearchCV.</p>
                <span className="text-[11px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-500">Python • Scikit-Learn • PyTorch</span>
              </div>
              <div className="p-5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <h4 className="text-md font-bold text-white mb-2">Brain Tumor Classification</h4>
                <p className="text-xs text-slate-400 mb-4">Leveraged Transfer Learning (ResNet50, MobileNetV2) to engineer an image-classification system achieving an outstanding 99% classification accuracy matrix.</p>
                <span className="text-[11px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-500">TensorFlow • Keras • CNNs</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold flex items-center gap-2">
              <BookOpen size={16} /> Education
            </h2>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <h3 className="text-white font-bold text-sm">Qatar University</h3>
              <p className="text-xs text-slate-400">B.S. in Computer Science (GPA: 3.34)</p>
              <p className="text-[11px] text-blue-400/80 mt-1">Dean’s List — College of Engineering</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-blue-500 font-bold flex items-center gap-2">
              <Award size={16} /> Distinctions & Milestones
            </h2>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div>
                <p className="text-white font-semibold">NPC Qatar Datathon Laureate</p>
                <p className="text-slate-400 text-[11px]">Invited to present core insights to senior officials at the National Planning Council.</p>
              </div>
              <div className="border-t border-slate-800/60 pt-2">
                <p className="text-white font-semibold">Research Assistant Certificate</p>
                <p className="text-slate-400 text-[11px]">Honored for passenger choice optimization analytics workflows at Hamad International Airport.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 text-center py-8 text-xs text-slate-600">
        © {new Date().getFullYear()} Layan Mohammad Alwattar. Built with Next.js & Tailwind.
      </footer>
    </div>
  );
}
