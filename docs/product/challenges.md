# Engineering Challenges

CiteSniff presents several engineering challenges that must be addressed before the application can reliably generate source-based citations.

## Challenge 01 — Semantic Matching

The user's text and the supporting source may express the same concept using different terminology.

The system therefore cannot depend exclusively on exact keyword matching.

### Question

How can the application identify semantically relevant passages while maintaining source traceability?

## Challenge 02 — Exact Evidence

A language model may generate a plausible quotation that does not exist in the original document.

### Question

How can the application verify that every returned quotation exists in the original source?

## Challenge 03 — Page Preservation

PDF text extraction can lose important structural information.

### Question

How can the application preserve the relationship between extracted text and its original PDF page?

## Challenge 04 — Metadata Reliability

APA 7 references require reliable bibliographic information.

### Question

How can the application obtain author, year, title, publisher, edition, and other metadata without inventing missing information?

## Challenge 05 — Website Variability

Websites can contain navigation, advertisements, scripts, dynamic content, and incomplete metadata.

### Question

How can the application reliably extract the primary content of different websites?

## Challenge 06 — AI Hallucination

The AI model may attempt to complete missing information.

### Question

How can the architecture prevent generated information from being treated as verified evidence?

## Challenge 07 — Performance

Large PDF documents may require substantial processing.

### Question

How can document processing be performed without blocking the Express HTTP request lifecycle?

## Challenge 08 — Maintainability

The application will contain document processing, retrieval, AI, verification, metadata, and APA logic.

### Question

How can responsibilities be separated so that individual components remain understandable, testable, and reusable?
