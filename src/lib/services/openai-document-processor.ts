interface ExtractedPropertyData {
  propertyAddress?: string;
  listPrice?: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  lotSize?: string;
  yearBuilt?: string;
  description?: string;
  features?: string;
  commission?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  title?: string;
  sellerName?: string;
  closingDate?: string;
  [key: string]: string | undefined;
}

class OpenAIDocumentProcessor {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processDocument(file: File, onProgress?: (progress: number) => void): Promise<ExtractedPropertyData> {
    try {
      // Update progress - starting upload
      onProgress?.(10);

      // Upload file to OpenAI first
      const fileUploadResponse = await this.uploadFile(file);
      onProgress?.(30);

      // Create the prompt for property data extraction
      const prompt = this.createExtractionPrompt();
      onProgress?.(40);

      // Make API call to OpenAI using file ID
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'file',
                  file: {
                    file_id: fileUploadResponse.id
                  }
                },
                {
                  type: 'text',
                  text: prompt
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.0
        })
      });

      onProgress?.(70);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error details:', errorText);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      onProgress?.(80);

      // Parse the extracted data
      const extractedData = this.parseExtractedData(data.choices[0]?.message?.content || '');

      // Clean up the uploaded file
      try {
        await this.deleteFile(fileUploadResponse.id);
      } catch (cleanupError) {
        console.warn('Failed to cleanup uploaded file:', cleanupError);
      }

      onProgress?.(85);

      // Enhance with web search if we have a property address
      if (extractedData.propertyAddress || extractedData.city) {
        const enhancedData = await this.enhanceWithWebSearch(extractedData, onProgress);
        onProgress?.(100);
        return enhancedData;
      }

      onProgress?.(100);
      return extractedData;
    } catch (error) {
      console.error('Error processing document:', error);
      throw new Error('Failed to process document with AI');
    }
  }

  private async enhanceWithWebSearch(extractedData: ExtractedPropertyData, onProgress?: (progress: number) => void): Promise<ExtractedPropertyData> {
    try {
      // Build search query from available address information
      const addressParts = [
        extractedData.propertyAddress,
        extractedData.city,
        extractedData.state,
        extractedData.zipCode
      ].filter(Boolean);

      if (addressParts.length === 0) {
        return extractedData; // No address to search with
      }

      const searchAddress = addressParts.join(', ');
      onProgress?.(87);

      // Create web search prompt
      const webSearchPrompt = this.createWebSearchPrompt(searchAddress, extractedData);

      // Make API call with web search
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
                  body: JSON.stringify({
            model: 'gpt-4o-search-preview',
            web_search_options: {
              user_location: {
                type: 'approximate',
                approximate: {
                  country: 'CA',
                  region: 'Ontario'
                }
              }
            },
            messages: [
              {
                role: 'user',
                content: webSearchPrompt
              }
            ],
            max_tokens: 2000
          })
      });

      onProgress?.(95);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Web search failed:', response.status, response.statusText, errorText);
        return extractedData;
      }

      const webData = await response.json();
      const webContent = webData.choices[0]?.message?.content || '';

      // Parse the enhanced data
      const enhancedFields = this.parseExtractedData(webContent);

      // Merge with original data (PDF data takes precedence for existing fields)
      const mergedData: ExtractedPropertyData = {
        ...enhancedFields, // Web search data first
        ...extractedData   // PDF data overrides (more reliable)
      };

      return mergedData;
    } catch (error) {
      console.warn('Web search enhancement failed:', error);
      return extractedData; // Return original data if enhancement fails
    }
  }

  private createWebSearchPrompt(address: string, existingData: ExtractedPropertyData): string {
    const missingFields = [];
    
    if (!existingData.title) missingFields.push('property title');
    if (!existingData.description) missingFields.push('property description');
    if (!existingData.bedrooms) missingFields.push('number of bedrooms');
    if (!existingData.bathrooms) missingFields.push('number of bathrooms');
    if (!existingData.squareFeet) missingFields.push('square footage');
    if (!existingData.yearBuilt) missingFields.push('year built');
    if (!existingData.propertyType) missingFields.push('property type');
    if (!existingData.features) missingFields.push('property features');

    return `Search for property information for: "${address}"

I need to find the following missing details for this property:
${missingFields.map(field => `- ${field}`).join('\n')}

Current known information:
${Object.entries(existingData).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Please search for this property online and provide a JSON response with the missing information. Focus on:

1. **Property Title**: Create an attractive, descriptive title for this property
2. **Property Description**: Write a compelling 2-3 sentence description highlighting key features
3. **Missing Physical Details**: Fill in bedrooms, bathrooms, square footage, year built if not provided
4. **Property Type**: Determine if it's a house, condo, townhouse, etc.
5. **Features**: List key amenities and features
6. **Neighborhood Info**: Brief neighborhood description if relevant

Return ONLY a JSON object with the enhanced/missing fields:

Example format:
{
  "title": "Stunning Modern Condo in Prime Location",
  "description": "This beautifully renovated 2-bedroom condo features an open-concept layout with premium finishes and city views. Located in a desirable neighborhood with easy access to transit and amenities.",
  "bedrooms": "2",
  "bathrooms": "2",
  "squareFeet": "1200",
  "yearBuilt": "2015",
  "propertyType": "Condo",
  "features": "Open concept, granite countertops, stainless appliances, balcony, parking"
}`;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async uploadFile(file: File): Promise<{ id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'user_data');

    const response = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('File upload error:', errorText);
      throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`https://api.openai.com/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    });

    if (!response.ok) {
      console.warn(`Failed to delete file ${fileId}: ${response.status} ${response.statusText}`);
    }
  }

  private createExtractionPrompt(): string {
    return `You are an expert real estate document analyzer specializing in Canadian real estate forms, MLS sheets, and property documents. 

CRITICAL INSTRUCTIONS FOR ADDRESS PARSING:
- Canadian addresses often appear as: "1234 Street Name PROVINCE City, PostalCode"
- Example: "1711 101 Prudential DR ON Scarborough, M1P4S5"
- Split this into: propertyAddress="1711 101 Prudential DR", state="ON", city="Scarborough", zipCode="M1P4S5"
- Look for addresses in these patterns and split them correctly

DOCUMENT TYPES TO RECOGNIZE:
- OREA Forms (Ontario Real Estate Association)
- MLS Listing Sheets
- Purchase/Sale Agreements
- Property Disclosure Statements
- Listing Agreements

EXTRACTION FIELDS - Be extremely thorough and look everywhere in the document:

**PROPERTY ADDRESS (CRITICAL - Parse carefully):**
- propertyAddress: Street number and street name only (e.g., "1711 101 Prudential DR")
- city: City/municipality name (e.g., "Scarborough", "Toronto", "Mississauga")
- state: Province abbreviation (ON, BC, AB, etc.)
- zipCode: Canadian postal code (e.g., "M1P4S5", "L6B 1A1")

**PROPERTY DETAILS:**
- listPrice: Any mention of price, listing price, asking price (numbers only, no commas/currency)
- propertyType: Residential, Commercial, Condo, Townhouse, Detached, Semi-Detached, etc.
- bedrooms: Number of bedrooms/BR
- bathrooms: Number of bathrooms/BA/washrooms
- squareFeet: Square footage/sq ft (numbers only)
- lotSize: Lot size in any unit (acres, sq ft, etc.)
- yearBuilt: Year property was constructed
- parkingSpaces: Number of parking spots/garage spaces

**FINANCIAL DETAILS:**
- commission: Commission rate or percentage (number only, e.g., "2.5")
- listPrice: Sale price, asking price, listed price
- taxes: Annual property taxes if mentioned
- maintenanceFee: Condo/maintenance fees if applicable

**ADDITIONAL INFO:**
- title: Property name or listing title
- description: Any property description text
- features: Notable features, amenities
- sellerName: Seller's name if visible
- listingAgent: Agent/broker name
- mlsNumber: MLS number if present
- closingDate: Closing or possession date

**PARSING INSTRUCTIONS:**
1. Scan the ENTIRE document - information may be anywhere
2. Look in headers, footers, forms fields, and body text
3. For addresses, pay special attention to format "ADDRESS PROVINCE CITY, POSTAL"
4. Canadian postal codes are format: Letter-Number-Letter Number-Letter-Number
5. Extract ALL numerical values without formatting (no $, %, commas)
6. If you see partial information, extract what you can find
7. Look for abbreviations: BR (bedrooms), BA (bathrooms), SF (square feet)

**CRITICAL:** Return ONLY valid JSON. Do not include any explanation or additional text.

Example for Canadian property:
{
  "propertyAddress": "1711 101 Prudential DR",
  "city": "Scarborough", 
  "state": "ON",
  "zipCode": "M1P4S5",
  "propertyType": "Residential",
  "bedrooms": "3",
  "bathrooms": "2",
  "listPrice": "899000"
}`;
  }

  private parseExtractedData(content: string): ExtractedPropertyData {
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        
        // Clean up the data - remove null values and ensure strings
        const cleanedData: ExtractedPropertyData = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (value !== null && value !== undefined && value !== '') {
            cleanedData[key] = String(value);
          }
        }
        
        return cleanedData;
      }
      
      // Fallback: try to parse the entire content as JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse extracted data:', error);
      console.log('Raw content:', content);
      
      // Return empty object if parsing fails
      return {};
    }
  }
}

// Export singleton instance
export const openAIDocumentProcessor = new OpenAIDocumentProcessor(
  process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
);

export type { ExtractedPropertyData }; 
