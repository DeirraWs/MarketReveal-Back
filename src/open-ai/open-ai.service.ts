import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class OpenAIService {
  private openAI: OpenAI;

  constructor() {
    const apiKey = process.env.AI_TOKEN;
    this.openAI = new OpenAI({
      organization: "org-gNBEYduqM2QCvDvPRXkQXzAG",
      project: "proj_am0EqRyJszrzix303TocfmEr",
      apiKey: apiKey
    });
  }

  async getSimilarWords(product: string): Promise<string[]> {

    const prompt = `Generate a list of alternative terms and synonyms for "${product}" to improve search results.Return array of strings 5 best variant splits coma `;

    try {
      const completion = await this.openAI.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are a synonym generator for search on market place." },
          { role: "user", content: prompt },
        ],
        temperature: 1,
        max_tokens: 100,
      });

      const parsed = completion.choices[0].message.content;

      const variants: string[] = JSON.parse(parsed);

      console.log(variants.join(", "));

      return variants;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      throw new Error("Failed to fetch similar words");
    }
  }

  async analyzeOffersByNameSuitabilityToQuery(offersNames: string[], query: string): Promise<number[]> {
    const prompt = `
Analyze the following list of offer names based on how well they match the query "${query}". 
Return an array of the top 20 indices sorted in descending order of relevance. 
Please only return the list of indices as a JSON array, like: [1, 2, 3, ..., 20].
Do not include any explanations or additional text, only the JSON array.

Offers:
${offersNames.map((name, index) => `${index + 1}. ${name}`).join("\n")}
`;

    try {
      const completion = await this.openAI.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are a highly accurate offer match analyzer for search results." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const response = completion.choices[0].message.content.trim();

      let indices: number[] = [];
      try {
        indices = JSON.parse(response);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        const matches = response.match(/\d+/g);
        if (matches) {
          indices = matches.map(Number);
        }
      }

      return indices.slice(0, 20);
    } catch (error) {
      console.error("Error analyzing offers:", error);
      throw new Error("Failed to analyze offers by suitability");
    }
  }


}
