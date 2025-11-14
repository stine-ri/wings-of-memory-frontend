// Components/MemorialList.tsx
import React, { useEffect, useState } from 'react';
import { getUserMemorials } from '../api/memorial';   // ⬅ correct import
import type { MemorialData } from '../types/memorial';

const MemorialList: React.FC = () => {
  const [memorials, setMemorials] = useState<MemorialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemorials = async () => {
      const userMemorials = await getUserMemorials();
      setMemorials(userMemorials);
      setLoading(false);
    };

    loadMemorials();
  }, []);

  if (loading) return <div>Loading your memorials...</div>;

  return (
    <div className="memorial-list">
      <h2>Your Memorials</h2>

      {memorials.length === 0 ? (
        <p>You haven't created any memorials yet.</p>
      ) : (
        <div className="memorial-grid">
          {memorials.map(memorial => (
            <div key={memorial.id} className="memorial-card">
              <h3>{memorial.name}</h3>

          

              <a href={`/memorial/${memorial.id}`}>View Memorial</a>
              <a href={`/edit/${memorial.id}`}>Edit Memorial</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemorialList;
