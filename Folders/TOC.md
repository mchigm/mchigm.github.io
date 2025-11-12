# Table of Contents - File Structure Documentation

This document describes the folder structure of the mchigm.github.io repository.

## Root Directory (`./`)

The root directory contains only essential files for the main website:

- **index.html** - Main landing page of the website
- **style.css** - Main stylesheet for the website
- **main.js** - Common JavaScript functions used across all webpages
- **.gitignore** - Git ignore configuration file
- **Folders/** - Directory containing all organized content

## Folders Directory (`./Folders/`)

Main organizational directory containing:

- **TOC.md** - This file - documentation about the folder structure
- **README.md** - Repository README file
- **Files/** - Directory for website files and content
- **etc/** - Directory for miscellaneous, archived, and utility files

## Files Directory (`./Folders/Files/`)

Contains organized website content:

- **mobilewebsite.html** - Mobile-optimized version of the website
- **Web site/** - Main website content files
- **Documents/** - Academic documents and publications
- **Resources/** - PDF and other resource files
- **files/** - Abstract folders for special features (e.g., pop-up pages)

## Web Site Directory (`./Folders/Files/Web site/`)

Main content pages:

- **81n.png** - Profile photo
- **bibliorgraphy.htm** - Bibliography page
- **internship.htm** - Internship experience page
- **researches.htm** - Current research projects
- **works.htm** - Current work and projects
- **resources.html** - Resources and links page
- **projects.htm** - Projects list page

## Documents Directory (`./Folders/Files/Documents/`)

Academic publications:

- **Personalized_Generative_Model_via_Active_Learning.pdf** - First SCI journal publication

## Resources Directory (`./Folders/Files/Resources/`)

Contains PDF files and other resources:

- Various PDF documents
- EPUB files (if any)
- Research papers and references

## Files Subdirectory (`./Folders/Files/files/`)

Abstract organizational folders for special features:

- **popup-pages/** - Pop-up site functionality and content
  - pop-up.htm - Pop-up pages index
  - popup-viewer.html - Markdown viewer for pop-up content
  - test-popupsite.md - Test/demo pop-up page

## Etc Directory (`./Folders/etc/`)

Miscellaneous and archived files:

- **Resume Yueming Bryan 202509.pages** - Resume file
- **business-card.html** - Business card rendering page
- **bnbpythoninc.png** - BnBpython logo/image
- **dbSettings.json** - Database settings (legacy)
- **main.php** - PHP script (legacy)

## File Organization Principles

1. **Root simplicity**: Only essential files remain in root
2. **Logical grouping**: Related files are grouped in appropriate subdirectories
3. **Clear naming**: Directories have descriptive, self-explanatory names
4. **Separation of concerns**: Content, resources, and utilities are kept separate
5. **Scalability**: Structure allows for easy addition of new content

## Path References

When linking to files from different locations, use relative paths:

- From root to Web site files: `Folders/Files/Web site/[filename]`
- From Web site files to root: `../../../[filename]`
- From popup-pages to root: `../../../../[filename]`

## Maintenance Notes

- The TOC.md file should be updated when new directories or major file additions are made
- Deprecated files should be moved to `Folders/etc/` rather than deleted
- All new web content should go under `Folders/Files/Web site/` or appropriate subdirectory
