'use client';

import { use, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        讀取回憶中...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        找不到這份回憶
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
          >
            {data.media_type === 'image' && (
              <img src={data.media_url} alt="memory" className="w-full h-auto" />
            )}
            {data.media_type === 'video' && (
              <div className="relative w-full aspect-video overflow-hidden">
                <video
                  src={data.media_url}
                  controls
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                >
                  您的瀏覽器不支援播放此影片。
                </video>
              </div>
            )}
            {data.media_type === 'audio' && (
              <div className="p-8 bg-gray-900 text-center">
                <div className="mb-4 text-4xl">🎵</div>
                <audio src={data.media_url} controls className="w-full" />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <h1 className="text-2xl font-bold mb-2">{data.title ?? '給你的驚喜'}</h1>
            {data.message && (
              <p className="text-gray-400 italic">"{data.message}"</p>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
