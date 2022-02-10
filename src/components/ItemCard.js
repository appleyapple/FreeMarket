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
                {/* <Typography gutterBottom variant="h10" component="div">
                    {props.newItemSeller}
                </Typography> */}
                <Typography variant="body2" color="text.secondary">
                    {props.newItemDescription}
                </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions>
            <Typography variant="body2" color="text.secondary">
                {props.newItemPrice} ETH, {props.newItemSupply} left
            </Typography>
            <Button size="small" color="primary" sx={{marginLeft: 'auto'}}>
                Buy
            </Button>
        </CardActions>
    </Card>
  );
}

export default ItemCard;