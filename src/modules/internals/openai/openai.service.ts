import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '@/redis/redis-cache.service';
import GenerateSpeakingQuestionDto from '@/modules/internals/openai/dto/generateSpeakingQuestion.dto';
import AnalyzeTextDto from '@/modules/internals/openai/dto/analyzeText.dto';
import { UserPayload } from '@/authentication/types/user.payload';

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

    if (!sourceLanguage) {
      sourceLanguage = await this.detectLanguage(phrase);
    }

    // Construct the prompt based on whether sourceLanguage is provided
    const prompt = `Translate the following phrase from ${sourceLanguage} to ${targetLanguage} and provide 3 sentences in both ${sourceLanguage} and ${targetLanguage}. Explain its usage in context. The output should be in the following format: {
      "meaning": "<translation of the phrase>",
      "examples": [
        {"text": "<sentence in ${sourceLanguage}>", "translation": "<translated sentence in ${targetLanguage}>"},
        {"text": "<sentence in ${sourceLanguage}>", "translation": "<translated sentence in ${targetLanguage}>"},
        {"text": "<sentence in ${sourceLanguage}>", "translation": "<translated sentence in ${targetLanguage}>"}
      ],
      "context": "<explanation of usage in context>"
    }.\n\nPhrase: '${phrase}'`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
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
        await this.cacheService.set(cacheKey, notFoundResponse, 86400 * 1000);
        return notFoundResponse;
      }

      const jsonOutput = JSON.parse(output);

      // Check if the response contains meaningful data
      if (jsonOutput.meaning || jsonOutput.examples || jsonOutput.context) {
        const successResponse = { ...jsonOutput, status: 'success' };
        // Cache the successful translation result with a TTL of 30 days
        await this.cacheService.set(cacheKey, successResponse, 86400 * 1000);
        return successResponse;
      } else {
        const notFoundResponse = { status: 'not_found' };
        await this.cacheService.set(cacheKey, notFoundResponse, 86400 * 1000);
        return notFoundResponse;
      }
    } catch (error) {
      throw new Error('Translation service is currently unavailable.');
    }
  }

  async generateSpeakingQuestion(data: GenerateSpeakingQuestionDto) {
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
        model: 'gpt-4o',
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

  async analyzeText(user: UserPayload, data: AnalyzeTextDto) {
    const question = data.question;
    const text = data.text;
    const prompt = `Analyze the following text: ${text}.
  If a specific question is provided, focus the analysis on that topic: "${question}".
  If the text does not match the question or is irrelevant, state that clearly.
  If no question is provided, analyze the text generally.
  The analysis should cover the following aspects:
  - Overall comment on the text, highlighting key points or issues
  - Updated text with corrections or suggestions (if the text is relevant or no question is provided)
  - Suggestions for improving the text (if the text is relevant or no question is provided)

  Use simple and accessible language. Provide the analysis in the following JSON structure:
  {
    "overall_comment": "General feedback on the text",
    "updated_text": "Updated text with corrections or suggestions",
    "translated_updated_text": "Translate the updated text to the user's language: ${user.nationality}",
    "suggestions": [
      "Suggestion 1 for improving the text",
      "Suggestion 2 for improving the text",
      "Suggestion 3 for improving the text",
      ...
    ],
    "relevance_to_question": "Does the text ${text} match with the topic ${question}? Please answer with 'Yes' or 'No'. If no question is provided, write 'N/A'."
  }`;

    try {
      // Make the request to the OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a text analysis expert. If you cannot analyze the text, write "I could not find an answer."',
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
      console.log('Error fetching text analysis:', error);
      throw new Error('Text analysis service is currently unavailable.');
    }
  }

  detectLanguage = async (phrase: string) => {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a language detector. Detect the language of the following phrase. Please answer in the format: "The language is: detected_language". If you cannot detect the language, write "I could not find an answer."',
        },
        { role: 'user', content: `Phrase: '${phrase}'` },
      ],
    });

    // Assuming the response returns the detected language in the format: 'The language is: English'
    const detectedLanguage = response.choices[0].message.content.match(
      /The language is: (\w+)/,
    )[1];
    return detectedLanguage;
  };

  async generateSentenceInRoom(
    user: UserPayload,
    topic: string,
    refresh: boolean,
  ) {
    const cacheKey = `sentences:${user.id}:${topic}`;

    let cachedSentences = await this.cacheService.get(cacheKey);

    console.log('cachedSentences:', cachedSentences);
    if (!refresh && cachedSentences) {
      return cachedSentences;
    }

    const parts = Array.of(
      'You are an English communication teacher, focusing on daily life conversation.',
      "You are in the live room where students talk in English with their buddies. You are here to support them in speaking more confidently and professionally. You should use the student's information to help them practice according to their own personal needs.",
      `The student's name is ${user.full_name}.`,
      user.nationality
        ? `The student is from ${user.nationality}.`
        : 'The student is from an unknown country.',
      user.native_language
        ? `The student's native language is ${user.native_language}.`
        : 'The student has not provided their native language.',
      user.occupation
        ? `The student works as a ${user.occupation}.`
        : 'The student has not provided their occupation.',
      user.interests
        ? `The student is interested in ${user.interests.join(', ')}.`
        : 'The student has not provided their interests.',
      user.learning_goals
        ? `The student's English learning goals include ${user.learning_goals.join(', ')}.`
        : 'The student has not provided their learning goals.',
      user.birthday
        ? `The student is ${new Date().getFullYear() - new Date(user.birthday).getFullYear()} years old.`
        : 'The student has not provided their birthday.',
      `The student is at the ${user.level} level in English proficiency.`,
    );

    const systemMessage = parts.join('\n\n');

    const oldSentences =
      cachedSentences?.data
        .map((s: { english: any }) => s.english)
        .join('\n') || '';

    const userMessage = `Please help me generate 10 new sentences in the room about the topic of ${topic}. Ensure that the sentences are clear, concise, easy to understand, and can be used in daily conversation, relevant to my information. 
    ${user.native_language ? `Translate the sentences into ${user.native_language} as well.` : ''}
    ${oldSentences ? `The previous sentences is: ${oldSentences}. Please avoid repeating them, and the new sentences must be different from this previous sentences` : ''}
    Please format the response as a JSON object with the following structure: {
      "data": [
      {
      "english": "Sentence 1 in English",
      "translated": "${user.native_language ? 'Translated sentence 1' : ''}"
      },
      ]}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const output = response.choices[0].message.content.trim();

    const newSentences = JSON.parse(output);

    if (!newSentences.data || newSentences.data.length === 0) {
      return oldSentences;
    }

    // Append new sentences to cached sentences if they exist
    if (cachedSentences && cachedSentences.data) {
      cachedSentences.data = cachedSentences.data.concat(newSentences.data);
    } else {
      cachedSentences = newSentences;
    }

    // Cache the result
    await this.cacheService.set(cacheKey, cachedSentences, 7200 * 1000);

    return cachedSentences;
  }
}
