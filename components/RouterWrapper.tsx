"use client"
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useRouterNavigate = () => {
  const router = useRouter();
  return (to: string) => {
    router.push(to);
  };
};

const RouterWrapper: React.FC = (children) => {
  useEffect(() => {
    (window as any).useNavigate = useRouterNavigate();
    return () => {
      delete (window as any).useNavigate;
    };
  }, []);

  return <>{children}</>;
};

export default RouterWrapper;