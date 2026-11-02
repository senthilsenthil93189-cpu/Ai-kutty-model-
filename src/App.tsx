/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, OptimizationResult } from './types';
import { Navbar } from './components/Navbar';
import { TrendingView } from './components/TrendingView';
import { OptimizerView } from './components/OptimizerView';
import { StoryStudioView } from './components/StoryStudioView';
import { AnimalSeriesView } from './components/AnimalSeriesView';
import { MediaLabView } from './components/MediaLabView';
import { ThreeStudioView } from './components/ThreeStudioView';
import { MusicStudioView } from './components/MusicStudioView';
import { ScienceHubView } from './components/ScienceHubView';
import { TranscribeView } from './components/TranscribeView';
import { SearchGroundingView } from './components/SearchGroundingView';
import { NanoBananaView } from './components/NanoBananaView';
import { VaultView } from './components/VaultView';
import { CoachView } from './components/CoachView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('trending');
  const [savedItems, setSavedItems] = useState<OptimizationResult[]>([]);
  const [selectedTopicForOptimizer, setSelectedTopicForOptimizer] = useState<{ topic: string; niche: string }>({ topic: '', niche: 'Tech & AI' });

  useEffect(() => {
    const stored = localStorage.getItem('creator_mind_vault');
    if (stored) {
      try {
        setSavedItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse vault items', e);
      }
    }
  }, []);

  const saveToVault = (item: OptimizationResult) => {
    const updated = [item, ...savedItems];
    setSavedItems(updated);
    localStorage.setItem('creator_mind_vault', JSON.stringify(updated));
  };

  const deleteProject = (id: string) => {
    const updated = savedItems.filter(i => i.id !== id);
    setSavedItems(updated);
    localStorage.setItem('creator_mind_vault', JSON.stringify(updated));
  };

  const updateStatus = (id: string, status: 'Idea' | 'Scripting' | 'Filming' | 'Published') => {
    const updated = savedItems.map(i => i.id === id ? { ...i, status } : i);
    setSavedItems(updated);
    localStorage.setItem('creator_mind_vault', JSON.stringify(updated));
  };

  const handleSelectTopicFromTrending = (topic: string, niche: string) => {
    setSelectedTopicForOptimizer({ topic, niche });
    setActiveTab('optimizer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={() => {
          setSelectedTopicForOptimizer({ topic: '', niche: 'Tech & AI' });
          setActiveTab('optimizer');
        }}
        savedCount={savedItems.length}
      />

      <main className="flex-1 pb-20">
        {activeTab === 'trending' && <TrendingView onSelectTopic={handleSelectTopicFromTrending} />}
        {activeTab === 'optimizer' && <OptimizerView key={selectedTopicForOptimizer.topic} initialTopic={selectedTopicForOptimizer.topic} initialNiche={selectedTopicForOptimizer.niche} onSaveToVault={saveToVault} />}
        {activeTab === 'story' && <StoryStudioView />}
        {activeTab === 'animals' && <AnimalSeriesView />}
        {activeTab === 'media' && <MediaLabView />}
        {activeTab === 'three' && <ThreeStudioView />}
        {activeTab === 'music' && <MusicStudioView />}
        {activeTab === 'science' && <ScienceHubView />}
        {activeTab === 'transcribe' && <TranscribeView />}
        {activeTab === 'grounding' && <SearchGroundingView />}
        {activeTab === 'nanobanana' && <NanoBananaView />}
        {activeTab === 'vault' && <VaultView savedItems={savedItems} onSelectProject={(item) => { setSelectedTopicForOptimizer({ topic: item.topic, niche: item.niche }); setActiveTab('optimizer'); }} onDeleteProject={deleteProject} onUpdateStatus={updateStatus} />}
        {activeTab === 'coach' && <CoachView />}
      </main>
    </div>
  );
}
