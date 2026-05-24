import Link from 'next/link';
import { Dna, ArrowRight, Code2, Database, ShieldAlert, Cpu, Sparkles, Terminal } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Code2,
      title: "CS-First Analogy",
      description: "No memorization. We explain biological systems using CS paradigms: DNA as source code, transcription as compilation, and proteins as running processes."
    },
    {
      icon: Terminal,
      title: "Hands-on Terminals",
      description: "Learn by doing. Write Python, run BLAST searches, parse FASTA, process SAM/BAM alignments, and build Snakemake pipeline scripts."
    },
    {
      icon: Database,
      title: "Real Data Pipelines",
      description: "Work directly with production sequencing datasets from NCBI, UniProt, and PDB. Learn standard NGS analysis tools used by top research teams."
    }
  ];

  const courses = [
    {
      title: "Biology Crash Course for Programmers",
      level: "Beginner",
      hours: "8 Hrs",
      desc: "All you need to know about molecular biology explained through operating system analogies."
    },
    {
      title: "Biological Databases & File Formats",
      level: "Beginner",
      hours: "10 Hrs",
      desc: "Master the structure of FASTA, FASTQ, SAM, BAM, and VCF files and query NCBI/UniProt databases."
    },
    {
      title: "Sequence Analysis & Alignment",
      level: "Intermediate",
      hours: "12 Hrs",
      desc: "Understand similarity math: BLAST, Needleman-Wunsch, and Smith-Waterman alignment algorithms."
    },
    {
      title: "Genomics & NGS Data Analysis",
      level: "Intermediate",
      hours: "15 Hrs",
      desc: "Align, trim, and call variants on Illumina/Nanopore sequencing reads using Snakemake pipelines."
    },
    {
      title: "Python & R for Bioinformatics",
      level: "Intermediate",
      hours: "12 Hrs",
      desc: "Build professional bio-scripts using Biopython, pandas, Bioconductor, and ggplot2."
    },
    {
      title: "Structural Bioinformatics & ML in Biology",
      level: "Advanced",
      hours: "15 Hrs",
      desc: "Explore 3D protein folding databases, molecular docking, and AI predictions like AlphaFold."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <Dna className="h-6 w-6 animate-float" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              BioLearn
            </span>
          </div>
          <div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center py-2 px-5 rounded-lg bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 hover:scale-[1.02] shadow-lg shadow-teal-500/15 transition-all duration-300"
            >
              Start Learning
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-teal-500/25 bg-teal-500/5 text-teal-300 text-xs font-semibold mb-6 animate-float">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            Designed for Software Developers
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Learn Bioinformatics <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              The Computer Science Way
            </span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Translate your coding and algorithms knowledge to molecular biology. Decode DNA like machine code and cells like distributed, concurrent operating systems.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-8 rounded-lg bg-teal-500 text-slate-950 font-extrabold text-base hover:bg-teal-400 shadow-xl shadow-teal-500/20 transition-all duration-300 hover:translate-y-[-2px]"
            >
              Get Started (Free)
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#curriculum"
              className="w-full sm:w-auto inline-flex items-center justify-center py-3.5 px-8 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-300 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300"
            >
              Browse Curriculum
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Why Learn Bioinformatics Here?
            </h2>
            <p className="mt-4 text-slate-400">
              Traditional biology curricula force memorization. We target computer scientists by focusing on data structures, algorithms, and computational modeling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="border border-slate-850 bg-slate-900/40 rounded-xl p-6 hover:border-teal-500/20 transition duration-300 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">{feat.title}</h3>
                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section id="curriculum" className="py-20 border-t border-slate-900 relative">
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Our Structured Curriculum
            </h2>
            <p className="mt-4 text-slate-400">
              6 progressive pathways designed to take you from bioscience zero to building machine learning pipelines for complex genomics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => {
              return (
                <div key={idx} className="border border-slate-850 bg-slate-900/50 hover:bg-slate-900 rounded-xl p-6 hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        course.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-violet-500/10 text-violet-400 border-violet-500/20'
                      }`}>
                        {course.level}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{course.hours}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-teal-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {course.desc}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/login"
                      className="block text-center py-2 px-4 rounded-lg bg-slate-800 hover:bg-teal-500 hover:text-slate-950 font-semibold text-xs transition duration-300 text-slate-300"
                    >
                      Unlock Syllabus
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-teal-500" />
            <span className="font-bold text-slate-300">BioLearn</span>
            <span>&copy; {new Date().getFullYear()} — Free open-source curriculum.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-slate-300 transition">Login</Link>
            <a href="https://github.com" target="_blank" className="hover:text-slate-300 transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
