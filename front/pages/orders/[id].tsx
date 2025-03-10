import NextLink from 'next/link';

import { Link, Box, Card, CardContent, Divider, Grid, Typography, Chip, Button, CardActionArea,CardMedia  } from '@mui/material';
import { GetServerSideProps } from 'next';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import {currency} from "../../utils"
import { useRouter } from 'next/router'
import {useState, useEffect} from "react"


const OrderPage =  ({date}) => {
    const router = useRouter()

    const [ordersP, setOrdersP]= useState([])
    const [idPaypal, setIdPaypal]= useState([])

    useEffect(()=>{
        async function fetchData(){
            try {
                const t= await fetch(`https://globalmarkets13.herokuapp.com/paypal/create-order`,{
                    method:"POST",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify({total:date.total})
                })
                const enviar= await t.json()
                setOrdersP(enviar.links[1].href)
                setIdPaypal(enviar.id)
                console.log("orders",enviar) 
                

            } catch (err) {
                console.log(err);
            }
            
        }
        fetchData();
    },[])

    const handleSubmit= async (e:any)=>{
        try{ 
            click=true
            console.log("click", click)

            const p= await fetch(`https://globalmarkets13.herokuapp.com/orders/${date._id}`,{
                method:"PUT",
                headers:{
                    "Content-type":"application/json"
                },
                     body:JSON.stringify({paypalId:idPaypal})

            })
            const pId= await p.json()
            console.log("pdi",pId)

        }
        catch (err){console.log(err)}
    }

    const p= date.isPaid
    var click= new Boolean(false)
  return (
       

    <ShopLayout title={`Resumen de la orden ${date._id}`} pageDescription={`Resumen de la orden ${date._id}`}>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
            <>
        {
            date.orderItems.map( product => (
                <Grid container spacing={2} key={ product.id? product.id : product.slug } sx={{ mb:1 }}>
                    <Grid item xs={3}>
                        {/* TODO: llevar a la página del producto */}
                        <NextLink href={`/product/${ product.id}`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={  product.image[0]}
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                            
                            
                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'>{ `$${ product.price }` }</Typography>
                        
                       
                    </Grid>
                </Grid>
            ))  
        }
    </>
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>{`Cantidad de productos: ${date.numberOfItems}`}</Typography>
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NextLink href={`editId/${date._id}`} passHref>
                                <Button>
                                <Link underline='always'>
                                    Editar
                                </Link>
                                </Button>
                            </NextLink>
                        </Box>

                        
                        <Typography>Nombre: {`${date.shippingAddress.firstName}`}</Typography>
                        <Typography>Apellido: {`${date.shippingAddress.lastName}`}</Typography>
                        <Typography>Calle: {`${date.shippingAddress.address}`}</Typography>
                        <Typography>Ciudad: {`${date.shippingAddress.city}`}</Typography>
                        <Typography>Pais: {`${date.shippingAddress.country}`}</Typography>
                     

                        <Divider sx={{ my:1 }} />

                       

                        <Grid container>
        
                    <Grid item xs={6}>
                        <Typography>No. Productos:{`${date.numberOfItems}`} </Typography>
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent='end'>
                        <Typography>{date.numberOfItems} { date.numberOfItems > 1 ? 'productos': 'producto' }</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>SubTotal: {`${date.subTotal}`} </Typography>
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent='end'>
                        <Typography>{ currency.format(date.subTotal) }</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>Impuestos (15%)</Typography>
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent='end'>
                        <Typography>{ currency.format(date.tax) }</Typography>
                    </Grid>

                    <Grid item xs={6} sx={{ mt:2 }}>
                        <Typography variant="subtitle1">Total:{`${date.total}`} </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                        <Typography variant="subtitle1">{ currency.format(date.total) }</Typography>
                    </Grid>

                </Grid>

                        <Box sx={{ mt: 3 }}>
                        <Button onClick={handleSubmit} disabled={p===true|| click===true}  color="secondary" className='circular-btn' fullWidth   >
                            <Link href={`${ordersP}`} >Pagar</Link>
                        </Button>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    </ShopLayout>)
}


export const getServerSideProps: GetServerSideProps= async({req,query})=>{
    console.log("query",query.id)
    const datos= await fetch(`https://globalmarkets13.herokuapp.com/orders/${query.id}`,{
        method:"GET",
        headers:{
            "Content-type":"application/json"
        },
        
    })
    const date= await datos.json()
    
    
    
    return {props:{date}}





}



export default OrderPage;