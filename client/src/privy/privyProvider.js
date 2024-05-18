"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "./config";

const CustomPrivyProvider = ({ children }) => {
  return <PrivyProvider {...privyConfig

  }>{children}</PrivyProvider>;
};

export default CustomPrivyProvider;
