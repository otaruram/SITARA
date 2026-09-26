import OpenAI from 'openai';
import { ENV } from '../config/env';
import { createClient } from 'redis';
import crypto from 'crypto';

const sumopodAI = new OpenAI({
  apiKey: ENV.SUMOPOD_API_KEY,
  baseURL: "https://ai.sumopod.com",
});

// Inisialisasi Redis Client
const redisClient = createClient({
  url: 'redis://localhost:6379' // Secara default mengarah ke localhost
});

redisClient.on('error', (err) => console.log('Redis Client tidak aktif atau gagal koneksi:', err.message));

// Konek ke Redis secara non-blocking
redisClient.connect().catch(() => console.log('Bypass Redis: Berjalan tanpa Cache.'));

interface AIAnalysisResult {
  category: string;
  score: number;
  reason: string;
}

export const analyzeComplaint = async (title: string, description: string): Promise<AIAnalysisResult> => {
  const prompt = `Analisis keluhan berikut:\nJudul: ${title}\nDeskripsi: ${description}\n\nTentukan:\n1. Kategori (misal: Infrastruktur, Darurat, Lingkungan)\n2. Skor prioritas (1-100)\n3. Alasan singkat\n\nBalas HANYA dengan format JSON: {"category": "...", "score": ..., "reason": "..."}`;
  
  // Buat Cache Key (Hash dari Judul & Deskripsi) agar tidak perlu menyimpan string panjang di key
  const hash = crypto.createHash('sha256').update((title + "|" + description).toLowerCase()).digest('hex');
  const cacheKey = `ai_complaint:${hash}`;

  try {
    // 1. Cek Redis Cache Terlebih Dahulu
    if (redisClient.isReady) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log("⚡ [Cache HIT] Mengambil skor dari Redis!");
        return JSON.parse(cached) as AIAnalysisResult;
      }
    }

    console.log("🧠 [Cache MISS] Menghubungi LLM...");
    // 2. Jika tidak ada di cache, panggil LLM
    const response = await sumopodAI.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0].message?.content || '{}';
    const result = JSON.parse(content) as AIAnalysisResult;

    // 3. Simpan Hasil ke Redis selama 30 hari (2592000 detik)
    if (redisClient.isReady) {
      await redisClient.setEx(cacheKey, 2592000, JSON.stringify(result));
    }

    return result;
  } catch (error) {
    console.error("Error pada AI atau Redis:", error);
    // Fallback if AI fails
    return { category: "Uncategorized", score: 50, reason: "Gagal menganalisis dengan AI" };
  }
};
