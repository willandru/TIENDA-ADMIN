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
   

    const { data, orderDetails } = await req.json();
  
    if (!data || !orderDetails ) {
      return new NextResponse('Data, orderDetails, and myOrderID are required', { status: 400 });
    }
  
    // Log the data received from the frontend
    console.log('Data received from frontend:', data);
    //console.log('My ID:', myOrderID);
    console.log('Order Details received from frontend:', orderDetails);
  
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
  
    return NextResponse.json({}, {
      headers: corsHeaders,
    });
  }
  
