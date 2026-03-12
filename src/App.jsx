import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import TypeListPage from "./pages/TypeListPage";
import TypeDetailPage from "./pages/TypeDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <div className="app">
            <Header />

            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pokemon" element={<PokemonListPage />} />
                <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                <Route path="/types" element={<TypeListPage />} />
                <Route path="/types/:name" element={<TypeDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
