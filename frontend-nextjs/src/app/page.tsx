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
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      // 환경 변수가 있으면 사용하고 없으면 기본값 사용
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
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 max-w-5xl mx-auto">
      <div className="w-full flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            Nexus Dashboard
          </h1>
          <p className="text-gray-400">대표님을 위한 실시간 3-Tier 배포 모니터링 시스템</p>
        </div>
        <button 
          onClick={fetchStatus}
          className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors font-medium"
        >
          Force Refresh
        </button>
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
