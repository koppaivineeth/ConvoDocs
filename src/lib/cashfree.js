import globals from '@/lib/utils'

const cashfree = Cashfree({
	mode: "sandbox" //or production
});

export function cashfreeCheckout(checkoutOptions) {
	return cashfree.checkout(checkoutOptions)
}

export function setOrderId(id) {
	globals.cashfreeOrderId = id
}

export function getOrderId() {
	return globals.cashfreeOrderId
}

export function setOrderExpiry(date) {
	globals.orderExpiry = date
}

export function getOrderExpiry() {
	return moment(globals.orderExpiry).format("DD/MMM/YYYY")
}

export async function getOrderDetails() {
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			'x-api-version': '2023-08-01',
			'x-client-id': '239525f590fb717e8444475650525932',
			'x-client-secret': 'cb71a7077ce9aac9bf81a4ba098390b5016cbcca'
		}
	};
	const url = `/convodocs/orders/${getOrderId()}`
	const orderDetails = await fetch(url, options)

	return orderDetails
}