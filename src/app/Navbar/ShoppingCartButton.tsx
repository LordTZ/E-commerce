"use client"

import { ShoppingCart } from "@/lib/db/cart"
import formatPrice from "@/lib/format"
import Link from "next/link"

interface shoppingCartButtonProps {
    cart: ShoppingCart | null
}

const ShoppingCartButton = ({ cart }: shoppingCartButtonProps) => {

    const closeDropdown = () => {
        const elem = document.activeElement as HTMLElement;
        if (elem) {
            elem.blur();
        }
    }

  return (
    <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn-ghost btn-circle btn">
            <div className="indicator">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    className="h-5 w-5" 
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <span className="badge badge-sm indicator-item">
                    {cart?.size || 0}
                </span>
            </div>
        </label>
        <div 
        tabIndex={0}
        className="card dropdown-content card-compact mt-3 w-52 bg-base-100 shadow z-30"
        >
            <div className="card-body">
                <span className="text-lg font-bold">
                    {cart?.size || 0} Item 
                </span>
                <span className="text-info">
                    Subtotal: {formatPrice(cart?.subtotal || 0)}
                </span>
                <div className="card-actions">
                    <Link 
                    href="/cart" 
                    className="btn btn-primary btn-block"
                    onClick={closeDropdown}
                    >
                        View Cart
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShoppingCartButton