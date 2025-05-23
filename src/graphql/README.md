1. Address Queries:
```graphql
# Get all addresses for the authenticated user (Roles: 0, 1)
query {
  addresses {
    address_ID
    region
    street
    building
    floor
    moreDetails
    customer_ID
  }
}

# Get specific address by ID (Roles: 0, 1)
query {
  address(id: 1) {
    address_ID
    region
    street
    building
    floor
    moreDetails
    customer_ID
  }
}
```

2. Cart Queries:
```graphql
# Get all carts (Role: 0)
query {
  carts {
    cart_ID
    product_ID
    customer_ID
    quantity

  }
}

# Get specific cart by ID (Roles: 0, 1)
query {
  cart(id: 1) {
    cart_ID
    product_ID
    customer_ID
    quantity

  }
}

# Get active carts for authenticated customer (Roles: 0, 1)
query {
  customerCart {
    cart_ID
    product_ID
    customer_ID
    quantity

  }
}
```

3. Customer Queries:
```graphql
# Get all customers (Role: 0)
query {
  customers {
    customer_ID
    customer_FullName
    customer_Email
  }
}

# Get specific customer by ID (Roles: 0, 1)
query {
  customer(id: 1) {
    customer_ID
    customer_FullName
    customer_Email
  }
}
```

4. Customization Queries:
```graphql
# Get all customizations
query {
  customizations {
    customization_ID
    customization_Size
    customization_Color
    product_ID
  }
}

# Get customizations for a specific product
query {
  productCustomizations(productId: 1) {
    customization_ID
    customization_Size
    customization_Color
    product_ID
  }
}

# Get specific customization by ID
query {
  customization(id: 1) {
    customization_ID
    customization_Size
    customization_Color
    product_ID
  }
}
```

5. Order Queries:
```graphql
# Get all orders (Role: 0)
query {
  orders {
    order_ID
    cart_ID
    customer_ID
  }
}

# Get specific order by ID (Roles: 0, 1)
query {
  order(id: 1) {
    order_ID
    cart_ID
    customer_ID
  }
}
```

6. Product Queries:
```graphql
# Get all products
query {
  products {
    product_ID
    product_Name
    product_Description
    product_Price
    product_IMG
  }
}

# Get specific product by ID
query {
  product(id: 1) {
    product_ID
    product_Name
    product_Description
    product_Price
    product_IMG
  }
}
```

Note: 
- You can test these queries in your GraphQL playground, typically available at `http://localhost:3000/graphql`
