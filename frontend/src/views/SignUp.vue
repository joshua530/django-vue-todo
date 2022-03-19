<template>
  <div class="row ml-4">
    <div class="col l4">
      <SignUpForm />
    </div>
    <div class="col l1"></div>
    <div class="col l7">
      <h4>Testimonials</h4>
      <div class="row ml-2">
        <div v-if="!data">
          <span class="fa fa-spinner fa-pulse fa-2x"></span>
        </div>
        <template v-if="data">
          <div
            v-for="testimonial of data"
            :key="testimonial.id"
            class="testimonial col"
          >
            <div class="header">
              <img
                class="testimonial-image"
                :src="testimonial.avatar"
                :alt="[testimonial.name, '-image']"
              />
            </div>
            <div class="content">
              <h6>{{ testimonial.name }}</h6>
              <p>{{ testimonial.message.slice(0, 68) }}...</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div class="fun-facts ml-4">
    <h5 class="text-underline">Information on setting goals</h5>
    <div class="row">
      <blockquote class="section col m4 my-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
        dolor accusantium nesciunt inventore ex fugit
      </blockquote>
      <blockquote class="section col m4 my-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
        dolor accusantium nesciunt inventore ex fugit
      </blockquote>
      <blockquote class="section col m4 my-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
        dolor accusantium nesciunt inventore ex fugit
      </blockquote>
    </div>
    <div class="row">
      <blockquote class="section col m4 my-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
        dolor accusantium nesciunt inventore ex fugit
      </blockquote>
      <blockquote class="section col m4 my-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
        dolor accusantium nesciunt inventore ex fugit
      </blockquote>
      <blockquote class="section col m4 my-3">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
        dolor accusantium nesciunt inventore ex fugit
      </blockquote>
    </div>
  </div>
</template>

<script>
import useNotifications from '../store/notifications';
import SignUpForm from '../components/SignUpForm';

export default {
  name: 'SignUp',
  components: { SignUpForm },
  setup() {
    return {
      notifier: useNotifications()
    };
  },
  data() {
    return {
      imageApi: process.env.VUE_APP_STATIC_SERVER
    };
  },
  methods: {
    async getTestimonials() {
      const endpoint = 'https://testimonialapi.toolcarton.com/api';
      const httpOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      return fetch(endpoint, httpOptions).then((response) => response.json());
    }
  },
  mounted() {
    this.getTestimonials().then((data) => {
      this.data = data.slice(1, 4);
    });
  },
  data() {
    return {
      data: null
    };
  }
};
</script>
