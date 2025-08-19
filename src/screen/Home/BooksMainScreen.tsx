import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import BookHomeScreen from "../BookHomeScreen";

const BooksMainScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/20">
      <HeroSection />
      
      <main className="container-responsive section-padding">
        <div className="animate-fade-in">
          <BookHomeScreen />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BooksMainScreen;
