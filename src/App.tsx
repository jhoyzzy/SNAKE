/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music2, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00f3ff] font-sans flex flex-col overflow-hidden relative">
      <div className="crt-overlay" />
      <div className="scanline" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-[#00f3ff]/30 bg-[#0f0f12]/80 px-10 py-4 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-mono glitch-text uppercase tracking-tighter">
            SYNTH_SLITHER <span className="text-[#ff007a] opacity-50">v0.9.4_BETA</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#00f3ff]/10 border border-[#00f3ff] px-4 py-1 rounded-none text-[#00f3ff] font-mono text-sm">
            STATUS: [ENCRYPTED]
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-[250px_1fr_250px] gap-2 p-2">
        {/* Left Panel: Data Stream */}
        <aside className="bg-[#0f0f12]/50 border border-[#00f3ff]/20 p-4 flex flex-col gap-4">
          <div className="text-[10px] uppercase text-[#ff007a] tracking-[4px] mb-2 font-mono">DATA_STREAM</div>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[12px]">
            <div className="p-2 border border-[#ff007a]/40 bg-[#ff007a]/5">
              <div className="text-[#ff007a] mb-1">{'>>'} ACTIVE_NODE</div>
              <div className="text-white truncate">ELECTRIC_DREAMS.BIN</div>
            </div>
            {[
              { id: '0x01', name: 'NEON_HORIZON.EXE' },
              { id: '0x02', name: 'PULSE_CODE.SYS' },
              { id: '0x03', name: 'VOID_WALKER.DAT' }
            ].map((node, i) => (
              <div key={i} className="p-2 border border-[#00f3ff]/10 hover:border-[#00f3ff]/40 transition-colors cursor-crosshair">
                <div className="text-zinc-600 mb-1">{'>>'} {node.id}</div>
                <div className="text-zinc-400 truncate">{node.name}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-[#00f3ff]/10 text-[10px] text-[#707075] font-mono leading-tight uppercase">
            [CMD] WASD = NAVIGATE
            <br />
            [CMD] SPACE = HALT
            <br />
            [CMD] R = REBOOT
          </div>
        </aside>

        {/* Center: Neural Interface */}
        <section className="bg-black border border-[#00f3ff]/30 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <SnakeGame />
        </section>

        {/* Right Panel: Core Controls */}
        <aside className="bg-[#0f0f12]/50 border border-[#00f3ff]/20 p-4 flex flex-col items-center gap-6">
          <div className="text-[10px] uppercase text-[#ff007a] tracking-[4px] mb-2 font-mono w-full">CORE_FREQ</div>
          <MusicPlayer />
        </aside>
      </main>

      {/* Footer Status */}
      <footer className="relative z-10 px-10 py-2 bg-[#0f0f12]/90 border-t border-[#00f3ff]/30 flex justify-between text-[10px] text-[#00f3ff]/60 font-mono uppercase">
        <div>KERNEL: 0xDEADBEEF</div>
        <div className="animate-pulse">SIGNAL: STABLE</div>
        <div>UPLINK: 12.04.2026_18:40</div>
      </footer>
    </div>
  );
}

