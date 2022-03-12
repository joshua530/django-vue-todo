<template>
  <div class="row container">
    <div class="col l5">
      <LoginForm />
    </div>
    <div class="col l2"></div>
    <div class="col l5">
      <div class="quotes-banner">
        <h5 class="text-underline">Quotes</h5>
        <div class="section">
          <blockquote>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam
            perferendis quia nesciunt molestias error recusandae aperiam rerum
            sapiente iure mollitia, similique, atque rem. Alias, veniam?
            Incidunt expedita laborum optio inventore!
          </blockquote>
        </div>
        <div class="section">
          <blockquote>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam
            inventore corporis culpa perspiciatis, voluptas quod error id odit
            quo ipsam, dicta adipisci vero minus. Asperiores ad vitae expedita
            eius ipsum!
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm';

export default {
  name: 'Login',
  components: { LoginForm }
};
</script>
