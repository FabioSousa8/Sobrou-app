// src/Services/ia.ts
// O app chama o proxy — a chave Gemini fica APENAS no servidor, nunca aqui.
// Para dev local: mude PROXY_URL para http://localhost:3000/api/gemini
// Para produção: troque pela URL do seu deploy no Vercel

const PROXY_URL = "https://proxy-gemini-two.vercel.app/api/gemini";
// ↑ Troque pela sua URL real depois de fazer o deploy do proxy-gemini

async function chamarGemini(body: object): Promise<Response> {
  const response = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response;
}

export async function gerarTexto(prompt: string): Promise<string> {
  const response = await chamarGemini({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Erro ao chamar Gemini");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function identificarIngredientes(base64: string): Promise<string> {
  const response = await chamarGemini({
    contents: [
      {
        parts: [
          {
            text: "Liste os ingredientes alimentares visíveis nesta imagem. Responda apenas com uma lista simples separada por vírgulas, sem explicações. Exemplo: frango, arroz, tomate, cebola",
          },
          { inline_data: { mime_type: "image/jpeg", data: base64 } },
        ],
      },
    ],
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Erro ao identificar ingredientes");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}
