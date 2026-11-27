# Embedded AI Engineering: blueprint

How this profession's curriculum was built: the reasoning for each tier, a coverage matrix against the syllabi it follows, and the sources checked. Written by research agents in November 2026 and merged into `curriculum.json`.

# Embedded AI Engineering, part 1: tiers 0–2

The companion JSON is `embedded-ai-1.json`. No tier or module budget was changed: 400 + 600 + 600 = 1,600 cards in 25 modules and 197 units. Card mix by kind group, as planned:

| Tier | Concept | Code | Calculation | Trade-off | Landmark |
|---|---|---|---|---|---|
| 0 Foundations | 220 (55%) | 120 (30%) | 60 (15%) | 0 | 0 |
| 1 Core engineering | 270 (45%) | 180 (30%) | 90 (15%) | 60 (10%) | 0 |
| 2 Embedded systems | 240 (40%) | 180 (30%) | 90 (15%) | 90 (15%) | 0 |

Kind mapping: concept = definition + concept + example + misconception; code = code; calculation = numbers + formula + problem. The kinds theorem, proof-idea and counterexample are not used, so the mix can be measured exactly. Recurring threads appear in keyTerms where they come back: **number formats** (two's complement → Python floats → NumPy dtypes → C stdint → ALU flags → Q format, IEEE 754, BF16, accumulators → FPU/SIMD → ADC codes) and **memory hierarchy** (linked lists vs arrays → caches → cache-friendly code → MCU flash/SRAM/TCM → edge-SoC unified memory).

Legend for the matrices: **Gap: out of scope** means the topic was left out on purpose for this profession. **Deferred** means a later tier (owned by another part) is the right place. **Closed by** names the unit added or widened to cover a topic the module texts did not.

---

## Tier 0: Foundations (400 cards)

**Rationale.** The learner starts with no programming or electronics background, so the tier builds number sense (binary, hex, units, logs), the vocabulary of electricity and the two working languages every later tier relies on. Python comes first because it gives fast feedback and feeds later NumPy and ML work. Tooling (shell, environments, Git, reading errors) sits between Python and C so that C is compiled from a real command line. C closes the tier because firmware is written in it and tier 1 goes straight to pointers.

| Source topic | Covered by units |
|---|---|
| CS50x Week 0: binary, computer science and problem solving | digital-representation/bits-and-binary, digital-representation/powers-of-two |
| CS50x Week 0: ASCII, Unicode | digital-representation/text-encoding |
| CS50x Week 0: RGB | digital-representation/hexadecimal |
| CS50x Week 0: algorithms, pseudocode | python-1/conditionals, python-1/loops; formal treatment in data-structures-algorithms/big-o-analysis (T1) |
| CS50x Week 0: Scratch (Hello World, loops, conditionals in blocks) | Gap: out of scope. Learners start directly in Python (python-1/values-types-variables) |
| CS50x Week 1: source code, hello world, header files, compiling | c-1/first-program-compile |
| CS50x Week 1: Linux command line | developer-tooling/shell-basics |
| CS50x Week 1: types, format codes, variables | c-1/types-sizeof-stdint |
| CS50x Week 1: conditionals, loops, Mario | c-1/control-flow-c |
| CS50x Week 1: functions | c-1/functions-in-c |
| CS50x Week 1: operators (incl. truncation, overflow) | c-1/operators-in-c, c-1/types-sizeof-stdint |
| CS50x Week 1: correctness, design, style | c-1/functions-in-c (decomposition); coding standards in debug-test-secure-firmware/static-analysis-misra (T2) |
| CS50x Week 2: compiling (preprocess, compile, assemble, link) | c-1/first-program-compile |
| CS50x Week 2: debugging | c-1/debugging-c, developer-tooling/reading-errors-debugging |
| CS50x Week 2: arrays | c-1/arrays-in-c |
| CS50x Week 2: strings, string length, command-line arguments, exit status | c-1/strings-in-c |
| CS50x Week 2: reading-levels and cipher examples | Practice only (CS50x problem sets linked in c-1) |
| CS50x Week 4: hexadecimal | digital-representation/hexadecimal (rest of Week 4 in tier 1) |
| CS50x Week 6 Python: functions, variables, types, strings, conditionals, loops | python-1/values-types-variables, python-1/conditionals, python-1/loops, python-1/functions |
| CS50x Week 6: truncation and floating-point imprecision | python-1/operators-expressions; number-formats/rounding-error-ulps (T1) |
| CS50x Week 6: exceptions | python-1/exceptions-and-testing |
| CS50x Week 6: lists, searching and dictionaries | python-1/lists-and-dicts |
| CS50x Week 6: object-oriented programming | python-2-numpy/classes-objects |
| CS50x Week 6: command-line arguments, exit status, CSV files | python-1/files-and-modules |
| CS50x Week 6: libraries, modules, packages, third-party libraries | python-1/files-and-modules, developer-tooling/venv-and-pip |
| CS50x Week 6: Speller and Filter re-implemented in Python | Practice only |
| CS50x Week 7: SQL | Gap: out of scope for embedded firmware; data tooling belongs to the ML tiers (deferred) |
| CS50x Artificial Intelligence lecture | Deferred to the ML tiers (outside this slice) |
| CS50x Week 8: HTML, CSS, JavaScript | Gap: out of scope (web front ends) |
| CS50x Week 9: Flask | Gap: out of scope (web back ends) |
| CS50x Week 10: The End | Not a topic |
| CS50P Lecture 0: functions, variables | python-1/values-types-variables, python-1/functions |
| CS50P Lecture 1: conditionals | python-1/conditionals |
| CS50P Lecture 2: loops (lists, dicts) | python-1/loops, python-1/lists-and-dicts |
| CS50P Lecture 3: exceptions | python-1/exceptions-and-testing |
| CS50P Lecture 4: libraries (random, statistics, command-line arguments, packages, own libraries) | python-1/files-and-modules, developer-tooling/venv-and-pip |
| CS50P Lecture 4: web APIs (requests, JSON) | Gap: out of scope at this tier (no web clients needed) |
| CS50P Lecture 5: unit tests | python-1/exceptions-and-testing; debug-test-secure-firmware/unit-testing-firmware (T2) |
| CS50P Lecture 6: file I/O | python-1/files-and-modules |
| CS50P Lecture 7: regular expressions | Closed by developer-tooling/pipes-and-redirection (grep with simple regular expressions); full regex syntax not carded |
| CS50P Lecture 8: OOP (classes, raise, decorators, class and static methods, inheritance, operator overloading) | python-2-numpy/classes-objects; decorators and class/static methods not carded (low value for this path) |
| CS50P Lecture 9: set, global variables, constants, type hints, docstrings, enumerate, comprehensions | python-1/lists-and-dicts, python-1/functions |
| CS50P Lecture 9: argparse, unpacking, *args/**kwargs, map/filter, generators and iterators | Gap: minor Python idioms not carded; sys.argv covered in python-1/files-and-modules |
| Missing Semester 2026, L1: course overview and the shell (paths, PATH, quoting, pipes, redirects, scripts) | developer-tooling/shell-basics, developer-tooling/pipes-and-redirection |
| Missing Semester 2026, L2: command-line environment (arguments, streams, environment variables, return codes, signals) | developer-tooling/environment-and-processes |
| Missing Semester 2026, L2: SSH and file copy | embedded-linux-edge-socs/cross-dev-workflow (T2) |
| Missing Semester 2026, L2: tmux, dotfiles, aliases, terminal emulators | Gap: personal tool setup, practised rather than carded |
| Missing Semester 2026, L3: development environment (IDEs, Vim, language servers, AI autocomplete) | Gap: editor choice is practice, not card material |
| Missing Semester 2026, L4: debugging (printf, logging, debuggers) | developer-tooling/reading-errors-debugging, c-1/debugging-c; debug-test-secure-firmware/gdb-on-target (T2) |
| Missing Semester 2026, L4: memory debugging (sanitizers, Valgrind) | c-1/debugging-c; c-2-memory/malloc-and-free and c-2-memory/undefined-behaviour (T1) |
| Missing Semester 2026, L4: system call tracing | operating-systems/syscalls-interrupts (T1) |
| Missing Semester 2026, L4: profiling (time, perf, flame graphs, benchmarking) | python-2-numpy/vectorization-ufuncs (timeit); embedded-linux-edge-socs/linux-realtime-and-perf (T2) |
| Missing Semester 2026, L5: version control and Git (data model, staging, branches, merges, remotes, undo) | developer-tooling/git-basics, developer-tooling/git-branching |
| Missing Semester 2026, L6: dependencies, virtual environments, versioning, lock files | developer-tooling/venv-and-pip |
| Missing Semester 2026, L6: containers, orchestration, publishing | Gap: deferred to MLOps/deployment tiers; CI covered in debug-test-secure-firmware/unit-testing-firmware (T2) |
| Missing Semester 2026, L7: agentic coding | Gap: out of scope for card content (tool usage) |
| Missing Semester 2026, L8: beyond the code (comments, READMEs, commit messages, minimal examples) | developer-tooling/git-basics (commit messages), developer-tooling/reading-errors-debugging (minimal reproducible example) |
| Missing Semester 2026, L9: code quality (formatting, linting, testing, CI, regex) | python-1/exceptions-and-testing, developer-tooling/pipes-and-redirection; debug-test-secure-firmware/unit-testing-firmware and static-analysis-misra (T2) |
| Missing Semester 2020 special topic: data wrangling | developer-tooling/pipes-and-redirection |
| Missing Semester 2020 special topic: security and cryptography (hashes, signatures) | debug-test-secure-firmware/secure-boot-ota (T2), partial |
| Missing Semester 2020 special topics: potpourri, Q&A | Not topics |
| Missing Semester 2019 special topics: backups, automation, machine introspection, OS customisation, web and browsers, security and privacy | Gap: out of scope |
| Valvano ECE419K: number representation and arithmetic (integers) | digital-representation/twos-complement, c-1/types-sizeof-stdint (fixed point in tier 1) |
| Valvano ECE419K: debugging with simulators and hardware | c-1/debugging-c (host); hardware debugging in tier 2 |
| Module text gap: OpenStax College Algebra has no SI prefixes or unit analysis | Closed by engineering-numeracy/scientific-notation-si and unit-analysis, sourced from OpenStax University Physics Vol. 1 §1.2–1.5 |
| Module text gap: decibels are not in College Algebra | Closed by engineering-numeracy/decibels-and-ratios, sourced from OpenStax College Physics 2e §17.3 |

---

## Tier 1: Core engineering (600 cards)

**Rationale.** This tier is the hardware/software core a firmware engineer needs before touching a real microcontroller. Its spine follows MIT 6.191's bottom-up path (digital abstraction → gates → ALU → CMOS → FSMs → RISC-V → single-cycle → caches → pipelines → OS → virtual memory). Around that spine sit C memory, data structures, analog circuits, number formats and an HDL module, ordered so that digital logic precedes computer organization and HDL, and data structures precede operating systems. The 10% trade-off share goes to the layout, allocation, precision and concurrency decisions that recur in tier 2.

| Source topic | Covered by units |
|---|---|
| CS50x Week 3: linear search, binary search, running time | data-structures-algorithms/big-o-analysis, data-structures-algorithms/searching-sorting |
| CS50x Week 3: structs | c-2-memory/structs-unions-typedef |
| CS50x Week 3: selection, bubble and merge sort; recursion | data-structures-algorithms/searching-sorting, data-structures-algorithms/trees-and-bsts (recursion depth) |
| CS50x Week 4: memory, pointers, swapping | c-2-memory/pointers-and-addresses |
| CS50x Week 4: strings as pointers, pointer arithmetic, string comparison | c-2-memory/pointer-arithmetic-arrays |
| CS50x Week 4: copying and malloc, Valgrind, garbage values | c-2-memory/malloc-and-free, c-2-memory/undefined-behaviour |
| CS50x Week 4: overflow (stack and heap) | c-2-memory/stack-vs-heap |
| CS50x Week 4: scanf and C file I/O | Gap: deliberately not carded; firmware rarely has a file system (embedded Linux user-space I/O in embedded-linux-edge-socs/linux-device-tree-drivers) |
| CS50x Week 5: queues, stacks | data-structures-algorithms/stacks-queues-ring-buffers |
| CS50x Week 5: arrays vs linked lists | data-structures-algorithms/arrays-linked-lists |
| CS50x Week 5: trees, BSTs, tries | data-structures-algorithms/trees-and-bsts |
| CS50x Week 5: hashing and hash tables | data-structures-algorithms/hash-tables |
| MIT 6.191 L01: the digital abstraction | digital-logic/digital-abstraction |
| MIT 6.191 L02: combinational devices and Boolean algebra | digital-logic/boolean-algebra-gates |
| MIT 6.191 L03–L04: combinational design, design trade-offs | digital-logic/combinational-design, digital-logic/arithmetic-alu |
| MIT 6.191 L03–L04, L07: Minispec HDL | Closed by hdl-fpga-basics (SystemVerilog, the industry-standard HDL, instead of Minispec) |
| MIT 6.191 L05: CMOS | digital-logic/cmos-and-power |
| MIT 6.191 L06–L07: sequential circuits and FSMs | digital-logic/latches-flip-flops, digital-logic/finite-state-machines, hdl-fpga-basics/sv-sequential-fsm |
| MIT 6.191 L08: arithmetic pipelines | digital-logic/sequential-timing, computer-organization/pipelining-hazards |
| MIT 6.191 L09: design trade-offs | digital-logic/sequential-timing, hdl-fpga-basics/timing-closure |
| MIT 6.191 L10: compilers and RISC-V assembly | computer-organization/stored-program-isa, riscv-assembly-basics, procedures-calling-convention, instruction-encoding |
| MIT 6.191 L11: single-cycle processor | computer-organization/single-cycle-datapath |
| MIT 6.191 L12–L13: memory hierarchy, caches | computer-organization/memory-hierarchy-caches, computer-organization/cache-friendly-code |
| MIT 6.191 L14–L15: pipelined processors | computer-organization/pipelining-hazards |
| MIT 6.191 L16: operating systems | operating-systems/processes-kernel, operating-systems/syscalls-interrupts |
| MIT 6.191 L17–L18: virtual memory | computer-organization/virtual-memory |
| MIT 6.191 L19: exceptions, I/O | operating-systems/syscalls-interrupts, operating-systems/io-devices; interrupts-timers-dma/exceptions-and-nvic (T2) |
| MIT 6.191 L20: synchronization | operating-systems/race-conditions, operating-systems/locks-condvars-semaphores |
| MIT 6.191 L21: cache coherence | Partial: DMA/cache coherency in interrupts-timers-dma/dma-basics (T2). Multicore coherence protocols deferred to later systems/accelerator tiers |
| MIT 6.191 L22: parallel processing | Deferred to later tiers; SIMD basics in mcu-architecture/fpu-dsp-extensions (T2) |
| MIT 6.191 L23: modern processor architecture (branch prediction) | computer-organization/pipelining-hazards (branch prediction); out-of-order execution deferred |
| MIT 6.191 Labs 1–3 (combinational, ALU, sequential) | digital-logic units; practice via Nand2Tetris Projects 1–3 |
| MIT 6.191 Labs 4–6 (processor, caches, pipeline) | computer-organization units; practice via RARS, Nand2Tetris 4–6, CS:APP Cache Lab |
| MIT 6.191 Lab 7 (operating systems) and design project | operating-systems units; practice via OSTEP projects |
| Valvano ECE419K: ARM assembly, machine-language execution | Covered with RISC-V in computer-organization (per the module brief); Cortex-M registers and Thumb-2 in mcu-architecture/programmers-model and cortex-m-family (T2) |
| Valvano ECE419K: local variables, parameters and the stack | c-2-memory/stack-vs-heap, computer-organization/procedures-calling-convention |
| Valvano ECE419K: memory use (globals, stack, heap, ROM, RAM) | c-2-memory/stack-vs-heap; mcu-architecture/flash-sram-buses (T2) |
| Valvano ECE419K: fixed-point arithmetic | number-formats/fixed-point-q-format |
| Valvano ECE419K: data structures (linked lists, stacks, queues) | data-structures-algorithms/arrays-linked-lists, stacks-queues-ring-buffers |
| Valvano ECE445L: BJT/MOS interfaces | circuits-analog/mosfet-switches |
| Valvano ECE445L: operational amplifiers | circuits-analog/op-amps |
| Valvano ECE445L: analog filters (LPF, HPF, Butterworth) | circuits-analog/rc-filters-frequency (first order); higher-order filters deferred to DSP |
| Valvano ECE445L: regulators and power supplies | circuits-analog/regulators-decoupling |
| Valvano ECE445L: CMOS power case study | digital-logic/cmos-and-power |
| Valvano ECE445L: PCB design (KiCad), enclosures and connectors | Gap: deferred to a hardware-design specialisation; decoupling placement covered in circuits-analog/regulators-decoupling |
| Arm Education, Introduction to Microprocessors (CPU, ALU, fetch-decode-execute, pipelining, assembly) | computer-organization/stored-program-isa, riscv-assembly-basics, pipelining-hazards; digital-logic/arithmetic-alu |
| Arm Education, Computer Architecture Essentials on Arm: fundamentals, pipelining, branches, caches | computer-organization/performance-iron-law, pipelining-hazards, memory-hierarchy-caches |
| Arm Education, Computer Architecture Essentials on Arm: superscalar, out-of-order | Deferred to a later advanced-microarchitecture tier |
| Arm Education, Introduction to VLSI Design: digital logic, HDL/RTL, EDA tools | digital-logic units, hdl-fpga-basics units |
| Arm Education, Introduction to VLSI Design: manufacturing, physical implementation, packaging | Deferred (ASIC flow is beyond a junior embedded engineer) |
| Missing Semester 2026, L4: ThreadSanitizer, UBSan | operating-systems/deadlock-concurrency-bugs, c-2-memory/undefined-behaviour |
| Module key topic not in K&R or CS:APP: volatile for hardware | Closed by c-2-memory/volatile-and-mmio (cppreference and K&R Appendix A) |
| Module key topic not in Goldberg 1991: FP16, BF16, Q format, saturation, accumulators | Closed by number-formats/fp16-bf16, fixed-point-q-format, saturation-overflow, accumulator-width (IEEE 754-2019, Kalamkar 2019, Yiu §5.6.10, CMSIS-DSP, Jacob 2018) |
| Module key topic not in A Tour of C++: no-heap, no-exception subsets | Closed by modern-cpp-embedded/embedded-cpp-subset (Tour §4.4, §12.7; Embedded Template Library) |

---

## Tier 2: Embedded systems (600 cards, milestone "Junior engineer")

**Rationale.** The tier follows the order in which an engineer bringing up a new board meets problems: choose the MCU, boot it from an empty folder, handle interrupts, timers and DMA, talk to peripherals, acquire clean sensor data, then organise the work as RTOS tasks. It then steps up to embedded Linux and edge accelerators, and finishes with power, debugging, testing and secure updates. FreeRTOS and Zephyr are both taught because employers use both, and the capstone is an IMU read over I2C and streamed over UART. Trade-offs rise to 15% because choosing parts, buses, priorities and power modes is the junior engineer's daily work.

| Source topic | Covered by units |
|---|---|
| FreeRTOS Book ch. 1: why an RTOS, kernel features | rtos/why-rtos |
| FreeRTOS Book ch. 1: licensing (OpenRTOS, SafeRTOS) | Gap: not carded (low value) |
| FreeRTOS Book ch. 2: distribution, ports, FreeRTOSConfig.h, demo projects, data types and naming style | rtos/tasks-and-states, rtos/scheduler-and-context-switch (config options); naming style not carded |
| FreeRTOS Book ch. 3: heap memory management (heap_1–heap_5, static allocation, heap statistics) | rtos/timers-events-memory |
| FreeRTOS Book ch. 3: malloc-failed hook | rtos/rtos-debug-capstone |
| FreeRTOS Book ch. 4: task functions, states, creation, priorities, tick, Blocked/Suspended, vTaskDelayUntil, idle task, deletion | rtos/tasks-and-states |
| FreeRTOS Book ch. 4: scheduling algorithms (preemptive with or without time slicing, cooperative) | rtos/scheduler-and-context-switch |
| FreeRTOS Book ch. 4: thread-local storage and reentrancy | Gap: minor, not carded (reentrancy covered in interrupts-timers-dma/isr-design) |
| FreeRTOS Book ch. 5: queue management (blocking, queuing pointers, queue sets, mailboxes) | rtos/queues-and-ipc |
| FreeRTOS Book ch. 6: software timer management | rtos/timers-events-memory |
| FreeRTOS Book ch. 7: interrupt management (FromISR API, deferred processing, binary and counting semaphores, queues in ISRs) | rtos/isr-to-task |
| FreeRTOS Book ch. 7: interrupt nesting on Cortex-M | interrupts-timers-dma/priorities-and-nesting, rtos/isr-to-task |
| FreeRTOS Book ch. 8: critical sections, scheduler suspension, mutexes, priority inversion and inheritance, deadlock, recursive mutexes, gatekeeper tasks | rtos/mutexes-priority-inheritance |
| FreeRTOS Book ch. 9: event groups | rtos/timers-events-memory |
| FreeRTOS Book ch. 10: task notifications | rtos/isr-to-task |
| FreeRTOS Book ch. 11: low-power support (tickless idle) | low-power-design/tickless-idle-rtos-power |
| FreeRTOS Book ch. 12: developer support (configASSERT, Tracealyzer, hooks, run-time statistics, trace macros) | rtos/rtos-debug-capstone |
| FreeRTOS Book ch. 13: troubleshooting (interrupt priorities, stack overflow, printf, common errors) | rtos/isr-to-task, rtos/tasks-and-states, rtos/rtos-debug-capstone |
| Zephyr Kernel Services: threads, system threads | rtos/tasks-and-states |
| Zephyr: scheduling, CPU idling | rtos/scheduler-and-context-switch, low-power-design/tickless-idle-rtos-power |
| Zephyr: workqueue threads | rtos/isr-to-task |
| Zephyr: operation without threads | rtos/why-rtos (super-loop designs) |
| Zephyr: interrupts | rtos/isr-to-task, interrupts-timers-dma/exceptions-and-nvic |
| Zephyr: polling API | rtos/queues-and-ipc |
| Zephyr: semaphores, mutexes, events | rtos/isr-to-task, rtos/mutexes-priority-inheritance, rtos/timers-events-memory |
| Zephyr: condition variables | operating-systems/locks-condvars-semaphores (T1) |
| Zephyr: spinlocks, symmetric multiprocessing | Deferred: multicore RTOS is beyond this tier; spinlock concept in operating-systems/locks-condvars-semaphores (T1) |
| Zephyr data passing: message queues, FIFOs, mailboxes | rtos/queues-and-ipc |
| Zephyr data passing: LIFOs, stacks, pipes | Gap: same pattern as queues, not carded separately |
| Zephyr memory management: heaps, memory slabs | rtos/timers-events-memory |
| Zephyr timing: kernel timing, timers, system timer drivers | rtos/timers-events-memory, rtos/scheduler-and-context-switch |
| Zephyr other: atomic services | operating-systems/race-conditions (T1) |
| Zephyr other: floating-point services | interrupts-timers-dma/interrupt-latency (lazy FPU stacking), mcu-architecture/fpu-dsp-extensions |
| Zephyr other: assertions, fatal errors | rtos/rtos-debug-capstone, debug-test-secure-firmware/hardfaults-and-stacks |
| Zephyr other: version, thread-local storage | Gap: not carded (low value) |
| Zephyr: device driver model | rtos/zephyr-devicetree-kconfig |
| Zephyr: user mode | debug-test-secure-firmware/trustzone-m (MPU and unprivileged isolation), partial |
| Zephyr: kernel data structures (lists, red-black trees, ring buffers) | data-structures-algorithms units (T1) |
| Zephyr: executing time functions, time utilities, precision timing | rtos/rma-wcet (measuring execution time), partial |
| Zephyr: object cores, utilities, 64-bit division, iterable sections, scope-based cleanup | Gap: kernel internals, not junior-level |
| Zephyr: code and data relocation | bare-metal-toolchain/linker-scripts (placing sections), partial |
| Zephyr: devicetree guide and Kconfig guide | rtos/zephyr-devicetree-kconfig; embedded-linux-edge-socs/linux-device-tree-drivers |
| Valvano ECE419K: Cortex-M0+ assembly and C | mcu-architecture/programmers-model, bare-metal-toolchain units |
| Valvano ECE419K: digital I/O, LEDs, switches | bare-metal-toolchain/gpio |
| Valvano ECE419K: LCDs and displays | Gap: not carded; display drivers follow peripherals-connectivity/driver-patterns |
| Valvano ECE419K: ADC and DAC | sensors-acquisition/adc-resolution-rate; PWM as a DAC in interrupts-timers-dma/pwm |
| Valvano ECE419K: interrupts and periodic sampling | interrupts-timers-dma/exceptions-and-nvic, timers-systick |
| Valvano ECE419K: I/O device drivers, synchronisation | bare-metal-toolchain/modular-firmware, peripherals-connectivity/driver-patterns, interrupts-timers-dma/isr-design |
| Valvano ECE445L: ARM Cortex-M, MSPM0 memory map | mcu-architecture/memory-map |
| Valvano ECE445L: interrupts, edge-triggered interrupts, critical sections, HW/SW synchronisation | interrupts-timers-dma/exceptions-and-nvic, isr-design |
| Valvano ECE445L: Nyquist theorem, data acquisition, ADC techniques | sensors-acquisition/sampling-aliasing, adc-resolution-rate |
| Valvano ECE445L: Internet, Wi-Fi, IoT (CC3100, ESP8266) | peripherals-connectivity/ble-wifi |
| Valvano ECE445L: sound generation, audio amplifiers, SPI, DAC | peripherals-connectivity/spi, i2s-pdm-audio |
| Valvano ECE445L: sensors, actuators, bridges, instrumentation amp, threshold detection | sensors-acquisition/sensor-models, signal-conditioning |
| Valvano ECE445L: input capture, temperature acquisition | interrupts-timers-dma/timers-systick, sensors-acquisition units |
| Valvano ECE445L: DC motors, PWM, tachometer, servo, stepper, BLDC | interrupts-timers-dma/pwm (DC motor, servo); stepper and BLDC drive deferred to a robotics tier |
| Valvano ECE445L: low-power design | low-power-design units |
| Valvano ECE445L: specifications, software style, system design | bare-metal-toolchain/modular-firmware |
| Valvano ECE445L: graphics | Gap: not carded |
| Valvano ECE445L: SD card and FAT16 | Gap: file systems deferred |
| Valvano ECE445L: control systems; communication theory and FFT | Deferred to control and DSP tiers |
| Valvano ECE445L: real-time systems | rtos units |
| Valvano ECE445L: engineering ethics | Deferred (professional-practice material, not cards in this slice) |
| Valvano ECE445M: context switching, threads, real-time scheduling | rtos/tasks-and-states, scheduler-and-context-switch, rma-wcet |
| Valvano ECE445M: spinlocks, blocking semaphores, inter-thread communication | rtos/isr-to-task, rtos/queues-and-ipc |
| Valvano ECE445M: memory management, process linking and loading | rtos/timers-events-memory, bare-metal-toolchain/linking-and-symbols |
| Valvano ECE445M: storage and file systems | Gap: deferred |
| Valvano ECE445M: serial protocols, CAN, USB | peripherals-connectivity units |
| Valvano ECE445M: Ethernet | Gap: wired networking deferred; wireless covered in peripherals-connectivity/ble-wifi |
| Valvano ECE445M: motors, servos, sensors, input capture, output compare, PWM | interrupts-timers-dma/timers-systick, pwm |
| Valvano ECE445M: op amps, analog filters, ADC, FIFOs, digital filters | sensors-acquisition units, data-structures-algorithms/stacks-queues-ring-buffers (T1) |
| Valvano ECE445M: control systems (bang-bang, PID) | Deferred to a control tier |
| Valvano ECE445M: debugging, testing, latency, jitter, deadlines, deadlock, starvation | debug-test-secure-firmware units, rtos/rma-wcet, interrupts-timers-dma/interrupt-latency |
| Valvano Vol. 3 ch. 1–5 (architecture, I/O, thread and time management, real-time systems) | mcu-architecture/programmers-model, rtos units |
| Valvano Vol. 3 ch. 6 (digital signal processing) | sensors-acquisition/signal-conditioning (simple filters); full DSP deferred |
| Valvano Vol. 3 ch. 7 (high-speed interfacing) | interrupts-timers-dma/dma-basics, dma-double-buffering |
| Valvano Vol. 3 ch. 8 (file systems), ch. 10 (robotics) | Deferred |
| Valvano Vol. 3 ch. 9 (communication systems) | peripherals-connectivity units |
| Valvano MOOCs UT.6.10x, UT.6.20x, UT.RTBN.12.01x (I/O, multi-threaded interfacing, RTOS with Bluetooth) | bare-metal-toolchain, interrupts-timers-dma, rtos, peripherals-connectivity/ble-wifi |
| Arm Education, Get Started with the micro:bit: embedded systems, micro:bit and CMSIS, digital I/O, interrupts, analog I/O and PWM, timers | mcu-architecture/mcu-anatomy, bare-metal-toolchain/gpio, cmsis-and-hal, interrupts-timers-dma units, sensors-acquisition/adc-resolution-rate |
| Arm Education, Get Started with the micro:bit: MicroPython | Gap: firmware is taught in C/C++ (Python covered in tier 0) |
| Arm Education, Get Practical with Hardware: serial communication, SPI, asynchronous serial, I2C, USB, choosing a serial design | peripherals-connectivity/serial-fundamentals, uart, spi, i2c, usb |
| Arm Education, Get Practical with Hardware: RTOS tasks and scheduling, interrupts and time in an RTOS, constrained resources | rtos/why-rtos, tasks-and-states, scheduler-and-context-switch, isr-to-task |
| Arm Education, Get Practical with Hardware: CMSIS-RTOS2/RTX API, audio-player project | Partial: concepts covered with FreeRTOS and Zephyr APIs; RTX API not carded |
| Arm Education, Build Your First IoT Application: IoT fundamentals, system architecture (cloud, fog, edge) | embedded-linux-edge-socs/mcu-vs-linux-soc |
| Arm Education, Build Your First IoT Application: device architecture and energy | low-power-design/power-budget-basics |
| Arm Education, Build Your First IoT Application: Bluetooth, Zigbee, WLAN, LPWAN, LoRaWAN, MQTT | peripherals-connectivity/ble-wifi |
| Arm Education, Build Your First IoT Application: NB-IoT, CoAP, cloud pipelines, Android front end | Gap: out of scope or deferred to cloud/MLOps tiers |
| Arm Education, Machine Learning at the Edge on Arm | Deferred to the ML tiers; foundations here: number-formats (T1), mcu-architecture/fpu-dsp-extensions (CMSIS-NN), sensors-acquisition/imus and cameras-isp, low-power-design/power-measurement |
| Arm Education, Introduction to AI; AI at the Edge (LLMs on mobile); Optimizing Generative AI on Arm | Deferred to the ML tiers (outside this slice) |
| Arm Education, Introduction to SoC Design | embedded-linux-edge-socs/edge-soc-anatomy, mcu-architecture/mcu-anatomy (partial); fabrication flow deferred |
| Arm Education, Teaching AI on the Edge; Business Models for Technology Innovators; Spanish embedded course | Gap: out of scope (educator, business and duplicate-language courses) |
| MIT 6.191 L19: exceptions and I/O, applied to MCUs | interrupts-timers-dma/exceptions-and-nvic |
| Missing Semester 2026, L4: debuggers (gdb) on hardware | debug-test-secure-firmware/gdb-on-target |
| Missing Semester 2026, L9: testing, CI, linting | debug-test-secure-firmware/unit-testing-firmware, static-analysis-misra |
| Missing Semester 2026, L2: remote machines (SSH) | embedded-linux-edge-socs/cross-dev-workflow |
| Module key topics without a named coverage source: cameras and ISP, PDM microphones, Raspberry Pi and Jetson, TrustZone-M, MISRA C, secure boot | Closed by sensors-acquisition/cameras-isp (Ramanath et al. 2005), peripherals-connectivity/i2s-pdm-audio, embedded-linux-edge-socs/raspberry-pi-jetson, debug-test-secure-firmware/trustzone-m (Yiu M23/M33 ch. 7, 18), static-analysis-misra (MISRA C:2023), secure-boot-ota (MCUboot docs) |

---

## Sources checked

These were fetched or searched during this session to verify topics, chapter and section numbers, and practice URLs.

**Coverage sources**
- Valvano home page and course list: https://users.ece.utexas.edu/~valvano/
- ECE419K Spring 2026 syllabus: https://users.ece.utexas.edu/~valvano/mspm0/EE319KSp26.html
- ECE445L Fall 2026 syllabus (weekly topics): https://users.ece.utexas.edu/%7Evalvano/EE445L/EE445L_FALL_2026.htm
- ECE445L ebook table of contents: https://users.ece.utexas.edu/~valvano/EE445L/ebook/toc.htm
- ECE445M Spring 2026 syllabus: http://users.ece.utexas.edu/%7Evalvano/EE445M/syllabus.html
- Valvano Vol. 1 outline: http://users.ece.utexas.edu/%7Evalvano/arm/outline1.htm ; Vol. 3 outline: http://users.ece.utexas.edu/%7Evalvano/arm/outline3.htm
- Arm Education online courses: https://www.arm.com/resources/education/online-courses
- Arm Education syllabi (Coursera pages): https://www.coursera.org/learn/embedded-systems-on-arm-get-practical-with-hardware , https://www.coursera.org/learn/embedded-systems-with-arm-get-started-with-the-microbit , https://www.coursera.org/learn/arm-education-introduction-to-microprocessors , https://www.coursera.org/learn/computer-architecture-essentials-on-arm , https://www.coursera.org/learn/build-your-first-iot-application-on-arm , https://www.coursera.org/learn/getting-started-with-machine-learning-at-the-edge-on-arm
- FreeRTOS Kernel Book: https://github.com/FreeRTOS/FreeRTOS-Kernel-Book ; table of contents: https://raw.githubusercontent.com/FreeRTOS/FreeRTOS-Kernel-Book/main/toc.md
- Zephyr kernel docs: https://docs.zephyrproject.org/latest/kernel/index.html ; Kernel Services: https://docs.zephyrproject.org/latest/kernel/services/index.html ; Devicetree: https://docs.zephyrproject.org/latest/build/dts/index.html ; Kconfig: https://docs.zephyrproject.org/latest/build/kconfig/index.html
- MIT 6.191 Fall 2026 schedule: https://6191.mit.edu/fall26/schedule ; readings: https://6191.mit.edu/fall26/resources
- CS50x 2026: https://cs50.harvard.edu/x/ ; lecture notes for Weeks 0–6, for example https://cs50.harvard.edu/x/notes/4/
- CS50P: https://cs50.harvard.edu/python/ ; notes for Lectures 4, 8, 9, for example https://cs50.harvard.edu/python/notes/9/
- MIT Missing Semester: https://missing.csail.mit.edu/ ; 2026 lectures: https://missing.csail.mit.edu/2026/ (course-shell, command-line-environment, development-environment, debugging-profiling, version-control, shipping-code, agentic-coding, beyond-code, code-quality)

**Module texts (chapter and section numbers)**
- K&R 2e table of contents (Pearson sample pages): https://ptgmedia.pearsoncmg.com/images/9780131103627/samplepages/0131103628.pdf
- CS:APP 3e table of contents: https://csapp.cs.cmu.edu/3e/pieces/preface3e.pdf
- CLRS 4e chapter changes (MIT Press transition guide): https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/3923/11599-transition-guide.pdf?dl=1
- A Tour of C++ 3e table of contents: https://www.stroustrup.com/tour3toc.pdf
- Harris & Harris RISC-V edition companion page: https://pages.hmc.edu/harris/ddca/ddcarv.html (chapter list from the Elsevier listing via search)
- Goldberg 1991 (Oracle reprint, section headings): https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
- OSTEP chapter list: https://pages.cs.wisc.edu/~remzi/OSTEP/
- Yiu Cortex-M3/M4 3e table of contents: https://eld.bl.uk/catalog/017609536 ; Yiu Cortex-M23/M33 contents: https://eld.bl.uk/catalog/019949195
- White, Making Embedded Systems 2e chapter list: https://github.com/eleciawhite/making-embedded-systems
- Scherz & Monk 4e chapter list: https://www.adafruit.com/products/1261
- Lee & Seshia 2e: https://ptolemy.berkeley.edu/books/leeseshia/ (ch. 7 confirmed from a contents snippet; ch. 12 Scheduling from the Berkeley EECS 149 slides https://chess.eecs.berkeley.edu:443/eecs149/lectures/OperatingSystems.pdf)
- Mastering Embedded Linux Programming 3e chapter titles (ch. 3, 4, 5, 6, 7, 11, 13, 19) confirmed from Packt listings found by search
- TinyML ch. 15–17 titles and sections (O'Reilly listing): https://www.oreilly.com/library/view/tinyml/9781492052036/ch15.html
- mlsysbook.ai Volume I chapter list: https://mlsysbook.ai/vol1/
- OpenStax College Algebra 2e §1.2, §3.1, §3.3, §4.1, §6.3, §6.5, §6.7, for example https://openstax.org/books/college-algebra-2e/pages/6-3-logarithmic-functions
- OpenStax University Physics Vol. 1 §1.2, §1.4: https://openstax.org/books/university-physics-volume-1/pages/1-2-units-and-standards ; Vol. 2 §9.4, §10.3, §10.5: https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules ; College Physics 2e §17.3: https://openstax.org/books/college-physics-2e/pages/17-3-sound-intensity-and-sound-level
- NumPy User Guide: https://numpy.org/doc/stable/user/index.html ; D2L ch. 2: https://d2l.ai/chapter_preliminaries/index.html ; Matplotlib quick start: https://matplotlib.org/stable/users/explain/quick_start.html
- The Python Tutorial: https://docs.python.org/3/tutorial/index.html ; Pro Git 2e: https://git-scm.com/book/en/v2
- GNU ld linker scripts: https://sourceware.org/binutils/docs/ld/Scripts.html ; CMake Tutorial: https://cmake.org/cmake/help/latest/guide/tutorial/index.html

**Practice URLs (each opened and confirmed)**
- PhET Circuit Construction Kit: DC, CS50P problem sets, CS50x problem sets (1, 4, 5 Speller), NumPy absolute basics, NumPy tutorials, Missing Semester shell lecture, Learn Git Branching, CS:APP labs, Compiler Explorer, Falstad, Nand2Tetris course, RARS, Float Toy, OSTEP homework and projects, HDLBits, cpq bare-metal guide, CMake Tutorial, Zephyr samples (Getting Started, MPU6050, UART echo, Basic Synchronization, ADC, PWM Blinky, BLE heart-rate peripheral), FreeRTOS Kernel Quick Start Guide, Buildroot manual, Yocto Quick Build, Unity, MCUboot. The exact URLs are in the JSON `practice` fields.

**Cited at document level but not opened in this session.** These are standard references, cited by chapter or document only: NIST binary-prefix page; The Unicode Standard ch. 2; RFC 3629; cppreference pages (stdint.h, volatile, undefined behaviour); Regehr 2010; IEEE 754-2019; Kalamkar et al. 2019; Micikevicius et al. 2018; Jacob et al. 2018; Arm CMSIS docs; Embedded Template Library; RISC-V Privileged spec and ELF psABI; AMD/Xilinx UG474; NXP UM10204; ISO 11898-1; Philips I2S spec; USB 2.0 spec ch. 9; Bluetooth Core spec; Ramanath et al. 2005; Liu & Layland 1973; MISRA C:2023; GDB manual; Linux kernel docs; Raspberry Pi docs; NVIDIA Jetson Linux Developer Guide; Zephyr power-management page; CMake cmake-toolchains(7); Patterson & Hennessy ch. 1 (performance). Analog Devices MT-001 (SNR = 6.02N + 1.76 dB) timed out twice and could not be opened.

---

# Embedded AI Engineering, part 2: tiers 3–5

Profession `embedded-ai`. Tiers 3 (Math and signals for ML, 500 cards), 4 (ML and deep learning, 650) and 5 (Efficient ML and TinyML, 750): 1,900 cards in 176 units. Every tier and module budget is kept exactly as given; no budget was changed.

Mix accounting: concept = definition, concept, example, misconception, plus theorem, proof-idea and counterexample (the mix guidance does not map those three, so they are counted as concept); code = code; calculation = numbers, formula, problem.

| Tier | Concept | Code | Calculation | Trade-off | Landmark | Target |
|---|---|---|---|---|---|---|
| 3 | 232 (46.4%) | 74 (14.8%) | 194 (38.8%) | 0 | 0 | 45/15/40/0/0 |
| 4 | 293 (45.1%) | 127 (19.5%) | 105 (16.2%) | 92 (14.2%) | 33 (5.1%) | 45/20/15/15/5 |
| 5 | 226 (30.1%) | 112 (14.9%) | 186 (24.8%) | 150 (20.0%) | 76 (10.1%) | 30/15/25/20/10 |

Recurring threads are named in `keyTerms` where they return with more depth: number formats (`signals-dsp/sampling-and-quantization`, `numerical-computing/rounding-error-and-conditioning`, `training-deep-networks/mixed-precision-training`, `quantization-1/why-quantize`, `quantization-2/int4-binary-and-ternary`, `quantization-2/fp8-formats`); roofline (`efficiency-metrics/arithmetic-intensity` preview, `efficiency-metrics/first-roofline`, `mcu-inference-engines/mcu-memory-budgets`, `edge-soc-deployment/cpu-fallback-and-runtime-choice`); memory hierarchy (`linear-algebra/tensors-and-memory-layouts`, `numerical-computing/im2col-and-gemm`, `efficiency-metrics/*`, `efficient-architectures-nas/efficient-building-blocks`, `mcu-inference-engines/*`); attention (`transformers/*`, `distillation-low-rank/feature-and-relational-distillation`, `quantization-2/llm-quantization`).

## Verification notes

- **Horowitz numbers, one correction.** Checked against the ISSCC 2014 paper's energy figure: int add 8-bit 0.03 pJ, 32-bit 0.1 pJ; int multiply 8-bit 0.2 pJ, 32-bit 3.1 pJ; float add 16-bit 0.4 pJ, 32-bit 0.9 pJ; float multiply 16-bit 1.1 pJ, 32-bit 3.7 pJ; 64-bit cache reads 10 pJ (8 KB), 20 pJ (32 KB), 100 pJ (1 MB); DRAM 1.3–2.6 nJ. The brief's "32-bit read from a 32 KB SRAM = 5 pJ" does not match: 5 pJ per 32-bit word is half of the **8 KB** figure (Han et al. 2015 list it as "32 bit SRAM cache 5 pJ" without a size); 32 KB is about 10 pJ per 32-bit word. 640 pJ per 32-bit DRAM word matches half of the 1.3 nJ 64-bit access. `efficiency-metrics/energy-per-operation` uses the corrected wording.
- **MLPerf Tiny targets confirmed** in the paper (§4): KWS 90% top-1 (DS-CNN, Speech Commands v2, 49×10 input, 38.6K parameters, 52.5 KB); VWW 80% (MobileNetV1 0.25, 96×96, 325 KB); image classification 85% (ResNet with three stacks, CIFAR-10); anomaly detection AUC 0.85 (FC autoencoder, 640 inputs, ToyADMOS toy car).
- Section numbers were cited only where seen: MML §2.1–12.6, D2L §1.1–23.8, mlsysbook Vol. I ch. 5–8 and 10–13, MLPerf Tiny §1–9, Jacob et al. §2–3, Nagel et al. §2–4, TFLM paper §2–5, MobileNets §3.1–3.4, Deep Learning book §4.1–4.5, Strang ILA6 §1.4, §2.2, §3.5, §6.1, FP8 paper Table 1. Everything else is cited at chapter or paper level.
- Not verified online (from memory, cited at chapter level or used only in objectives): chapter numbers in Oppenheim & Willsky, MacKay, Géron chapters 4–10, Warden & Situnayake chapters 1–6, 13 and 16–21, Blitzstein & Hwang chapter 8 content; Arduino Nano 33 BLE Sense and STM32F746 memory sizes; 2-bit metadata per kept value in 2:4 sparsity; Apple Neural Engine debut in A11 (2017); ExecuTorch succeeding PyTorch Mobile; Core ML's fp16 default; Edge Impulse's "MFE for non-voice audio" advice (the MFCC-for-speech half is confirmed). The content of MIT 6.5940 Lecture 2 (efficiency metrics) was taken from the lecture title and the brief, not from the slides.
- The HarvardX edX certificate page and Harvard Online pages did not render (JavaScript, HTTP 429); the course structure came from the official courseware repository instead.

---

## Tier 3: Math and signals for ML (500 cards, difficulty 3–5)

**Rationale.** Tier 3 interleaves the math modules: linear algebra and calculus alternate so gradients arrive right after matrices, probability feeds information theory, and DSP leads straight into sensor features; numerical computing comes last because it needs SVD, cross-entropy and convolution. Calculation cards carry 39% of the tier because every later cost estimate (MACs, bytes, bits, frame counts) depends on fluent arithmetic. Each unit is anchored to an embedded use (MAC counts, quantization noise Δ²/12, wake-word base rates, 49-frame MFCC windows) so the math is never abstract for long.

### Coverage: Deisenroth, Faisal & Ong, *Mathematics for Machine Learning*

| Source topic | Covered by units |
|---|---|
| Ch. 1 Introduction and motivation | No unit needed (orientation only) |
| §2.1 Systems of linear equations; §2.3 Solving them | `linear-algebra/linear-systems-and-inverses` |
| §2.2 Matrices (multiplication, inverse, transpose) | `linear-algebra/matrices-and-matrix-multiply`, `linear-algebra/linear-systems-and-inverses`, `linear-algebra/tensors-and-memory-layouts` |
| §2.4 Vector spaces; §2.5 Linear independence; §2.6 Basis and rank | `linear-algebra/vector-spaces-and-rank` |
| §2.7 Linear mappings | `linear-algebra/matrices-and-matrix-multiply`, `neural-network-basics/perceptrons-to-mlps` |
| §2.8 Affine spaces | **Gap**, closed by teaching affine maps Wx + b in `neural-network-basics/perceptrons-to-mlps` and the affine quantizer in `quantization-1/affine-quantization-scheme` |
| §3.1 Norms; §3.2 Inner products; §3.3 Lengths and distances; §3.4 Angles and orthogonality; §3.5 Orthonormal basis; §3.6 Orthogonal complement; §3.8 Orthogonal projections | `linear-algebra/vectors-and-dot-products`, `linear-algebra/norms-and-orthogonality` |
| §3.7 Inner product of functions | **Gap**, closed in `signals-dsp/fourier-series-and-dft` (DFT as correlation with sinusoids) |
| §3.9 Rotations | **Gap**, closed in `transformers/positional-encodings-and-rope` (RoPE rotations) |
| §4.1 Determinant and trace; §4.2 Eigenvalues and eigenvectors; §4.4 Eigendecomposition and diagonalization | `linear-algebra/eigenvalues-and-eigenvectors` |
| §4.3 Cholesky decomposition | **Gap, left open on purpose** (not used later in this path) |
| §4.5 Singular value decomposition; §4.6 Matrix approximation | `linear-algebra/svd-and-low-rank-approximation`, later `distillation-low-rank/svd-factorization-of-layers` |
| §4.7 Matrix phylogeny | Not covered (summary figure only) |
| §5.1 Univariate differentiation | `calculus-optimization/derivatives-and-rates`, `calculus-optimization/chain-rule` |
| §5.2 Partial derivatives and gradients; §5.5 Useful identities | `calculus-optimization/partial-derivatives-and-gradients` |
| §5.3 Gradients of vector-valued functions; §5.4 Gradients of matrices | `calculus-optimization/jacobians-and-autodiff` |
| §5.6 Backpropagation and automatic differentiation | `calculus-optimization/jacobians-and-autodiff`, `neural-network-basics/computation-graphs-and-backprop` |
| §5.7 Higher-order derivatives; §5.8 Linearization and multivariate Taylor series | `calculus-optimization/taylor-series-and-hessian` |
| §6.1 Probability space; §6.2 Discrete and continuous probabilities | `probability-statistics/probability-basics`, `probability-statistics/random-variables-and-distributions` |
| §6.3 Sum rule, product rule and Bayes' theorem | `probability-statistics/bayes-rule` |
| §6.4 Summary statistics and independence | `probability-statistics/expectation-and-variance` |
| §6.5 Gaussian distribution | `probability-statistics/gaussians-and-the-clt` |
| §6.6 Conjugacy and the exponential family | `probability-statistics/mle-and-map` (conjugacy); exponential family **left open** |
| §6.7 Change of variables / inverse transform | **Gap, left open** (only needed for flows, which this path omits) |
| §7.1 Optimization using gradient descent; §7.2 Constrained optimization and Lagrange multipliers | `calculus-optimization/gradient-descent` |
| §7.3 Convex optimization | `calculus-optimization/convexity` |
| §8.1 Data, models and learning; §8.2 Empirical risk minimization; §8.6 Model selection | `ml-fundamentals/learning-from-data-and-splits`, `ml-fundamentals/generalization-and-bias-variance` (tier 4) |
| §8.3 Parameter estimation; §8.4 Probabilistic modeling and inference | `probability-statistics/mle-and-map` |
| §8.5 Directed graphical models | **Gap, left open** (outside the embedded path) |
| Ch. 9 Linear regression | `ml-fundamentals/linear-regression` (tier 4) |
| Ch. 10 PCA | `classical-ml-on-devices/kmeans-and-pca` (tier 4) |
| Ch. 11 Gaussian mixture models | `classical-ml-on-devices/classical-anomaly-detection` (tier 4) |
| Ch. 12 Support vector machines | `classical-ml-on-devices/support-vector-machines` (tier 4) |

### Coverage: other tier-3 module topics from the brief

| Source topic | Covered by units |
|---|---|
| Matrix-multiply cost 2MNK (Strang) | `linear-algebra/matrices-and-matrix-multiply` |
| Tensor layouts (not in MML) | **Gap in MML**, closed with D2L §2.1 and mlsysbook §7.5.1, §11.7.6 in `linear-algebra/tensors-and-memory-layouts` |
| Confidence intervals (not in Blitzstein & Hwang) | **Gap in B&H**, closed with D2L §22.10 in `probability-statistics/estimation-and-confidence-intervals`, `probability-statistics/comparing-models-statistically` |
| MLE and MAP (B&H covers only conjugacy) | Closed with MML §8.3 in `probability-statistics/mle-and-map` |
| Entropy, cross-entropy, KL, Huffman, bits per weight (MacKay ch. 2, 4–6) | `information-theory/*` (all four units) |
| Nyquist and aliasing; convolution; DFT and FFT; FIR and IIR; windowing (Smith ch. 3, 5–12, 14–21; Oppenheim & Willsky ch. 1–7, 10) | `signals-dsp/*` (all eight units) |
| STFT; mel filterbanks and MFCC; image preprocessing; IMU features; streaming windows (Warden & Situnayake ch. 7–12; Edge Impulse processing blocks) | `sensor-feature-extraction/*` (all five units) |
| Conditioning; stable softmax (Goldberg 1991; Goodfellow et al. ch. 4) | `numerical-computing/rounding-error-and-conditioning`, `numerical-computing/stable-softmax-and-logsumexp` |
| im2col to GEMM; Winograd and FFT convolution (Sze et al. 2017; Lavin & Gray 2016) | `numerical-computing/im2col-and-gemm`, `numerical-computing/winograd-and-fft-convolution` |

---

## Tier 4: ML and deep learning (650 cards, difficulty 4–6) — Bachelor's

**Rationale.** Tier 4 follows the given module order: classic models come before neural networks so metrics, splits and overfitting are learned on cheap models, and PyTorch comes after the NumPy-from-scratch units so the framework automates what the learner already did by hand. Every architecture module ends with its edge cost (conv MACs and activation memory, LSTM state, transformer FLOPs and the KV cache), which tier 5 then optimizes. Keyword spotting is built twice on purpose: as signal features in tier 3 and as a DS-CNN here, before it becomes the tier-5 capstone.

### Coverage: Dive into Deep Learning (d2l.ai)

| Source topic | Covered by units |
|---|---|
| Ch. 1 Introduction | `ml-fundamentals/learning-from-data-and-splits` |
| Ch. 2 Preliminaries (§2.1 data manipulation, §2.3 linear algebra, §2.4 calculus, §2.5 autodiff, §2.6 probability) | Tier 3 (`linear-algebra/*`, `calculus-optimization/*`, `probability-statistics/*`), `pytorch-in-practice/tensors-and-devices`, `pytorch-in-practice/autograd-in-pytorch` |
| Ch. 3 Linear regression (§3.6 generalization, §3.7 weight decay) | `ml-fundamentals/linear-regression`, `ml-fundamentals/generalization-and-bias-variance`, `ml-fundamentals/regularization` |
| Ch. 4 Linear classification (§4.1–4.6) | `ml-fundamentals/logistic-and-softmax-regression`, `ml-fundamentals/generalization-and-bias-variance` |
| §4.7 Environment and distribution shift | Partial: `sensor-feature-extraction/image-preprocessing` (training–serving skew), `cnns-vision/transfer-learning` (domain shift) |
| Ch. 5 MLPs (§5.1–5.5) | `neural-network-basics/*` |
| §5.6 Dropout | `training-deep-networks/dropout-and-augmentation` |
| §5.7 Kaggle house prices | Not used (a project; replaced by `cnns-vision/cnn-training-lab`) |
| Ch. 6 Builders' guide (§6.1–6.6 modules, parameters, init, custom layers, file I/O; §6.7 GPUs) | `pytorch-in-practice/nn-module-and-state-dict`, `pytorch-in-practice/tensors-and-devices` |
| Ch. 7 CNNs (§7.1–7.6) | `cnns-vision/convolution-layers`, `cnns-vision/pooling-and-classic-cnns` |
| Ch. 8 Modern CNNs: §8.1–8.4 AlexNet, VGG, NiN, GoogLeNet; §8.5 batch norm; §8.6 ResNet; §8.8 design | `cnns-vision/pooling-and-classic-cnns`, `training-deep-networks/normalization-layers`, `cnns-vision/resnets-and-skip-connections`, `cnns-vision/depthwise-separable-convolutions` |
| §8.7 DenseNet | **Gap, left open** (concatenation-heavy, memory-hungry; rarely used on MCUs) |
| Ch. 9 RNNs (§9.1–9.7) | `sequence-audio-models/rnns-lstms-and-grus`, `generative-ai-llms/language-modeling-and-pretraining` (§9.3) |
| Ch. 10 Modern RNNs: §10.1 LSTM, §10.2 GRU, §10.6 encoder–decoder, §10.8 beam search | `sequence-audio-models/rnns-lstms-and-grus`, `transformers/the-transformer-block`, `generative-ai-llms/decoding-strategies` |
| §10.3 Deep RNNs; §10.4 Bidirectional RNNs; §10.5, §10.7 machine translation | **Gap, left open**: bidirectional models cannot stream, which is the device use case; translation is not an edge task here |
| Ch. 11 Attention and transformers (§11.1–11.9) | `transformers/*`, `generative-ai-llms/language-modeling-and-pretraining` (§11.9) |
| Ch. 12 Optimization algorithms (§12.1–12.3) | `calculus-optimization/convexity`, `calculus-optimization/gradient-descent` |
| Ch. 12 (§12.4–12.11 SGD, momentum, Adagrad, RMSProp, Adadelta, Adam, LR scheduling) | `training-deep-networks/minibatch-sgd-and-momentum`, `training-deep-networks/adaptive-optimizers`, `training-deep-networks/learning-rate-schedules` |
| Ch. 13 Computational performance: §13.1 compilers and interpreters; §13.4 hardware | `pytorch-in-practice/torch-export-and-onnx`, `efficiency-metrics/*` (tier 5) |
| §13.2–13.3 asynchronous computation, automatic parallelism; §13.5–13.7 multi-GPU, parameter servers | **Gap, left open**: multi-GPU training is outside tiers 3–5 (flagged for a later tier) |
| Ch. 14 Computer vision: §14.1 augmentation; §14.2 fine-tuning; §14.3–14.8 detection; §14.13 CIFAR-10 | `training-deep-networks/dropout-and-augmentation`, `cnns-vision/transfer-learning`, `cnns-vision/object-detection-and-yolo`, `cnns-vision/cnn-training-lab` |
| §14.9–14.11 segmentation, transposed convolution, FCN; §14.12 style transfer; §14.14 dog breeds | **Gap, left open** (flagged for a later tier: segmentation for edge vision) |
| Ch. 15 NLP pretraining: §15.8–15.10 BERT | `generative-ai-llms/language-modeling-and-pretraining` |
| §15.1–15.7 word2vec, GloVe, subword embeddings | Partial: subwords in `generative-ai-llms/tokenization-and-bpe`; word2vec/GloVe **left open** |
| Ch. 16 NLP applications | Partial: fine-tuning patterns in `generative-ai-llms/fine-tuning-and-lora` |
| Ch. 17 Reinforcement learning | Partial: only as used in `generative-ai-llms/rlhf-and-dpo` |
| Ch. 18 Gaussian processes | **Left open** (outside the path) |
| Ch. 19 Hyperparameter optimization | Partial: `training-deep-networks/learning-rate-schedules` (range test); search methods in tier 5 `efficient-architectures-nas/*` |
| Ch. 20 GANs | `generative-ai-llms/diffusion-models` (GANs as comparison) |
| Ch. 21 Recommender systems | **Left open** (not an embedded workload) |
| Ch. 22 Math appendix (§22.1–22.11) | Tier 3 (`linear-algebra/*`, `calculus-optimization/*`, `probability-statistics/*`, `information-theory/*`) |
| Ch. 23 Tools appendix | Not covered (setup material) |

### Coverage: Prince, *Understanding Deep Learning*

| Source topic | Covered by units |
|---|---|
| Ch. 1 Introduction | `ml-fundamentals/learning-from-data-and-splits` |
| Ch. 2 Supervised learning | `ml-fundamentals/linear-regression` |
| Ch. 3 Shallow neural networks | `neural-network-basics/perceptrons-to-mlps`, `neural-network-basics/activation-functions` |
| Ch. 4 Deep neural networks | `neural-network-basics/perceptrons-to-mlps`, `neural-network-basics/parameters-flops-and-depth` |
| Ch. 5 Loss functions | `neural-network-basics/loss-functions`, `ml-fundamentals/logistic-and-softmax-regression` |
| Ch. 6 Fitting models | `training-deep-networks/minibatch-sgd-and-momentum`, `training-deep-networks/adaptive-optimizers`, `training-deep-networks/learning-rate-schedules` |
| Ch. 7 Gradients and initialization | `neural-network-basics/computation-graphs-and-backprop`, `neural-network-basics/gradient-flow-and-initialization` |
| Ch. 8 Measuring performance | `ml-fundamentals/generalization-and-bias-variance` (incl. double descent), `training-deep-networks/debugging-training-runs` |
| Ch. 9 Regularization | `ml-fundamentals/regularization`, `training-deep-networks/dropout-and-augmentation` |
| Ch. 10 Convolutional networks | `cnns-vision/convolution-layers` |
| Ch. 11 Residual networks | `cnns-vision/resnets-and-skip-connections`, `training-deep-networks/normalization-layers` |
| Ch. 12 Transformers | `transformers/*` |
| Ch. 13 Graph neural networks | **Gap, left open** (not a core edge workload; flagged for a later tier) |
| Ch. 14 Unsupervised learning | Partial: `classical-ml-on-devices/kmeans-and-pca`, `tinyml-workflow/anomaly-detection-on-device` (autoencoders) |
| Ch. 15 GANs; Ch. 17 Variational autoencoders | Partial: comparison in `generative-ai-llms/diffusion-models` |
| Ch. 16 Normalizing flows | **Gap, left open** |
| Ch. 18 Diffusion models | `generative-ai-llms/diffusion-models` |
| Ch. 19 Reinforcement learning | Partial: `generative-ai-llms/rlhf-and-dpo` (PPO with a KL penalty) |
| Ch. 20 Why does deep learning work? | Partial: `ml-fundamentals/generalization-and-bias-variance` |
| Ch. 21 Deep learning and ethics | Partial: `tinyml-workflow/ml-lifecycle-and-data-engineering` (responsible AI, data cascades); fuller treatment flagged for a later tier |

### Coverage: other tier-4 module topics from the brief

| Source topic | Covered by units |
|---|---|
| Géron ch. 1–4 (landscape, end-to-end project, classification metrics, training models) | `ml-fundamentals/*` |
| Géron ch. 5–9 (SVM, trees, ensembles, dimensionality reduction, unsupervised) | `classical-ml-on-devices/*` |
| Géron ch. 10 (Keras) | `pytorch-in-practice/keras-and-tflite-conversion` |
| CS231n notes: k-NN, linear classification, optimization, backprop, NN parts 1–3, case study, CNNs, transfer learning | `classical-ml-on-devices/knn-and-distance-metrics`, `ml-fundamentals/logistic-and-softmax-regression`, `neural-network-basics/*`, `cnns-vision/*` |
| CS231n: visualizing CNNs | **Gap, left open** (interpretability; flagged for a later tier) |
| CS224n (Winter 2026): backprop, language models and RNNs, transformers, pretraining, post-training, efficient adaptation, tokenization | `neural-network-basics/computation-graphs-and-backprop`, `sequence-audio-models/rnns-lstms-and-grus`, `transformers/*`, `generative-ai-llms/*` |
| CS224n: agents and RAG, reasoning, evaluation, interpretability, multimodality, word vectors | **Gap, left open** for this tier (outside the embedded path or later-tier research topics) |
| PyTorch docs: autograd, nn.Module, training loop, AMP, torch.export, torch.onnx | `pytorch-in-practice/*` |
| Raschka ch. 1–7 and App. E; bonus KV cache, GQA, FLOPs analysis, DPO | `generative-ai-llms/*`, `transformers/kv-cache`, `transformers/multi-head-and-grouped-query-attention`, `transformers/transformer-flops-and-memory` |
| DS-CNN keyword spotting; streaming inference (Warden & Situnayake ch. 7–8) | `sequence-audio-models/ds-cnn-keyword-spotting`, `sequence-audio-models/streaming-inference` |

---

## Tier 5: Efficient ML and TinyML (750 cards, difficulty 6–7) — Master's

**Rationale.** Efficiency metrics open the tier so every later technique is judged in MACs, bytes, picojoules and roofline position rather than parameter counts. The TinyML workflow comes next so the target applications (KWS, VWW, gestures, anomaly detection) are concrete before compression starts; then pruning → quantization I → quantization II → architectures and NAS → distillation, and finally the engines that run the result on MCUs and phone SoCs. Benchmarking closes the tier on the MLPerf Tiny tasks the learner has just built, and the keyword-spotting capstone in `mcu-inference-engines/capstone-kws-on-cortex-m` ties the whole slice together.

### Coverage: MIT 6.5940 — Fall 2026 Chapter I (Efficient Inference) and the full Fall 2024 lecture list

| Source topic | Covered by units |
|---|---|
| 2024 L1 / 2026 L1 Introduction | `efficiency-metrics/why-efficiency-at-the-edge` |
| 2024 L2 / 2026 L2 Basics of Deep Learning (layers and efficiency metrics) | `neural-network-basics/*`, `cnns-vision/conv-parameters-and-macs` (tier 4); `efficiency-metrics/params-model-size-and-macs`, `efficiency-metrics/latency-throughput-and-batching`, `efficiency-metrics/peak-activation-memory`, `efficiency-metrics/energy-per-operation` |
| L3 Pruning and Sparsity I (Chapter I, both years) | `pruning-sparsity/pruning-fundamentals`, `pruning-sparsity/pruning-granularity`, `pruning-sparsity/pruning-criteria` |
| L4 Pruning and Sparsity II | `pruning-sparsity/sensitivity-analysis-and-ratios`, `pruning-sparsity/lottery-ticket-hypothesis`, `pruning-sparsity/deep-compression-pipeline`, `pruning-sparsity/n-m-and-2-4-sparsity`, `pruning-sparsity/sparse-execution-on-devices` |
| L5 Quantization I (numeric types, k-means and linear quantization) | `quantization-1/why-quantize`, `quantization-1/kmeans-weight-sharing`, `quantization-1/affine-quantization-scheme`, `quantization-1/symmetric-vs-asymmetric`, `quantization-1/per-tensor-vs-per-channel`, `quantization-1/integer-only-requantization`, `quantization-2/fp8-formats` |
| L6 Quantization II (PTQ, QAT, binary/ternary, mixed precision) | `quantization-1/calibration-and-range-setting`, `quantization-1/ptq-in-practice`, `quantization-2/quantization-aware-training`, `quantization-2/straight-through-estimator`, `quantization-2/mixed-precision-quantization`, `quantization-2/int4-binary-and-ternary` |
| L7 Neural Architecture Search I | `efficient-architectures-nas/efficient-building-blocks`, `efficient-architectures-nas/mobilenet-family`, `efficient-architectures-nas/efficientnet-compound-scaling`, `efficient-architectures-nas/nas-search-spaces-and-strategies` |
| L8 Neural Architecture Search II | `efficient-architectures-nas/one-shot-nas-and-weight-sharing`, `efficient-architectures-nas/once-for-all`, `efficient-architectures-nas/hardware-aware-search` |
| L9 Knowledge Distillation | `distillation-low-rank/knowledge-distillation-basics`, `distillation-low-rank/feature-and-relational-distillation` |
| L10 MCUNet: TinyML on Microcontrollers | `efficient-architectures-nas/tinynas-and-mcunet`, `mcu-inference-engines/mcu-memory-budgets`, `mcu-inference-engines/tinyengine-and-code-generation`, `mcu-inference-engines/patch-based-inference` |
| L11 TinyEngine and Parallel Processing | `mcu-inference-engines/loop-optimizations-and-kernels`, `mcu-inference-engines/cmsis-nn-and-simd`, `mcu-inference-engines/tinyengine-and-code-generation` |
| 2024 L12 Transformer and LLM | `transformers/*`, `generative-ai-llms/*` (tier 4) |
| 2024 L13 Efficient LLM Deployment | `quantization-2/llm-quantization`, `quantization-2/int4-binary-and-ternary`, `transformers/kv-cache` |
| 2024 L14 LLM Post Training | `generative-ai-llms/fine-tuning-and-lora`, `generative-ai-llms/rlhf-and-dpo`, `distillation-low-rank/lora-and-combining-techniques` |
| 2024 L15 Long Context LLM | Partial: `transformers/kv-cache`, `transformers/positional-encodings-and-rope`; long-context attention methods **flagged for a later tier** |
| 2024 L16 Vision Transformer | `transformers/vision-transformers` |
| 2024 L17 GAN, Video and Point Cloud | Partial: GANs in `generative-ai-llms/diffusion-models`; video and point-cloud models **left open** |
| 2024 L18 Diffusion Model | `generative-ai-llms/diffusion-models` |
| 2024 L19–20 Distributed Training I–II | **Gap, left open**: outside tiers 3–5 (flagged for a later tier); single-device efficiency is in `training-deep-networks/mixed-precision-training` |
| 2024 L21 On-Device Training and Transfer Learning | Partial: transfer learning in `cnns-vision/transfer-learning` and `tinyml-workflow/edge-impulse-pipeline-and-eon`; on-device training **flagged for a later tier** |
| 2024 L22–23 Course Summary + Quantum ML I–II | **Left open** (outside the profession) |
| 2024 L24–26 Final project presentations | Not applicable |
| Labs: Lab 1 Pruning, Lab 2 Quantization, Lab 3 NAS, Lab 4 LLM compression | Practice links on `pruning-sparsity`, `quantization-1`, `efficient-architectures-nas`, `quantization-2` |
| Lab 5 LLM deployment on laptop | Partial: `quantization-2/llm-quantization`, `edge-soc-deployment/*` (no link given) |

### Coverage: HarvardX TinyML Professional Certificate (courseware units)

| Source topic | Covered by units |
|---|---|
| 1.1–1.4 Welcome, the future of ML is tiny, TinyML challenges, getting started | `tinyml-workflow/tinyml-landscape-and-constraints`, `mcu-inference-engines/mcu-memory-budgets`, `pytorch-in-practice/keras-and-tflite-conversion` |
| 2.1–2.3 ML paradigm, deep-learning building blocks, ML scenarios | `ml-fundamentals/learning-from-data-and-splits`, `neural-network-basics/*` |
| 2.4 Building a computer-vision model | `cnns-vision/convolution-layers`, `cnns-vision/cnn-training-lab` |
| 2.5, 3.9, 4.9 Responsible AI design, development and deployment | Partial: `tinyml-workflow/ml-lifecycle-and-data-engineering`, `benchmarking/pitfalls-and-reporting`; fuller ethics **flagged for a later tier** |
| 3.2 AI lifecycle and ML workflow; 3.6 Data engineering; 4.6 Custom dataset engineering for KWS | `tinyml-workflow/ml-lifecycle-and-data-engineering` |
| 3.3–3.4 ML on mobile and edge IoT devices | `efficiency-metrics/why-efficiency-at-the-edge`, `edge-soc-deployment/edge-soc-landscape`, `quantization-1/why-quantize`, `pruning-sparsity/pruning-fundamentals` |
| 3.5, 4.5 Keyword spotting | `sequence-audio-models/ds-cnn-keyword-spotting`, `tinyml-workflow/keyword-spotting-application`, `mcu-inference-engines/capstone-kws-on-cortex-m` |
| 3.7, 4.7 Visual wake words | `tinyml-workflow/visual-wake-words` |
| 3.8 Anomaly detection | `tinyml-workflow/anomaly-detection-on-device`, `classical-ml-on-devices/classical-anomaly-detection` |
| 4.2–4.3 Getting started; embedded hardware and software | `mcu-inference-engines/running-a-model-on-cortex-m`, `mcu-inference-engines/mcu-memory-budgets` |
| 4.4 TensorFlow Lite Micro | `mcu-inference-engines/litert-micro-architecture`, `mcu-inference-engines/tensor-arena-and-memory-planning` |
| 4.8 Gesturing magic wand | `tinyml-workflow/gesture-recognition-with-imus` |
| 5.2–5.5 MLOps big picture, ML development, training operationalization, continuous training | Partial: one objective in `tinyml-workflow/edge-impulse-pipeline-and-eon`; **flagged for a later tier** |
| 5.6 Model conversion; 5.7 Model deployment | `pytorch-in-practice/keras-and-tflite-conversion`, `quantization-1/ptq-in-practice`, `tinyml-workflow/edge-impulse-pipeline-and-eon`, `edge-soc-deployment/cpu-fallback-and-runtime-choice` |
| 5.8–5.10 Prediction serving, continuous monitoring, data and model management | Partial: `tinyml-workflow/edge-impulse-pipeline-and-eon`; **flagged for a later tier** |
| 5.11 Responsible AI: transparency and sustainability | Partial: `benchmarking/energy-and-power-measurement`, `benchmarking/pitfalls-and-reporting` |

### Coverage: MLPerf Tiny Benchmark paper (Banbury et al., arXiv 2106.07597)

| Source topic | Covered by units |
|---|---|
| §1 Introduction; §7 Impact | `benchmarking/mlperf-tiny-suite` |
| §2 Challenges (power, memory, hardware and software heterogeneity) | `benchmarking/mlperf-tiny-suite`, `benchmarking/pitfalls-and-reporting`, `tinyml-workflow/tinyml-landscape-and-constraints` |
| §3 Related work (MLPerf Inference, mobile benchmarks) | `benchmarking/latency-and-tail-latency` |
| §4.1 Visual wake words | `tinyml-workflow/visual-wake-words`, `benchmarking/mlperf-tiny-suite` |
| §4.2 Image classification | `cnns-vision/cnn-training-lab`, `benchmarking/mlperf-tiny-suite` |
| §4.3 Keyword spotting | `sequence-audio-models/ds-cnn-keyword-spotting`, `sensor-feature-extraction/mel-filterbanks-and-mfcc`, `benchmarking/mlperf-tiny-suite` |
| §4.4 Anomaly detection | `tinyml-workflow/anomaly-detection-on-device`, `ml-fundamentals/roc-auc-and-calibration` |
| §5.1 Modular design; §5.2 Closed and open divisions | `benchmarking/mlperf-tiny-suite`, `quantization-1/ptq-in-practice` |
| §5.3 Measurement procedure (latency, accuracy, energy) | `benchmarking/latency-and-tail-latency`, `benchmarking/energy-and-power-measurement` |
| §6 Benchmark assessment; §8 Limitations | `benchmarking/pitfalls-and-reporting` |
| §9 Conclusion | Not applicable |
| Appendix A: framework hardware, firmware, software | `benchmarking/energy-and-power-measurement`, `benchmarking/mlperf-tiny-suite` |

### Coverage: other tier-5 module topics from the brief

| Source topic | Covered by units |
|---|---|
| Jacob et al. 2018: §2.1 scheme, §2.2–2.4 integer matmul, zero-points, fused layer; §3.1 learned ranges; §3.2 BN folding | `quantization-1/affine-quantization-scheme`, `quantization-1/integer-only-requantization`, `quantization-1/batchnorm-folding-and-fusion`, `quantization-2/quantization-aware-training` |
| Nagel et al. 2021: §2 fundamentals; §3 PTQ (range setting, CLE, bias correction, AdaRound, pipeline, debugging); §4 QAT (STE, BN folding, init, pipeline) | `quantization-1/*`, `quantization-2/quantization-aware-training`, `quantization-2/straight-through-estimator`, `quantization-2/sqnr-and-error-analysis` |
| David et al. 2021 (TFLM): §2 challenges, §3 design principles, §4.2 interpreter, §4.3 model loading, §4.4 memory, §4.5 multitenancy, §4.7–4.8 operators and platform specialization, §5 evaluation | `mcu-inference-engines/litert-micro-architecture`, `mcu-inference-engines/tensor-arena-and-memory-planning`, `mcu-inference-engines/cmsis-nn-and-simd` |
| TFLM §4.6 Multithreading; §4.9 Build system | Partial: bag-of-files build named in `mcu-inference-engines/litert-micro-architecture`; multithreading **left open** (rare on MCUs) |
| ExecuTorch and LiteRT docs: delegates, .pte, CPU fallback; ONNX Runtime; Core ML; TensorRT | `edge-soc-deployment/*` |
| Edge Impulse pipeline and EON Compiler | `tinyml-workflow/edge-impulse-pipeline-and-eon`, `mcu-inference-engines/tinyengine-and-code-generation` |
| Vela compiler; CMSIS-NN and Helium | `mcu-inference-engines/micro-npus-and-vela`, `mcu-inference-engines/cmsis-nn-and-simd` |

---

## Cross-tier coverage: mlsysbook.ai Volume I (*Introduction to Machine Learning Systems*)

| Source topic | Covered by units |
|---|---|
| Ch. 1 Introduction | `efficiency-metrics/why-efficiency-at-the-edge` |
| Ch. 2 System Paradigms | `efficiency-metrics/why-efficiency-at-the-edge`, `tinyml-workflow/tinyml-landscape-and-constraints`, `edge-soc-deployment/edge-soc-landscape` |
| Ch. 3 ML Lifecycle; Ch. 4 Data Engineering | `tinyml-workflow/ml-lifecycle-and-data-engineering`, `ml-fundamentals/learning-from-data-and-splits` |
| Ch. 5 Neural Computation (§5.3 fundamentals, §5.4 learning, §5.5 inference pipeline) | `neural-network-basics/*`, `efficiency-metrics/latency-throughput-and-batching` |
| Ch. 6 Network Architectures: §6.2 MLPs, §6.3 CNNs (incl. §6.3.5 depthwise-separable), §6.4 skip connections and normalization, §6.5 RNNs, §6.6 attention, §6.7 transformers, §6.9 arithmetic intensity | `neural-network-basics/*`, `cnns-vision/*`, `training-deep-networks/normalization-layers`, `sequence-audio-models/*`, `transformers/*`, `efficiency-metrics/arithmetic-intensity` |
| §6.8 Sparse architectures: recommendation systems | **Left open** (not an embedded workload) |
| Ch. 7 ML Frameworks: §7.3 execution and graph capture, §7.3.8 static runtimes for MCUs, §7.4 differentiation, §7.5 tensors, devices, data loading, §7.6 modules, §7.7 training step | `pytorch-in-practice/*`, `calculus-optimization/jacobians-and-autodiff`, `linear-algebra/tensors-and-memory-layouts`, `mcu-inference-engines/litert-micro-architecture` |
| §7.8–7.9 TensorFlow, PyTorch, JAX; choosing a framework | Partial: `pytorch-in-practice/keras-and-tflite-conversion`, `edge-soc-deployment/cpu-fallback-and-runtime-choice` |
| Ch. 8 Model Training: §8.3 compute and memory costs, §8.6.3 mixed precision | `transformers/transformer-flops-and-memory`, `training-deep-networks/adaptive-optimizers`, `training-deep-networks/mixed-precision-training` |
| §8.6.4 FlashAttention; §8.6.5 gradient accumulation and checkpointing; §8.7 scaling training | **Gap, left open** (training-system topics flagged for a later tier) |
| Ch. 9 Data Selection | Partial: `tinyml-workflow/ml-lifecycle-and-data-engineering`; data-selection methods **flagged for a later tier** |
| Ch. 10 Model Compression: §10.2.1 pruning, §10.2.2 low-rank, §10.2.3 distillation, §10.2.4 efficient design, §10.2.5 NAS | `pruning-sparsity/*`, `distillation-low-rank/*`, `efficient-architectures-nas/*` |
| §10.2.6 Adaptive computation (dynamic pruning, early exit) | **Gap, left open** (flagged for a later tier) |
| §10.3 Numerical precision (formats, energy, PTQ, QAT, extreme quantization) | `quantization-1/*`, `quantization-2/*` |
| §10.4 Hardware implementation (fusion, sparsity exploitation); §10.5 choosing and combining; §10.6 measuring gains | `quantization-1/batchnorm-folding-and-fusion`, `pruning-sparsity/sparse-execution-on-devices`, `distillation-low-rank/lora-and-combining-techniques`, `benchmarking/pitfalls-and-reporting` |
| Ch. 11 Hardware Acceleration: §11.3–11.4 compute primitives and units, §11.5 memory systems, §11.6 roofline, §11.7 mapping, dataflow, tiling, layouts, fusion | `mcu-inference-engines/cmsis-nn-and-simd`, `pruning-sparsity/n-m-and-2-4-sparsity`, `efficiency-metrics/energy-per-operation`, `efficiency-metrics/first-roofline`, `efficiency-metrics/memory-hierarchy-and-dataflow`, `mcu-inference-engines/loop-optimizations-and-kernels` |
| §11.8 Compilers and runtimes; §11.10 heterogeneous SoCs; §11.11 choosing an accelerator | `mcu-inference-engines/tinyengine-and-code-generation`, `edge-soc-deployment/*` |
| §11.9 Beyond one accelerator | **Left open** (multi-accelerator systems) |
| Ch. 12 Benchmarking (§12.3 granularity, §12.4.4 MLPerf scenarios, §12.6 inference metrics and tail latency, §12.7 power and energy, §12.8 best practices, §12.9 model and data evaluation) | `benchmarking/*`, `probability-statistics/comparing-models-statistically` |
| §12.5 Training benchmarks | **Left open** (training at scale) |
| Ch. 13 Model Serving: §13.4–13.6 latency budget, Little's law, tail latency, batching; §13.7–13.8 runtimes and node optimization; §13.9.5 training–serving skew; §13.10 LLM serving (TTFT, TPOT, decoding, KV cache) | `efficiency-metrics/latency-throughput-and-batching`, `edge-soc-deployment/*`, `sensor-feature-extraction/image-preprocessing`, `generative-ai-llms/decoding-strategies`, `transformers/kv-cache` |
| §13.11 Economics and planning | **Left open** (datacenter serving) |
| Ch. 14 ML Operations; Ch. 15 Responsible Engineering | Partial: `tinyml-workflow/edge-impulse-pipeline-and-eon`, `tinyml-workflow/ml-lifecycle-and-data-engineering`; **flagged for a later tier** |
| Ch. 16 Conclusion | Not applicable |

---

## Sources checked

Coverage sources
- MIT 6.5940 Fall 2026 schedule and chapters: https://hanlab.mit.edu/courses/2026-fall-65940
- MIT 6.5940 Fall 2024 lecture list, slides and lab Colab links: https://hanlab.mit.edu/courses/2024-fall-65940
- mlsysbook.ai Volume I contents and chapters 5–8, 10–13: https://mlsysbook.ai/vol1/ (chapter pages such as https://mlsysbook.ai/vol1/12_benchmarking/12_benchmarking.html)
- HarvardX TinyML certificate page (did not render): https://www.edx.org/certificates/professional-certificate/harvardx-tiny-machine-learning; course structure from https://github.com/tinyMLx/courseware/tree/master/edX
- MLPerf Tiny paper: https://arxiv.org/abs/2106.07597 and https://ar5iv.labs.arxiv.org/html/2106.07597
- D2L contents: https://d2l.ai/
- UDL chapter list (from the site's bundle; latest PDF dated 2026-02-09): https://udlbook.github.io/udlbook/
- MML contents (site and book PDF): https://mml-book.github.io/

Texts and courses
- Strang ILA 6th edition page: https://math.mit.edu/~gs/linearalgebra/ila6/indexila6.html
- Smith, DSP Guide chapter list: https://www.dspguide.com/pdfbook.htm
- MacKay ITILA: https://www.inference.org.uk/itila/book.html
- Blitzstein & Hwang, 2nd ed. (chapter list from web-search snippets of the publisher and library-catalog listings; page not opened): https://www.routledge.com/Introduction-to-Probability-Second-Edition/Blitzstein-Hwang/p/book/9781138369917
- Warden & Situnayake (chapters 7–12, 14, 15 confirmed from web-search snippets; the O'Reilly page returned HTTP 403): https://www.oreilly.com/library/view/tinyml/9781492052036/
- Géron 3rd ed. (chapters 1–3 and 19 confirmed from web-search snippets; others from memory): https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/
- Raschka, LLMs-from-scratch: https://github.com/rasbt/LLMs-from-scratch
- Stanford CS224n (Winter 2026): https://web.stanford.edu/class/cs224n/
- Stanford CS231n notes: https://cs231n.github.io/
- Goodfellow et al., Deep Learning ch. 4: https://www.deeplearningbook.org/contents/numerical.html

Papers
- Horowitz, ISSCC 2014 (energy table): https://gwern.net/doc/cs/hardware/2014-horowitz-2.pdf
- Han et al. 2015: https://arxiv.org/abs/1506.02626
- Pedram et al. (cross-check, different table): https://ar5iv.labs.arxiv.org/html/1602.04183
- TFLM (David et al., MLSys 2021): https://ar5iv.labs.arxiv.org/html/2010.08678
- Nagel et al. white paper: https://ar5iv.labs.arxiv.org/html/2106.08295
- Jacob et al. 2018: https://ar5iv.labs.arxiv.org/html/1712.05877
- MCUNet: https://arxiv.org/abs/2007.10319; MCUNetV2: https://arxiv.org/abs/2110.15352
- FP8 formats: https://ar5iv.labs.arxiv.org/html/2209.05433
- 2:4 sparsity: https://arxiv.org/abs/2104.08378
- Deep Compression: https://arxiv.org/abs/1510.00149
- Lottery ticket: https://arxiv.org/abs/1803.03635
- Once-for-All: https://arxiv.org/abs/1908.09791
- EfficientNet: https://ar5iv.labs.arxiv.org/html/1905.11946
- MobileNets: https://ar5iv.labs.arxiv.org/html/1704.04861
- Hinton et al. distillation: https://ar5iv.labs.arxiv.org/html/1503.02531
- Visual Wake Words: https://arxiv.org/abs/1906.05721
- MLPerf Inference scenarios: https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc

Official docs
- LiteRT overview, Microcontrollers overview, delegates, quantization spec: https://developers.google.com/edge/litert, https://developers.google.com/edge/litert/microcontrollers/overview, https://developers.google.com/edge/litert/performance/delegates, https://developers.google.com/edge/litert/models/quantization_spec
- ExecuTorch backends overview: https://docs.pytorch.org/executorch/stable/backends-overview.html
- torch.onnx (dynamo exporter default since 2.9): https://docs.pytorch.org/docs/2.15/onnx.html
- CMSIS-NN: https://github.com/ARM-software/CMSIS-NN
- Vela: https://pypi.org/project/ethos-u-vela/
- Edge Impulse EON Compiler and MFCC block: https://docs.edgeimpulse.com/studio/projects/deployment/eon-compiler, https://docs.edgeimpulse.com/studio/projects/processing-blocks/blocks/audio-mfcc
- TFLM micro_speech: https://github.com/tensorflow/tflite-micro/tree/main/tensorflow/lite/micro/examples/micro_speech; Arduino port (Nano 33 BLE Sense): https://github.com/tensorflow/tflite-micro-arduino-examples/tree/main/examples/micro_speech

Practice links (each checked to load, HTTP 200): micrograd, nanoGPT, The Annotated Transformer, PyTorch "Learn the Basics" and pruning tutorials, MLPerf Tiny repository and KWS training folder, MIT 6.5940 Fall 2024 Lab 1–4 Colab links (taken from the course page), TensorFlow Model Optimization QAT guide, tinyMLx Colabs, Edge Impulse keyword-spotting and motion-recognition tutorials, TinyEngine, Once-for-All, ExecuTorch getting started.

---

# Embedded AI Engineering — tiers 6–8 (part 3)

Profession `embedded-ai`, tiers 6 (ml-systems, 750 cards), 7 (phd-core, "Quals", 500 cards) and 8 (research-frontier, "PhD", 250 cards). Companion file: `embedded-ai-3.json`. Research done 2026-11-24; every frontier fact is stated "as of 2026-11".

- **Budgets:** unchanged. 25 modules, 155 units, 1,500 cards. Every unit's kinds sum to its budget; every module's units sum to its budget.
- **Mix achieved** (concept / code / calculation / trade-off / landmark): tier 6 = 30 / 20 / 20 / 20 / 10 (exact); tier 7 = 30 / 5 / 20 / 25 / 20 (exact); tier 8 = 30 / 10 / 15.2 / 20 / 24.8 (38 and 62 cards; 37.5 and 62.5 cannot be hit exactly).
- **Kinds note:** the few `theorem`, `proof-idea` and `counterexample` cards (DRF-SC, stochastic-rounding unbiasedness, SC litmus counterexample, GPTQ/rotation/speculative-sampling proof ideas) are counted in the concept share.
- **Difficulty:** tier 6 in 7–8, tier 7 in 8–9, tier 8 in 9–10, never decreasing within a module.
- **Recurring threads** (named exactly in keyTerms where they come back with more depth):

| Thread | Units (in teaching order) |
|---|---|
| roofline model | cpu-performance/roofline-in-depth → gpus-parallel-programming/tensor-cores-and-tiled-gemm → accelerator-fundamentals/tpu-v1-case-study → dataflow-mapping/data-reuse-taxonomy, analytical-cost-models, mapping-transformers-prefill-decode → edge-npus/tops-vs-real-utilization → llm-compression/llm-quantization-landscape → on-device-llm-runtimes/prefill-decode-memory-wall |
| memory hierarchy | cpu-performance/tiling-and-locality → gpus-parallel-programming/memory-coalescing-and-shared-memory → accelerator-fundamentals/scratchpads-and-buffers → dataflow-mapping/analytical-cost-models → edge-npus/tops-vs-real-utilization → graduate-architecture/cache-misses-and-advanced-caches, dram-and-memory-controllers → on-device-llm-runtimes/flashattention-io-aware |
| number format | gpus-parallel-programming/tensor-cores-and-tiled-gemm → accelerator-fundamentals/processing-element-design → deployment-co-optimization/hardware-matched-int8-tosa → numerics-co-design/number-format-design-space, block-floating-point, ocp-mx-and-nvfp4 → llm-compression/llm-quantization-landscape → formats-new-silicon/microscaling-in-practice |
| attention | gpus-parallel-programming/triton-and-io-aware-kernels → dataflow-mapping/loop-nests-and-einsums, layer-fusion, mapping-transformers-prefill-decode → on-device-llm-runtimes/prefill-decode-memory-wall, kv-cache-management, flashattention-io-aware → efficient-generative-vision/efficient-vits-linear-attention, token-merging |

Required orderings are respected: accelerator-fundamentals → dataflow-mapping → sparse-accelerators and numerics-co-design; quantization-2 → numerics-co-design; computer-organization → graduate-architecture; ml-compilers → deployment-co-optimization; tier 8 builds on transformers, generative-ai-llms and quantization-1. The required capstone ("compile a model with TVM or ExecuTorch and map one conv layer in Timeloop") is in `dataflow-mapping` practice; "reproduce one paper's result" is in `research-practice` practice.

---

## Tier 6 — ML systems: compilers, runtimes, accelerators

### Rationale

Tier 6 turns deployment skills into systems engineering. It starts on the CPU and GPU, where every model ultimately falls back, then follows the software stack that produces kernels (framework internals → ML compilers → memory planning) before building accelerator design from first principles (why DSAs → dataflow and mapping) and landing on real NPUs, FPGAs and model partitioning. Code cards concentrate in the CPU, GPU, compiler and HLS modules; calculation cards in roofline, mapping and utilization units, so the roofline and memory-hierarchy threads deepen with each module.

### Coverage matrix

| Source topic | Covered by units |
|---|---|
| **Hennessy, Patterson & Kozyrakis, CA:AQA 7e** — ch. 1 quantitative design, Amdahl, power | cpu-performance/amdahl-and-scaling-laws, profiling-and-counters |
| H&P ch. 2 memory hierarchy design | cpu-performance/tiling-and-locality; advanced caches and DRAM → tier 7 graduate-architecture |
| H&P ch. 3 instruction-level parallelism | cpu-performance/profiling-and-counters (top-down analysis); full treatment → tier 7 graduate-architecture/out-of-order-and-rob, large-window-design, branch-prediction-and-predication |
| H&P ch. 4 vector, SIMD, GPU (incl. roofline); App. G vector processors | cpu-performance/roofline-in-depth, arm-simd-neon-helium, scalable-vectors-rvv-sme2; gpus-parallel-programming/simt-gpu-architecture |
| H&P ch. 5 thread-level parallelism | → tier 7 graduate-architecture (coherence, consistency, transactional memory) |
| H&P ch. 6 warehouse-scale systems | Out of scope for an embedded path (fleet scale); scale-out concepts → tier 7 hw-algorithm-co-design/scale-out-parallelism-and-collectives |
| H&P ch. 7 domain-specific architectures (TPU) | accelerator-fundamentals/why-domain-specific-accelerators, tpu-v1-case-study, accelerator-hw-sw-interface |
| H&P App. B (memory review), App. C (pipelining) | computer-organization (tier 1) prerequisite; tier 7 graduate-architecture/cache-misses-and-advanced-caches |
| **CS:APP 3e** — §1.9.1 Amdahl's law | cpu-performance/amdahl-and-scaling-laws |
| CS:APP §5.7–5.9 modern processors, loop unrolling, multiple accumulators; §5.12 memory performance | cpu-performance/profiling-and-counters, anatomy-of-fast-gemm, tiling-and-locality |
| CS:APP §5.14 profiling; web aside OPT:SIMD | cpu-performance/profiling-and-counters, arm-simd-neon-helium |
| CS:APP §6.2, §6.6.1–6.6.3 locality, memory mountain, loop rearrangement; web aside MEM:BLOCKING | cpu-performance/tiling-and-locality |
| **PMPP 4e** — ch. 1–3 data-parallel computing, grids | gpus-parallel-programming/cuda-programming-model |
| PMPP ch. 4 compute architecture and scheduling | gpus-parallel-programming/simt-gpu-architecture, occupancy-and-latency-hiding |
| PMPP ch. 5–6 memory architecture, data locality, performance considerations | gpus-parallel-programming/memory-coalescing-and-shared-memory, occupancy-and-latency-hiding |
| PMPP ch. 7 convolution (constant memory, caching) | Partial: gpus-parallel-programming/memory-coalescing-and-shared-memory; convolution as GEMM in cpu-performance/tiling-and-locality and tensor-cores-and-tiled-gemm |
| PMPP ch. 10 reduction, ch. 11 scan | gpus-parallel-programming/reduction-and-scan-patterns |
| PMPP ch. 14 sparse matrix computation | → tier 7 sparse-accelerators/sparsity-sources-and-formats |
| PMPP ch. 16 deep learning | gpus-parallel-programming/tensor-cores-and-tiled-gemm |
| PMPP ch. 19 computational thinking | Partial: cpu-performance/amdahl-and-scaling-laws |
| PMPP ch. 20 CUDA streams and clusters | gpus-parallel-programming/cuda-programming-model; memory-planning/double-buffering-and-dma |
| PMPP ch. 8 stencil, 9 histogram, 12 merge, 13 sorting, 15 graph traversal, 17 MRI, 18 electrostatic map, 21 dynamic parallelism, 22–23 outlook | Deliberately excluded: not on the ML-inference critical path; the parallel patterns they teach are represented by reduction/scan and tiled GEMM |
| **CMU DLSys** — L4–5 automatic differentiation | framework-internals/autograd-engine |
| DLSys L7 NN library abstractions; L9 library implementation | framework-internals/eager-vs-graph-capture, tensors-and-operator-dispatch |
| DLSys L10 hardware acceleration for linear algebra; L12–13 GPUs and implementation | cpu-performance/tiling-and-locality, anatomy-of-fast-gemm; gpus-parallel-programming; framework-internals/memory-allocators |
| DLSys L23 model deployment | ml-compilers/why-ml-compilers-ir-levels, iree-and-executorch-aot |
| DLSys L2–3, 6, 8, 11, 14–22 (ML refresher, optimization, CNN/RNN/transformer/generative models, training large models) | Earlier tiers (ml-fundamentals, training-deep-networks, cnns-vision, sequence-audio-models, transformers, generative-ai-llms); training large models → tier 7 scale-out unit |
| **mlsysbook.ai Vol. I** — ch. 7 ML frameworks | framework-internals (all units) |
| Vol. I ch. 10 model compression | Earlier tiers (pruning-sparsity, quantization-1/2); deployment-co-optimization/hardware-matched-int8-tosa |
| Vol. I ch. 11 hardware acceleration | edge-npus/npu-integration-and-fallback; deployment-co-optimization/partitioning-and-delegation, fallback-cost-analysis |
| Vol. I ch. 12 benchmarking | deployment-co-optimization/co-optimization-loop (benchmarking, tier 5, is prerequisite) |
| Vol. I ch. 13 model serving | → tier 8 on-device-llm-runtimes |
| Vol. I ch. 1–6, 8–9, 14–15 | Earlier tiers |
| **mlc.ai course** — ch. 1 introduction; ch. 2 tensor program abstraction | ml-compilers/why-ml-compilers-ir-levels, tensor-programs-tensorir |
| mlc.ai ch. 3 end-to-end execution; ch. 5 framework integration | ml-compilers/end-to-end-compile-and-verify |
| mlc.ai ch. 4 automatic program optimization | ml-compilers/autotuning-autotvm-ansor |
| mlc.ai ch. 6 GPU and hardware acceleration | ml-compilers/tensor-programs-tensorir (thread binding, tensorize) |
| mlc.ai ch. 7 computational graph optimization | ml-compilers/graph-optimizations-and-fusion |
| **TVM (OSDI 2018)** — graph optimizations, fusion, layouts, schedules, learned cost model | ml-compilers/graph-optimizations-and-fusion, data-layouts, halide-algorithm-schedule, autotuning-autotvm-ansor |
| **MLIR (CGO 2021)** — dialects, regions, progressive lowering | ml-compilers/mlir-linalg-tosa |
| Module topics: IR levels; fusion; layouts; Halide schedules; TVM and Ansor; MLIR linalg and TOSA; XLA; IREE | ml-compilers units 1–10 (one unit each; XLA → xla-and-stablehlo; IREE → iree-and-executorch-aot) |
| **MIT 6.5940 L11** TinyEngine and parallel processing (loop reordering, tiling, unrolling, SIMD, im2col, in-place depthwise, Winograd) | cpu-performance/tiling-and-locality, arm-simd-neon-helium; memory-planning/operator-reordering-and-in-place, patch-based-inference |
| **MCUNetV2** — patch-based inference, receptive-field redistribution | memory-planning/patch-based-inference |
| Module topics: tensor liveness; arena packing; operator reordering; in-place ops; double buffering | memory-planning units 1–5 |
| **Sze, Chen, Yang & Emer** — ch. 1–2 introduction, DNN overview | Earlier tiers; dataflow-mapping/loop-nests-and-einsums |
| Sze ch. 3 metrics | accelerator-fundamentals/accelerator-metrics; edge-npus/tops-vs-real-utilization |
| Sze ch. 4 kernel computation (Toeplitz/im2col, tiling, Winograd/FFT transforms) | **Gap closed:** cpu-performance/tiling-and-locality now teaches Winograd F(2×2,3×3) (Lavin & Gray); anatomy-of-fast-gemm. FFT and Strassen deliberately left out (rarely used on devices) |
| Sze ch. 5 accelerator design (dataflows, memory hierarchy, NoC) | accelerator-fundamentals/systolic-arrays, scratchpads-and-buffers, on-chip-networks; dataflow-mapping/data-reuse-taxonomy, stationary-dataflows |
| Sze ch. 6 operation mapping | dataflow-mapping/mapping-representation, mapping-search, timeloop-and-accelforge-hands-on |
| Sze ch. 7 reduced precision | accelerator-fundamentals/processing-element-design; → tier 7 numerics-co-design |
| Sze ch. 8 sparsity; ch. 9 efficient models; ch. 10 advanced technologies | → tier 7 sparse-accelerators; efficient-architectures-nas (tier 5) and tier 7 hw-algorithm-co-design; tier 7 emerging-technologies |
| **Jouppi et al., ISCA 2017** (TPU v1) | accelerator-fundamentals/tpu-v1-case-study, accelerator-hw-sw-interface |
| Module topics: why DSAs; systolic arrays; PE design; scratchpads; on-chip networks | accelerator-fundamentals units 1–8 |
| **MIT 6.5930/1 (Spring 2026 syllabus and reading list)** — DNN components, popular models, evaluation and training | Earlier tiers (neural-network-basics, cnns-vision, training-deep-networks) |
| 6.5930 kernel computation: CPU, vectorization, memory | cpu-performance/profiling-and-counters, arm-simd-neon-helium, scalable-vectors-rvv-sme2, tiling-and-locality |
| 6.5930 storage technology and transforms | cpu-performance/tiling-and-locality (Winograd added) |
| 6.5930 GPUs | gpus-parallel-programming (all units) |
| 6.5930 accelerator architecture | accelerator-fundamentals (all units) |
| 6.5930 dataflows 1–2 | dataflow-mapping/data-reuse-taxonomy, stationary-dataflows |
| 6.5930 L03 mapping: dataflow and partitioning; L05 mapping; L06 mapping-partitioning; convolutional mappings | dataflow-mapping/mapping-representation, mapping-search |
| 6.5930 L04 Einsums + transformers | dataflow-mapping/loop-nests-and-einsums, mapping-transformers-prefill-decode |
| 6.5930 L06–L07 fusion | dataflow-mapping/layer-fusion |
| 6.5930 L13 computing data movement in ISL | dataflow-mapping/analytical-cost-models |
| 6.5930 recitations: AccelForge tutorial, writing mappings in Python, looptree | dataflow-mapping/timeloop-and-accelforge-hands-on, loop-nests-and-einsums, layer-fusion |
| 6.5930 L07–L10 sparsity and sparse architectures; L11 advanced technologies; L12 numeric precision | → tier 7 (sparse-accelerators, emerging-technologies, numerics-co-design) |
| 6.5930 labs 0–5 and project | Capstone practice in dataflow-mapping; project skills → tier 7 research-practice |
| Module topics (dataflow): loop nests and Einsums; data reuse; WS/OS/RS dataflows; mapping search; Timeloop | dataflow-mapping units 1–9 |
| **Arm and ST docs** — Ethos-U55/U65/U85, Vela, Corstone-320 | edge-npus/arm-ethos-u-family, npu-model-preparation |
| STM32N6 Neural-ART | edge-npus/stm32n6-neural-art |
| Hexagon, Apple Neural Engine | edge-npus/mobile-soc-npus |
| Edge TPU | edge-npus/edge-tpu-and-int8-only |
| TOPS vs real utilization | edge-npus/tops-vs-real-utilization |
| **Kastner, Matai & Neuendorffer** — ch. 1 HLS, FPGA architecture, design process | fpga-acceleration/fpga-fabric-for-ml, hls-fundamentals |
| Kastner ch. 2 FIR filters (chaining, hoisting, fission, unrolling, pipelining, bit widths) | fpga-acceleration/hls-fundamentals, hls-optimization-patterns |
| Kastner ch. 7 matrix multiplication (block matmul) | fpga-acceleration/hls-optimization-patterns |
| Kastner ch. 12 binary neural networks | fpga-acceleration/finn-quantized-dataflow |
| Kastner ch. 6 sparse matrix–vector multiply | → tier 7 sparse-accelerators/sparsity-sources-and-formats (formats); HLS version not taught |
| Kastner ch. 3 CORDIC, 4 DFT, 5 FFT, 8 prefix sum and histogram, 9 video, 10 sorting, 11 Huffman | Deliberately excluded: non-ML kernels; their HLS techniques are already taught through ch. 2 and ch. 7 |
| Module topics (FPGA): HLS pragmas; streaming vs overlay; FINN; hls4ml; Vitis AI | fpga-acceleration units 2–7 |
| **Stanford CS217 (Winter 2026)** — introduction (energy problem, roofline, attention) | accelerator-fundamentals/why-domain-specific-accelerators; cpu-performance/roofline-in-depth |
| CS217 high-level synthesis; Lab 0 HLS and AWS FPGA prototyping | fpga-acceleration/hls-fundamentals, hls-optimization-patterns |
| CS217 data parallelism and efficiency metrics | accelerator-fundamentals/accelerator-metrics; cpu-performance/amdahl-and-scaling-laws |
| CS217 quantization (MSFP, shared microexponents, NVFP4, BlockDialect readings) | → tier 7 numerics-co-design/block-floating-point, ocp-mx-and-nvfp4 (BlockDialect only as an instance of per-block mixed formats) |
| CS217 systolic arrays (Kung; TPU v1; TPU v4; MAERI) | accelerator-fundamentals/systolic-arrays, tpu-v1-case-study, on-chip-networks; TPU v4 → tier 7 co-design-case-studies |
| CS217 vector and scalar units; Lab 1 SIMD PE; Lab 2 vector processing unit | **Gap closed:** accelerator-fundamentals/processing-element-design now covers vector/scalar units beside the MAC array; cpu-performance/arm-simd-neon-helium |
| CS217 memory systems (interposer NoCs, SIGMA, GPU interconnects); Lab 3 global buffer with near-memory processor | accelerator-fundamentals/scratchpads-and-buffers; tier 7 emerging-technologies/chiplets-and-packaging, processing-in-memory; sparse-accelerators/load-balancing (SIGMA) |
| CS217 interconnects and NoC; Lab 4 top level with interconnect fabric | accelerator-fundamentals/on-chip-networks |
| CS217 compilers and software stack 1–2 (MAESTRO, FlashAttention, PagedAttention, PyTorch 2) | dataflow-mapping/mapping-representation; gpus-parallel-programming/triton-and-io-aware-kernels; framework-internals/eager-vs-graph-capture; ml-compilers; PagedAttention → tier 8 kv-cache-management |
| CS217 HW1 analytical LLM performance model; HW3 kernel fusion | dataflow-mapping/mapping-transformers-prefill-decode; deployment-co-optimization/co-optimization-loop; ml-compilers/graph-optimizations-and-fusion |
| CS217 HW2 MXFP prologue vs epilogue cost | → tier 8 formats-new-silicon/microscaling-in-practice |
| CS217 GPU architectures; NVIDIA GPU architecture for AI (guest) | gpus-parallel-programming (all units) |
| CS217 reconfigurable dataflow architectures (Plasticine); SambaNova RDA (guest) | **Gap closed:** fpga-acceleration/streaming-vs-overlay now places CGRAs (Plasticine, SambaNova RDU) between FPGAs and ASICs |
| CS217 memory-centric computing 1–2 | → tier 7 emerging-technologies/processing-in-memory, analog-in-memory-compute |
| CS217 AWS Inferentia and Trainium (guest) | Deliberately excluded: datacenter product talk; its DSA lessons are in accelerator-fundamentals |
| CS217 project proposals, poster session | → tier 7 research-practice |
| **Berkeley EE 290-2** — DL basics and frameworks | Earlier tiers; framework-internals |
| EE 290-2 hardware accelerators | accelerator-fundamentals; dataflow-mapping |
| EE 290-2 co-optimizing algorithms and hardware | deployment-co-optimization; → tier 7 hw-algorithm-co-design |
| EE 290-2 prototypes on FPGAs and ASICs | fpga-acceleration; → tier 7 modeling-evaluation/chipyard-and-gemmini |
| EE 290-2 (Sp21) dataflow lecture (cuDNN reading); systolic arrays and tensorization guest lecture | dataflow-mapping/stationary-dataflows; accelerator-fundamentals/systolic-arrays; ml-compilers/tensor-programs-tensorir (tensorize) |
| EE 290-2 (Sp21) quantization guest lecture | quantization-1/2 (tier 5); → tier 7 numerics-co-design |
| EE 290-2 Chipyard/FireSim labs, training/inference support, seminar and project | → tier 7 modeling-evaluation, on-device-training, research-practice |
| **Georgia Tech ECE/CS 8803 HML (Spring 2025)** — DNN overview | Earlier tiers |
| HML single-chip platforms and architectures | accelerator-fundamentals; dataflow-mapping; edge-npus |
| HML HW–SW co-design for efficiency | deployment-co-optimization; → tier 7 hw-algorithm-co-design |
| HML development resources (toolchains) | Practice links (SCALE-Sim, Timeloop/AccelForge, TVM, ExecuTorch, Vela) |
| HML benchmarking metrics and design considerations | accelerator-fundamentals/accelerator-metrics; edge-npus/tops-vs-real-utilization; → tier 8 benchmarks-open-problems |
| HML Lab 0 running models on CPU and GPU | cpu-performance; gpus-parallel-programming |
| HML Lab 1 DNN operator analysis | dataflow-mapping/loop-nests-and-einsums; cpu-performance/roofline-in-depth |
| HML Lab 2 accelerator DSE (SCALE-Sim) | accelerator-fundamentals/systolic-arrays; → tier 7 hw-algorithm-co-design/design-space-exploration |
| HML distributed ML, Labs 3–5, emerging technologies, paper critiques | → tier 7 (scale-out-parallelism-and-collectives, emerging-technologies, research-practice) |
| Module topics (deployment): graph partitioning and fallback cost; hardware-matched int8 (TOSA); latency predictors | deployment-co-optimization units 1–4; unit 5 closes the loop |

---

## Tier 7 — Advanced / PhD core ("Quals")

### Rationale

Tier 7 is shaped by what qualifying exams ask and what accelerator PhD courses teach beyond the basics. The six questions of the Wisconsin Fall 2020 architecture qualifier map one-to-one onto graduate-architecture units, and the sparse, numerics, co-design, emerging-technology and evaluation modules follow MIT 6.5930, Stanford CS217, Georgia Tech HML and Berkeley EE 290-2. Landmarks (20%) and trade-offs (25%) carry more weight than in tier 6 because quals reward knowing the canonical papers and defending design choices; research practice closes the tier.

### Coverage matrix

| Source topic | Covered by units |
|---|---|
| **H&P 7e** — ch. 2 advanced caches, DRAM; App. B | graduate-architecture/cache-misses-and-advanced-caches, dram-and-memory-controllers |
| H&P ch. 3 ILP: OoO, renaming, ROB, branch prediction | graduate-architecture/out-of-order-and-rob, large-window-design, branch-prediction-and-predication |
| H&P ch. 4 GPUs (SM design, scaling) | graduate-architecture/dark-silicon-and-gpu-scaling (tier 6 gpus-parallel-programming is prerequisite) |
| H&P ch. 5 TLP: coherence, consistency, synchronization | graduate-architecture/cache-coherence-protocols, memory-consistency-models, transactional-memory-and-sle |
| H&P ch. 1 power and dark silicon | graduate-architecture/dark-silicon-and-gpu-scaling |
| **Nagarajan, Sorin, Hill & Wood, Primer** — coherence (snooping, directory) | graduate-architecture/cache-coherence-protocols |
| Primer — consistency (SC, TSO, relaxed, DRF-SC) | graduate-architecture/memory-consistency-models |
| **Wisconsin qualifier F20** Q1 data caches (3C + coherence miss, reduction techniques) | graduate-architecture/cache-misses-and-advanced-caches |
| Q2 predication vs dynamic branch prediction | graduate-architecture/branch-prediction-and-predication |
| Q3 GPU SM features; GPGPU scaling challenges | gpus-parallel-programming/simt-gpu-architecture (tier 6); graduate-architecture/dark-silicon-and-gpu-scaling |
| Q4 snooping power, directories, dropping coherence | graduate-architecture/cache-coherence-protocols |
| Q5 speculative lock elision, best-effort HTM | graduate-architecture/transactional-memory-and-sle (added for this question) |
| Q6 8-issue, ~1000-instruction-window OoO design | graduate-architecture/large-window-design |
| **Georgia Tech computer architecture body of knowledge** — CS 6290 High-Performance Computer Architecture (required) | graduate-architecture (all units); tier 6 cpu-performance |
| CS 7290 Advanced Microarchitecture | graduate-architecture/out-of-order-and-rob, large-window-design, branch-prediction-and-predication |
| CS 7292 Reliability and Security in Computer Architecture | trustworthy-embedded-ai/fault-injection-and-bit-flips, side-channels-and-extraction, trusted-execution-environments |
| CS 6241 Compiler Design; CS 6245 Parallelizing Compilers | Partial: tier 6 ml-compilers (loop transformations, scheduling, autotuning, MLIR, polyhedral/ISL access counting). Classical back-end topics (register allocation, SSA construction) deliberately left to general CS; these are electives in the GT list |
| ECE 6101 Parallel and Distributed Computer Architecture | graduate-architecture/cache-coherence-protocols, memory-consistency-models; hw-algorithm-co-design/scale-out-parallelism-and-collectives |
| Oral exam: present own research and an external paper | research-practice/three-pass-reading, venues-and-peer-review |
| **MIT 6.5930** L07 sparsity; L08–L10 sparse architectures 1–3 | sparse-accelerators (all units) |
| 6.5930 L12 numeric precision | numerics-co-design/number-format-design-space, block-floating-point, accumulator-width |
| 6.5930 L11 advanced technologies (reading list: DaDianNao, Neurocube, TETRIS) | emerging-technologies/analog-in-memory-compute, processing-in-memory |
| **Sze et al.** §8.1 sparsity; §8.2 formats; §8.3 sparse architectures | sparse-accelerators/sparsity-sources-and-formats, gating-skipping-intersection, eie-and-scnn, load-balancing |
| Sze ch. 7 reduced precision | numerics-co-design (all units) |
| Sze ch. 9 efficient DNN models and co-design | hw-algorithm-co-design/joint-nas-accelerator-search |
| Sze ch. 10 advanced technologies | emerging-technologies (all units) |
| Module topics (sparse): formats; EIE; SCNN; 2:4 tensor cores; load balancing; Sparseloop | sparse-accelerators units 1–6 |
| **Rouhani et al. 2023, MX paper** and **OCP MX v1.0 spec** (§5 formats, §6 operations) | numerics-co-design/ocp-mx-and-nvfp4 |
| Module topics (numerics): BFP; OCP MX; NVFP4; accumulator width; stochastic rounding; outliers | numerics-co-design units 1–6 |
| **Harvard CS249r / mlsysbook** co-design material; Sze ch. 3 | hw-algorithm-co-design/pareto-analysis, design-space-exploration |
| Module topics (co-design): joint NAS and accelerator search; DSE; learned cost models; Pareto analysis | hw-algorithm-co-design units 1–4 |
| **GT HML** distributed ML; Lab 3 distributed execution (Megatron-LM); Lab 4 ASTRA-sim DSE; Lab 5 topology-aware collectives (TACOS) | **Gap closed:** hw-algorithm-co-design/scale-out-parallelism-and-collectives (concepts and cost formulas; hands-on multi-GPU training deliberately excluded) |
| GT HML emerging technologies; paper critiques | emerging-technologies; research-practice |
| **MIT 6.5940 Fall 2024 L21** on-device training and transfer learning | on-device-training/backprop-memory-cost, parameter-efficient-updates, sparse-update-and-qas, continual-and-personalized-learning |
| MIT 6.5940 L19–L20 (2024) / L19, L22 (2026) distributed training | hw-algorithm-co-design/scale-out-parallelism-and-collectives |
| **PockEngine (MICRO 2023)** | on-device-training/training-engines-pockengine |
| Module topics (training): backprop memory; sparse and bias-only updates; TinyTL; 256 KB training; PockEngine; federated learning | on-device-training units 1–6; unit 7 integrates |
| Module topics (emerging): analog in-memory compute; PIM; neuromorphic; chiplets; approximate computing | emerging-technologies units 1–5; unit 6 evaluates claims |
| **mlsysbook.ai Vol. II** (dev edition, 2026) — ch. 1 introduction | Framing only |
| Vol. II ch. 2 compute infrastructure; ch. 3 network fabrics | Partial: hw-algorithm-co-design/scale-out-parallelism-and-collectives; accelerator-fundamentals/on-chip-networks (tier 6); datacenter racks out of scope |
| Vol. II ch. 4 data storage; ch. 8 fleet orchestration; ch. 12 ML operations at scale | Deliberately excluded: fleet-scale operations, not part of an embedded path (deployment workflows were taught in tinyml-workflow and edge-soc-deployment) |
| Vol. II ch. 5 collective communication; ch. 6 distributed training | hw-algorithm-co-design/scale-out-parallelism-and-collectives; on-device-training/federated-learning |
| Vol. II ch. 7 fault tolerance | Partial: trustworthy-embedded-ai/fault-injection-and-bit-flips (hardware faults); checkpoint/restart of fleets out of scope |
| Vol. II ch. 9 fleet efficiency | modeling-evaluation/power-and-energy-estimation; trustworthy-embedded-ai/sustainability-and-carbon |
| Vol. II ch. 10 serving at scale; Inference Foundations appendix | → tier 8 on-device-llm-runtimes |
| Vol. II ch. 11 edge intelligence | on-device-training/federated-learning, on-device-training-design |
| Vol. II ch. 13 security and privacy | trustworthy-embedded-ai/side-channels-and-extraction, trusted-execution-environments, privacy-on-device |
| Vol. II ch. 14 robust AI | trustworthy-embedded-ai/adversarial-examples, fault-injection-and-bit-flips |
| Vol. II ch. 15 sustainable AI | trustworthy-embedded-ai/sustainability-and-carbon |
| Vol. II ch. 16 responsible AI | **Gap closed:** trustworthy-embedded-ai/privacy-on-device now covers on-device responsible-AI duties (fairness audits, transparency, safe update/rollback) |
| Vol. II ch. 17 conclusion; appendices (D·A·M, C³ taxonomy, fleet/communication/reliability foundations, system assumptions) | Framing; single-machine (D·A·M) foundations are tier 6 roofline and memory-hierarchy units |
| Module topics (trust): adversarial and fault attacks; bit flips; side channels; TEEs; privacy; sustainability | trustworthy-embedded-ai units 1–6 |
| **Berkeley EE 290-2** — Chipyard/FireSim setup; labs implementing and optimizing an accelerator; ResNet-50 on FireSim | modeling-evaluation/simulation-methodology-spectrum, chipyard-and-gemmini |
| EE 290-2 training and inference support | on-device-training |
| EE 290-2 seminar-style paper presentations; class research project | research-practice (all units) |
| **Genc et al., Gemmini (DAC 2021)** | modeling-evaluation/chipyard-and-gemmini |
| Module topics (evaluation): analytical vs cycle-level; gem5; Chipyard and Gemmini; power estimation; statistical rigour | modeling-evaluation units 1–5 |
| **Keshav 2007** — three passes, five Cs, literature survey | research-practice/three-pass-reading |
| Module topics (research): venues; reviewing; artifact evaluation; landmark-paper timeline | research-practice/venues-and-peer-review, artifact-evaluation-and-reproduction, landmark-paper-timeline |

---

## Tier 8 — Research frontier ("PhD")

### Rationale

Tier 8 is built only from items verified against a primary source (paper, specification, project documentation or the vendor's own announcement) as of 2026-11, with each item's status listed below so card writers label vendor claims as claims. It is organized around the decode memory wall that dominates on-device generative AI: how models are compressed, the runtimes that execute them, small models designed for phones, and the formats and silicon that make low-bit inference cheap, ending with the benchmarks used to compare them and the open problems. Landmarks are about a quarter of the cards because this part of the field moves by named systems and dated releases.

### Coverage matrix

| Source topic | Covered by units |
|---|---|
| **MIT 6.5940 Fall 2026, Chapter II** — L12 Transformer and LLM | Earlier tiers (transformers, generative-ai-llms) |
| L13 LLM quantization and deployment | llm-compression (all units); on-device-llm-runtimes/prefill-decode-memory-wall, compiled-and-framework-runtimes |
| L14 LLM post-training | Partial: parameter-efficient fine-tuning (LoRA/QLoRA, BitFit) in tier 7 on-device-training/parameter-efficient-updates and small-on-device-models/llama-3-2-1b-3b; SFT, RLHF and DPO assumed from generative-ai-llms and not repeated |
| L15 long-context LLM | **Gap closed:** on-device-llm-runtimes/kv-cache-management now covers attention sinks (StreamingLLM) besides sliding windows and KV compression; flashattention-io-aware |
| L16 vision transformer | efficient-generative-vision/efficient-vits-linear-attention, token-merging |
| L17–L18 diffusion model I–II | efficient-generative-vision/few-step-diffusion, svdquant-4bit-diffusion |
| L19, L22 distributed training (outside Chapter II) | → tier 7 hw-algorithm-co-design/scale-out-parallelism-and-collectives |
| Lab 5 LLM deployment on laptop | Practice links (llama.cpp, MLC LLM, ExecuTorch LLM) |
| Module topics (compression): GPTQ; AWQ; SmoothQuant; QServe (W4A8KV4); QuaRot and SpinQuant; BitNet b1.58 | llm-compression units 2–7 (unit 1 frames the landscape) |
| Module topics (runtimes): prefill vs decode; speculative decoding; FlashAttention; llama.cpp and GGUF; MLC LLM; LiteRT-LM; ExecuTorch 1.0; bitnet.cpp | on-device-llm-runtimes/prefill-decode-memory-wall, speculative-decoding, flashattention-io-aware, llama-cpp-and-gguf, compiled-and-framework-runtimes (MLC LLM, LiteRT-LM, ExecuTorch 1.0), bitnet-cpp-lut-kernels; KV cache → kv-cache-management |
| Module topics (small models): Llama 3.2 1B/3B; Gemma 3n (MatFormer, per-layer embeddings); Apple ~3B on-device model (2-bit QAT) | small-on-device-models units 1–3; unit 4 compares recipes |
| **Apple 2025 foundation models report** — §2.1 KV-cache sharing; §6 optimizations (2-bit QAT, 4-bit embeddings, 8-bit KV, ASTC 3.56 bpw, quality-recovery adapters); §8 Table 3 | small-on-device-models/apple-on-device-model; on-device-llm-runtimes/kv-cache-management |
| **Gemma 3n developer guide** — MatFormer and Mix-n-Match; per-layer embeddings; KV-cache sharing; MobileNet-V5; USM audio encoder | small-on-device-models/gemma-3n-matformer-ple |
| Module topics (formats/silicon): OCP MX v1.0; NVFP4; Arm SME2 and KleidiAI; Ethos-U85 transformer support; MCU NPUs | formats-new-silicon/microscaling-in-practice, sme2-and-kleidiai, ethos-u85-transformers, mcu-npu-landscape |
| **MX paper** (block-scaled formats, sub-8-bit training) and **NVIDIA NVFP4 blog** (16-element blocks, E4M3 + FP32 scales, accuracy and memory claims) | formats-new-silicon/microscaling-in-practice (definitions in tier 7 numerics-co-design/ocp-mx-and-nvfp4) |
| Module topics (generative vision): few-step diffusion; SVDQuant; efficient ViTs; token merging | efficient-generative-vision units 1–4 |
| **MLCommons** — MLPerf Inference edge results (v5.1, v6.0, v6.1) | benchmarks-open-problems/mlperf-inference-edge |
| MLPerf Tiny v1.3 (tasks, quality targets, energy) | benchmarks-open-problems/mlperf-tiny-and-client; formats-new-silicon/mcu-npu-landscape |
| MLPerf Client (v1.0, v1.5, v2.0) | benchmarks-open-problems/mlperf-tiny-and-client |
| Open problems: personalization; decode memory wall | benchmarks-open-problems/decode-memory-wall, open-problems-and-ecosystem |
| **mlsysbook.ai Vol. II** ch. 10 serving at scale (batching, KV cache, speculative decoding) | on-device-llm-runtimes/prefill-decode-memory-wall, kv-cache-management, speculative-decoding |

### Frontier verification (as of 2026-11)

Status: **peer-reviewed** = published at the named venue (confirmed on proceedings or arXiv venue note); **preprint** = arXiv or technical report only; **vendor claim** = the company's or organization's own announcement or docs; **spec** = industry specification.

| Item | Authors / vendor | Date | Status | URL | As of |
|---|---|---|---|---|---|
| ExecuTorch 1.0 general availability (XNNPACK+KleidiAI, Core ML, Qualcomm, Ethos-U, Vulkan production-ready; new NXP eIQ Neutron, Samsung Exynos, OpenVINO, Arm VGF backends) | PyTorch / Meta and partners | 22 Oct 2025 (page updated 24 Oct 2025) | vendor claim | https://pytorch.org/blog/introducing-executorch-1-0/ | 2026-11 |
| TensorFlow Lite renamed LiteRT (.tflite format unchanged) | Google AI Edge Team | 4 Sep 2024 | vendor claim | https://developers.googleblog.com/en/tensorflow-lite-is-now-litert/ | 2026-11 |
| LiteRT-LM (C++ LLM framework on LiteRT; .litertlm; GPU/NPU; latest release v0.20.0 when checked) | Google AI Edge | README checked 2026-11 | vendor docs | https://github.com/google-ai-edge/LiteRT-LM | 2026-11 |
| Arm Ethos-U85 (128–2048 MACs/cycle, 256 GOPS–4 TOPS at 1 GHz, transformer ops, 2:4 sparsity, Corstone-320) | Arm (P. Beeraka) | 9 Apr 2024 | vendor claim | https://newsroom.arm.com/blog/ethos-u85 | 2026-11 |
| STM32N6 (800 MHz Cortex-M55, Neural-ART ~300 MACs, up to 600 GOPS, 4.2 MB RAM) | STMicroelectronics | 10 Dec 2024 | vendor claim | https://newsroom.st.com/media-center/press-item.html/p4665.html | 2026-11 |
| OCP Microscaling (MX) v1.0 (k = 32, E8M0 scale; MXFP8/6/4, MXINT8) | Rouhani et al.; AMD, Arm, Intel, Meta, Microsoft, NVIDIA, Qualcomm | Sep 2023 (version table 7 Sep 2023) | spec | https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf | 2026-11 |
| Microscaling Data Formats for Deep Learning | Rouhani et al. (33 authors) | Oct 2023 | preprint (arXiv:2310.10537) | https://arxiv.org/abs/2310.10537 | 2026-11 |
| NVFP4 (16-value E2M1 blocks, FP8 E4M3 scale + FP32 tensor scale, ~4.5 bits) | NVIDIA (Alvarez, Almog, Chung, Layton, Stosic, Krashinsky, Aubrey) | 24 Jun 2025 | vendor claim | https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/ | 2026-11 |
| GGUF format (version 3; quant types incl. TQ1_0/TQ2_0, MXFP4, NVFP4) and llama.cpp | ggml-org | living docs, checked 2026-11 | project docs | https://github.com/ggml-org/ggml/blob/master/docs/gguf.md ; https://github.com/ggml-org/llama.cpp | 2026-11 |
| MLC LLM (TVM compile flow, MLCEngine, WebLLM) | MLC LLM project | docs checked 2026-11 | project docs | https://llm.mlc.ai/docs/get_started/introduction.html | 2026-11 |
| bitnet.cpp (v1.0; I2_S, TL1, TL2 kernels; GPU kernel May 2025; CPU speed/energy figures) | Microsoft | 17 Oct 2024; GPU 20 May 2025 | project docs / vendor claim | https://github.com/microsoft/BitNet | 2026-11 |
| 1-bit AI Infra: Part 1.1 (bitnet.cpp report); Bitnet.cpp: Efficient Edge Inference for Ternary LLMs | Wang, Zhou et al. (Microsoft) | Oct 2024; Feb 2025 | preprints (arXiv:2410.16144; 2502.11880) | https://arxiv.org/abs/2410.16144 ; https://arxiv.org/abs/2502.11880 | 2026-11 |
| BitNet b1.58 (ternary weights) | Ma, Wang et al. (Microsoft Research) | 27 Feb 2024 | preprint (arXiv:2402.17764) | https://arxiv.org/abs/2402.17764 | 2026-11 |
| BitNet b1.58 2B4T (absmean ternary weights, 8-bit absmax activations, 0.4 GB, 29 ms CPU TPOT) | Ma, Wang et al. (Microsoft Research) | Apr 2025 | preprint / technical report (arXiv:2504.12285) | https://arxiv.org/html/2504.12285 | 2026-11 |
| GPTQ | Frantar, Ashkboos, Hoefler, Alistarh | ICLR 2023 | peer-reviewed | https://arxiv.org/abs/2210.17323 | 2026-11 |
| AWQ (MLSys 2024 Best Paper) | Lin, Tang, Tang, Yang, Chen, Wang, Xiao, Dang, Gan, Han | MLSys 2024 | peer-reviewed | https://arxiv.org/abs/2306.00978 | 2026-11 |
| SmoothQuant | Xiao, Lin, Seznec, Wu, Demouth, Han | ICML 2023 | peer-reviewed | https://arxiv.org/abs/2211.10438 | 2026-11 |
| QServe (QoQ, W4A8KV4) | Lin, Tang, Yang, Zhang, Xiao, Gan, Han | MLSys 2025 | peer-reviewed | https://arxiv.org/abs/2405.04532 | 2026-11 |
| QuaRot | Ashkboos et al. | NeurIPS 2024 | peer-reviewed | https://proceedings.neurips.cc/paper_files/paper/2024/hash/b5b939436789f76f08b9d0da5e81af7c-Abstract.html | 2026-11 |
| SpinQuant (learned rotations, Cayley SGD) | Liu et al. (Meta) | ICLR 2025 | peer-reviewed | https://arxiv.org/abs/2405.16406 | 2026-11 |
| SVDQuant + Nunchaku | Li, Lin, Zhang, Cai, Li, Guo, Xie, Meng, Zhu, Han | ICLR 2025 (spotlight) | peer-reviewed | https://arxiv.org/abs/2411.05007 | 2026-11 |
| FlashAttention | Dao, Fu, Ermon, Rudra, Ré | NeurIPS 2022 | peer-reviewed | https://proceedings.neurips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html | 2026-11 |
| FlashAttention-2 | Dao | Jul 2023 | preprint as cited (venue not re-checked) | https://arxiv.org/abs/2307.08691 | 2026-11 |
| Speculative decoding | Leviathan, Kalman, Matias | ICML 2023 (oral) | peer-reviewed | https://arxiv.org/abs/2211.17192 | 2026-11 |
| Speculative sampling | Chen, Borgeaud et al. (DeepMind) | Feb 2023 | preprint (arXiv:2302.01318) | https://arxiv.org/abs/2302.01318 | 2026-11 |
| PagedAttention / vLLM | Kwon et al. | SOSP 2023 | peer-reviewed | https://arxiv.org/abs/2309.06180 | 2026-11 |
| StreamingLLM (attention sinks) | Xiao, Tian, Chen et al. | ICLR 2024 | peer-reviewed | https://arxiv.org/abs/2309.17453 | 2026-11 |
| Grouped-query attention | Ainslie et al. | EMNLP 2023 | peer-reviewed | https://arxiv.org/abs/2305.13245 | 2026-11 |
| Apple Intelligence Foundation Language Models Tech Report 2025 (~3B on-device model, 2-bit QAT, KV sharing) | Apple | Jul 2025 | vendor technical report (arXiv:2507.13575) | https://machinelearning.apple.com/research/apple-foundation-models-tech-report-2025 | 2026-11 |
| Gemma 3n developer guide (E2B/E4B, MatFormer, PLE) | Google | 26 Jun 2025 | vendor claim | https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/ | 2026-11 |
| MatFormer | Devvrit, Kudugunta, Kusupati et al. | NeurIPS 2024 | peer-reviewed | https://arxiv.org/abs/2310.07707 | 2026-11 |
| Gemma 4 (E2B, E4B, 26B MoE, 31B; edge models 128K context) | Google | 2 Apr 2026 | vendor claim | https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/ | 2026-11 |
| Llama 3.2 1B/3B (pruning + distillation, 128K context) | Meta | 25 Sep 2024 | vendor claim | https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/ | 2026-11 |
| Quantized Llama 3.2 1B/3B (QLoRA, SpinQuant; 4-bit g32 weights, 8-bit dynamic activations) | Meta | 24 Oct 2024 | vendor claim | https://ai.meta.com/blog/meta-llama-quantized-lightweight-models/ | 2026-11 |
| Arm Lumex CSS with SME2 C1 CPUs; KleidiAI integrations | Arm | 10 Sep 2025 | vendor claim | https://newsroom.arm.com/news/announcing-lumex-css-platform-ai-era | 2026-11 |
| KleidiAI micro-kernels (Neon dotprod/i8mm, SVE, SME, SME2) | Arm | README checked 2026-11 | vendor docs | https://github.com/ARM-software/kleidiai | 2026-11 |
| TOSA v1.1.0 (PRO-INT/PRO-FP; EXT-MX extensions; RESCALE §2.13.2) | Arm / ML Platform | v1.1.0 (latest listed) | spec | https://arm.github.io/tosa-specification/releases/v1.1.0/ | 2026-11 |
| MLPerf Inference v5.1 (Llama 3.1 8B edge, Whisper Large V3) | MLCommons | 9 Sep 2025 | benchmark results (MLCommons announcement, read via press copies) | https://mlcommons.org/benchmarks/inference-edge/ | 2026-11 |
| MLPerf Inference v6.0 (new edge object-detection test) | MLCommons | 1 Apr 2026 | benchmark results (MLCommons announcement, read via press copies) | https://www.globenewswire.com/news-release/2026/04/01/3266801/0/en/mlcommons-releases-new-mlperf-inference-v6-0-benchmark-results.html | 2026-11 |
| MLPerf Inference v6.1 (Edge Agentic Inference; speculative decoding allowed in interactive scenario; 30 submitters) | MLCommons | 16 Sep 2026 | benchmark results (MLCommons release text read directly) | https://www.hpcwire.com/off-the-wire/mlcommons-sets-participation-record-with-new-mlperf-inference-v6-1-benchmark-results/ | 2026-11 |
| MLPerf Tiny v1.3 (five tasks incl. streaming wake word; 70 results, 27 power) | MLCommons | 17 Sep 2025 | benchmark results | https://mlcommons.org/benchmarks/inference-tiny/ ; https://mlcommons.org/working-groups/benchmarks/tiny/ | 2026-11 |
| MLPerf Client v1.0 / v1.5 / v2.0 (TTFT, tokens/s; v2.0 adds agentic and image generation) | MLCommons | 30 Jul 2025 / 18 Nov 2025 / 18 Aug 2026 | benchmark (v2.0 page read directly; dates from MLCommons press copies) | https://mlcommons.org/benchmarks/client/ | 2026-11 |
| tinyML Foundation renamed EDGE AI FOUNDATION | EDGE AI FOUNDATION (P. Bernard) | Nov 2024 (Taipei; PR Newswire page dated 19 Nov 2024) | organization announcement | https://www.prnewswire.com/news-releases/tinyml-foundation-unveils-expanded-charter-new-partners-and-new-name-edge-ai-foundation-302309559.html | 2026-11 |
| Qualcomm to acquire Edge Impulse | Qualcomm | announced 10 Mar 2025 | vendor claim; **closing not separately announced** — Edge Impulse's site now gives its address as "c/o Qualcomm Incorporated", consistent with completion. Cards say "announced", not a closing date | https://www.qualcomm.com/news/releases/2025/03/qualcomm-to-bolster-ai-and-iot-capabilities-with-edge-impulse-ac | 2026-11 |
| Efficient ViTs: EfficientViT | Cai, Li, Hu, Gan, Han | ICCV 2023 | peer-reviewed | https://arxiv.org/abs/2205.14756 | 2026-11 |
| Token merging (ToMe) | Bolya et al. | ICLR 2023 (oral) | peer-reviewed | https://arxiv.org/abs/2210.09461 | 2026-11 |
| Progressive distillation; Consistency models | Salimans & Ho; Song et al. | ICLR 2022; ICML 2023 | peer-reviewed | https://arxiv.org/abs/2202.00512 ; https://arxiv.org/abs/2303.01469 | 2026-11 |
| Latent consistency models; Adversarial diffusion distillation | Luo et al.; Sauer et al. | Oct 2023; Nov 2023 | preprints | https://arxiv.org/abs/2310.04378 ; https://arxiv.org/abs/2311.17042 | 2026-11 |
| AI and Memory Wall | Gholami et al. | 2024 | peer-reviewed (IEEE Micro) | https://arxiv.org/abs/2403.14123 | 2026-11 |

Tier 6/7 dated items also checked: Apple M4 Neural Engine 38 TOPS (Apple Newsroom, 7 May 2024, vendor claim); Edge TPU 4 TOPS int8 and 2 TOPS/W (Coral USB Accelerator datasheet v1.4, vendor); Ethos-U55 32–256 MACs/cycle (Arm Hot Chips 2020 and Arm blog); Ethos-U65 1 TOP/s in 0.6 mm² at 16 nm (Arm product page); AccelForge (Andrulis et al., arXiv:2609.11906, Sep 2026, preprint; used in MIT 6.5930 Spring 2026); H&P 7th edition (Elsevier, 2 Dec 2025).

### Dropped or not verified

- **Apple "AFM 3" models (WWDC 2026):** only secondary write-ups found; no Apple primary source located. Dropped; the Apple unit uses the verified 2025 report.
- **MLPerf Tiny v1.4:** the MLCommons Tiny page links a "v1.4" supplemental document and results sheet, but the working-group page still lists 17 Sep 2025 (v1.3) as the latest results publication and no v1.4 announcement was found. Cards cite v1.3.
- **Qualcomm–Edge Impulse closing date:** not found (see table).
- **FlashAttention-2 venue:** not re-checked; cited as an arXiv preprint.
- **Berkeley EE 290-2 lecture list:** the class homepage now requires CalNet login, and the archive mirror could not be fetched. Coverage uses the Spring 2024 catalog listing, Spring 2021 schedule items visible in search results, and the labs described by Amid et al. (ISCAS 2021).
- **Georgia Tech HML lecture list:** slides beyond L01 are Canvas-only, and the L01 schedule slide uses an unextractable font. Coverage uses the public course description, objectives and the six labs with their tools (PyTorch, SCALE-Sim, Megatron-LM, ASTRA-sim, TACOS).
- **Stanford CS217:** the course page's schedule is an embedded spreadsheet; it was read through its public CSV export.
- Web search budget ran out near the end of the session; all items above were verified before that, and later checks used direct page or arXiv fetches.

---

## Sources checked

Coverage sources:
- MIT 6.5930/1 syllabus (Spring 2026): https://csg.csail.mit.edu/6.5930/syllabus.html ; reading list: https://csg.csail.mit.edu/6.5930/readinglist.html ; looptree/AccelForge recitation: https://csg.csail.mit.edu/6.5930/Recitations/looptree.html
- Stanford CS217 (Winter 2026): https://cs217.stanford.edu/ ; schedule (public sheet): https://docs.google.com/spreadsheets/d/1Aqpk1hEZD78bq0WoDe6edSs-tSC58hoEGCSJ6I--6KI/preview?gid=0
- Berkeley EE 290-2: https://www2.eecs.berkeley.edu/Courses/EE290_4081/ ; Spring 2024 listing: https://classes.berkeley.edu/node/252036 ; Amid et al., ISCAS 2021 slides: https://people.eecs.berkeley.edu/~ysshao/assets/talks/amid2021-iscas-slides.pdf
- Georgia Tech HML (Spring 2025): https://tusharkrishna.ece.gatech.edu/teaching/hml_s25 ; L01 slides: https://tusharkrishna.ece.gatech.edu/files/2025/01/L01-Intro.pdf
- Georgia Tech computer architecture body of knowledge: https://www.cc.gatech.edu/phd-cs-computer-architecture-body-knowledge
- Wisconsin architecture qualifier, Fall 2020: https://research.cs.wisc.edu/arch/web-data/qualifier/f20.ca.pdf
- mlsysbook.ai Vol. II (dev): https://harvard-edge.github.io/cs249r_book_dev/vol2/ ; Vol. I (dev): https://harvard-edge.github.io/cs249r_book_dev/vol1/
- MIT 6.5940 Fall 2026: https://hanlab.mit.edu/courses/2026-fall-65940 ; Fall 2024: https://hanlab.mit.edu/courses/2024-fall-65940

Texts and course materials:
- Hennessy, Patterson & Kozyrakis, CA:AQA 7e (TOC): https://shop.elsevier.com/books/computer-architecture/hennessy/978-0-443-15406-5
- Hwu, Kirk & El Hajj, PMPP 4e (TOC): https://shop.elsevier.com/books/programming-massively-parallel-processors/hwu/978-0-323-91231-0
- CS:APP 3e preface and TOC: https://csapp.cs.cmu.edu/3e/pieces/preface3e.pdf ; web asides: https://csapp.cs.cmu.edu/3e/waside.html
- Kastner, Matai & Neuendorffer, Parallel Programming for FPGAs: https://arxiv.org/abs/1805.03648 ; chapter sources: https://github.com/KastnerRG/pp4fpgas
- CMU DLSys lectures: https://dlsyscourse.org/lectures/
- MLC course: https://mlc.ai/summer22/schedule ; notes TOC: https://raw.githubusercontent.com/mlc-ai/mlc-en/main/index.md
- Apache TVM docs: https://tvm.apache.org/docs/
- AccelForge docs: https://accelergy-project.github.io/accelforge/ ; paper: https://arxiv.org/abs/2609.11906
- TOSA specification v1.1.0: https://arm.github.io/tosa-specification/releases/v1.1.0/ ; index: https://mlplatform.org/tosa/tosa_spec.html
- OCP MX v1.0 spec: https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf
- Jouppi et al., TPU v1: https://arxiv.org/abs/1704.04760
- Arm Ethos-U55 / U65 product pages: https://www.arm.com/products/silicon-ip-cpu/ethos/ethos-u55 ; https://www.arm.com/products/silicon-ip-cpu/ethos/ethos-u65
- Apple M4 announcement: https://www.apple.com/newsroom/2024/05/apple-introduces-m4-chip/ (regional mirror read via search)
- Coral USB Accelerator datasheet: https://coral.ai/static/files/Coral-USB-Accelerator-datasheet.pdf (read via search)
- MCUNetV2 (NeurIPS 2021): https://papers.nips.cc/paper/2021/hash/1371bccec2447b5aa6d96d2a540fb401-Abstract.html ; TinyTL: https://arxiv.org/abs/2007.11622 ; 256 KB training: https://arxiv.org/abs/2206.15472 ; PockEngine: https://arxiv.org/abs/2310.17752
- Other arXiv entries checked for title/authors/venue: 2001.03288, 2102.01723, 2007.03152, 1805.02867, 1801.06601, 1604.06174, 2104.08378, 2209.05433, 2405.07259, 2211.05102

Frontier sources: see the URLs in the verification table above.

Practice links: all 66 URLs in the JSON `practice` fields returned HTTP 200 when checked on 2026-11-24. A later re-check the same day got temporary GitHub 503 errors and timeouts on some repository pages; this was a GitHub-side outage, not dead links.
