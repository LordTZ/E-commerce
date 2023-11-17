"use server"

import { getCart, createCart } from "@/lib/db/cart";
import prisma from "@/lib/db/db";
import { revalidatePath } from "next/cache";

async function setProductQuantity( productID:string, quantity:number ) {
    const cart = (await getCart()) ?? (await createCart())

    const articleInCart = cart.items.find((item: any) => item.productID === productID)

    if (quantity === 0) {
        if (articleInCart) {
            await prisma.cart.update({
                where: { id: cart.id },
                data: { 
                    items: {
                        delete: { id: articleInCart.id },
                    },
                },
            })
        }
    } else {
        if (articleInCart) {
            await prisma.cart.update({
                where: { id: cart.id },
                data: { 
                    items: {
                        update: { 
                            where: { id: articleInCart.id },
                            data: { quantity },
                        },
                    },
                },
            })
        } else {
            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: {
                        create: {
                            productID,
                            quantity,
                        },
                    },
                },
            })
        }
    }

    revalidatePath('/cart')
}
export default setProductQuantity
