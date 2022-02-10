import React from 'react';

// MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function AddItemForm(props) {
    {/* props:
        newItemOpen: newItem=true
        newItemClose: newItem=false
        newItem: true/false for pop up form
        handleformsubmit: updates parent states for new item with form values

        newItemName, newItemDescription, newItemSupply, newItemPrice
    */}

    const [itemName, setItemName] = React.useState('');
    const [itemDescription, setItemDescription] = React.useState('');
    const [itemSupply, setItemSupply] = React.useState(0);
    const [itemPrice, setItemPrice] = React.useState(0);

    return (
        <Dialog open={props.newItem} onClose={props.newItemClose}>
            <DialogTitle>Create new listing</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter item details into the form below to list a new item for sale.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Product name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setItemName(e.target.value)
                    }}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setItemDescription(e.target.value)
                    }}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Quantity"
                    type="number"
                    min="1"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setItemSupply(e.target.value)
                    }}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Price"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setItemPrice(e.target.value)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.newItemClose}>Cancel</Button>
                <Button onClick={() => props.handleFormSubmit(itemName, itemDescription, itemSupply, itemPrice)}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddItemForm;