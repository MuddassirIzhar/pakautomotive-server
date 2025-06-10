import { faker } from '@faker-js/faker';
import { Order } from '../entities/order.entity';
import { randomInt } from 'crypto';
import { OrderItem } from '../entities/order-item.entity';
import { Manager } from '../app-data-source';

export const orderSeed = async () => {
    
    const orderRepository = Manager.getRepository(Order)
    const orderItemsRepository = Manager.getRepository(OrderItem)
    
    // generate 30 fake orders
    for (let i = 0; i< 30; i++){

        const order = await orderRepository.save(
            {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                total: parseInt(faker.finance.amount({ min: 500, max: 1000, dec: 2 })),
                created_at: faker.date.recent({ days: 10, refDate: '2023-06-10T00:00:00.000Z' })
            }
        );
        console.log(order)
        // add number of items in order
        for(let j = 0; j < randomInt(1,5); j++) {
            await orderItemsRepository.save(
                {
                    product_title: faker.lorem.words(2),
                    price: parseInt(faker.finance.amount({ min: 500, max: 1000, dec: 2 })),
                    quantity: parseInt(faker.finance.amount({ min: 1, max: 5, dec: 0 })),
                    order: order
                }
            )
        }
    }
}