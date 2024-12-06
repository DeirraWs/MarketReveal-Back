import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class OpenAIService {
  private openAI: OpenAI;

  constructor() {
    const apiKey = process.env.AI_TOKEN;
    this.openAI = new OpenAI({
      apiKey,
    });
  }

  async getSimilarWords(product: string): Promise<string[]> {
    const outputSchema = z.object({
      final_answer: z.array(z.string()),
    });

    const prompt = `
      The user is searching for a product on a marketplace like OLX. 
      Given the input "${product}", generate a list of alternative terms, synonyms, and possible corrections to help improve search results. 
      Focus on common typos, abbreviations, and alternative names used for this product.
      Provide the list as an array of strings.
    `;

    try {
      const completion = await this.openAI.beta.chat.completions.parse({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an AI that generates synonyms and related terms for product searches." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        response_format: zodResponseFormat(outputSchema, "product_search_suggestions"),
      });

      return completion.choices[0].message.parsed.final_answer;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      throw new Error("Failed to fetch similar words");
    }
  }
}
