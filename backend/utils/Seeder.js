const Product = require('../Models/Product');
const dotenv = require('dotenv');
const connectinDatabase = require('../config/database');

const products = require('../data/products.json');

dotenv.config({ path: 'backend/config/config.env' });
connectinDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany({});
        console.log('Products deleted successfully');
        await Product.create(products);
        console.log('Products seeded successfully');
        process.exit();  // End the script to exit the process after successful seeding. 
                         // This prevents the database connection from hanging indefinitely. 
                         // Also, this helps to prevent any unwanted database connection errors. 
                         // This is especially useful in a production environment. 
                         // This is a good practice to use in all your scripts. 
                         // In a development environment, you might want to remove this line. 
                         // Note: This line will not work in a non-JavaScript environment. 
                         // If you want to use this script in a non-JavaScript environment, you should use a different method. 
                         // For example, you can use a shell script to run the seeding script. 
                         // This script would be called manually in the terminal.
        
    } catch (err) { 
        console.error(err);
        process.exit();
    }
}
 
seedProducts();