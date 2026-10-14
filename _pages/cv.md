---
layout: terminal
title: "CV"
permalink: /cv/
author_profile: false
terminal_path: cv
subtitle: "Yanwen Xia · Computer systems researcher"
redirect_from:
  - /resume
---

<div class="cv-contact"><a href="mailto:{{ site.data.terminal.email }}">{{ site.data.terminal.email }}</a><span>Beijing, China</span><button class="print-cv enhanced-only" type="button" data-print-cv>Print / save PDF ↗</button></div>

## Education

**PhD student in Computer Systems · 2025.09–present**<br>
Institute of Computing Technology, Chinese Academy of Sciences; University of Chinese Academy of Sciences.

**B.E. in Data Science and Big Data Technology · 2021.09–2025.06**<br>
Huazhong University of Science and Technology.

## Research experience

**Research Assistant & Guest Student · 2024.04–2025.08**<br>
University of Chinese Academy of Sciences. Developing research projects.<br>
Supervisor: Professor Chenxi Wang.

**Research Assistant · 2023.01–2024.06**<br>
Huazhong University of Science and Technology. Developing research projects.<br>
Supervisor: Professor Chencheng Ye.

## Competitions & projects

- **First prize, ASC Student Supercomputer Challenge 2024 World Final.** Optimized OpenCAEPoro and GoMars through profiling, parallelization, data reuse, and computation/communication overlap. Led a 12-member team.
- **Second prize, Computer System Competition — OS Kernel Track, 2024.** Developed an xv6-based RISC-V kernel with multithread scheduling, virtual-memory mapping, and dynamic ELF loading. Implemented FAT32 and ext4 integration.
- **HUST Heptagon SCC Team, 2022–2025.** Participated in CPC 2023, ASC 2024, and ASC 2025.

## Publications

<div class="publication-list cv-publications">
{% for paper in site.publications reversed %}
  {% include terminal-paper.html paper=paper %}
{% endfor %}
</div>
