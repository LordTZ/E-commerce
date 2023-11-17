"use server"

import prisma from "@/lib/db/db";
import { getCart, createCart } from "@/lib/db/cart";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(productID:string)  {
    const cart = (await getCart()) ?? (await createCart())

    const articleInCart = cart.items.find((item: any) => item.productID === productID)

    if (articleInCart) {
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: {
                    update: {
                        where: { id: articleInCart.id },
                        data: { quantity: {increment:1} },
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
                        quantity: 1,
                    },
                },
            },
        })
    }

    revalidatePath("/product/[id]")
}
