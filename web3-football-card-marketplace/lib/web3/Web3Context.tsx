'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import { connectMetaMask, onAccountsChanged, onChainChanged, removeAllListeners, getBalance } from './ethers'

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
  balance: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

interface Web3ProviderProps {
  children: ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)
    
    const result = await connectMetaMask()
    
    if (result.error) {
      setError(result.error)
    } else {
      setProvider(result.provider)
      setSigner(result.signer)
      setAddress(result.address)
      setIsConnected(true)
      
      // 获取余额
      if (result.provider && result.address) {
        const userBalance = await getBalance(result.provider, result.address)
        setBalance(userBalance)
      }
    }
    
    setIsConnecting(false)
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setBalance(null)
    setIsConnected(false)
    setError(null)
    removeAllListeners()
  }

  useEffect(() => {
    // 监听账户变化
    onAccountsChanged((accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== address) {
        // 账户切换，重新连接
        connectWallet()
      }
    })

    // 监听网络变化
    onChainChanged(() => {
      // 网络切换，重新连接
      if (isConnected) {
        connectWallet()
      }
    })

    return () => {
      removeAllListeners()
    }
  }, [address, isConnected])

  const value: Web3ContextType = {
    provider,
    signer,
    address,
    balance,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}