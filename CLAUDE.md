# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese-language technical book project about "AI時代に差がつく論理的思考と表現力" (Logical Thinking and Expression Skills in the AI Era). The book provides practical guidance for business professionals on logical thinking, expression, and AI collaboration skills needed in the generative AI era.

## Repository Structure

This project uses the **book-formatter** system (replacing the deprecated book-publishing-template2):

```
LogicalThinking-AI-Era-Guide/
├── docs/                    # Generated output (GitHub Pages)
├── src/                     # Source content
│   ├── introduction/        # Introduction section
│   ├── chapters/           # 17 chapters (chapter01-17)
│   └── appendices/         # Appendix A
├── book-config.json        # Book configuration (book-formatter format)
├── package.json           # Project dependencies and scripts
└── CLAUDE.md             # This file
```

## Book Framework Migration

**IMPORTANT**: This book has been migrated from Book Publishing Template v2 to **book-formatter**.

- ✅ **Current**: Uses book-formatter system
- ❌ **Deprecated**: book-publishing-template2 (no longer supported)

## Key Commands and Workflows

### Development
```bash
npm start                    # Start Jekyll development server
npm run build               # Build the book for production
npm run preview             # Local preview of built book
npm run deploy              # Deploy to GitHub Pages
```

### Content Management
```bash
npm run lint                # Check markdown formatting
npm run check-links         # Validate internal links
npm test                    # Run all tests (lint + links)
npm run clean               # Clean build artifacts
```

## Content Guidelines

### Book Structure
- **4 Parts, 17 Chapters** covering logical thinking in the AI era
- **Part 1**: Basic logical thinking fundamentals (Chapters 1-4)
- **Part 2**: Effective AI collaboration techniques (Chapters 5-8)  
- **Part 3**: Business application practices (Chapters 9-14)
- **Part 4**: Organizational and team applications (Chapters 15-17)

### Writing Style
- **Target Audience**: General business professionals (non-technical)
- **Language**: Japanese (formal business style - です・ます調)
- **Focus**: Practical application over theory
- **Age Group**: Mid-career professionals (late 20s to early 40s)

### Technical Requirements
- **Format**: Markdown (CommonMark + extensions)
- **Encoding**: UTF-8
- **Line endings**: LF (Unix format)
- **Framework**: book-formatter (Jekyll-based)

## Important Notes

1. **Migration Status**: Successfully migrated from book-publishing-template2 to book-formatter
2. **GitHub Pages**: Deploys from `/docs` folder using Jekyll
3. **Navigation**: Fixed duplicate navigation issues during migration
4. **Mobile**: Includes mobile optimization via book-formatter
5. **Target**: Business professionals learning to work effectively with AI tools

## Content Focus Areas

### Core Topics
- Logical thinking fundamentals
- AI prompt design and evaluation
- Critical thinking and verification
- Business communication and presentation
- Decision-making processes
- Leadership and team management

### Practical Applications
- Document creation with AI assistance
- Meeting facilitation and discussion
- Project management approaches
- Negotiation strategies
- Continuous learning methods

## Quality Standards

- **Practical Focus**: Every concept includes real-world application examples
- **Accessibility**: Written for non-technical business professionals
- **Action-Oriented**: Each chapter includes exercises and checklists
- **AI-Relevant**: Specifically addresses challenges in the generative AI era

## Contact Information

**Author**: ITDO Inc.（株式会社アイティードゥ）  
**Email**: knowledge@itdo.jp  
**GitHub**: [@itdojp](https://github.com/itdojp)