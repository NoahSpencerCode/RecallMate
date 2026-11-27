-- Local development seed (runs on `npm run db:reset`; never deployed).
--
-- Demo account:  demo@recallmate.test  /  recallmate-demo
-- Use the same password for any throwaway accounts you sign up with locally.
-- Local auth emails (confirmations, password resets) land in Mailpit:
-- http://127.0.0.1:54324
--
-- The demo user has three packs at different stages plus ~6 weeks of review
-- history, so Today, Library and Progress all have something to show.

do $$
declare
  demo constant uuid := '0d1f7a3c-5b2e-4c11-9a6d-7e3b2c1d4e5f';
  card record;
  i int;
  d int;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', demo, 'authenticated', 'authenticated',
    'demo@recallmate.test', extensions.crypt('recallmate-demo', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now() - interval '45 days', now(),
    '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), demo, demo::text,
    jsonb_build_object('sub', demo::text, 'email', 'demo@recallmate.test', 'email_verified', true),
    'email', now(), now(), now()
  );

  -- Calculus I: well underway (some due, some soon, some mastered).
  i := 0;
  for card in select * from public.pack_cards where pack_id = 'calc-derivatives' order by position limit 16 loop
    i := i + 1;
    insert into public.memories (
      user_id, title, body, answer, accepted_answers, answer_display, search_query, pack_id, pack_card_id,
      stage, due_on, review_count, lapse_count, last_reviewed_on, created_at
    ) values (
      demo, card.title, card.body, card.answer, card.accepted_answers, card.answer_display, card.search_query,
      card.pack_id, card.id,
      case when i <= 6 then 1 + i % 2 when i <= 11 then 3 else 5 + i % 2 end,
      case when i <= 6 then current_date - (i % 3) when i <= 11 then current_date + (i - 6) else current_date + 6 + i end,
      case when i <= 6 then 2 when i <= 11 then 4 else 6 end,
      case when i % 4 = 0 then 1 else 0 end,
      current_date - 1,
      now() - interval '40 days'
    );
  end loop;

  -- Biology: added today at 5 new cards a day.
  i := 0;
  for card in select * from public.pack_cards where pack_id = 'bio-cell-structure' order by position loop
    insert into public.memories (
      user_id, title, body, answer, accepted_answers, answer_display, search_query, pack_id, pack_card_id, due_on
    ) values (
      demo, card.title, card.body, card.answer, card.accepted_answers, card.answer_display, card.search_query,
      card.pack_id, card.id, current_date + i / 5
    );
    i := i + 1;
  end loop;

  -- A couple of the user's own cards.
  insert into public.memories (user_id, title, body, answer, accepted_answers, stage, due_on, review_count, last_reviewed_on)
  values
    (demo, 'Office hours for CHEM 201?', 'Tuesdays 2–4 pm, Science Hall 310. Bring the problem set.', null, '{}', 2, current_date, 3, current_date - 2),
    (demo, 'Big-O of looking up a key in a hash map (average case)?', 'O(1) on average; O(n) worst case when everything collides.',
     'O(1)', array['constant', 'constant time'], 1, current_date + 1, 1, current_date - 1);

  -- Review history: a 6-day streak ending yesterday, plus older scattered days.
  for d in 1..6 loop
    insert into public.reviews (user_id, reviewed_on, reviewed_at, passed, attempts)
    select demo, current_date - d, now() - make_interval(days => d), (g % 5) <> 0, 1
      from generate_series(1, 3 + d) as g;
  end loop;
  for d in 9..44 by 3 loop
    insert into public.reviews (user_id, reviewed_on, reviewed_at, passed, attempts)
    select demo, current_date - d, now() - make_interval(days => d), (g % 4) <> 0, 1
      from generate_series(1, 2 + d % 7) as g;
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Professions. Until a migration loads real profession content, a small
-- sample of both professions stands in so the screens have something to show.
-- Either way, the demo user is enrolled in Mathematics with two cards due.
-- ---------------------------------------------------------------------------
do $$
declare
  demo constant uuid := '0d1f7a3c-5b2e-4c11-9a6d-7e3b2c1d4e5f';
begin
  if not exists (select 1 from public.professions) then
    insert into public.professions (id, name, tagline, description, icon, accent, gradient, planned_cards, position) values
      ('mathematics', 'Mathematics', 'From counting to research mathematics, one card at a time.',
       'A complete path through mathematics: school algebra and geometry, the undergraduate major, the graduate core tested on PhD qualifying exams, the main research areas, and today''s frontier.',
       'sigma', '#6C4DFF', array['#7B61FF', '#B44DFF'], 6000, 0),
      ('embedded-ai', 'Embedded AI Engineering', 'Make machine learning run on tiny, power-sipping chips.',
       'From bits, volts and your first C program to the systems that run neural networks on microcontrollers, phones and custom accelerators, up to today''s research on efficient AI.',
       'chip', '#0FA3A3', array['#16C2C2', '#3B82F6'], 5000, 1);

    insert into public.profession_tiers (profession_id, tier, slug, name, milestone, summary, planned_cards) values
      ('mathematics', 0, 'pre-algebra', 'Pre-algebra', null, 'You can work fluently with numbers, fractions and simple equations.', 140),
      ('mathematics', 1, 'high-school', 'High school', 'High school', 'You know high-school algebra, geometry, trigonometry and probability.', 320),
      ('mathematics', 2, 'first-year', 'First-year university', null, 'You can do calculus, matrix algebra and basic proofs.', 560),
      ('mathematics', 3, 'undergraduate-core', 'Undergraduate core', null, 'You can prove theorems in analysis, algebra and topology.', 800),
      ('mathematics', 4, 'advanced-undergraduate', 'Advanced undergraduate', 'Bachelor''s', 'You know what a strong math graduate knows.', 740),
      ('mathematics', 5, 'qualifier-1', 'Qualifier I: algebra and analysis', null, 'You can pass a PhD qualifying exam in algebra and analysis.', 950),
      ('mathematics', 6, 'qualifier-2', 'Qualifier II: geometry and topology', 'Quals', 'You can pass a qualifying exam in geometry and topology.', 650),
      ('mathematics', 7, 'advanced-graduate-1', 'Advanced graduate I', null, 'You can follow graduate courses in algebraic geometry and number theory.', 800),
      ('mathematics', 8, 'advanced-graduate-2', 'Advanced graduate II', null, 'You can follow graduate courses across analysis, geometry and probability.', 740),
      ('mathematics', 9, 'research-frontier', 'Research frontier', 'PhD', 'You can read current research and know the field''s open problems.', 300),
      ('embedded-ai', 0, 'foundations', 'Foundations', null, 'You can read binary, reason about circuits and write small programs.', 400),
      ('embedded-ai', 1, 'core-engineering', 'Core engineering', null, 'You know C, data structures, digital logic and how a computer runs code.', 600),
      ('embedded-ai', 2, 'embedded-systems', 'Embedded systems', 'Junior engineer', 'You can build firmware for a microcontroller.', 600),
      ('embedded-ai', 3, 'math-signals', 'Math and signals for ML', null, 'You know the maths and signal processing behind machine learning.', 500),
      ('embedded-ai', 4, 'ml-deep-learning', 'ML and deep learning', 'Bachelor''s', 'You can train and evaluate neural networks.', 650),
      ('embedded-ai', 5, 'efficient-ml-tinyml', 'Efficient ML and TinyML', 'Master''s', 'You can shrink a model and run it on a microcontroller.', 750),
      ('embedded-ai', 6, 'ml-systems', 'ML systems: compilers, runtimes, accelerators', null, 'You understand the compilers and chips that run AI.', 750),
      ('embedded-ai', 7, 'phd-core', 'Advanced / PhD core', 'Quals', 'You can pass a PhD qualifying exam in ML systems.', 500),
      ('embedded-ai', 8, 'research-frontier', 'Research frontier', 'PhD', 'You can read and critique current efficient-AI research.', 250);

    insert into public.profession_modules (id, profession_id, tier, position, title, summary, planned_cards, refs, practice) values
      ('mathematics/expressions-equations', 'mathematics', 0, 3, 'Expressions and equations', 'Solve linear equations and inequalities and turn words into algebra.', 35, array['AoPS Prealgebra'], '[]'),
      ('mathematics/real-analysis-1', 'mathematics', 3, 30, 'Real analysis I', 'Prove the facts calculus takes for granted.', 150, array['Abbott, Understanding Analysis', 'Rudin, Principles of Mathematical Analysis ch. 1–7'], '[]'),
      ('mathematics/measure-integration', 'mathematics', 5, 54, 'Measure and integration', 'Integrate with Lebesgue''s theory and swap limits with integrals safely.', 160, array['Folland, Real Analysis ch. 1–3'], '[]'),
      ('embedded-ai/c-1', 'embedded-ai', 0, 6, 'C I', 'Write, compile and run small C programs.', 75, array['K&R ch. 1–2'], '[{"title": "CS50 problem set 1 (C)", "url": "https://cs50.harvard.edu/x/"}]'),
      ('embedded-ai/quantization-1', 'embedded-ai', 5, 53, 'Quantization I', 'Turn a float model into integers without losing accuracy.', 100, array['Jacob et al. 2018', 'Nagel et al. 2021'], '[]');

    insert into public.profession_cards (id, profession_id, module_id, position, kind, difficulty, checkpoint, title, body, answer, accepted_answers, answer_display, search_query) values
      ('mathematics/variable', 'mathematics', 'mathematics/expressions-equations', 0, 'definition', 1, false,
       'What is a **variable** in algebra?',
       E'A letter that stands for a number we don''t know yet, or one that can change.\n\nKey idea: In $3x + 2 = 11$, the variable $x$ holds the unknown value $3$.',
       null, '{}', null, 'variable in algebra'),
      ('mathematics/solve-3x-plus-2', 'mathematics', 'mathematics/expressions-equations', 1, 'problem', 1, true,
       'Solve for $x$: $3x + 2 = 11$',
       E'$x = 3$\n\nSubtract 2 from both sides to get $3x = 9$, then divide both sides by 3.',
       '3', array['x=3'], '$x = 3$', 'solving one step linear equations'),
      ('mathematics/distributive-law', 'mathematics', 'mathematics/expressions-equations', 2, 'concept', 1, false,
       'What does the **distributive law** say?',
       E'$a(b + c) = ab + ac$\n\nMultiplying a sum is the same as multiplying each term and adding.\n\nExample: $3(x + 4) = 3x + 12$.',
       null, '{}', null, 'distributive law'),
      ('mathematics/square-of-sum', 'mathematics', 'mathematics/expressions-equations', 3, 'misconception', 2, false,
       'Why is $(a + b)^2 \neq a^2 + b^2$?',
       E'Because $(a + b)^2 = a^2 + 2ab + b^2$; the middle term $2ab$ is easy to forget.\n\nWatch out: Squaring doesn''t distribute over addition. Try $a = b = 1$: $(1 + 1)^2 = 4$, but $1^2 + 1^2 = 2$.',
       null, '{}', null, 'square of a sum formula'),
      ('mathematics/negative-inequality', 'mathematics', 'mathematics/expressions-equations', 4, 'problem', 2, true,
       'Solve the inequality $-2x > 6$.',
       E'$x < -3$\n\nDivide both sides by $-2$ and flip the inequality sign: multiplying or dividing by a negative number reverses the order.',
       'x<-3', array['x < -3'], '$x < -3$', 'dividing inequality by negative number'),
      ('mathematics/words-to-equation', 'mathematics', 'mathematics/expressions-equations', 5, 'example', 2, false,
       'Write “five more than twice a number is 17” as an equation, and solve it.',
       E'$2n + 5 = 17$, so $n = 6$.\n\n“Twice a number” is $2n$ and “five more than” adds 5. Then $2n = 12$, so $n = 6$.',
       null, '{}', null, 'translating word problems into equations'),
      ('mathematics/completeness-axiom', 'mathematics', 'mathematics/real-analysis-1', 3000000, 'definition', 4, true,
       'State the **completeness axiom** of $\mathbb{R}$.',
       E'Every nonempty set of real numbers that is bounded above has a least upper bound in $\mathbb{R}$.\n\nWhy: This is what separates $\mathbb{R}$ from $\mathbb{Q}$: the set $\{q \in \mathbb{Q} : q^2 < 2\}$ is bounded above but has no least upper bound in $\mathbb{Q}$.',
       null, '{}', null, 'completeness axiom real numbers'),
      ('mathematics/bolzano-weierstrass', 'mathematics', 'mathematics/real-analysis-1', 3000001, 'theorem', 4, false,
       'State the **Bolzano–Weierstrass theorem**.',
       E'Every bounded sequence in $\mathbb{R}$ has a convergent subsequence.\n\nKey idea: Keep halving an interval that holds the sequence, always keeping a half with infinitely many terms; completeness pins down the limit.',
       null, '{}', null, 'Bolzano-Weierstrass theorem proof'),
      ('mathematics/pointwise-limit-x-to-n', 'mathematics', 'mathematics/real-analysis-1', 3000002, 'counterexample', 5, false,
       'Give continuous functions on $[0,1]$ whose pointwise limit is not continuous.',
       E'$f_n(x) = x^n$: the limit is $0$ on $[0,1)$ and $1$ at $x = 1$.\n\nWatch out: Pointwise limits of continuous functions need not be continuous; uniform convergence fixes this.',
       null, '{}', null, 'pointwise vs uniform convergence x^n'),
      ('mathematics/p-series', 'mathematics', 'mathematics/real-analysis-1', 3000003, 'problem', 5, false,
       E'Does $\displaystyle\sum_{n=1}^{\infty} \frac{1}{n^p}$ converge for $p = 1$? For $p = 2$?',
       E'It diverges for $p = 1$ (the harmonic series) and converges for $p = 2$ (to $\pi^2/6$).\n\nBy the integral test, $\sum 1/n^p$ converges exactly when $p > 1$.',
       null, '{}', null, 'p-series convergence test'),
      ('mathematics/dominated-convergence', 'mathematics', 'mathematics/measure-integration', 5000000, 'theorem', 6, true,
       'State the **dominated convergence theorem**.',
       E'If $f_n \to f$ almost everywhere and $|f_n| \le g$ for one integrable $g$, then $\int f_n \to \int f$.\n\nWhy: It lets you swap a limit and an integral, as long as one integrable function controls the whole sequence.',
       null, '{}', null, 'dominated convergence theorem'),
      ('mathematics/dct-needs-domination', 'mathematics', 'mathematics/measure-integration', 5000001, 'counterexample', 6, false,
       E'Why does $f_n = n\,\mathbf{1}_{(0,1/n)}$ show the dominated convergence theorem needs a dominating function?',
       E'$f_n \to 0$ pointwise, yet $\int_0^1 f_n = 1$ for every $n$, so the integrals tend to $1$, not $0$.\n\nKey idea: No integrable $g$ dominates every $f_n$: $\sup_n f_n(x)$ grows like $1/x$, which isn''t integrable near $0$.',
       null, '{}', null, 'dominated convergence counterexample'),
      ('embedded-ai/sizeof-int32', 'embedded-ai', 'embedded-ai/c-1', 0, 'numbers', 1, true,
       'What does `sizeof(int32_t)` evaluate to?',
       E'4 (bytes), on every platform.\n\nThe fixed-width types in `<stdint.h>` guarantee their size; a plain `int` can be 2 or 4 bytes depending on the compiler.',
       '4', array['4 bytes'], null, 'stdint.h fixed width integer types'),
      ('embedded-ai/array-index-print', 'embedded-ai', 'embedded-ai/c-1', 1, 'code', 1, false,
       E'What does this print?\n\n```c\nint a[4] = {1, 2, 3, 4};\nprintf("%d", a[1] + a[3]);\n```',
       E'6\n\nC arrays start at index 0, so `a[1]` is 2 and `a[3]` is 4.',
       '6', '{}', null, 'C array indexing zero based'),
      ('embedded-ai/compile-vs-link', 'embedded-ai', 'embedded-ai/c-1', 2, 'concept', 2, false,
       'What is the difference between **compiling** and **linking** a C program?',
       E'Compiling turns each source file into an object file; linking joins object files and libraries into one executable.\n\nExample: “undefined reference” is a linker error: the code compiled, but a function''s definition was never found.',
       null, '{}', null, 'compiling vs linking C'),
      ('embedded-ai/assignment-in-if', 'embedded-ai', 'embedded-ai/c-1', 3, 'misconception', 2, false,
       'Why is `if (x = 5)` a bug in C?',
       E'It assigns 5 to `x` and is always true; the comparison is `x == 5`.\n\nTip: Compile with warnings on (`-Wall`) and the compiler flags this.',
       null, '{}', null, 'assignment in if condition C'),
      ('embedded-ai/affine-dequantize', 'embedded-ai', 'embedded-ai/quantization-1', 5000000, 'formula', 6, true,
       'In affine quantization, how is a real value $r$ recovered from its integer code $q$?',
       E'$r = S\,(q - Z)$, with scale $S$ and zero-point $Z$.\n\nKey idea: $S$ is the step between representable values, and $Z$ is the integer that stands for real $0$ exactly, so zero padding stays exact.',
       null, '{}', null, 'affine quantization scale zero point'),
      ('embedded-ai/dram-vs-add-energy', 'embedded-ai', 'embedded-ai/quantization-1', 5000001, 'numbers', 6, false,
       'Roughly how much more energy does a DRAM read take than a 32-bit integer add (45 nm)?',
       E'About 6,400 times more: roughly 640 pJ against 0.1 pJ.\n\nWhy: Moving data costs far more than computing on it, which is why efficient inference is mostly about keeping data on-chip (Horowitz, ISSCC 2014).',
       null, '{}', null, 'Horowitz energy table DRAM access 45nm');
  end if;

  if exists (select 1 from public.professions where id = 'mathematics') then
    insert into public.profession_enrollments (user_id, profession_id, started_at)
    values (demo, 'mathematics', now() - interval '10 days')
    on conflict do nothing;

    -- Four cards opened over the last ten days; the first two are due today.
    insert into public.profession_card_states (user_id, card_id, profession_id, stage, due_on, last_reviewed_on, review_count, opened_on)
    select demo, c.id, 'mathematics',
           case when c.n <= 2 then 1 else 3 end,
           case when c.n <= 2 then current_date else current_date + 3 end,
           current_date - 1, 2, current_date - 10 + c.n::int
      from (select id, row_number() over (order by position) as n
              from public.profession_cards
             where profession_id = 'mathematics' and not retired
             order by position
             limit 4) as c
    on conflict do nothing;
  end if;
end $$;
