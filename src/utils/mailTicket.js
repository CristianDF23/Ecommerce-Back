export const mailTicket = (obj, products) => {

    let product = products.map(product => {
        return (
            `           
                <tr>
                    <td class="product-info">
                        <img src=${product.product.thumbnails.one} alt="">
                    </td>
                    <td>
                        <p><strong>${product.product.title}</strong></p>
                    </td>
                    <td>${product.quantity}</td>
                    <td class="price">$ ${product.product.price.toLocaleString('es-AR')}</td>
                    <hr/>
                </tr>
            `
        )
    })

    return (
        `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de compra</title>
    <style>
    body {
        font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
        background-color: #FAFAFA;
        color: #333333;
        padding: 0;
        margin: 0;
    }

    .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #FFFFFF;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
        text-align: center;
        background-color: #000000;
        padding: 10px;
        border-radius: 8px 8px 0 0;
    }

    .header h1 {
        text-align: center;
        margin: 0;
        font-size: 28px;
        color: #FFFFFF;
    }

    .content h2 {
        text-align: center;
        font-size: 30px;
        margin: 20px 0;
    }

    .content h3 {
        text-align: center;
        font-size: 24px;
        margin: 20px 0;
    }

    table {
        width: 100%;
        text-align: center;
    }

    table img {
        width: 100px;
    }

    .content p {
        font-size: 14px;
        line-height: 1.5;
    }

    .detail {
        width: 600px;
        border-top: 1px solid #838383;
        
    }

    .detail div{
        padding-left: 30px;
        border-bottom: 1px solid #838383;
    }


    .footer {
        text-align: center;
        font-size: 14px;
        margin-top: 20px;
    }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>CSport</h1>
        </div>
        <div class="content">
            <h2>Gracias por tu compra</h2>
            <h3>Se generó el pedido N° ${obj.codeTicket}</h3>
            <table>
                <tr>
                    <th></th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
                ${product}
            </table>
            <div class="detail">
                <div>
                    <p><strong>Subtotal:</strong> $ ${obj.detailPay.subTotal.toLocaleString('es-AR')}</p>
                    <p><strong>Envío:</strong> ${obj.detailPay.entrega == 'Gratis' ? obj.detailPay.entrega : `$ ${obj.detailPay.entrega.toLocaleString('es-AR')}`}</p>
                    <p><strong>IVA:</strong> $ ${obj.detailPay.iva.toLocaleString('es-AR')}</p>
                    <p><strong>Total:</strong> $ ${obj.detailPay.total.toLocaleString('es-AR')}</p>
                </div>
                <div>
                    <p><strong>Nombre:</strong> ${obj.shippingDetail.name}</p>
                    <p><strong>Dirección:</strong> ${obj.shippingDetail.address}</p>
                    <p><strong>Localidad:</strong> ${obj.shippingDetail.city}</p>
                    <p><strong>Provincia:</strong> ${obj.shippingDetail.state}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>CSport &copy; 2024</p>
        </div>
    </div>

</body>

</html>
`
    )
}
