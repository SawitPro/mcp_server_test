import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "job-poster-extractor-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
    },
  }
);

const SYSTEM_PROMPT = `
# ROLE & GOAL
Kamu adalah Expert Technical Recruiter & HR Data Extractor AI. Tugas utamanya adalah membaca, mengekstrak, dan memformat seluruh informasi penting dari gambar/screenshot lowongan pekerjaan secara presisi.

[Sisipkan isi prompt/rules yang kita buat tadi di sini]
`;

// 1. List Prompts yang tersedia
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "extract-job-poster",
        description: "Prompt untuk mengekstrak detail kualifikasi & tech stack dari poster lowongan kerja.",
      },
    ],
  };
});

// 2. Return System Prompt saat diminta oleh AI Client
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === "extract-job-poster") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `${SYSTEM_PROMPT}\n\nSilakan ekstrak gambar lowongan kerja yang saya lampirkan berikut.`,
          },
        },
      ],
    };
  }
  throw new Error("Prompt not found");
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run();