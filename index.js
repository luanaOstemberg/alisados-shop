import app from "./app.js";
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 9000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log('Se levanto el proyecto');
    });
});
