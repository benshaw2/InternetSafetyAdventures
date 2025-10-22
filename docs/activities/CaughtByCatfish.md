
# CaughtByCatfish Activity Documentation

CaughtByCatfish is an interactive simulation designed to teach children about online safety, digital trust, and the risks of catfishing. It uses a mock social media interface and chat-based storytelling to create a safe, hands-on learning moment. Students engage with a fictional character and reflect on how to identify manipulative behavior and protect personal information.

-------------------------------------------------------------------
## LEARNING GOALS
-------------------------------------------------------------------
- Recognize signs of online manipulation and deceptive behavior.
- Understand the importance of protecting personal information.
- Practice safe communication habits in digital environments.
- Reflect on emotional responses and decision-making during online interactions.

-------------------------------------------------------------------
## STRUCTURE
-------------------------------------------------------------------

```bash
CaughtByCatfish/
├── index.html            → Entry point and activity overview
├── feed.html             → Simulated social media feed and chat interface
├── takeaway.html         → Debrief and reflection page with chat history
├── assets/               → CSS, JS, and image assets
│   ├── css/              → Styling for feed and takeaway pages
│   ├── js/               → Chat logic, classifiers, and utilities
│   ├── data/             → Data for the Catfisher logic
│   ├── models/           → Machine Learning models for the Catfisher logic
│   └── img/              → Avatars and UI icons
├── node_modules/         → Node.js dependencies (excluded from Git)
├── package.json          → Node.js project metadata
└── package-lock.json     → Dependency lock file
```

-------------------------------------------------------------------
## HOW IT WORKS
-------------------------------------------------------------------
1. `feed.html` simulates a social media platform:
   - Students interact with a fictional character via direct messages.
   - The character uses manipulative tactics to build trust and extract information.

2. Chat responses are generated using a classifier and scripted logic:
   - `chat.js` handles user input and message rendering.
   - `ChatManager.js` processes input and manages conversation phases.

3. `takeaway.html` provides a debrief:
   - Displays chat history and manipulative goals.
   - Offers reflection prompts and safety tips.

-------------------------------------------------------------------
## TEACHING GUIDANCE
-------------------------------------------------------------------
Recommended classroom use:
1. Introduce the activity and let students explore `feed.html`.
2. Allow them to engage in the simulated chat.
3. Use `takeaway.html` to guide discussion and reflection.

Key reflection questions:
- What made the character seem trustworthy?
- What information did you share, and why?
- How can you protect yourself in similar situations?

Goal: build awareness and confidence — emphasize curiosity and critical thinking.

-------------------------------------------------------------------
## IMAGE CREDITS
-------------------------------------------------------------------
All images generated via OpenAI’s DALL·E for educational demonstration purposes.
- Avatars and UI icons — fictional characters and stylized elements

-------------------------------------------------------------------
## CONTRIBUTORS
-------------------------------------------------------------------
- **Ben Shaw** — Project lead and developer
  GitHub: https://github.com/benshaw2

-------------------------------------------------------------------
LICENSE
-------------------------------------------------------------------
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)

You may share and adapt this work for non-commercial educational purposes, provided that attribution is given and derivative works are shared under the same license.
