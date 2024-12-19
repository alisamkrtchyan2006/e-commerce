const express = require("express")
const app = express()

const PORT = 3001

app.use(express.json())

const users = []
const products = []
const orders = []



// users

const isValidEmail = (email) => {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegexp.test(email)
}


app.post('/users/register', (req,res) => {
    const {username, email, password, is_admin=false} = req.body

    if(!username || username.length < 3) {
        return res.status(400).json({error:'Username must be at least 3 characters long.'})
    }

    if(!email || !isValidEmail(email)) {
        return res.status(400).json({error:'Invalid email format'})
    }

    if(users.some((user) => user.email === email)) {
        return res.status(400).json({error:'Email already exists.' })
    }

    if(!password || password.length < 6) {
        return res.status(400).json({error:'Password must be at least 6 characters long.'})
    } 


    const newUser = {username, email, is_admin}
    users.push({...newUser, password})

    return res.status(201).json(newUser)
})




app.post('/users/login', (req,res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({error:'Email or password are required'})
    }

    const user = users.find((user) => user.email === email)

    if(!user) {
        return res.status(404),json({error:'User not found'})
    }

    if(user.password !== password) {
        return res.status(401).json({error:'Wrong credentials!'})
    }


    return res.status(200).json({message:'Login successful'})
})







// products

app.post('/products', (req, res) => {
    const { name, description, price, category, image_url, is_active = true } = req.body
  

    if (!name || name.trim().length < 1) {
      return res.status(400).json({ error: 'Product name is required and must be at least 1 character long.' })
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Price must be a number greater than 0.' })
    }
  

    const newProduct = { id: products.length + 1, name, description, price, category, image_url, is_active }
    products.push(newProduct)
  
    return res.status(201).json(newProduct)
})
  

app.get('/products', (req, res) => {
    res.status(200).json(products)
})











  


// orders 

const isValidProduct = (productId, quantity) => {
    return Number.isInteger(productId) && productId > 0 && quantity > 0;
  };
  
  app.post('/orders', (req, res) => {
    const { user_id, products, total_price } = req.body;
  
    if (!user_id || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid input: user_id and products are required' });
    }
  
    for (let product of products) {
      if (!isValidProduct(product.product_id, product.quantity)) {
        return res.status(400).json({ error: 'Invalid product ID or quantity' });
      }
    }
  

    if (typeof total_price !== 'number' || total_price <= 0) {
      return res.status(400).json({ error: 'Invalid total price: must be greater than 0' });
    }
  

    const newOrder = {
      id: orders.length + 1, 
      user_id,
      products,
      total_price,
      status: 'PENDING', 
    }
  

    orders.push(newOrder)
  

    return res.status(201).json(newOrder)
  })
  

  app.get('/orders', (req, res) => {
    return res.status(200).json(orders)
  })

















app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})