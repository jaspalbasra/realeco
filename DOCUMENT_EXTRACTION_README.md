# 🏠 Real Estate PDF Document AI Extraction

## Overview

This application implements AI-powered document extraction for real estate listings using OpenAI's GPT models with enhanced web search capabilities. After extracting data from uploaded PDFs, the system performs web searches to fill in missing property details and enhance listings with comprehensive information.

## Features

### 📄 PDF Document Processing
- Upload and process real estate documents (MLS listings, property sheets, etc.)
- Extract key property information automatically
- Support for Canadian real estate forms (OREA, etc.)

### 🔍 Web Search Enhancement (NEW!)
- Automatically searches for property information online after PDF processing
- Fills in missing details like bedrooms, bathrooms, square footage
- Generates attractive property titles and descriptions
- Adds property features and neighborhood information
- Combines PDF data with web search results intelligently

### 🎯 Extracted Data Fields
**High Priority Fields:**
- Property Address, City, State, ZIP Code
- List Price
- Bedrooms & Bathrooms
- Square Footage
- Property Type

**Enhanced Fields (via Web Search):**
- Property Title (auto-generated)
- Property Description (compelling marketing copy)
- Year Built
- Lot Size
- Property Features & Amenities
- Commission Details

## Technical Implementation

### Core Service: `openai-document-processor.ts`

**PDF Processing Flow:**
1. Upload PDF to OpenAI File API
2. Extract structured data using GPT-4.1
3. Clean up uploaded files automatically

**Web Search Enhancement Flow:**
4. Build search query from extracted address
5. Use OpenAI Web Search API with GPT-4o
6. Intelligently merge PDF + web search data
7. PDF data takes precedence for reliability

### API Configuration

```typescript
// PDF Extraction
model: 'gpt-4.1'
temperature: 0.0  // For consistency

// Web Search Enhancement  
model: 'gpt-4o-search-preview'
max_tokens: 2000  // No temperature support
web_search_options: { user_location: 'CA/Ontario' }
```

### Data Merging Strategy

```typescript
const mergedData = {
  ...webSearchData,    // Web search fills gaps
  ...pdfData          // PDF data overrides (more reliable)
}
```

## User Experience

### Processing Workflow
1. **Upload PDF** → User selects real estate document
2. **AI Processing** → Progress bar with status updates:
   - "Analyzing document structure..." (0-30%)
   - "Extracting property information..." (30-60%)
   - "Validating extracted data..." (60-85%)
   - "Enhancing with web search..." (85-95%)
   - "Finalizing results..." (95-100%)
3. **Data Review** → Clean table showing extracted/enhanced data
4. **Form Population** → All fields auto-fill with AI indicators
5. **Continue** → Single "Next Section" button for smooth workflow

### UI Enhancements
- **Upload area disappears** after successful processing
- **Clean data table** replaces cluttered processing UI
- **AI indicators** show which fields were auto-populated
- **Single action button** reduces workflow complexity
- **Error handling** with user-friendly messages

## Setup Instructions

### Environment Variables
```bash
# Add to .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

### Dependencies
- OpenAI API access with File Inputs enabled
- Web Search tool access (GPT-4o)
- Next.js 15+ with React 18+

## Error Handling

### Graceful Degradation
- **PDF processing fails** → User can manually enter data
- **Web search fails** → Uses PDF-only data
- **Partial address** → Searches with available information
- **Network errors** → Clear error messages with retry options

### Logging
- **Success**: Property data extraction and enhancement completed
- **Warnings**: Web search failures (non-blocking)
- **Errors**: PDF processing failures, API errors

## Security Considerations

⚠️ **Production Notes:**
- API key is currently hardcoded for development
- Implement secure key management for production
- Add rate limiting for API calls
- Validate file types and sizes
- Implement user authentication

## Future Enhancements

### Planned Features
- [ ] Market analysis integration
- [ ] Comparable property suggestions
- [ ] Multi-language support
- [ ] Batch document processing
- [ ] Custom extraction templates

### Performance Optimizations
- [ ] Caching for frequently searched addresses
- [ ] Parallel processing for multiple documents
- [ ] Progressive data loading
- [ ] Optimized image preprocessing

---

**Last Updated:** January 2025  
**API Version:** OpenAI GPT-4.1 (PDF) + GPT-4o-search-preview (Web Search)  
**Status:** ✅ Active Development 