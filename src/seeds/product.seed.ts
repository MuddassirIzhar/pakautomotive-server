import { faker } from '@faker-js/faker'
import { Manager } from '../app-data-source'
import { Product } from '../entities/product.entity'

export const productSeed = async () => {

    // create role permissions
    const productRepository = Manager.getRepository(Product)
    
    // generate 30 fake items
    for (let i = 0; i< 30; i++){
        // use upsert instead of save
        await productRepository.upsert(
            {
                title: faker.lorem.words(2),
                description: faker.lorem.words(10),
                image: faker.image.url({ width: 200, height: 200 }),
                price: parseInt(faker.finance.amount({ min: 500, max: 1000, dec: 2 }))
            },
            // if name exists only update else insert
            ['title']
        )
    }
}
