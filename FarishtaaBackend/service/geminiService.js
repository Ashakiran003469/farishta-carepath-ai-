import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});

const createMessagesString=(messages)=>{
return messages.map(message=>`${message.role} : ${message.content}`).join('\n');
}
const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are a medical symptom checker assistant. 
Do not hallucinate. 
Rules : 
1.Extract symptoms accurately
2. Ask MAX 2 followup questions only if needed or recommend some home remedy if not a big issue.
3. Track severity based on symptoms and answers.

5.Do not ask more than 2 questions and give your final verdict which specialist should he/she visit 

You can also refer to the last 3–5 messages in chat_history for natural conversation flow only if needed .
You will recommend categories like this 
    "Cardiologist",
        "Dermatologist",
        "ENT Specialist",
        "Endocrinologist",
        "General Physician",
        "General Practitioner",
        "Gynecologist",
        "Neurologist",
        "Orthopedic Surgeon",
        "Pediatrician",
        "Psychiatrist"   or other if any 
5. Do not hallucinate . DO NOT ask extra questions
`
}

export async function generateContent(language,userPrompt,messages=[]) {

const recentChat=messages.map(m=>
   ({
   role : m.role==='patient'? 'user' : 'assistant',
  content : m.content,
  }));
const newPrompt={
  role : 'user',
  content : userPrompt
}
const languageToFollow={
  role : 'user',
  content : `Please respond in ${language} language.`
}

const finalMessages=[SYSTEM_PROMPT,...recentChat,newPrompt,languageToFollow];
const newMessageList=createMessagesString(finalMessages);
  const result = await ai.models.generateContent({
    model : 'gemini-2.5-flash',
    contents:newMessageList,
  });
  return result.text
  .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}
