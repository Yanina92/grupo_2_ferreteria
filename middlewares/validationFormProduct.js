const { check } = require('express-validator');
const path = require('path');

const validationFormProduct = [
  check('name').notEmpty().withMessage('Tenes que completar el campo de Nombre').bail()
  .isLength({ min: 5}).withMessage('El nombre debe tener como mínimo 5 caracteres'),

  check('description').notEmpty().withMessage('Tenes que completar el campo de la descripcion').bail()
  .isLength({ min: 20}).withMessage('La descripcion debe tener como mínimo 20 caracteres'),

  check('id_category').notEmpty().withMessage('Tenes que completar el campo del id de la categoria').bail()
  .isInt().withMessage('el id de la categoria debe ser un número entero'),

  check('id_brand').notEmpty().withMessage('Tenes que completar el campo del id de la marca').bail()
  .isInt().withMessage('el id de la marca debe ser un número entero'),

  check('price').notEmpty().withMessage('Tenes que completar el campo Precio').bail()
  .isNumeric().withMessage('Tenes que completar el campo Precio expresado en numeros'),

  check('stock').notEmpty().withMessage('Tenes que completar el campo Stock').bail()
  .isInt().withMessage('el stock debe ser un número entero'),

  check('offer').notEmpty().withMessage('Debes indicar si el producto está o no en oferta'),

  check('image').custom((value,{req}) => {
    let file = req.file;
    let accepptedExtensions = ['.jpg','.gif','.png','.jpeg'];
    if (!file){
        throw new Error('Tienes que subir una imagen');
    }else{
        let fileExtension = path.extname(file.originalname);
        if (!accepptedExtensions.includes(fileExtension)) {
            throw new Error(`Las extensiones de archivo permitidas son ${accepptedExtensions.join(", ")}`);
        }
    }
    return true;
  })
];

module.exports = validationFormProduct;