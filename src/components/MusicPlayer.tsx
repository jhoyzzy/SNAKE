import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Slither',
    artist: 'Digital Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
  },
  {
    id: '3',
    title: 'Emerald Rhythm',
    artist: 'Green Code',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex flex-col gap-6 items-center">
        {/* Visualizer */}
        <div className="flex items-end gap-1 h-[40px] w-full bg-black/40 border border-[#00f3ff]/10 p-1">
          {[0.4, 0.8, 0.6, 1.0, 0.7, 0.3, 0.9, 0.5, 0.2, 0.6, 0.8, 0.4].map((h, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [`${h * 20}%`, `${h * 100}%`, `${h * 20}%`] } : { height: `${h * 40}%` }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.03 }}
              className="flex-1 bg-[#ff007a]"
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={skipBack}
            className="w-10 h-10 rounded-none border-[#00f3ff]/30 bg-transparent text-[#00f3ff] hover:bg-[#00f3ff]/10"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </Button>
          <Button
            size="icon"
            onClick={togglePlay}
            className="w-12 h-12 rounded-none bg-[#00f3ff] hover:bg-[#00f3ff]/80 text-black shadow-[0_0_15px_rgba(0,243,255,0.4)] border-none"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={skipForward}
            className="w-10 h-10 rounded-none border-[#00f3ff]/30 bg-transparent text-[#00f3ff] hover:bg-[#00f3ff]/10"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </Button>
        </div>

        {/* Progress */}
        <div className="w-full space-y-1">
          <div className="h-1 bg-[#00f3ff]/10 rounded-none overflow-hidden relative border border-[#00f3ff]/20">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-[#ff007a] shadow-[0_0_8px_#ff007a]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#00f3ff]/40 uppercase tracking-widest">
            <span>FREQ_SYNC: {Math.floor(progress)}%</span>
            <span>OSC_STABLE</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-full flex items-center gap-2 px-1">
          <Volume2 className="w-3 h-3 text-[#00f3ff]/40" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(vals) => setVolume(vals[0] / 100)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};
