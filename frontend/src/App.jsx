import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import SimulatorBar from './components/SimulatorBar';
import ThreatFeed from './components/ThreatFeed';
import LogStream from './components/LogStream';
import CustomLogModal from './components/CustomLogModal';
import { fetchDashboardStats, fetchThreats } from './api';

export default function App() {
  const [stats, setStats] = useState(null);
  const [threats, setThreats] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streamRefreshKey, setStreamRefreshKey] = useState(0);

  const loadAllData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [statsData, threatsData] = await Promise.all([
        fetchDashboardStats(),
        fetchThreats()
      ]);
      setStats(statsData);
      setThreats(threatsData);
      setBackendConnected(true);
    } catch (err) {
      console.warn('Backend not responding yet:', err.message);
      setBackendConnected(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    // Poll every 10 seconds for real-time threat updates
    const interval = setInterval(loadAllData, 10000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  const handleDataChanged = () => {
    loadAllData();
    setStreamRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      padding: '0 24px 64px 24px'
    }}>
      <Header
        backendConnected={backendConnected}
        onRefresh={handleDataChanged}
        refreshing={refreshing}
      />

      <main>
        {/* KPI Stat Cards */}
        <KpiCards stats={stats} />

        {/* Attack Simulator for Live Demo / Examination */}
        <SimulatorBar onSimulationComplete={handleDataChanged} />

        {/* Threat Radar Feed */}
        <ThreatFeed
          threats={threats}
          onThreatResolved={handleDataChanged}
        />

        {/* Raw Log Stream */}
        <LogStream
          key={streamRefreshKey}
          onOpenCustomLogModal={() => setIsModalOpen(true)}
          onDataChanged={handleDataChanged}
        />
      </main>

      {/* Manual Ingestion Modal */}
      <CustomLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogIngested={handleDataChanged}
      />
    </div>
  );
}
