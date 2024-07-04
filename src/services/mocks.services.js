import {faker} from '@faker-js/faker/locale/es'

export const productsMocks = () =>{
    const product = {
        id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(8),
        status: true,
        stock: faker.number.int({min: 0, max: 30}),
        brand: faker.company.name(),
        title: faker.commerce.productName(),
        category: faker.commerce.department(),
        thumbnails: {
            one: faker.image.url(),
            two: faker.image.url(),
            three: faker.image.url(),
            four: faker.image.url()
        },
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({min: 100, max:30000})
    }
    return product
}