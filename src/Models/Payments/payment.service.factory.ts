import {IPayment} from "./interface/IPayment";
import {PaymentStripeService} from "./service/payment.stripe.service";

export class PaymentServiceFactory {
    private repositories: Map<string, IPayment>;

    constructor(
        private stripe: IPayment = new PaymentStripeService(),
    ) {
        this.repositories = new Map<string, IPayment>();
        this.repositories.set('stripe', this.stripe);
    }

    public getRepository(name: string): IPayment {
        const repository = this.repositories.get(name);
        if (!repository) throw new Error(`Repository ${name} not found`);
        return repository;
    }

}