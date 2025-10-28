# FickleFlicks Activity Documentation

FickleFlicks is an educational simulation designed to teach children about the importance of verifying links before clicking them.

It uses a mock “kids’ streaming site” to create a safe, hands-on learning moment. When users attempt to watch a video, they are redirected to an explanatory page that reveals the trick and discusses how to stay safe online.

-------------------------------------------------------------------
## LEARNING GOALS
-------------------------------------------------------------------
- Understand that not every link goes where it claims to.
- Recognize the importance of checking website addresses (URLs).
- Discuss why legitimate sites never surprise users with unrelated pages or requests.
- Learn how to respond if something unexpected happens online.

-------------------------------------------------------------------
## STRUCTURE
-------------------------------------------------------------------

```bash
activities/FickleFlicks/
├── index.html      → main mock streaming interface
├── redirect.html   → transitional “loading” animation page
├── gotcha.html     → educational explanation and safety lesson
├── script.js       → handles button interactions and redirects
├── style.css       → shared styling
└── images/         → thumbnails and hacker illustration
```

-------------------------------------------------------------------
## HOW IT WORKS
-------------------------------------------------------------------
1. index.html mimics a streaming platform (“UltraStream Junior”).
   - Users see fake show thumbnails like “Space Pals” and “Forest Friends.”
   - Clicking “Watch” or “Play” begins a redirect sequence.

2. redirect.html displays a short animation:
   - Shows “Loading movie...” text.
   - After 2 seconds, a cartoon hacker image fades in and zooms slowly.
   - After ~5 seconds, a speech bubble appears (“Gotcha!”).
   - After ~11 seconds total, it redirects to gotcha.html.

3. gotcha.html explains what happened:
   - Clarifies the site was a simulation.
   - Lists safe-browsing tips.
   - Offers a “Try Again” button returning to index.html.

-------------------------------------------------------------------
## TEACHING GUIDANCE
-------------------------------------------------------------------
Recommended classroom use:
1. Have students explore index.html as though it were a real streaming site.
2. Let them experience the redirect sequence.
3. Discuss what happened using the gotcha.html page as a prompt.

Key reflection questions:
- How did it feel when the site didn’t behave as expected?
- What clues could you look for next time?
- Why do some links lead to misleading or unsafe places?

Goal: build confidence, not fear — emphasize awareness and curiosity.

-------------------------------------------------------------------
## IMAGE CREDITS
-------------------------------------------------------------------
All images generated via OpenAI’s DALL·E for educational demonstration purposes.
- space-pals.png — cartoon puppy astronauts
- forest-friends.png — friendly forest animals
- ocean-quest.png — Pixar-style ocean adventure
- hacker-still.png — cartoon hacker illustration

-------------------------------------------------------------------
## CONTRIBUTORS
-------------------------------------------------------------------
- **Ben Shaw** — Project lead and developer
GitHub: [@benshaw2](https://github.com/benshaw2)

-------------------------------------------------------------------
LICENSE
-------------------------------------------------------------------
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)

You may share and adapt this work for non-commercial educational purposes, provided that attribution is given and derivative works are shared under the same license.
