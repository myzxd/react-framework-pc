import { useRef } from 'react';
import { cryptoRandomString } from './index';

export const useNamespace = () => {
  const namespaceRef = useRef(null);
  if (namespaceRef.current === null) {
    namespaceRef.current = cryptoRandomString(16);
  }
  return namespaceRef.current;
};
