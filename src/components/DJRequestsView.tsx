import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

// Define a type for a DJ request
interface DJRequest {
  id: string; // Assuming id is a string (e.g., UUID from Supabase)
  created_at: string;
  song_name: string;
  artist?: string | null; // Artist is now optional
  requested_by?: string | null;
  play_time?: string | null;
}

const DJRequestsView: React.FC = () => {
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [playTime, setPlayTime] = useState('');

  const [requests, setRequests] = useState<DJRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // Fetch initial requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('dj_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching DJ requests:', fetchError);
        setError('Failed to load song requests. Please try again later.');
        setRequests([]);
      } else {
        setRequests(data || []);
      }
      setIsLoading(false);
    };

    fetchRequests();

    // Set up Supabase real-time subscription
    const channel = supabase
      .channel('public:dj_requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dj_requests' },
        (payload) => {
          console.log('New DJ request received:', payload.new);
          // Add the new request to the beginning of the list
          setRequests((prevRequests) => [payload.new as DJRequest, ...prevRequests]);
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to DJ requests!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Subscription Error:', err);
          setError('Real-time updates might be unavailable.');
        }
        if (status === 'TIMED_OUT') {
          console.warn('Subscription timed out.');
        }
      });
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage(null);
    setError(null);

    if (!songName.trim()) { // Only songName is strictly required now
      setError('Please enter the song name.');
      return;
    }

    setIsLoading(true);
    const { error: insertError } = await supabase
      .from('dj_requests')
      .insert([{ 
        song_name: songName.trim(), 
        artist: artist.trim() || null, // Send null if artist is empty
        requested_by: requestedBy.trim() || null, 
        play_time: playTime.trim() || null
      }]);

    setIsLoading(false);

    if (insertError) {
      console.error('Error submitting DJ request:', insertError);
      setError('Failed to submit your request. Please try again. Details: ' + insertError.message);
    } else {
      setSubmitMessage('Song request submitted successfully!');
      // Clear form fields
      setSongName('');
      setArtist('');
      setRequestedBy('');
      setPlayTime('');
    }
  };

  // Consistent input styling (inspired by ShuttleRegistration)
  // Using GSB_RED for button and GOLD_ACCENT for focus rings to match theme
  const GSB_RED = '#8C1515';
  const GOLD_ACCENT = '#B08D57'; // Muted gold for active tab accent / focus rings
  const WARM_NEUTRAL_DARK = '#4A4A4A'; // Warm dark gray for text/elements

  const inputStyle = `w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-[${GOLD_ACCENT}] border-gray-300`;
  const labelStyle = `block text-sm font-medium mb-1.5 text-[${WARM_NEUTRAL_DARK}]`;
  const buttonStyle = `mt-6 w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[${GSB_RED}] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${GSB_RED}]`;
  
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Request a Song</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="songName" className={labelStyle}>
              Song Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="songName"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="artist" className={labelStyle}>
              Artist (Optional)
            </label>
            <input
              type="text"
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="requestedBy" className={labelStyle}>
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="requestedBy"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              className={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="playTime" className={labelStyle}>
              Preferred Play Time (e.g., "During dinner", "Late night") (Optional)
            </label>
            <input
              type="text"
              id="playTime"
              value={playTime}
              onChange={(e) => setPlayTime(e.target.value)}
              className={inputStyle}
            />
          </div>
          
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          {submitMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{submitMessage}</p>}

          <div>
            <button type="submit" className={buttonStyle} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Requested Songs</h3>
        {isLoading && requests.length === 0 && <p className="text-center text-gray-500">Loading requests...</p>}
        {/* Show general fetch error if list is empty and was an error initially */}
        {!isLoading && error && requests.length === 0 && submitMessage === null && <p className="text-center text-red-500">Could not load requests. {error}</p>}
        
        {requests.length === 0 && !isLoading && !(error && submitMessage === null) && (
          <p className="text-center text-gray-500">No songs requested yet. Be the first!</p>
        )}

        {requests.length > 0 && (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {requests.map((req) => (
              <li key={req.id} className="p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200">
                <p className="font-semibold text-gray-800">{req.song_name}</p>
                {req.artist && (
                  <p className="text-sm text-gray-600">by {req.artist}</p>
                )}
                {!req.artist && (
                  <p className="text-sm text-gray-500 italic">Artist not specified</p>
                )}
                {req.requested_by && (
                  <p className="text-xs text-gray-500 mt-1">Requested by: {req.requested_by}</p>
                )}
                 {req.play_time && (
                  <p className="text-xs text-gray-500 mt-0.5">Preferred time: {req.play_time}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DJRequestsView; 