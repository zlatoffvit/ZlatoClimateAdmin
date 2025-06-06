import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

import prismadb from "@/lib/prismadb";
import { corsHeaders } from "@/lib/utils";


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
      return new NextResponse("ID магазина обязательно", { status: 400 });
    } 
    const { name, email, phone, query, pathname } = await req.json();

    if (!name) {
      return new NextResponse("Имя обязательно", { status: 400 });
    }

    if (!phone) {
      return new NextResponse("Телефон обязателен", { status: 400 });
    }

    if (!query) {
      return new NextResponse("Отсутствует запрос", { status: 400 });
    }

    const message = await prismadb.message.create({
      data: {
        storeId: storeId,
        name,
        phone,
        email,
        query
      }
    });

    NextResponse.json(message);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const sendEmail = async (to: string, subject: string, text: string) => {
      const msg = {
        to,
        from: 'zlatov.vit@gmail.com',
        bcc: 'zlatov.vit@gmail.com',
        subject,
        text,        
      };
    
      try {
        await sgMail.send(msg);
      } catch(err) {
        console.error(`Ошибка в отправке письма: ${err}`);
      }
    }
    

    const textMessage = `
        Привет,

        Спасибо за ваш запрос. Один из наших сотрудников свяжется с вами.
        
        Спасибо, что выбрали наш магазин.

        С уважением,
        Команда магазина.
    `;
    sendEmail(email, 'Подтверждение запроса', textMessage);
  
    return NextResponse.json({ url: `${process.env.FRONTEND_STORE_URL+pathname}?success=1` }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log('MESSAGE_POST', error);
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
      return new NextResponse("ID магазина обязательно", { status: 400 });
    }

    const messages = await prismadb.message.findMany({
      where: {
        storeId: storeId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.log('MESSAGES_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}