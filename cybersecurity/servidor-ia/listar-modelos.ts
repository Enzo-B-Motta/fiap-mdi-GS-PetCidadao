
import dotenv from "dotenv";

dotenv.config({
  path: "cybersecurity/servidor-ia/.env",
});

async function listarModelos() {
  const chave = process.env.GEMINI_API_KEY;

  if (!chave) {
    throw new Error("Chave Gemini nao configurada.");
  }

  const resposta = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models",
    {
      headers: {
        "x-goog-api-key": chave,
      },
    }
  );

  if (!resposta.ok) {
    console.error("Erro HTTP:", resposta.status);
    throw new Error("Nao foi possivel listar os modelos.");
  }

  const dados = await resposta.json();

  const modelos = dados.models
    .filter((modelo: any) =>
      modelo.supportedGenerationMethods?.includes("generateContent")
    )
    .map((modelo: any) => modelo.name);

  console.log("=== MODELOS GEMINI DISPONIVEIS ===");

  modelos.forEach((modelo: string) => {
    console.log(modelo);
  });
}

listarModelos().catch((erro) => {
  console.error(erro.message);
});
