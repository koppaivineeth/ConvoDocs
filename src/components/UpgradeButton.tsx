"use client"


import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { cashfreeCheckout, setOrderId, setOrderExpiry } from "@/lib/cashfree"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { useToast } from "./ui/use-toast"
import { cn } from "@/lib/utils"
import { useBillings } from "@/hooks/billings/use-billings"

const UpgradeButton = () => {
    const [showLoadingIcon, setShowLoadingIcon] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { toast } = useToast()
    const {
        status,
        error,
        createSubscriptionCheckoutSession,
        cancelSubscription,
        fetchSubscriptionStatus,
    } = useBillings();
    const createCashfreeOrder = async () => {
        const payload = {
            "order_id": "ORDERID_CD_" + Date.now(),
            "order_amount": "1",
            "order_currency": "INR",
            "customer_details": {
                "customer_id": "node_sdk_test",
                "customer_name": "",
                "customer_email": "example@gmail.com",
                "customer_phone": "9999999999"
            },
            "order_meta": {
                "return_url": `http://localhost:3000/billing`,
                "notify_url": 'https://webhook.site/068431ce-ab9d-46a8-a57a-eae93c99e357'
            },
            "order_note": ""
        }

        const response = await fetch('/convodocs/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-version': process.env.CASHFREE_VERSION!,
                'x-client-id': process.env.CASHFREE_ID!,
                'x-client-secret': process.env.CASHFREE_KEY!
            },
            body: JSON.stringify(payload)
        })
        return response
    }
    const handleClick = async () => {
        setShowLoadingIcon(true)

        const createCheckout = await createSubscriptionCheckoutSession("price_1RxM6FSKQeVZ6dstrK6DgNoL")

        console.log(createCheckout)
        // let orderDetails = await createCashfreeOrder()

        // if (!orderDetails.ok) {
        //     toast({
        //         title: "There was a problem ...",
        //         description: "Please try again in a moment",
        //         variant: "destructive"
        //     })
        //     setShowLoadingIcon(false)
        //     return
        // }
        // setIsOpen(true)
        // let orderDetailsText
        // let orderObject = {
        //     payment_session_id: "",
        //     order_id: "",
        //     order_expiry_time: ""
        // }
        // if (orderDetails && orderDetails.ok) {
        //     orderDetailsText = await orderDetails.text()
        //     orderObject = JSON.parse(orderDetailsText)

        //     let checkoutOptions = {
        //         paymentSessionId: orderObject.payment_session_id,
        //         redirectTarget: "payment_iframe"
        //     }
        //     cashfreeCheckout(checkoutOptions).then((result: { error: any; redirect: any; paymentDetails: { paymentMessage: any } }) => {
        //         if (result.error) {
        //             console.log("User has closed the popup or there is some payment error, Check for Payment Status");
        //             console.log(result.error);
        //         }
        //         if (result.redirect) {
        //             console.log("Payment will be redirected");
        //             setOrderId(orderObject.order_id)
        //             setOrderExpiry(orderObject.order_expiry_time)
        //         }
        //         if (result.paymentDetails) {
        //             console.log("Payment has been completed, Check for Payment Status");
        //             console.log(result.paymentDetails.paymentMessage);
        //             setOrderId(orderObject.order_id)
        //             setOrderExpiry(orderObject.order_expiry_time)
        //         }
        //     })
        // } else {
        //     setShowLoadingIcon(false)
        //     alert("Order failed")
        // }

    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(visible) => {
                if (!visible) {
                    setIsOpen(false)
                }
            }}
            >
                <DialogTrigger asChild>
                    <Button className={cn("w-full", {
                        "pointer-events-none": showLoadingIcon
                    })} onClick={() => handleClick()}>
                        {
                            showLoadingIcon ? (
                                <>Processing &nbsp; &nbsp; <Loader2 className="h-4 w-4 animate-spin" /></>
                            ) : (
                                <>Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" /></>
                            )
                        }
                    </Button>

                </DialogTrigger>
                <DialogContent className="h-full p-10"
                    onInteractOutside={(e) => e.preventDefault()}>
                    <div className="payment-iframe">
                        <iframe name="payment_iframe" className="h-full w-full"></iframe>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default UpgradeButton