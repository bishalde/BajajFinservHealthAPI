'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
}

const sections = [
  { value: 'characters', label: 'Characters' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highestAlphabet', label: 'Highest Alphabet' },
];

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState<string[]>(['characters', 'numbers', 'highestAlphabet']);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const parsedInput = JSON.parse(input);
      const apiResponse = await axios.post('https://bajajfinservhealthapi.vercel.app/bfhl', parsedInput);
      setResponse(apiResponse.data);
      console.log(apiResponse.data);
    } catch (err) {
      setError('Invalid JSON input or API error');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setVisibleSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderSection = (title: string, data: string[] | undefined) => (
    <div className="bg-gray-200 p-3 rounded-lg shadow">
      <h3 className="font-semibold text-teal-700">{title}:</h3>
      <p>{data && data.length > 0 ? data.join(', ') : 'None'}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl font-sans">
      <main>
        <h1 className="text-4xl font-bold mb-6 text-center text-teal-700">Data Processing App</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
            className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black font-light bg-teal-50"
            rows={4}
          />
          <button 
            type="submit" 
            className="mt-3 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {error && <p className="text-red-500 mb-4 p-3 bg-red-100 rounded-lg">{error}</p>}

        {response && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg text-gray-800">
            <h2 className="text-2xl font-semibold mb-3 text-teal-700">Response:</h2>
            <div className="mb-4 relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-left bg-teal-50 border rounded-lg p-2 flex justify-between items-center shadow"
              >
                <span>Toggle Sections</span>
                <span>{isDropdownOpen ? '▲' : '▼'}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                  {sections.map(section => (
                    <label key={section.value} className="flex items-center p-2 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={visibleSections.includes(section.value)}
                        onChange={() => toggleSection(section.value)}
                        className="mr-2"
                      />
                      {section.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              {visibleSections.includes('characters') && renderSection('Characters', response.alphabets)}
              {visibleSections.includes('numbers') && renderSection('Numbers', response.numbers)}
              {visibleSections.includes('highestAlphabet') && (
                <div className="bg-gray-200 p-3 rounded-lg shadow">
                  <h3 className="font-semibold text-teal-700">Highest Alphabet:</h3>
                  <p>{response.highest_alphabet && response.highest_alphabet.length > 0 ? response.highest_alphabet[0] : 'None'}</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>User ID:</strong> {response.user_id || 'N/A'}</p>
              <p><strong>Email:</strong> {response.email || 'N/A'}</p>
              <p><strong>Roll Number:</strong> {response.roll_number || 'N/A'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
