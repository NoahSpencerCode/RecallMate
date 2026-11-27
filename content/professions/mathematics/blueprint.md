# Mathematics: blueprint

How this profession's curriculum was built: the reasoning for each tier, a coverage matrix against the syllabi it follows, and the sources checked. Written by research agents in November 2026 and merged into `curriculum.json`.

# Mathematics, part 1: tiers 0–4

290 units and 2,560 cards: tier 0 has 140, tier 1 has 320, tier 2 has 560, tier 3 has 800 and tier 4 has 740. Every unit is 5–25 cards, every module has 4–12 units, the unit budgets add up to the module budgets and the kind counts add up to the unit budgets. Every prerequisite comes earlier in the teaching order, and every unit appears once in its tier's `order`.

## Budget changes

| Module | Given | Now | Why |
|---|---|---|---|
| powers-roots | 15 | 20 | The rules need at least 4 units of at least 5 cards, so 15 cards cannot work. |
| expressions-equations | 35 | 30 | Pays for the 5 extra cards so tier 0 stays at 140. Linear equations come back in tier 1 (algebra-1). |

No tier budget changed.

## Conventions

- **Section numbers** are cited only for texts whose tables of contents were checked during this work: AoPS Prealgebra, AoPS Introduction to Algebra, AoPS Introduction to Counting & Probability, Gelfand–Shen (numbered sections), OpenIntro Statistics 4e, Velleman 3e, Stewart ET 8e, Strang 5e and the MIT 18.06 lecture list, Rosen 8e (ch. 4–6, 8, 10), Boyce–DiPrima–Meade 11e, Hoffman–Kunze 2e, Artin 2e, Dummit–Foote 3e, Munkres *Topology* 2e, Munkres *Analysis on Manifolds*, Niven–Zuckerman–Montgomery 5e, Armstrong, Stein–Shakarchi (*Complex Analysis* and *Fourier Analysis*), Ahlfors 3e, Hirsch–Smale–Devaney 3e, Strogatz 3e, Strauss 2e, Diestel (author's contents file), Enderton *Logic* 2e and Trefethen–Bau.
- **Chapter-level only**, because sections could not be checked: Abbott 2e, Axler 4e, Hubbard–Hubbard 5e, Spivak (both books), Blitzstein–Hwang, Grimmett–Welsh, Ireland–Rosen, Stanley EC1, Sipser, Süli–Mayers, Lang, Jacobs, Kiselev, Lovász–Pelikán–Vesztergombi and Enderton *Set Theory*.
- **Cited by chapter title, not number**, because the numbering could not be checked: Gelfand–Saul, Stitz–Zeager 4i and do Carmo (see the last section).
- **Card-kind mix.** Tiers 0–2 come out at about 26–32% definition/concept, 18–26% formula/theorem, 13–14% example, 19–21% problem and 14–17% misconception/counterexample. Tier 3 is 25% definition, 25% theorem, 14% proof-idea, 15% example/counterexample and 21% problem. In tier 3, real-analysis-1, abstract-algebra-1, linear-algebra-2 and analysis-in-rn are at 21–25% problems; the other tier-3 modules are at 17–18%. In tier 4, complex-analysis-1 and algebra-2 are at 21–23% problems in their teaching units, and point-set-topology (tier 3), fundamental-group and fourier-intro-pde are at 15–17%.
- **Mock prelim.** The four `prelim-practice` units are complex-analysis-1 (20 cards), algebra-2 (20), fourier-intro-pde (18: real analysis, advanced calculus and ODE/PDE) and numerical-analysis (12: linear algebra). Together they make 70 cards, about 90% of them problems. They are the last four entries of tier 4's order, alternating between modules. Because the coordinator asked for this block, the module problem shares above count teaching units only. Counting the block, those four modules reach 30–34% problems.
- **Interleaving.** In tier 1, algebra blocks alternate with geometry, counting and trigonometry blocks (47/43/48/45/43/47/47 cards). In tier 2, proofs-logic-sets (later joined by discrete-math) alternates with calculus-1 and calculus-2 in blocks of 49/56/48/49/53/60 cards. In tier 3, abstract-algebra-1 with number-theory alternates with real-analysis-1 (56/49/58/52/54/49/52), then linear-algebra-2 alternates with point-set-topology (45/50/45/50/40). Probability and then analysis-in-rn come last in tier 3, after real-analysis-1, linear-algebra-2 and multivariable-calculus, as the hard prerequisites require.

## Tier 0: Pre-algebra

**Rationale.** The tier follows the order of AoPS Prealgebra: arithmetic laws, then number theory, fractions, exponents and roots, then equations, measurement and data. It is aimed at adults who left school long ago. Every unit has a misconception card for the classic traps, such as −3² versus (−3)², adding percent changes, and treating 1 as prime. Counting is left to tier 1, where it gets a proper module.

| Source topic | Covered by units |
|---|---|
| AoPS Prealgebra ch. 1, Properties of Arithmetic | integers/order-of-operations, integers/negative-numbers |
| AoPS Prealgebra ch. 2, Exponents | powers-roots/exponent-laws, powers-roots/scientific-notation |
| AoPS Prealgebra ch. 3, Number Theory | integers/primes-and-factorization, integers/gcd-and-lcm |
| AoPS Prealgebra ch. 4, Fractions | fractions-proportion/fraction-meaning, fractions-proportion/fraction-arithmetic |
| AoPS Prealgebra ch. 5, Equations and Inequalities | expressions-equations/variables-and-expressions, …/linear-equations, …/inequalities, …/word-problems |
| AoPS Prealgebra ch. 6, Decimals | fractions-proportion/decimals, integers/place-value-and-rounding, powers-roots/estimation-and-magnitude |
| AoPS Prealgebra ch. 7, Ratios, Conversions, and Rates | fractions-proportion/ratios-rates-proportions, measurement-data/units-and-conversion |
| AoPS Prealgebra ch. 8, Percents | fractions-proportion/percent-and-percent-change |
| AoPS Prealgebra ch. 9, Square Roots | powers-roots/square-roots |
| AoPS Prealgebra ch. 10, Angles | measurement-data/angles |
| AoPS Prealgebra ch. 11, Perimeter and Area | measurement-data/perimeter-area-volume |
| AoPS Prealgebra ch. 12, Right Triangles and Quadrilaterals | measurement-data/pythagorean-theorem. **Partial gap:** classifying quadrilaterals moves to euclidean-geometry/triangle-and-quadrilateral-theorems in tier 1. |
| AoPS Prealgebra ch. 13, Data and Statistics | measurement-data/mean-median-mode |
| AoPS Prealgebra ch. 14, Counting | **Gap by design:** moved to tier 1, counting-probability-statistics/counting-principles and …/probability-basics. |
| AoPS Prealgebra ch. 15, Problem-Solving Strategies | expressions-equations/word-problems, powers-roots/estimation-and-magnitude |
| Khan Academy Pre-algebra (place value, order of operations, negative numbers, factors and multiples) | integers/* (all five units) |
| CCSS groundwork: N-RN.A properties of exponents (integer exponents) | powers-roots/exponent-laws |
| CCSS groundwork: N-Q.A reason quantitatively and use units | measurement-data/units-and-conversion, fractions-proportion/ratios-rates-proportions |
| CCSS groundwork: A-SSE.A interpret the structure of expressions | expressions-equations/variables-and-expressions, …/distributive-law-and-like-terms |
| CCSS groundwork: A-REI.A–B solving equations as reasoning; one-variable equations and inequalities | expressions-equations/linear-equations, …/inequalities |
| CCSS groundwork: A-CED.A create equations | expressions-equations/word-problems |
| CCSS groundwork: G-GMD.A volume formulas (prisms, cylinders) | measurement-data/perimeter-area-volume |
| CCSS groundwork: S-ID.A summarize a single variable | measurement-data/mean-median-mode |

## Tier 1: High school

**Rationale.** The tier covers every cluster of the six Common Core high-school conceptual categories: Number and Quantity, Algebra, Functions, Modeling, Geometry, and Statistics and Probability. It uses the given texts: Gelfand–Shen and AoPS for algebra, Jacobs and Kiselev for geometry, Gelfand–Saul and Stitz–Zeager for trigonometry and coordinates, AoPS and OpenIntro for counting and statistics, and Lang for the bridge to proof. Four Common Core areas were not in the given key topics, so units were added for them: matrices (N-VM.C), correlation and regression (S-ID.B–C), sampling and experiments (S-IC), and an explicit modeling cycle (★). The bridge-to-proof module goes beyond Common Core (induction, logic, limits) to prepare for tier 2.

| Source topic (Common Core HS cluster) | Covered by units |
|---|---|
| N-RN.A Extend the properties of exponents to rational exponents | functions-exp-log/exponential-functions; powers-roots/exponent-laws |
| N-RN.B Use properties of rational and irrational numbers | bridge-to-proof/proof-techniques-first-look; powers-roots/square-roots; fractions-proportion/decimals |
| N-Q.A Reason quantitatively and use units | measurement-data/units-and-conversion; functions-exp-log/modeling-with-functions |
| N-CN.A Perform arithmetic operations with complex numbers | bridge-to-proof/complex-numbers |
| N-CN.B Represent complex numbers on the complex plane | bridge-to-proof/complex-numbers; coordinates-vectors/parametric-and-polar-curves |
| N-CN.C Use complex numbers in polynomial identities and equations | bridge-to-proof/complex-numbers (fundamental theorem of algebra); algebra-1/quadratic-formula |
| N-VM.A Represent and model with vector quantities | coordinates-vectors/vectors-and-dot-product |
| N-VM.B Perform operations on vectors | coordinates-vectors/vectors-and-dot-product |
| N-VM.C Perform operations on matrices and use them in applications | coordinates-vectors/matrices-and-transformations. **Gap closed:** this unit was added. |
| A-SSE.A Interpret the structure of expressions | algebra-1/polynomial-arithmetic; expressions-equations/variables-and-expressions |
| A-SSE.B Write expressions in equivalent forms | algebra-1/factoring, algebra-1/quadratic-formula (completing the square, vertex form); functions-exp-log/exponential-functions |
| A-APR.A Perform arithmetic operations on polynomials | algebra-1/polynomial-arithmetic |
| A-APR.B Zeros and factors of polynomials | algebra-1/polynomial-division-and-roots |
| A-APR.C Use polynomial identities | algebra-1/polynomial-arithmetic; counting-probability-statistics/combinations-and-binomial-theorem |
| A-APR.D Rewrite rational expressions | functions-exp-log/rational-functions; algebra-1/polynomial-division-and-roots |
| A-CED.A Create equations | algebra-1/systems-of-equations; functions-exp-log/modeling-with-functions; expressions-equations/word-problems |
| A-REI.A Solving equations as a process of reasoning | expressions-equations/linear-equations; functions-exp-log/logarithms (extraneous solutions) |
| A-REI.B Solve equations and inequalities in one variable | algebra-1/quadratic-formula, algebra-1/linear-inequalities-and-absolute-value |
| A-REI.C Solve systems of equations | algebra-1/systems-of-equations; coordinates-vectors/matrices-and-transformations |
| A-REI.D Represent and solve equations and inequalities graphically | algebra-1/lines-and-slope, algebra-1/linear-inequalities-and-absolute-value |
| F-IF.A The concept of a function and function notation | functions-exp-log/functions-and-notation |
| F-IF.B Interpret functions in context | functions-exp-log/functions-and-notation (average rate of change), …/modeling-with-functions |
| F-IF.C Analyze functions in different representations | functions-exp-log/transformations-of-graphs, …/rational-functions; algebra-1/quadratic-formula |
| F-BF.A Build a function that models a relationship | functions-exp-log/modeling-with-functions; bridge-to-proof/sequences-and-series (recursive and explicit forms) |
| F-BF.B Build new functions from existing ones | functions-exp-log/composition-and-inverses, …/transformations-of-graphs |
| F-LE.A Construct and compare linear, quadratic and exponential models | functions-exp-log/exponential-functions, …/modeling-with-functions |
| F-LE.B Interpret expressions for functions in context | functions-exp-log/modeling-with-functions |
| F-TF.A Extend trigonometric functions with the unit circle | trigonometry/radians-and-unit-circle |
| F-TF.B Model periodic phenomena | trigonometry/trig-graphs, trigonometry/inverse-trig-functions |
| F-TF.C Prove and apply trigonometric identities | trigonometry/trig-identities |
| Modeling (★, the modeling cycle) | functions-exp-log/modeling-with-functions. **Gap closed:** the cycle is now taught explicitly. Also expressions-equations/word-problems and counting-probability-statistics/sampling-and-experiments. |
| G-CO.A Experiment with transformations in the plane | euclidean-geometry/rigid-motions-and-congruence |
| G-CO.B Congruence in terms of rigid motions | euclidean-geometry/rigid-motions-and-congruence |
| G-CO.C Prove geometric theorems | euclidean-geometry/points-lines-angles-and-proof, …/triangle-and-quadrilateral-theorems |
| G-CO.D Make geometric constructions | euclidean-geometry/constructions |
| G-SRT.A Similarity through similarity transformations | euclidean-geometry/similarity |
| G-SRT.B Prove theorems involving similarity | euclidean-geometry/similarity |
| G-SRT.C Trigonometric ratios and right triangles | trigonometry/right-triangle-trigonometry; measurement-data/pythagorean-theorem |
| G-SRT.D Apply trigonometry to general triangles | trigonometry/laws-of-sines-and-cosines |
| G-C.A Understand and apply theorems about circles | euclidean-geometry/circle-theorems, …/triangle-and-quadrilateral-theorems (inscribed and circumscribed circles) |
| G-C.B Arc lengths and areas of sectors | euclidean-geometry/circle-theorems; trigonometry/radians-and-unit-circle |
| G-GPE.A Geometric description and equation of a conic | coordinates-vectors/distance-midpoint-and-circles, …/conic-sections |
| G-GPE.B Use coordinates to prove simple theorems | coordinates-vectors/distance-midpoint-and-circles; algebra-1/lines-and-slope |
| G-GMD.A Explain volume formulas and use them | euclidean-geometry/area-and-volume. **Gap closed:** Cavalieri's principle and the volumes of cones, pyramids and spheres were added. |
| G-GMD.B Relate 2D and 3D objects | euclidean-geometry/area-and-volume (cross-sections through Cavalieri). **Partial:** solids of revolution return in calculus-2/applications-of-integration. |
| G-MG.A Apply geometric concepts in modeling | euclidean-geometry/area-and-volume; measurement-data/perimeter-area-volume |
| S-ID.A Summarize data on a single variable | counting-probability-statistics/descriptive-statistics; measurement-data/mean-median-mode |
| S-ID.B Summarize data on two variables | counting-probability-statistics/conditional-probability (two-way tables), …/correlation-and-regression |
| S-ID.C Interpret linear models | counting-probability-statistics/correlation-and-regression. **Gap closed:** this unit was added. |
| S-IC.A Random processes underlying statistical experiments | counting-probability-statistics/sampling-and-experiments. **Gap closed:** this unit was added. |
| S-IC.B Inferences from surveys, experiments and observational studies | counting-probability-statistics/sampling-and-experiments |
| S-CP.A Independence and conditional probability | counting-probability-statistics/conditional-probability, …/probability-basics |
| S-CP.B Rules of probability for compound events | counting-probability-statistics/probability-basics, …/combinations-and-binomial-theorem |
| S-MD.A Calculate expected values | counting-probability-statistics/random-variables-and-expectation |
| S-MD.B Use probability to evaluate decisions | counting-probability-statistics/random-variables-and-expectation |

## Tier 2: First-year university

**Rationale.** Tier 2 covers Berkeley's "Calculus (Math 1A-1B-53-54)" syllabus area and the first-year layer of the UCLA Basic exam: elimination, determinants, integration techniques and the vector-calculus theorems. Before any of the tier-3 analysis or algebra, it builds the proof habits from Velleman and Hammack. The rigorous versions of these topics come in tier 3, which the matrix points to. Discrete math and the Laplace transform are in neither exam syllabus. They are kept because the module skeleton requires them and because later units need them: combinatorics-graphs and number-theory build on the discrete-math units, and the RSA and CRT units feed abstract algebra.

| Source topic | Covered by units |
|---|---|
| Berkeley 3.1 Basic first- and second-year calculus | calculus-1/* (10 units), calculus-2/* (10 units), multivariable-calculus/* (11 units) |
| Berkeley 3.1 Derivatives of maps ℝᵐ → ℝⁿ, gradient, chain rule | multivariable-calculus/partial-derivatives-and-differentiability, …/chain-rule-and-gradient; analysis-in-rn/derivative-as-linear-map (tier 3) |
| Berkeley 3.1 Maxima and minima, Lagrange multipliers | calculus-1/optimization; multivariable-calculus/optimization-and-lagrange-multipliers; analysis-in-rn/implicit-function-theorem (tier 3) |
| Berkeley 3.1 Line and surface integrals of scalar and vector functions | multivariable-calculus/vector-fields-and-line-integrals, …/surface-integrals-and-flux |
| Berkeley 3.1 Gauss's, Green's and Stokes' theorems | multivariable-calculus/greens-theorem, …/stokes-and-divergence-theorems; analysis-in-rn/integration-on-chains-and-stokes (tier 3) |
| Berkeley 3.1 Ordinary differential equations; explicit solutions of simple equations | differential-equations-1/* (all 8 units) |
| Berkeley 3.3 Elementary set theory, e.g. uncountability of ℝ | proofs-logic-sets/countability; real-analysis-1/ordered-fields-and-completeness (tier 3) |
| UCLA Basic: L'Hôpital's rule (computational) | calculus-1/mean-value-theorem; real-analysis-1/differentiation (tier 3, rigorous) |
| UCLA Basic: integration by parts, change of variables, improper integrals (computational) | calculus-2/substitution-and-parts, …/improper-integrals; real-analysis-1/riemann-integral (tier 3) |
| UCLA Basic: partial and directional derivatives, C¹ implies differentiable, mixed partials, local extrema and saddles, chain rule | multivariable-calculus/partial-derivatives-and-differentiability, …/chain-rule-and-gradient, …/optimization-and-lagrange-multipliers; analysis-in-rn/higher-derivatives-and-taylor (tier 3) |
| UCLA Basic: multivariable integration including the change of variables formula | multivariable-calculus/multiple-integrals, …/change-of-variables-and-jacobians; analysis-in-rn/change-of-variables (tier 3) |
| UCLA Basic: double integrals, line integrals, Green's theorem, Stokes' theorem in ℝ³, divergence theorem in ℝ² and ℝ³ | multivariable-calculus/greens-theorem, …/stokes-and-divergence-theorems |
| UCLA Basic: linear equations, Gauss elimination, RREF | linear-algebra-1/matrices-and-elimination, …/vector-spaces-and-subspaces |
| UCLA Basic: determinants (Laplace expansion, computation by elementary operations, classical adjoint and Cramer's rule) | linear-algebra-1/determinants; linear-algebra-2/determinants-as-multilinear-forms (tier 3) |
| UCLA Basic: LU and QR decompositions | linear-algebra-1/matrix-algebra-and-inverses (LU), …/orthogonality-and-projections (QR); numerical-analysis/lu-and-qr-factorization (tier 4) |
| UCLA Basic: higher-order linear ODEs | differential-equations-1/second-order-constant-coefficient, …/nonhomogeneous-and-oscillations; ode-dynamics/linear-systems-and-matrix-exponential (tier 4) |
| Module key topic outside both syllabi: pigeonhole, recurrences, inclusion–exclusion, graphs, congruences and CRT | discrete-math/* (10 units) |
| Module key topic outside both syllabi: Laplace transform | differential-equations-1/laplace-transform, …/step-impulse-and-convolution |

## Tier 3: Undergraduate core

**Rationale.** Tier 3 carries most of the prelim syllabus: Berkeley 3.2 (classical analysis), 3.3 (abstract algebra) and 3.4 (linear algebra), and nearly all of the UCLA Basic exam. The prelim-style modules are deliberately heavy on problems (21–25%), with proof-idea cards for the standard arguments. Abbott, Rudin, Axler and Munkres did not cover some UCLA items: Hölder's, Minkowski's and Young's inequalities; double series; the Cauchy and integral forms of the Taylor remainder; convex functions; operator and Frobenius norms. Those were written into the objectives of the nearest units. Number theory runs alongside abstract algebra, so primitive roots and reciprocity come right after cyclic groups and group actions.

| Source topic | Covered by units |
|---|---|
| Berkeley 3.2 Topology of ℝⁿ and metric spaces | real-analysis-1/topology-of-the-real-line, …/metric-spaces; point-set-topology/* |
| Berkeley 3.2 Properties of continuous functions | real-analysis-1/continuity-and-uniform-continuity; point-set-topology/closed-sets-and-continuity |
| Berkeley 3.2 Compactness, connectedness, limit points | real-analysis-1/topology-of-the-real-line, …/metric-spaces; point-set-topology/compactness, …/connectedness |
| Berkeley 3.2 Least upper bound property of ℝ | real-analysis-1/ordered-fields-and-completeness |
| Berkeley 3.2 Sequences and series, Cauchy sequences | real-analysis-1/sequences-and-limits, …/series-of-real-numbers |
| Berkeley 3.2 Uniform convergence and its relation to derivatives and integrals | real-analysis-1/uniform-convergence |
| Berkeley 3.2 Power series, radius of convergence, Weierstrass M-test | real-analysis-1/power-series-and-special-functions, …/uniform-convergence |
| Berkeley 3.2 Convergence of improper integrals | real-analysis-1/riemann-integral; calculus-2/improper-integrals |
| Berkeley 3.2 Compactness in function spaces | real-analysis-1/arzela-ascoli; point-set-topology/complete-metric-spaces-and-baire |
| Berkeley 3.2 Inverse and implicit function theorems and applications | analysis-in-rn/inverse-function-theorem, …/implicit-function-theorem |
| Berkeley 3.2 The derivative as a linear map | analysis-in-rn/derivative-as-linear-map |
| Berkeley 3.3 Groups, subgroups, normal subgroups, homomorphisms, quotient groups | abstract-algebra-1/groups-and-examples, …/subgroups-and-cyclic-groups, …/cosets-and-lagrange, …/homomorphisms-and-quotients |
| Berkeley 3.3 Automorphisms | abstract-algebra-1/products-and-abelian-groups (Aut(ℤ/n)), …/group-actions (conjugation) |
| Berkeley 3.3 Groups acting on sets | abstract-algebra-1/group-actions |
| Berkeley 3.3 Sylow theorems and applications | abstract-algebra-1/sylow-theorems |
| Berkeley 3.3 Finitely generated abelian groups | abstract-algebra-1/products-and-abelian-groups; algebra-2/modules-over-a-pid (tier 4) |
| Berkeley 3.3 Examples: permutation, cyclic, dihedral and matrix groups | abstract-algebra-1/groups-and-examples, …/permutation-groups, …/subgroups-and-cyclic-groups |
| Berkeley 3.3 Rings, units, ideals, homomorphisms, quotient rings | abstract-algebra-1/rings-and-ideals |
| Berkeley 3.3 Prime and maximal ideals, fields of fractions | abstract-algebra-1/rings-and-ideals |
| Berkeley 3.3 Euclidean domains, PIDs, UFDs | abstract-algebra-1/euclidean-pid-ufd |
| Berkeley 3.3 Polynomial rings | abstract-algebra-1/polynomial-rings |
| Berkeley 3.3 Finite field extensions, roots of polynomials, finite fields | abstract-algebra-1/field-extensions-first-look, …/polynomial-rings; algebra-2/field-extensions-and-degree, …/finite-fields (tier 4) |
| Berkeley 3.4 Matrices, linear transformations, change of basis | linear-algebra-2/linear-maps-and-matrices |
| Berkeley 3.4 Nullity-rank theorem | linear-algebra-2/linear-maps-and-matrices; linear-algebra-1/rank-and-the-four-subspaces |
| Berkeley 3.4 Eigenvalues and eigenvectors; determinants | linear-algebra-2/eigenvalues-and-invariant-subspaces, …/determinants-as-multilinear-forms |
| Berkeley 3.4 Characteristic and minimal polynomials, Cayley–Hamilton | linear-algebra-2/eigenvalues-and-invariant-subspaces, …/cayley-hamilton-and-generalized-eigenspaces |
| Berkeley 3.4 Diagonalization and triangularization of operators | linear-algebra-2/eigenvalues-and-invariant-subspaces |
| Berkeley 3.4 Jordan normal form, rational canonical form, invariant subspaces | linear-algebra-2/jordan-form, …/rational-canonical-form; algebra-2/canonical-forms-via-modules (tier 4) |
| Berkeley 3.4 Inner product spaces, hermitian and unitary operators, adjoints | linear-algebra-2/inner-product-spaces, …/spectral-theorem-and-normal-operators |
| Berkeley 3.4 Quadratic forms | linear-algebra-2/bilinear-and-quadratic-forms |
| UCLA Basic: completeness of the real numbers | real-analysis-1/ordered-fields-and-completeness |
| UCLA Basic: sequences, series, limits; exchanging limits; absolute convergence and rearrangements | real-analysis-1/sequences-and-limits, …/series-of-real-numbers, …/uniform-convergence |
| UCLA Basic: continuity with ε–δ, extrema, uniform continuity | real-analysis-1/continuity-and-uniform-continuity |
| UCLA Basic: derivative, MVT, Cauchy MVT, L'Hôpital, limits of derivatives | real-analysis-1/differentiation, …/uniform-convergence |
| UCLA Basic: Rolle's theorem for higher derivatives and Lagrange interpolation error | real-analysis-1/differentiation; numerical-analysis/interpolation-and-quadrature (tier 4) |
| UCLA Basic: Riemann integral (integrability of sums, products, min, max; MVT for integrals; FTC; parts; change of variables; improper integrals; uniform limits) | real-analysis-1/riemann-integral. **Gap closed:** the sums/products/min/max objective and the MVT for integrals were added. Also real-analysis-1/uniform-convergence. |
| UCLA Basic: series of functions, uniform convergence and integration, differentiation under the integral sign | real-analysis-1/uniform-convergence; analysis-in-rn/integration-in-rn |
| UCLA Basic: Taylor's theorem with Lagrange, Cauchy and integral remainders | real-analysis-1/differentiation (Lagrange, Cauchy), …/riemann-integral (integral form). **Gap closed:** these objectives were added. |
| UCLA Basic: countability, diagonal arguments | proofs-logic-sets/countability (tier 2) |
| UCLA Basic: open and closed sets, interior and closure | real-analysis-1/topology-of-the-real-line; point-set-topology/closed-sets-and-continuity |
| UCLA Basic: completeness, Baire category theorem and applications on ℝ | real-analysis-1/metric-spaces; point-set-topology/complete-metric-spaces-and-baire |
| UCLA Basic: compactness (sequential compactness, Bolzano–Weierstrass, Heine–Borel, total boundedness) | real-analysis-1/sequences-and-limits, …/topology-of-the-real-line, …/metric-spaces; point-set-topology/compactness |
| UCLA Basic: connectedness and path-connectedness | real-analysis-1/topology-of-the-real-line; point-set-topology/connectedness |
| UCLA Basic: function spaces, modes of convergence, sup norm, equicontinuity | real-analysis-1/uniform-convergence, …/arzela-ascoli |
| UCLA Basic: Cauchy–Schwarz, Young, Hölder and Minkowski inequalities | real-analysis-1/metric-spaces. **Gap closed:** this objective was added. |
| UCLA Basic: power series, real analytic functions, Abel's lemma and theorem, multiplication of power series | real-analysis-1/power-series-and-special-functions, …/series-of-real-numbers (Cauchy product) |
| UCLA Basic: Fubini's theorem for sequences (double series) | real-analysis-1/series-of-real-numbers. **Gap closed:** this objective was added. |
| UCLA Basic: Dini's theorem | real-analysis-1/uniform-convergence |
| UCLA Basic: Stone–Weierstrass theorem | real-analysis-1/stone-weierstrass |
| UCLA Basic: Arzelà–Ascoli theorem | real-analysis-1/arzela-ascoli |
| UCLA Basic: exp, log, sin and cos; uniform approximation by trigonometric polynomials | real-analysis-1/power-series-and-special-functions, …/stone-weierstrass; fourier-intro-pde/convergence-of-fourier-series (tier 4) |
| UCLA Basic: contraction maps, Newton's method, existence and uniqueness for nonlinear ODEs | real-analysis-1/metric-spaces; analysis-in-rn/inverse-function-theorem; numerical-analysis/root-finding-and-newton and ode-dynamics/existence-and-uniqueness (tier 4) |
| UCLA Basic: differentiability as a linear approximation, Taylor in several variables, Newton's method in several variables | analysis-in-rn/derivative-as-linear-map, …/higher-derivatives-and-taylor, …/inverse-function-theorem |
| UCLA Basic: inverse and implicit function theorems; Lagrange multipliers | analysis-in-rn/inverse-function-theorem, …/implicit-function-theorem |
| UCLA Basic: multivariable integration, change of variables, differentiation under the integral sign | analysis-in-rn/integration-in-rn, …/change-of-variables |
| UCLA Basic: convex and concave functions | analysis-in-rn/higher-derivatives-and-taylor. **Gap closed:** this objective was added. |
| UCLA Basic: fields (axioms; ℚ, ℝ, ℂ, finite fields); vector spaces over a field; complements; Steinitz exchange; existence of bases | linear-algebra-2/vector-spaces-bases-dimension; abstract-algebra-1/field-extensions-first-look; logic-computability/cardinals-and-choice (bases via Zorn, tier 4) |
| UCLA Basic: dual spaces and bases, quotient spaces, induced and dual maps | linear-algebra-2/duality-and-quotients |
| UCLA Basic: matrix representations, change of basis, similarity, trace with tr(AB) = tr(BA), kernel and image, rank–nullity | linear-algebra-2/linear-maps-and-matrices |
| UCLA Basic: eigenvalues; trace and determinant versus eigenvalues; diagonalizability; non-diagonalizable examples in every dimension | linear-algebra-2/eigenvalues-and-invariant-subspaces; linear-algebra-1/eigenvalues-and-diagonalization |
| UCLA Basic: generalized eigenspaces; algebraic and geometric multiplicity; algebraic multiplicity equals the dimension of the generalized eigenspace; Cayley–Hamilton | linear-algebra-2/cayley-hamilton-and-generalized-eigenspaces |
| UCLA Basic: diagonalizable over ℂ exactly when the minimal polynomial has no repeated roots | linear-algebra-2/eigenvalues-and-invariant-subspaces |
| UCLA Basic: rational and Jordan forms; largest Jordan block versus the minimal polynomial | linear-algebra-2/jordan-form, …/rational-canonical-form |
| UCLA Basic: operator and Frobenius norms | linear-algebra-2/spectral-theorem-and-normal-operators. **Gap closed:** this objective was added. Also numerical-analysis/floating-point-and-conditioning (tier 4). |
| UCLA Basic: orthonormal bases, Gram–Schmidt, adjoints and their images and kernels | linear-algebra-2/inner-product-spaces |
| UCLA Basic: orthogonal, unitary, self-adjoint and normal operators and their canonical forms; spectral theorem | linear-algebra-2/spectral-theorem-and-normal-operators |
| UCLA Basic: quadratic forms (definiteness, signature, Sylvester's criterion, law of inertia) | linear-algebra-2/bilinear-and-quadratic-forms |
| UCLA Basic: QR, LU and Cholesky; singular and polar decompositions | linear-algebra-2/svd-and-matrix-decompositions; numerical-analysis/lu-and-qr-factorization (tier 4) |
| UCLA Basic: determinants as multilinear functions; signed volume | linear-algebra-2/determinants-as-multilinear-forms |
| Module key topics outside both syllabi: probability (conditioning, generating functions, LLN and CLT, Markov chains) | probability/* (10 units) |
| Module key topics outside both syllabi: number theory (primitive roots, reciprocity, arithmetic functions, Diophantine equations, Pell) | number-theory/* (8 units) |
| Module key topics outside both syllabi: Tychonoff, Urysohn, quotient spaces | point-set-topology/tychonoff-theorem, …/urysohn-and-tietze, …/quotient-spaces |
| Module key topics outside both syllabi: differential forms and the general Stokes theorem | analysis-in-rn/multilinear-algebra-and-forms, …/integration-on-chains-and-stokes, …/closed-and-exact-forms |

## Tier 4: Advanced undergraduate

**Rationale.** Tier 4 covers the rest of the prelim syllabus: complex analysis (Berkeley 3.5), plus the Fourier-series, ODE-existence and finite-field items from 3.2 and 3.3, and the UCLA items on matrix exponentials, numerical integration and contraction mappings. It adds the bachelor's-level electives named in the skeleton. Stein–Shakarchi treats Laurent series only lightly, so the Laurent unit also cites Ahlfors ch. 5 §1.3. Several units draw on other modules: harmonic functions return in fourier-intro-pde, and the Euler characteristic comes back from discrete math in Gauss–Bonnet. The tier ends with a 70-card mock prelim in the Berkeley/UCLA format: complex analysis, algebra, real analysis with calculus and ODEs, and linear algebra.

| Source topic | Covered by units |
|---|---|
| Berkeley 3.5 Basic properties of the complex number system | complex-analysis-1/complex-numbers-and-the-plane |
| Berkeley 3.5 Analytic functions, conformality, Cauchy–Riemann equations | complex-analysis-1/holomorphic-functions-and-cauchy-riemann |
| Berkeley 3.5 Elementary functions (rational, exp, log, trig, roots such as √z) | complex-analysis-1/power-series-and-elementary-functions |
| Berkeley 3.5 Cauchy's theorem and Cauchy's integral formula | complex-analysis-1/contour-integrals-and-cauchys-theorem, …/cauchy-integral-formula-and-consequences |
| Berkeley 3.5 Power series and Laurent series | complex-analysis-1/power-series-and-elementary-functions, …/laurent-series-and-singularities |
| Berkeley 3.5 Isolation of zeros | complex-analysis-1/cauchy-integral-formula-and-consequences |
| Berkeley 3.5 Classification of isolated singularities, including at ∞ | complex-analysis-1/laurent-series-and-singularities |
| Berkeley 3.5 Analyticity of limit functions | complex-analysis-1/cauchy-integral-formula-and-consequences, …/argument-principle-and-rouche (Hurwitz) |
| Berkeley 3.5 Maximum principle, Schwarz's lemma, Liouville's theorem, Morera's theorem | complex-analysis-1/maximum-modulus-and-schwarz, …/cauchy-integral-formula-and-consequences |
| Berkeley 3.5 Argument principle, Rouché's theorem | complex-analysis-1/argument-principle-and-rouche |
| Berkeley 3.5 Harmonic functions: link to analytic functions, harmonic conjugates, mean value property, maximum principle | complex-analysis-1/harmonic-functions; fourier-intro-pde/laplace-equation-and-maximum-principle |
| Berkeley 3.5 Residue theorem, evaluation of definite integrals | complex-analysis-1/residue-theorem-and-integrals |
| Berkeley 3.5 Linear fractional maps; conformal equivalences of the disc with itself and with the upper half-plane | complex-analysis-1/mobius-maps-and-conformal-mapping, …/maximum-modulus-and-schwarz |
| Berkeley 3.2 Existence and uniqueness theorems for ODEs | ode-dynamics/existence-and-uniqueness |
| Berkeley 3.2 Elementary Fourier series | fourier-intro-pde/fourier-series-basics, …/convergence-of-fourier-series, …/mean-square-convergence-and-parseval |
| Berkeley 3.3 Finite fields | algebra-2/finite-fields |
| UCLA Basic: matrix exponentials for first-order linear ODEs | ode-dynamics/linear-systems-and-matrix-exponential |
| UCLA Basic: higher-order linear ODEs; Wronskian for inhomogeneous equations | ode-dynamics/linear-systems-and-matrix-exponential (variation of constants, Abel's formula); differential-equations-1/nonhomogeneous-and-oscillations |
| UCLA Basic: numerical integration with error estimation | numerical-analysis/interpolation-and-quadrature |
| UCLA Basic: contraction maps applied to Newton's method and nonlinear ODEs | numerical-analysis/root-finding-and-newton; ode-dynamics/existence-and-uniqueness |
| Exam practice: Berkeley prelim format (two days, 5 of 8 problems a day, applying theorems rather than proving standard ones) | complex-analysis-1/prelim-practice, algebra-2/prelim-practice, fourier-intro-pde/prelim-practice, numerical-analysis/prelim-practice |
| Exam practice: UCLA Basic format (6 analysis and 6 linear algebra problems, answer 5 of each) | fourier-intro-pde/prelim-practice (analysis half), numerical-analysis/prelim-practice (linear algebra half) |
| Module key topics outside both syllabi: modules over PIDs, Galois theory, cyclotomic fields, solvability | algebra-2/* (11 teaching units) |
| Module key topics outside both syllabi: curves and surfaces, fundamental group, dynamics, combinatorics, logic, numerical analysis | curves-surfaces/*, fundamental-group/*, ode-dynamics/*, combinatorics-graphs/*, logic-computability/*, numerical-analysis/* |

## Sources checked

Coverage sources:
- UC Berkeley prelim syllabus (PDF, text extracted and read in full): https://pantheon.math.berkeley.edu/sites/default/files/bulk_8/syllabus.pdf
- UC Berkeley prelim page (format and past exams): https://math.berkeley.edu/programs/graduate/prelim-exams
- UCLA Basic exam syllabus (PDF, read in full): https://ww3.math.ucla.edu/wp-content/uploads/2022/06/Basic.pdf
- UCLA past qualifying exams: https://ww3.math.ucla.edu/past-qualifying-exams/
- Common Core high school pages (categories, domains and clusters): https://www.thecorestandards.org/Math/Content/HSN/introduction/, https://www.thecorestandards.org/Math/Content/HSA/introduction/, https://www.thecorestandards.org/Math/Content/HSF/introduction/, https://www.thecorestandards.org/Math/Content/HSG/introduction/, https://www.thecorestandards.org/Math/Content/HSS/introduction/, https://www.thecorestandards.org/Math/Content/HSM/

Tables of contents (checked in this work, partly by helper agents):
- AoPS Prealgebra: https://www.exodusbooks.com/samples/aops/66780TOC.pdf
- AoPS Introduction to Algebra: https://www.exodusbooks.com/samples/aops/55966toc.pdf
- AoPS Introduction to Counting & Probability: https://www.exodusbooks.com/samples/aops/51888toc.pdf
- Gelfand–Shen, Algebra: https://www.schweitzer-online.de/buch/Gelfand/Algebra/9783764336776/A26477889/
- Stitz–Zeager Precalculus 4i: https://xerxes.ximera.org/stitz-zeager/precalc/Intro and https://www.stitz-zeager.com/
- Jacobs, Geometry 3e: https://www.exodusbooks.com/Samples/WHFreeman/5651TOC.pdf
- Kiselev, Planimetry: https://www.sumizdat.org/pl_i_viii.pdf
- OpenIntro Statistics: https://www.openintro.org/book/os/
- Lang, Basic Mathematics: https://theportal.wiki/wiki/Basic_Mathematics_(Book)
- Velleman 3e: https://www.schweitzer-online.de/buch/Velleman/How-Prove-It/9781108439534/A49195648/
- Hammack 3e: https://richardhammack.github.io/BookOfProof/
- Stewart ET 8e: https://www.cengage.com/c/calculus-early-transcendentals-8e-stewart/9781305482463 and https://advise.chem.umn.edu/sites/advise.chem.umn.edu/files/files/math_1271-1272-2263_text_toc_stewart_calculus_early_transcendentals_8th_ed.pdf
- Spivak, Calculus 4e: https://proofwiki.org/wiki/Book:Michael_Spivak/Calculus/Fourth_Edition
- Hubbard–Hubbard 5e: https://matrixeditions.com/UnifiedApproach5thedSamples.html
- MIT 18.02SC: https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/
- Strang 5e: https://math.mit.edu/~gs/linearalgebra/ila5/; MIT 18.06 lectures: https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/
- Lovász–Pelikán–Vesztergombi: https://ereader.exlibris.ch/de/buecher-buch/englische-ebooks/laszlo-lovasz/discrete-mathematics/id/9780387217772
- Rosen 8e: https://ebookschoice.com/product/discrete-mathematics-and-its-applications-8th-edition-by-kenneth-rosen-isbn-13-978-1259676512/
- Boyce–DiPrima–Meade 11e: https://campusstore.miamioh.edu/elementary-differential-equations-boundary/bk/9781119443766
- Abbott (chapter titles): https://www.springerprofessional.de/en/understanding-analysis/13639360
- Rudin 3e: https://campusstore.miamioh.edu/principles-mathematical-analysis-3rd/bk/9780070542358
- Axler (4e chapters; 3e sections): https://textbooks.aimath.org/textbooks/approved-textbooks/axler/ and https://linear.axler.net/Contents.pdf
- Hoffman–Kunze 2e: https://archive.org/details/linear-algebra-hoffman-and-kunze
- Artin 2e: https://www.pearson.com/en-us/subject-catalog/p/algebra-classic-version/P200000006078/9780137980994
- Dummit–Foote 3e: https://archive.org/details/david-s-dummit-richard-m-foote-abstract-algebra
- Munkres, Topology 2e: https://archive.org/details/james-r.-munkres-topology
- Blitzstein–Hwang 2e: https://www.routledge.com/Introduction-to-Probability-Second-Edition/Blitzstein-Hwang/p/book/9781138369917
- Grimmett–Welsh 2e: https://proofwiki.org/wiki/Book:Geoffrey_Grimmett/Probability:_An_Introduction/Second_Edition
- Spivak, Calculus on Manifolds: https://archive.org/details/SpivakM.CalculusOnManifolds
- Munkres, Analysis on Manifolds: https://archive.org/details/MunkresJ.R.AnalysisOnManifoldsTotal
- Niven–Zuckerman–Montgomery 5e: https://proofwiki.org/wiki/Book:Ivan_Niven/An_Introduction_to_the_Theory_of_Numbers/Fifth_Edition
- Ireland–Rosen 2e: https://www.schweitzer-online.de/en/buch/Ireland/Classical-Introduction-Modern-Number-Theory/9780387973296/B107207/
- Armstrong, Basic Topology: https://archive.org/details/basictopologyarmstrong
- Stein–Shakarchi, Complex Analysis: https://press.princeton.edu/books/hardcover/9780691113852/complex-analysis
- Ahlfors 3e: https://campusstore.miamioh.edu/complex-analysis-introduction-theory/bk/9780070006577
- Hirsch–Smale–Devaney 3e: https://shop.elsevier.com/books/differential-equations-dynamical-systems-and-an-introduction-to-chaos/hirsch/978-0-12-382010-5
- Strogatz (2e chapters, 3e sections): https://www.schweitzer-online.de/en/buch/Strogatz/Nonlinear-Dynamics-Chaos/9780813349107/A3895917/ and https://www.routledge.com/Nonlinear-Dynamics-and-Chaos/Strogatz/p/book/9780367026509
- Stein–Shakarchi, Fourier Analysis: https://press.princeton.edu/books/hardcover/9780691113845/fourier-analysis
- Strauss 2e: https://www.booktopia.com.au/partial-differential-equations-walter-a-strauss/book/9780470054567.html
- Stanley, EC1: https://math.mit.edu/~rstan/ec/ec1toc.html and https://assets.cambridge.org/97811076/02625/excerpt/9781107602625_excerpt.pdf
- Diestel: https://www.diestel-graph-theory.com/Contents.pdf
- Enderton, Logic 2e: https://shop.elsevier.com/books/catalog/isbn/9780080496467 (and a hosted copy of the contents pages)
- Enderton, Elements of Set Theory: https://shop.elsevier.com/books/elements-of-set-theory/enderton/978-0-08-057042-6
- Süli–Mayers: https://www.schweitzer-online.de/en/buch/Sueli/Introduction-Numerical-Analysis/9780521810265/A2194528/
- Trefethen–Bau: https://people.maths.ox.ac.uk/trefethen/lafront.ps
- Sipser 3e: https://www.cengage.co.in/book-list/ebook/introduction-to-the-theory-of-computation-66 and https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/pages/readings/

Practice URLs: all 31 links in the JSON loaded when checked. Desmos and Alcumus returned only the app shell, and the Lean Natural Number Game returned only the "Lean Game Server" shell.

## Could not verify

- **Gelfand–Saul, Trigonometry**: Springer blocked the chapter list. Cited by chapter topic only.
- **do Carmo, Curves and Surfaces**: only chapter 1 was confirmed. Chapters 1–4 are cited at chapter level from the standard layout (Curves; Regular Surfaces; The Geometry of the Gauss Map; The Intrinsic Geometry of Surfaces).
- **Stitz–Zeager 4i**: the chapter and section numbers were not printed. Cited by chapter title.
- **Section numbers not confirmed for these editions**: Abbott 2e, Axler 4e, Hubbard–Hubbard 5e, Stanley EC1 2e (sections after 1.1), Sipser (section titles). These are cited at chapter level.
- **Lovász–Pelikán–Vesztergombi**: the chapter numbers were inferred from order, so chapter titles are given too.
- **Diestel**: the contents file did not state its edition.
- **Khan Academy**: the unit titles and URLs were blocked by a bot check, so no Khan practice links are included.
- **Harvard Stat 110** returned 403 and was left out, so the probability module has no practice link.
- **Web search budget**: it ran out before Gelfand–Saul and do Carmo could be searched again.

---

# Mathematics, tiers 5–6: the qualifying exams

Slice: tier 5 `qualifier-1` (950 cards, 78 units) and tier 6 `qualifier-2` (650 cards, 53 units, milestone "Quals"). No tier or module budget was changed.

Card mix across both tiers: problem 29%, definition 20%, theorem 20%, proof-idea 15%, example and counterexample 15%, formula, landmark and misconception 1%.

## Tier 5 — Qualifier I: algebra and analysis

**Rationale.** Written quals at Harvard, Michigan and UCLA test algebra and analysis as separate papers that students prepare for at the same time. So this tier alternates analysis and algebra blocks of 41–60 cards: 9 analysis blocks and 8 algebra blocks, starting with measure theory. The analysis track runs measure → Lᵖ/Fourier → functional analysis → complex analysis II; the algebra track runs groups → rings and modules → fields → representations, with the last two field-theory units after the representation units. The tier ends with a 77-card mock exam made from the eight `qual-practice` units, with algebra and analysis alternating. Gaps against the syllabi were folded into existing modules: category theory, commutative algebra, conditional expectation and the central limit theorem, Phragmén–Lindelöf, and algebraic closures. Algebraic geometry, a Harvard qual subject, has no module in the fixed skeleton and is flagged as an open gap.

### Coverage matrix (tier 5)

Source tags: **H** Harvard syllabus · **B-P** Berkeley prelim syllabus · **B-Q** Berkeley QE (sample public student syllabi) · **M593/M594/M596/M597** Michigan QR syllabi · **U-Alg/U-An** UCLA qual syllabi · **P** Princeton generals (department description, the student-compiled standard questions, sample reports). "Earlier tier" means a bare module slug from tiers 0–4.

| Source topic | Covered by units |
|---|---|
| H Algebra: Sylow theorems, p-groups, solvable groups, free groups | group-theory/sylow-applications, group-theory/p-groups, group-theory/nilpotent-and-solvable-groups, group-theory/free-groups-presentations |
| H Algebra: tensor products, determinants | rings-modules/tensor-products, rings-modules/exterior-powers-determinants |
| H Algebra: Jordan canonical form, PIDs, UFDs, polynomial rings | Earlier tier (algebra-2, linear-algebra-2); drilled again in rings-modules/qual-practice |
| H Algebra: splitting fields, separable and inseparable extensions | fields-galois/separability-and-normality |
| H Algebra: fundamental theorem of Galois theory, finite fields, cyclotomic fields | fields-galois/galois-correspondence-computations, fields-galois/finite-and-cyclotomic-fields |
| H Algebra: character theory, induced representations, structure of the group ring | finite-group-representations/characters-and-orthogonality, …/character-tables, …/induction-frobenius-reciprocity, rings-modules/semisimple-rings-artin-wedderburn |
| H Algebra: Lie groups and Lie algebras (exponential map, nilpotent and semisimple Lie algebras) | **Gap in the tier-5 skeleton. Closed in tier 6** by smooth-manifolds/matrix-lie-groups and a new unit, smooth-manifolds/lie-algebras-structure (Engel, Lie, Killing form, Cartan's criteria, sl₂) |
| H Algebraic geometry: affine and projective varieties, regular maps, cones and projections | **Open gap.** The fixed skeleton has no algebraic-geometry module. A later tier should add one |
| H AG: projective space and the Grassmannian | Partial: Grassmannians as manifolds in smooth-manifolds/manifolds-and-smooth-maps. Open as varieties |
| H AG: ideals of varieties, Nullstellensatz | rings-modules/integral-extensions-nullstellensatz |
| H AG: rational functions and maps, blowing up | **Open gap** |
| H AG: dimension and degree, Hilbert function and polynomial | Partial: Krull dimension (rings-modules/noetherian-rings-and-modules) and transcendence degree (fields-galois/transcendence-degree). Hilbert polynomial is open |
| H AG: smooth and singular points, Zariski tangent space, tangent cones, dual varieties | **Open gap** |
| H AG: families, Chow varieties, Hilbert schemes | **Open gap** (research level) |
| H AG: curves — genus, plane-curve genus formula, Riemann–Hurwitz, Riemann–Roch | complex-analysis-2/riemann-surfaces-basics covers genus, (d−1)(d−2)/2 and Riemann–Hurwitz. Riemann–Roch is open |
| H Complex: holomorphic and meromorphic functions | Earlier tier (complex-analysis-1); meromorphic families in complex-analysis-2/normal-families-montel |
| H Complex: conformal maps, linear fractional transformations, Schwarz's lemma | Earlier tier (complex-analysis-1); complex-analysis-2/riemann-mapping-theorem |
| H Complex: Cauchy's theorem and integral formula, residues | Earlier tier (complex-analysis-1); used in complex-analysis-2/gamma-and-zeta and …/qual-practice |
| H Complex: harmonic functions (mean value property, reflection principle, Dirichlet problem) | complex-analysis-2/harmonic-functions-dirichlet |
| H Complex: Laurent series, partial fractions, canonical products | complex-analysis-2/infinite-products-weierstrass, …/mittag-leffler-partial-fractions |
| H Complex: Gamma, zeta and elliptic functions | complex-analysis-2/gamma-and-zeta, …/elliptic-functions |
| H Complex: basics of Riemann surfaces | complex-analysis-2/analytic-continuation-monodromy, …/riemann-surfaces-basics |
| H Complex: Riemann mapping theorem, Picard theorems | complex-analysis-2/riemann-mapping-theorem, …/picard-theorems |
| H Real: convergence theorems, Borel measures, Riesz representation | measure-integration/convergence-theorems, …/change-of-variables-regularity, lp-fourier-distributions/riesz-representation-radon-measures |
| H Real: Lᵖ spaces, duality, Jensen's inequality | lp-fourier-distributions/lp-spaces-inequalities, …/lp-duality |
| H Real: Lebesgue differentiation, Fubini, Hilbert spaces | measure-integration/differentiation-maximal-function, …/product-measures-fubini, functional-analysis/hilbert-spaces |
| H Real: complex measures of bounded variation, Radon–Nikodym | measure-integration/signed-measures-radon-nikodym, …/bounded-variation-absolute-continuity |
| H Real: Fourier series, Fourier transform, convolution | lp-fourier-distributions/fourier-transform-plancherel, …/convolution-approximate-identities |
| H Real: heat equation, Dirichlet problem, fundamental solutions, maximum principle | lp-fourier-distributions/fundamental-solutions, complex-analysis-2/harmonic-functions-dirichlet |
| H Real: law of large numbers, central limit theorem, conditional probability and expectation | measure-integration/probability-borel-cantelli-lln (LLN, conditional expectation). **The CLT was a gap in the skeleton, closed** by a new unit, lp-fourier-distributions/central-limit-theorem |
| H Real: distributions, Sobolev embedding | lp-fourier-distributions/distributions, …/sobolev-spaces-embedding |
| B-P Calculus: derivatives of maps Rᵐ→Rⁿ, Lagrange multipliers, line and surface integrals, Green/Gauss/Stokes, simple ODEs | Earlier tier (calculus-1, calculus-2, multivariable-calculus, differential-equations-1); Stokes revisited in de-rham/orientation-integration-stokes (tier 6) |
| B-P Classical analysis: metric-space topology, uniform convergence, power series, M-test, improper integrals, compactness in function spaces, inverse/implicit functions, ODE existence, Fourier series | Earlier tier (real-analysis-1, point-set-topology, analysis-in-rn, ode-dynamics, fourier-intro-pde); Arzelà–Ascoli reused in complex-analysis-2/normal-families-montel |
| B-P Abstract algebra: groups, actions, Sylow and applications, finitely generated abelian groups, rings, ideals, PIDs, UFDs, finite fields | Earlier tier (abstract-algebra-1, algebra-2); applications in group-theory/sylow-applications and fields-galois/finite-and-cyclotomic-fields |
| B-P Linear algebra: canonical forms, inner product spaces, quadratic forms | Earlier tier (linear-algebra-1, linear-algebra-2) |
| B-P Complex analysis: Cauchy theory, Laurent series, singularities, maximum principle, Schwarz, Rouché, harmonic functions, residues, Möbius maps | Earlier tier (complex-analysis-1) |
| B-Q PDE minor (sample syllabus): distributions, Fourier transform, Sobolev spaces, Laplace/heat/wave fundamental solutions | lp-fourier-distributions/distributions, …/sobolev-spaces-embedding, …/fundamental-solutions |
| B-Q PDE minor: nonlinear first-order PDE, elliptic and parabolic theory, calculus of variations, Hamilton–Jacobi | **Open gap.** This is a PDE specialty, not part of the qual core |
| M593: commutative rings, PIDs, UFDs, fraction fields, modules, free modules | Earlier tier (algebra-2); chain conditions in rings-modules/noetherian-rings-and-modules |
| M593: finitely generated modules over a PID, rational and Jordan forms | Earlier tier (algebra-2, linear-algebra-2); exercised in rings-modules/qual-practice |
| M593: spectral theorem, Sylvester's law, alternating forms | Earlier tier (linear-algebra-2) |
| M593: tensor products of modules, exterior algebra, determinants | rings-modules/tensor-products, …/exterior-powers-determinants |
| M594: characteristic subgroups, automorphisms, direct and semidirect products, non-split extensions | group-theory/semidirect-products |
| M594: group actions, simplicity of Aₙ | group-theory/simplicity-of-an |
| M594: Sylow theorems | group-theory/sylow-applications |
| M594: commutator subgroup, series, solvable and nilpotent groups, p-groups, groups with operators, Jordan–Hölder, Krull–Schmidt | group-theory/p-groups, …/nilpotent-and-solvable-groups, …/composition-series-jordan-holder |
| M594: free groups and presentations | group-theory/free-groups-presentations |
| M594: simple, algebraic, separable, purely inseparable extensions; primitive element; norm and trace | fields-galois/separability-and-normality, …/kummer-theory-hilbert-90 |
| M594: existence and non-uniqueness of algebraic closures | **Gap, closed** by adding it to fields-galois/separability-and-normality |
| M594: splitting fields, normal and Galois extensions, independence of characters, fundamental correspondence | fields-galois/separability-and-normality, …/galois-correspondence-computations |
| M594: cyclotomic extensions, finite fields, solvability by radicals, S_p as a Galois group over Q | fields-galois/finite-and-cyclotomic-fields, …/radical-extensions-solvability, …/reduction-mod-p-and-sn |
| M594: transcendence bases and degree (Lüroth optional) | fields-galois/transcendence-degree |
| M596 items 1–8: Cauchy theory, local properties, Riemann sphere, Schwarz, conformal maps, argument principle, residues | Earlier tier (complex-analysis-1); Riemann mapping in complex-analysis-2/riemann-mapping-theorem; Picard in complex-analysis-2/picard-theorems |
| M596 items 9–10: Arzelà–Ascoli, Montel, Hurwitz, Poisson integral, Schwarz reflection, infinite products | complex-analysis-2/normal-families-montel, …/harmonic-functions-dirichlet, …/infinite-products-weierstrass |
| M597: abstract measures, outer measure, Carathéodory, product measures, Fubini–Tonelli | measure-integration/outer-measure-caratheodory, …/product-measures-fubini |
| M597: Lebesgue measure in Rⁿ, approximation, Borel sets, non-measurable sets | measure-integration/lebesgue-measure |
| M597: measurable functions, Egorov, Lusin | measure-integration/measurable-functions-littlewood |
| M597: convergence theorems, change of variables in Rⁿ, bounded variation | measure-integration/convergence-theorems, …/change-of-variables-regularity, …/bounded-variation-absolute-continuity |
| M597: Hölder, Minkowski, Lᵖ and L^∞, dual of Lᵖ | lp-fourier-distributions/lp-spaces-inequalities, …/lp-duality |
| M597: signed and complex measures, Hahn and Jordan decompositions, Radon–Nikodym | measure-integration/signed-measures-radon-nikodym |
| M597: Hardy–Littlewood maximal function, Lebesgue differentiation, fundamental theorem of calculus | measure-integration/differentiation-maximal-function, …/bounded-variation-absolute-continuity |
| U-Alg Groups: isomorphism theorems, automorphism, symmetric and linear groups, actions, Sylow, free groups and presentations, composition series, nilpotent and solvable groups, semidirect products and extensions | all group-theory units; linear groups in group-theory/simplicity-of-psl2 |
| U-Alg Rings and modules: ideals, PIDs, UFDs, Gauss and Eisenstein, modules over a PID | Earlier tier (algebra-2) |
| U-Alg Rings and modules: duality, tensor products, localization, Nakayama, torsion and rank, chain conditions, exterior powers and determinants | rings-modules/tensor-products, …/localization, …/noetherian-rings-and-modules, …/exterior-powers-determinants |
| U-Alg Fields: algebraic and transcendental, separable, inseparable and normal, algebraic closure, Galois, cyclotomic, finite fields, radicals, norm, trace and discriminant, Hilbert 90, Kummer theory | all fields-galois units |
| U-Alg Category theory: functors (full, faithful), mono/epi, natural transformations, Yoneda, representable and adjoint functors, equivalences, limits and colimits | **Gap in the skeleton, closed** by folding it into rings-modules/exact-sequences-and-functors |
| U-Alg Homological algebra: exact sequences, splitting, snake and five lemmas, projective/injective/flat, complexes and (co)homology | rings-modules/exact-sequences-and-functors, …/projective-injective-flat |
| U-Alg Commutative rings: localization, Hilbert basis theorem, integral extensions, radicals, Zariski topology, Nullstellensatz, Dedekind rings and DVRs | rings-modules/localization, …/noetherian-rings-and-modules, and a new unit, …/integral-extensions-nullstellensatz |
| U-Alg Noncommutative rings: graded algebras, endomorphism and group rings, semisimple rings, central simple algebras, Artin–Wedderburn, Jacobson radical | rings-modules/semisimple-rings-artin-wedderburn; graded algebras in …/exterior-powers-determinants |
| U-Alg Representations: regular and trivial, Schur, Maschke, characters, orthogonality, character tables, induced characters | all finite-group-representations units |
| U-An Real: Lebesgue measure (incl. Rⁿ), abstract measures, Carathéodory–Hahn, Lebesgue–Stieltjes | measure-integration/outer-measure-caratheodory, …/lebesgue-measure |
| U-An Real: Lebesgue integration, MCT/DCT/Fatou, Lusin and Egorov, products and Fubini | measure-integration/convergence-theorems, …/measurable-functions-littlewood, …/product-measures-fubini |
| U-An Real: signed measures, Hahn/Jordan, Radon–Nikodym, Lebesgue decomposition | measure-integration/signed-measures-radon-nikodym |
| U-An Real: change of variables; covering lemmas, maximal function, Lebesgue differentiation; BV and the fundamental theorem of calculus; regularity of Borel measures | measure-integration/change-of-variables-regularity, …/differentiation-maximal-function, …/bounded-variation-absolute-continuity |
| U-An Real: Banach spaces, Hahn–Banach, dual spaces, weak and weak* topologies, Banach–Alaoglu | functional-analysis/normed-and-banach-spaces, …/hahn-banach, …/weak-topologies-alaoglu |
| U-An Real: Lᵖ, Hölder, Jensen, Riesz representation for Lᵖ and for C(X); Arzelà–Ascoli, Stone–Weierstrass | lp-fourier-distributions/lp-spaces-inequalities, …/lp-duality, …/riesz-representation-radon-measures; Arzelà–Ascoli and Stone–Weierstrass in earlier tiers (real-analysis-1, point-set-topology) |
| U-An Real: Hilbert spaces, orthonormal bases, Riesz representation | functional-analysis/hilbert-spaces |
| U-An Real: convolution, approximate identities, distribution functions and weak Lᵖ, trigonometric series, Fourier transform, Parseval/Plancherel, Riemann–Lebesgue | lp-fourier-distributions/convolution-approximate-identities, …/maximal-function-interpolation, …/fourier-transform-plancherel |
| U-An Complex: holomorphic functions, ∂ and ∂̄, Goursat, Cauchy, Morera, Liouville, max principle, open mapping, Möbius maps, Schwarz and the hyperbolic metric, winding numbers, Laurent series, Casorati–Weierstrass, residues, argument principle, Rouché | Earlier tier (complex-analysis-1); Schwarz–Pick drilled in complex-analysis-2/qual-practice |
| U-An Complex: normal families, conformal maps, Riemann mapping, Schwarz reflection, Hurwitz | complex-analysis-2/normal-families-montel, …/riemann-mapping-theorem, …/harmonic-functions-dirichlet |
| U-An Complex: harmonic functions (conjugates, Poisson integrals, Dirichlet problem, Harnack, subharmonic functions) | complex-analysis-2/harmonic-functions-dirichlet |
| U-An Complex: infinite products, Mittag-Leffler, analytic continuation and monodromy, Picard | complex-analysis-2/infinite-products-weierstrass, …/mittag-leffler-partial-fractions, …/analytic-continuation-monodromy, …/picard-theorems |
| P Algebra standard questions: finitely generated abelian groups, CRT, UFD versus PID, modules over a PID, canonical forms | Earlier tier (algebra-2, linear-algebra-2); rings-modules/qual-practice |
| P Algebra: Galois group of X⁵ − 2, fundamental theorem, finite fields, cyclic F_q^× | fields-galois/galois-correspondence-computations, …/finite-and-cyclotomic-fields, …/qual-practice |
| P Algebra: Schur's lemma, Maschke's theorem | finite-group-representations/representations-and-maschke |
| P Algebra (sample reports): free groups and finite-index subgroups, A₅, symmetry groups of solids, S₅ and A₅ as Galois groups, groups of order 15, Sylow | group-theory/free-groups-presentations, …/simplicity-of-an, …/sylow-applications, fields-galois/reduction-mod-p-and-sn |
| P Real: measurable and Borel sets, MCT, DCT, Fatou, containment of Lᵖ in L^q, completeness of Lᵖ, Hölder | measure-integration/lebesgue-measure, …/convergence-theorems, lp-fourier-distributions/lp-spaces-inequalities |
| P Real: image of L¹ under the Fourier transform, Plancherel, test functions and distributions | lp-fourier-distributions/fourier-transform-plancherel, …/distributions |
| P Real: Baire category theorem | functional-analysis/baire-category-consequences |
| P Real: Dini's theorem, existence theorem for ODEs | Earlier tier (real-analysis-1, ode-dynamics) |
| P Complex: Arzelà–Ascoli, Riemann mapping theorem, conformal equivalence of annuli, little Picard | complex-analysis-2/normal-families-montel, …/riemann-mapping-theorem, …/picard-theorems |
| P Complex: Phragmén–Lindelöf | **Gap, closed** by adding it to complex-analysis-2/harmonic-functions-dirichlet |
| P Complex: Schwarz lemma, Liouville, argument principle, Morera, essential singularities, Casorati–Weierstrass, residues | Earlier tier (complex-analysis-1) |
| P Complex (sample reports): SL₂(Z) acting on H, complex tori, Aut(C) and Aut(Ĉ), Gamma function, principal parts | complex-analysis-2/elliptic-functions, …/riemann-mapping-theorem, …/gamma-and-zeta, …/mittag-leffler-partial-fractions |

None of the five sources names compact operators, the spectral theorem or the Fredholm alternative. Those units (functional-analysis/compact-operators, …/spectral-theorem, …/fredholm-alternative) come from the fixed skeleton and its texts (Brezis ch. 6; Conway ch. II, VII, IX, XI). Every `qual-practice` unit draws on the rows above for its module.

## Tier 6 — Qualifier II: geometry and topology

**Rationale.** Geometry/topology quals (Michigan 591/592, UCLA 225ABC, Harvard's algebraic topology and differential geometry papers) pair a smooth-manifolds course with an algebraic-topology course, so the tier first interleaves smooth-manifolds and homology unit by unit. De Rham theory comes next, before cohomology, so that Poincaré duality, Künneth and the de Rham theorem are seen from both the smooth and the singular side. Bundles and connections then come before Riemannian geometry, because the Levi-Civita connection is one case of a connection on a vector bundle. The tier ends with a 63-card mock exam made from the six `qual-practice` units (milestone: Quals). Harvard lists basic Lie algebras under algebra, and the tier-5 skeleton has no place for them, so a short unit on Lie algebra structure follows matrix Lie groups.

### Coverage matrix (tier 6)

| Source topic | Covered by units |
|---|---|
| H Algebraic topology: fundamental groups, covering spaces | Earlier tier (fundamental-group); used in homology/coefficients-and-euler-characteristic and cohomology-homotopy/homotopy-groups |
| H AT: higher homotopy groups | cohomology-homotopy/homotopy-groups |
| H AT: fibrations and their long exact sequence | cohomology-homotopy/fibrations-long-exact-sequence |
| H AT: singular homology and cohomology, relative homology | homology/simplicial-and-singular-homology, …/exact-sequences-excision, cohomology-homotopy/cohomology-universal-coefficients |
| H AT: CW complexes and their homology | homology/cw-complexes, …/cellular-homology |
| H AT: Mayer–Vietoris, universal coefficient theorem, Künneth formula | homology/mayer-vietoris, cohomology-homotopy/cohomology-universal-coefficients, …/cup-products-cohomology-rings; de Rham Künneth in de-rham/compact-support-poincare-duality |
| H AT: Poincaré duality, Lefschetz fixed point formula, Hopf index theorem | cohomology-homotopy/poincare-duality, homology/lefschetz-fixed-point, cohomology-homotopy/lefschetz-via-cohomology, de-rham/poincare-hopf |
| H AT: Čech and de Rham cohomology and their equivalence with singular cohomology | de-rham/de-rham-cohomology-poincare-lemma, cohomology-homotopy/de-rham-vs-singular |
| H Differential geometry: inverse and implicit function theorems, submanifolds, integration on manifolds | smooth-manifolds/immersions-submersions-rank, de-rham/orientation-integration-stokes |
| H DG: matrix Lie groups GL(n), SO(n), U(n), SU(n) — manifold structure, Lie algebras, invariant fields and forms, exponential map | smooth-manifolds/matrix-lie-groups |
| H DG: real and complex vector bundles; tangent and cotangent bundles; dual, tensor, exterior, direct sum and pullback bundles | smooth-manifolds/tangent-and-vector-bundles, bundles-connections/associated-bundles |
| H DG: differential forms, exterior derivative, de Rham cohomology, pullback | de-rham/differential-forms-exterior-derivative, …/de-rham-cohomology-poincare-lemma |
| H DG: metrics on vector bundles, Riemannian metrics, existence and uniqueness of geodesics | bundles-connections/associated-bundles, riemannian-geometry/metrics-and-levi-civita, …/geodesics-exponential-map |
| H DG: principal bundles for matrix groups, associated vector bundles | bundles-connections/principal-bundles, …/associated-bundles |
| H DG: covariant derivatives on vector bundles, connections on principal bundles and how they correspond | bundles-connections/covariant-derivatives-connections |
| H DG: curvature, flat connections, parallel transport | bundles-connections/curvature, …/parallel-transport-holonomy-flat |
| H DG: Levi-Civita connection, properties of the Riemann curvature tensor | riemannian-geometry/metrics-and-levi-civita, …/curvature-tensors |
| H Algebra: Lie groups and Lie algebras (carried over from tier 5) | smooth-manifolds/matrix-lie-groups, smooth-manifolds/lie-algebras-structure |
| M591: product and quotient topology, CW complexes, group actions, topological groups, topological manifolds | Earlier tier (point-set-topology); homology/cw-complexes |
| M591: smooth manifolds, manifolds with boundary, smooth maps, partitions of unity | smooth-manifolds/manifolds-and-smooth-maps |
| M591: tangent vectors, differentials, tangent bundle | smooth-manifolds/tangent-and-vector-bundles |
| M591: submersions, immersions, embeddings, submanifolds | smooth-manifolds/immersions-submersions-rank |
| M591: Sard's theorem, Whitney embedding, transversality | smooth-manifolds/sard-transversality-morse, …/whitney-embedding-tubular |
| M591: Lie groups, vector fields, Lie brackets, Lie algebras | smooth-manifolds/vector-fields-flows, …/matrix-lie-groups |
| M591: multilinear algebra, vector bundles, differential forms, exterior derivative, orientation | rings-modules/exterior-powers-determinants, smooth-manifolds/tangent-and-vector-bundles, de-rham/differential-forms-exterior-derivative, …/orientation-integration-stokes |
| M591: de Rham groups, homotopy invariance, degree theory | de-rham/de-rham-cohomology-poincare-lemma, …/degree-theory |
| M592: fundamental groups, van Kampen, covering spaces, graphs and free groups | Earlier tier (fundamental-group); Nielsen–Schreier in group-theory/free-groups-presentations |
| M592: cell, simplicial and Δ-complexes, approximation theorems | homology/cw-complexes, …/simplicial-and-singular-homology, …/lefschetz-fixed-point (simplicial approximation), cohomology-homotopy/homotopy-groups (cellular approximation) |
| M592: simplicial and singular homology, relative homology, excision, Mayer–Vietoris, Euler characteristic, degrees of sphere maps | homology/simplicial-and-singular-homology, …/exact-sequences-excision, …/mayer-vietoris, …/cellular-homology, …/degree-and-applications |
| M592: Hurewicz for H₁, Eilenberg–Steenrod axioms, Brouwer and Lefschetz fixed point theorems | homology/simplicial-and-singular-homology, …/exact-sequences-excision, …/lefschetz-fixed-point |
| U-GT 225A: smooth manifolds and maps; inverse and implicit functions, submersions, immersions, submanifolds | smooth-manifolds/manifolds-and-smooth-maps, …/immersions-submersions-rank |
| U-GT 225A: tangent and cotangent bundles, vector bundles | smooth-manifolds/tangent-and-vector-bundles |
| U-GT 225A: differential forms, exterior derivative, Lie derivatives | de-rham/differential-forms-exterior-derivative |
| U-GT 225A: integration, Stokes, de Rham cohomology, Mayer–Vietoris computations | de-rham/orientation-integration-stokes, …/de-rham-cohomology-poincare-lemma |
| U-GT 225A: vector fields, integral curves, distributions, Frobenius | smooth-manifolds/vector-fields-flows, …/distributions-frobenius |
| U-GT 225B: Sard, transversality, Whitney embedding, tubular neighborhoods | smooth-manifolds/sard-transversality-morse, …/whitney-embedding-tubular |
| U-GT 225B: intersection theory, degree, vector fields and Poincaré–Hopf, Lefschetz fixed point formula | de-rham/degree-theory, …/intersection-theory-lefschetz, …/poincare-hopf |
| U-GT 225B: compactly supported cohomology, Poincaré duality, Thom isomorphism, Künneth (de Rham) | de-rham/compact-support-poincare-duality |
| U-GT 225B: Hopf degree theorem; Lefschetz numbers of self-maps of spheres, RPⁿ, CPⁿ and tori | de-rham/degree-theory, homology/lefschetz-fixed-point, cohomology-homotopy/lefschetz-via-cohomology |
| U-GT 225C: fundamental group, covering spaces, van Kampen | Earlier tier (fundamental-group) |
| U-GT 225C: singular and simplicial homology, homotopy invariance, relative homology, excision, Mayer–Vietoris, relation to π₁, CW computations | homology/simplicial-and-singular-homology, …/exact-sequences-excision, …/mayer-vietoris, …/cellular-homology |
| U-GT 225C: singular cohomology, universal coefficients, cup products | cohomology-homotopy/cohomology-universal-coefficients, …/cup-products-cohomology-rings |
| B-Q Algebraic topology major (sample): homology, UCT, Brouwer, hairy ball, Borsuk–Ulam | homology/exact-sequences-excision, …/degree-and-applications, …/classical-applications, cohomology-homotopy/cohomology-universal-coefficients |
| B-Q AT major: cup and cap products, Künneth, Poincaré duality, Thom isomorphism | cohomology-homotopy/cup-products-cohomology-rings, …/poincare-duality; Thom isomorphism in de-rham/compact-support-poincare-duality |
| B-Q AT major: higher homotopy groups, Whitehead, cellular and CW approximation, Eilenberg–MacLane spaces, Hurewicz, fiber bundles and fibrations | cohomology-homotopy/homotopy-groups, …/fibrations-long-exact-sequence, …/hurewicz-eilenberg-maclane |
| B-Q AT major: characteristic classes (Stiefel–Whitney, Euler, Chern) | Partial: c₁ and the Euler class through Chern–Weil in bundles-connections/chern-weil-characteristic-classes. Stiefel–Whitney classes are an **open gap**, left for a later tier |
| B-Q Riemannian geometry major (sample): metrics, affine and Riemannian connections, geodesic flow, minimizing geodesics, convex neighborhoods | riemannian-geometry/metrics-and-levi-civita, …/geodesics-exponential-map |
| B-Q RG: sectional and Ricci curvature, second fundamental form and the fundamental equations | riemannian-geometry/curvature-tensors |
| B-Q RG: Jacobi fields, conjugate points, second variation | riemannian-geometry/jacobi-fields-conjugate-points |
| B-Q RG: Hopf–Rinow and Hadamard theorems, constant curvature spaces | riemannian-geometry/hopf-rinow-completeness, …/cartan-hadamard-and-comparison, …/constant-curvature-space-forms |
| B-Q RG: Rauch comparison, Bonnet–Myers, Synge–Weinstein, Preissman | riemannian-geometry/bonnet-myers-and-synge, …/cartan-hadamard-and-comparison (Rauch and Preissman are stated) |
| B-Q Differential topology major (sample): manifolds, (co)tangent bundles, vector fields, brackets, flows, distributions, foliations, immersions and embeddings | smooth-manifolds units |
| B-Q DT major: vector, principal and fiber bundles; tensors, Lie derivative, Cartan's formula, de Rham cohomology, integration and Stokes | bundles-connections/principal-bundles, …/associated-bundles, de-rham units |
| B-Q DT major: connections, torsion, curvature, Bianchi, parallel transport, geodesics, Levi-Civita | bundles-connections units, riemannian-geometry/metrics-and-levi-civita, …/curvature-tensors |
| B-Q DT major: Morse functions | smooth-manifolds/sard-transversality-morse, de-rham/poincare-hopf |
| B-Q DT major: Morse homology, Morse inequalities | **Open gap** (later tier) |
| B-Q Lie algebra minor (sample): solvable and nilpotent algebras, Engel, Lie, Killing form, Cartan's criteria, Jordan decomposition | smooth-manifolds/lie-algebras-structure |
| B-Q Lie algebra minor: root systems, Dynkin diagrams, Weyl's theorem, Casimir, universal enveloping algebra, PBW | **Open gap** (later tier) |
| B-Q Symplectic geometry major (sample) | **Open gap** (a research specialty, beyond the quals) |
| P Advanced topic, algebraic topology (sample reports): Borsuk–Ulam, Euler characteristic and π₁, K(G, n), homotopy groups of spheres, Hopf invariant | homology/classical-applications, …/coefficients-and-euler-characteristic, cohomology-homotopy/hurewicz-eilenberg-maclane, …/homotopy-groups, …/cup-products-cohomology-rings |
| P Algebraic topology: Serre finiteness | **Open gap.** It needs the Serre spectral sequence, which is only stated as a landmark in cohomology-homotopy/fibrations-long-exact-sequence |
| P Advanced topic, differential topology: Sard's theorem, Morse functions | smooth-manifolds/sard-transversality-morse |
| P Differential topology: cancellation of critical points, self-indexing Morse functions, h-cobordism, Poincaré conjecture | **Open gap** (research level; later tier) |
| P Advanced topic, Riemannian geometry: Gauss equation, volume comparison under Ricci bounds | riemannian-geometry/curvature-tensors, …/cartan-hadamard-and-comparison (Bishop–Gromov is stated) |
| P Riemannian geometry: stable minimal hypersurfaces | **Open gap** (needs second variation of area; later tier) |

## Sources checked

Qualifying-exam syllabi and pages:
- Harvard qualifying exam syllabus — https://www.math.harvard.edu/graduate/study-the-qualifying-exam/the-qualifying-exam-syllabus/
- Harvard past qualifying exams (used for practice links) — https://people.math.harvard.edu/quals/index.html
- Berkeley preliminary exam page — https://math.berkeley.edu/programs/graduate/prelim-exams
- Berkeley prelim syllabus PDF (read via text extraction) — https://math.berkeley.edu/sites/default/files/bulk_8/syllabus.pdf
- Berkeley qualifying exam page — https://pantheon.math.berkeley.edu/node/107 (the same text is at https://math.berkeley.edu/graduate/phd-program/qualifying-exam). It lists no topics: syllabi are written by each student and kept in a folder that requires a Berkeley login.
- Two public Berkeley QE syllabi used as stand-ins — https://math.berkeley.edu/~franco/Syllabus.pdf and https://math.berkeley.edu/~nm.eagles/expository%20papers/Quals_Syllabus.pdf
- Michigan Stage 1 requirements — https://prod.lsa.umich.edu/math/graduates/GraduateStudentHandbook/doctoral-programs/ph-d-programs1/ph-d--program-requirements/stage-1.html
- Michigan past QR exams and syllabi — https://prod.lsa.umich.edu/math/graduates/GraduateStudentHandbook/doctoral-programs/ph-d-programs1/ph-d--program-requirements/stage-1/QRExamSchedule/Past_Math_QR_Exams_and_Syllabi.html
- Michigan syllabus PDFs (read via text extraction), all under https://prod.lsa.umich.edu/content/dam/math-assets/math-document/Grad/qr-exams---math/syllabi/ — Algebra%20I%20Syllabus%20593.pdf, Algebra%20II%20Syllabus%20594.pdf, General%20Topology%20Syllabus%20591.pdf, Algebraic%20Topology%20Syllabus%20592.pdf, Complex%20Analysis%20Syllabus%20596.pdf, Real%20Analysis%20Syllabus%20597.pdf
- UCLA qualifying exams page (the Algebra syllabus is on the page itself) — https://ww3.math.ucla.edu/qualifying-exam-dates/
- UCLA Analysis syllabus — https://ww3.math.ucla.edu/wp-content/uploads/2022/06/Analysis-1.pdf
- UCLA Geometry/Topology syllabus — https://ww3.math.ucla.edu/wp-content/uploads/2022/06/Geometry-Topology.pdf
- UCLA past qualifying exams — https://ww3.math.ucla.edu/past-qualifying-exams/
- Princeton generals archive — https://web.math.princeton.edu/generals/. Department requirements are at https://www.math.princeton.edu/node/45: algebra and real and complex analysis, plus two advanced topics. There is no official topic list.
- Princeton standard questions (compiled by students) — https://web.math.princeton.edu/generals/kiran.html. Sample reports: https://web.math.princeton.edu/generals/huang_evan and https://web.math.princeton.edu/generals/stogin_john

Tables of contents used to check chapter and section citations:
- Hatcher: TOC https://pi.math.cornell.edu/~hatcher/AT/at1-tc.html and the chapter 2 PDF https://pi.math.cornell.edu/~hatcher/AT/ATch2.pdf (§2.1–2.3, §2.A–2.C, Borsuk–Ulam in §2.B, Lefschetz in §2.C); book page https://pi.math.cornell.edu/~hatcher/AT/ATpage.html
- Lee, Introduction to Smooth Manifolds (2nd ed.), front matter — https://sites.math.washington.edu/~lee/Books/ISM/front-matter.pdf
- Lee, Introduction to Riemannian Manifolds (2nd ed.) — https://ProofWiki.org/wiki/Book:John_M._Lee/Introduction_to_Riemannian_Manifolds/Second_Edition
- Brezis (sections) — https://ProofWiki.org/wiki/Book:Ha%C3%AFm_Brezis/Functional_Analysis,_Sobolev_Spaces_and_Partial_Differential_Equations
- Conway, A Course in Functional Analysis (sections) — https://proofwiki.org/wiki/Book:John_B._Conway/A_Course_in_Functional_Analysis/Second_Edition
- Stein–Shakarchi, Real Analysis (sections) — https://press.princeton.edu/books/hardcover/9780691113869/real-analysis
- Milne, Fields and Galois Theory v5.10 (chapters) — https://www.jmilne.org/math/CourseNotes/ft.html
- Dummit–Foote, group-theory sections §3.4–§6.3 — https://groupprops.subwiki.org/wiki/Book:DummitFoote
- Bott–Tu §1–§23 — https://ncatlab.org/nlab/show/Differential+Forms+in+Algebraic+Topology
- do Carmo, Riemannian Geometry (chapter list) — https://www.physicsforums.com/threads/riemannian-geometry-by-do-carmo.665774/. The 0-based chapter numbering was checked against an Oxford reading list that cites "§0–7".
- Durrett, Probability: Theory and Examples (5th ed.) — https://sites.math.duke.edu/~rtd/PTE/pte.html
- Practice resources — https://people.maths.bris.ac.uk/~matyd/GroupNames/ and https://www.lmfdb.org/GaloisGroup/
- Confirmed only through search-result listings from publishers, library catalogs and booksellers: Serre §1–§9; Fulton–Harris Part I (Lectures 1–2 by title); Lieb–Loss ch. 1–12; Taubes ch. 10–14; J. M. Lee, GSM 107 chapter order; Bredon ch. I–VII; Rotman ch. 5, 7, 8, 11; Conway, Functions of One Complex Variable I, ch. VII–XII; Guillemin–Pollack ch. 1–4; Folland ch. 3, 6, 8, 9 and §7.1–7.3; Ahlfors ch. 5.

Not verified (cited at chapter level only, from standard knowledge): Lang's chapter numbers; Dummit–Foote chapters 10–19 (consistent with Harvard's "excluding chapters 15–17"); Ahlfors ch. 4 and 6–8; Folland ch. 2, 5 and 10; Fulton–Harris Lectures 3–4 and 7–10 (Harvard itself cites "chapters 7–10" for Lie theory); the letters on Hatcher's chapter 3–4 additional topics, which are cited by name. The web-search budget ran out before these could be checked.

---

# Mathematics, tiers 7–9: advanced graduate and research frontier

Part file: `mathematics-3.json`, with 25 modules and 169 units. Card counts: tier 7 has 800, tier 8 has 740 and tier 9 has 300, for 1,840 in total. Every tier, module and unit budget is unchanged from the skeleton.
Unit names below use the form `module/unit`. Bare slugs (for example `rings-modules`) are modules from tiers 0–6 that other agents write.
Gap markers: **Gap (closed)** means the gap was filled by an added unit, key term or extra text. **Gap (partial)** means it is covered only at the level of statements or key terms. **Gap (deliberate)** means it is left out, with the reason given.

---

## Tier 7: Advanced graduate I (800 cards)

**Rationale.** Tier 7 is the algebra half of a PhD qualifying exam. It follows the prescribed chains: rings, then commutative algebra, varieties and schemes; homological algebra before sheaf cohomology; commutative algebra, then algebraic number theory, then elliptic curves. Lie theory and analytic number theory run alongside. The teaching order interleaves 17 single-module blocks of 40–60 cards that rotate through algebra, Lie theory, number theory and geometry, and every prerequisite stays earlier. The regular-local-rings unit comes before Ext/Tor: Serre's regularity criterion is stated there and proved in the derived-functors unit. Problem-heavy modules carry 20–22% oral-exam problems; category theory and analytic number theory carry 10–13%.

Teaching-order blocks (cards): commutative algebra 50, Lie 40, category 45, analytic NT 40, commutative algebra 50, Lie 40, homological 45, algebraic NT 55, varieties 45, analytic NT 40, Lie 40, algebraic NT 55, varieties 45, elliptic curves 45, schemes 60, modular forms 45, schemes 60.

### Coverage matrix, tier 7

| Source topic | Covered by units |
|---|---|
| Skeleton, commutative algebra: Nullstellensatz; primary decomposition; going-up/down; Krull dimension; Dedekind domains; completion; regular rings | commutative-algebra/noetherian-rings-nullstellensatz; /primary-decomposition; /integral-extensions; /krull-dimension; /dvrs-dedekind-domains; /completion-hensel; /regular-local-rings |
| Skeleton, category and homological algebra: adjunctions; Yoneda; abelian categories; Ext and Tor; spectral sequences; group cohomology; derived categories | category-homological-algebra/limits-adjunctions; /yoneda-universal-properties; /abelian-categories; /derived-functors-ext-tor; /spectral-sequences; /group-cohomology; /derived-categories |
| Skeleton, varieties: projective varieties; rational maps; blow-ups; dimension and degree; Hilbert polynomial; Riemann–Hurwitz; Riemann–Roch | varieties-curves/affine-projective-varieties; /morphisms-rational-maps; /blow-ups-resolution; /dimension-degree-hilbert (dimension, degree, Hilbert polynomial); /riemann-hurwitz-genus; /riemann-roch-curves |
| Skeleton, schemes: sheaves; Spec and Proj; separated, proper and flat morphisms; quasi-coherent sheaves; line bundles; sheaf cohomology; Serre duality | schemes-cohomology/sheaves; /spec-affine-schemes; /proj-and-gluing; /separated-proper-morphisms; /flat-smooth-morphisms; /quasi-coherent-sheaves; /line-bundles-divisors; /sheaf-cohomology; /cohomology-projective-space; /serre-duality-applications |
| Skeleton, algebraic NT: ideal factorization; class group; unit theorem; ramification and Frobenius; local fields; class field theory (statements) | algebraic-number-theory/ideal-factorization; /minkowski-class-group; /dirichlet-unit-theorem; /ramification-frobenius; /p-adic-numbers-local-fields; /extensions-local-fields; /adeles-ideles; /class-field-theory-statements |
| Skeleton, analytic NT: Dirichlet L-functions; PNT and zero-free region; Dirichlet's theorem; explicit formula; sieves | analytic-number-theory/dirichlet-characters-l-functions; /pnt-zero-free-region; /dirichlet-theorem; /explicit-formula; /large-sieve-bombieri-vinogradov; /sieve-methods |
| Skeleton, elliptic curves: Mordell–Weil; Hasse bound; modular forms for SL₂(ℤ); Hecke operators; modularity theorem; BSD statement | elliptic-curves-modular-forms/mordell-weil; /finite-fields-hasse; /modular-forms-sl2z; /hecke-operators; /modularity-theorem; /bsd-conjecture |
| Skeleton, Lie theory: Engel and Lie; Cartan criteria; root systems and Dynkin diagrams; highest weights; Weyl character formula; Peter–Weyl | lie-groups-algebras/solvable-nilpotent-engel-lie; /killing-form-cartan-criteria; /root-systems-dynkin; /highest-weight-theory; /weyl-character-formula; /peter-weyl |
| Atiyah–Macdonald ch. 1–3 (rings, modules, fractions) | commutative-algebra/localization-and-spec |
| Atiyah–Macdonald ch. 4 | commutative-algebra/primary-decomposition |
| Atiyah–Macdonald ch. 5 | commutative-algebra/integral-extensions; /dvrs-dedekind-domains (valuation rings) |
| Atiyah–Macdonald ch. 6–8 | commutative-algebra/noetherian-rings-nullstellensatz |
| Atiyah–Macdonald ch. 9 | commutative-algebra/dvrs-dedekind-domains |
| Atiyah–Macdonald ch. 10 | commutative-algebra/completion-hensel |
| Atiyah–Macdonald ch. 11 | commutative-algebra/krull-dimension; /regular-local-rings |
| Eisenbud ch. 0–4 | commutative-algebra/localization-and-spec; /primary-decomposition; /noetherian-rings-nullstellensatz; /integral-extensions |
| Eisenbud ch. 5 and 7 (Artin–Rees; completions, Hensel) | commutative-algebra/completion-hensel |
| Eisenbud ch. 6 (flat families) | schemes-cohomology/flat-smooth-morphisms |
| Eisenbud ch. 8–13 (dimension theory, Hilbert–Samuel, Noether normalization) | commutative-algebra/krull-dimension; /integral-extensions; varieties-curves/dimension-degree-hilbert |
| Eisenbud ch. 14 (elimination, generic freeness, fibre dimension) | varieties-curves/dimension-degree-hilbert (fibre dimension). **Gap (partial)**: elimination theory and generic freeness are practised with Macaulay2 rather than carded |
| Eisenbud ch. 15 (Gröbner bases) | **Gap (deliberate)**: algorithmic; covered by the Macaulay2 practice item |
| Eisenbud ch. 16 (differentials) | schemes-cohomology/flat-smooth-morphisms |
| Eisenbud ch. 17–19 (regular sequences, depth, CM, regular local rings) | commutative-algebra/regular-local-rings; category-homological-algebra/derived-functors-ext-tor |
| Eisenbud ch. 20–21 (Fitting invariants; canonical modules, Gorenstein) | **Gap (deliberate)**: beyond qualifying level; the syzygy theorem is in derived-functors-ext-tor |
| Riehl ch. 1 / ch. 2 / ch. 3–4 | category-homological-algebra/categories-functors / /yoneda-universal-properties / /limits-adjunctions |
| Riehl ch. 5 (monads) | **Gap (partial)**: "monad" as a key term in limits-adjunctions |
| Riehl ch. 6 (Kan extensions) | **Gap (closed)**: Kan extension added to category-homological-algebra/derived-categories, where derived functors are presented as Kan extensions |
| Weibel ch. 1 | category-homological-algebra/abelian-categories |
| Weibel ch. 2–4 | category-homological-algebra/derived-functors-ext-tor |
| Weibel ch. 5 / ch. 6 / ch. 10 | /spectral-sequences / /group-cohomology / /derived-categories |
| Weibel ch. 7 (Lie algebra cohomology) | **Gap (partial)**: Whitehead's lemma added to lie-groups-algebras/killing-form-cartan-criteria |
| Weibel ch. 8–9 (simplicial methods; Hochschild and cyclic homology) | **Gap (deliberate)**: specialist topics, not on qualifying syllabi |
| Shafarevich I ch. 1 §1–§5 | varieties-curves/affine-projective-varieties; /morphisms-rational-maps |
| Shafarevich I ch. 1 §6 | varieties-curves/dimension-degree-hilbert |
| Shafarevich I ch. 2 §1–§3 / §4 | varieties-curves/smoothness-tangent-spaces / /blow-ups-resolution |
| Shafarevich I ch. 2 §5–§6 (normal varieties; singularities of maps) | varieties-curves/blow-ups-resolution (normalization); /riemann-hurwitz-genus (ramification) |
| Shafarevich I ch. 3 §1–§2, §5–§6 | varieties-curves/divisors-curves |
| Shafarevich I ch. 3 §3 (plane cubic) | elliptic-curves-modular-forms/weierstrass-group-law |
| Shafarevich I ch. 3 §4 (algebraic groups) | **Gap (partial)**: only through elliptic curves and lie-groups-algebras; linear algebraic groups are not carded |
| Shafarevich I ch. 3 §7 | varieties-curves/riemann-roch-curves; /riemann-hurwitz-genus |
| Shafarevich I ch. 3 §8 | schemes-cohomology/serre-duality-applications |
| Shafarevich I ch. 4 (intersection numbers on surfaces) | varieties-curves/blow-ups-resolution; complex-geometry/lefschetz-theorems (Hodge index). **Gap (partial)**: surface intersection theory at statement level |
| Harris L1–6 | varieties-curves/affine-projective-varieties (Grassmannian added as a key term) |
| Harris L7–8 | varieties-curves/morphisms-rational-maps; /blow-ups-resolution |
| Harris L9–10 (determinantal varieties; algebraic groups) | **Gap (deliberate)**: examples only |
| Harris L11–13, L18–19 | varieties-curves/dimension-degree-hilbert |
| Harris L14, L20 | varieties-curves/smoothness-tangent-spaces |
| Harris L15–17 (Gauss maps, dual varieties, tangent spaces to Grassmannians) | **Gap (deliberate)**: classical projective geometry beyond the qualifying core |
| Harris L21 (parameter and moduli spaces) | schemes-cohomology/flat-smooth-morphisms; elliptic-curves-modular-forms/elliptic-curves-over-c. **Gap (partial)**: Hilbert schemes are not carded |
| Harris L22 (quadrics) | schemes-cohomology/line-bundles-divisors |
| Hartshorne II.1 / II.2–II.3 / II.4 / II.5 | schemes-cohomology/sheaves / /spec-affine-schemes, /proj-and-gluing / /separated-proper-morphisms / /quasi-coherent-sheaves |
| Hartshorne II.6–II.7 / II.8 | schemes-cohomology/line-bundles-divisors / /flat-smooth-morphisms |
| Hartshorne II.9 (formal schemes), III.11 (formal functions) | **Gap (deliberate)**: left for later study |
| Hartshorne III.1–III.4 / III.5 | schemes-cohomology/sheaf-cohomology / /cohomology-projective-space |
| Hartshorne III.6–III.8, III.12 | schemes-cohomology/serre-duality-applications |
| Hartshorne III.9–III.10 | schemes-cohomology/flat-smooth-morphisms |
| Hartshorne IV.1–IV.2 | varieties-curves/riemann-roch-curves; /riemann-hurwitz-genus |
| Vakil (2025) ch. 1 / ch. 2 / ch. 3–5 / ch. 6, 14 | category-homological-algebra units / schemes-cohomology/sheaves / /spec-affine-schemes, /proj-and-gluing / /quasi-coherent-sheaves |
| Vakil ch. 7–11 | schemes-cohomology/proj-and-gluing; /separated-proper-morphisms |
| Vakil ch. 12–13 | commutative-algebra/krull-dimension, /regular-local-rings; varieties-curves/smoothness-tangent-spaces |
| Vakil ch. 15–17 / ch. 18, 23 | schemes-cohomology/line-bundles-divisors / /sheaf-cohomology, /cohomology-projective-space |
| Vakil ch. 19 / ch. 21–22 | varieties-curves/riemann-roch-curves / /riemann-hurwitz-genus, /blow-ups-resolution; schemes-cohomology/flat-smooth-morphisms |
| Vakil ch. 24–26, 29 | schemes-cohomology/flat-smooth-morphisms; /serre-duality-applications; commutative-algebra/regular-local-rings |
| Vakil ch. 20 (intersection theory), ch. 27 (27 lines), ch. 28 (formal functions) | **Gap (deliberate)** |
| Neukirch I §1–§2 / §3, §8 / §4–§6 / §7 / §9 / §10 | algebraic-number-theory/number-fields-integers / /ideal-factorization / /minkowski-class-group / /dirichlet-unit-theorem / /ramification-frobenius / /cyclotomic-fields |
| Neukirch I §11–§14 (localization, orders, one-dimensional schemes, function fields) | **Gap (partial)**: only as examples in ideal-factorization and schemes-cohomology/spec-affine-schemes |
| Neukirch II §1–§5 / §6–§10 | algebraic-number-theory/p-adic-numbers-local-fields / /extensions-local-fields (higher ramification groups added as a key term) |
| Neukirch III (Riemann–Roch theory) | **Gap (deliberate)** |
| Neukirch IV–VI (class field theory) | algebraic-number-theory/adeles-ideles; /class-field-theory-statements (statements only, as the skeleton specifies) |
| Neukirch VII (zeta functions, L-series) | algebraic-number-theory/dirichlet-unit-theorem (Dedekind zeta, analytic class number formula); analytic-number-theory units |
| Marcus ch. 1 / 2 / 3 / 4 / 5 | algebraic-number-theory/cyclotomic-fields / /number-fields-integers / /ideal-factorization / /ramification-frobenius / /minkowski-class-group, /dirichlet-unit-theorem |
| Marcus ch. 6–7 / ch. 8 | algebraic-number-theory/dirichlet-unit-theorem / /ramification-frobenius (Chebotarev), /class-field-theory-statements |
| Davenport ch. 1, 4–6 | analytic-number-theory/dirichlet-characters-l-functions; /dirichlet-theorem |
| Davenport ch. 2–3 (Gauss sums, cyclotomy) | analytic-number-theory/dirichlet-characters-l-functions; algebraic-number-theory/cyclotomic-fields |
| Davenport ch. 7–12 / ch. 13–16 | analytic-number-theory/zeta-riemann-memoir / /pnt-zero-free-region, /pnt-arithmetic-progressions |
| Davenport ch. 17–19 / ch. 20–22 | analytic-number-theory/explicit-formula / /pnt-arithmetic-progressions |
| Davenport ch. 23 (Pólya–Vinogradov) | **Gap (closed)**: added to analytic-number-theory/dirichlet-characters-l-functions |
| Davenport ch. 24–26 / ch. 27–29 | analytic-number-theory/sieve-methods (Vaughan's identity added) / /large-sieve-bombieri-vinogradov |
| Iwaniec–Kowalski ch. 1–5 / 6–7 / 17–18 / 19–20 | analytic-number-theory units / /sieve-methods, /large-sieve-bombieri-vinogradov / /pnt-arithmetic-progressions / /sieve-methods (statements) |
| Iwaniec–Kowalski ch. 8 (exponential sums) | **Gap (partial)**: van der Corput in harmonic-analysis/oscillatory-restriction-kakeya |
| Iwaniec–Kowalski ch. 9–10 (Dirichlet polynomials, zero density) | frontier-analysis-pde/zero-density-guth-maynard |
| Iwaniec–Kowalski ch. 11–12 (finite fields; character sums) | elliptic-curves-modular-forms/finite-fields-hasse; analytic-number-theory/dirichlet-characters-l-functions. **Gap (partial)**: Weil bounds for character sums are not carded |
| Iwaniec–Kowalski ch. 13 / 21 / 22–23 | analytic-number-theory/sieve-methods / ergodic-theory/ergodic-theorems (Weyl equidistribution) / analytic-number-theory/pnt-arithmetic-progressions (Gauss class number problem) |
| Iwaniec–Kowalski ch. 14–16 (modular forms, spectral theory, Kloosterman sums) | elliptic-curves-modular-forms/modular-forms-sl2z, /hecke-operators. **Gap (deliberate)**: spectral theory of automorphic forms and Kloosterman sums |
| Iwaniec–Kowalski ch. 24–26 (critical zeros, spacing, central values) | **Gap (partial)**: Montgomery pair correlation added to analytic-number-theory/zeta-riemann-memoir |
| Silverman ch. I–II / III / IV–V, VII / VI / VIII–X | varieties-curves units / elliptic-curves-modular-forms/weierstrass-group-law / /finite-fields-hasse (formal group added) / /elliptic-curves-over-c / /mordell-weil (Siegel's integral points added) |
| Silverman ch. XI (algorithms) | **Gap (deliberate)**: practised with PARI/GP and the LMFDB |
| Silverman App. C §11 / §12–§13 / §16, §21 / §19 | /elliptic-curves-over-c / /modular-forms-sl2z, /modularity-theorem / /bsd-conjecture (Sato–Tate added) / /modularity-theorem |
| Silverman App. C §14–§15, §17–§18, §20 | **Gap (deliberate)**: Tate curves, Néron models, duality and heights beyond the canonical height |
| Diamond–Shurman ch. 1–4 / 5 / 6–9 | elliptic-curves-modular-forms/elliptic-curves-over-c, /modular-forms-sl2z / /hecke-operators / /modularity-theorem. **Gap (partial)**: Jacobians and modular curves as algebraic curves are at statement level only |
| Humphreys §1–§4 | lie-groups-algebras/solvable-nilpotent-engel-lie; /killing-form-cartan-criteria |
| Humphreys §5–§6 / §7 / §8, §15–§16 | lie-groups-algebras/killing-form-cartan-criteria / /sl2-representations / /root-space-decomposition |
| Humphreys §9–§12, §14, §18–§19 | lie-groups-algebras/root-systems-dynkin |
| Humphreys §13, §17, §20–§21 / §22–§24 | lie-groups-algebras/highest-weight-theory / /weyl-character-formula |
| Humphreys §25–§27 (Chevalley basis and groups) | **Gap (partial)**: Chevalley basis as a key term in root-space-decomposition; groups of Lie type appear in frontier-arithmetic-langlands/mckay-local-global |
| Fulton–Harris L1–6 | finite-group-representations (earlier tier) |
| Fulton–Harris L7–8 / L9–10 / L11 / L12–13 / L14–19 | lie-groups-algebras/lie-groups-exponential / /solvable-nilpotent-engel-lie / /sl2-representations / /highest-weight-theory / /root-space-decomposition |
| Fulton–Harris L20 (spin), L26 (real forms) | lie-groups-algebras/compact-lie-groups (Spin(n), compact real forms) |
| Fulton–Harris L21–22 / L23–25 / App. C–E | lie-groups-algebras/root-systems-dynkin / /weyl-character-formula, /compact-lie-groups / /killing-form-cartan-criteria, /root-space-decomposition, /solvable-nilpotent-engel-lie (Ado, Levi) |
| Fulton–Harris App. A, B, F (symmetric functions, multilinear algebra, invariant theory) | **Gap (deliberate)** |
| Peter–Weyl (in neither named text) | **Gap (closed)**: lie-groups-algebras/peter-weyl, using Bröcker–tom Dieck III §3, Hall App. D and Folland §5.2 |

---

## Tier 8: Advanced graduate II (740 cards)

**Rationale.** Tier 8 is the analysis, probability, topology and geometry half of the exam, plus the graduate electives the skeleton names: combinatorics, logic and optimization. The teaching order has 15 blocks that alternate probability, topology, analysis, discrete mathematics, logic and geometry. All but two fall in the 40–60 range. Harmonic analysis and complex geometry are kept as single 65-card blocks, because splitting either one would give two blocks below 40. Cross-module prerequisites sit earlier in the order: martingales come before concentration inequalities and ergodic theorems, Sobolev theory before Hodge theory and finite elements, spectral theory before ergodic theory and quantum mechanics, and characteristic classes before Kodaira embedding and 4-manifolds. Problem-heavy modules (probability, PDE, characteristic classes) carry 20–21% problems; the others carry 10–14%.

Teaching-order blocks (cards): probability 45, characteristic classes 45, PDE 45, combinatorics 60, probability 45, operators 45, characteristic classes/homotopy 40, PDE 45, logic 50, harmonic analysis 65, complex geometry 65, ergodic 45, low-dimensional topology 55, applied analysis 40, symplectic/physics 50.

### Coverage matrix, tier 8

| Source topic | Covered by units |
|---|---|
| Skeleton, probability: conditional expectation; martingales; characteristic functions; CLT proofs; Brownian motion; Itô calculus | probability-theory/conditional-expectation; /martingales-convergence; /uniform-integrability-optional-stopping; /characteristic-functions-clt; /brownian-motion-construction; /continuous-martingales; /ito-calculus; /sdes-and-pdes |
| Skeleton, PDE: Sobolev spaces; Lax–Milgram; elliptic regularity; energy methods; calculus of variations; nonlinear methods | pde/sobolev-spaces; /sobolev-embeddings; /weak-solutions-lax-milgram; /elliptic-regularity-maximum; /evolution-energy-methods; /calculus-of-variations; /nonlinear-methods; /nonlinear-evolution-fluids |
| Skeleton, harmonic analysis: interpolation; Calderón–Zygmund; Littlewood–Paley; H¹ and BMO; oscillatory integrals; restriction, Kakeya, decoupling; Pontryagin duality | harmonic-analysis/interpolation-maximal; /calderon-zygmund; /littlewood-paley; /hardy-bmo; /oscillatory-restriction-kakeya; /abstract-harmonic-pontryagin |
| Skeleton, operators: unbounded self-adjoint operators; Stone's theorem; C*-algebras; von Neumann algebras; Fredholm index | spectral-operator-algebras/unbounded-self-adjoint; /spectral-theorem-stone; /c-star-algebras; /von-neumann-fredholm |
| Skeleton, characteristic classes: classifying spaces; Chern, Stiefel–Whitney, Pontryagin; Thom isomorphism; cobordism; Serre spectral sequence; Bott periodicity; stable stems | characteristic-classes-homotopy/classifying-spaces; /stiefel-whitney-classes; /chern-pontryagin-classes; /euler-class-thom; /cobordism-signature; /serre-spectral-sequence; /k-theory-bott-periodicity; /stable-homotopy-stems |
| Skeleton, complex geometry: uniformization; Kähler; Hodge decomposition; Lefschetz; Kodaira vanishing and embedding | complex-geometry/uniformization-riemann-surfaces; /kahler-manifolds; /hodge-decomposition; /lefschetz-theorems; /kodaira-vanishing-embedding (plus /complex-manifolds-dolbeault) |
| Skeleton, low-dimensional topology: knot invariants; Morse theory and h-cobordism; geometrization; hyperbolic geometry; mapping class groups; intersection forms | low-dimensional-topology/knot-invariants; /jones-quantum-invariants; /morse-h-cobordism; /hyperbolic-geometrization; /mapping-class-groups-4-manifolds |
| Skeleton, symplectic and mathematical physics: Hamiltonian mechanics; Darboux; moment maps; Lagrangian submanifolds; Floer theory (statements); quantum formalism | symplectic-mathematical-physics/hamiltonian-mechanics; /symplectic-manifolds-darboux; /lagrangian-submanifolds-moment-maps; /floer-theory-statements; /quantum-mechanics-formalism |
| Skeleton, ergodic theory: ergodic theorems; mixing; entropy; Furstenberg recurrence; hyperbolic and homogeneous dynamics | ergodic-theory/ergodic-theorems; /mixing-entropy; /furstenberg-recurrence; /hyperbolic-homogeneous-dynamics |
| Skeleton, combinatorics: local lemma and concentration; regularity; Roth and Szemerédi; sumsets and Freiman; polynomial method; Brunn–Minkowski; lattices and sphere packing | graduate-combinatorics/local-lemma-concentration; /regularity-lemma; /roth-szemeredi; /sumsets-freiman; /polynomial-method; /convex-geometry-lattices |
| Skeleton, logic: quantifier elimination; o-minimality; forcing and CH; Turing degrees; MRDP | model-set-theory/quantifier-elimination; /types-categoricity; /o-minimality; /forcing-independence-ch; /computability-degrees-mrdp |
| Skeleton, applied: convex duality and KKT; optimal transport; finite elements; approximation theory | applied-analysis-optimization/convex-duality-kkt; /optimal-transport; /finite-element-method; /approximation-theory |
| Durrett ch. 1–2 | measure-integration, probability (earlier tiers) |
| Durrett ch. 3 / ch. 4 | probability-theory/characteristic-functions-clt / /conditional-expectation, /martingales-convergence, /uniform-integrability-optional-stopping |
| Durrett ch. 5 (Markov chains) | **Gap (partial)**: discrete chains are assumed from `probability`; generators and Dynkin's formula are in probability-theory/sdes-and-pdes |
| Durrett ch. 6 / ch. 7–8 / ch. 9 | ergodic-theory/ergodic-theorems / probability-theory/brownian-motion-construction, /continuous-martingales / /sdes-and-pdes |
| Williams ch. 0–8 / 9–15 / 16–18 | earlier tiers / probability-theory/conditional-expectation, /martingales-convergence, /uniform-integrability-optional-stopping / /characteristic-functions-clt |
| Itô calculus (in neither Durrett nor Williams) | **Gap (closed)**: probability-theory/continuous-martingales, /ito-calculus, /sdes-and-pdes, using Le Gall ch. 1–8, Øksendal ch. 3–8 and Karatzas–Shreve ch. 1 |
| Evans ch. 1–4 | fourier-intro-pde (earlier tier); pde/nonlinear-evolution-fluids (Hamilton–Jacobi) |
| Evans ch. 5 / 6 / 7 | pde/sobolev-spaces, /sobolev-embeddings / /weak-solutions-lax-milgram, /elliptic-regularity-maximum / /evolution-energy-methods |
| Evans ch. 8 / 9 / 10–12 | pde/calculus-of-variations, /nonlinear-methods / /nonlinear-methods / /nonlinear-evolution-fluids |
| Grafakos CFA ch. 1–2 | harmonic-analysis/interpolation-maximal; /oscillatory-restriction-kakeya (§2.6) |
| Grafakos CFA ch. 3–4 (Fourier series) | lp-fourier-distributions (earlier); Carleson's theorem added to harmonic-analysis/interpolation-maximal |
| Grafakos CFA ch. 5 / 6 / 7 | harmonic-analysis/calderon-zygmund / /littlewood-paley / /calderon-zygmund (A_p weights). **Gap (partial)**: weighted theory is at statement level |
| Grafakos MFA ch. 1 / 2–3 / 4 / 5 | harmonic-analysis/littlewood-paley / /hardy-bmo / /calderon-zygmund (T(1)) / /oscillatory-restriction-kakeya |
| Grafakos MFA ch. 6 (time–frequency; Carleson–Hunt) | **Gap (partial)**: Carleson's theorem is a statement in interpolation-maximal |
| Grafakos MFA ch. 7 (multilinear) | **Gap (deliberate)** |
| Duoandikoetxea ch. 2 / 3–5, 7, 9 / 6 / 8 | harmonic-analysis/interpolation-maximal / /calderon-zygmund / /hardy-bmo / /littlewood-paley |
| Restriction, Kakeya, decoupling; Pontryagin duality (outside both named texts' cores) | **Gap (closed)**: harmonic-analysis/oscillatory-restriction-kakeya (Demeter, Stein ch. VIII–IX themes) and /abstract-harmonic-pontryagin (Folland ch. 4) |
| Reed–Simon I ch. I–V | functional-analysis (earlier) |
| Reed–Simon I ch. VI / VII / VIII | spectral-operator-algebras/von-neumann-fredholm / /spectral-theorem-stone, ergodic-theory/ergodic-theorems (Koopman) / /unbounded-self-adjoint, /spectral-theorem-stone, symplectic-mathematical-physics/quantum-mechanics-formalism (VIII.11) |
| Murphy ch. 1–3 / 4 / 5 | spectral-operator-algebras/c-star-algebras, /von-neumann-fredholm / /von-neumann-fredholm / /c-star-algebras (GNS) |
| Murphy ch. 6–7 (tensor products; K-theory of C*-algebras) | **Gap (deliberate)**: specialist; topological K-theory is in characteristic-classes-homotopy/k-theory-bott-periodicity |
| Milnor–Stasheff §1–§3 | bundles-connections (earlier) |
| Milnor–Stasheff §4, §7–§8 / §5–§6 / §9–§12 / §13–§15, App. C / §16–§19 | characteristic-classes-homotopy/stiefel-whitney-classes / /classifying-spaces / /euler-class-thom / /chern-pontryagin-classes / /cobordism-signature |
| Milnor–Stasheff §20 (combinatorial Pontrjagin classes) | **Gap (deliberate)** |
| Bott–Tu §1–§5, §7–§10 | de-rham, cohomology-homotopy (earlier) |
| Bott–Tu §6, §11–§12 / §13–§18 / §20–§22 / §23 | characteristic-classes-homotopy/euler-class-thom / /serre-spectral-sequence, /stable-homotopy-stems, category-homological-algebra/spectral-sequences / /chern-pontryagin-classes / /classifying-spaces |
| Bott–Tu §19 (rational homotopy) | **Gap (deliberate)** |
| Bott periodicity and stable stems (beyond the two texts) | **Gap (closed)**: characteristic-classes-homotopy/k-theory-bott-periodicity, /stable-homotopy-stems (Hatcher VBKT and AT ch. 4, Hatcher's spectral sequences ch. 2, Milnor Morse Theory Part IV) |
| Huybrechts ch. 1–2 / 3 / 4–5 | complex-geometry/complex-manifolds-dolbeault / /kahler-manifolds, /hodge-decomposition, /lefschetz-theorems / /kodaira-vanishing-embedding (HRR added) |
| Huybrechts ch. 6 (deformations) | **Gap (deliberate)** |
| Griffiths–Harris ch. 0 / 1 / 2 | complex-geometry/complex-manifolds-dolbeault, /kahler-manifolds, /hodge-decomposition / /lefschetz-theorems, /kodaira-vanishing-embedding / /uniformization-riemann-surfaces, varieties-curves units |
| Griffiths–Harris ch. 3–6 (intersection theory, surfaces, residues, line complex) | **Gap (deliberate)** |
| Uniformization (in neither named text) | **Gap (closed)**: complex-geometry/uniformization-riemann-surfaces (Donaldson ch. 10, Forster ch. 3) |
| Rolfsen ch. 1–3, 5–8 / 4, 9 | low-dimensional-topology/knot-invariants / /hyperbolic-geometrization |
| Rolfsen ch. 10–11 (fibrations, higher-dimensional knots) | **Gap (partial)**: remarks only |
| Farb–Margalit ch. 1 / 2–4, 8, 13–15 | low-dimensional-topology/hyperbolic-geometrization / /mapping-class-groups-4-manifolds |
| Farb–Margalit ch. 5–7, 9–12 (presentations, Torelli, torsion, braids, Teichmüller and moduli space) | **Gap (partial)**: moduli of curves only via complex-geometry/uniformization-riemann-surfaces |
| Jones/Khovanov, h-cobordism, geometrization, 4-manifolds (beyond the two texts) | **Gap (closed)**: low-dimensional-topology/jones-quantum-invariants, /morse-h-cobordism, /hyperbolic-geometrization, /mapping-class-groups-4-manifolds (Lickorish, Milnor, Thurston, Scorpan, Gompf–Stipsicz) |
| Arnold ch. 1–2 / 7 | ode-dynamics / de-rham (earlier) |
| Arnold ch. 3–4, 9–10 / 8 / App. 5 | symplectic-mathematical-physics/hamiltonian-mechanics (KAM added) / /symplectic-manifolds-darboux / /lagrangian-submanifolds-moment-maps |
| Arnold ch. 5–6 (oscillations, rigid bodies) | **Gap (deliberate)** |
| Hall QM ch. 1–5, 11–14, 16–18 / 6–10 | symplectic-mathematical-physics/quantum-mechanics-formalism / spectral-operator-algebras units |
| Hall QM ch. 15, 19–23 (WKB, many particles, path integrals, geometric quantization) | **Gap (partial)**: only the Groenewold–van Hove obstruction is carded |
| Floer theory statements (outside both named texts) | **Gap (closed)**: symplectic-mathematical-physics/floer-theory-statements (McDuff–Salamon ch. 11–12) |
| Einsiedler–Ward ch. 1–4 / 5–7, 10 / 8–9, 11 | ergodic-theory/ergodic-theorems, /mixing-entropy / /furstenberg-recurrence (nilsystem added) / /hyperbolic-homogeneous-dynamics |
| Katok–Hasselblatt ch. 1–5 / 6, 17–20 | ergodic-theory/ergodic-theorems, /mixing-entropy / /hyperbolic-homogeneous-dynamics |
| Katok–Hasselblatt ch. 7–9, 10–16 | **Gap (partial)**: rotation number added to mixing-entropy; transversality and interval dynamics omitted |
| Entropy (absent from Einsiedler–Ward) | **Gap (closed)**: ergodic-theory/mixing-entropy (Walters ch. 4, 7–8) |
| Alon–Spencer ch. 1–8, 10–11 | graduate-combinatorics/local-lemma-concentration (FKG, Janson and phase transition added) |
| Alon–Spencer ch. 9 / ch. 14 | graduate-combinatorics/regularity-lemma / /convex-geometry-lattices |
| Alon–Spencer ch. 12–13, 15–17 (circuits, discrepancy, codes, derandomization, testing) | **Gap (partial)**: property testing via the removal lemma; the rest deliberately omitted |
| Zhao ch. 0–5 / 6, 9 / 7–8 | graduate-combinatorics/regularity-lemma (Erdős–Stone–Simonovits and Sidorenko added) / /roth-szemeredi / /sumsets-freiman |
| Polynomial method; Brunn–Minkowski; lattices and sphere packing (outside both named texts) | **Gap (closed)**: graduate-combinatorics/polynomial-method (Guth), /convex-geometry-lattices (Matoušek, Conway–Sloane) |
| Marker ch. 1–2 / 3 / 4, 6, 8 | logic-computability (earlier) / model-set-theory/quantifier-elimination, /o-minimality / /types-categoricity (strongly minimal sets added) |
| Marker ch. 5, 7 (indiscernibles; ω-stable groups) | **Gap (deliberate)** |
| Kunen (1980) ch. I, III / V–VIII | proofs-logic-sets (earlier) / model-set-theory/forcing-independence-ch |
| Kunen ch. II, IV (infinitary combinatorics; easy consistency proofs) | **Gap (partial)**: Martin's axiom only |
| O-minimality, Turing degrees, MRDP (outside Marker and Kunen) | **Gap (closed)**: model-set-theory/o-minimality, /computability-degrees-mrdp (van den Dries, Soare, Matiyasevich) |
| Boyd–Vandenberghe ch. 1–5 / 6–8 / 9–11 | applied-analysis-optimization/convex-duality-kkt / /approximation-theory (fitting, partial) / /convex-duality-kkt (interior-point methods as a trade-off) |
| Villani ch. 1–5, 7–9 / ch. 6 | applied-analysis-optimization/optimal-transport (Talagrand added) / graduate-combinatorics/convex-geometry-lattices |
| Finite elements; approximation theory (outside both named texts) | **Gap (closed)**: applied-analysis-optimization/finite-element-method (Brenner–Scott), /approximation-theory (Trefethen) |

---

## Tier 9: Research frontier (300 cards; milestone "PhD")

**Rationale.** Tier 9 orients the learner in research: the map of the subject, how to read papers, the big open problems, and current landmark results with their status. It closes with formal verification. Its cards are landmark, concept, definition and misconception only. Frontier units state the result, why it matters, the key idea and the status, and never give proofs. Every frontier unit is built only from items checked against a primary source (arXiv abstract pages, Annals of Mathematics issue and "to appear" pages, IMU pages, project repositories) in November 2026. research-literacy and formalization-lean depend only on `proofs-logic-sets` and their own units.

### Coverage matrix, tier 9

| Source topic | Covered by units |
|---|---|
| Princeton Companion Part I (Introduction) | research-literacy/reading-papers |
| Princeton Companion Parts II, VI (origins; mathematicians) | **Gap (deliberate)**: history and biography (MSC 01) |
| Princeton Companion Part III (concepts) | earlier tiers |
| Princeton Companion Part IV (branches), incl. IV.2, IV.20 | research-literacy/msc-arxiv-map; /standard-conjectures |
| Princeton Companion Part V, incl. V.24–V.26 | research-literacy/millennium-problems; /standard-conjectures |
| Princeton Companion Part VII (influence of mathematics) | **Gap (deliberate)**: applications are outside this path |
| Princeton Companion Part VIII, incl. VIII.6 | research-literacy/reading-papers; /research-practice |
| MSC2020 map; arXiv categories | research-literacy/msc-arxiv-map |
| Millennium problems and standard conjectures | research-literacy/millennium-problems; /standard-conjectures |
| Mathematics in Lean ch. 1–3 / 4–6 / 7–13 | formalization-lean/proof-assistants-type-theory, /lean-tactics-basics / /lean-tactics-basics / /mathlib-structures |
| Landmark formalization projects | formalization-lean/blueprints-large-projects; /landmark-formalizations-2025-26; /ai-and-formal-math |
| Recent landmarks: number theory, arithmetic geometry, Langlands | frontier-arithmetic-langlands (7 units) |
| Recent landmarks: harmonic analysis, PDE, convex geometry, analytic NT | frontier-analysis-pde (6 units) |
| Recent landmarks: combinatorics, homotopy theory, low-dimensional topology | frontier-combinatorics-topology (6 units; symplectic topology added through the 2026 Fields Medal) |

### Frontier verification (as of 2026-11)

"Status" is what the primary source showed when it was checked on 2026-11-24.

| Result | Authors | Year | Status | URL | Unit |
|---|---|---|---|---|---|
| Proof of the geometric Langlands conjecture I–V | Gaitsgory, Raskin (I, V); Arinkin, Beraldo, Campbell, Chen, Faergeman, Gaitsgory, Lin, Raskin, Rozenblyum (II–IV, varying) | 2024 (revisions to Jan 2026) | preprints; no journal reference on arXiv | https://arxiv.org/abs/2405.03599, https://arxiv.org/abs/2405.03648, https://arxiv.org/abs/2409.07051, https://arxiv.org/abs/2409.08670, https://arxiv.org/abs/2409.09856 | geometric-langlands |
| Kakeya sets in ℝ³ have Minkowski and Hausdorff dimension 3 | Hong Wang, Joshua Zahl | 2025 | preprint (arXiv v1); cited in Wang's 2026 Fields Medal | https://arxiv.org/abs/2502.17655 | kakeya-three-dimensions |
| McKay conjecture | Marc Cabanes, Britta Späth | 2024 | published, Annals 203(3) (2026) 933–1032 | https://arxiv.org/abs/2410.20392 ; https://annals.math.princeton.edu/2026/203 | mckay-local-global |
| Positive proportion of abelian surfaces over ℚ are modular | George Boxer, Frank Calegari, Toby Gee, Vincent Pilloni | 2025 | preprint | https://arxiv.org/abs/2502.20645 | modularity-abelian-surfaces |
| Hilbert's tenth problem negative over every infinite f.g. ring over ℤ (incl. every O_K) | Peter Koymans, Carlo Pagano | 2024 (v3 Nov 2025) | preprint | https://arxiv.org/abs/2412.01768 | hilberts-tenth-rings-of-integers |
| Rank stability in quadratic extensions; H10 for every O_K | Levent Alpöge, Manjul Bhargava, Wei Ho, Ari Shnidman | 2025 | preprint | https://arxiv.org/abs/2501.18774 | hilberts-tenth-rings-of-integers |
| Zero density N(σ,T) ≤ T^(30(1−σ)/13+o(1)); primes in intervals of length x^(17/30+o(1)) | Larry Guth, James Maynard | 2024 | published, Annals 203(2) (2026) 623–675 | https://arxiv.org/abs/2405.20552 ; https://annals.math.princeton.edu/2026/203 | zero-density-guth-maynard |
| Bourgain's slicing problem resolved | Boaz Klartag, Joseph Lehec | 2024 | preprint | https://arxiv.org/abs/2412.15044 | convex-geometry-slicing-packing |
| L_n ≤ C log log n | Qingyang Guan | 2024 | preprint | https://arxiv.org/abs/2412.09075 | convex-geometry-slicing-packing |
| Lattice packings of density ≥ c·n²·2⁻ⁿ | Boaz Klartag | 2025 (v2 Jan 2026) | preprint | https://arxiv.org/abs/2504.05042 | convex-geometry-slicing-packing |
| Long-time derivation of the Boltzmann equation from hard spheres | Yu Deng, Zaher Hani, Xiao Ma | 2024 (v3 2025) | accepted: listed "to appear" by Annals | https://arxiv.org/abs/2408.07818 ; https://annals.math.princeton.edu/toappear | kinetic-theory-hilbert-sixth |
| Euler and Navier–Stokes–Fourier from hard spheres ("Hilbert's sixth problem") | Yu Deng, Zaher Hani, Xiao Ma | 2025 | preprint; framing **disputed**: the title presents it as Hilbert's sixth problem, but that problem is a broad program and the result settles one part of it, the passage from atoms to fluids. Cards say so | https://arxiv.org/abs/2503.01800 | kinetic-theory-hilbert-sixth |
| Diagonal Ramsey R(k) ≤ (4−ε)^k | Marcelo Campos, Simon Griffiths, Robert Morris, Julian Sahasrabudhe | 2023 | published, Annals 203(3) (2026) 869–932 | https://arxiv.org/abs/2303.09521 ; https://annals.math.princeton.edu/2026/203 | diagonal-ramsey |
| Strong bounds for 3-progressions | Zander Kelley, Raghu Meka | 2023 (v6 2024) | preprint on arXiv (no journal reference listed; conference version not checked) | https://arxiv.org/abs/2302.05537 | additive-combinatorics-breakthroughs |
| Marton's conjecture (PFR) over 𝔽₂ⁿ | W. T. Gowers, Ben Green, Freddie Manners, Terence Tao | 2023 | published, Annals 201(2) (2025) 515–549 | https://arxiv.org/abs/2311.05762 ; https://annals.math.princeton.edu/2025/201 | additive-combinatorics-breakthroughs |
| Lean formalization of PFR | project led by Terence Tao (maintainers Tao, Yaël Dillies) | 2023 | completed: launched mid-Nov 2023, endgame sorries removed 5 Dec 2023 (commit history); later phases complete, bounded-torsion extension ongoing | https://github.com/teorth/pfr ; https://teorth.github.io/pfr/ | blueprints-large-projects |
| Telescope conjecture false at all heights ≥ 2 | Robert Burklund, Jeremy Hahn, Ishan Levy, Tomer M. Schlank | 2023 | preprint | https://arxiv.org/abs/2310.17459 | telescope-conjecture |
| Unknotting number is not additive (7₁ # mirror 7₁ has u ≤ 5) | Mark Brittenham, Susan Hermiller | 2025 | published, Annals 204(2) (2026) 795–817 | https://arxiv.org/abs/2506.24088 ; https://annals.math.princeton.edu/2026/204 | knots-and-4-manifolds-recent |
| 2026 Fields Medals | Yu Deng, John Pardon, Jacob Tsimerman, Hong Wang | 2026 | IMU announcement with citations | https://www.mathunion.org/imu-awards/fields-medal/fields-medals-2026 | fields-2026-arithmetic, fields-2026-analysis, symplectic-recent-pardon |
| Sphere packing in Lean, dimension 8 | Birkbeck, Hariharan, Lee, Ma, Mehta, Viazovska; remaining goals by Gauss (Math, Inc.) | 2026 (announced 23 Feb 2026) | project-announced sorry-free proof; merging of the Gauss code in progress | https://thefundamentaltheor3m.github.io/Sphere-Packing-Lean/ | landmark-formalizations-2025-26 |
| Sphere packing in Lean, dimension 24 | Math, Inc. (Gauss) | 2026 | **vendor-reported** autoformalization; the project page does not call it complete | https://www.math.inc/sphere-packing | landmark-formalizations-2025-26 |
| Equational Theories Project | 34 authors incl. M. Bolan, J. Breitner, M. Carneiro, F. van Doorn, T. Tao | launched Sep 2024; done 14 Apr 2025; report Dec 2025 | completed (project report on project site) | https://teorth.github.io/equational_theories/ ; https://github.com/teorth/equational_theories | landmark-formalizations-2025-26 |
| "Complete Lean formalization of Fermat's Last Theorem" | (reports) | — | **not verified, so dropped as a result.** The official Imperial College project README still calls the formalization ongoing (funded to Sept 2029). I could not locate the vendor report itself (the web-search quota ran out). It is used only as a misconception card | https://github.com/ImperialCollegeLondon/FLT | landmark-formalizations-2025-26 |

Further items verified and used (titles and venues from the Annals pages; abstracts read where an arXiv link is given):

| Result | Authors | Year | Status | URL | Unit |
|---|---|---|---|---|---|
| van der Waerden's conjecture | Manjul Bhargava | 2021 | published, Annals 201(2) (2025) 339–377 | https://arxiv.org/abs/2111.06507 | arithmetic-statistics-polynomials |
| Schinzel–Zassenhaus conjecture | Vesselin Dimitrov | 2019 | listed "to appear" by Annals | https://arxiv.org/abs/1912.12545 ; https://annals.math.princeton.edu/toappear | arithmetic-statistics-polynomials |
| Alperin–McKay and Brauer height zero for p = 2 | Lucas Ruhstorfer | — | published, Annals 201(2) (2025) 379–457 (title-level check) | https://annals.math.princeton.edu/2025/201 | mckay-local-global |
| Symmetric power functoriality for Hilbert modular forms | James Newton, Jack Thorne | — | published, Annals 203(1) (2026) 283–347 (title-level check) | https://annals.math.princeton.edu/2026/203 | langlands-program-map |
| Rank zero p-converse to Gross–Zagier, Kolyvagin and Rubin | Ashay A. Burungale, Ye Tian | — | published, Annals 203(1) (2026) 1–13 (title-level check; cards must stay at title level) | https://annals.math.princeton.edu/2026/203 | modularity-abelian-surfaces |
| Stable minimal hypersurfaces in ℝ⁵ are flat | Otis Chodosh, Chao Li, Paul Minter, Douglas Stryker | 2024 | published, Annals 204(1) (2026) 423–453 | https://arxiv.org/abs/2401.01492 | stable-minimal-hypersurfaces |
| Counterexample to Viterbo's conjecture | Pazit Haim-Kislev, Yaron Ostrover | 2024 | published, Annals 203(2) (2026) 603–622 | https://arxiv.org/abs/2405.16513 | symplectic-recent-pardon |
| Khovanov homology and exotic 4-manifolds | Qiuyu Ren, Michael Willis | 2024 | listed "to appear" by Annals | https://arxiv.org/abs/2402.10452 | knots-and-4-manifolds-recent |
| Exotic aspherical 4-manifolds | Davis, Hayden, Huang, Ruberman, Sunukjian | — | published, Annals 204(2) (2026) 777–794 (title-level check) | https://annals.math.princeton.edu/2026/204 | knots-and-4-manifolds-recent |
| Existence of designs | Peter Keevash | 2014 (v4 2024) | listed "to appear" by Annals | https://arxiv.org/abs/1401.3665 | designs-codes-random-matrices |
| Good locally testable codes (c³-LTCs) | Dinur, Evra, Livne, Lubotzky, Mozes | 2021 | published, Annals 203(2) (2026) 511–553 | https://arxiv.org/abs/2111.04808 | designs-codes-random-matrices |
| A new approach to strong convergence | Chen, Garza-Vargas, Tropp, van Handel | 2024 | published, Annals 203(2) (2026) 555–602 | https://arxiv.org/abs/2405.16026 | designs-codes-random-matrices |
| Liquid Tensor Experiment | Lean community (Scholze's challenge) | 2022 | completed 14 July 2022 (README) | https://github.com/leanprover-community/lean-liquid | blueprints-large-projects |
| Flyspeck (Kepler conjecture) | Hales et al. | 2014 | completed 10 Aug 2014 (README) | https://github.com/flyspeck/flyspeck | blueprints-large-projects |

---

## Coverage source: MSC2020 top-level classes (tiers 3–9)

All 63 classes are taken from https://msc2020.org/MSC_2020.csv. Bare slugs are modules owned by other agents.

| Source topic | Covered by units |
|---|---|
| 00 General and overarching topics; collections | **Out of scope (deliberate)**: there is no content to teach; the classification itself is taught in research-literacy/msc-arxiv-map |
| 01 History and biography | **Out of scope (deliberate)**: history appears only inside landmark cards (e.g. research-literacy/millennium-problems) |
| 03 Mathematical logic and foundations | proofs-logic-sets; logic-computability; model-set-theory (all units); formalization-lean/proof-assistants-type-theory |
| 05 Combinatorics | combinatorics-graphs; graduate-combinatorics (all units); frontier-combinatorics-topology/diagonal-ramsey, /additive-combinatorics-breakthroughs, /designs-codes-random-matrices |
| 06 Order, lattices, ordered algebraic structures | **Partial**: proofs-logic-sets; model-set-theory/types-categoricity (dense orders), /o-minimality. Lattice theory and Boolean algebras are deliberately not a module |
| 08 General algebraic systems | **Partial**: abstract-algebra-1; formalization-lean/landmark-formalizations-2025-26 (magmas, equational laws). Universal algebra otherwise out of scope |
| 11 Number theory | number-theory; algebraic-number-theory; analytic-number-theory; elliptic-curves-modular-forms; frontier-arithmetic-langlands; frontier-analysis-pde/zero-density-guth-maynard |
| 12 Field theory and polynomials | fields-galois; algebraic-number-theory/p-adic-numbers-local-fields, /extensions-local-fields; frontier-arithmetic-langlands/arithmetic-statistics-polynomials |
| 13 Commutative algebra | rings-modules; commutative-algebra (all units) |
| 14 Algebraic geometry | varieties-curves; schemes-cohomology; complex-geometry; frontier-arithmetic-langlands/geometric-langlands, /fields-2026-arithmetic |
| 15 Linear and multilinear algebra; matrix theory | linear-algebra-2 (and earlier school modules); lie-groups-algebras/lie-groups-exponential |
| 16 Associative rings and algebras | rings-modules; algebra-2; lie-groups-algebras/highest-weight-theory (enveloping algebras); spectral-operator-algebras/c-star-algebras. **Partial**: noncommutative ring theory beyond these is not carded |
| 17 Nonassociative rings and algebras | lie-groups-algebras (Lie algebras) |
| 18 Category theory; homological algebra | category-homological-algebra (all units) |
| 19 K-theory | characteristic-classes-homotopy/k-theory-bott-periodicity; frontier-combinatorics-topology/telescope-conjecture. **Partial**: algebraic K₀/K₁ of rings is not carded |
| 20 Group theory and generalizations | group-theory; abstract-algebra-1; finite-group-representations; category-homological-algebra/group-cohomology; low-dimensional-topology/mapping-class-groups-4-manifolds; frontier-arithmetic-langlands/mckay-local-global |
| 22 Topological groups, Lie groups | lie-groups-algebras (all units); harmonic-analysis/abstract-harmonic-pontryagin; ergodic-theory/hyperbolic-homogeneous-dynamics |
| 26 Real functions | real-analysis-1; analysis-in-rn |
| 28 Measure and integration | measure-integration; probability-theory/conditional-expectation; harmonic-analysis/interpolation-maximal |
| 30 Functions of a complex variable | complex-analysis-1; complex-analysis-2; complex-geometry/uniformization-riemann-surfaces |
| 31 Potential theory | **Partial**: fourier-intro-pde; pde/elliptic-regularity-maximum; probability-theory/sdes-and-pdes (harmonic measure) |
| 32 Several complex variables and analytic spaces | complex-geometry/complex-manifolds-dolbeault (Hartogs, Dolbeault), /kahler-manifolds, /kodaira-vanishing-embedding. **Partial**: pseudoconvexity and Hörmander's ∂̄-theory are not carded |
| 33 Special functions | **Partial (deliberate)**: Γ and ζ in analytic-number-theory/zeta-riemann-memoir; spherical harmonics in lie-groups-algebras/peter-weyl; Chebyshev polynomials in applied-analysis-optimization/approximation-theory |
| 34 Ordinary differential equations | ode-dynamics; probability-theory/sdes-and-pdes; symplectic-mathematical-physics/hamiltonian-mechanics |
| 35 Partial differential equations | fourier-intro-pde; pde (all units); harmonic-analysis; frontier-analysis-pde/kinetic-theory-hilbert-sixth, /stable-minimal-hypersurfaces |
| 37 Dynamical systems and ergodic theory | ode-dynamics; ergodic-theory (all units); symplectic-mathematical-physics/hamiltonian-mechanics (KAM) |
| 39 Difference and functional equations | **Out of scope (deliberate)**: not on qualifying syllabi; recurrences are in earlier school modules |
| 40 Sequences, series, summability | real-analysis-1; analytic-number-theory/pnt-zero-free-region (Tauberian theorem) |
| 41 Approximations and expansions | numerical-analysis; applied-analysis-optimization/approximation-theory; harmonic-analysis/littlewood-paley (wavelets) |
| 42 Harmonic analysis on Euclidean spaces | lp-fourier-distributions; harmonic-analysis (all units); frontier-analysis-pde/kakeya-three-dimensions, /fields-2026-analysis |
| 43 Abstract harmonic analysis | harmonic-analysis/abstract-harmonic-pontryagin; lie-groups-algebras/peter-weyl |
| 44 Integral transforms, operational calculus | lp-fourier-distributions. **Partial**: Mellin and Perron transforms only inside analytic-number-theory/explicit-formula |
| 45 Integral equations | **Partial**: functional-analysis (Fredholm alternative); pde/weak-solutions-lax-milgram |
| 46 Functional analysis | functional-analysis; spectral-operator-algebras (all units); pde/sobolev-spaces |
| 47 Operator theory | spectral-operator-algebras (all units) |
| 49 Calculus of variations and optimal control; optimization | pde/calculus-of-variations, /nonlinear-methods; applied-analysis-optimization/convex-duality-kkt, /optimal-transport. **Gap (deliberate)**: optimal control |
| 51 Geometry | curves-surfaces (and earlier school geometry); low-dimensional-topology/hyperbolic-geometrization |
| 52 Convex and discrete geometry | graduate-combinatorics/convex-geometry-lattices, /polynomial-method; applied-analysis-optimization/convex-duality-kkt; frontier-analysis-pde/convex-geometry-slicing-packing |
| 53 Differential geometry | curves-surfaces; riemannian-geometry; bundles-connections; complex-geometry/kahler-manifolds; symplectic-mathematical-physics/symplectic-manifolds-darboux; frontier-analysis-pde/stable-minimal-hypersurfaces |
| 54 General topology | point-set-topology |
| 55 Algebraic topology | fundamental-group; homology; cohomology-homotopy; characteristic-classes-homotopy (all units); frontier-combinatorics-topology/telescope-conjecture |
| 57 Manifolds and cell complexes | smooth-manifolds; low-dimensional-topology (all units); characteristic-classes-homotopy/cobordism-signature; frontier-combinatorics-topology/knots-and-4-manifolds-recent |
| 58 Global analysis, analysis on manifolds | de-rham; complex-geometry/hodge-decomposition; spectral-operator-algebras/von-neumann-fredholm (index theorem); low-dimensional-topology/morse-h-cobordism; symplectic-mathematical-physics/floer-theory-statements |
| 60 Probability theory and stochastic processes | probability; probability-theory (all units); graduate-combinatorics/local-lemma-concentration |
| 62 Statistics | **Out of scope (deliberate)**: the target is a pure-mathematics PhD candidate; basic statistics sits in earlier probability modules |
| 65 Numerical analysis | numerical-analysis; applied-analysis-optimization/finite-element-method, /approximation-theory |
| 68 Computer science | logic-computability; model-set-theory/computability-degrees-mrdp; research-literacy/millennium-problems (P vs NP); formalization-lean. **Partial**: complexity theory beyond P vs NP is left to a computer science track |
| 70 Mechanics of particles and systems | symplectic-mathematical-physics/hamiltonian-mechanics |
| 74 Mechanics of deformable solids | **Out of scope (deliberate)**: applied field; finite elements are taught on elliptic model problems only |
| 76 Fluid mechanics | pde/nonlinear-evolution-fluids; frontier-analysis-pde/kinetic-theory-hilbert-sixth; research-literacy/millennium-problems (Navier–Stokes) |
| 78 Optics, electromagnetic theory | **Out of scope (deliberate)**: physics application area |
| 80 Classical thermodynamics, heat transfer | **Out of scope (deliberate)**: the heat equation is treated as PDE (35) |
| 81 Quantum theory | symplectic-mathematical-physics/quantum-mechanics-formalism; spectral-operator-algebras/unbounded-self-adjoint |
| 82 Statistical mechanics, structure of matter | **Partial**: frontier-analysis-pde/kinetic-theory-hilbert-sixth (Boltzmann); ergodic-theory/mixing-entropy. Lattice models and phase transitions deliberately omitted |
| 83 Relativity and gravitational theory | **Out of scope (deliberate)**: physics; riemannian-geometry supplies the language |
| 85 Astronomy and astrophysics | **Out of scope (deliberate)** |
| 86 Geophysics | **Out of scope (deliberate)** |
| 90 Operations research, mathematical programming | applied-analysis-optimization/convex-duality-kkt |
| 91 Game theory, economics, finance, social sciences | **Out of scope (deliberate)**: Black–Scholes appears only as an example in probability-theory/sdes-and-pdes |
| 92 Biology and other natural sciences | **Out of scope (deliberate)** |
| 93 Systems theory; control | **Out of scope (deliberate)** |
| 94 Information and communication theory, circuits | **Partial**: frontier-combinatorics-topology/designs-codes-random-matrices (locally testable codes); graduate-combinatorics/convex-geometry-lattices (lattices and codes) |
| 97 Mathematics education | **Out of scope (deliberate)**: pedagogy is the app's own job, not curriculum content |

---

## Coverage source: Princeton generals advanced topics

The general topics are fixed for every student: algebra, real analysis and complex analysis (department page). Each student also chooses two advanced topics from distinct areas. The list below aggregates the advanced topics in all 206 student reports in the Graduate Students' Guide to Generals, read 2026-11-24. Counts are numbers of reports.

| Source topic | Covered by units |
|---|---|
| Algebra; real analysis; complex analysis (required of all) | earlier tiers: abstract-algebra-1, algebra-2, group-theory, rings-modules, fields-galois; real-analysis-1, measure-integration, functional-analysis; complex-analysis-1, complex-analysis-2 |
| Algebraic Geometry (53; Complex Algebraic Geometry 1) | varieties-curves; schemes-cohomology; complex-geometry |
| Algebraic Number Theory (45; Number Theory 1; Quadratic Forms 1) | algebraic-number-theory (Hasse–Minkowski in /extensions-local-fields); elliptic-curves-modular-forms |
| Algebraic Topology (44) | homology; cohomology-homotopy; characteristic-classes-homotopy; category-homological-algebra/spectral-sequences |
| Differential Geometry (32) | riemannian-geometry; bundles-connections; characteristic-classes-homotopy/chern-pontryagin-classes; complex-geometry/kahler-manifolds |
| Analytic Number Theory (24; Additive Number Theory 1) | analytic-number-theory; graduate-combinatorics/roth-szemeredi, /sumsets-freiman |
| PDEs (23; Elliptic PDEs 5; Elliptic PDEs of Second Order 1; Hyperbolic PDEs 1; Navier–Stokes 1; Fluid Dynamics 1) | pde (all units); frontier-analysis-pde/kinetic-theory-hilbert-sixth |
| Representation Theory (20); of Compact Lie Groups (12); of Lie Groups (2); of Finite Groups (2); Lie Groups, Lie Algebras, Lie Groups and Symmetric Spaces (1 each) | lie-groups-algebras (all units); finite-group-representations. **Partial**: symmetric spaces only via riemannian-geometry and the Bott periodicity references |
| Hopf Algebras (1) | **Gap (deliberate)**: specialist topic |
| Harmonic Analysis (18); Singular Integrals (5); Singular Integrals/Harmonic Analysis (1); Harmonic Analysis of Wavelets (1) | harmonic-analysis (all units); wavelet bases as a key term in /littlewood-paley |
| Riemannian Geometry (14) | riemannian-geometry; low-dimensional-topology/hyperbolic-geometrization; frontier-analysis-pde/stable-minimal-hypersurfaces |
| Functional Analysis (11) | functional-analysis; spectral-operator-algebras |
| Differential Topology (11) | smooth-manifolds; characteristic-classes-homotopy; low-dimensional-topology/morse-h-cobordism |
| Ergodic Theory (6); Ergodic Theory and Dynamical Systems (1); Ergodic Number Theory (1) | ergodic-theory (homogeneous dynamics and Littlewood/Oppenheim in /hyperbolic-homogeneous-dynamics) |
| Dynamical Systems (5); Hamiltonian Dynamical Systems (1) | ode-dynamics; ergodic-theory/hyperbolic-homogeneous-dynamics; symplectic-mathematical-physics/hamiltonian-mechanics |
| Symplectic Topology (5); Symplectic Geometry (1) | symplectic-mathematical-physics; frontier-combinatorics-topology/symplectic-recent-pardon |
| Stochastic Processes (5); Probability Theory (3); Probability (2); Theory of Probability (1) | probability-theory (all units) |
| Several Complex Variables (4) | complex-geometry/complex-manifolds-dolbeault. **Gap (partial)**: pseudoconvexity and the ∂̄-Neumann problem are not carded |
| Complex Geometry (4); Compact Riemann Surfaces (3); Riemann Surfaces (1) | complex-geometry; varieties-curves/riemann-roch-curves; complex-analysis-2 |
| Commutative Algebra (4) | commutative-algebra |
| Mathematical Physics (3); Statistical Physics (1); Statistical Mechanics and Ergodic Theory (1) | symplectic-mathematical-physics; spectral-operator-algebras. **Gap (partial)**: statistical mechanics (see MSC 82) |
| Computational Complexity (3); Computational complexity (1); Computational Complexity Theory (1) | **Gap (partial)**: P vs NP in research-literacy/millennium-problems, computability in model-set-theory/computability-degrees-mrdp; complexity theory is left to a computer science track |
| Model Theory (2); Set Theory (1); Set Theory and Logic (1) | model-set-theory |
| Metric Geometry (2); Metric Embeddings (1) | **Partial**: quasi-isometry and Švarc–Milnor in low-dimensional-topology/hyperbolic-geometrization; Johnson–Lindenstrauss in graduate-combinatorics/local-lemma-concentration |
| Combinatorics (2); Probabilistic Method (1); Probabilistic Combinatorics (1); Extremal Combinatorics (1); Graph theory (1); Discrete Math (1); Discrete Geometry (1); Algebraic Combinatorics (1) | graduate-combinatorics; combinatorics-graphs. **Gap (partial)**: algebraic combinatorics is not carded |
| Matroid Theory and Combinatorial Optimization (1); Graph Theory and Combinatorial Optimization (1) | **Partial**: LP duality in applied-analysis-optimization/convex-duality-kkt; matroids deliberately omitted |
| Game Theory (1) | **Gap (deliberate)**: MSC 91 is out of scope |
| Atiyah–Singer Index Theorem (1) | spectral-operator-algebras/von-neumann-fredholm (statement); characteristic-classes-homotopy/cobordism-signature (signature theorem) |

---

## Sources checked (with URLs)

**Coverage sources.**
- MSC2020: https://msc2020.org/ ; full list https://msc2020.org/MSC_2020.csv
- Princeton generals: https://web.math.princeton.edu/generals/ ; report index https://web.math.princeton.edu/generals/students/ (the `_meta` file of each report, 206 reports) ; https://web.math.princeton.edu/generals/info.html ; https://web.math.princeton.edu/generals/standard.html ; program requirements https://www.math.princeton.edu/node/45

**Research-literacy facts.**
- https://arxiv.org/category_taxonomy ; https://arxiv.org/list/math/new
- https://www.claymath.org/millennium-problems/ ; https://www.claymath.org/millennium/poincare-conjecture/
- https://www.mathunion.org/imu-awards/fields-medal ; https://www.mathunion.org/imu-awards/fields-medal/fields-medals-2026

**Frontier items.**
- Annals: https://annals.math.princeton.edu/toappear ; https://annals.math.princeton.edu/2025/201 ; https://annals.math.princeton.edu/2025/202 ; https://annals.math.princeton.edu/2026/203 ; https://annals.math.princeton.edu/2026/204
- arXiv abstract pages: 2405.03599, 2405.03648, 2409.07051, 2409.08670, 2409.09856, 2502.17655, 2410.20392, 2502.20645, 2412.01768, 2501.18774, 2405.20552, 2412.15044, 2412.09075, 2504.05042, 2408.07818, 2503.01800, 2303.09521, 2302.05537, 2311.05762, 2310.17459, 2506.24088 (with HTML full text https://arxiv.org/html/2506.24088v2), 2405.16513, 2401.01492, 2402.10452, 1912.12545, 2111.06507, 1401.3665, 2111.04808, 2405.16026. Each is at https://arxiv.org/abs/ID.

**Formalization.**
- PFR: https://github.com/teorth/pfr ; https://teorth.github.io/pfr/ ; https://github.com/teorth/pfr/commits/master/?since=2023-12-01&until=2023-12-08 ; https://terrytao.wordpress.com/2023/11/ ; https://terrytao.wordpress.com/2023/12/
- Equational Theories Project: https://github.com/teorth/equational_theories ; https://teorth.github.io/equational_theories/ ; https://teorth.github.io/equational_theories/paper.pdf
- Sphere packing: https://thefundamentaltheor3m.github.io/Sphere-Packing-Lean/ ; https://github.com/thefundamentaltheor3m/Sphere-Packing-Lean ; https://www.math.inc/sphere-packing ; https://www.math.inc/
- FLT, Liquid Tensor and Flyspeck: https://github.com/ImperialCollegeLondon/FLT ; https://github.com/leanprover-community/lean-liquid ; https://github.com/flyspeck/flyspeck
- Lean learning: https://leanprover-community.github.io/mathematics_in_lean/ ; https://lean-lang.org/theorem_proving_in_lean4/ ; https://adam.math.hhu.de/ (Lean Game Server) with https://github.com/leanprover-community/NNG4 ; https://live.lean-lang.org/ ; https://leanprover-community.github.io/mathlib4_docs/

**Practice URLs (each fetched).** https://macaulay2.com/ ; https://www.lmfdb.org/ ; https://pari.math.u-bordeaux.fr/ ; https://doc.sagemath.org/html/en/thematic_tutorials/lie.html ; https://snappy.computop.org/ ; https://knotinfo.org/ ; https://www.cvxpy.org/ ; https://pythonot.github.io/ ; https://fenicsproject.org/ ; https://www.chebfun.org/

**Textbook tables of contents.** These were checked by helper agents against publisher front matter or catalogue scans.
- Springer front matter at `https://link.springer.com/content/pdf/bfm:<eISBN>/1`, used for Eisenbud, Shafarevich, Harris, Hartshorne, Neukirch, Marcus, Davenport (2nd ed.), Silverman, Diamond–Shurman, Humphreys, Fulton–Harris, Hall (both books), Bröcker–tom Dieck, Serre, Brown, Mac Lane, Øksendal, Grafakos (both), Arnold, Cannas da Silva, Brenner–Scott and Einsiedler–Ward.
- Crossref chapter records (`https://api.crossref.org/works?filter=isbn:...`), used for Evans, Duoandikoetxea, Villani, Walters, Folland, Rolfsen, Lickorish, Farb–Margalit, Thurston, Gompf–Stipsicz, Guth, Conway–Sloane, Kunen (1980), Soare and the Princeton Companion.
- Atiyah–Macdonald: https://www.routledge.com/Introduction-To-Commutative-Algebra/Atiyah/p/book/9780429493638
- Riehl: https://emilyriehl.github.io/files/context.pdf
- Weibel: https://www.cambridge.org/core/books/an-introduction-to-homological-algebra/AAA3F16482097015CD12D4376D505282
- Vakil: https://press.princeton.edu/books/hardcover/9780691268668/the-rising-sea
- Milne: https://www.jmilne.org/math/CourseNotes/CFT.pdf
- Durrett: https://assets.cambridge.org/97811084/73682/toc/9781108473682_toc.pdf
- Williams: https://assets.cambridge.org/97805214/06055/toc/9780521406055_toc.pdf
- Le Gall: https://link.springer.com/book/10.1007/978-3-319-31089-3
- Karatzas–Shreve: https://link.springer.com/book/10.1007/978-1-4612-0949-2
- Demeter: https://www.cambridge.org/core/books/fourier-restriction-decoupling-and-applications/277AEB2D8A1D3733C61A89FF623D50D1
- Reed–Simon: http://catdir.loc.gov/catdir/toc/els031/80039580.html
- Murphy: http://catdir.loc.gov/catdir/toc/els031/90000524.html
- Stein: http://catdir.loc.gov/catdir/toc/prin031/92044035.html
- McDuff–Salamon: https://academic.oup.com/book/43512
- Boyd–Vandenberghe: https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf
- Trefethen: https://people.maths.ox.ac.uk/trefethen/ATAP/
- Katok–Hasselblatt: https://assets.cambridge.org/97805215/75577/toc/9780521575577_toc.pdf
- Milnor–Stasheff and Milnor, Morse Theory: De Gruyter/Crossref chapter records under DOI prefixes 10.1515/9781400881826 and 10.1515/9781400881802
- Milnor, Lectures on the h-Cobordism Theorem: contents and section headings from a scanned copy (link withheld because I could not confirm it is authorised)
- Bott–Tu: contents pages of the Springer GTM 82 edition (seen in a third-party PDF copy; link withheld for the same reason)
- Hatcher: https://pi.math.cornell.edu/~hatcher/VBKT/VBKT-tc.html ; https://pi.math.cornell.edu/~hatcher/AT/at1-tc.html ; https://pi.math.cornell.edu/~hatcher/SSAT/SSATpage.html
- Huybrechts: https://swbplus.bsz-bw.de/bsz113281609inh.htm
- Griffiths–Harris: http://www.gbv.de/dms/hebis-mainz/toc/054725259.pdf
- Forster: https://www.math.lmu.de/~forster/books/riem/riemsurf.html
- Scorpan: http://www.gbv.de/dms/goettingen/474981673.pdf
- Alon–Spencer: http://www.gbv.de/dms/ilmenau/toc/826966969.PDF
- Zhao: https://yufeizhao.com/gtacbook/
- Matoušek: https://kam.mff.cuni.cz/~matousek/dgtoc.txt
- Marker: http://www.gbv.de/dms/goettingen/34725036X.pdf
- van den Dries: https://www.cambridge.org/core/books/tame-topology-and-ominimal-structures/7AC940248AF2B05DA4D33E4FB05C97A2
- Matiyasevich: https://logic.pdmi.ras.ru/~yumat/H10Pbook/bookcont.htm
- Iwaniec–Kowalski: https://www.schweitzer-online.de/en/buch/Iwaniec/Analytic-Number-Theory/9781470467708/A62819240/
- Cassels–Fröhlich (chapter numbers VI, VII, XV only, seen in excerpts of old.maa.org/node/110814)

## Not verified, and how it is handled

- **Section numbers.** These are cited only where a table of contents was seen (Hartshorne, Shafarevich, Neukirch, Humphreys, Durrett, Grafakos, Reed–Simon, Boyd–Vandenberghe, Milnor–Stasheff, Bott–Tu, Hatcher, Huybrechts, Griffiths–Harris, Matoušek, Marker, Folland, Silverman App. C).
- **Chapter-level only.** Evans, Murphy, Riehl (section numbering differs between editions) and Davenport are cited by chapter only. For Davenport, the 3rd-edition numbering is assumed to match the 2nd edition that was checked.
- **Classical papers.** Paper citations in refs (for example Wiles 1995, Breuil–Conrad–Diamond–Taylor 2001, Zhang 2014, Maynard 2015, Viazovska 2017, Bourgain–Demeter–Guth 2016, Cohen 1963, Gromov 1985) are standard bibliographic data. They were not re-fetched in this session.
- **Kelley–Meka.** Its conference publication was not checked.
- **Title-level checks only.** Newton–Thorne, Burungale–Tian, Ruhstorfer and Davis–Hayden–Huang–Ruberman–Sunukjian were checked only by title on the Annals pages. Their cards must not go beyond what the titles and venues state.
- **FLT formalization report.** It was not found and is dropped, as noted in the frontier table.
- **Budgets.** No tier, module or unit-total budget was changed.
