import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SkillAnalysis {
  name: string;
  obsolescenceScore: number;
  status: "Obsolete" | "At Risk" | "Safe";
  reasoning: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
}

export interface CVAnalysisResult {
  probability: number;
  verdict: string;
  skillsAnalysis: SkillAnalysis[];
  roadmap: RoadmapStep[];
}

export async function analyzeCV(cvText: string): Promise<CVAnalysisResult> {
  const prompt = `
Phân tích CV sau đây và xác định tỷ lệ % khả năng công việc của ứng viên bị thay thế bởi AI trong 12 tháng tới (AI Replacement Probability).
Hãy đưa ra một nhận xét (verdict) bằng tiếng Việt thật phũ phàng, hài hước, mang tính "hù dọa" nhưng vẫn thực tế về nguy cơ của họ.
Trích xuất các kỹ năng/công nghệ chính trong CV. Đánh giá "Điểm lỗi thời" (obsolescenceScore) từ 0 đến 100 (100 là cực kỳ dễ bị AI thay thế hoặc đã lỗi thời).
State "status" dưới dạng "Obsolete" (80-100), "At Risk" (40-79), hoặc "Safe" (0-39).
Thêm một mô tả ngắn (reasoning) giải thích tại sao kỹ năng này lại có điểm số đó (ví dụ: "AI hiện tại có thể viết code boilerplate tốt hơn con người").
Cuối cùng, cung cấp "Survival Roadmap" (Lộ trình sinh tồn) gồm các bước hành động thực tế để họ không bị mất việc (ví dụ: học System Architecture, cách làm chủ AI, kỹ năng mềm...).
Toàn bộ nội dung trả về (verdict, titles, descriptions, reasoning) PHẢI bằng Tiếng Việt (ngoại trừ tên public skills/tech).

CV CONTENT:
"""
${cvText}
"""
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          probability: {
            type: Type.INTEGER,
            description: "Percentage probability of being replaced by AI (0-100)."
          },
          verdict: {
            type: Type.STRING,
            description: "A short, punchy, slightly scary but funny verdict."
          },
          skillsAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                obsolescenceScore: { type: Type.INTEGER },
                status: { type: Type.STRING },
                reasoning: { type: Type.STRING, description: "Short explanation for the score" }
              },
              required: ["name", "obsolescenceScore", "status", "reasoning"]
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.INTEGER },
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["step", "title", "description"]
            }
          }
        },
        required: ["probability", "verdict", "skillsAnalysis", "roadmap"]
      }
    }
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as CVAnalysisResult;
}
