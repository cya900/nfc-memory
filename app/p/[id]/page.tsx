'use client';

import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Memory {
  nfc_key: string;
  media_type: 'image' | 'video' | 'audio';
  media_url: string;
  title?: string;
  message?: string;
}

export default function MemoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('memories')
        .select('*')
        .eq('nfc_key', id)
        .single();

      if (data) setData(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#121212] text-white text-lg">
        讀取回憶中...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#121212] text-white text-lg">
        找不到這份回憶
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 100, rotate: -5, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, rotate: 2, scale: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.2 }}
        whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.3 } }}
        className="relative p-4 pb-14 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-sm max-w-[350px] w-full border border-gray-100"
        style={{
          background: '#faf9f6',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      >
        {/* 媒體區域 */}
        <div className="relative aspect-square bg-black overflow-hidden">
          {data.media_type === 'image' && (
            <img src={data.media_url} alt="memory" className="w-full h-full object-cover" />
          )}
          {data.media_type === 'video' && (
            <video
              src={data.media_url}
              controls
              autoPlay
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              您的瀏覽器不支援播放此影片。
            </video>
          )}
          {data.media_type === 'audio' && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-4 p-6">
              <div className="text-5xl">🎵</div>
              <audio src={data.media_url} controls className="w-full" />
            </div>
          )}
        </div>

        {/* 底部手寫文字區域 */}
        <div className="mt-5 px-2 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-permanent-marker text-xl text-gray-500 tracking-wide"
          >
            {data.title ?? '你收到一份回憶...'}
          </motion.h1>
          {data.message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-1 text-sm text-gray-500 italic"
            >
              &ldquo;{data.message}&rdquo;
            </motion.p>
          )}
        </div>

        {/* 邊緣光澤感 */}
        <div className="absolute inset-0 rounded-sm pointer-events-none border-[10px] border-white/20 blur-sm" />
      </motion.div>
    </div>
  );
}
