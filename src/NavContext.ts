import React from 'react';

export type NavContex = { push: (url: string) => void };

export const NavContex = React.createContext<NavContex>({
  push: () => {}
});
