import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

const convertToBase64 = (file: Express.Multer.File) => {
  const data = fs.readFileSync(file.path);
  const base64 = Buffer.from(data).toString('base64');
  return `data:image/${file.mimetype.split('/')[1]};base64,${base64}`;
};

export const imageToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { imageFile, prompt } = options;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo', //'gpt-4-vision-preview',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? '¿Qué logras ver en la imagen?',
          },
          // {
          //   type: 'image_url',
          //   image_url: {
          //     url: 'https://static.vecteezy.com/system/resources/previews/003/623/626/non_2x/sunset-lake-landscape-illustration-free-vector.jpg',
          //   },
          // },
          {
            type: 'image_url',
            image_url: {
              url: convertToBase64(imageFile),
            },
          },
        ],
      },
    ],
  });

  return { msg: response.choices[0].message.content };
};
