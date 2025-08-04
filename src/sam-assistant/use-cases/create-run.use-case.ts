import OpenAI from 'openai';


interface Options {
  threadId: string;
  assistantId?: string;
}


export const createRunUseCase = async (openai: OpenAI, options: Options) => {

  const { threadId, assistantId = 'asst_o825uTcfzJP5Ms2ZHcix7xYi' } = options; //assistantId toca crearlo desde la pagina de opeenai: https://platform.openai.com/assistants

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions; //! OJO! Sobre escribe el asistente
  });

  console.log({ run });

  return run;

}