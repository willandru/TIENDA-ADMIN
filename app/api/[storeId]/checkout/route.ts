// @/app/api/[storeId]/checkout/route.ts

import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import cors from 'cors';

// Define your PayPal client ID and secret
// Initialize PayPal environment and client
const clientId = "PAYPAL_CLIENT_ID";
const clientSecret = "PAYPAL_CLIENT_SECRET";
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const corsMiddleware = cors({
  origin: 'http://localhost:3001',  // Update the origin to match your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export const middleware = [
  corsMiddleware,
  // Add any other middleware you may need
];

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const postCorsHeaders = {
    ...corsHeaders, 'Access-Control-Allow-Origin': 'http://localhost:3001',  // Update with your frontend domain
    // Add any additional headers specific to your POST route if needed
  };

  const setCorsHeaders = {
    headers: postCorsHeaders,
  };

  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400, ...setCorsHeaders });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
        items: [
          // Your items here
        ]
      }
    ]
  });

  const response = await client.execute(request);
  const orderId = response.result.id;
  console.log(response);

  return NextResponse.json({ id: orderId }, setCorsHeaders);
}
