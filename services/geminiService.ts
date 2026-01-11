
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const validateAnswer = async (question: string, userAnswer: string, correctAnswer: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `你是一个温柔的小学数学老师。
    
    上下文：
    问题：${question}
    标准参考答案：${correctAnswer}
    学生当前回答：${userAnswer}
    
    任务：
    判断学生回答是否正确并给出激励性反馈。如果回答错误，请给出一个非常简短的提示（不要直接给答案）。返回JSON格式。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING }
        },
        required: ["isCorrect", "feedback"]
      }
    }
  });
  return JSON.parse(response.text || '{"isCorrect":false, "feedback":"老师刚才没听清，能再说一遍吗？"}');
};

export const generateNewProblem = async (modelTitle: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请基于模型"${modelTitle}"，为5年级学生出一个“举一反三”练习题。
    
    要求：
    1. 纯净JSON。
    2. 题干是一个有趣的情境。
    3. 严格分3个递进步骤。
    4. 答案必须是纯数字或极简文字。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                question: { type: Type.STRING },
                hint: { type: Type.STRING },
                correctAnswer: { type: Type.STRING }
              },
              required: ["title", "explanation", "question", "hint", "correctAnswer"]
            }
          }
        },
        required: ["problem", "steps"]
      }
    }
  });
  
  return JSON.parse(response.text.trim());
};

export const generateCustomModel = async (topicName: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `你是一个资深小学数学特级教师。请为5年级学生设计一个关于"${topicName}"的互动学习模型。
    
    必须包含：
    1. title: 模型名称（如：平行四边形等高变形模型）
    2. description: 一句话描述核心逻辑。
    3. exampleProblem: 一个具体的、有趣的例题。
    4. steps: 3个互动的解题步骤，每个步骤都要引导孩子思考。
    
    针对"${topicName}"进行深度教学建模。如果是关于“变形”，请解释底和高变化对面积的影响。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          exampleProblem: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            minItems: 3,
            maxItems: 3,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                question: { type: Type.STRING },
                hint: { type: Type.STRING },
                correctAnswer: { type: Type.STRING }
              }
            }
          }
        },
        required: ["title", "description", "exampleProblem", "steps"]
      }
    }
  });
  const text = response.text.trim();
  return JSON.parse(text);
};
