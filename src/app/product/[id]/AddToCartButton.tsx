"use client";

import { useState, useTransition } from "react";

interface AddToCartButtonProps {
    productID: string
    incrementProductQuantity: (productID: string) => Promise<void>
}

const AddToCartButton = ({ productID,incrementProductQuantity }: AddToCartButtonProps) => {
    const [isPending, startTransaction] = useTransition()
    const [success, setSuccess] = useState(false)
  
  return (
    <div className="flex items-center gap-2">
        <button 
        className="btn btn-primary"
        onClick={() => {
          setSuccess(false)
          startTransaction(async () => {
            await incrementProductQuantity(productID)
            setSuccess(true)
          })
        }}
        >
            Add to Cart
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
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
        </button>
      {isPending && <span className="loading loading-spinner loading-md"/>}
      {!isPending && success && (
          <span className="text-success">Added to cart!</span>
        )}
    </div>
  )
}

export default AddToCartButton