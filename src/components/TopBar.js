import * as React from 'react';

// MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const BarItem = styled(Card) ({
    backgroundColor: '#F5F5F5',
    borderRadius: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3em'
});

function TopBar(props) {
    {/* props:
        connection: true, false
        status: loading, error, empty
        userAddress: wallet address of user
        contractAddress: address of app contract
        connectWallet(): handles metamask connection
    */}

    return (
        <AppBar position='static' color='transparent' style={{ boxShadow: 'none' }}>
            <Box sx={{ margin: '1em'}}>
                <Grid container justifyContent="space-between" spacing={3}>
                    <Grid item xs={2}>
                        <BarItem>
                            {/* App title badge */}
                            <CardContent sx={{ padding: 0, margin: 'auto' }}>
                                <Typography>-LOGONAME-</Typography>
                            </CardContent>
                            <p></p>
                        </BarItem>
                    </Grid>
                    <Grid item xs={4.5}>
                        <BarItem>
                            {/* Status bar */}
                            <CardContent sx={{ padding: 0, margin: 'auto' }}>
                                <Typography>{ (props.status != '') ? props.status : props.contractAddress }</Typography>
                            </CardContent>
                            <p></p>
                        </BarItem>
                    </Grid>
                    <Grid item xs={2}>
                        <BarItem>
                            {/* Connect button */}
                            <CardContent sx={{ padding: 0, margin: 'auto' }}>
                                <Typography>{ (props.connection == true) ? props.userAddress.substr(0, 11) + '...' : 'Connect' }</Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton aria-label="Connect" onClick={ props.connectWallet } color={ (props.connection == true) ? 'success' : 'default' }>
                                    <PowerSettingsNewIcon sx={{ fontSize: 20 }}/>
                                </IconButton>
                            </CardActions>
                        </BarItem>
                    </Grid>
                </Grid>
            </Box>
        </AppBar>
    );
};

export default TopBar;