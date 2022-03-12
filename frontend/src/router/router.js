import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home';
import SignUp from '../views/SignUp';
import Login from '../views/Login';
import PageNotFound from '../views/PageNotFound';
import useAuthStore from '../store/authentication';

const routes = [
  { name: 'Home', path: '/', component: Home },
  { name: 'SignUp', path: '/sign-up', component: SignUp },
  { name: 'Login', path: '/login', component: Login },
  { name: 'PageNotFound', path: '/404', component: PageNotFound },
  { name: 'PageNotFound', path: '/:catchAll(.*)', component: PageNotFound }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

let isAuthenticated = false;
let performedAuth = false;
router.beforeEach(async (to, from) => {
  const auth = useAuthStore();
  if (!performedAuth)
    isAuthenticated = await auth.performServerSideValidation();

  // user must be logged in to access todo list
  if (to.name === 'Home' && !isAuthenticated) return { name: 'Login' };
  // logged in user cannot log in again or sign up
  if ((to.name === 'Login' || to.name === 'SignUp') && isAuthenticated)
    return { name: 'Home' };
});

export default router;
