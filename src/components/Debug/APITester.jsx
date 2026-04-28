// components/Debug/APITester.jsx
// Temporary component to test all API endpoints

import { useState } from 'react';
import axiosInstance from '../../utils/axios';

const APITester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, request) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      const response = await request();
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          status: response.status,
          data: response.data
        }
      }));
      
      console.log(`✅ ${name} SUCCESS:`, response.data);
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          status: error.response?.status || 'Network Error',
          error: error.response?.data || error.message
        }
      }));
      
      console.error(`❌ ${name} FAILED:`, error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Token Check',
      description: 'Check if token is sent to backend',
      test: () => axiosInstance.get('/api/test/token')
    },
    {
      name: 'Token Verification',
      description: 'Check if Firebase can verify token',
      test: () => axiosInstance.get('/api/test/verify-token')
    },
    {
      name: 'Admin Access',
      description: 'Check if admin middleware works',
      test: () => axiosInstance.get('/api/test/admin')
    },
    {
      name: 'Products Count',
      description: 'Check database connection',
      test: () => axiosInstance.get('/api/test/products')
    }
  ];

  return (
    <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto my-8">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">🧪 API Endpoint Tester</h2>
        
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{test.name}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                
                <button
                  onClick={() => testEndpoint(test.name, test.test)}
                  className={`btn btn-sm ${
                    loading[test.name] ? 'btn-disabled loading' : 'btn-primary'
                  }`}
                  disabled={loading[test.name]}
                >
                  {loading[test.name] ? 'Testing...' : 'Test'}
                </button>
              </div>
              
              {results[test.name] && (
                <div className={`alert ${
                  results[test.name].success ? 'alert-success' : 'alert-error'
                } mt-3`}>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {results[test.name].success ? '✅ Success' : '❌ Failed'}
                      </span>
                      <span className="badge">
                        Status: {results[test.name].status}
                      </span>
                    </div>
                    
                    <details className="cursor-pointer">
                      <summary className="text-sm">View Response</summary>
                      <pre className="text-xs mt-2 p-2 bg-base-200 rounded overflow-auto max-h-48">
                        {JSON.stringify(
                          results[test.name].data || results[test.name].error,
                          null,
                          2
                        )}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="divider">Quick Actions</div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              tests.forEach(test => testEndpoint(test.name, test.test));
            }}
            className="btn btn-primary"
          >
            Run All Tests
          </button>
          
          <button
            onClick={() => {
              setResults({});
              console.clear();
            }}
            className="btn btn-ghost"
          >
            Clear Results
          </button>
        </div>
        
        <div className="alert alert-info mt-4">
          <span className="text-sm">
            📝 Check browser console for detailed logs
          </span>
        </div>
      </div>
    </div>
  );
};

export default APITester;