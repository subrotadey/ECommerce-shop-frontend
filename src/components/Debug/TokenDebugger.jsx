// components/Debug/TokenDebugger.jsx
// Add this temporarily to your admin layout to debug token issues

import { useEffect, useState } from 'react';
import { auth } from '../../firebase/firebase.init';
import useAuth from '../../hooks/useAuth';

const TokenDebugger = () => {
  const { currentUser } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const firebaseUser = auth.currentUser;
        
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken(false);
          const tokenResult = await firebaseUser.getIdTokenResult();
          
          setTokenInfo({
            hasToken: !!token,
            tokenLength: token?.length || 0,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            claims: tokenResult.claims,
            expirationTime: tokenResult.expirationTime,
            issuedAtTime: tokenResult.issuedAtTime,
            localStorageToken: localStorage.getItem('firebaseToken')?.substring(0, 50) + '...'
          });
        } else {
          setTokenInfo({
            hasToken: false,
            error: 'No Firebase user found'
          });
        }
      } catch (error) {
        setTokenInfo({
          hasToken: false,
          error: error.message
        });
      }
    };

    checkToken();
  }, [currentUser]);

  if (!tokenInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="collapse collapse-arrow bg-gray-200 shadow-xl w-96">
        <input type="checkbox" /> 
        <div className="collapse-title text-xl font-medium">
          🔐 Token Debug Info
        </div>
        <div className="collapse-content"> 
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Has Token:</span>
              <span className={tokenInfo.hasToken ? 'text-success' : 'text-error'}>
                {tokenInfo.hasToken ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            
            {tokenInfo.hasToken && (
              <>
                <div className="flex justify-between">
                  <span className="font-semibold">Token Length:</span>
                  <span>{tokenInfo.tokenLength} chars</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold">Email:</span>
                  <span className="text-xs">{tokenInfo.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold">UID:</span>
                  <span className="text-xs">{tokenInfo.uid}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold">Role:</span>
                  <span className="badge badge-primary badge-sm">
                    {tokenInfo.claims?.role || 'user'}
                  </span>
                </div>
                
                <div className="divider my-2"></div>
                
                <div>
                  <span className="font-semibold">Expires At:</span>
                  <p className="text-xs">{tokenInfo.expirationTime}</p>
                </div>
                
                <div>
                  <span className="font-semibold">Issued At:</span>
                  <p className="text-xs">{tokenInfo.issuedAtTime}</p>
                </div>
                
                <div className="divider my-2"></div>
                
                <div>
                  <span className="font-semibold">LocalStorage Token:</span>
                  <p className="text-xs break-all">{tokenInfo.localStorageToken}</p>
                </div>
              </>
            )}
            
            {tokenInfo.error && (
              <div className="alert alert-error">
                <span className="text-xs">{tokenInfo.error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDebugger;