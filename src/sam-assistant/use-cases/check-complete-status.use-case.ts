import OpenAI from 'openai';


interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(
    threadId,
    runId
  );

  console.log({ status: runStatus.status }); // completed

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  //? SE PUEDE MEJORAR LAS VALIDACIONES

  // Esperar un segundo
  await new Promise(resolve => setTimeout(resolve, 1000));//ESPERAR UN SEGUNDO ANTES DE VOLVER A CONSULTAR

  return await checkCompleteStatusUseCase(openai, options); //FUNCION RECURSIVA
}