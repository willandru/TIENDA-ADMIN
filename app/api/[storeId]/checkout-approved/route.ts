// @/app/api/[storeId]/checkout-approved/route.ts


import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {

    const { productIds, data, orderDetails , quantity} = await req.json();

    if (!productIds || productIds.length === 0 || !data || !orderDetails ) {
        return new NextResponse("Product ids, Data, orderDetails, and myOrderID are required", { status: 400 });
      }
    
      const products = await prismadb.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });
    
    
    

  
      console.log("QUantity", quantity);
      
    // Log the data received from the frontend
    console.log('Data received from frontend:', data);
    //console.log('My ID:', myOrderID);
    console.log('Order Details received from frontend:', orderDetails);
  
    console.log('Products ID received :', productIds);
    const emailAdress = orderDetails?.payer?.email_address;
    const idOrder = orderDetails?.order?.id;
    const shippingAddress = orderDetails?.purchase_units[0]?.shipping?.address;
  
    const addressComponents = [
      shippingAddress?.address_line_1,
      shippingAddress?.admin_area_2,
      shippingAddress?.admin_area_1,
      shippingAddress?.postal_code,
      shippingAddress?.country_code,
    ];
  
    const addressString = addressComponents.filter((c: string | undefined) => c !== undefined).join(', ');
  
    console.log('The email:', emailAdress);
    console.log('The String adress:', addressString);
    console.log('Shipping Address:', shippingAddress);


    const order = await prismadb.order.create({
        data: {
          storeId: params.storeId,
          isPaid: true,
          address: addressString,
          phone: emailAdress || '',
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId
                }
              }
            }))
          }
        }
      });
    
     
      const orderID= order.id;
      console.log('DO WE HAVE IT?: ', orderID);
    

  
      return NextResponse.json({}, {
        headers: corsHeaders,
      });
      
  }
  
