import multer from 'multer'
import { __dirname } from '../path.js'


const thumbnails = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, `${__dirname}/public/img/products`)
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`)
        }
    }
)

export const imgProducts = multer({ storage: thumbnails })

const files = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            let folder = 'documents';
            if (file.fieldname === 'profile') {
                folder = 'profiles';
            } else if (file.fieldname === 'product') {
                folder = 'products';
            }
            cb(null, `${__dirname}/public/documents/${folder}`);
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        }
    }
)

export const documents = multer({ storage: files })
