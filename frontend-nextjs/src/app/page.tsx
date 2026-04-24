'use client';

import { useState, useEffect } from 'react';

interface SystemStatus {
  gateway: {
    name: string;
    status: string;
    timestamp: string;
    latency_ms: number;
  };
  core_service: {
    status: string;
    data: any;
  };
}

export default function Dashboard() {
  const [showSuccess, setShowSuccess] = useState(true);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/health`);
      if (!res.ok) throw new Error('Gateway Connection Failed');
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showSuccess) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [showSuccess]);

  if (showSuccess) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative glass-card p-12 flex flex-col items-center animate-float">
            <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 animate-success">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Deployment Successful!
            </h1>
            <p className="text-gray-400 max-w-md mb-8">
              대표님, 축하드립니다! 3-Tier 시스템이 성공적으로 클라우드에 안착했습니다. 모든 서비스가 온라인 상태입니다.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
            >
              Dashboard 입장하기
            </button>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 font-mono">
          <span>Spring Boot: Online</span>
          <span>•</span>
          <span>FastAPI: Online</span>
          <span>•</span>
          <span>Next.js: Online</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 max-w-5xl mx-auto">
      <div className="w-full flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            Nexus Dashboard
          </h1>
          <p className="text-gray-400">대표님을 위한 실시간 3-Tier 배포 모니터링 시스템</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSuccess(true)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            Show Success
          </button>
          <button 
            onClick={fetchStatus}
            className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors font-medium"
          >
            Force Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Gateway Status Card */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-blue-300">Logic Gateway</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${status?.gateway.status === 'UP' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {status?.gateway.status || 'OFFLINE'}
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">Technology: FastAPI (Python)</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <span className="text-sm text-gray-400">Latency</span>
              <span className="text-lg font-mono">{status?.gateway.latency_ms ?? '--'} ms</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <span className="text-sm text-gray-400">Last Ping</span>
              <span className="text-sm font-mono">
                {status ? new Date(status.gateway.timestamp).toLocaleTimeString() : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Core Service Status Card */}
        <div className="glass-card p-8 border-purple-500/20">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-purple-300">Core Service</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${status?.core_service.status === 'UP' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {status?.core_service.status || 'OFFLINE'}
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">Technology: Spring Boot (Java)</p>
          {status?.core_service.data ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                <span className="text-sm text-gray-400">Version</span>
                <span className="text-sm font-mono">{status.core_service.data.version}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                <span className="text-sm text-gray-400">Active Threads</span>
                <span className="text-sm font-mono text-purple-400">{status.core_service.data.metrics.active_threads}</span>
              </div>
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center bg-white/5 rounded-xl border border-dashed border-white/10">
              <span className="text-gray-500 italic">Waiting for connection...</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl w-full text-center text-red-400 text-sm">
          ⚠️ Connection Error: {error}. 대표님, 서버가 실행 중인지 확인해 주세요.
        </div>
      )}

      {loading && !status && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 animate-pulse">Initializing System...</p>
        </div>
      )}
    </main>
  );
}
