---
title: "Beehive: A Scalable Disaggregated Memory Runtime Exploiting Asynchrony of Multithreaded Programs"
collection: publications
category: conferences
paperurl: 'https://www.usenix.org/system/files/nsdi25-li-quanxi.pdf'
slidesurl: 'https://www.usenix.org/system/files/nsdi25_slides-li-quanxi.pdf'
permalink: 'nsdi25beehive'
excerpt: 'Quanxi Li, Hong Huang, Ying Liu, **_Yanwen Xia_**, Jie Zhang, Mosong Zhou, Xiaobing Feng, Huimin Cui, Quan Chen, Yizhou Shan, Chenxi Wang*'
date: 2025-04-28
venue: 'NSDI 2025 (22nd USENIX Symposium on Networked Systems Design and Implementation)'
citation: 'Li Q, Huang H, Liu Y, et al. Beehive: A Scalable Disaggregated Memory Runtime Exploiting Asynchrony of Multithreaded Programs[C]//22nd USENIX Symposium on Networked Systems Design and Implementation (NSDI 25). 2025: 167-187.'
---

### Inroduction:
The Microsecond (µs)-scale I/O fabrics raise a tension between the programming productivity and performance, especially in disaggregated memory systems. The multithreaded synchronous programming model is popular in developing memory-disaggregated applications due to its intuitive program logic. However, our key insight is that although thread switching can effectively mitigate µs-scale latency, it leads to poor data locality and non-trivial scheduling overhead, leaving significant opportunities to improve the performance further. This paper proposes a memory-disaggregated framework, Beehive, which improves the remote access throughput by exploiting the asynchrony within each thread. To improve the programming usability, Beehive allows the programmers to develop applications in the conventional multithreaded synchronous model and automatically transforms the code into pararoutine (a newly proposed computation and scheduling unit) based asynchronous code via the Rust compiler. Beehive outperforms the state-of-the-art memory-disaggregated frameworks, i.e., Fastswap, Hermit, and AIFM, by 4.26×, 3.05×, and 1.58× on average.