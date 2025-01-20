import OpenAI from "openai";
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
}
