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

    const systemMessage = `You are a language translator. You will be provided with a sentence in ${sourceLanguage}, and your task is to translate it into ${targetLanguage} and provide 3 sentences in both ${targetLanguage} and ${sourceLanguage}.
             Explain its usage in context in ${targetLanguage}. If the source language and target language are the same, please translate the sentence into either ${targetLanguage}`;

    const userMessage = `The sentence is: '${phrase}'.
     Please format the response as a JSON object with the following structure:
     {
       "status": "success" if the translation is successful, "not_found" otherwise,
       "meaning": "Translation of the phrase",
       "examples": [
         {"text": "Sentence 1 in ${sourceLanguage}", "translation": "Translated sentence 1 in ${targetLanguage}"},
         {"text": "Sentence 2 in ${sourceLanguage}", "translation": "Translated sentence 2 in ${targetLanguage}"},
         {"text": "Sentence 3 in ${sourceLanguage}", "translation": "Translated sentence 3 in ${targetLanguage}"}
        ],
       "context": "Explanation of usage in context"
      }
      Only provide the meaning, examples and context if the status is "success".`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
      });

      const output = response.choices[0].message.content.trim();

      const jsonOutput = JSON.parse(output);

      await this.cacheService.set(cacheKey, jsonOutput, 86400 * 1000);
      return jsonOutput;
    } catch (error) {
      console.log('Error fetching translation:', error);
      return { status: 'not_found', error: error.message };
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
      console.log('Error fetching speaking question:', error);
      return { status: 'failed', error: error.message };
    }
  }

  async analyzeText(user: UserPayload, data: AnalyzeTextDto) {
    const { question, text } = data;

    const systemMessage = `You are an English text analysis expert, focusing on grammar, writing, speaking, and vocabulary. 
  You are here to help students improve their writing and speaking skills, and provide feedback on their texts. 
  The provided text was transcribed from a student who is speaking in English. 
  The format of this test is similar to the IELTS part 2 speaking test, but the topic is optional. In that case, just focus on the text provided by the user. 
  You should provide feedback on the student’s speaking and suggest ways to improve.
  Please ignore capitalization and punctuation errors. Do not make any corrections related to punctuation (e.g., periods, commas). Focus on grammar, vocabulary, and overall coherence.`;

    const userMessage = `My text is: ${text}.
  ${question ? `The topic is: ${question}.` : ''}
  Please format the response as a JSON object with the following structure:
  {
      "status": "success" if the analysis is successful, "failed" otherwise,
      "overall_comment": "General feedback on the text about grammar, vocabulary and coherence, without addressing punctuation errors.",
      "updated_text": "Updated text with the user's errors fixed and enhancements, without changing punctuation.",
      "translated_updated_text": "Translate the updated text into ${user.native_language}.",
      "suggestions": [
        "Suggestion 1 for improving the text",
        "Suggestion 2 for improving the text",
        ...
      ],
      "relevance_to_question": "Does the text '${text}' match the topic '${question}'? Please answer with 'Yes' or 'No'. If no question is provided, write 'N/A'."
  }`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
      });

      const output = response.choices[0].message.content.trim();
      return JSON.parse(output);
    } catch (error) {
      console.error('Error fetching text analysis:', error);
      return { status: 'failed', error: error.message };
    }
  }

  detectLanguage = async (phrase: string) => {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
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
    return response.choices[0].message.content.match(
      /The language is: (\w+)/,
    )[1];
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
      model: 'gpt-4o',
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
      response_format: { type: 'json_object' },
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