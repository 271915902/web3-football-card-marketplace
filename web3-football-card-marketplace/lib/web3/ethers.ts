import { ethers } from 'ethers'

// 检查是否安装了MetaMask
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

// 连接MetaMask钱包
export const connectMetaMask = async (): Promise<{
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
  error: string | null
}> => {
  try {
    if (!isMetaMaskInstalled()) {
      return {
        provider: null,
        signer: null,
        address: null,
        error: '请安装MetaMask钱包'
      }
    }

    // 请求连接钱包
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    
    // 创建provider和signer
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()

    return {
      provider,
      signer,
      address,
      error: null
    }
  } catch (error: any) {
    console.error('连接钱包失败:', error)
    
    let errorMessage = '连接钱包失败'
    if (error.code === 4001) {
      errorMessage = '用户拒绝连接钱包'
    } else if (error.code === -32002) {
      errorMessage = '钱包连接请求已在处理中'
    }
    
    return {
      provider: null,
      signer: null,
      address: null,
      error: errorMessage
    }
  }
}

// 获取账户余额
export const getBalance = async (provider: ethers.BrowserProvider, address: string): Promise<string> => {
  try {
    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
  } catch (error) {
    console.error('获取余额失败:', error)
    return '0'
  }
}

// 监听账户变化
export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback)
  }
}

// 监听网络变化
export const onChainChanged = (callback: (chainId: string) => void) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback)
  }
}

// 移除事件监听
export const removeAllListeners = () => {
  if (isMetaMaskInstalled()) {
    window.ethereum.removeAllListeners('accountsChanged')
    window.ethereum.removeAllListeners('chainChanged')
  }
}