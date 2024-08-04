import React, { ReactNode, use, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material'
import { WarningAlert } from '../Alert/InfoAlert'

import Ethereum from '../../../public/images/chain/ethereum.png'

import ExternalLink from '../../../public/images/external-link-icon.svg'
import Verified from '../../../public/images/verified-icon.svg'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatWalletHash } from '../../helpers'
import { set } from 'lodash'
import { useComplianceCheck } from '../../hooks/keyring/hook'
import { AnnounceCard } from './AnnounceCard'
import { ConnectWalletCard } from './ConnectWalletCard'
import { VerifyAddressCard } from './VerifyAddressCard'
import { useCompliance } from '../../hooks/useCompliance'
import { useToast } from '../../contexts/ToastContext/hooks'
import { ComplianceOnboardingVendor } from '../../types'
import { useModal } from '@keyringnetwork/frontend-sdk'
import { useZkMe } from '../../hooks/zkme/hook'
import { useChainContext } from '../../contexts/ChainContext/hooks'
import { useQuadrata } from '../../hooks/quadrata/hook'
import { useCoinbaseEas } from '../../hooks/coinbaseEas/hook'

const CompliancePortal: React.FC = () => {
  const [step, setStep] = useState(1)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [verified, setVerified] = useState(false)

  const { chainId } = useChainContext()
  const { isNotCompliant, isLoading, isCompliant, onCheckCompliance } =
    useCompliance()
  const { showPendingToast, closeToast } = useToast()

  const [showQuadrata, setShowQuadrata] = useState(false)
  const [quadrataAccessToken, setQuadrataAccessToken] = useState<string>()
  const [quadrataWidget, setQuadrataWidget] = useState<ReactNode>()

  const handleConnectButton = () => {
    setStep(2)
  }

  const verifyAgain = () => {
    setVerified(false)
  }

  const logout = () => {
    disconnect()
    setStep(1)
  }

  useEffect(() => {
    if (address && isConnected) {
      setStep(3)
    }

    if (isConnected && isCompliant) {
      setVerified(true)
    } else {
      setVerified(false)
    }

    if (isLoading && isNotCompliant) {
      showPendingToast(undefined, 'Compliance check in progress')
    }

    if (!isLoading) {
      closeToast()
    }
  }, [chainId, address, isConnected, isLoading])

  const onQuadrataClose = () => {
    console.log('Quadrata KYB widget closed')
    setShowQuadrata(false)
    setQuadrataAccessToken(undefined)
    setQuadrataWidget(undefined)
  }

  const { openModal: openKeyringModal } = useModal()
  const { launchWidget: launchZKmeWidget } = useZkMe(address, chainId)
  const { getAccessToken, createQuadrataWidget } = useQuadrata(
    address,
    chainId,
    onQuadrataClose
  )

  const { launchEas } = useCoinbaseEas()

  const onVerify = async (vendor: ComplianceOnboardingVendor) => {
    switch (vendor) {
      case ComplianceOnboardingVendor.KEYRING:
        openKeyringModal()
        break
      case ComplianceOnboardingVendor.ZKME:
        await launchZKmeWidget()
        break
      case ComplianceOnboardingVendor.QUADRATA:
        const accessToken = await getAccessToken()
        setQuadrataAccessToken(accessToken)
        setQuadrataWidget(createQuadrataWidget(accessToken, chainId))
        setShowQuadrata(true)
        break
      case ComplianceOnboardingVendor.COINBASE_EAS:
        launchEas()
        break
      default:
        return
    }

    onCheckCompliance()
  }

  const complianceRender = () => {
    switch (step) {
      case 1:
        return <AnnounceCard onClick={handleConnectButton} />
      case 2:
        return <ConnectWalletCard />
      case 3:
        return (
          <VerifyAddressCard
            logout={logout}
            verifyAgain={verifyAgain}
            verified={verified}
            onVerify={onVerify}
          />
        )
      default:
        break
    }
  }
  return (
    <StyledBox>
      <Typography
        fontSize='52px'
        lineHeight='64px'
        fontWeight='700'
        letterSpacing='-1.5%'
        textAlign='center'
      >
        Compliance Portal
      </Typography>
      {complianceRender()}

      {showQuadrata && quadrataAccessToken && quadrataWidget && (
        <>{quadrataWidget}</>
      )}
    </StyledBox>
  )
}

export default CompliancePortal

export const StyledBox = styled(Box)(({ theme }) => {
  return {
    boxShadow: 'none',
    width: '100%',
    minHeight: '265px',
    color: 'white',
    zIndex: 10,
    // background: theme.palette.secondary.main,
  }
})

export const ContentBox = styled(Box)(() => {
  return {
    width: '100%',
    backgroundColor: '#17181C',
    textAlign: 'center',
    padding: '32px',
    border: '1px solid #576e63',
    borderRadius: '12px',
    margin: '24px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
})

const WalletBox = styled(Box)(() => {
  return {
    width: '100%',
    maxWidth: '720px',
    backgroundColor: '#17181C',
    padding: '32px',
    border: '1px solid #576e63',
    borderRadius: '12px',
    margin: '24px auto',

    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  }
})

export const StyledCard = styled(Card)(() => {
  return {
    width: '100%',
    border: '1px solid #D1DFD9',
    borderRadius: '8px',
    padding: '16px',

    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }
})

export const StyledComplianceChip = styled(Chip)(() => {
  return {
    height: '25px',
    backgroundColor: '#E4FBE9',
    borderRadius: '5250.731px',
    border: '0.525px solid #77ED91',
    padding: '6px 0px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
  }
})