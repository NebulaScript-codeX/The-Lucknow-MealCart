import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
import Featuredmeals from "../../components/FeaturedMeals/Featuredmeals";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Testimonials from "../../components/Testimonials/Testimonials";
const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Featuredmeals />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
