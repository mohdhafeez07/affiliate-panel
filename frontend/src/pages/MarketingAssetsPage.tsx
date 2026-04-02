import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Download, 
  Image as ImageIcon, 
  Search, 
  Maximize2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

const MarketingAssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        setAssets(response.data.data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold font-outfit tracking-tight">Marketing Assets</h2>
          <p className="text-dark-muted mt-1 font-medium italic">High-converting banners and creatives for your campaigns</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search banners by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-xl transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card aspect-[16/10] animate-pulse bg-slate-800/50"></div>
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="card group p-4 border-white/5 hover:border-primary-500/30 transition-all duration-500 bg-white/[0.01] hover:bg-white/[0.03] overflow-hidden flex flex-col">
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-slate-900 border border-dark-border">
                <img 
                  src={asset.imageUrl} 
                  alt={asset.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <button className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all border border-white/10">
                    <Maximize2 size={20} />
                  </button>
                  <a href={asset.imageUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all border border-white/10">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xl font-bold font-outfit mb-2 group-hover:text-primary-500 transition-colors uppercase tracking-tight">{asset.title}</h4>
                <p className="text-xs text-dark-muted font-bold uppercase tracking-widest mb-6">Format: Static JPG/PNG • High Res</p>
              </div>

              <a 
                href={asset.downloadUrl}
                className="w-full btn-secondary flex items-center justify-center space-x-2 py-3.5 group-hover:bg-primary-600/10 group-hover:text-primary-500 group-hover:border-primary-500/20 border border-dark-border"
              >
                <Download size={20} />
                <span className="font-bold">Download Asset</span>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No banners found" 
          description={`No results matching "${searchTerm}". Try a different term or clear the filter.`} 
          icon={ImageIcon} 
        />
      )}
    </div>
  );
};

export default MarketingAssetsPage;
