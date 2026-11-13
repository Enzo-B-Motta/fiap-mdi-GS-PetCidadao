import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "cybersecurity/servidor-ia/.env",
});

const app = express();

// Permite chamadas apenas do dashboard local do Expo.
app.use((req, res, next) => {
  const origensPermitidas = ["http://localhost:8081", "http://127.0.0.1:8081"];

  const origem = req.headers.origin;

  if (origem && origensPermitidas.includes(origem)) {
    res.setHeader("Access-Control-Allow-Origin", origem);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(
      origem && !origensPermitidas.includes(origem) ? 403 : 204,
    );
  }

  next();
});

app.use(express.json({ limit: "10kb" }));

const PORT = 3001;

app.get("/", (_req, res) => {
  res.json({
    projeto: "PET CIDADAO",
    servico: "Cybersecurity - IA",
    status: "Servidor funcionando",
  });
});

app.post("/explicar-risco", async (req, res) => {
  const { tipoPII, risco, destino } = req.body ?? {};

  const tiposPermitidos = ["EMAIL", "CPF", "TELEFONE"];
  const riscosPermitidos = ["ALTO", "BAIXO"];
  const destinosPermitidos = ["LOG_PUBLICO", "ARMAZENAMENTO_SEGURO"];

  if (
    typeof tipoPII !== "string" ||
    !tiposPermitidos.includes(tipoPII) ||
    typeof risco !== "string" ||
    !riscosPermitidos.includes(risco) ||
    typeof destino !== "string" ||
    !destinosPermitidos.includes(destino)
  ) {
    return res.status(400).json({
      erro: "Dados de auditoria invalidos.",
    });
  }

  const chave = process.env.GEMINI_API_KEY;

  if (!chave) {
    return res.status(500).json({
      erro: "Chave Gemini nao configurada.",
    });
  }

  const prompt = `
Você é um assistente de segurança digital do PET CIDADÃO,
uma plataforma de proteção animal.

Uma auditoria automatizada identificou um possível
risco de exposição de dados pessoais.

Informações técnicas:
- Tipo de dado: ${tipoPII}
- Nível de risco: ${risco}
- Destino analisado: ${destino}

Sua tarefa é explicar esse risco ao cidadão em
português brasileiro, com linguagem simples.

REGRAS OBRIGATÓRIAS:
1. Não afirme que houve vazamento ou exposição
   confirmada de dados.
2. Explique que foi identificado um risco potencial.
3. Descreva possíveis consequências.
4. Apresente duas recomendações práticas de proteção.
5. Não solicite informações pessoais.
6. Não invente incidentes de segurança.
7. Responda em até 100 palavras.
`;

  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": chave,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    if (!resposta.ok) {
      const detalhe = await resposta.text();

      console.error("[GEMINI] Erro HTTP:", resposta.status);

      console.error("[GEMINI] Detalhes:", detalhe);

      return res.status(502).json({
        erro: "Falha na comunicacao com o Gemini.",
        statusGemini: resposta.status,
      });
    }

    const dados = await resposta.json();

    const explicacao = dados.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!explicacao) {
      return res.status(502).json({
        erro: "Gemini nao retornou uma explicacao.",
      });
    }

    return res.json({
      sucesso: true,
      explicacao,
      geradoPor: "Gemini",
    });
  } catch {
    return res.status(500).json({
      erro: "Erro ao processar a explicacao.",
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`PET CIDADAO - Servidor IA em http://127.0.0.1:${PORT}`);
});
