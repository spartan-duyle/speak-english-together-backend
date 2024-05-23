import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '@/redis/redis-cache.service';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private readonly cacheService: RedisCacheService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('openai.apiKey'),
    });
  }

  async translateText(phrase: string, targetLanguage: string) {
    const cacheKey = `${phrase}:${targetLanguage}`;

    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const prompt = `Translate the following phrase to ${targetLanguage} and provide 3 sentences in the language of this text and ${targetLanguage}. Explain its usage in context. The output should be in the following format: { "meaning": "<translation of the phrase>", "examples": [{"text": "<sentence in source language>", "translation": "<translated sentence in target language>"}, ...], "context": "<explanation of usage in context>" }.\n\nPhrase: '${phrase}'`;

    try {
      const response = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o',
      });

      const output = response.choices[0].message.content.trim();

      const jsonOutput = JSON.parse(output);

      // Check if the response contains meaningful data
      if (jsonOutput.meaning || jsonOutput.examples || jsonOutput.context) {
        // Cache translation result with a TTL of 30 days
        await this.cacheService.set(cacheKey, jsonOutput, 86400 * 30);

        return jsonOutput;
      } else {
        // If response does not contain expected data, return "not found" message
        return new NotFoundException('Translation failed. Please try again.');
      }
    } catch (error) {
      throw error;
    }
  }
}
