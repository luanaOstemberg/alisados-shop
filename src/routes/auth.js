import LoginController from "../controller/auth/login.js";
import RegisterController from "../controller/auth/register.js";

export default function authRoutes(app){
    app.post('/register', RegisterController );
    app.post('/login', LoginController)
}