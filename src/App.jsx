import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PokemonListPage from "./pages/PokemonListPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import TypeListPage from "./pages/TypeListPage";
import TypeDetailPage from "./pages/TypeDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
      <BrowserRouter>
        <div className="app">
          <Header theme={theme} onToggleTheme={toggleTheme}/>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pokemon" element={<PokemonListPage />} />
              <Route path="/pokemon/:id" element={<PokemonDetailPage />} />

              <Route path="/types" element={<TypeListPage />} />
              <Route path="/types/:name" element={<TypeDetailPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
  );
}

export default App;
