Build an e-commerce demo using the https://dummyjson.com/products API, where the home page uses only GET requests (/products, /products/categories, /products/category/{name}, /products/search?q=, /products/{id}) to display a paginated, filterable, searchable product grid with a detail view, while a separate admin dashboard uses POST, PUT, PATCH, and DELETE (/products/add, /products/{id}) to add, fully edit, quick-edit, and delete products against a local shadow state (since writes don't persist), with optimistic UI updates, rollback on failure, and an activity log of every admin action.

add pagination  so it should displaly 10 products per page

- Build an E-commerce demo
- Home page use get to display the products
- the products should be paginated
- the projects should be filterable
- a searchable product grid with a detailed view
- there should be be a seperate admin dashboard
- the admin dashboard uses POST, PUT, PATCH, AND DELETE
- the admin can add, full edit, quickly-editn and delete products against a local shadow state
- the admin should implement optimistic UI updates, rollback on failure, and an activity log of every admin action