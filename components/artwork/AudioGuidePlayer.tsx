'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { resolveMediaUrl } from '@/lib/mediaStorage';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Sparkles, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface AudioGuidePlayerProps {
  artistName: string;
  artworkTitle: string;
  audioDurationSeconds?: number;
  audioUrl?: string;
}

export function AudioGuidePlayer({
  artistName,
  artworkTitle,
  audioDurationSeconds = 145, // 2:25 default
  audioUrl,
}: AudioGuidePlayerProps) {
  const { locale, isRTL } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioDurationSeconds);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string>('');

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Resolve audio url if provided
  useEffect(() => {
    let active = true;
    if (audioUrl) {
      resolveMediaUrl(audioUrl).then((resolved) => {
        if (active) setResolvedAudioUrl(resolved);
      });
    } else {
      setResolvedAudioUrl('');
    }
    return () => {
      active = false;
    };
  }, [audioUrl]);

  // Handle native audio element setup
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [resolvedAudioUrl]);

  // Synthesized Ambient Museum Audio Drone for demo fallback
  const startSynthesizedAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = audioCtx || new AudioContextClass();
      if (!audioCtx) setAudioCtx(ctx);

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(216, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(isMuted ? 0.0001 : 0.06, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn('Web Audio synthesis fallback initialized', e);
    }
  };

  const stopSynthesizedAudio = () => {
    try {
      if (gainNodeRef.current && audioCtx) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          oscillatorRef.current = null;
        }, 500);
      }
    } catch (e) {}
  };

  const handleTogglePlay = () => {
    if (resolvedAudioUrl && audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Could not play native audio', err);
        });
      }
      return;
    }

    // Fallback synthesized ambient drone
    if (isPlaying) {
      setIsPlaying(false);
      stopSynthesizedAudio();
    } else {
      setIsPlaying(true);
      startSynthesizedAudio();
    }
  };

  // Timer loop for synthesized fallback
  useEffect(() => {
    if (resolvedAudioUrl) return; // Native audio handles its own timeupdate

    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            stopSynthesizedAudio();
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed, resolvedAudioUrl]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (resolvedAudioUrl && audioElementRef.current) {
      audioElementRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (resolvedAudioUrl && audioElementRef.current) {
      audioElementRef.current.muted = nextMute;
    } else if (gainNodeRef.current && audioCtx) {
      gainNodeRef.current.gain.setValueAtTime(nextMute ? 0.0001 : 0.06, audioCtx.currentTime);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = newSpeed;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-obsidian-surface via-[#14141a] to-obsidian-surface border border-gold/30 p-5 sm:p-6 shadow-gold-glow backdrop-blur-xl overflow-hidden">
      {/* Hidden Native Audio Element */}
      {resolvedAudioUrl && (
        <audio
          ref={audioElementRef}
          src={resolvedAudioUrl}
          preload="metadata"
        />
      )}

      {/* Ambient background glow */}
      <div className="absolute top-0 end-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-4 relative z-10">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-museum-divider pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shadow-inner-gold">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-gold font-serif font-bold">
                {locale === 'ckb'
                  ? 'ڕێبەری دەنگیی مۆزەخانە • دەنگی هونەرمەند'
                  : locale === 'ar'
                  ? 'الدليل الصوتي المتحفي • تعليق الفنان'
                  : 'Curatorial Audio Guide • Artist Narration'}
              </span>
              <span className="text-xs font-semibold text-parchment-pure truncate max-w-[200px] sm:max-w-md">
                {artworkTitle} — {artistName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-museum-secondary border border-white/5">
              {resolvedAudioUrl ? 'Studio Audio Track' : 'Synthesized 432Hz Drone'}
            </span>
          </div>
        </div>

        {/* Playback Controls & Waveform Progress */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Big Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold via-gold-light to-gold text-obsidian flex items-center justify-center shadow-gold-glow hover:scale-105 active:scale-95 transition-all shrink-0"
            aria-label={isPlaying ? 'Pause Audio Guide' : 'Play Audio Guide'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ms-0.5" />
            )}
          </button>

          {/* Waveform Scrubber & Counters */}
          <div className="flex flex-col gap-1.5 flex-1 w-full">
            <div className="relative w-full h-8 flex items-center">
              {/* Pseudo Waveform Bars */}
              <div className="absolute inset-0 flex items-center justify-between gap-1 pointer-events-none opacity-40">
                {Array.from({ length: 48 }).map((_, i) => {
                  const barHeight = Math.sin(i * 0.4) * 50 + 50;
                  const isPassed = (i / 48) * 100 <= progressPercent;
                  return (
                    <div
                      key={i}
                      style={{ height: `${Math.max(20, barHeight)}%` }}
                      className={`flex-1 rounded-full transition-colors duration-200 ${
                        isPassed ? 'bg-gold' : 'bg-museum-secondary/40'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Range Input Track */}
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full relative z-10 appearance-none bg-transparent cursor-pointer h-8 accent-gold"
              />
            </div>

            {/* Time Stamp & Controls Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-museum-secondary">
              <span className="text-gold">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>

              <div className="ms-auto flex items-center gap-2">
                {/* Playback Speed Pill */}
                <button
                  onClick={cycleSpeed}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-parchment transition-colors"
                >
                  {playbackSpeed}x
                </button>

                {/* Mute Toggle */}
                <button
                  onClick={toggleMute}
                  className="p-1 rounded-md text-museum-secondary hover:text-gold transition-colors"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
