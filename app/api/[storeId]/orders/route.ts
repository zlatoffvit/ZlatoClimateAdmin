import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

import prismadb from "@/lib/prismadb";
import { Make, Product } from "@prisma/client";
import { corsHeaders, UsdFormatter } from "@/lib/utils";


interface CartItem extends Product {
  quantity: string
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;
  try {
    if (!storeId) {
      return new NextResponse("ID магазина оюязательно", { status: 400 });
    } 
    const { cartItems, totalPrice, name, email, phone, address } = await req.json();
    
    if (!cartItems) {
      return new NextResponse("Необходимо выбрать хотя-бы один продукт", { status: 400 });
    }

    if (cartItems.length === 0) {
      return new NextResponse("Необходимо выбрать хотя-бы один продукт", { status: 400 });
    }

    if (!totalPrice) {
      return new NextResponse("Необходимо выбрать хотя-бы один продукт", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Имя обязательно", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Телефон обязателен", { status: 400 });
    }

    const order = await prismadb.order.create({
      data: {
        storeId: storeId,
        isPaid: false,
        name,
        totalPrice,
        phone,
        email,
        address,
        orderItems: {
          create: cartItems.map((cartItem: CartItem) => ({
            product: {
              connect: {
                id: cartItem.id
              }
            },
            quantity: Number(cartItem.quantity)
          }))
        }
      }
    });

    NextResponse.json(order);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const sendEmail = async (to: string, subject: string, text: string) => {
      const message = {
        to,
        from: 'zlatov.vit@gmail.com',
        bcc: 'zlatov.vit@gmail.com',
        subject,
        text,        
      };
    
      try {
        await sgMail.send(message);
      } catch(err) {
        console.error(`Error sending email: ${err}`);
      }
    }
    
    const productDetails = cartItems.map((
      { name, quantity, price, make }: 
      {name: string, quantity: number, price: string, make: Make}
      ) => {
      return (
          `Продукт: ${name} ${make.name}
          Количество: ${quantity}
          Цена за единицу товара: ${UsdFormatter.format(Number(price))}
          Всего за товар: ${UsdFormatter.format(quantity * Number(price))}
          `
      )
    });

    // const orderPrice = cartItems.reduce((total: number, item: CartItem) => {
    //   return total + (Number(item.price) * Number(item.quantity))
    // }, 0 );

    const textMessage = `
        Привет,
    
        Спасибо за ваш заказ. Мы рады сообщить, что ваш заказ успешно получен и один из наших сотрудников свяжется с вами.

        Детали вашего заказа приведены ниже:
    
        Товары:
        
        ${productDetails}
    
        Всего вместе: ${totalPrice}.
    
        Еслт у вас есть вопросы или пожелания, пожалуйста свяжитесь с нами по электронной почте или по телефону, указанные на нашем веб-сайте.

        Спасибо, что выбрали наш магазин.

        С уважением,
        Команда магазина.
    `;
    sendEmail(email, 'Подтверждение заказа', textMessage);
  
    return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL}/cart?success=1` }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('ORDER_POST', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;
  
  try {  
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log('ORDERS_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}