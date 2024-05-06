import { Button } from "./ui/button"
import { Input } from "./ui/input"

const ProductLaunchMessage = () => {
    return (
        <div>
            <h1>Get ready for greatness!</h1>

            <div>
                <span>
                    Join our mailing list to stay in the loop about our upcoming launch. Don&apos;t miss your chance to be part of the journey from the beginning.
                </span>
                <Input type="email" placeholder="Email address" />
                <Button>Sign up</Button>
                <span>
                    We will notify you as soon as the product is live!
                </span>
            </div>
        </div>
    )
}

export default ProductLaunchMessage
