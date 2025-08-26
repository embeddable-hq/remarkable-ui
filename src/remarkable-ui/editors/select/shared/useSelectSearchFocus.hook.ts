import { useEffect } from 'react';

export const useSelectSearchFocus = (isOpen: boolean, searchFieldRef: React.RefObject<null>) => {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        (searchFieldRef.current as unknown as HTMLInputElement)?.focus();
      }, 100);
    }
  }, [isOpen, searchFieldRef]);
};
