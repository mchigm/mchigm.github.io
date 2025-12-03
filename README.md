# Chen Yueming's Official Website

[Visit the website](https://mchigm.github.io)

---

## About

This repository contains the source code for Chen Yueming's (陈悦铭) official personal website. The site showcases academic work, research projects, publications, and professional experience.

## Repository Structure

```
./
├── index.html                          # Main landing page
├── style.css                           # Main stylesheet
├── main.js                             # Common JavaScript functions
├── utils.js                            # Shared JavaScript utilities
├── utils.ts                            # TypeScript utilities
├── tsconfig.json                       # TypeScript configuration
├── README.md                           # Project README (this file)
├── .gitignore                          # Git ignore configuration
├── .vscode/                            # Editor settings
├── .idea/                              # IDE metadata (optional)
├── .git/                               # Git repository data
└── Folders/                            # Organized content directory
    ├── Overview.md                     # Folder-level overview (originally README.md)
    ├── TOC.md                          # Detailed file structure documentation
    ├── Files/                          # Website files and content
    │   ├── mobilewebsite.html          # Mobile-optimized version
    │   ├── Web site/                   # Main content pages
    │   │   ├── 81n.png                 # Profile photo
    │   │   ├── bibliorgraphy.htm       # Bibliography
    │   │   ├── internship.htm          # Internship experience
    │   │   ├── researches.htm          # Research projects
    │   │   ├── works.htm               # Current work
    │   │   ├── resources.html          # Resources page
    │   │   └── projects.htm            # Projects list
    │   ├── Documents/                  # Academic publications
    │   │   └── Personalized_Generative_Model_via_Active_Learning.pdf
    │   ├── Resources/                  # PDF files and resources
    │   │   ├── business-card.pdf
    │   │   ├── 20240412-方正证券-...有限注意力...因子构建.pdf
    │   │   └── 中信建投-大数据人工智能研究之六：机器学习因子有效性分析.pdf
    │   └── files/                      # Special features & apps
    │       ├── popup-pages/            # Pop-up site functionality
    │       │   ├── pop-up.htm          # Listing + dynamic loader
    │       │   ├── popup-viewer.html   # Viewer template
    │       │   ├── popup-manager.js    # Runtime JS
    │       │   ├── popup-manager.ts    # TypeScript source
    │       │   ├── minecraft-challenge.md
    │       │   ├── self-test-popup.md
    │       │   └── test-popupsite.md
    │       └── simple forum/           # Source forum subproject root [WIP]
    │           └── source-MCHIGM/      # Forum project (submodule)
    │               ├── .gitignore
    │               ├── LICENSE
    │               ├── Project_Summary.md           # Project summary (orig. About.md)
    │               ├── Project_Vision.md            # Vision document (orig. 项目远景.md)
    │               ├── Contributing_Guide.md        # Contribution guidelines (orig. CONTRIBUTING.md)
    │               ├── Implementation_Verification.md  # Implementation status (orig. IMPLEMENTATION_VERIFICATION.md)
    │               ├── backend/                # Backend implementations
    │               │   ├── Backend_Documentation.md  # Backend docs (orig. README.md)
    │               │   ├── php/                # PHP prototype
    │               │   └── python/             # Python services
    │               ├── config/                 # Configuration examples
    │               │   └── config.example.yml
    │               ├── docs/                   # Documentation
    │               │   ├── Deployment_Guide.md      # Deployment guide (orig. deployment.md)
    │               │   ├── api/
    │               │   │   └── API_Documentation.md  # API docs (orig. README.md)
    │               │   └── progress/
    │               │       └── Progress_Log.md      # Progress log (orig. README.md)
    │               ├── examples/               # Usage examples & sample data
    │               │   ├── Examples-Overview.md     # Examples overview (orig. README.md)
    │               │   └── data/
    │               └── frontend/               # Forum frontend app
    │                   ├── Frontend-Overview.md     # Frontend overview (orig. README.md)
    │                   ├── package.json
    │                   ├── tsconfig.json
    │                   ├── src/
    │                   │   ├── api.ts
    │                   │   ├── main.ts
    │                   │   ├── types.ts
    │                   │   └── utils.ts
    │                   └── public/
    │                       ├── index.html
    │                       └── styles/
    │                           └── main.css
    └── etc/                          # Miscellaneous and archived files
        ├── Resume Yueming Bryan 202509.pages
        ├── business-card.html
        ├── bnbpythoninc.png
        ├── dbSettings.json
        └── main.php
```

For detailed documentation about the folder structure, see [TOC.md](TOC.md).

## Features

- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Pop-up Pages**: Dynamic content system for announcements and updates
- **Academic Portfolio**: Showcases publications, research, and projects
- **Social Integration**: Links to GitHub, LinkedIn, Kaggle, and other platforms

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- TypeScript (for enhanced type safety and modularity)
- Font Awesome icons
- Markdown support for pop-up pages

## About Chen Yueming

- **Current**: Year-1 Electrical Engineering Student at City University of Hong Kong
- **Role**: Founder/CIO at BnBpython
- **Expertise**: 26+ programming languages, Machine Learning, Quantum Computing, Physics
- **Publications**: SCI Journal author, multiple conference papers

## Contact

- **Email**: [yuemingdd@gmail.com](mailto:yuemingdd@gmail.com)
- **GitHub**: [mchigm](https://github.com/mchigm)
- **LinkedIn**: 陈悦铭
- **Kaggle**: [Bryan Chen Yue ming](https://www.kaggle.com/bryanchenyueming)

---

## Template Reference

For creating new pages based on the site template, refer to the original template structure preserved below:

```html
<!DOCTYPE html>
<head>
    <style>
    
    </style>
    <title>
        Chen Yueming's official website
    </title>
    <link rel="stylesheet" href="style.css">
    <script src="main.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <meta charset="UTF-8">
    <meta name="keywords" content="Yueming Chen, Bryan Chen yueming, BnBpythoninc, 陈悦铭">
    <meta name="description" content="Official site of Bryan Chen Yueming">
    <meta name="author" content="Yueming Chen">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>  </h1> <!-- Your NAME here -->
      <!-- Your ALTERNATIVE NAME here -->
    <header></header>
    <nav></nav>
    <article>
        <!-- Your content here -->
    </article>
    <aside></aside>
    <footer>  <!-- Anything you want to add -->  </footer>
</body>
<script>

</script>
```

---

*Thanks to [Font Awesome](https://fontawesome.com/) for the icons*

Last updated: 2025-12-03

---
### Subproject: Source Forum (`simple forum/source-MCHIGM`)
Embedded under Files → `files/simple forum/source-MCHIGM`, this subdirectory hosts a developing Q&A forum with its own `frontend` and planned backend structure. The main public entry is served via:
`Folders/Files/files/simple forum/source-MCHIGM/frontend/public/index.html`
This is embedded in the main site "Source" tab using an `<iframe>` and shares styling separately.
