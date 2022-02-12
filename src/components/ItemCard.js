import * as React from 'react';

// MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';


function ItemCard(props) {
    {/* props:
        newItemName, newItemDescription, newItemSupply, newItemPrice, newItemSeller
        buyItem(name, seller, quantity)
    */}

  return (
    <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
            {/* <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
            /> */}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.newItemName}
                </Typography>
                <Typography gutterBottom noWrap variant="h10" color="text.secondary" component="div" sx={{display: 'block'}}>
                    {props.newItemSeller}
                </Typography>
                <Typography noWrap variant="body2" sx={{display: 'block', height: '5em'}}>
                    {props.newItemDescription}
                </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions>
            <Typography variant="body2" color="text.secondary" sx={{display: 'block'}}>
                {props.newItemPrice} ETH, {props.newItemSupply} left
            </Typography>
            <Button onClick={() => props.buyItem(props.newItemName, props.newItemSeller, props.newItemPrice, 1)} size="small" color="primary" sx={{marginLeft: 'auto'}}>
                Buy
            </Button>
        </CardActions>
    </Card>
  );
}

export default ItemCard;