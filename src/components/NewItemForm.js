import React from 'react';

// MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';

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
        .min(1)
        .max(999)
        .integer()
        .required('Quantity is required'),
    price: yup
        .string('Enter price in WEI')
        .matches(/^[0-9]\d*$/, 'Positive integers only')
        .required('Price is required')
})

function AddItemForm(props) {
    {/* props:
        newItemOpen: newItem=true
        newItemClose: newItem=false
        newItem: true/false for pop up form
        handleformsubmit: updates parent states for new item with form values

        newItemName, newItemDescription, newItemSupply, newItemPrice
    */}

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            name: '',
            description: '',
            supply: '',
            price: ''
        },
        onSubmit: (values) => {
            props.handleFormSubmit(values.name, values.description, values.supply, values.price);
            // console.log({values});
        }
    });

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
                        onChange={formik.handleChange}
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
                        onChange={formik.handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        variant="standard"
                        id="supply"
                        label="Quantity"
                        value={formik.values.supply}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="text"
                        pattern="[0-9]*"
                        variant="standard"
                        id="price"
                        label="Price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        InputProps={{startAdornment: <InputAdornment position='start'>WEI</InputAdornment>}}
                    />
                    <Grid container justifyContent='flex-end'>
                        <Grid item sx={{my: 1}}>
                            <Button type='submit' >Create</Button>
                            <Button onClick={props.newItemClose} >Cancel</Button>
                        </Grid>
                    </Grid>
                </form>

            </DialogContent>
        </Dialog>
    );
}

export default AddItemForm;