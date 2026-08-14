# Problem Statement

## Current Situation

Academic writing frequently requires authors to support claims, ideas, and factual statements with reliable sources.

Finding suitable evidence inside a long PDF or website can be time-consuming because the user must manually identify relevant passages, verify the original wording, locate the source position, and construct the appropriate APA 7 citation and reference.

AI-assisted writing tools can reduce this effort, but they introduce a significant reliability problem: generated information may not be grounded in the provided source.

## Problem Solution

CiteSniff addresses the problem of finding verifiable supporting evidence for a user-provided academic text.

The system must identify relevant ideas from a user text of 100 to 300 words and locate supporting evidence inside a user-provided PDF or website.

The selected quotation must be extracted from the original source and must contain between 5 and 50 words.

The system must also provide the information necessary to create an APA 7 parenthetical citation and bibliographic reference.

## Main Risk

The primary technical risk is hallucinated evidence.

A generated quotation, page number, author, publication year, or bibliographic detail must not be presented as factual unless it can be verified against the source or reliable metadata.

## Main Approach

To solve this risk, CiteSniff uses an **evidence-first architecture**. This rule means the system must find and verify the real text inside the source file _before_ it tries to generate any citations or summaries.

## What the User Gets

When the system runs, the user will receive:

- A direct, matching quote from their source file.
- The exact location where the quote was found (like a page number).
- A formatted APA 7 parenthetical citation.
- A formatted APA 7 bibliographic reference.
- A clear error message if the system cannot find reliable evidence.
