import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Movie API</h1>
      <p>This API provides movie information and download links.</p>
      
      <h2>How to Use</h2>
      <div style={{ background: '#f1f1f1', padding: '1rem', borderRadius: '5px' }}>
        <p>Send a GET request to:</p>
        <pre>{`/api/movies?query=YOUR_MOVIE_NAME`}</pre>
      </div>
      
      <h2>Example Response</h2>
      <pre style={{ background: '#f1f1f1', padding: '1rem', borderRadius: '5px', overflowX: 'auto' }}>
{`{
  "movie": {
    "title": "Inception",
    "description": "A skilled thief, the absolute best in the dangerous art of 'extraction'...",
    "releaseDate": "2010-07-16",
    "poster": "https://image.tmdb.org/t/p/w500/8dM85pzmRMgE3bFwtAOt8u99h3k.jpg"
  },
  "downloadLink": "https://hdhub4u.cricket/inception-download"
}`}
      </pre>
    </div>
  );
}
