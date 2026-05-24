-- SEED COURSES
INSERT INTO public.courses (id, title, slug, description, level, estimated_hours, published, cover_image) VALUES
('c1000000-0000-0000-0000-000000000001', 'Biology Crash Course for Programmers', 'biology-crash-course-for-programmers', 'All you need to know about molecular biology explained through operating system analogies. From cells to DNA, from genes to proteins.', 'Beginner', 8, true, 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80'),
('c2000000-0000-0000-0000-000000000002', 'Biological Databases & File Formats', 'biological-databases-and-file-formats', 'Master the structure of FASTA, FASTQ, SAM, BAM, and VCF files and learn to programmatically query NCBI and UniProt databases.', 'Beginner', 10, true, 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80'),
('c3000000-0000-0000-0000-000000000003', 'Sequence Analysis & Alignment', 'sequence-analysis-and-alignment', 'Explore pairwise alignment math: BLAST, Needleman-Wunsch, and Smith-Waterman sequence similarity algorithms.', 'Intermediate', 12, true, 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&w=800&q=80'),
('c4000000-0000-0000-0000-000000000004', 'Genomics & NGS Data Analysis', 'genomics-and-ngs-data-analysis', 'Process real sequencing datasets: trim with Trimmomatic, align with BWA/STAR, call variants with GATK, and automate pipelines with Snakemake.', 'Intermediate', 15, true, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80'),
('c5000000-0000-0000-0000-000000000005', 'Python & R for Bioinformatics', 'python-and-r-for-bioinformatics', 'Build production bio-analysis code using Biopython, pandas dataframes, Bioconductor packages, and ggplot2 visual tools.', 'Intermediate', 12, true, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'),
('c6000000-0000-0000-0000-000000000006', 'Structural Bioinformatics & ML in Biology', 'structural-bioinformatics-and-ml-in-biology', 'Analyze 3D protein folding structures, script molecular docking, and build machine learning classifiers for genomic classifications.', 'Advanced', 15, true, 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  level = EXCLUDED.level,
  estimated_hours = EXCLUDED.estimated_hours,
  published = EXCLUDED.published,
  cover_image = EXCLUDED.cover_image;


-- SEED COURSE 1 MODULES
-- Module 1 (Complete Markdown Lesson)
INSERT INTO public.modules (id, course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('m1000001-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'The Cell: Biology''s Operating System', 'the-cell-biologys-operating-system', 
$markdown$# The Cell: Biology's Operating System

## Overview
Welcome to your first lesson in bioinformatics! In this module, we are going to look at the absolute foundation of all biological life—**the cell**—but we are going to do it through a lens you already understand: **Operating Systems**. 

Instead of memorizing definitions, we will treat the cell as a concurrent, distributed operating system. This system manages memory, loads files, schedules threads, communicates with exterior APIs, and executes processes. If you can write a multithreaded server or debug an API call, you can master molecular cell biology.

## Prerequisites
- Basic familiarity with high-level programming (Python syntax).
- Absolute zero background in biology is required.

## Learning Objectives
By the end of this module, you will be able to:
1. Explain the structural compartments of a cell using OS analogies (Kernel, Firewalls, CPU, Hardware).
2. Formulate biological transport as network packets filtering through ports.
3. Write a Python snippet simulating selective cell membrane transport.
4. Distinguish between transcription (compilation) and translation (runtime).

---

## Section 1 — The Cell Membrane: Firewall and Ports
A cell is not a loose bag of soup. It is an enclosed environment protected by a complex bilayer called the **cell membrane**. 

In computing terms, the cell membrane is the system's **Network Firewall**. It operates under a policy of **selective permeability** (similar to a zero-trust network). By default, nothing gets through. 

The cell membrane contains specialized proteins that act as **network ports** or **channel gates**:
- **Passive Channels (UDP/Stateless)**: Allow water or small ions to pass through freely along their concentration gradient. No energy (ATP) is consumed.
- **Active Transporters (TCP/Stateful)**: Actively pump larger molecules (like glucose or sodium) against the concentration gradient. This requires the cell to spend **ATP** (the system's power consumption/electric currency).

### Worked Example: selective filtering in Python
Let's model the cell membrane firewall programmatically. We will create a network packet router representing transport proteins that decide which molecules are allowed to enter the intracellular space:

```python
class MembraneFirewall:
    def __init__(self):
        # Whitelisted ports (receptors)
        self.allowed_channels = {
            "H2O": "passive_aquaporin",
            "O2": "diffusion_port",
            "Glucose": "active_glut4_pump"
        }
        self.energy_reserve_atp = 100

    def route_molecule(self, molecule: str, size_daltons: int) -> dict:
        # Check stateless diffusion first
        if molecule in self.allowed_channels:
            channel = self.allowed_channels[molecule]
            if "active" in channel:
                # Stateful active pumping costs ATP
                if self.energy_reserve_atp >= 15:
                    self.energy_reserve_atp -= 15
                    return {"status": "SUCCESS", "port": channel, "atp_spent": 15, "info": "Active pump successfully loaded."}
                else:
                    return {"status": "FAILED", "port": channel, "error": "Insufficient ATP to power the pump."}
            else:
                return {"status": "SUCCESS", "port": channel, "atp_spent": 0, "info": "Passive diffusion allowed."}
        
        # Block anything else
        return {"status": "BLOCKED", "error": f"Firewall dropped packet. Size {size_daltons}Da is too large/unauthorized."}

# Test the cell firewall
firewall = MembraneFirewall()
print(firewall.route_molecule("H2O", 18))       # Passive
print(firewall.route_molecule("Glucose", 180))   # Active (costs 15 ATP)
print(firewall.route_molecule("Arsenic", 75))   # Blocked
```

---

## Section 2 — Nucleus and Organelles: Kernel and CPU Cores
In an OS, the kernel is kept safe in a high-privilege hardware ring. In eukaryotic cells, the core kernel is kept in the **Nucleus**—a double-membrane vault. 

Inside the nucleus is the absolute source code: **DNA**. The nucleus protects this source code from mutating agents in the outer environment. The cytoplasm is similar to the user-space, while the nucleus is the protected system space.

Specialized hardware modules (called **Organelles**) float in the cytoplasm to execute specific tasks:
1. **The Mitochondria (The Power Supply Unit)**: Mitochondria convert raw sugar into **ATP** packets through cellular respiration. If your mitochondria fail, your system experiences a kernel panic and shuts down.
2. **The Ribosome (The CPU/Execution Engine)**: The ribosome reads instructions (mRNA) and compiles amino acid structures into active binary executables (proteins).
3. **The Golgi Apparatus (The Network Router & Package Manager)**: The Golgi handles sorting, tagging, and addressing proteins for shipment to other parts of the cell or to external extracellular systems (like routing packets through a gateway).

---

## Section 3 — The Central Dogma: Compilation and Runtime
How does a static configuration file turn into a live, running server process? It goes through a compilation pipeline. In biology, we call this flow the **Central Dogma**:

$$\text{DNA} \xrightarrow{\text{Transcription (Compilation)}} \text{RNA} \xrightarrow{\text{Translation (Runtime Execution)}} \text{Protein}$$

Let's break down this pipeline in software terms:

| Biological Term | OS / CS Equivalent | Details |
| :--- | :--- | :--- |
| **DNA** | **Source Code on Hard Disk** | Read-only database containing all blueprints. Persistent across system resets. |
| **Transcription** | **Compiling/Reading to RAM** | RNA Polymerase reads DNA and copies a single segment into a lightweight, volatile temporary buffer (mRNA). |
| **mRNA** | **Volatile Instruction Stream (RAM)** | Light copy of active instruction blocks. Degrades quickly once read. |
| **Translation** | **CPU Fetch-Decode-Execute** | Ribosome reads mRNA codons (3-letter nucleotides) and appends amino acids. |
| **Protein** | **Running Process / Executable** | Fully folded, active machinery doing the actual database queries or mechanical work. |

---

## Hands-on Exercise
Let's write a Python sequence analyzer that simulates the transcription and translation compilation pipeline. 

Copy the following code, paste it into a file named `cell_compiler.py` in your local directory, and execute it:

```python
# cell_compiler.py

# DNA Codon translation mapping
GENETIC_CODE = {
    'AUG': 'Methionine (START)', 'UUU': 'Phenylalanine', 'UUC': 'Phenylalanine',
    'UUA': 'Leucine', 'UUG': 'Leucine', 'UCU': 'Serine', 'UCC': 'Serine',
    'UCA': 'Serine', 'UCG': 'Serine', 'UAA': 'STOP', 'UAG': 'STOP', 'UGA': 'STOP'
}

def transcribe(dna_strand: str) -> str:
    """Compiles DNA into volatile RNA."""
    # Replace Thymine with Uracil
    return dna_strand.upper().replace('T', 'U')

def translate(rna_strand: str) -> list:
    """Executes the RNA instructions in the Ribosome CPU, creating a protein."""
    rna = rna_strand.upper()
    protein = []
    
    # Read instruction codons in chunks of 3
    for i in range(0, len(rna) - 2, 3):
        codon = rna[i:i+3]
        amino_acid = GENETIC_CODE.get(codon, "Unknown_Acid")
        
        if amino_acid == 'STOP':
            protein.append("STOP")
            break
        protein.append(amino_acid)
        
    return protein

# DNA Input Strand
dna_source_code = "ATGTTTTCATCAUAA" # Wait, let's fix standard DNA
dna_code = "ATGTTTTCATCATAG"
print(f"1. Read-only Source Code on Disk (DNA): {dna_code}")

rna_buffer = transcribe(dna_code)
print(f"2. Volatile RAM Copy (mRNA): {rna_buffer}")

compiled_protein = translate(rna_buffer)
print(f"3. Compiled running process (Protein): {compiled_protein}")
```

---

## Key Takeaways
- **The Cell** is a self-contained runtime environment.
- **The Membrane** is a network firewall with active (ATP-driven) and passive transport channels.
- **The Nucleus** acts as a secure, rings-protected kernel storage for the DNA source code.
- **The Central Dogma** is a classic compilation pipeline: Disk (DNA) $\rightarrow$ RAM (RNA) $\rightarrow$ Execution CPU (Protein).

## Further Reading
- *Computer Science & Molecular Biology: A Mutual Warmup* by Lawrence Hunter.
- *Molecular Biology of the Cell* (Alberts et al.) - Chapter 1: Basic cell machinery.

---

## Quiz

### Question 1
Which organelle acts as the cell's CPU, reading volatile instruction streams and compiling structures?
- [ ] A) The Cell Membrane
- [x] B) The Ribosome
- [ ] C) The Mitochondria
- [ ] D) The Nucleus
*Explanation: The ribosome reads mRNA (volatile instructions) and links amino acids to assemble active proteins, making it the CPU execution core.*

### Question 2
What is the biological equivalent of compiling source code into a temporary memory buffer?
- [ ] A) DNA replication
- [x] B) Transcription
- [ ] C) Translation
- [ ] D) Apoptosis
*Explanation: Transcription copies DNA blueprints into volatile mRNA, acting like a compiler copying read-only source files into temporary RAM arrays.*

### Question 3
Why does passive transport through a cell membrane not require ATP energy reserves?
- [x] A) It runs along the concentration gradient (free stateless diffusion).
- [ ] B) It uses the system kernel to bypass security checks.
- [ ] C) It runs only when the cell is sleeping.
- [ ] D) It is written in C++ which is highly optimized.
*Explanation: Passive transport leverages natural entropy, letting molecules slip through dedicated channel proteins from high concentration to low concentration, meaning zero system energy is consumed.*
$markdown$, 1, 45)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;

-- Remaining modules for Course 1
INSERT INTO public.modules (course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('c1000000-0000-0000-0000-000000000001', 'DNA: The Source Code of Life', 'dna-the-source-code-of-life', 
$markdown$# DNA: The Source Code of Life

## Overview
Now that we know the cell is our operating system, let's zoom in on the source code itself: **DNA**. We will examine DNA as a read-only database stored on a double helix layout, structured with 4 base nucleotides.

## Coding DNA representation
In binary systems, we represent states as `0` and `1` (base-2). In biological systems, DNA uses a **base-4** encoding system using nucleotides:
- `A` (Adenine)
- `T` (Thymine)
- `C` (Cytosine)
- `G` (Guanine)

## Key Takeaways
DNA is a double-stranded persistent repository containing 3 billion base pairs in humans, formatted with complement rules: `A-T` and `C-G` bounds.
$markdown$, 2, 45),
('c1000000-0000-0000-0000-000000000001', 'RNA: Transcription as Compilation', 'rna-transcription-as-compilation', 
$markdown$# RNA: Transcription as Compilation

## Overview
This lesson inspects how RNA Polymerase copies DNA sequences into volatile single-stranded mRNA transcripts. We explore transcription rules and write a short script to calculate transcription alignments.
$markdown$, 3, 50),
('c1000000-0000-0000-0000-000000000001', 'Proteins: Runtime Executables', 'proteins-runtime-executables', 
$markdown$# Proteins: Runtime Executables

## Overview
Proteins are the active executables running inside the cell. They perform structural support, active chemical catalysis (enzymes), and transport tasks.
$markdown$, 4, 60),
('c1000000-0000-0000-0000-000000000001', 'The Genome: A Database of Genes', 'the-genome-a-database-of-genes', 
$markdown$# The Genome: A Database of Genes

## Overview
The entire genome contains both functional coding blocks (genes) and non-coding configuration systems (promoters, enhancers, introns). We treat the genome as a large SQL database index.
$markdown$, 5, 55),
('c1000000-0000-0000-0000-000000000001', 'Chromosomes & Inheritance: Version Control for Life', 'chromosomes-and-inheritance', 
$markdown$# Chromosomes & Inheritance: Version Control for Life

## Overview
Meiosis and recombination act as git branches and merges. Learn how parent genomes split, cross over, and merge to form progeny versions.
$markdown$, 6, 60),
('c1000000-0000-0000-0000-000000000001', 'Mutations & Variants: Bugs in the Code', 'mutations-and-variants-bugs', 
$markdown$# Mutations & Variants: Bugs in the Code

## Overview
Mutations are unexpected bitflips in the DNA database. We explore point mutations, indels, and structural mutations, and trace their functional consequences.
$markdown$, 7, 50),
('c1000000-0000-0000-0000-000000000001', 'Gene Expression: When Code Gets Executed', 'gene-expression-execution', 
$markdown$# Gene Expression: When Code Gets Executed

## Overview
Not all code runs at once. Learn how transcription factors act like process managers, turning genes on and off based on external API triggers and inputs.
$markdown$, 8, 45),
('c1000000-0000-0000-0000-000000000001', 'The Central Dogma: The Full Pipeline', 'the-central-dogma-pipeline', 
$markdown$# The Central Dogma: The Full Pipeline

## Overview
Let's assemble all pieces. We trace the complete pipeline from DNA -> RNA -> Amino Acid peptide chains -> folded active 3D proteins.
$markdown$, 9, 60),
('c1000000-0000-0000-0000-000000000001', 'Why This Matters for Bioinformatics', 'why-this-matters-for-bioinfo', 
$markdown$# Why This Matters for Bioinformatics

## Overview
We conclude Course 1 by looking at computational tasks: genome assembly, sequence comparisons, and variant detection. This establishes the roadmap for our next databases course!
$markdown$, 10, 45)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;


-- SEED COURSE 2 MODULES
INSERT INTO public.modules (course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('c2000000-0000-0000-0000-000000000002', 'Introduction to Biological Databases', 'intro-to-bio-databases', 
$markdown$# Introduction to Biological Databases
Welcome to Course 2! Biological databases are massive repositories holding sequence, annotations, and structural data. We start by exploring their taxonomy and structural layout.
$markdown$, 1, 45),
('c2000000-0000-0000-0000-000000000002', 'NCBI: The GitHub of Biology', 'ncbi-github-of-biology', 
$markdown$# NCBI: The GitHub of Biology
National Center for Biotechnology Information (NCBI) is the biggest global sequence host. Learn how to query GenBank, RefSeq, and PubMed programmatically.
$markdown$, 2, 60),
('c2000000-0000-0000-0000-000000000002', 'UniProt: The Protein Encyclopedia', 'uniprot-protein-encyclopedia', 
$markdown$# UniProt: The Protein Encyclopedia
UniProt holds curated, annotated descriptions of proteins, functional tags, pathways, and mutations.
$markdown$, 3, 50),
('c2000000-0000-0000-0000-000000000002', 'Ensembl: The Genome Browser', 'ensembl-genome-browser', 
$markdown$# Ensembl: The Genome Browser
Ensembl maps genes, promoters, transcription bindings, and variants onto physical chromosomes. Learn to browse genomic ranges.
$markdown$, 4, 55),
('c2000000-0000-0000-0000-000000000002', 'PDB: The Protein Data Bank', 'pdb-protein-data-bank', 
$markdown$# PDB: The Protein Data Bank
PDB holds 3D crystallographic structures of proteins and nucleic acids. We explore PDB formats and coordinate records.
$markdown$, 5, 60),
('c2000000-0000-0000-0000-000000000002', 'FASTA & FASTQ: Sequence File Formats', 'fasta-fastq-formats', 
$markdown$# FASTA & FASTQ: Sequence File Formats
Learn the differences between FASTA (simple sequences) and FASTQ (raw sequence reads with quality control Phred scores). We write parses in Python.
$markdown$, 6, 60),
('c2000000-0000-0000-0000-000000000002', 'SAM & BAM: Alignment File Formats', 'sam-bam-alignment-formats', 
$markdown$# SAM & BAM: Alignment File Formats
Sequence Alignment Map (SAM) and its compressed binary version (BAM) represent reads aligned against a reference. We learn their header tags and flags.
$markdown$, 7, 65),
('c2000000-0000-0000-0000-000000000002', 'VCF: Variant Call Format', 'vcf-variant-call-format', 
$markdown$# VCF: Variant Call Format
Variant Call Format (VCF) represents identified genetic mutations, alleles, confidence scores, and genotypes relative to references.
$markdown$, 8, 60),
('c2000000-0000-0000-0000-000000000002', 'BED & GFF/GTF: Annotation Formats', 'bed-gff-gtf-annotation-formats', 
$markdown$# BED & GFF/GTF: Annotation Formats
Gene annotations identify where genes and features reside. Learn to parse BED coordinates and structured GFF attributes.
$markdown$, 9, 50),
('c2000000-0000-0000-0000-000000000002', 'Biopython: Programmatic Database Access', 'biopython-database-access', 
$markdown$# Biopython: Programmatic Database Access
We write Python code using `Bio.Entrez` to query NCBI and fetch sequences directly from command terminals.
$markdown$, 10, 60)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;


-- SEED COURSE 3 MODULES
INSERT INTO public.modules (course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('c3000000-0000-0000-0000-000000000003', 'What is Sequence Similarity?', 'what-is-sequence-similarity', 
$markdown$# What is Sequence Similarity?
Learn the fundamentals of matching genetic strings. We cover Hamming distances, Edit distances, and matching metrics.
$markdown$, 1, 45),
('c3000000-0000-0000-0000-000000000003', 'BLAST: The Google Search of Biology', 'blast-google-search-biology', 
$markdown$# BLAST: The Google Search of Biology
Basic Local Alignment Search Tool (BLAST) searches databases in sub-seconds. Learn seed-and-extend heuristics and E-value mathematics.
$markdown$, 2, 60),
('c3000000-0000-0000-0000-000000000003', 'Pairwise Alignment: Needleman-Wunsch Algorithm', 'needleman-wunsch-alignment', 
$markdown$# Pairwise Alignment: Needleman-Wunsch Algorithm
Study the classic global dynamic programming sequence alignment algorithm. We solve path matrices and write it in Python.
$markdown$, 3, 75),
('c3000000-0000-0000-0000-000000000003', 'Local Alignment: Smith-Waterman Algorithm', 'smith-waterman-alignment', 
$markdown$# Local Alignment: Smith-Waterman Algorithm
Understand localized alignments and trace differences from Needleman-Wunsch (clamping negative scores to zero).
$markdown$, 4, 75),
('c3000000-0000-0000-0000-000000000003', 'Scoring Matrices: BLOSUM & PAM', 'scoring-matrices-blosum-pam', 
$markdown$# Scoring Matrices: BLOSUM & PAM
How do we score mutations? Learn PAM evolutionary distances and BLOSUM substitution frequencies for scoring alignment matches.
$markdown$, 5, 50),
('c3000000-0000-0000-0000-000000000003', 'Multiple Sequence Alignment with MUSCLE', 'msa-muscle-alignments', 
$markdown$# Multiple Sequence Alignment with MUSCLE
Aligning three or more strands. Learn how MUSCLE runs progressive and iterative refinements to scale alignments.
$markdown$, 6, 55),
('c3000000-0000-0000-0000-000000000003', 'Multiple Sequence Alignment with CLUSTALW', 'msa-clustalw-alignments', 
$markdown$# Multiple Sequence Alignment with CLUSTALW
Analyze ClustalW neighbor-joining guide trees and weightings. We execute it programmatically.
$markdown$, 7, 50),
('c3000000-0000-0000-0000-000000000003', 'Reading & Interpreting Alignment Results', 'interpreting-alignment-reports', 
$markdown$# Reading & Interpreting Alignment Results
Understand identity, conservation, mismatches, and gap penalties in standard alignment visualizers.
$markdown$, 8, 45),
('c3000000-0000-0000-0000-000000000003', 'Phylogenetics: Building the Tree of Life', 'phylogenetics-evolution-trees', 
$markdown$# Phylogenetics: Building the Tree of Life
Using sequence similarity to map evolution. Learn UPGMA and neighbor-joining distance tree-building algorithms.
$markdown$, 9, 65),
('c3000000-0000-0000-0000-000000000003', 'Practical: Full Alignment Pipeline in Python', 'python-alignment-pipeline', 
$markdown$# Practical: Full Alignment Pipeline in Python
A full capstone python script performing pairwise alignment, scoring, and output formatting.
$markdown$, 10, 75)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;


-- SEED COURSE 4 MODULES
INSERT INTO public.modules (course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('c4000000-0000-0000-0000-000000000004', 'What is Next-Generation Sequencing?', 'what-is-ngs-sequencing', 
$markdown$# What is Next-Generation Sequencing?
Start Course 4. Next-Generation Sequencing (NGS) massively parallelizes read chemical processing. Learn basic concepts and workflows.
$markdown$, 1, 45),
('c4000000-0000-0000-0000-000000000004', 'Sequencing Technologies: Illumina, PacBio, Nanopore', 'sequencing-technologies-comparison', 
$markdown$# Sequencing Technologies: Illumina, PacBio, Nanopore
Compare short-read accurate sequences (Illumina) with long-read, single-molecule real-time sequencers (PacBio, Nanopore).
$markdown$, 2, 55),
('c4000000-0000-0000-0000-000000000004', 'Quality Control with FastQC', 'quality-control-fastqc', 
$markdown$# Quality Control with FastQC
Inspect Phred quality parameters, GC bias, overrepresented sequences, and adapter contamination profiles.
$markdown$, 3, 60),
('c4000000-0000-0000-0000-000000000004', 'Trimming & Filtering with Trimmomatic', 'trimming-filtering-trimmomatic', 
$markdown$# Trimming & Filtering with Trimmomatic
Remove poor quality reads and adapter sequences programmatically from FASTQ files.
$markdown$, 4, 60),
('c4000000-0000-0000-0000-000000000004', 'Reference Genome Alignment with BWA', 'genome-alignment-bwa', 
$markdown$# Reference Genome Alignment with BWA
Align raw genomic reads to reference assemblies using Burrows-Wheeler Aligner index matches.
$markdown$, 5, 75),
('c4000000-0000-0000-0000-000000000004', 'RNA-seq Alignment with STAR', 'rnaseq-alignment-star', 
$markdown$# RNA-seq Alignment with STAR
STAR handles spliced alignments, mapping transcripts across eukaryotic introns correctly.
$markdown$, 6, 75),
('c4000000-0000-0000-0000-000000000004', 'SAM/BAM Processing with Samtools', 'sam-bam-processing-samtools', 
$markdown$# SAM/BAM Processing with Samtools
Learn sorting, indexing, depth calculations, and filtering alignments with command line `samtools`.
$markdown$, 7, 60),
('c4000000-0000-0000-0000-000000000004', 'Variant Calling with GATK', 'variant-calling-gatk', 
$markdown$# Variant Calling with GATK
Genome Analysis Toolkit (GATK) maps mutations (SNVs, indels) with statistical confidence metrics.
$markdown$, 8, 80),
('c4000000-0000-0000-0000-000000000004', 'Annotating Variants with ANNOVAR', 'annotating-variants-annovar', 
$markdown$# Annotating Variants with ANNOVAR
Map VCF mutations to physical protein changes, identifying if mutations cause missense or nonsense amino changes.
$markdown$, 9, 60),
('c4000000-0000-0000-0000-000000000004', 'RNA-seq Quantification with Salmon', 'rnaseq-quantification-salmon', 
$markdown$# RNA-seq Quantification with Salmon
Salmon quantifies gene expression transcripts instantly without alignment via quasi-mapping algorithms.
$markdown$, 10, 60),
('c4000000-0000-0000-0000-000000000004', 'Differential Expression with DESeq2', 'differential-expression-deseq2', 
$markdown$# Differential Expression with DESeq2
Statistically analyze expression tables in R, extracting significantly up-regulated or down-regulated genes.
$markdown$, 11, 75),
('c4000000-0000-0000-0000-000000000004', 'Building a Full NGS Pipeline with Snakemake', 'snakemake-ngs-pipeline', 
$markdown$# Building a Full NGS Pipeline with Snakemake
Create reproducible python-based pipelines automate QC, trimming, alignment, sorting, and variant calling.
$markdown$, 12, 90)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;


-- SEED COURSE 5 MODULES
INSERT INTO public.modules (course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('c5000000-0000-0000-0000-000000000005', 'Setting Up Your Bioinformatics Environment', 'bioinfo-env-conda-setup', 
$markdown$# Setting Up Your Bioinformatics Environment
Learn to configure Conda, Mamba, and isolated environments to coordinate large command scripts cleanly.
$markdown$, 1, 45),
('c5000000-0000-0000-0000-000000000005', 'Biopython: Parsing Sequences & Databases', 'biopython-parsing-sequences', 
$markdown$# Biopython: Parsing Sequences & Databases
Deep-dive into `Bio.Seq`, `Bio.SeqRecord`, and `Bio.SeqIO` to load FASTA/FASTQ objects.
$markdown$, 2, 60),
('c5000000-0000-0000-0000-000000000005', 'pandas for Genomic Data Analysis', 'pandas-genomics-dataframes', 
$markdown$# pandas for Genomic Data Analysis
Learn to load VCF, GFF, and expression tables into pandas and filter genomic metrics instantly.
$markdown$, 3, 60),
('c5000000-0000-0000-0000-000000000005', 'Visualization with matplotlib & seaborn', 'visualizations-matplotlib-seaborn', 
$markdown$# Visualization with matplotlib & seaborn
Graph expression profiles, volcano plots, and correlation matrices of datasets using Seaborn.
$markdown$, 4, 60),
('c5000000-0000-0000-0000-000000000005', 'Introduction to R for Bioinformaticians', 'intro-r-programming', 
$markdown$# Introduction to R for Bioinformaticians
R fundamentals: vectors, dataframes, and specific factors key for expression statistics.
$markdown$, 5, 55),
('c5000000-0000-0000-0000-000000000005', 'Bioconductor: R''s Bioinformatics Ecosystem', 'bioconductor-r-packages', 
$markdown$# Bioconductor: R''s Bioinformatics Ecosystem
Explore Bioconductor repositories and load GRanges coordinates and expressions tables.
$markdown$, 6, 65),
('c5000000-0000-0000-0000-000000000005', 'ggplot2 for Genomic Visualization', 'ggplot2-genomics-plots', 
$markdown$# ggplot2 for Genomic Visualization
Write clean R scripts using ggplot2 to map density profiles, karyotypes, and transcript expressions.
$markdown$, 7, 60),
('c5000000-0000-0000-0000-000000000005', 'Working with Large Files: chunking & streaming', 'large-files-streaming', 
$markdown$# Working with Large Files: chunking & streaming
Processing multi-gigabyte genomics files using streams and generators to prevent RAM overflow.
$markdown$, 8, 60),
('c5000000-0000-0000-0000-000000000005', 'Jupyter Notebooks for Reproducible Analysis', 'jupyter-notebooks-bioinfo', 
$markdown$# Jupyter Notebooks for Reproducible Analysis
Set up visual interactive notebooks, document code steps, and log biological findings.
$markdown$, 9, 45),
('c5000000-0000-0000-0000-000000000005', 'Building Reusable Bioinformatics Scripts', 'reusable-bio-python-scripts', 
$markdown$# Building Reusable Bioinformatics Scripts
Wrap parsing tasks into polished CLI utilities with python argparsing.
$markdown$, 10, 60)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;


-- SEED COURSE 6 MODULES
INSERT INTO public.modules (course_id, title, slug, content_markdown, order_index, duration_minutes) VALUES
('c6000000-0000-0000-0000-000000000006', 'Introduction to Protein Structure', 'intro-protein-structures-3d', 
$markdown$# Introduction to Protein Structure
Start our final advanced course! Study amino backbones, secondary sheets, and tertiary 3D folded coordinates.
$markdown$, 1, 45),
('c6000000-0000-0000-0000-000000000006', 'Reading PDB Files Programmatically', 'parsing-pdb-files-python', 
$markdown$# Reading PDB Files Programmatically
Parse coordinate ATOM records in PDB files using Biopython PDB parsers.
$markdown$, 2, 60),
('c6000000-0000-0000-0000-000000000006', 'Visualizing Structures with PyMOL & py3Dmol', 'visualizing-structures-py3dmol', 
$markdown$# Visualizing Structures with PyMOL & py3Dmol
Script interactive 3D chemical renderings of folded amino acids in notebooks using py3Dmol.
$markdown$, 3, 60),
('c6000000-0000-0000-0000-000000000006', 'AlphaFold: How AI Solved Protein Folding', 'alphafold-ai-predictions', 
$markdown$# AlphaFold: How AI Solved Protein Folding
Deconstruct DeepMind''s neural architecture mapping raw amino primary codes directly to accurate 3D protein shapes.
$markdown$, 4, 75),
('c6000000-0000-0000-0000-000000000006', 'Molecular Docking Basics', 'molecular-docking-autodock', 
$markdown$# Molecular Docking Basics
Simulate ligand interactions, binding affinities, and docking sites using AutoDock Vina.
$markdown$, 5, 70),
('c6000000-0000-0000-0000-000000000006', 'Machine Learning in Bioinformatics: Overview
', 'ml-in-bioinformatics-overview', 
$markdown$# Machine Learning in Bioinformatics: Overview
An overview of ML methods: SVM, Random Forest, and deep sequences classifiers in biology.
$markdown$, 6, 60),
('c6000000-0000-0000-0000-000000000006', 'Variant Effect Prediction with ML', 'variant-effect-ml-predictions', 
$markdown$# Variant Effect Prediction with ML
Train classifiers to predict whether genetic variants are benign or pathogenic.
$markdown$, 7, 75),
('c6000000-0000-0000-0000-000000000006', 'Protein Function Prediction', 'protein-function-predictions-ml', 
$markdown$# Protein Function Prediction
Predict Gene Ontology functional categories from raw sequences using convolutional networks.
$markdown$, 8, 75),
('c6000000-0000-0000-0000-000000000006', 'Introduction to Single-Cell RNA-seq (scRNA-seq)', 'intro-scrnaseq-analysis', 
$markdown$# Introduction to Single-Cell RNA-seq (scRNA-seq)
Examine gene expression variations at single-cell resolutions using scanpy and UMAP reductions.
$markdown$, 9, 80),
('c6000000-0000-0000-0000-000000000006', 'Capstone: Building a Bioinfo ML Pipeline', 'capstone-bioinformatics-ml-pipeline', 
$markdown$# Capstone: Building a Bioinfo ML Pipeline
A full machine learning pipeline script extracting sequences, training custom classifiers, and logging evaluations.
$markdown$, 10, 90)
ON CONFLICT (course_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  content_markdown = EXCLUDED.content_markdown,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes;
