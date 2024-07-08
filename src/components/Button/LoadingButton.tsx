import React, { useState } from 'react'
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material'
import { WalletDialog } from '../Dialog'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAccount } from 'wagmi';
import { useCompliance } from '../../hooks/useCompliance';
import { ComplianceOnboardingButton } from './ComplianceOnboardingButton';

export interface LoadingButtonProps {
  loading: boolean
  disabled: boolean
  title: string
  onClick?: () => void
}

export interface LoadingExtButtonProps extends LoadingButtonProps {
}

export const LoadingExtButton: React.FC<LoadingExtButtonProps> = ({
  loading,
  disabled,
  title,
  onClick,
}) => {

  const { isConnected } = useAccount()
  const { isNotCompliant, isLoading } = useCompliance()

  return (
    <>
      {isConnected && isNotCompliant ? (
        <ComplianceOnboardingButton
          loading={loading || isLoading}
          disabled={disabled}
          title={title}
          onClick={onClick}
        />
      ) : (
        <LoadingButton
          loading={loading || isLoading}
          disabled={disabled}
          title={title}
          onClick={onClick}
        />
      )}
    </>
  )
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  disabled,
  title,
  onClick,
}) => {

  const [openWalletDialog, setOpenWalletDialog] = useState(false)
  const { isConnected } = useAccount()

  return (
    <>
      {isConnected ? (
        <Button
          type="submit"
          onClick={onClick}
          variant="contained"
          disableRipple
          disabled={disabled}
          sx={{
            textTransform: 'none',
            width: '100%',
            // margin: '15px 0',
            height: '60px',
            padding: '12px, 20px',
            justifyContent: 'center',
            borderRadius: '9999px',
            gap: 2,
          }}
        >
          <Stack direction={'row'} spacing={1}>
            <Stack
              alignItems={'center'}
              justifyContent={'center'}
              direction={'row'}
            >
              {loading && (
                <CircularProgress
                  size={'24px'}
                  sx={{
                    marginRight: '10px',
                    color: '#1D5A2B',
                  }}
                />
              )}
            </Stack>{' '}
            <Typography
              sx={{
                color: '#000',
                textAlign: 'center',
                fontSize: '17px',
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: '22px',
                letterSpacing: '-0.07px',
              }}
            >
              {loading ? 'Loading' : title}
            </Typography>
            {!loading && (
              <Box
                component={'div'}
                sx={{
                  width: '20.9px',
                  height: '20.9px',
                  flexShrink: '0',
                }}
              >
                <ArrowForwardIcon
                  sx={{
                    color: '#000',
                    width: '20.9px',
                    height: '20.9px',
                  }}
                />
              </Box>
            )}
          </Stack>
        </Button>) : (
        <>
          <Button
            type="submit"
            onClick={() => { setOpenWalletDialog(true) }}
            variant="contained"
            disableRipple
            sx={{
              textTransform: 'none',
              width: '100%',
              height: '60px',
              padding: '12px, 20px',
              justifyContent: 'center',
              borderRadius: '9999px',
              gap: 2,
            }}
          >
            <Stack direction={'row'} spacing={1}>
              <Typography
                sx={{
                  color: '#000',
                  textAlign: 'center',
                  fontSize: '17px',
                  fontStyle: 'normal',
                  fontWeight: '700',
                  lineHeight: '22px',
                  letterSpacing: '-0.07px',
                }}
              >
                Connect Wallet
              </Typography>
            </Stack>
          </Button>
          {!isConnected && (<WalletDialog
            open={openWalletDialog}
            onClose={() => { setOpenWalletDialog(false) }}
          />)}
        </>
      )}
    </>
  )
}
