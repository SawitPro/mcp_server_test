# job-poster-extractor-mcp

MCP (Model Context Protocol) server yang menyediakan prompt siap pakai untuk
mengekstrak detail lowongan kerja (kualifikasi, tech stack, dsb.) dari
gambar/screenshot poster lowongan.

Server ini mengekspos satu prompt: `extract-job-poster`.

## Prasyarat

- Node.js 18+ (disarankan versi LTS terbaru)
- npm

## Instalasi

```bash
git clone https://github.com/SawitPro/mcp_server_test.git
cd mcp_server_test
npm install
```

## Build

Meng-compile TypeScript dari `src/` ke `dist/`:

```bash
npm run build
```

Output utama: `dist/index.js`.

## Menjalankan

Ada dua cara:

```bash
# Menjalankan hasil build (production)
npm start

# Menjalankan langsung dari TypeScript tanpa build (development)
npm run dev
```

Server berkomunikasi lewat **stdio**, jadi saat dijalankan manual ia akan
diam menunggu input JSON-RPC. Ini normal. Umumnya server tidak dijalankan
manual, melainkan dipanggil otomatis oleh MCP client (lihat di bawah).

## Menghubungkan ke MCP Client

MCP client (Kiro, Claude Desktop, dll.) menjalankan server ini sebagai proses
lokal. Tambahkan konfigurasi berikut pada file `mcp.json` client Anda.

### Opsi A — memakai hasil build (disarankan)

Jalankan `npm run build` dulu, lalu:

```json
{
  "mcpServers": {
    "job-poster-extractor": {
      "command": "node",
      "args": ["/path/absolut/ke/mcp_server_test/dist/index.js"],
      "disabled": false
    }
  }
}
```

### Opsi B — langsung dari TypeScript (tanpa build)

```json
{
  "mcpServers": {
    "job-poster-extractor": {
      "command": "npx",
      "args": ["tsx", "/path/absolut/ke/mcp_server_test/src/index.ts"],
      "disabled": false
    }
  }
}
```

Ganti `/path/absolut/ke/mcp_server_test` dengan path absolut di mesin Anda.

Untuk Kiro, file config berada di:
- Workspace: `.kiro/settings/mcp.json`
- User (global): `~/.kiro/settings/mcp.json`

## Menggunakan prompt

Setelah server terhubung, client akan menampilkan prompt `extract-job-poster`.
Pilih prompt tersebut lalu lampirkan gambar poster lowongan. Server mengembalikan
system prompt yang mengarahkan model untuk mengekstrak dan memformat detail
lowongan.

## Uji cepat tanpa client

Anda bisa menguji server dengan mengirim pesan JSON-RPC lewat stdio:

```bash
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"prompts/list","params":{}}' \
  | node dist/index.js
```

Anda akan melihat balasan `serverInfo` dan daftar prompt yang tersedia.

## Struktur proyek

```
mcp_server_test/
├── src/
│   └── index.ts       # Sumber MCP server (entry point)
├── dist/              # Hasil build (dibuat oleh `npm run build`)
├── package.json
├── tsconfig.json
└── README.md
```
