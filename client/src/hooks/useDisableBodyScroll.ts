import { useEffect } from 'react';

export const useDisableBodyScroll = (open:boolean) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'initial';
    }
  }, [open]);
};