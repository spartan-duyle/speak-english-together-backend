import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '@/redis/redis-cache.service';
import GenerateSpeakingQuestionDto from '@/modules/internals/openai/dto/generateSpeakingQuestion.dto';

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

  async translateText(
    phrase: string,
    targetLanguage: string,
    sourceLanguage?: string,
  ) {
    // Construct a unique cache key using phrase, source language, and target language
    const cacheKey = `${phrase}:${sourceLanguage || ''}:${targetLanguage}`;

    // Check if the result is already cached
    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Construct the prompt based on whether sourceLanguage is provided
    const prompt = sourceLanguage
      ? `Translate the following phrase from ${sourceLanguage} to ${targetLanguage} and provide 3 sentences in both ${sourceLanguage} and ${targetLanguage}. Explain its usage in context. The output should be in the following format: {
      "meaning": "<translation of the phrase>",
      "examples": [
        {"text": "<sentence in ${sourceLanguage}>", "translation": "<translated sentence in ${targetLanguage}>"},
        {"text": "<sentence in ${sourceLanguage}>", "translation": "<translated sentence in ${targetLanguage}>"},
        {"text": "<sentence in ${sourceLanguage}>", "translation": "<translated sentence in ${targetLanguage}>"}
      ],
      "context": "<explanation of usage in context>"
    }.\n\nPhrase: '${phrase}'`
      : `Translate the following phrase to ${targetLanguage} and provide 3 sentences in the language of this text and ${targetLanguage}. Explain its usage in context. The output should be in the following format: {
      "meaning": "<translation of the phrase>",
      "examples": [
        {"text": "<sentence in source language>", "translation": "<translated sentence in target language>"},
        {"text": "<sentence in source language>", "translation": "<translated sentence in target language>"},
        {"text": "<sentence in source language>", "translation": "<translated sentence in target language>"}
      ],
      "context": "<explanation of usage in context>"
    }.\n\nPhrase: '${phrase}'`;

    try {
      // Make the request to the OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Assuming 'gpt-4' is the correct model name
        messages: [
          {
            role: 'system',
            content:
              'You are a language translator. If you cannot translate the input text, write I could not find an answer.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const output = response.choices[0].message.content.trim();

      if (output === 'I could not find an answer.') {
        // Cache and return 'not_found' status if the translation could not be found
        const notFoundResponse = { status: 'not_found' };
        await this.cacheService.set(cacheKey, notFoundResponse, 86400 * 30);
        return notFoundResponse;
      }

      const jsonOutput = JSON.parse(output);

      // Check if the response contains meaningful data
      if (jsonOutput.meaning || jsonOutput.examples || jsonOutput.context) {
        const successResponse = { ...jsonOutput, status: 'success' };
        // Cache the successful translation result with a TTL of 30 days
        await this.cacheService.set(cacheKey, successResponse, 86400 * 30);
        return successResponse;
      } else {
        // If the response does not contain expected data, return 'not_found' status
        const notFoundResponse = { status: 'not_found' };
        await this.cacheService.set(cacheKey, notFoundResponse, 86400 * 30);
        return notFoundResponse;
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      throw new Error('Translation service is currently unavailable.');
    }
  }

  async generateSpeakingQuestion(data: GenerateSpeakingQuestionDto) {
    // Implement the logic to generate a speaking question
    // You can use the userId to personalize the question
    const prompt = `Please generate a question and suggestions (Level ${data.level}) about the topic of ${data.topic} to assist me in practicing English speaking skills.

                            Your response should follow this format:
                            - Begin with a main question.
                            - Provide 3-4 bullet points to guide the candidate's response, which should last a few minutes.
                            
                            Return the generated question and suggestions as JSON data with the following structure:
                            {
                              "question": "Generated question here",
                              "suggestions": [
                                "Suggestion 1",
                                "Suggestion 2",
                                "Suggestion 3",
                                "Suggestion 4"
                              ]
                            }
                            
                            Please adhere closely to this format for clarity and coherence in your response. Thank you.`;

    try {
      // Make the request to the OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // Assuming 'gpt-4' is the correct model name
        messages: [
          {
            role: 'system',
            content:
              'You are a language teacher. If you cannot generate the question, write I could not find an answer.',
          },
          { role: 'user', content: prompt },
        ],
      });

      const output = response.choices[0].message.content.trim();

      if (output === 'I could not find an answer.') {
        return { status: 'failed' };
      }

      const jsonOutput = JSON.parse(output);

      return { ...jsonOutput, status: 'success' };
    } catch (error) {
      throw new Error('Question generation service is currently unavailable.');
    }
  }
}
