import * as fs from 'fs';
import * as path from 'path';

import OpenAI, { toFile } from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import { fileTypeFromFile } from 'file-type';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  // Todo: verificar original image
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3', //dall-e-3 //gpt-image-1
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      // quality: 'medium', //esto se usa con gpt-image-1
      response_format: 'url',  //esto NO se usa con gpt-image-1
    });

    // Todo: guardar la imagen en FS.
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url: url,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  // originalImage=http://localhost:3000/gpt/image-generation/1703770602518.png
  // maskImage=Base64;ASDKJhaskljdasdlfkjhasdkjlHLKJDASKLJdashlkdjAHSKLJDhALSKJD

  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);
  const imageBuffer = fs.readFileSync(pngImagePath);
  const maskBuffer = fs.readFileSync(maskPath);
  // const imageFile = new File([imageBuffer], 'image.png', {
  //   type: 'image/png',
  // });
  // const maskFile = new File([maskBuffer], 'mask.png', {
  //   type: 'image/png',
  // });

  const response = await openai.images.edit({
    model: 'dall-e-2', //en el curso usan el dall-e-2 //dall-e-3 lo recomienda el profe fernando pero tiene muchas limitaciones //gpt image lo recomienda actualment la pagina de openia
    prompt: prompt,
    // image: fs.createReadStream(pngImagePath),
    // mask: fs.createReadStream(maskPath),
    // image: imageFile, //FIX DE UN ERROR RELACIONADO CON EL MIME
    // mask: maskFile, //FIX DE UN ERROR RELACIONADO CON EL MIME
    image: await toFile(fs.createReadStream(pngImagePath), null, { //otra opcion para solucionar el error con el mime
      type: 'image/png',
    }),
    mask: await toFile(fs.createReadStream(maskPath), null, { //otra opcion para solucionar el error con el mime
      type: 'image/png',
    }),


    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
