import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import BookHomeScreen from "../BookHomeScreen";

const BooksMainScreen = () => {
  return (
   <div>
    <HeroSection/>
    <div className="my-10 mx-10">

    <BookHomeScreen />
   </div>
   <Footer />
   </div>
  );
};

export default BooksMainScreen;
