import React from 'react';

// MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// formik/yup form validation
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    name: yup
        .string('Enter name')
        // .min(20)
        .required('Name is required'),
    description: yup
        .string('Enter description')
        .max(200)
        .required('Description is required'),
    supply: yup
        .number('Enter a positive integer')
        .positive()
        .max(99)
        .integer()
        .required('Quantity is required'),
    price: yup
        .number('Enter price in ETH')
        // .min(0.000000000000000001)
        .required('Price is required'),
    
})


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

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            name: '',
            description: '',
            supply: 0,
            price: 0
        },
        onSubmit: (values) => {
            props.handleFormSubmit(values.name, values.description, values.supply, values.price);
            console.log({values});
        }
    });

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setItemName(e.target.value);
    //     setItemDescription(e.target.value);
    //     setItemSupply(e.target.value);
    //     setItemPrice(e.target.value);
    // }

    return (
        <Dialog open={props.newItem} onClose={props.newItemClose}>
            <DialogTitle>Create new listing</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter item details into the form below to list a new item for sale.
                </DialogContentText>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        type="text"
                        variant="standard"
                        id="name"
                        name="name"
                        label="Product name"
                        value={formik.values.name}
                        onChange={
                            // (e) => { setItemName(e.target.value) }
                            formik.handleChange
                        }
                        error={formik.touched.name && Boolean(formik.errors.name)}

                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="text"
                        variant="standard"
                        id="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={
                            // (e) => { setItemName(e.target.value) }
                            formik.handleChange
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        variant="standard"
                        id="supply"
                        label="Quantity"
                        value={formik.values.supply}
                        onChange={
                            // (e) => { setItemName(e.target.value) }
                            formik.handleChange
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        variant="standard"
                        id="price"
                        label="Price"
                        value={formik.values.price}
                        onChange={
                            // (e) => { setItemName(e.target.value) }
                            formik.handleChange
                        }
                    />
                    <Button type='submit'>Create</Button>

                </form>

            </DialogContent>
            <DialogActions>
                <Button onClick={props.newItemClose}>Cancel</Button>
                {/* <Button onClick={(e) => props.handleFormSubmit(itemName, itemDescription, itemSupply, itemPrice)}>Create</Button> */}
            </DialogActions>            
        </Dialog>
    );
}

export default AddItemForm;