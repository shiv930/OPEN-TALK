import React, { useEffect } from 'react';
import { Provider, useDispatch, useStore } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import { logout, setCredentials, setInitialized } from '../features/auth/authSlice';
import userApi from '../api/user.api';

// TanStack Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Initializes authenticated session from backend cookie
 */
function SessionInitializer({ children }) {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    const handleUnauthorized = () => dispatch(logout());
    window.addEventListener('opentalk:unauthorized', handleUnauthorized);

    const checkSession = async () => {
      try {
        const res = await userApi.getMe();
        const userData = res.data?.data || res.data?.user || res.data;
        if (userData && typeof userData === 'object') {
          dispatch(setCredentials({ user: userData }));
        }
      } catch (err) {
        if (err.response?.status === 401 && !store.getState().auth.isInitialized) {
          dispatch(logout());
        }
      } finally {
        dispatch(setInitialized(true));
      }
    };

    checkSession();
    return () => window.removeEventListener('opentalk:unauthorized', handleUnauthorized);
  }, [dispatch]);

  return children;
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SessionInitializer>
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastStyle={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
              }}
            />
          </SessionInitializer>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
