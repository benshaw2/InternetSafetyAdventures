# InternetSafetyAdventures

InternetSafetyAdventures is an open educational project that helps children and families learn about internet safety through interactive simulations.

Each activity presents a playful, web-based experience that mimics a common online situation, then teaches users what really happened and how to stay safe next time.

-------------------------------------------------------------------
## Overview
-------------------------------------------------------------------

This project is built to support teachers, parents, and students learning about digital literacy and safe online behavior.
It uses simple HTML, CSS, and JavaScript, requiring no server or external dependencies. Everything runs locally or through GitHub Pages.

Current Activity:
- WrongLink — a simulation of a fake streaming site.
  Children click what appears to be a normal “Watch” button, but are redirected to a teaching page explaining how links can be misleading and why checking URLs matters.

Future Ideas:
- PhishyLogin — fake login screen demonstrating credential phishing.
- PrizeTrap — “You’ve won!” popup teaching about scams and data requests.
- OversharingApp — simulated social app teaching privacy awareness.

-------------------------------------------------------------------
## Project Structure
-------------------------------------------------------------------

InternetSafetyAdventures/
│
├── README.md
├── LICENSE.txt
├── activities/
│   └── (self-contained activities live here)
└── docs/
    └── activities/
        └── (each activity has its own documentation .md file)

-------------------------------------------------------------------
## Running Locally
-------------------------------------------------------------------

You can open any activity directly in your browser — no installation needed.

1. Clone or download this repository.
2. Open the activity folder, for example:
   activities/WrongLink/index.html
3. Double-click index.html to launch it.

Hosting via GitHub Pages:
1. Push the repo to your GitHub account.
2. Go to Settings → Pages.
3. Under Source, select “Deploy from branch” (main) and /(root).
4. GitHub will provide a live URL like:
   https://yourname.github.io/InternetSafetyAdventures/

-------------------------------------------------------------------
## Educational Intent
-------------------------------------------------------------------

These simulations are designed for guided discussion.
Children experience a small, safe “trick” and then see a clear explanation about what happened and what to do next time.

They are meant to:
- Encourage critical thinking online.
- Teach awareness of deceptive links and design patterns.
- Provide educators with a ready-made, self-contained classroom demo.

Experiences should never collect data, connect to real sites, or imitate real brands.

-------------------------------------------------------------------
## Credits and Attributions
-------------------------------------------------------------------

Many Images and illustrations were generated via OpenAI’s DALL·E and edited for educational use.
Code, layout, and activity design © [Ben Shaw], 2025.

-------------------------------------------------------------------
## License
-------------------------------------------------------------------

This project is licensed under the
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

You are free to:
- Share — copy and redistribute the material in any medium or format.
- Adapt — remix, transform, and build upon the material.

Under the following terms:
- Attribution — You must give appropriate credit.
- NonCommercial — You may not use the material for commercial purposes.
- ShareAlike — If you remix or build upon it, you must distribute your contributions under the same license.

See LICENSE.txt for full terms.

-------------------------------------------------------------------
## Contributing
-------------------------------------------------------------------

Contributions are welcome! New activities should be entirely self-contained and adhere to this structure (or similar):

activities/
└── ActivityName/
    ├── index.html
    ├── script.js
    ├── style.css
    └── images/

Contributor Requirements:
1. Contain only safe, age-appropriate material.
2. Include a docs/activities/ActivityName.md file explaining:
   - Purpose
   - Learning goals
   - Instructions for use
   - Contributor names and GitHub handles
3. Include only original, royalty-free, or AI-generated images.
4. Avoid connecting to external sites or APIs.

Quality & Safety Review Checklist:
- Open all HTML files locally and verify no network requests occur.
- Search code for fetch, XMLHttpRequest, or eval statements.
- Test with network disconnected — everything should still work.
- Review visuals and tone for child-appropriate content.


-------------------------------------------------------------------
## Contributor Credits and GitHub Handles
-------------------------------------------------------------------

Each activity’s documentation lists contributors with their GitHub profiles for transparency and credit.

When submitting a contribution, please include a section formatted like this in your documentation file:

Contributors:
- Jane Doe — Lead Designer 
  GitHub: https://github.com/janedoe
- John Smith — JavaScript Developer 
  GitHub: https://github.com/johnsmithdev

Guidelines:
- Use your real name, display name, or team name — whichever you prefer.
- Include only your public GitHub profile link (no personal contact info).
- Contributors must ensure all material is child-safe, original, and suitable for classroom use.
- This transparency helps maintain authenticity, accountability, and educational trust.

-------------------------------------------------------------------
## Acknowledgments
-------------------------------------------------------------------

This project was created to make digital safety education engaging, interactive, and free.
Inspired by the idea that the best learning comes from safe mistakes and guided reflection.

“Tell me and I forget, teach me and I may remember, involve me and I learn.”
— Benjamin Franklin (Attributed)
