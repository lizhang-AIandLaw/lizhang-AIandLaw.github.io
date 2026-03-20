# CV Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the homepage content with Li Zhang's provided CV TeX, focusing on degree information, publication completeness, talks, awards, and other visible profile metadata, then publish the changes to GitHub.

**Architecture:** This is a content-first update. The primary work is in `content/*` data files and publication markdown files, with only minimal code/config changes where the current site behavior conflicts with the requested single-language English presentation. Verification will rely on direct source-to-CV comparison, `git diff --check`, and git history/push state because the environment lacks a local Node toolchain for build verification.

**Tech Stack:** Vite, React, Chakra UI, Markdown frontmatter content, JSON content files, git

---

### Task 1: Record the CV-to-site discrepancies

**Files:**
- Modify: `docs/plans/2026-03-20-cv-alignment-plan.md`
- Inspect: `content/about.md`
- Inspect: `content/experience.json`
- Inspect: `content/publications/*.md`
- Inspect: `content/talks.json`
- Inspect: `content/awards.json`
- Inspect: `content/site.json`

**Step 1:** Compare the provided CV TeX with each visible site content source.

**Step 2:** Note mismatches in degree titles, dates, publications, talks, awards, and visible metadata.

**Step 3:** Use those mismatches as the editing checklist for the remaining tasks.

### Task 2: Fix education and profile metadata

**Files:**
- Modify: `content/about.md`
- Modify: `content/experience.json`
- Modify: `content/site.json`

**Step 1:** Update the Ph.D. degree to “Doctor of Philosophy in Intelligent Systems” / equivalent site phrasing.

**Step 2:** Update the master's degree wording from LL.M. to “Master of Computational Law”.

**Step 3:** Correct degree dates and the study-abroad / undergraduate dates where the CV is more specific.

**Step 4:** Align the hero tagline, journey text, and bio copy with the CV’s current academic identity.

### Task 3: Make publications complete and accurate

**Files:**
- Modify: `content/publications/cslaw2026-thinking-longer.md`
- Modify: `content/publications/jurix2025-overruled.md`
- Modify: `content/publications/lcic2025-legal-argument.md`
- Create: `content/publications/acl2026-plawbench.md`
- Create: `content/publications/icml2026-densemixer.md`
- Create: `content/publications/icail2025-faithfulness-abstention.md`
- Create: `content/publications/cslaw2025-case-based-arguments.md`

**Step 1:** Fix author lists, venue names, and statuses for existing publication files.

**Step 2:** Add the missing four publications from the CV with links and concise abstracts/summaries.

**Step 3:** Update selected publication IDs if needed so the homepage highlights remain representative.

### Task 4: Align talks, awards, and skills

**Files:**
- Modify: `content/talks.json`
- Modify: `content/awards.json`
- Modify: `content/site.json`

**Step 1:** Replace generic talk titles with the actual talk titles from the CV.

**Step 2:** Add the missing ISP Forum talk.

**Step 3:** Add the SCI Fellowship award from the CV while preserving the existing JURIX award.

**Step 4:** Refresh visible skills to better match the CV’s programming, cloud, legal, and tooling stack.

### Task 5: Verify, commit, and publish

**Files:**
- Inspect: `git diff`

**Step 1:** Run `git diff --check` and inspect a focused `git diff` over the touched files.

**Step 2:** Re-run a CV checklist against the edited content files.

**Step 3:** Stage only the intended files, commit with a clear message, and push to `origin/main`.

**Step 4:** If push is rejected, fetch/rebase and push again, stopping only if conflicts require manual user guidance.
