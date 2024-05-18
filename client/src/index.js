import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Boxes } from './components/ui/background-boxes';
import { PrivyProvider } from "@privy-io/react-auth";
import * as buffer from "buffer";
import { Toaster } from 'sonner';
import IncoBg from './assets/incoBg.jpg'
window.Buffer = buffer.Buffer;

const redStone = {
  id: 17001,
  network: "Red Stone Network",
  name: "RED",
  nativeCurrency: {
    name: "RED",
    symbol: "RED",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.holesky.redstone.xyz/"],
    },
    public: {
      http: ["https://rpc.holesky.redstone.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.holesky.redstone.xyz/",
    },
  },
};

// eslint-disable-next-line 
const handleLogin = (user) => {
  console.log(`User ${user.id} logged in!`);
};

//eruda.init();


let loginMethods = ['email', 'wallet', 'google', 'apple', 'farcaster'];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <PrivyProvider
      appId="cltn4pfm807ld12sf83bqr3iy"
      config={{
        // Display email and wallet as login methods
        loginMethods: ['email', 'wallet', 'google', 'apple', 'farcaster'],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
        },
        supportedChains: [
          redStone
        ],

        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <Toaster />
      <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center justify-centerg">
        <div className="" />
        {/* <Boxes /> */}
        <img src={IncoBg} className='h-screen w-screen absolute inset-0 ' />
        <div className='z-50 md:p-0 px-4 relative'>
          <App />
        </div>

      </div>
    </PrivyProvider>
  </React.StrictMode>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
