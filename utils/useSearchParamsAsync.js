import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function useSearchParamsAsync() {
  const [searchParams, setSearchParams] = useState(useSearchParams());
  useEffect(() => {
    const loadSearchParams = async () => {
      const params = useSearchParams();
      setSearchParams(params);
    };
    loadSearchParams();
  }, []);
  return searchParams;
};